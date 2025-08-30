import { NestjsInjectionToken, RequestStorage, RequestStorageImplement, RequestStorageInstance } from "@backend/nestjs";
import { Test, TestingModule } from "@nestjs/testing";
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
import { DriverFactory, DriverRepository } from "../../../domain";
import { AuthServiceTransport } from "../../dto";
import { InjectionToken } from "../../InjectionToken";
import { CreateDriverHandler } from '../create-driver-handler/create-driver-handler';

describe('create-driver-handler', () => {
    let handler: CreateDriverHandler;
    let mockDriverRepository: jest.Mocked<DriverRepository>;
    let mockAuthServiceTransport: jest.Mocked<AuthServiceTransport>;
    let mockPasswordGenerator: jest.Mocked<PasswordGenerator>;
    let mockDriverFactory: any;
    let mockRequestStorage: RequestStorage

    const mockRunner = {
        isTransactionActive: false,
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
    };

    let mockQueryRunnerManager: any;

  beforeEach(async () => {
    mockDriverRepository = {
        save: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        findByPhoneNumber: jest.fn(),
    };

    mockQueryRunnerManager = {
        getQueryRunner: jest.fn().mockReturnValue(mockRunner),
    }

    mockDriverFactory = {
        create: jest.fn(),
        reconstitute: jest.fn(),
    }

    mockPasswordGenerator = {
        generateKey: jest.fn(),
    }

    mockAuthServiceTransport = {
        createUser: jest.fn(),
    }


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDriverHandler,
        {
          provide: InjectionToken.DRIVER_REPOSITORY,
          useValue: mockDriverRepository,
        },
        {
          provide: NestjsInjectionToken.QUERY_RUNNER_MANAGER,
          useValue: mockQueryRunnerManager,
        },
        {
            provide: DriverFactory,
            useValue: mockDriverFactory,
        },
        {
            provide: PASSWORD_GENERATOR,
            useValue: mockPasswordGenerator,
        },
        {
            provide: InjectionToken.AUTH_TRANSPORT_SERVICE,
            useValue: mockAuthServiceTransport,
        }
      ],
    }).compile();

    handler = module.get<CreateDriverHandler>(CreateDriverHandler);
    RequestStorageInstance.reset()
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create driver', async () => {
    const mockCommand = {
        props: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '1234567890',
            password: 'password',
            licenseNumber: 'ABC123',
            vehicleDetails: 'Toyota Camry',
            dateOfBirth: '1990-01-01',
            address: '123 Main St',
            emergencyContactName: 'Jane Doe',
            emergencyContactPhone: '0987654321',
            
        }
    }
    const { props } = mockCommand;
    const hashedPassword = 'hashedPassword';
    mockPasswordGenerator.generateKey.mockResolvedValue(hashedPassword);
    const mockDriver = { id: 1, ...props, passwordHash: hashedPassword, getDriverIdValue: jest.fn().mockReturnValue(1) };
    mockDriverFactory.create.mockReturnValue(mockDriver);
    const driver = await handler.execute(mockCommand);
    expect(driver).toEqual(mockDriver);
  });

 
});
