import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { DriverFactory, DriverImplement, DriverRepository, Email, PhoneNumber, UserId } from '../../domain';
import { ConflictError, PostgresErrorCode } from '@backend/nestjs';
import { Driver } from '../entity/Driver/Driver';

@Injectable()
export class DriverRepositoryImplement implements OnModuleInit, DriverRepository {
  @Inject() private readonly driverFactory: DriverFactory;
  private writeConnection: QueryRunner
  private readConnection: EntityManager;

  constructor(
    private readonly dataSource: DataSource
  ) {}

  onModuleInit() {
    this.writeConnection = this.dataSource.createQueryRunner();
    this.readConnection = this.dataSource.manager;
  }

  async save(data: DriverImplement | DriverImplement[]): Promise<void> {
    try {
      const models = Array.isArray(data) ? data : [data];
      const entities = models.map((model) => this.modelToEntity(model));
      await this.writeConnection.manager.getRepository(Driver).save(entities);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictError('Driver with this phone number or email already exists');
      throw error
    }
  }

  private selectUserProfile() {
    return this.writeConnection.manager.createQueryBuilder().leftJoinAndSelect('driver.user', 'user')
  }

  async findById(id: string): Promise<DriverImplement | null> {
    const entity = await this
      .selectUserProfile()
      .where('user.id = :id', {id})
      .getOne()
    return entity ? this.entityToModel(entity) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<DriverImplement | null> {
    const entity: Driver | null = await this
      .selectUserProfile()
      .where('user.phoneNumber = :phoneNumber', {phoneNumber})
      .getOne()
    return entity ? this.entityToModel(entity) : null
  }

  async findByEmail(email: string): Promise<DriverImplement | null> {
    const entity: Driver | null = await this
      .selectUserProfile()
      .where('user.email = :email', {email})
      .getOne()
    return entity ? this.entityToModel(entity) : null
  }

  private modelToEntity(model: DriverImplement): Driver {
    const profile = model.getProfile()
    return {
      clientId: model.getDriverIdValue(),
      userId: model.getUserIdValue(),
      user: {
        id: model.getUserIdValue(),
        firstName: profile.getFirstName(),
        lastName: profile.getLastName(),
        email: profile.getEmail().getValue(),
        phoneNumber: profile.getPhoneNumber().getValue(),
        dateOfBirth: profile.getDateOfBirth(),
        passwordHash: profile.getPasswordHash(),
        createdAt: profile.getCreatedAt(),
        updatedAt: profile.getUpdatedAt(),
      },
      verificationStatus: model.getVerificationStatus(),
      isWorking: model.getIsOnShift(),
      carId: model.getCarId(),
      licenseNumber: model.getLicenseNumber(),
      vehicleModel: model.getVehicleModel(),
      vehicleYear: model.getVehicleYear(),
      vehiclePlateNumber: model.getVehiclePlateNumber(),
      insuranceNumber: model.getInsuranceNumber(),
      emergencyContactName: model.getEmergencyContactName(),
      emergencyContactPhone: model.getEmergencyContactPhone(),
    };
  }

  private entityToModel(entity: Driver): DriverImplement {
    const user = entity.user
    return this.driverFactory.reconstitute({
      id: new UserId(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: new PhoneNumber(user.phoneNumber),
      email: new Email(user.email),
      dateOfBirth: user.dateOfBirth,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    {
      driverId: new UserId(entity.clientId),
      verificationStatus: entity.verificationStatus,
      isOnShift: entity.isWorking,
      carId: entity.carId,
      licenseNumber: entity.licenseNumber,
      vehicleModel: entity.vehicleModel,
      vehicleYear: entity.vehicleYear,
      vehiclePlateNumber: entity.vehiclePlateNumber,
      insuranceNumber: entity.insuranceNumber,
      emergencyContactName: entity.emergencyContactName,
      emergencyContactPhone: entity.emergencyContactPhone,
    }
  );
  }
}
