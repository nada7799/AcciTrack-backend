import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as admin from "firebase-admin";
import { Strategy } from "passport-custom";

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, "firebase") {
    constructor() {
        super(); // No need for secretOrKey
    }

    async validate(req: Request): Promise<any> {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing or invalid token");
        }

        const token = authHeader.split(" ")[1]; // Extract the token
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken; // Attach the decoded user info
        } catch (error) {
            throw new UnauthorizedException("Invalid Firebase token");
        }
    }
}
