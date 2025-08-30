import { User } from './User';

describe('User', () => {
  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should have the correct properties', () => {
    const user = new User();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('dateOfBirth');
    expect(user).toHaveProperty('passwordHash');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});
