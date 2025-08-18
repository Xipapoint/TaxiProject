import { Test, TestingModule } from '@nestjs/testing';
import { NestjsInjectionToken, RequestStorageInstance } from '@backend/nestjs';
import { CreateUserSessionCommandHandler } from '../create-user-session-command-handler/create-user-session-command-handler';
import { CreateUserSessionCommand } from '../../command';
import { ResponseOnCreateUserSession } from '../../dto';
import { IUserSessionManager } from '../../interface';
import { InjectionToken } from '../../injection-token';
import { RpcException } from '@nestjs/microservices';

describe('CreateUserSessionCommandHandler', () => {
    let handler: CreateUserSessionCommandHandler;

    const mockUserSessionManager: jest.Mocked<IUserSessionManager> = {
        createSession: jest.fn(),
        refreshSession: jest.fn(),
        revokeSession: jest.fn(),
    };

    const mockUserSessionService = mockUserSessionManager;

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
                CreateUserSessionCommandHandler,
                { provide: InjectionToken.USER_SESSION_MANAGER, useValue: mockUserSessionService },
                { provide: NestjsInjectionToken.QUERY_RUNNER_MANAGER, useValue: mockQueryRunnerManager },
            ],
        })
            .overrideProvider(CreateUserSessionCommandHandler)
            .useClass(CreateUserSessionCommandHandler)
            .compile();

        handler = module.get(CreateUserSessionCommandHandler);

        jest.clearAllMocks();
        RequestStorageInstance.reset(); 
    });

    it('✅ should return ResponseOnCreateUserSession when session is created', async () => {
        const userData = { userId: 'user123' };
        const deviceInfo = { device: 'chrome', location: 'UA', ipAddress: '127.0.0.1' };
        const command = new CreateUserSessionCommand({ userData, deviceInfo });

        const sessionResult = {
            accessToken: 'acc123',
            refreshToken: 'ref123',
        };

        mockUserSessionService.createSession.mockResolvedValue(sessionResult);

        const expected: ResponseOnCreateUserSession = {
            userData,
            tokenPair: {
                accessToken: 'acc123',
                refreshToken: 'ref123',
            },
        };

        const result = await handler.execute(command);

        expect(result).toEqual(expected);
        expect(mockUserSessionService.createSession).toHaveBeenCalledWith(userData, deviceInfo);
    });

    it('❌ should throw exception if userSessionService.createSession throws', async () => {
        const userData = { userId: 'user123' };
        const deviceInfo = { device: 'chrome', location: 'UA', ipAddress: '127.0.0.1' };
        const command = new CreateUserSessionCommand({ userData, deviceInfo });

        mockUserSessionService.createSession.mockRejectedValue(new Error("Error"));

    await expect(handler.execute(command)).rejects.toThrow('Failed to create user session:');
    });
});