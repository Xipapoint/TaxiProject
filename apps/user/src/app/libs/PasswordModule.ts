import { Module } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { pbkdf2Sync } from 'crypto';

export interface PasswordGenerator {
  generateKey: (secret: string) => Promise<string>;
}

class PasswordGeneratorImplement implements PasswordGenerator {
  async generateKey(secret: string) {
    return await bcrypt.hash(secret, 10)
  }
}

export const PASSWORD_GENERATOR = 'PasswordGenerator';

@Module({
  providers: [
    {
      provide: PASSWORD_GENERATOR,
      useClass: PasswordGeneratorImplement,
    },
  ],
  exports: [PASSWORD_GENERATOR],
})
export class PasswordModule {}