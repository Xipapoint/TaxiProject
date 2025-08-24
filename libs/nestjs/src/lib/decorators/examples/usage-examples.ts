/**
 * Example usage of the GrpcAuthenticated decorator
 * 
 * This file demonstrates how to use the authentication decorator
 * in various scenarios within a NestJS application.
 */

import { Controller, Get, Post, Body, Module } from '@nestjs/common';
import { GrpcAuthenticated, GrpcAuthClientService, AUTH_CLIENT_TOKEN } from '../index';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Packages } from '@backend/grpc';

// Example 1: Basic authentication
@Controller('protected')
export class ProtectedController {

  /**
   * Basic authentication - requires valid tokens
   * Auto-refresh is enabled by default
   */
  @Get('profile')
  @GrpcAuthenticated()
  async getProfile() {
    return { message: 'User profile data' };
  }

  /**
   * Authentication with disabled auto-refresh
   * If tokens are expired, authentication will fail without refresh attempt
   */
  @Get('strict-access')
  @GrpcAuthenticated({ autoRefresh: false })
  async getStrictData() {
    return { message: 'Strict access data' };
  }

  /**
   * Authentication with custom error message
   */
  @Post('sensitive-action')
  @GrpcAuthenticated({ 
    errorMessage: 'Insufficient privileges for this action' 
  })
  async performSensitiveAction(@Body() data: Record<string, unknown>) {
    return { message: 'Sensitive action completed', data };
  }

  /**
   * Authentication with all options configured
   */
  @Get('admin-only')
  @GrpcAuthenticated({ 
    autoRefresh: true,
    errorMessage: 'Admin access required'
  })
  async getAdminData() {
    return { message: 'Admin-only data' };
  }
}

// Example 2: Module configuration
@Module({
  imports: [
    // Configure gRPC client for auth service
    ClientsModule.register([
      {
        name: Packages.AUTH,
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE_URL || 'localhost:5001',
          package: 'auth',
          protoPath: 'path/to/auth.proto',
        },
      },
    ]),
  ],
  controllers: [ProtectedController],
  providers: [
    // Register the auth client service
    {
      provide: AUTH_CLIENT_TOKEN,
      useClass: GrpcAuthClientService,
    },
  ],
})
export class ExampleModule {}

/**
 * Usage Notes:
 * 
 * 1. Request Format:
 *    The decorator expects requests to contain authentication data in one of these formats:
 *    
 *    For gRPC requests:
 *    {
 *      data: {
 *        userData: { userId: "user123" },
 *        deviceInfo: { device: "chrome", location: "UA", ipAddress: "127.0.0.1" }
 *      },
 *      tokens: {
 *        accessToken: "eyJ...",
 *        refreshToken: "eyJ..."
 *      }
 *    }
 *    
 *    For HTTP requests:
 *    Headers:
 *    - Authorization: "Bearer <accessToken>"
 *    - refresh-token: "<refreshToken>"
 *    
 *    Or Cookies:
 *    - Authentication: "<accessToken>"
 *    - Refresh: "<refreshToken>"
 * 
 * 2. Response Handling:
 *    - If authentication succeeds, the route handler executes normally
 *    - If authentication fails and autoRefresh is enabled, token refresh is attempted
 *    - If refresh succeeds, new tokens are stored in request.refreshedTokens
 *    - If authentication/refresh fails, an error is thrown
 * 
 * 3. Error Handling:
 *    - Authentication errors are thrown as Error instances
 *    - Custom error messages can be provided via decorator options
 *    - The GrpcCatchFilter should be used to handle these errors appropriately
 * 
 * 4. Module Setup:
 *    - Register the GrpcAuthClientService as AUTH_CLIENT_TOKEN provider
 *    - Configure gRPC client for the auth service
 *    - Ensure the auth service endpoints are available
 */
