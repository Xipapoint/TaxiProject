import { ICommand } from '@nestjs/cqrs';
import { CreateClientDto } from '../dto/create-client.dto';

export class RegisterClientCommand implements ICommand {
  constructor(
    public readonly props: Readonly<CreateClientDto>
  ) {}
}