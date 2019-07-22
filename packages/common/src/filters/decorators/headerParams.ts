import {Type} from "@tsed/core";
import {HeaderParamsFilter} from "../components/HeaderParamsFilter";
import {ParamTypes} from "../interfaces/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";
import {IParamOptions} from "../interfaces/IParamOptions";

/**
 * HeaderParams return the value from [request.params](http://expressjs.com/en/4x/api.html#req.params) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@Header() body: any) {
 *       console.log('Entire body', body);
 *    }
 *
 *    @Get('/')
 *    get(@Header('x-token') token: string) {
 *       console.log('token', id);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @returns {ParameterDecorator}
 */
export function HeaderParams(expression: string, useType: Type<any> | Function): ParameterDecorator;
export function HeaderParams(expression: string): ParameterDecorator;
export function HeaderParams(useType: Type<any> | Function): ParameterDecorator;
export function HeaderParams(options: IParamOptions<any>): ParameterDecorator;
export function HeaderParams(): ParameterDecorator;
export function HeaderParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseFilter(HeaderParamsFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.HEADER
  });
}
