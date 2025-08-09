import { Logger, Module, Provider } from "@nestjs/common";
import { ClientFactory } from './domain/factories/Client/client.factory';
import { InjectionToken } from "./application/InjectionToken";
import { ClientRepositoryImplement } from './infrastructure/repository/ClientRepositoryImplement';
import { CreateClientHandler } from './application/handler/CreateClientHandler/CreateClientHandler';
import { CqrsModule } from "@nestjs/cqrs";
import { PasswordModule } from "../../libs/PasswordModule";
import { ClientController } from './infrastructure/interface/ClientController';
import { AuthGrpcService } from './infrastructure/service/auth-grpc.service';
import { Packages } from "@backend/grpc";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

const domain = [ClientFactory]

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.CLIENT_REPOSITORY,
    useClass: ClientRepositoryImplement,
  },

  {
    provide: InjectionToken.AUTH_TRANSPORT_SERVICE,
    useClass: AuthGrpcService
  }
]

const application = [
    CreateClientHandler
]

@Module({
    imports: [
      CqrsModule, 
      PasswordModule,
      ClientsModule.registerAsync([
        {
          name: Packages.AUTH,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              url: configService.getOrThrow('AUTH_GRPC_SERVICE_URL'),
              package: Packages.AUTH,
              protoPath: join(__dirname, "**", "**", 'libs', 'grpc', 'src', 'lib', 'protos', 'auth.proto'),
            },
          }),
          inject: [ConfigService],
        },
      ]),

    ],
    controllers: [ClientController],
    providers: [Logger, ...domain, ...infrastructure, ...application],
})
export class UserModule {}