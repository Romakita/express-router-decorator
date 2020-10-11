import {AfterRoutesInit, Module, PlatformApplication} from "@tsed/common";
import {ValidationErrorMiddleware} from "./middlewares/ValidationErrorMiddleware";
import {MONGOOSE_CONNECTIONS} from "./services/MongooseConnections";
import {MongooseService} from "./services/MongooseService";

/**
 * @ignore
 */
@Module({
  imports: [MONGOOSE_CONNECTIONS]
})
export class MongooseModule implements AfterRoutesInit {
  constructor(private platformApplication: PlatformApplication, private mongooseService: MongooseService) {}

  $afterRoutesInit(): void {
    this.platformApplication.use(ValidationErrorMiddleware as any);
  }

  $onDestroy(): Promise<any> | void {
    return this.mongooseService.closeConnections();
  }
}
