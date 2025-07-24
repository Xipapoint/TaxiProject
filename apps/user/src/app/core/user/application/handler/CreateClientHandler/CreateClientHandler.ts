import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateClientCommand } from '../../command';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../../libs/PasswordModule';
import { ClientFactory } from '../../../domain';
import { Transactional } from '@backend/nestjs';
import { InjectionToken } from '../../InjectionToken';
import { ClientRepository } from '../../../domain';
import { UserId } from '../../../domain/valueObjects/UserId/UserId';


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
      id: await this.accountRepository.newId(),
      passwordHash: await this.passwordGenerator.generateKey(command.props.password),
    });

    client.create();

    await this.accountRepository.save(client);

    client.commit();
  }
}