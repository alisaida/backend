import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import chatroomRoute from './routes/chatrooms.js';
import ***REMOVED*** consumeUsersQueue ***REMOVED*** from './utils/rabbitmq.js';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV;
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI;

const dbConnectionUrl = `mongodb+srv://$***REMOVED***DB_USER***REMOVED***:$***REMOVED***DB_PASSWORD***REMOVED***@$***REMOVED***DB_URI***REMOVED***/$***REMOVED***DB_NAME***REMOVED***?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(express.urlencoded(***REMOVED*** extended: false ***REMOVED***));
app.use(morgan('dev'));

app.use('/', chatroomRoute);

app.use(cors(***REMOVED***
    // allow requests from react 
    origin: ['http://localhost:3000']
***REMOVED***));

app.use(async (req, res, next) => ***REMOVED***
    next(createHttpError.NotFound());
***REMOVED***)

//error handling
app.use((err, req, res, next) => ***REMOVED***
    res.status(err.status || 500);
    res.send(***REMOVED***
        error: ***REMOVED***
            status: err.status || 500,
            message: err.message
        ***REMOVED***
    ***REMOVED***)
***REMOVED***)


mongoose.connect(dbConnectionUrl, ***REMOVED*** useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false ***REMOVED***)
    .then(app.listen(PORT, () => ***REMOVED***
        console.log(`$***REMOVED***SERVICE_NAME***REMOVED***.$***REMOVED***NODE_ENV***REMOVED*** running on http://localhost:$***REMOVED***PORT***REMOVED***`);
        console.log(`database connection successful: $***REMOVED***dbConnectionUrl***REMOVED***`);
        consumeUsersQueue();
    ***REMOVED***))
    .catch((error) => console.log(`$***REMOVED***error***REMOVED*** failed to connect to $***REMOVED***DB_NAME***REMOVED*** database`));