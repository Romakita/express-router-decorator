import {Type} from "@tsed/core";
import {LocalsFilter} from "../components/LocalsFilter";
import {ParamTypes} from "../interfaces/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";
import {IParamOptions} from "../interfaces/IParamOptions";

/**
 * Locals return the value from [response.locals](http://expressjs.com/en/4x/api.html#res.locals) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@Locals() locals: any) {
 *       console.log('Entire locals', locals);
 *    }
 *
 *    @Get('/')
 *    get(@Locals('user') user: any) {
 *       console.log('user', user);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @returns {Function}
 */
export function Locals(expression: string, useType: Type<any> | Function): ParameterDecorator;
export function Locals(expression: string): ParameterDecorator;
export function Locals(useType: Type<any> | Function): ParameterDecorator;
export function Locals(options: IParamOptions<any>): ParameterDecorator;
export function Locals(): ParameterDecorator;
export function Locals(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseFilter(LocalsFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.LOCALS
  });
}
