-- Active: 1781184198373@@localhost@5433@taskflow

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE users(
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_verified BOOLEAN DEFAULT false NOT NULL,
    otp VARCHAR(6),
    otp_expires_at TIMESTAMP,
    skills TEXT,
    about TEXT,
    location VARCHAR(100),
    user_role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects(
    pid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_creator
        FOREIGN KEY (created_by)
        REFERENCES users(uid)
        ON DELETE CASCADE
);

DROP TABLE projects;

CREATE TABLE tasks(
    tid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID,
    assigned_by UUID,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(20) DEFAULT 'Todo',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(pid)
        ON DELETE CASCADE,

    CONSTRAINT fk_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(uid)
        ON DELETE SET NULL,

    CONSTRAINT fk_assigned_by
        FOREIGN KEY (assigned_by)
        REFERENCES users(uid)
        ON DELETE SET NULL
);



CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,
    user_id UUID NOT NULL,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pm_project
        FOREIGN KEY (project_id)
        REFERENCES projects(pid)
        ON DELETE CASCADE,

    CONSTRAINT fk_pm_user
        FOREIGN KEY (user_id)
        REFERENCES users(uid)
        ON DELETE CASCADE,

    CONSTRAINT unique_project_member
        UNIQUE(project_id, user_id)
);


CREATE TABLE activities (
    aid UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,
    task_id UUID,

    user_id UUID NOT NULL,

    type VARCHAR(50) NOT NULL,

    title VARCHAR(100),
    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(pid)
        ON DELETE CASCADE,

    FOREIGN KEY (task_id)
        REFERENCES tasks(tid)
        ON DELETE SET NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(uid)
        ON DELETE CASCADE
);


CREATE TABLE project_invitations (
    iid UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,

    status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_invite_project
        FOREIGN KEY (project_id)
        REFERENCES projects(pid)
        ON DELETE CASCADE,

    CONSTRAINT fk_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(uid)
        ON DELETE CASCADE,

    CONSTRAINT fk_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES users(uid)
        ON DELETE CASCADE
);


CREATE TABLE notifications (
    nid UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    receiver_id UUID NOT NULL,
    sender_id UUID,

    project_id UUID,
    task_id UUID,

    type VARCHAR(50) NOT NULL,

    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES users(uid)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(uid)
        ON DELETE SET NULL,

    CONSTRAINT fk_notification_project
        FOREIGN KEY (project_id)
        REFERENCES projects(pid)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(tid)
        ON DELETE CASCADE
);


ALTER TABLE tasks
ADD COLUMN assigned_by UUID REFERENCES users(uid);

-- ALTER TABLE tasks
-- RENAME COLUMN pid to tid;
ALTER Table projects
RENAME COLUMN startdate to start_date;

SELECT * FROM notifications;

SELECT * FROM users 
WHERE uid = 'acc7f531-7f74-426e-b229-2378f3e79794';

ALTER TABLE projects
ADD CONSTRAINT fk_project_creator
Foreign Key (created_by) REFERENCES users(uid)
ON DELETE CASCADE;


ALTER TABLE tasks
ADD CONSTRAINT fk_task_assignee
FOREIGN KEY (assigned_to)
REFERENCES users(uid)
ON DELETE SET NULL;


ALTER TABLE projects
ADD CONSTRAINT unique_user_project_title
UNIQUE (created_by, project_name);

SELECT * FROM projects;

DROP TABLE project_invitations;
DROP TABLE notifications;
DROP TABLE project_invitations;
DROP TABLE project_invitations;
DROP TABLE project_invitations;

UPDATE tasks SET status = Review WHERE status = review;

SELECT * FROM tasks;

UPDATE users 
SET role = 'admin'
WHERE uid = 1; 

alter TABLE users
add column  skills text;

DELETE FROM users WHERE uid = 3;



SELECT * FROM tasks;
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM  project_members;
SELECT * FROM tasks;
SELECT * FROM tasks;
SELECT * FROM tasks;

ALTER TABLE users
ALTER COLUMN name SET NOT NULL;




-- tasks indexess

CREATE INDEX idx_tasks_project_id
ON tasks(project_id);

CREATE INDEX idx_tasks_assigned_to
ON tasks(assigned_to);

CREATE INDEX idx_tasks_created_at
ON tasks(created_at DESC);

CREATE INDEX idx_tasks_project_created
ON tasks(project_id, created_at DESC);

CREATE INDEX idx_tasks_project_status
ON tasks(project_id, status);

CREATE INDEX idx_tasks_assigned_created
ON tasks(assigned_to, created_at DESC);

CREATE INDEX idx_project_members_project_user
ON project_members(project_id, user_id);

CREATE INDEX idx_activities_project
ON activities(project_id);

CREATE INDEX idx_notifications_receiver
ON notifications(receiver_id);


INSERT INTO users (name, email, password, is_verified) VALUES
('Harshad Gaikwad', 'harshad@gmail.com', '$2b$10$8K1mVqJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', true);


UPDATE users
SET password = '$2b$10$.IsbbQPL.uOixiO89IXWTuI.NOJTHqCwb7bo\A6\hX9GHZtAKoUGS'
WHERE password = '$2b$10$8K1mVqJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K';



