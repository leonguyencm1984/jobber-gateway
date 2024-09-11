
import { config } from '@gateway/config';
import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@leonguyencm1984/jobber-shared';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class AuthService {
    public verifyUser(req: Request, res: Response, next: NextFunction): void {
        if(!req.session?.jwt) {
            throw new NotAuthorizedError('Token is not available. Please login again', 'Gateway Service verifyUser() method error');
        }

        try {
           const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
            req.currentUser = payload;
        } catch (error) {
            throw new NotAuthorizedError('Token is not available. Please login again', 'Gateway Service verifyUser() method invalid session');
        }
        next();
    }

    public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
        if(!req.currentUser) {
            throw new BadRequestError('Authentication is required access to this route.', 'Gateway Service verifyUser() method error');
        }
        next();
    }
}

export const authMiddleware: AuthService = new AuthService();