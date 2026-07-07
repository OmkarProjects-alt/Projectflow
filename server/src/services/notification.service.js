const pool = require("../config/DbConnection");
const { emitToUser } = require("../socket/emitters");

const fetchNotifications = async (userId, query) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const offset = (page - 1) * limit;

    const notifications = await pool.query(
        `
        SELECT
            n.*,

            sender.uid AS sender_id,
            sender.name AS sender_name,
            sender.user_role AS sender_role,

            receiver.uid AS receiver_id,
            receiver.name AS receiver_name,
            receiver.user_role AS receiver_role

        FROM notifications n

        LEFT JOIN users sender
            ON n.sender_id = sender.uid

        LEFT JOIN users receiver
            ON n.receiver_id = receiver.uid

        WHERE n.receiver_id = $1

        ORDER BY n.created_at DESC

        LIMIT $2
        OFFSET $3
        `,
        [userId, limit, offset]
    );

    const total = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM notifications
        WHERE receiver_id = $1
        `,
        [userId]
    );

    const unread = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM notifications
        WHERE receiver_id = $1
        AND is_read = FALSE
        `,
        [userId]
    );

    return {
        notifications: notifications.rows,

        unreadCount: Number(unread.rows[0].total),

        pagination: {
            page,
            limit,
            total: Number(total.rows[0].total),
            totalPages: Math.ceil(
                Number(total.rows[0].total) / limit
            ),
            hasMore:
                page * limit <
                Number(total.rows[0].total),
        },
    };
};

const markAsRead = async (notificationId, userId) => {

    const result = await pool.query(
        `
        UPDATE notifications

        SET
            is_read = true

        WHERE
            nid=$1
        AND
            receiver_id=$2

        RETURNING *
        `,
        [notificationId, userId]
    );

    return result.rows[0];
};

const markAllAsRead = async (userId) => {

    await pool.query(
        `
        UPDATE notifications

        SET
            is_read=true

        WHERE
            receiver_id=$1
        `,
        [userId]
    );
};

const deleteNotification = async (
    notificationId,
    userId
) => {

    await pool.query(
        `
        DELETE FROM notifications

        WHERE
            nid=$1
        AND
            receiver_id=$2
        `,
        [notificationId, userId]
    );
};

const acceptProjectInvite = async (
    notificationId,
    userId,
    userName
) => {

    console.log("my all data", notificationId, "and", userId, "and", userName)

    const notification = await pool.query(`
        SELECT *
        FROM notifications
        WHERE
            nid=$1
        AND receiver_id=$2
    `,
    [notificationId, userId]);

    if(notification.rows.length===0)
        throw new Error("Notification not found");

    const notify = notification.rows[0];

    const invite = await pool.query(`
        SELECT *
        FROM project_invitations
        WHERE
            project_id=$1
        AND receiver_id=$2
        AND status='accepted'
    `,
    [
        notify.project_id,
        userId
    ]);

    if(invite.rows.length > 0)
        throw new Error(`${userName} already member of current project`);


    await pool.query(`
            INSERT INTO
            project_members
            (
                project_id,
                user_id
            )
            VALUES($1,$2)
            ON CONFLICT DO NOTHING
        `,
        [
            notify.project_id,
            userId
        ]
    );

    await pool.query(`
            INSERT INTO
            project_invitations
            (
                project_id,
                receiver_id,
                sender_id,
                status
            )
            VALUES($1, $2, $3, $4)
        `,
        [
            notify.project_id,
            userId,
            notify.sender_id,
            "accepted"
        ]
    );

    await pool.query(`
        DELETE FROM notifications
        WHERE nid = $1;
    `,
    [notificationId]);

    await pool.query(`
            INSERT INTO
            notifications
                (
                    receiver_id, 
                    sender_id, 
                    type, 
                    title, 
                    message
                )
            VALUES($1, $2, $3, $4, $5)
        `,
        [
            notify.sender_id, 
            userId, 
            "INVITE_ACCEPTED", 
            "Invitation Accepted", 
            `${userName} joined your project.`
        ]
    );


    emitToUser(
        notify.sender_id,
        "notification",
        {
            type:"INVITE_ACCEPTED",
            title:"Invitation Accepted",
            message:`${userName} joined your project.`,
            projectId:notify.project_id
        }
    );

    return notify;
};

const rejectProjectInvite = async (
    notificationId,
    userId,
    userName
)=>{

    const notification = await pool.query(`
        SELECT *
        FROM notifications
        WHERE
            nid=$1
        AND receiver_id=$2
    `,
    [notificationId,userId]);

    if(notification.rows.length===0)
        throw new Error("Notification not found");

    const notify = notification.rows[0]

    await pool.query(`
        UPDATE project_invitations
        SET status='rejected'
        WHERE
            project_id=$1
        AND receiver_id=$2
        AND status='pending'
    `,
    [
        notification.rows[0].project_id,
        userId
    ]);

    await pool.query(`
        DELETE FROM notifications
        WHERE nid = $1;
    `,
    [notificationId]);

    await pool.query(`
            INSERT INTO
            notifications
                (
                    receiver_id, 
                    sender_id, 
                    type, 
                    title, 
                    message
                )
            VALUES($1, $2, $3, $4, $5)
        `,
        [
            notify.sender_id, 
            userId, 
            "INVITE_REJECTED", 
            "Invitation Declined", 
            `${userName} declined your invitation.`
        ]
    );

    emitToUser(
        notify.sender_id,
        "notification",
        {
            type:"invite_rejected",
            title:"Invitation Declined",
            message:`${userName} declined your invitation.`,
            projectId:notify.project_id
        }
    );

};

module.exports = {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    acceptProjectInvite,
    rejectProjectInvite
};