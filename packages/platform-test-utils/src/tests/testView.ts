import {Controller, Get, Middleware, PlatformTest, UseBefore, View} from "@tsed/common";
import {Locals} from "@tsed/common/src/mvc/decorators/params/locals";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";
import {EOL} from "os";

@Middleware()
class LocalsMiddleware {
  use(@Locals() locals: any) {
    locals.localID = "local-10909";
  }
}

@Controller("/views")
class ViewCtrl {
  @Get("/scenario-1")
  @UseBefore(LocalsMiddleware)
  @View("view.ejs", {opts: "opts"})
  testScenario1() {
    return {
      world: "world"
    };
  }

  @Get("/scenario-2")
  @View("view", {opts: "opts"}) // missing extension
  testScenario2() {
    return {
      world: "world"
    };
  }
}

export function testView(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ViewCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: GET /rest/views/scenario-1", () => {
    it("should render a view", async () => {
      const response = await request.get("/rest/views/scenario-1").expect(200);

      expect(response.text).to.deep.equal(`<p>Hello world with opts and ID local-10909</p>${EOL}`);
    });
  });

  describe("Scenario2: GET /rest/views/scenario-2", () => {
    it("should throw an error when extension is not defined", async () => {
      const response = await request.get("/rest/views/scenario-2").expect(500);

      expect(response.text).to.deep.equal(
        "Template rendering error: ViewCtrl.testScenario2()<br />Error: No default engine was specified and no extension was provided."
      );
    });
  });
}
