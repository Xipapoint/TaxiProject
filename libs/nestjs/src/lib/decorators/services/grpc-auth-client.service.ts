import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { 
  AUTH_SERVICE_NAME, 
  AuthServiceClient, 
  TokensAndDataRequest, 
  SuccessResponse, 
  RefreshTokensResponse,
  Packages
} from '@backend/grpc';
import { IAuthClient } from '../interfaces/auth-client.interface';

/**
 * gRPC implementation of the IAuthClient interface
 * 
 * This service handles communication with the authentication microservice
 * via gRPC for user session validation and token refresh operations.
 * 
 * Adheres to SOLID principles:
 * - SRP: Single responsibility of handling auth gRPC communication
 * - DIP: Implements IAuthClient abstraction for loose coupling
 * - ISP: Only implements authentication-related methods needed by the interface
 */
@Injectable()
export class GrpcAuthClientService implements IAuthClient, OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject(Packages.AUTH) 
    private readonly client: ClientGrpc
  ) {}

  /**
   * Initialize the gRPC service client on module initialization
   */
  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  /**
   * Authenticate user session with provided tokens and data
   * 
   * @param request - Contains user data, device info, and tokens to validate
   * @returns Promise resolving to success response indicating authentication status
   * @throws Error if gRPC communication fails or service is unavailable
   */
  async authenticate(request: TokensAndDataRequest): Promise<SuccessResponse> {
    try {
      return await lastValueFrom(this.authService.authenticate(request));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication service unavailable';
      throw new Error(`Authentication failed: ${errorMessage}`);
    }
  }

  /**
   * Refresh tokens when authentication fails due to expired tokens
   * 
   * @param request - Contains user data, device info, and refresh token
   * @returns Promise resolving to new token pair if refresh is successful
   * @throws Error if refresh fails or gRPC communication fails
   */
  async refreshTokens(request: TokensAndDataRequest): Promise<RefreshTokensResponse> {
    try {
      return await lastValueFrom(this.authService.refreshTokens(request));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh service unavailable';
      throw new Error(`Token refresh failed: ${errorMessage}`);
    }
  }
}
