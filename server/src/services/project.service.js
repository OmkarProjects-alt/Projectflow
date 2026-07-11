const pool = require("../config/DbConnection");
const { emitToUser, emitToProject } = require("../socket/emitters");

const inviteMembersService = async (sender, body) => {

    const senderId = sender.senderId;
    const senderName = sender.senderName;

    const { projectId, members } = body;

    if (
        !projectId ||
        !Array.isArray(members) ||
        members.length === 0
    ) {
        throw new Error("Project and members are required.");
    }

    // Check project
    const project = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE pid = $1
        `,
        [projectId]
    );

    if (project.rows.length === 0) {
        throw new Error("Project not found.");
    }

    // Only owner can invite
    if (project.rows[0].created_by !== senderId) {
        throw new Error("Only project owner can invite members.");
    }

    const invitedMembers = [];
    const alreadyMembers = [];
    const invalidUsers = [];

    for (const userId of members) {

        // User exists?
        const user = await pool.query(
            `
            SELECT uid,name,user_role
            FROM users
            WHERE uid=$1
            `,
            [userId]
        );

        if (user.rows.length === 0) {
            invalidUsers.push(userId);
            continue;
        }

        // Already member?
        const member = await pool.query(
            `
            SELECT 1
            FROM project_members
            WHERE project_id=$1
            AND user_id=$2
            `,
            [projectId, userId]
        );

        if (member.rows.length > 0) {
            alreadyMembers.push(user.rows[0]);
            continue;
        }

        // // Add member
        // await pool.query(
        //     `
        //     INSERT INTO project_members
        //     (
        //         project_id,
        //         user_id
        //     )
        //     VALUES ($1,$2)
        //     `,
        //     [projectId, userId]
        // );

        invitedMembers.push(user.rows[0]);

        // Activity
        const activity = await pool.query(
            `
            INSERT INTO activities
            (
                project_id,
                user_id,
                type,
                title,
                message
            )
            VALUES
            (
                $1,
                $2,
                'MEMBER_ADDED',
                'New Member',
                $3
            )
            RETURNING *
            `,
            [
                projectId,
                senderId,
                `${senderName} Invited ${user.rows[0].name} to the project`
            ]
        );

        const notification = await pool.query(
            `
            INSERT INTO notifications
            (
                sender_id,
                receiver_id,
                project_id,
                type,
                title,
                message
            )
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *
            `,
            [
                senderId,
                userId,
                projectId,
                "PROJECT_INVITE",
                "Project Invitation",
                `${senderName} invited you to "${project.rows[0].title}"`
            ]
        );

        emitToProject(
            projectId,
            "activity",
            activity.rows[0]
        );

        emitToUser(
            userId,
            "notification",
            {
                id: crypto.randomUUID(),
                nid: notification.rows[0].nid,
                type: "PROJECT_INVITE",
                title: "Project Invitation",
                message: `${senderName} invited you to join "${project.rows[0].title}"`,
                projectId,
                projectTitle: project.rows[0].title,
                senderId,
                senderName,
                created_at: new Date(),
                isRead: false,
            }
        );
    }

    return {
        invitedMembers,
        alreadyMembers,
        invalidUsers,
    };
};



