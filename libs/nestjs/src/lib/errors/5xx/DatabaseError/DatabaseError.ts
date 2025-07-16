import { AppError } from "../../AppError/AppError";

export class NotFound extends AppError {
    constructor(message = "Error") {
        super(message, 404, false);
    }
}