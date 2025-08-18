import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { AuthenticateSessionCommandHandler } from '../authenticate-session-command-handler/authenticate-session-command-handler';
import { AuthenticateSessionCommand } from '../../command/authenticate-session-command/authenticate-session-command';
import { TokenPair } from '@backend/grpc';
import { RequestStorageInstance } from '@backend/nestjs';

describe('AuthenticateSessionCommandHandler', () => {
  let handler: AuthenticateSessionCommandHandler;

  const mockCacheRepo = { findById: jest.fn() };
  const mockUserSessionRepo = { findByRefreshToken: jest.fn() };
  const mockVerifier = {
    verifyByUserSessionDevice: jest.fn(),
    verifyByUserSession: jest.fn(),
  };
  const mockSecurity = { checkSuspiciousActivity: jest.fn() };
  const mockTokenService = { verifyTokens: jest.fn() };
  const mockRunner = {
    isTransactionActive: false,
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  const mockQueryRunnerManager = {
    getQueryRunner: jest.fn().mockReturnValue(mockRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateSessionCommandHandler,
        { provide: 'USER_SESSION_CACHE_REPOSITORY', useValue: mockCacheRepo },
        { provide: 'USER_SESSION_REPOSITORY', useValue: mockUserSessionRepo },
        { provide: 'USER_SESSION_VERIFIER', useValue: mockVerifier },
        { provide: 'USER_SESSION_SECURITY', useValue: mockSecurity },
        { provide: 'TOKEN_SERVICE', useValue: mockTokenService },
        { provide: 'QUERY_RUNNER_MANAGER', useValue: mockQueryRunnerManager },
      ],
    }).compile();

    handler = module.get(AuthenticateSessionCommandHandler);

    jest.clearAllMocks();
    RequestStorageInstance.reset(); 
  });

  it('✅ should return TokenPair when all checks pass', async () => {
    const command = new AuthenticateSessionCommand({
      data: {
        userData: { userId: 'user123' },
        deviceInfo: { device: 'chrome', location: 'UA', ipAddress: '127.0.0.1' },
      },
      tokens: { refreshToken: 'ref123', accessToken: 'acc123' },
    });

    const fakeSession = { id: 'session1' };
    const fakeOtherSession = { id: 'otherSession' };
    const tokenPair: TokenPair = { accessToken: 'newAcc', refreshToken: 'newRef' };

    mockCacheRepo.findById.mockResolvedValue(fakeSession);
    mockUserSessionRepo.findByRefreshToken.mockResolvedValue(fakeOtherSession);
    mockVerifier.verifyByUserSessionDevice.mockResolvedValue(undefined);
    mockVerifier.verifyByUserSession.mockResolvedValue(undefined);
    mockSecurity.checkSuspiciousActivity.mockResolvedValue(undefined);
    mockTokenService.verifyTokens.mockResolvedValue(tokenPair);

    const result = await handler.execute(command);

    expect(result).toEqual(tokenPair);
    expect(mockCacheRepo.findById).toHaveBeenCalledWith('user123');
    expect(mockUserSessionRepo.findByRefreshToken).toHaveBeenCalledWith('ref123');
  });

  it('❌ should throw RpcException if session not found', async () => {
    mockCacheRepo.findById.mockResolvedValue(null);

    const command = new AuthenticateSessionCommand({
      data: { userData: { userId: 'user123' }, deviceInfo: { device: 'chrome', location: 'UA', ipAddress: '127.0.0.1' } },
      tokens: { refreshToken: 'ref123', accessToken: 'acc123' },
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new RpcException('Session not found'),
    );
  });

  it('❌ should throw RpcException if refresh token invalid', async () => {
    mockCacheRepo.findById.mockResolvedValue({ id: 'session1' });
    mockUserSessionRepo.findByRefreshToken.mockResolvedValue(null);

    const command = new AuthenticateSessionCommand({
      data: { userData: { userId: 'user123' }, deviceInfo: { device: 'chrome', location: 'UA', ipAddress: '127.0.0.1' } },
      tokens: { refreshToken: 'ref123', accessToken: 'acc123' },
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new RpcException('Invalid refresh token'),
    );
  });

  it('❌ should throw RpcException if tokenService.verifyTokens returns null', async () => {
    mockCacheRepo.findById.mockResolvedValue({ id: 'session1' });
    mockUserSessionRepo.findByRefreshToken.mockResolvedValue({ id: 'other' });
    mockVerifier.verifyByUserSessionDevice.mockResolvedValue(undefined);
    mockVerifier.verifyByUserSession.mockResolvedValue(undefined);
    mockSecurity.checkSuspiciousActivity.mockResolvedValue(undefined);
    mockTokenService.verifyTokens.mockResolvedValue(null);

    const command = new AuthenticateSessionCommand({
      data: { userData: { userId: 'user123' }, deviceInfo: { device: 'chrome', location: 'UA', ipAddress: '127.0.0.1' } },
      tokens: { refreshToken: 'ref123', accessToken: 'acc123' },
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new RpcException('Something went wrong'),
    );
  });
});