const removeMemberService = async (
    sender,
    body
) => {

    const senderId = sender.senderId;
    const senderName = sender.senderName;

    const {
        projectId,
        memberId,
    } = body;

    if (
        !projectId ||
        !memberId
    ) {
        throw new Error("Missing fields.");
    }

    const project = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE pid=$1
        `,
        [projectId]
    );

    if (
        project.rows.length === 0
    ) {
        throw new Error("Project not found.");
    }

    if (
        project.rows[0].created_by !== senderId
    ) {
        throw new Error(
            "Only owner can remove members."
        );
    }

    if (
        memberId === senderId
    ) {
        throw new Error(
            "Project owner cannot remove himself."
        );
    }
    
    const member = await pool.query(
        `
        SELECT
            u.uid,
            u.name,
            u.user_role
        FROM project_members pm

        JOIN users u
        ON pm.user_id=u.uid

        WHERE
        pm.project_id=$1
        AND
        pm.user_id=$2
        `,
        [
            projectId,
            memberId
        ]
    );

    if (
        member.rows.length === 0
    ) {
        throw new Error(
            "User is not a project member."
        );
    }

    await pool.query(
        `
        DELETE
        FROM project_members

        WHERE
        project_id=$1
        AND
        user_id=$2
        `,
        [
            projectId,
            memberId
        ]
    );

    await pool.query(`
            DELETE
            FROM project_invitations
            
            WHERE
                project_id = $1
            AND receiver_id = $2
        `,
        [
            projectId,
            memberId
        ]
    );

    const activity =
        await pool.query(
            `
            INSERT INTO activities
            (
                project_id,
                user_id,
                type,
                title,
                message
            )

            VALUES
            (
                $1,
                $2,
                'MEMBER_REMOVED',
                'Member Removed',
                $3
            )

            RETURNING *
            `,
            [
                projectId,
                senderId,
                `${senderName} removed ${member.rows[0].name}`
            ]
        );

    const notification =
        await pool.query(
            `
            INSERT INTO notifications
            (
                receiver_id,
                sender_id,
                project_id,
                type,
                title,
                message
            )

            VALUES
            (
                $1,
                $2,
                $3,
                'member_removed',
                'Removed from Project',
                $4
            )

            RETURNING *
            `,
            [
                memberId,
                senderId,
                projectId,
                `${senderName} removed you from "${project.rows[0].title}"`
            ]
        );

    emitToUser(
        memberId,
        "notification",
        notification.rows[0]
    );

    emitToProject(
        projectId,
        "activity",
        activity.rows[0]
    );

    emitToProject(
        projectId,
        "project:member_removed",
        {
            projectId,
            memberId,
        }
    );

    return {
        message: "Member removed successfully.",
        removedUser: member.rows[0],
    };
};


const fetchUserAssignedProjects = async (userId) => {

    return await pool.query(
        `
        SELECT
            p.pid,
            p.title,
            p.description,
            p.status,
            p.start_date,
            p.deadline,
            p.created_by,
            p.created_at
        FROM project_members pm

        JOIN projects p
        ON pm.project_id = p.pid

        WHERE pm.user_id = $1
            AND p.created_by != $1

        ORDER BY p.created_at DESC
        `,
        [userId]
    );
}

const fetchAssignedProjectDetail = async (projectId, userId) => {
    const project = await pool.query(
        `
        SELECT
            json_build_object(
                'pid', p.pid,
                'title', p.title,
                'description', p.description,
                'status', p.status,
                'start_date', p.start_date,
                'deadline', p.deadline,
                'created_by', p.created_by,
                'created_at', p.created_at,
                
                'tasks', COALESCE(
                    json_agg(
                        json_build_object(
                            'tid', t.tid,
                            'title', t.title,
                            'description', t.description,
                            'status', t.status,

                            'assigned_user_name', u.name,
                            'assigned_user_id', u.uid,
                            'assigned_user_role', u.user_role,

                            'assigned_by_id', t.assigned_by,
                            'assigned_by_name', assigned_by.name,

                            'project_id', t.project_id,

                            'created_at', t.created_at
                        )
                    ) FILTER (WHERE t.tid IS NOT NULL),

                    '[]'::json
                ) 
            ) AS project

        FROM project_members pm
        JOIN projects p
            ON pm.project_id = p.pid

        LEFT JOIN tasks t
            ON p.pid = t.project_id

        LEFT JOIN users u
            ON t.assigned_to = u.uid
        
        LEFT JOIN users assigned_by
            ON t.assigned_by = assigned_by.uid
        

        WHERE 
            p.pid = $1 
        AND 
            pm.user_id = $2

        GROUP BY
            p.pid,
            p.title,
            p.description,
            p.status,
            p.start_date,
            p.deadline,
            p.created_by,
            p.created_at;
        `,
        [projectId, userId]
    );

    return project.rows[0];
};

module.exports = {
    inviteMembersService,
    removeMemberService,
    fetchUserAssignedProjects,
    fetchAssignedProjectDetail,
};