
import { AggregateRoot } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';
import { UserProfile, UserProfileProperties } from '../UserProfile/UserProfile';
import { UserId } from '../../valueObjects/UserId/UserId';

export interface ClientEssentialProperties {
  clientId: UserId
}

export type ClientOptionalProperties = object

export type ClientProperties = ClientEssentialProperties &
  Required<ClientOptionalProperties>;

export interface IClient {
  commit: () => void;
  updateInfo: (profileProps: Partial<Omit<UserProfileProperties, 'id'>>, clientProps: ClientProperties) => void
  create: () => void
}
export class ClientImplement extends AggregateRoot implements IClient {
    private readonly clientId: UserId;
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
    
    getClientId() {
      return this.clientId
    }
    getClientIdValue() {
      return this.clientId.getValue()
    }
    getEmail() {
      return this.profile.getEmail()
    }
    getEmailValue() {
      return this.getEmail().getValue()
    }

    getProfile() {
      return this.profile
    }

    create(): void {
        this.apply(new UserRegisteredEvent(this.getClientIdValue(), this.getEmailValue()));
    }
    updateInfo(profileProps: Partial<Omit<UserProfileProperties, 'id'>>, clientProps: ClientProperties) {
      this.profile.updateInfo(profileProps)
      Object.entries(clientProps).forEach(([key, value]) => {
          if (value !== undefined) {
              (this as ClientImplement)[key] = value;
          }
      });
    };
    updatePassword: (passwordHash: string) => void;
    delete: () => void;
}