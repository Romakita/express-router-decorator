import {Err, HandlerMetadata, HandlerType, ParamTypes, PlatformTest} from "@tsed/common";
import {PlatformExpressHandler} from "@tsed/platform-express";
import {expect} from "chai";
import Sinon from "sinon";
import {buildPlatformHandler, invokePlatformHandler} from "../../../../test/helper/buildPlatformHandler";
import {createFakePlatformContext} from "../../../../test/helper/createFakePlatformContext";

const sandbox = Sinon.createSandbox();

describe("PlatformExpressHandler", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });

  describe("createHandler", () => {
    describe("ENDPOINT", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler<PlatformExpressHandler>(PlatformExpressHandler);

        class Test {
          get() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.ENDPOINT,
          propertyKey: "get"
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(3);
      });
    });
    describe("MIDDLEWARE", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.MIDDLEWARE,
          propertyKey: "use"
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(3);
      });
      it("should return a native handler with 4 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use(@Err() err: unknown) {}
        }

        PlatformTest.invoke(Test);

        const metadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.MIDDLEWARE,
          propertyKey: "use"
        });

        // WHEN
        const handler = platformHandler.createHandler(metadata);

        // THEN
        expect(metadata.hasErrorParam).to.eq(true);
        expect(handler).to.not.eq(metadata.handler);
        expect(handler.length).to.eq(4);
      });
    });
    describe("$CTX", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: (ctx: any) => {},
          type: HandlerType.CTX_FN
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(3);
      });
      it("should catch error from handler", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        const error = new Error("test");
        PlatformTest.invoke(Test);

        const $ctx = createFakePlatformContext(sandbox);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: (ctx: any) => {
            throw error;
          },
          type: HandlerType.CTX_FN
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(3);

        const next = sandbox.stub();

        await handler($ctx.getRequest(), $ctx.getResponse(), next);

        expect(next).to.have.been.calledWithExactly(error);
      });
    });
    describe("FUNCTION", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: (req: any, res: any, next: any) => {},
          type: HandlerType.RAW_FN
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.eq(handlerMetadata.handler);
      });
    });
  });
  describe("getArg()", () => {
    it("should return REQUEST", async () => {
      // GIVEN
      const {param, request, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.REQUEST
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(request);
    });
    it("should return RESPONSE", async () => {
      // GIVEN
      const {param, response, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.RESPONSE
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(response);
    });
    it("should return NEXT", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.NEXT_FN
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.next);
    });
    it("should return ERR", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.ERR
      });
      h.err = new Error();

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.err);
    });

    it("should return $CTX", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.$CTX
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request.$ctx);
    });

    it("should return RESPONSE_DATA", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.RESPONSE_DATA
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request.$ctx.data);
    });

    it("should return ENDPOINT_INFO", async () => {
      // GIVEN
      const {param, request, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.ENDPOINT_INFO
      });

      // @ts-ignore
      request.$ctx.endpoint = "endpoint";
      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(request.$ctx.endpoint);
    });

    it("should return BODY", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.BODY
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().body);
    });

    it("should return PATH", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.PATH
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().params);
    });

    it("should return QUERY", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.QUERY
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().query);
    });

    it("should return HEADER", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.HEADER
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq({
        accept: "application/json",
        "content-type": "application/json"
      });
    });

    it("should return COOKIES", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.COOKIES
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().cookies);
    });

    it("should return SESSION", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.SESSION
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request.session);
    });

    it("should return LOCALS", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        sandbox,
        token: PlatformExpressHandler,
        type: ParamTypes.LOCALS
      });
      h.err = new Error();

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getResponse().locals);
    });

    it("should return request by default", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        type: "UNKNOWN",
        sandbox,
        token: PlatformExpressHandler
      });
      param.expression = "test";

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest());
    });
  });
});
