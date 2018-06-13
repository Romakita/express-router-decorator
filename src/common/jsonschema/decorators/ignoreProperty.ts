import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * Disable serialization for this property when the Converters service will render the JSON object.
 *
 * ?> This decorator is used by the Converters to serialize correctly your model.
 *
 * !> Swagger will not generate documentation for the ignored property.
 *
 * ```typescript
 * class User {
 *   @IgnoreProperty()
 *   _id: string;
 *
 *   @Property()
 *   firstName: string;
 *
 *   @Property()
 *   lastName: string;
 *
 *   @IgnoreProperty()
 *   password: string;
 * }
 * ```
 *
 * The controller:
 * ```typescript
 * import {Post, Controller, BodyParams} from "@tsed/common";
 * import {Person} from "../models/Person";
 *
 * @Controller("/")
 * export class UsersCtrl {
 *
 *   @Get("/")
 *   get(): User {
 *       const user = new User();
 *       user._id = "12345";
 *       user.firstName = "John";
 *       user.lastName = "Doe";
 *       user.password = "secretpassword";
 *         return
 *   }
 * }
 * ```
 *
 * The expected json object:
 *
 * ```json
 * {
 *  "firstName": "John",
 *  "lastName": "Doe"
 * }
 * ```
 *
 * @param {Type<any>} type
 * @returns {Function}
 * @decorator
 * @converters
 */
export function IgnoreProperty() {
  return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.ignoreProperty = true;
  });
}
