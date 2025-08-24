import { TokensAndDataRequest, SuccessResponse, RefreshTokensResponse } from '@backend/grpc';

/**
 * Interface for authentication client service
 * Used by the GrpcAuthenticated decorator to communicate with auth service
 */
export interface IAuthClient {
  /**
   * Authenticate user session with provided tokens and data
   * @param request - Contains user data, device info, and tokens
   * @returns Promise resolving to success response
   */
  authenticate(request: TokensAndDataRequest): Promise<SuccessResponse>;

  /**
   * Refresh tokens when authentication fails due to expired tokens
   * @param request - Contains user data, device info, and refresh token
   * @returns Promise resolving to new token pair
   */
  refreshTokens(request: TokensAndDataRequest): Promise<RefreshTokensResponse>;
}
