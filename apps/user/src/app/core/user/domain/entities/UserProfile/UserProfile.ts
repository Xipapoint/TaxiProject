import { AggregateRoot } from "@nestjs/cqrs";
import { Email } from '../../valueObjects/Email/Email';
import { PhoneNumber } from '../../valueObjects/PhoneNumber/PhoneNumber';
import { UserId } from '../../valueObjects/UserId/UserId';

export type UserProfileEssentialProperties = Readonly<{
  id: UserId;
  phoneNumber: PhoneNumber;
  firstName: string;
  lastName: string;
  email: Email;
  dateOfBirth: string;
  passwordHash: string;
}>;

export type UserProfileOptionalProperties = Readonly<
  Partial<{
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export type UserProfileProperties = UserProfileEssentialProperties &
  Required<UserProfileOptionalProperties>;

export interface IUserProfile {
  compareId: (id: string) => boolean;
  updateInfo: (props: Partial<Omit<UserProfileProperties, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  updatePassword: (passwordHash: string) => void;
}

export class UserProfile implements IUserProfile {
    protected readonly id: UserId;
    protected phoneNumber: PhoneNumber;
    protected firstName: string;
    protected lastName: string;
    protected email: Email;
    protected dateOfBirth: string;
    protected passwordHash: string;
    protected createdAt: Date;
    protected updatedAt: Date;

    constructor(properties: UserProfileProperties) {
        Object.assign(this, properties);
        this.updatedAt = new Date()
        this.createdAt = new Date()
    }

    getId(): UserId {
        return this.id;
    }

    getPhoneNumber(): PhoneNumber {
        return this.phoneNumber;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getEmail(): Email {
        return this.email;
    }

    getDateOfBirth(): string {
        return this.dateOfBirth;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    compareId(id: string): boolean {
        return this.id.equals(new UserId(id));
    }

    compareEmail(email: string): boolean {
        return this.email.equals(new Email(email));
    }


    updateInfo<T extends UserProfileProperties>(
        props: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
    ): void {
        Object.entries(props).forEach(([key, value]) => {
            if (value !== undefined) {
                (this as UserProfile)[key] = value;
            }
        });
        this.updatedAt = new Date();
    }

    public updatePassword(passwordHash: string): void {
        this.passwordHash = passwordHash;
        this.updatedAt = new Date();
    }
}
