import { TokenPair, UserData } from "@backend/grpc";

export interface ResponseOnCreateUserSession {
    userData: UserData;
    tokenPair: TokenPair;
}