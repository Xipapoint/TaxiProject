import { ClientEntity } from './Client';

describe('ClientEntity', () => {
  it('should be defined', () => {
    expect(ClientEntity).toBeDefined();
  });

  it('should have the correct properties', () => {
    const client = new ClientEntity();
    expect(client).toHaveProperty('clientId');
    expect(client).toHaveProperty('user');
    expect(client).toHaveProperty('userId');
  });
});
