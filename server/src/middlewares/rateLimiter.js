import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.js";


const createRateLimitMiddleware = (limiter) => {
    return async (req, res, next) => {
        if (process.env.NODE_ENV === "development") {
            return next();
        }
        try {
            await limiter.consume(req.ip);
            next();
        } catch (error) {
            const retryAfter = Math.ceil(
                (error.msBeforeNext || 0) / 1000
            );

            res.set("Retry-After", retryAfter);

            res.status(429).json({
                message: "Too many requests",
                retryAfter,
            });
        }
    };
};


// AUTH RATE LIMIT
export const loginLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "auth:login",
        points: 10,
        duration: 60 * 15,
        blockDuration: 60 * 15,
    })
);

export const registerLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "auth:register",
        points: 5,
        duration: 60 * 60,
        blockDuration: 60 * 30,
    })
);

export const changePasswordLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "auth:change-password",
        points: 3,
        duration: 60 * 60,
        blockDuration: 60 * 30,
    })
);

export const refreshLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "auth:refresh",
        points: 100,
        duration: 60 * 60 * 24,
    })
);

// API RATE LIMIT
export const apiRateLimit = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "api",
        points: 100,
        duration: 60,
    })
);


// EMAIL RATE LIMIT
export const forgotPasswordLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "email:forgot-password",
        points: 3,
        duration: 60 * 60,
        blockDuration: 60 * 60,
    })
);

export const resetPasswordLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "email:reset-password",
        points: 10,
        duration: 60 * 60,
    })
);

export const verifyEmailLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "email:verify",
        points: 20,
        duration: 60 * 60,
    })
);

export const resendVerificationLimiter = createRateLimitMiddleware(
    new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "email:resend-verification",
        points: 3,
        duration: 60 * 60,
        blockDuration: 60 * 30,
    })
);