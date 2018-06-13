import {ServerSettingsService} from "../../../../src/common/config/services/ServerSettingsService";
import {GlobalAcceptMimesMiddleware} from "../../../../src/common/mvc/components/GlobalAcceptMimesMiddleware";
import {inject} from "../../../../src/testing/inject";
import {FakeRequest} from "../../../helper/FakeRequest";
import {assert, expect} from "../../../tools";

describe("GlobalAcceptMimesMiddleware", () => {
  before(
    inject([], () => {
      const settings = new ServerSettingsService();
      settings.acceptMimes = ["application/json"];

      this.middleware = new GlobalAcceptMimesMiddleware(settings);
      this.request = new FakeRequest();
    })
  );

  describe("accept", () => {
    before(() => {
      this.request.mime = "application/json";
    });
    it("should return nothing", () => {
      expect(this.middleware.use(this.request)).to.eq(undefined);
    });
  });

  describe("not accept", () => {
    before(() => {
      this.request.mime = "text/html";
    });

    it("should throws NotAcceptable", () => {
      assert.throws(() => {
        this.middleware.use(this.request);
      }, "You must accept content-type application/json");
    });
  });
});
