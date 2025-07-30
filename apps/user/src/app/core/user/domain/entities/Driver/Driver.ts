import { IUser, UserEssentialProperties, UserImplement, UserOptionalProperties, UserProperties } from '../base/base.user';
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';

export type DriverEssentialProperties = UserEssentialProperties

export type DriverOptionalProperties = UserOptionalProperties

export type DriverProperties = DriverEssentialProperties &
  Required<DriverOptionalProperties>;

export interface Driver extends IUser {}

export class DriverImplement extends UserImplement implements Driver {
  constructor(properties: DriverProperties) {
    super();
    Object.assign(this, properties);
  }
    compareId: (id: string) => boolean;
    create(): void {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.apply(new UserRegisteredEvent(this.id, this.email));
    }
    updateInfo: (props: Partial<Omit<UserProperties, 'id'>>) => void;
    updatePassword: (passwordHash: string) => void;
    delete: () => void;
    commit: () => void;
}