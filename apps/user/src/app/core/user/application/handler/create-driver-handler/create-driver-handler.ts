import { AuthServiceTransport } from '../../dto';
import { DriverFactory } from '../../../domain/factories';
import { NestjsInjectionToken, QueryRunnerManager, Transactional } from '@backend/nestjs';
import { Logger, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDriverCommand } from '../../command';
import { InjectionToken } from '../../../../auth/application/injection-token';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
@CommandHandler(CreateDriverCommand)
export class CreateDriverHandler
  implements ICommandHandler<CreateDriverCommand, void>
{
  private readonly logger: Logger = new Logger(CreateDriverHandler.name)
  constructor(
    @Inject(InjectionToken.CLIENT_REPOSITORY)
    private readonly accountRepository: ClientRepository,
    @Inject() private readonly accountFactory: DriverFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator,
    @Inject(InjectionToken.AUTH_TRANSPORT_SERVICE)
    private readonly authService: AuthServiceTransport,
    @Inject(NestjsInjectionToken.QUERY_RUNNER_MANAGER)
    private readonly queryRunnerManager: QueryRunnerManager
  ) {

  }

  @Transactional()
  async execute(command: CreateClientCommand): Promise<void> {
    try {
      const client = this.accountFactory.create({
        ...command.props,
        passwordHash: await this.passwordGenerator.generateKey(command.props.password),
      });

    const result = await this.authService.createUser({
      userData: {
        userId: client.getClientIdValue()
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

    client.create();

    await this.accountRepository.save(client);

    client.commit();
    } catch (error) {
      this.logger.error(`Error in handler: ${error}`)
      throw error
    }

  }
}