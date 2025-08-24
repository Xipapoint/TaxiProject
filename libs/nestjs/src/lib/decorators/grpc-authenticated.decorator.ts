import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthClient } from './interfaces/auth-client.interface';
import { TokensAndDataRequest, UserData, DeviceInfo } from '@backend/grpc';
import { AUTH_CLIENT_TOKEN } from './constants/injection-tokens';

/**
 * Type for request objects that may contain authentication data
 */
interface AuthenticatedRequest {
  tokens?: { accessToken: string; refreshToken: string };
  data?: { userData: UserData; deviceInfo: DeviceInfo };
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  user?: UserData;
  body?: { userData?: UserData; deviceInfo?: DeviceInfo };
  ip?: string;
  connection?: { remoteAddress?: string };
  refreshedTokens?: { accessToken: string; refreshToken: string };
}

/**
 * Metadata key for marking routes as requiring authentication
 */
export const GRPC_AUTHENTICATED_KEY = 'grpc_authenticated';

/**
 * Authentication options for the decorator
 */
export interface GrpcAuthenticationOptions {
  /**
   * Whether to attempt token refresh on authentication failure
   * @default true
   */
  autoRefresh?: boolean;
  
  /**
   * Custom error message when authentication fails
   */
  errorMessage?: string;
}

/**
 * Guard that handles gRPC-based authentication
 * 
 * This guard implements the following flow:
 * 1. Extract tokens and user data from the request
 * 2. Call the authenticate gRPC service
 * 3. If authentication fails and autoRefresh is enabled, attempt to refresh tokens
 * 4. Cache the refreshed tokens for the request context
 * 
 * Adheres to SOLID principles:
 * - SRP: Single responsibility of authentication verification
 * - OCP: Extensible through configuration options
 * - DIP: Depends on IAuthClient abstraction, not concrete implementation
 */
@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_CLIENT_TOKEN)
    private readonly authClient: IAuthClient
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route requires authentication
    const isAuthenticated = this.reflector.getAllAndOverride<GrpcAuthenticationOptions>(
      GRPC_AUTHENTICATED_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!isAuthenticated) {
      return true; // No authentication required
    }

    const request = this.getRequest(context);
    const authData = this.extractAuthenticationData(request);

    if (!authData) {
      throw new Error(isAuthenticated.errorMessage || 'Authentication data missing');
    }

    try {
      // Attempt authentication
      const authResult = await this.authClient.authenticate(authData);
      
      if (authResult.success) {
        return true;
      }

      // Authentication failed, attempt refresh if enabled
      if (isAuthenticated.autoRefresh !== false) {
        return await this.handleTokenRefresh(authData, request);
      }

      throw new Error(isAuthenticated.errorMessage || 'Authentication failed');
    } catch (error) {
      // If authentication fails and auto-refresh is enabled, try refreshing tokens
      if (isAuthenticated.autoRefresh !== false) {
        try {
          return await this.handleTokenRefresh(authData, request);
        } catch (refreshError) {
          const refreshErrorMessage = refreshError instanceof Error ? refreshError.message : 'Unknown error';
          throw new Error(
            isAuthenticated.errorMessage || 
            `Authentication and token refresh failed: ${refreshErrorMessage}`
          );
        }
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(isAuthenticated.errorMessage || errorMessage);
    }
  }

  /**
   * Handle token refresh logic
   * 
   * @param authData - Original authentication data
   * @param request - The request object to store refreshed tokens
   * @returns Promise<boolean> - true if refresh successful and re-authentication passes
   */
  private async handleTokenRefresh(authData: TokensAndDataRequest, request: AuthenticatedRequest): Promise<boolean> {
    try {
      // Attempt to refresh tokens
      const refreshResult = await this.authClient.refreshTokens(authData);
      
      if (!refreshResult.success || !refreshResult.data) {
        throw new Error('Token refresh failed');
      }

      // Create new auth data with refreshed tokens
      const newAuthData: TokensAndDataRequest = {
        ...authData,
        tokens: refreshResult.data
      };

      // Store refreshed tokens in request context for potential use by the route handler
      request.refreshedTokens = refreshResult.data;

      // Re-authenticate with new tokens
      const reAuthResult = await this.authClient.authenticate(newAuthData);
      
      if (!reAuthResult.success) {
        throw new Error('Re-authentication with refreshed tokens failed');
      }

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Token refresh failed: ${errorMessage}`);
    }
  }

  /**
   * Extract authentication data from the request
   * Supports different request types (HTTP, gRPC, etc.)
   */
  private extractAuthenticationData(request: AuthenticatedRequest): TokensAndDataRequest | null {
    // For gRPC requests, the data is typically in the request body/payload
    if (request.tokens && request.data) {
      return request as TokensAndDataRequest;
    }

    // For HTTP requests, extract from headers and body
    if (request.headers || request.cookies) {
      const accessToken = request.headers?.authorization?.replace('Bearer ', '') || 
                         request.cookies?.Authentication;
      const refreshToken = request.headers?.['refresh-token'] || 
                          request.cookies?.Refresh;

      if (!accessToken || !refreshToken) {
        return null;
      }

      // Extract user data from token payload or request body
      const userData: UserData = request.user || request.body?.userData;
      const deviceInfo: DeviceInfo = request.body?.deviceInfo || {
        device: request.headers?.['user-agent'] || 'unknown',
        ipAddress: request.ip || request.connection?.remoteAddress || 'unknown',
        location: request.headers?.['geo-location'] || 'unknown'
      };

      if (!userData) {
        return null;
      }

      return {
        data: {
          userData,
          deviceInfo
        },
        tokens: {
          accessToken,
          refreshToken
        }
      };
    }

    return null;
  }

  /**
   * Get request object from execution context
   * Handles different context types (HTTP, RPC, WebSocket)
   */
  private getRequest(context: ExecutionContext): AuthenticatedRequest {
    const contextType = context.getType();
    
    switch (contextType) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'rpc':
        return context.switchToRpc().getData();
      default:
        return context.getArgs()[0];
    }
  }
}

/**
 * Decorator factory for gRPC-based authentication
 * 
 * Usage examples:
 * 
 * Basic authentication:
 * ```typescript
 * @GrpcAuthenticated()
 * async myMethod() { ... }
 * ```
 * 
 * Disable auto-refresh:
 * ```typescript
 * @GrpcAuthenticated({ autoRefresh: false })
 * async myMethod() { ... }
 * ```
 * 
 * Custom error message:
 * ```typescript
 * @GrpcAuthenticated({ 
 *   errorMessage: 'Access denied for this resource' 
 * })
 * async myMethod() { ... }
 * ```
 * 
 * @param options - Authentication configuration options
 * @returns Method decorator that applies authentication guard
 */
export function GrpcAuthenticated(options: GrpcAuthenticationOptions = {}): MethodDecorator {
  return applyDecorators(
    SetMetadata(GRPC_AUTHENTICATED_KEY, {
      autoRefresh: true,
      ...options
    }),
    UseGuards(GrpcAuthGuard)
  );
}
