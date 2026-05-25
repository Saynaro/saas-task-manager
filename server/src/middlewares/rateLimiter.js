import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.js";


//  Rate limiting config for 100 requests per minute per IP
// for Auth routes
const authLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'auth',
    points: 100,
    duration: 60 * 15, // 5 attempts per 15 minutes
    blockDuration: 60, // Block for 15 mins after 5 attempts
});


// for API routes
const apiLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'api',
    points: 100,
    duration: 60, // 100 requests per minute
});

export const authRateLimit = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development') return next();
    try {
        const identifier = req.ip;
        await authLimiter.consume(identifier);
        next();
    } catch (error) {
        const remainingTime = error.msBeforeNext
            ? Math.ceil(error.msBeforeNext / 1000)
            : 15
        res.status(429).json({
            message: `Too many requests, please try again in ${remainingTime} minutes.`,
            remainingTime
        });
    }
};


export const apiRateLimit = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development') return next();
    try {
        const identifier = req.ip;
        await apiLimiter.consume(identifier);
        next();
    } catch (error) {
        const remainingTime = error.msBeforeNext
            ? Math.ceil(error.msBeforeNext / 1000)
            : 60
        res.status(429).json({
            message: `Too many requests, please try again in ${remainingTime} seconds.`,
            remainingTime
        });
    }
};
