
import { AggregateRoot } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';
import { UserProperties } from '../base/base.user';
import { UserProfile, UserProfileProperties } from '../UserProfile/UserProfile';

export interface ClientEssentialProperties {

}

export type ClientOptionalProperties = object

export type ClientProperties = ClientEssentialProperties &
  Required<ClientOptionalProperties>;

export interface IClient {
  commit: () => void
}

export interface IClient {
  commit: () => void
}

export class ClientImplement  extends AggregateRoot implements IClient {
    private readonly profile: UserProfile;
    constructor(userProps: UserProfileProperties, properties: ClientProperties) {
      super();
      this.profile = new UserProfile(userProps)
      Object.assign(this, properties);
    }
    getUserId() {
      return this.profile.getId()
    }
    getUserIdValue() {
      return this.getUserId().getValue()
    }
    getEmail() {
      return this.profile.getEmail()
    }
    getEmailValue() {
      return this.getEmail().getValue()
    }

    compareId: (id: string) => boolean;
    create(): void {
        this.apply(new UserRegisteredEvent(this.getUserIdValue(), this.getEmailValue()));
    }
    updateInfo: (props: Partial<Omit<UserProperties, 'id'>>) => void;
    updatePassword: (passwordHash: string) => void;
    delete: () => void;
    commit: () => void;
}