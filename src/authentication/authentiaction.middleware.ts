import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { CustomRequest } from 'src/interface/custom-request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.['auth_token'];;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.user = decodedUser; // Attach user to request
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
