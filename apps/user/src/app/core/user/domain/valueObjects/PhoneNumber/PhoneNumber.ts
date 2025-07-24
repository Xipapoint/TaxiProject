import { IsPhoneNumber } from 'class-validator';
import { CountryCode } from '../../types/CountryCode';

export class PhoneNumber {
    //TODO: ADD VALIDATION FOR ABSOLUTE ALL REGIONS
    @IsPhoneNumber('UA', {
        message: 'Phone number must be a valid international phone number',
    })
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }
}
