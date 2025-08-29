@ApiTags('Client')
@Controller('client')
@UseFilters(CatchFilter)
export class ClientController {
    private readonly logger: Logger = new Logger(ClientController.name)
    constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

    @Post('create')
    async createClient(@Body() body: CreateClientDto): Promise<void> {
        try {
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
        } catch (error) {
            this.logger.error(`Error in controller: ${error}`)
            throw error
        }
    }
}