require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const http = require("http");
const { Server } = require('socket.io');
const { setIo } = require('./src/socket/socketInstance');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const authRoute = require('./src/routes/authRoutes');
const projectRoute = require('./src/routes/projectRoutes');
const taskRoute = require('./src/routes/taskRoutes');
const userRoute = require('./src/routes/userRoute');
const activities = require("./src/routes/activity.route");
const notificationRoute = require("./src/routes/notification.routes");


const server = http.createServer(app);

app.use(helmet());

const allowedOrigins = [
  "https://projectflow-ecxyta7gd-omkars-projects-998b71af.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  allowEIO3: true,
});

setIo(io);

require('./src/socket/index')(io);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/taskflow/auth', authRoute);
app.use('/taskflow/project', projectRoute);
app.use('/taskflow/task', taskRoute);
app.use('/taskflow/users', userRoute);
app.use('/taskflow/activities', activities);

app.use(
    "/taskflow/notification",
    notificationRoute
);

app.use(errorMiddleware);
server.listen(process.env.PORT, () => {
    console.log("Server is running on port http://localhost:4000")
})