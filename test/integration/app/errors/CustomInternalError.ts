import {IResponseError} from "@tsed/common";
import {InternalServerError} from "ts-httpexceptions";

export class CustomInternalError extends InternalServerError implements IResponseError {
  name = "CUSTOM_INTERNAL_SERVER_ERROR";
  errors: any[];
  headers = {};

  constructor(message: string) {
    super(message);
    this.errors = ["test"];
    this.headers = {
      "X-HEADER-ERROR": "deny"
    };
  }
}
