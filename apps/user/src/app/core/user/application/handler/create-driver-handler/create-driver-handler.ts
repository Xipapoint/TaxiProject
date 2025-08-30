import { AuthServiceTransport } from '../../dto';
import { DriverFactory, DriverRepository } from '../../../domain';
import { NestjsInjectionToken, QueryRunnerManager, Transactional } from '@backend/nestjs';
import { Logger, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDriverCommand } from '../../command';
import { InjectionToken } from '../../InjectionToken';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
@CommandHandler(CreateDriverCommand)
export class CreateDriverHandler
  implements ICommandHandler<CreateDriverCommand, void>
{
  private readonly logger: Logger = new Logger(CreateDriverHandler.name)
  constructor(
    @Inject(InjectionToken.DRIVER_REPOSITORY)
    private readonly driverRepository: DriverRepository,
    @Inject() private readonly driverFactory: DriverFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator,
    @Inject(InjectionToken.AUTH_TRANSPORT_SERVICE)
    private readonly authService: AuthServiceTransport,
    @Inject(NestjsInjectionToken.QUERY_RUNNER_MANAGER)
    private readonly queryRunnerManager: QueryRunnerManager
  ) {

  }

  @Transactional()
  async execute(command: CreateDriverCommand): Promise<void> {
    try {
      const driver = this.driverFactory.create({
        ...command.props,
        passwordHash: await this.passwordGenerator.generateKey(command.props.password),
      });

    const result = await this.authService.createUser({
      userData: {
        userId: driver.getDriverIdValue()
      },

      /* 
        TEMPORARY USING RANDOM STRING. 
        TODO: MOVE GEOLOCATION IP SERVICE FROM AUTH BOUNDED CONTEXT
      */

      deviceInfo: {
        location: crypto.randomUUID(),
        ipAddress: crypto.randomUUID(),
        device: crypto.randomUUID()
      }
    })

    if(!result.success)
      throw new Error(`${result.error.errorMessage}, code: ${result.error.statusCode}`)

    driver.create();

    await this.driverRepository.save(driver);

    driver.commit();
    } catch (error) {
      this.logger.error(`Error in handler: ${error}`)
      throw error
    }

  }
}