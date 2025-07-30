// import { Inject, Injectable } from "@nestjs/common";
// import { Repository } from "typeorm";
// import { InjectionToken } from "../constants/InjectionToken";
// import { Driver } from "../../core/user/infrastructure/entity/Driver/Driver";
// import { UserDao } from "./UserDao";

// @Injectable()
// export class DriverDao extends UserDao<Driver> {
//   constructor(
//     @Inject(InjectionToken.CLIENT_REPOSITORY) repo: Repository<Driver>
//   ) {
//     super(repo);
//   }

//   findFreeDrivers() {
//     return this.repo.find({ where: { status: 'free' } });
//   }

//   createDriver(data: Partial<Driver>) {
//     const driver = this.repo.create(data);
//     return this.repo.save(driver);
//   }

//   updateStatus(driverId: number, status: string) {
//     return this.repo.update(driverId, { status });
//   }
// }
