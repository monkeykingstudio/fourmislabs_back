const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const Notification = require('../models/notification');

const rooms = ['admin','global'];

//// SAVE MONGODB NOTIFICATIONS FUNCTIONS

  // --> BreedingSheets
  const breedingSheetValidationAdmin = (createdSheet, socketRef) => {
    const newNotification = new Notification({
      senderId: createdSheet?.creator,
      senderPseudo: createdSheet?.creatorPseudo,
      message: `a breedsheet for species '${createdSheet?.species}' have been created by ${createdSheet?.creatorPseudo}`,
      created_at: Date.now(),
      type: 'admin',
      subType: 'breedsheet',
      url: `/breedsheetviewer/${createdSheet?.species}`,
      socketRef: socketRef
    });
    newNotification.save();
  }
  const breedingSheetUpdate = (species, dataNotification, field) => {
    const newNotification = new Notification({
      senderId: dataNotification?.senderId,
      senderPseudo: dataNotification?.senderPseudo,
      message: `the '${species}' sheet have been updated by ${dataNotification?.senderPseudo} on field '${field}'`,
      created_at: Date.now(),
      type: 'admin',
      subType: 'breedsheet',
      url: `/breedsheetviewer/${dataNotification?.senderPseudo}`,
      socketRef: dataNotification.socketRef
    });
    newNotification.save();
  }
  const breedingSheetDelete = async(reciever, species, userNotif, adminNotif) => {

    const userNotification = new Notification({
      senderId: userNotif?.senderId,
      senderPseudo: userNotif?.senderPseudo,
      recieverId: reciever,
      message: `your breedsheet '${species}' have been deleted by ${userNotif?.senderPseudo}`,
      created_at: Date.now(),
      type: 'private',
      subType: 'breedsheet',
      socketRef: userNotif.socketRef
    });
    await userNotification.save();

    const adminNotification = new Notification({
      senderId: adminNotif?.senderId,
      senderPseudo: adminNotif?.senderPseudo,
      message: `the breedsheet '${species}' have been deleted by ${adminNotif?.senderPseudo}`,
      created_at: Date.now(),
      type: 'admin',
      subType: 'breedsheet',
      socketRef: adminNotif.socketRef
    });
    await adminNotification.save();
  }
  const breedingSheetApproved = async (reciever, species, userNotif, adminNotif) => {
    const userNotification = new Notification({
      senderId: userNotif?.senderId,
      senderPseudo: userNotif?.senderPseudo,
      recieverId: reciever,
      message: `your breedsheet '${species}' have been approved by ${userNotif?.senderPseudo}`,
      created_at: Date.now(),
      type: 'private',
      subType: 'breedsheet',
      socketRef: userNotif.socketRef
    });
    await userNotification.save();

    const adminNotification = new Notification({
      senderId: adminNotif?.senderId,
      senderPseudo: adminNotif?.senderPseudo,
      message: `your breedsheet '${species}' have been approved by ${adminNotif?.senderPseudo}. Thank you!`,
      created_at: Date.now(),
      type: 'admin',
      subType: 'breedsheet',
      socketRef: adminNotif.socketRef
    });
    await adminNotification.save();
  }

  // --> Diapauses
  const diapauseCreatedAdmin = async(createdDiapause, socketRef) => {
    console.log('socket ref diapause: ', socketRef);
    const newNotification = new Notification({
      senderId: createdDiapause?.creatorId,
      senderPseudo: createdDiapause?.creatorPseudo,
      message: `a diapause for species ${createdDiapause.species} have been created by ${createdDiapause?.creatorPseudo}`,
      created_at: Date.now(),
      type: 'admin',
      subType: 'diapause',
      // url: `/${createdDiapause.c}/${dataNotification?.senderPseudo}`,
      socketRef: socketRef
    });
    await newNotification.save();
  }
  const diapauseEndedUser = async(endedDiapause, recieverId) => {
    console.log('try sending ended notif: ');
    const newNotification = new Notification({
      senderId: '007',
      senderPseudo: 'fourmislabs bot',
      recieverId: recieverId,
      message: `a diapause for species ${endedDiapause?.species} has come to an end at:  ${ new Date(endedDiapause?.period.endDate).toLocaleDateString("fr")}`,
      created_at: Date.now(),
      type: 'private',
      subType: 'diapause',
      url: `/${endedDiapause.species.toLowerCase()}/${endedDiapause?.colonyId}`,
      socketRef: `${endedDiapause?.socketRef}end`
    });
    await newNotification.save();
  }


// CONFIGURE SOCKET.IO
const IO = (io) => {
  io.on('connection', (socket) => {
    socket.on('connected', (msg) => {
      console.log('message: ' + msg);
      const count = io.engine.clientsCount;
      const count2 = io.of("/").sockets.size;
      console.log('currently connected socket clients', count, 'sockets size', count2);
      console.log('socket connected from server -->', 'SocketID:', socket.id);
    });

    // We are listening for users to join
    socket.on('joinNotifications', (params, cb) => {
      console.log('USER ROLE JOINED IS', params.senderRole);
      if(params.senderRole === 'admin') {
        socket.join(rooms[0]);
        socket.join(rooms[1]);
      }
      else if(params.senderRole === 'user') {
        socket.join(rooms[1]);
      }
      socket.join(params.sender)
      cb(
        console.log('user', params.sender, 'joined socket', socket.id)
      );
    });

    socket.on('sendNotification', (data, params) => {

      //// Notification de type ADMIN
      if(data.type === 'admin') {
        socket.broadcast.to(rooms[0]).emit('recieveNotifications', data);
      }

      //// Notification de type GLOBAL
      else if(data.type === 'global') {
        socket.broadcast.to(rooms[1]).emit('recieveNotifications', data)
      }

       // Notification de type PRIVATE
      else if(data.type === 'private') {
        io.to(data.recieverId).emit('recieveNotifications', data)
      }
    });

    socket.on('deleteNotification', (data, params) => {
      console.log('delete notification');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected from socket', socket.id);
    });
  });
}

module.exports = {
  IO,
  breedingSheetValidationAdmin,
  breedingSheetUpdate,
  breedingSheetDelete,
  breedingSheetApproved,
  diapauseCreatedAdmin,
  diapauseEndedUser
}
