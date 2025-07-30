export class UserId {
    private readonly value: string;

    constructor(id?: string) {
        this.value = id ?? crypto.randomUUID().split('-').join('');
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: UserId): boolean {
        return other instanceof UserId && this.value === other.value;
    }
}