import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_SECRET_KEY } from '@libs/common/constants/token.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: TOKEN_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
