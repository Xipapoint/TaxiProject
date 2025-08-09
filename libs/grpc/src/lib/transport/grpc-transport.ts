import { ClientGrpc } from '@nestjs/microservices';
import { GrpcTransport } from './interface/grpc-transport.interface';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseGrpcTransport implements GrpcTransport {

    constructor(private readonly client: ClientGrpc) {}

    async unaryCall<TRequest, TResponse>(
        service: string,
        method: string,
        request: TRequest,
        metadata?: Record<string, string>
    ): Promise<TResponse> {
        const svc = this.client.getService<any>(service);
        if (!svc[method]) {
            throw new Error(`Method ${method} not found on service ${service}`);
        }
        return await lastValueFrom(svc[method](request, metadata));
    }
}