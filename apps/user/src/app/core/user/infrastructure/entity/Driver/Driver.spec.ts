import { Driver } from './Driver';

describe('Driver', () => {
  it('should be defined', () => {
    expect(Driver).toBeDefined();
  });

  it('should have the correct properties', () => {
    const driver = new Driver();
    expect(driver).toHaveProperty('clientId');
    expect(driver).toHaveProperty('user');
    expect(driver).toHaveProperty('verificationStatus');
    expect(driver).toHaveProperty('isWorking');
  });
});
