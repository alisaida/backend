import express from 'express';
import dotenv from 'dotenv';

import { listenToEmailQueue } from './utils/rabbitmq.js';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV;
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = process.env.PORT;

const app = express();


app.listen(PORT, () => {
    console.log(`${SERVICE_NAME}.${NODE_ENV} running on http://localhost:${PORT}`);
    listenToEmailQueue();
})