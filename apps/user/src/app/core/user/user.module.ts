import { Logger, Module, Provider } from "@nestjs/common";
import { ClientFactory } from './domain/factories/Client/client.factory';
import { InjectionToken } from "./application/InjectionToken";
import { ClientRepositoryImplement } from './infrastructure/repository/ClientRepositoryImplement';
import { CreateClientHandler } from './application/handler/CreateClientHandler/CreateClientHandler';
import { CqrsModule } from "@nestjs/cqrs";
import { PasswordModule } from "../../libs/PasswordModule";

const domain = [ClientFactory]

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.CLIENT_REPOSITORY,
    useClass: ClientRepositoryImplement,
  },
]

const application = [
    CreateClientHandler
]

@Module({
    imports: [CqrsModule, PasswordModule],
    providers: [Logger, ...domain, ...infrastructure, ...application],
})
export class UserModule {}