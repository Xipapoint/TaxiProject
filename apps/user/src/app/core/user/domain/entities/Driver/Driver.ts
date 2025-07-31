import { IUser, UserEssentialProperties, UserImplement, UserOptionalProperties, UserProperties } from '../base/base.user';
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';
import { DRIVER_VERIFICATION_STATUS } from '../../enum/DriverVerificationStatus';
import { RequestDriverVerificationEvent } from '../../event/RequestDriverVerificationEvent';

export type DriverEssentialProperties = UserEssentialProperties

export type DriverOptionalProperties = UserOptionalProperties

export type DriverProperties = DriverEssentialProperties &
  Required<DriverOptionalProperties>;

export interface Driver extends IUser {
  requestDriverVerification: (driverId: string) => void
  updateVerificationStatus(status: DRIVER_VERIFICATION_STATUS): void;
  updateShiftStatus(isWorking: boolean): void;
  assignCar(carId: string): void;
}

export class DriverImplement extends UserImplement implements Driver {
    verificationStatus: DRIVER_VERIFICATION_STATUS
    isOnShift: boolean
    carId?: string
    constructor(properties: DriverProperties) {
      super();
      Object.assign(this, properties);
    }
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
        this.apply(new RequestDriverVerificationEvent(this.id.getValue()));
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