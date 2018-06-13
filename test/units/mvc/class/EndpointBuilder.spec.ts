import * as Express from "express";
import {EndpointBuilder} from "../../../../src/common/mvc/class/EndpointBuilder";

import {EndpointMetadata} from "../../../../src/common/mvc/class/EndpointMetadata";
import {HandlerBuilder} from "../../../../src/common/mvc/class/HandlerBuilder";
import {inject} from "../../../../src/testing/inject";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";
import {expect, Sinon} from "../../../tools";

class Test {
  method() {
    return "test";
  }
}

describe("EndpointBuilder", () => {
  before(
    inject([], () => {
      this.router = Express.Router();
      this.builder = {
        build: Sinon.stub().returns(() => {})
      };
      this.fromStub = Sinon.stub(HandlerBuilder, "from").returns(this.builder);

      Sinon.stub(this.router, "use");
      Sinon.stub(this.router, "get");

      this.endpointMetadata = new EndpointMetadata(Test, "method");
      this.endpointBuilder = new EndpointBuilder(this.endpointMetadata, this.router);
    })
  );

  after(() => {
    this.router.get.restore();
    this.router.use.restore();
    this.fromStub.restore();
  });

  describe("build()", () => {
    describe("with use method", () => {
      describe("when there is no path", () => {
        before(() => {
          this.router.get.reset();
          this.router.use.reset();
          this.middlewares = this.endpointBuilder.build({injector: "injector", settings: {debug: true}});
        });

        it("should build middlewares", () => {
          expect(this.middlewares)
            .to.be.an("array")
            .and.have.length(3);
        });

        it("should call HandlerBuilder", () => {
          return this.fromStub.should.have.been.called;
        });

        it("should call use method", () => this.router.use.should.have.been.calledOnce);

        it("should call with args", () => {
          this.router.use.should.have.been.calledWithExactly(...this.middlewares);
        });

        it("should build handler", () => {
          this.builder.build.should.have.been.calledWithExactly({injector: "injector", settings: {debug: true}});
        });
      });

      describe("when there is a path", () => {
        before(() => {
          this.router.get.reset();
          this.router.use.reset();
          this.endpointMetadata.path = "/";
          this.middlewares = this.endpointBuilder.build({injector: "injector", settings: {debug: true}});
        });

        it("should build middlewares", () => {
          expect(this.middlewares)
            .to.be.an("array")
            .and.have.length(3);
        });

        it("should call HandlerBuilder", () => {
          return this.fromStub.should.have.been.called;
        });

        it("should call use method", () => this.router.use.should.have.been.calledOnce);

        it("should call with args", () => {
          this.router.use.should.have.been.calledWithExactly(...["/"].concat(this.middlewares));
        });
        it("should build handler", () => {
          this.builder.build.should.have.been.calledWithExactly({injector: "injector", settings: {debug: true}});
        });
      });
    });

    describe("with get method", () => {
      before(() => {
        this.router.get.reset();
        this.router.use.reset();
        this.endpointMetadata.httpMethod = "get";
        this.endpointMetadata.path = "/";
        this.result = this.endpointBuilder.build({injector: "injector", settings: {debug: true}});
      });

      it("should build middlewares", () => {
        expect(this.result)
          .to.be.an("array")
          .and.have.length(3);
      });

      it("should call HandlerBuilder", () => {
        return this.fromStub.should.have.been.called;
      });

      it("should call get method", () => this.router.get.should.have.been.calledOnce);

      it("should call with args", () => {
        this.router.get.should.have.been.calledWithExactly("/", Sinon.match.func, Sinon.match.func, Sinon.match.func);
      });
    });
  });

  describe("onRequest()", () => {
    before(() => {
      this.request = new FakeRequest();
      this.request.id = 1;
      this.response = new FakeResponse();
      Sinon.stub(this.response, "setHeader");
      this.nextSpy = Sinon.spy(() => {});
    });

    after(() => {
      this.response.setHeader.restore();
    });

    describe("without headersSent", () => {
      before(() => {
        this.endpointBuilder.onRequest(this.endpointMetadata, true)(this.request, this.response, this.nextSpy);
        this.request.storeData({stored: true});
      });

      it("should attach getEndpoint method to the current request", () => {
        expect(this.request.getEndpoint).to.be.a("function");
      });

      it("should return EndpointMetadata", () => {
        expect(this.request.getEndpoint()).to.equal(this.endpointMetadata);
      });

      it("should attach storeData method to the current request", () => {
        expect(this.request.storeData).to.be.a("function");
      });

      it("should attach getStoredData method to the current request", () => {
        expect(this.request.getStoredData).to.be.a("function");
      });

      it("should return an Object when it call getStoredData", () => {
        expect(this.request.getStoredData()).to.be.an("object");
      });
    });

    describe("with headersSent", () => {
      before(() => {
        this.response.setHeader.reset();
        this.response.headersSent = true;

        this.endpointBuilder.onRequest(this.endpointMetadata, true)(this.request, this.response, this.nextSpy);
        this.request.storeData({stored: true});
      });

      it("shouldn't set header", () => this.response.setHeader.should.not.have.been.called);

      it("should attach getEndpoint method to the current request", () => {
        expect(this.request.getEndpoint).to.be.a("function");
      });

      it("should return EndpointMetadata", () => {
        expect(this.request.getEndpoint()).to.equal(this.endpointMetadata);
      });

      it("should attach storeData method to the current request", () => {
        expect(this.request.storeData).to.be.a("function");
      });

      it("should attach getStoredData method to the current request", () => {
        expect(this.request.getStoredData).to.be.a("function");
      });

      it("should return an Object when it call getStoredData", () => {
        expect(this.request.getStoredData()).to.be.an("object");
      });
    });
  });
});
