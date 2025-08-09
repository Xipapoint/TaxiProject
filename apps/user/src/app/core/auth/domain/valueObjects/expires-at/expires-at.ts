export class ExpiresAt {
    private readonly value: Date;

    private constructor(value: Date) {
        this.value = value;
    }

    static createOneWeekFromNow(): ExpiresAt {
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return new ExpiresAt(oneWeekFromNow);
    }

    getValue(): Date {
        return this.value;
    }

    isExpired(): boolean {
        return new Date() > this.value;
    }
}