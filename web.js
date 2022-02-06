
require('dotenv').config()

// Socket.io
const socketIO = require('socket.io');
const {IO} = require('./controllers/notification');

// parameters
const config = require('./config');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const path = require('path');
const agenda = require('./jobs/agenda');
const unless = require('unless')

// Import controllers files
const userControllers = require("./controllers/user");
const concoursControllers = require("./controllers/concours");
const authControllers = require("./controllers/auth");
const tasksControllers = require("./controllers/tasks");
const counterControllers = require("./controllers/counter");
const coloniesControllers = require("./controllers/colonies");
const mailControllers = require("./controllers/mail");
const breedingSheetControllers = require("./controllers/breedingSheets");
const notificationsControllers = require("./controllers/notifications");
const diapausesControllers = require("./controllers/diapauses");

const { PORT = 8081 } = process.env
const app = express();

// Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.options('/api/*', function (request, response, next) {
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  response.send();
});
// app.use(cors({origin: 'http://www.fourmislabs.com', optionsSuccessStatus: 200,credentials: true,}));

const mongoUri = process.env.RAW_MONGO_URI.replace('<password>', process.env.MONGO_DB_PASSWORD).replace('myFirstDatabase', process.env.MONGO_DB_NAME)
mongoose
  .connect(
    mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("Succesfully Connected to database!!");
  })
  .catch(() => {
    console.log('Please check if there is nothing wrong with your MONGO URI', mongoUri)
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(jwt({ secret: process.env.JWT_KEY, algorithms: ['HS256']})
.unless({path:
  [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/mail/sendmail'
]}), (req, res, next) => {
  next()
})

// Use controllers
app.use("/api/mail", mailControllers);
app.use("/api/auth", authControllers);
app.use("/api/users", userControllers);
app.use("/api/colonies", coloniesControllers);
app.use("/api/colonies/counter", counterControllers);
app.use("/api/colonies/tasks", tasksControllers);
app.use("/api/breedingsheets", breedingSheetControllers);
app.use("/api/concours", concoursControllers);
app.use("/api/notifications", notificationsControllers);
app.use("/api/diapause", diapausesControllers);


const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});

// Socket Layer over Http Server
const io = socketIO(server, {
  path: '/notification/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

IO(io);


















// io.on("connection", socket => {
//   console.log("Socket: client connected");


//   socket.on('add-sheet', (sheet) => {
//     io.emit('notification-sheet', {
//       message: 'new sheet created',
//       sheet: sheet
//     });
//   });


//   socket.emit('test event', 'here is some data');

//   socket.on("test emit", (arg) => {
//     console.log(arg); 
//   });

//   socket.on('new message', (msg) => {
//     io.to(msg.username).emit('new message');
//   });

//   socket.on('join', function (room) {
//     socket.join(room);
// });
// });

// io.engine.on("connect_error", (err) => {
//   console.log(err.req);	     // the request object
//   console.log(err.code);     // the error code, for example 1
//   console.log(err.message);  // the error message, for example "Session ID unknown"
//   console.log(err.context);  // some additional error context
// });





