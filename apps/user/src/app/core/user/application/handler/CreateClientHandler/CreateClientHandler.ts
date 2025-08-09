import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
import { ClientFactory, ClientRepository } from '../../../domain';
import { CreateClientCommand } from '../../command';
import { InjectionToken } from '../../InjectionToken';
import { AuthServiceTransport } from '../../dto';
import { User } from '@backend/grpc';


@CommandHandler(CreateClientCommand)
export class CreateClientHandler
  implements ICommandHandler<CreateClientCommand, void>
{
  constructor(
    @Inject(InjectionToken.CLIENT_REPOSITORY)
    private readonly accountRepository: ClientRepository,
    @Inject() private readonly accountFactory: ClientFactory,
    @Inject(PASSWORD_GENERATOR)
    private readonly passwordGenerator: PasswordGenerator,
    @Inject(InjectionToken.AUTH_TRANSPORT_SERVICE)
    private readonly authService: AuthServiceTransport,

  ) {}

  async execute(command: CreateClientCommand): Promise<void> {


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
  }
}