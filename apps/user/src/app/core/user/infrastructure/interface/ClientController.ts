import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateClientCommand } from '../../application/command/CreateClientCommand/CreateClientCommand';
import { CreateClientDto } from './dto';
import { CommandBus, QueryBus } from "@nestjs/cqrs";

@ApiTags('Client')
@Controller('client')
export class ClientController {
    constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

    @Post('create')
    async createClient(@Body() body: CreateClientDto): Promise<void> {
        const command = new CreateClientCommand(
            {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phoneNumber: body.phoneNumber,
                password: body.password,
                dateOfBirth: body.dateOfBirth,
            }
        );
        await this.commandBus.execute(command);
    }
}