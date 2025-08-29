import { ICommand } from '@nestjs/cqrs';
import { CreateDriverCommandDto } from '../../dto';

export class CreateDriverCommand implements ICommand {
  constructor(
    public readonly props: Readonly<CreateDriverCommandDto>
  ) {}
}