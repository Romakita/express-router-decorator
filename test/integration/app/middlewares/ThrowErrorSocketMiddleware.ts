import {Args} from "../../../../src/socketio";
import {SocketMiddleware} from "../../../../src/socketio/decorators/socketMiddleware";

@SocketMiddleware()
export class ThrowErrorSocketMiddleware {
  use(
    @Args(0)
    userName: string[]
  ) {
    throw new Error("Test");
  }
}
