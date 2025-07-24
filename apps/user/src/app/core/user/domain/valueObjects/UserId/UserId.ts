export class UserId {
    private readonly value: string;

    constructor(value: string) {
        if (!value || typeof value !== 'string') {
            throw new Error('UserId must be a non-empty string');
        }
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: UserId): boolean {
        return other instanceof UserId && this.value === other.value;
    }
}