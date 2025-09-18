import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // IMPORTANT: Use environment variable in production
    });
  }

  async validate(payload: any) {
    // The payload is the decoded JWT.
    // The object returned here will be attached to the request object as request.user
    return { userId: payload.sub, email: payload.email, role: payload.role, fullName: payload.fullName };
  }
}
