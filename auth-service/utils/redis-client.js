import redis from 'redis';

export const redisClient = redis.createClient(***REMOVED***
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
***REMOVED***);

redisClient.on('connect', () => ***REMOVED***
    console.log('client connected');
***REMOVED***)

redisClient.on('ready', (error) => ***REMOVED***
    console.log('client ready');
***REMOVED***)

redisClient.on('error', (error) => ***REMOVED***
    console.log(error.message);
***REMOVED***)

redisClient.on('end', () => ***REMOVED***
    console.log('client disconnected');
***REMOVED***)

export default redisClient;