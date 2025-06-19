import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_EXPIRES_IN,
  TOKEN_SECRET_KEY,
} from '@libs/common/constants/token.constants';
import { UserModule } from '@libs/dao/user/user.module';
import { JwtStrategy } from '@libs/common/security/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      secret: TOKEN_SECRET_KEY,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),

    UserModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
