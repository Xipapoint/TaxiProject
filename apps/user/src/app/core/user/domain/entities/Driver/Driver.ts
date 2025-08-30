import { AggregateRoot } from '@nestjs/cqrs';
import { DRIVER_VERIFICATION_STATUS } from '../../enum/DriverVerificationStatus';
import { RequestDriverVerificationEvent } from '../../event/RequestDriverVerificationEvent';
import { UserRegisteredEvent } from '../../event/UserRegisteredEvent';
import { UserId } from '../../valueObjects/UserId/UserId';
import { UserProfile, UserProfileProperties } from '../UserProfile/UserProfile';

export type DriverEssentialProperties = {
  driverId: UserId;
  verificationStatus: DRIVER_VERIFICATION_STATUS;
  isOnShift: boolean;
  licenseNumber: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlateNumber: string;
  insuranceNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
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
    private verificationStatus: DRIVER_VERIFICATION_STATUS
    private isOnShift: boolean
    private carId?: string
    private licenseNumber?: string;
    private vehicleModel?: string;
    private vehicleYear?: number;
    private vehiclePlateNumber?: string;
    private insuranceNumber?: string;
    private emergencyContactName?: string;
    private emergencyContactPhone?: string;
    private readonly profile: UserProfile;
    private readonly driverId: UserId;
    constructor(userProps: UserProfileProperties, properties: DriverProperties) {
      super();
      this.profile = new UserProfile(userProps);
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
      this.verificationStatus = status;
    }
    updateShiftStatus(isWorking: boolean): void {
      this.isOnShift = isWorking;
    }
    assignCar(carId: string): void {
      this.carId = carId;
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

    getLicenseNumber() {
      return this.licenseNumber;
    }
    getVehicleModel() {
      return this.vehicleModel;
    }
    getVehicleYear() {
      return this.vehicleYear;
    }
    getVehiclePlateNumber() {
      return this.vehiclePlateNumber;
    }
    getInsuranceNumber() {
      return this.insuranceNumber;
    }
    getEmergencyContactName() {
      return this.emergencyContactName;
    }
    getEmergencyContactPhone() {
      return this.emergencyContactPhone;
    }
    getVerificationStatus() {
      return this.verificationStatus;
    }
    getIsOnShift() {
      return this.isOnShift;
    }
    getCarId() {
      return this.carId;
    }
}