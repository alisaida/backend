import redis from 'redis';

export const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.on('connect', () => {
    console.log('client connected');
})

redisClient.on('ready', (error) => {
    console.log('client ready');
})

redisClient.on('error', (error) => {
    console.log(error.message);
})

redisClient.on('end', () => {
    console.log('client disconnected');
})

export default redisClient;