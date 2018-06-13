import {FilterService} from "../../../../src/common/filters/services/FilterService";
import {inject} from "../../../../src/testing";
import {expect, Sinon} from "../../../tools";

describe("FilterService", () => {
  before(
    inject([FilterService], (filterService: FilterService) => {
      this.filterService = filterService;
    })
  );

  describe("invokeMethod()", () => {
    describe("when the filter is known", () => {
      class Test {}

      before(() => {
        this.filter = {
          transform: Sinon.stub().returns("value")
        };
        this.getStub = Sinon.stub(this.filterService.injectorService, "get").returns(this.filter);
        this.result = this.filterService.invokeMethod(Test, "expression", "request", "response");
      });

      after(() => {
        this.getStub.restore();
      });

      it("should call injectorService.get", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should call instance.transform", () => {
        this.filter.transform.should.have.been.calledWithExactly("expression", "request", "response");
      });

      it("should invoke method from a filter", () => {
        expect(this.result).to.equal("value");
      });
    });

    describe("when the filter is known", () => {
      class Test {}

      before(() => {
        this.filter = {
          transform: Sinon.stub().returns("value")
        };
        this.getStub = Sinon.stub(this.filterService.injectorService, "get").returns(undefined);
        try {
          this.filterService.invokeMethod(Test, "expression", "request", "response");
        } catch (er) {
          this.error = er;
        }
      });

      it("should call injectorService.get", () => {
        this.getStub.should.have.been.calledWithExactly(Test);
      });

      it("should invoke method from a filter", () => {
        expect(this.result).to.equal("value");
      });
    });
  });
});
