import { Column } from "typeorm";

export class DeviceInfo {
    @Column()
    device: string;

    @Column()
    location: string;

    @Column({ name: 'ip_address' })
    ipAddress: string;
}