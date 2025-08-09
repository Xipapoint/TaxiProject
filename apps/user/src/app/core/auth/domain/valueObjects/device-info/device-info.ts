

export class DeviceInfo {
  constructor(
    private readonly device: string,
    private readonly location: string,
    private readonly ipAddress: string
  ) {
    if (!device || !location || !ipAddress) {
      throw new Error('DeviceInfo fields must not be empty');
    }
  }

  getDevice(): string {
    return this.device;
  }

  getLocation(): string {
    return this.location;
  }

  getIpAddress(): string {
    return this.ipAddress;
  }

  validate(other: DeviceInfo): boolean {
    return (
      other instanceof DeviceInfo &&
      this.device === other.device &&
      this.location === other.location &&
      this.ipAddress === other.ipAddress
    );
  }

  toValue(): { device: string; location: string; ipAddress: string } {
    return {
      device: this.device,
      location: this.location,
      ipAddress: this.ipAddress,
    };
  }

}
