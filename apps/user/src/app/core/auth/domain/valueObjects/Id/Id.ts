export class Id {
    private readonly value: string;

    constructor(id?: string) {
        this.value = id ?? crypto.randomUUID().split('-').join('');
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Id): boolean {
        return other instanceof Id && this.value === other.value;
    }
}