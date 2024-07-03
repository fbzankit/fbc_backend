const express = require("express");
// const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const cors = require("cors");
var nodemailer = require('nodemailer');
var fs = require('fs');
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ extended: true }));
// app.use(express.static(__dirname + '../uploads'));
// return console.log(__dirname+ '/app/uploads/user/badge-icon.svg');
app.use('/images', express.static(__dirname+ '/app/uploads'));


//database
const db = require("./app/models");
const Role = db.role;

//db.sequelize.sync();
// force: true will drop the table is if already exists
db.sequelize.sync({ force: false }).then(() => {
  console.log('Drop and Resync Db');
  // initial();
});


// simple route
app.get("/", (req, res) => {
  // res.sendFile(__dirname + '/app/index.html');
  res.json({ message: "Welcome to Ankit's application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/category.routes')(app);
require('./app/routes/service.routes')(app);
require('./app/routes/emailTemplates.routes')(app);
require('./app/routes/notifications.routes')(app);
require('./app/routes/chat.routes')(app);
require('./app/routes/emailTemplates.routes')(app);
require('./app/routes/business.routes')(app);
require('./app/routes/publicServent.routes')(app);
require('./app/routes/department.routes')(app);

// Socket setup end

// set port, listen for requests
const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // console.log(`Listening on port ${PORT}`);
  // console.log(`http://localhost:${PORT}`);
});

const options = { 
  cors: {
    origin: "https://liberate.avniksofttech.com",
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS','PATCH'],
    credentials: true
  }, 
  // origin: `http://localhost:${PORT}`, 
  allowEIO3: true // false by default 
};
const httpServer = require("https").createServer({
  // key: fs.readFileSync('cert/meet.avnik.com.key'),
  //   cert: fs.readFileSync('cert/meet.avnik.com.crt')
});
const io = new Server(server, options);
io.attach(httpServer);
app.set("io", io);
app.use(express.static("public"));

app.use(function(req, res, next) {
  req.io = io;
  next();
});
let onlineUsers = [];
let onlineRooms = [];
const addNewRoom = (roomId, socketId) => {
  !onlineRooms.some((rooms) => rooms.roomId === roomId) &&
  onlineRooms.push({ roomId, socketId });
};
const removeRoom = (socketId) => {
  onlineRooms = onlineRooms.filter((rooms) => rooms.socketId !== socketId);
};
const getRoom = (roomId) => {
  return onlineRooms.find((rooms) => rooms.roomId === roomId);
};
const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId == userId);
};

io.on("connection", (socket) => {
  // notifications users
  socket.on("newUser", (userId) => {
    const receiver = getUser(userId);
    addNewUser(userId, socket.id);
    // io.to(receiver.socketId).emit('getOnlineUsers',onlineUsers)
  });
  
  socket.on("sendNotification", (data) => {
    const receiver = getUser(data.notifiable_id);
    // io.to(receiver.socketId).emit("getNotification", data);
  });

  // Chat rooms
  socket.on("newRoom", (roomId) => {
    const receiverRoom = getRoom(roomId);
    addNewRoom(roomId, socket.id);
    // io.to(receiverRoom.socketId).emit('getOnlineRooms',onlineRooms)
  });
  socket.on("sendMessage", (data) => {
    const receiver = getRoom(data.group_id);
    // io.to(socket.id).emit("getMessage", data);
    io.emit("getMessage", data);
  });
// console.log(onlineRooms)
  socket.on("disconnect", () => {
    removeUser(socket.id);
    removeRoom(socket.id);
    console.log('disconnect')
  });
});
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "owner"
  });

  Role.create({
    id: 3,
    name: "admin"
  });

  Role.create({
    id: 4,
    name: "public_servant"
  });

  Role.create({
    id: 5,
    name: "sub_admin"
  });

  // ["user", "admin", "owner", "public_servant", "sub_admin"];
}

// initial();

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
     auth: {
          user: 'ankit.enacteservices@gmail.com',
          pass: 'Ankit@123',
       },
  secure: true,
  });