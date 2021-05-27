import {ApolloService} from "@tsed/apollo";
import {PlatformTest} from "@tsed/common";
import {TypeGraphQLService} from "@tsed/typegraphql";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

function createApolloServiceFixture() {
  const server = {
    server: "server"
  };

  const map = new Map();

  const apolloService = {
    createServer: async (key: string, options: any) => {
      map.set(key, {
        instance: server,
        options
      });

      return server;
    },
    get: (key: string) => map.get(key).instance,
    getSchema: (key: string) => "schema",
    has: (key: string) => map.has(key)
  };
  return {apolloService, server};
}

describe("TypeGraphQLService", () => {
  beforeEach(() =>
    PlatformTest.create({
      PLATFORM_NAME: "express"
    })
  );
  afterEach(() => {
    PlatformTest.reset();
    sandbox.restore();
  });

  describe("createServer()", () => {
    describe("when server options isn't given", () => {
      it("should create a server", async () => {
        const {apolloService} = createApolloServiceFixture();

        const service = await PlatformTest.invoke<TypeGraphQLService>(TypeGraphQLService, [
          {
            token: ApolloService,
            use: apolloService
          }
        ]);

        sandbox.stub(service, "createSchema");

        // @ts-ignore
        sandbox.stub(service, "createDataSources");

        const noop = () => ({});
        // GIVEN
        // @ts-ignore
        service.createSchema.returns({schema: "schema"});
        // @ts-ignore
        service.createDataSources.returns(noop);
        // WHEN

        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);
        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(result2).to.deep.eq(result1);
        expect(result1.server).to.deep.eq("server");
        expect(service.getSchema("key")).to.deep.eq("schema");
        expect(service.createSchema).to.have.been.calledOnceWithExactly({
          resolvers: [],
          container: PlatformTest.injector
        });
      });
    });
  });
  describe("createDataSources", () => {
    it(
      "should return a function with all dataSources",
      PlatformTest.inject([TypeGraphQLService], (service: any) => {
        const dataSources = sandbox.stub().returns({
          api: "api"
        });
        const serverConfigSources = sandbox.stub().returns({
          api2: "api2"
        });

        const fn = service.createDataSources(dataSources, serverConfigSources);

        expect(fn()).to.deep.eq({
          api2: "api2",
          api: "api"
        });
      })
    );
    it(
      "should do nothing",
      PlatformTest.inject([TypeGraphQLService], (service: any) => {
        const fn = service.createDataSources();

        expect(fn()).to.deep.eq({});
      })
    );
  });
});
