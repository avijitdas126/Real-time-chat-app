import express from 'express'
import { Server } from "socket.io";
import { createServer } from 'http'
import cros from 'cors'
import router from './route'
import { ClientToServer, ServerToClient } from '../../type';
import SocketExcetion from './socket/start';
import mongoose from 'mongoose';
import { MONGO_URL } from './export';
import { clerkMiddleware } from "@clerk/express";

const app = express()
const httpServer = createServer(app);

//Middleware
app.use(cros());
app.use(express.json());
app.use('/v1', router);
app.use(clerkMiddleware())
const io = new Server<ClientToServer, ServerToClient>(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

SocketExcetion(io);
/**
 * Connection of mongoose
 */
mongoose.Promise = Promise;

mongoose.connect(MONGO_URL).then(()=>{
    console.log('Database connected successfully')
})

mongoose.connection.on('error', (e: Error) => {

    console.log("Error in database: " + e)

})

httpServer.listen(8000, () => {

    console.log('Running at http://localhost:8000')

})