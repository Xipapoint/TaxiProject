import { AggregateRoot } from '@nestjs/cqrs';
import { DRIVER_VERIFICATION_STATUS } from '../../enum/DriverVerificationStatus';
import { RequestDriverVerificationEvent } from '../../event/RequestDriverVerificationEvent';
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';
import { UserId } from '../../valueObjects/UserId/UserId';
import { UserProfile, UserProfileProperties } from '../UserProfile/UserProfile';

export type DriverEssentialProperties = {
  verificationStatus: DRIVER_VERIFICATION_STATUS;
  isOnShift: boolean
}

export type DriverOptionalProperties = {
  carId?: string
}

export type DriverProperties = DriverEssentialProperties &
  Required<DriverOptionalProperties>;

export interface IDriver {

}

export interface Driver extends IDriver {
  requestDriverVerification: (driverId: string) => void
  updateVerificationStatus(status: DRIVER_VERIFICATION_STATUS): void;
  updateShiftStatus(isWorking: boolean): void;
  assignCar(carId: string): void;
}

export class DriverImplement extends AggregateRoot implements Driver {
    private readonly driverId: UserId;
    private verificationStatus: DRIVER_VERIFICATION_STATUS
    private isOnShift: boolean
    private carId?: string
    private readonly profile: UserProfile;
    constructor(userProps: UserProfileProperties, properties: DriverProperties) {
      super();
      this.profile = new UserProfile(userProps);
      this.driverId = userProps.id;
      Object.assign(this, properties);
    }
    getUserId() {
      return this.profile.getId()
    }
    getUserIdValue() {
      return this.getUserId().getValue()
    }
    
    getDriverId() {
      return this.driverId
    }

    getDriverIdValue() {
      return this.driverId.getValue()
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

    compareId: (id: string) => boolean;

    updateVerificationStatus(status: DRIVER_VERIFICATION_STATUS): void {
      throw new Error('Method not implemented.');
    }
    updateShiftStatus(isWorking: boolean): void {
      throw new Error('Method not implemented.');
    }
    assignCar(carId: string): void {
      throw new Error('Method not implemented.');
    }
    requestDriverVerification() {
      if(this.verificationStatus === DRIVER_VERIFICATION_STATUS.PENDING)
        this.apply(new RequestDriverVerificationEvent(this.getDriverIdValue()));
    }
    
    create(): void {
        this.apply(new UserRegisteredEvent(this.driverId.getValue(), this.getEmailValue()));
    }

    updateInfo: (profileProps: Partial<Omit<UserProfileProperties, 'id'>>, clientProps: DriverProperties) => void;
    updatePassword: (passwordHash: string) => void;
    delete: () => void;
    commit: () => void;
}