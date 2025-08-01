import { IsEmail, IsString } from 'class-validator';

export class Email {
    @IsEmail()
    @IsString()
    private readonly value: string;

    constructor(email: string) {
        this.value = email;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return other instanceof Email && this.value === other.value;
    }
}