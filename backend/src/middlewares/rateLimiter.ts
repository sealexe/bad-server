import { NextFunction, Request, Response } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import {
    RATE_LIMIT_BLOCK,
    RATE_LIMIT_DURATION,
    RATE_LIMIT_POINTS,
} from '../config'
import TooManyRequestsError from '../errors/too-many-requests-error'

const rateLimiter = new RateLimiterMemory({
    points: RATE_LIMIT_POINTS,
    duration: RATE_LIMIT_DURATION,
    blockDuration: RATE_LIMIT_BLOCK,
})

const rateLimiterMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    rateLimiter
        .consume(req.ip || req.socket.remoteAddress || 'unknown')
        .then(() => next())
        .catch(() =>
            next(
                new TooManyRequestsError(
                    'Слишком много запросов, попробуйте позже'
                )
            )
        )
}

export default rateLimiterMiddleware
