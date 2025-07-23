import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterClientCommand } from '../command/RegisterClientCommand';
import { PASSWORD_GENERATOR, PasswordGenerator } from '../../../../libs/PasswordModule';
import { ClientFactory } from '../../domain/factories/client.factory';

@CommandHandler(RegisterClientCommand)
export class RegisterClientHandler
  implements ICommandHandler<RegisterClientCommand, void>
{
  @Inject(InjectionToken.ACCOUNT_REPOSITORY)
  private readonly accountRepository: AccountRepository;
  @Inject() private readonly accountFactory: ClientFactory;
  @Inject(PASSWORD_GENERATOR)
  private readonly passwordGenerator: PasswordGenerator;

  @Transactional()
  async execute(command: RegisterClientCommand): Promise<void> {
    const client = this.accountFactory.create({
      ...command.props,
      id: await this.accountRepository.newId(),
      passwordHash: await this.passwordGenerator.generateKey(command.props.password),
    });

    client.open();

    await this.accountRepository.save(client);

    client.commit();
  }
}