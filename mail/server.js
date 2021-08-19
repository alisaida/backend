import express from 'express';
import dotenv from 'dotenv';

import ***REMOVED*** listenToEmailQueue ***REMOVED*** from './utils/rabbitmq.js';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app = express();


app.listen(PORT, () => ***REMOVED***
    console.log(`$***REMOVED***NODE_ENV***REMOVED*** running on http://localhost:$***REMOVED***PORT***REMOVED***`);
    listenToEmailQueue();
***REMOVED***)