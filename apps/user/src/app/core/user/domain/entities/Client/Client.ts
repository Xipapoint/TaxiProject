
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';
import { IUser, UserEssentialProperties, UserImplement, UserOptionalProperties, UserProperties } from '../base/base.user';

export type ClientEssentialProperties = UserEssentialProperties

export type ClientOptionalProperties = UserOptionalProperties

export type ClientProperties = ClientEssentialProperties &
  Required<ClientOptionalProperties>;

export interface Client extends IUser {}

export class ClientImplement extends UserImplement implements Client {
  constructor(properties: ClientProperties) {
    super();
    Object.assign(this, properties);
  }
    compareId: (id: string) => boolean;
    create(): void {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.apply(new UserRegisteredEvent(this.id.getValue(), this.email.getValue()));
    }
    updateInfo: (props: Partial<Omit<UserProperties, 'id'>>) => void;
    updatePassword: (passwordHash: string) => void;
    delete: () => void;
    commit: () => void;
}