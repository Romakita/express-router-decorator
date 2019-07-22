import {Type} from "@tsed/core";
import {IInjectableParamSettings} from "../interfaces/IInjectableParamSettings";
import {ParamRegistry} from "../registries/ParamRegistry";

export function UseFilter(token: Type<any> | symbol, options: Partial<IInjectableParamSettings<any>> = {}): ParameterDecorator {
  return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): any => {
    const settings = Object.assign(
      {
        target,
        propertyKey,
        parameterIndex
      },
      options
    );

    if (typeof token === "symbol") {
      ParamRegistry.usePreHandler(token, settings);
    } else {
      ParamRegistry.useFilter(token, settings);
    }
  };
}
