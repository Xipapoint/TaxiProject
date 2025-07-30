import { ICommand } from '@nestjs/cqrs';
import { CreateClientCommandDto } from '../../dto/create-client.dto';

export class CreateClientCommand implements ICommand {
  constructor(
    public readonly props: Readonly<CreateClientCommandDto>
  ) {}
}