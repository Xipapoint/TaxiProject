import { AggregateRoot } from '@nestjs/cqrs';

import { Email, PhoneNumber, UserId } from '../../valueObjects';

export type UserEssentialProperties = Readonly<{
  id: UserId;
  phoneNumber: PhoneNumber;
  firstName: string;
  lastName: string;
  email: Email;
  dateOfBirth: string;
}>;

export type UserOptionalProperties = Readonly<
  Partial<{
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;

export interface IUser {
  compareId: (id: string) => boolean;
  create: () => void;
  updateInfo: (props: Partial<Omit<UserProperties, 'id'>>) => void;
  updatePassword: (passwordHash: string) => void;
  delete: () => void;
  commit: () => void;
}

export abstract class UserImplement extends AggregateRoot implements IUser {
  protected readonly id: UserId;
  protected phoneNumber: PhoneNumber;
  protected firstName: string;
  protected lastName: string;
  protected email: Email;
  protected dateOfBirth: string;
  protected passwordHash: string;
  protected createdAt: Date;
  protected updatedAt: Date;

  constructor() {
    super();
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

  abstract create(): void;

  abstract updateInfo<T extends UserProperties>(
    props: Partial<Omit<T, 'id' | 'createdAt' | 'deletedAt'>>,
  ): void;

  abstract updatePassword(passwordHash: string): void;

  abstract delete(): void;
}
