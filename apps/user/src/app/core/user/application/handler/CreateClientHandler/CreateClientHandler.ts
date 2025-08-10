import { NestjsInjectionToken, QueryRunnerManager, Transactional } from '@backend/nestjs';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
import { ClientFactory, ClientRepository } from '../../../domain';
import { CreateClientCommand } from '../../command';
import { AuthServiceTransport } from '../../dto';
import { InjectionToken } from '../../InjectionToken';


@CommandHandler(CreateClientCommand)
export class CreateClientHandler
  implements ICommandHandler<CreateClientCommand, void>
{
  private readonly logger: Logger = new Logger(CreateClientHandler.name)
  constructor(
    @Inject(InjectionToken.CLIENT_REPOSITORY)
    private readonly accountRepository: ClientRepository,
    @Inject() private readonly accountFactory: ClientFactory,
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