/* -----------------------------------------------------------------------
   * @ description : This file defines socket handlers.
----------------------------------------------------------------------- */

import SocketIO from 'socket.io';
// import _ from 'underscore';
import Messages from '../../utilities/events';
// import eventEmitter from '../../utilities/events';
// import logger from '../../utilities/logger';
// import * as socketHandler from './handler';

const Socket = {
  register: (server, options, next) => {
    // Opening the socket connection

    let io = SocketIO(server.select('socket').listener),
      users = {},
      sockets = {};

    io.on('connection', socket => {
      let socketId = socket.id;

      /** ******** on authenticate event registering user's socket id in user object and currently running instance *******/
      socket.on('authenticate', (query, callback) => {
        // let request = {
        //     token: query['x-logintoken']
        // };
        let userId = 'user._id';
        // Socket local object instance contains user ids corresponding to socket ids
        sockets[socketId] = { userId };
        // User local object instance contains socket ids corresponding to user ids and sorties
        users[userId] = { socketId };

        callback(null, Messages.userAuthenticated);
      });

      /** *** on Disconnect event delete the current user socket id from user's object and delete the user's key/Value pair from the socket object *****/
      socket.on('disconnect', () => {
        if (sockets[socketId]) {
          delete users[sockets[socketId].userId];
          delete sockets[socketId];
          socket.disconnect('Disconnected');
        } else {
          socket.disconnect(Messages.tokenExpired);
        }
      });
    });

    // event handler which will happen in other part of the app
    // eventEmitter.on('someevent', function(data) {
    //     // Data Handler
    // });

    next();
  }
};

Socket.register.attributes = {
  name: 'Socket'
};

export default Socket;
