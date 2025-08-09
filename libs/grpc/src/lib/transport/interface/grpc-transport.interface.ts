export interface GrpcTransport {
  unaryCall<TRequest, TResponse>(
    service: string,
    method: string,
    request: TRequest,
    metadata?: Record<string, string>
  ): Promise<TResponse>;

  streamCall?<TRequest, TResponse>(
    service: string,
    method: string,
    request: TRequest,
    metadata?: Record<string, string>
  ): AsyncIterable<TResponse>;
}