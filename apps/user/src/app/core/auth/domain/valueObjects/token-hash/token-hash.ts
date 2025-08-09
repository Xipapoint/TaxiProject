import bcrypt from 'bcrypt'

export class TokenHash {
  private constructor(private readonly value: string) {}

  static async create(rawToken: string): Promise<TokenHash> {
    if (!rawToken) {
      throw new Error('Token must not be empty');
    }
    const hash = await bcrypt.hash(rawToken, 10);
    return new TokenHash(hash);
  }

  static fromHashed(hashedToken: string): TokenHash {
    if (!hashedToken) {
      throw new Error('Hashed token must not be empty');
    }
    return new TokenHash(hashedToken);
  }

  getValue(): string {
    return this.value;
  }

  async matches(rawToken: string): Promise<boolean> {
    return bcrypt.compare(rawToken, this.value);
  }

  equals(other: TokenHash): boolean {
    return other instanceof TokenHash && this.value === other.value;
  }
}
