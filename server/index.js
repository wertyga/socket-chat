import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.dev.config';
import socketIo from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import jwtDecode from 'jwt-decode';
import cookieParser from 'cookie-parser';

import Client from './models/CLient';
import Message from './models/Message';

import jwt from 'jsonwebtoken';
import checkToken from './middlewares/checkToken';
import findUsersMessages from './common/findUsersMessages';

import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

let app = express();
let compiler = webpack(webpackConfig);
let port = 3000;
let server = http.createServer(app);
let io = socketIo(server);

mongoose.connect('mongodb://localhost/socketTest');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => console.log('Success to connect to MongoDB'));

app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

export let passwordJwt = 'jwt';

async function newUser(req, res) {
    let client = await new Client().save();
    await new Message({user: client._id}).save();
    let token = await jwt.sign({
        id: client._id
    }, passwordJwt);
    res.json({
        id: client._id,
        token
    });
};

app.post('/enter-client', checkToken, async (req, res) => {
    let id = await req.body.id;
    let client;
    let messages;

    if(!id) {
       newUser(req, res);
    } else {
        try {
            client = await Client.findOne({_id: id});
            messages = await Message.findOne({user: id});
            res.json({
                id: client._id,
                messages: messages.messages
            });
        } catch(e) {
            newUser(req, res);
            //res.status(400).json({ error: 'Can\'t find User' })
        };

    }
});


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

server.listen(port, () => console.log(`Server run on ${port} port`));

const namespace = io.of('/chat');

namespace.on('connection', socket => {
    socket.on('new-client-connect', client => {
        let room = `chat_${client.id}`;
        socket.join(room);
        socket.broadcast.emit('new-client-connect', client)
    });

    socket.on('new-client-chat', client => {
        let room = `chat_${client.id}`;
        socket.join(room);
    });

    socket.on('message', async message => {
        let room = `chat_${message.id}`;
        try {
            let messages = await Message.findOne({user: message.id});
            message = await {
                name: message.name,
                message: message.message,
                date: message.date
            };
            messages.messages = await [...messages.messages, message];
            messages.save();
        } catch(e) {
            throw { error: 'Can\'t save message' }
        };
        socket.to(room).emit('message', message);
    });

    socket.on('manager-connected', manager => {
        socket.broadcast.emit('manager-connected', manager)
    });

    socket.on('manager-message', async message => {
        try {
            let messages = await Message.findOne({ user:  message.id});
            let newMessage = await {
                name: message.name,
                message: message.message,
                date: message.date
            };
            messages.messages = await [...messages.messages, newMessage];
            messages.save();
        } catch(e) {
            throw { error: 'Can\'t save message' }
        };
        let room = await `chat_${message.id}`;
        socket.to(room).emit('manager-message', message);
    });

    socket.on('leave-client', client => {
        console.log('leave-client')
        let room = `chat_${client.id}`;
        socket.leave(room);
        socket.broadcast.emit('leave-client', client)
    });

    socket.on('appear-client', client => {
        console.log(client)
        socket.broadcast.emit('appear-client', client);
    });
});




