import { AggregateRoot } from '@nestjs/cqrs';

import { Email } from '../valueObjects/Email';
import { UserId } from '../valueObjects/UserId';
import { PhoneNumber } from '../valueObjects/PhoneNumber';

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
    addressId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>
>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;

export interface IUser {
  compareId: (id: string) => boolean;
  register: () => void;
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
  protected addressId: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected deletedAt: Date | null;

  constructor() {
    super()
  }

  compareId(id: string): boolean {
    return this.id.equals(new UserId(id))
  }

  abstract register(): void

  abstract updateInfo<T extends UserProperties>(
    props: Partial<Omit<T, 'id' | 'createdAt' | 'deletedAt'>>,
  ): void

  abstract updatePassword(passwordHash: string): void

  abstract delete(): void
}
