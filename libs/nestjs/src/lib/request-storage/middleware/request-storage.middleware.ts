import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { RequestStorage } from "../storage/RequestStorage";
import { NestjsInjectionToken } from "../../enums";

@Injectable()
export class RequestStorageMiddleware implements NestMiddleware {
  constructor(
    @Inject(NestjsInjectionToken.REQUEST_STORAGE)
    private readonly requestStorage: RequestStorage
  ) {}
  use(
    request: Request,
    response: Response,
    next: (error?: object) => void,
  ): void {
    this.requestStorage.reset();
    next();
  }
}