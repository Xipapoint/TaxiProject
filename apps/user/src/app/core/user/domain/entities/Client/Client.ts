
import { IUser, UserEssentialProperties, UserImplement, UserOptionalProperties, UserProperties } from '../base/base.user';
import { ClientRegisteredEvent } from '../../event/ClientRegisteredEvent';

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
        this.apply(new ClientRegisteredEvent(this.id, this.email));
    }
    updateInfo: (props: Partial<Omit<UserProperties, 'id'>>) => void;
    updatePassword: (passwordHash: string) => void;
    delete: () => void;
    commit: () => void;
}