import { Transactional } from '@backend/nestjs';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
import { ClientFactory, ClientRepository } from '../../../domain';
import { CreateClientCommand } from '../../command';
import { InjectionToken } from '../../InjectionToken';


@CommandHandler(CreateClientCommand)
export class CreateClientHandler
  implements ICommandHandler<CreateClientCommand, void>
{
  @Inject(InjectionToken.CLIENT_REPOSITORY)
  private readonly accountRepository: ClientRepository;
  @Inject() private readonly accountFactory: ClientFactory;
  @Inject(PASSWORD_GENERATOR)
  private readonly passwordGenerator: PasswordGenerator;

  @Transactional()
  async execute(command: CreateClientCommand): Promise<void> {


    const client = this.accountFactory.create({
      ...command.props,
      passwordHash: await this.passwordGenerator.generateKey(command.props.password),
    });

    client.create();

    await this.accountRepository.save(client);

    client.commit();
  }
}