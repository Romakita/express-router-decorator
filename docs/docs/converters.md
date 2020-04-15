# Converters

The @@ConverterService@@ service is responsible for serializing and deserializing objects.

It has two operation's modes:

- The first case use the [class models](/docs/model.md) to convert an object into a class (and vice versa).
- The second case is based on the JSON object itself to provide an object with the right types. For example the deserialization of dates.


The ConverterService is used by the following decorators:

<ApiList query="['BodyParams', 'Cookies', 'CookiesParams', 'PathParams', 'QueryParams', 'Session'].indexOf(symbolName) > -1" />

## Usage

Models can be used at the controller level.
Here is our model:

<<< @/docs/docs/snippets/converters/model-usage.ts

> Note: @@PropertyType@@ allow to specify the type of a collection.

And its uses on a controller:

<<< @/docs/docs/snippets/converters/controller-usage.ts

In this example, Person model is used both as input and output types.

::: tip
Because, in most case we use asynchronous calls (with async or promise), we have to use @@Returns@@ or @@ReturnsArray@@ decorators to 
tell swagger what is the model returns by your endpoint. If you don't use swagger, you can also use @@ReturnType@@ decorator instead to 
force converter serialization.

<<< @/docs/docs/snippets/converters/controller-usage-with-return-type.ts

:::

## Serialisation

When you use a class model as a return parameter, the Converters service will use the JSON Schema
of the class to serialize the JSON object.

Here is an example of a model whose fields are not voluntarily annotated:

```typescript
import {Property} from "tsed/common";

class User {
    _id: string;
    
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    password: string;
}
```

And our controller:

```typescript
import {Get, Controller} from "@tsed/common";
import {User} from "../models/User";

@Controller("/")
export class UsersCtrl {

    @Get("/")
    get(): User {
        const user = new User();
        user._id = "12345";
        user.firstName = "John";
        user.lastName = "Doe";
        user.password = "secretpassword";
        return 
    }
}
```

Our serialized `User` object will be:

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```
> Non-annotated fields will not be copied into the final object.

You can also explicitly tell the Converters service that the field should not be serialized with the decorator `@IgnoreProperty`.

<<< @/docs/docs/snippets/converters/model-ignore-props.ts

## Type converters

The Converters service relies on a subservice set to convert the following types:

- Basics: [String, Number et Boolean](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/PrimitiveConverter.ts),
- Objects: [Date](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/DateConverter.ts) et [Symbol](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/SymbolConverter.ts),
- Collections: [Array](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/ArrayConverter.ts), [Map](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/MapConverter.ts) et [Set](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/SetConverter.ts).

> Set and Map types will be converted into an JSON object (instead of Array).


Any of theses converters can be overrided with @@OverrideProvider@@ decorators:

<ApiList query="symbolType === 'class' && status.indexOf('converters') > -1" />

### Example

Here an example of a type converter:

<<< @/packages/common/src/converters/components/PrimitiveConverter.ts

### Create a custom converter

Ts.ED creates its own converter in the same way as the previous example.

To begin, you must add to your configuration the directory where are stored
your classes dedicated to converting types.

 
```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   componentsScan: [
       `${rootDir}/converters/**/**.js`
   ]
})
export class Server extends ServerLoader {
   
}       
```

Then you will need to declare your class with the @@Converter@@ annotation:

<<< @/packages/common/src/converters/components/ArrayConverter.ts

::: tip Note
This example will replace the default Ts.ED converter.
:::

It is therefore quite possible to replace all converters with your own classes (especially the Date).

## Validation

The Converter service provides some of the validation of a class model.
It will check the consistency of the JSON object with the data model. For example :

- If the JSON object contains one more field than expected in the model (`validationModelStrict` or `@ModelStrict`).
- If the field is mandatory @@Required@@,
- If the field is mandatory but can be `null` (`@Allow(null)`).

Here is a complete example of a model:

```typescript
import  {Required, PropertyName, Property, PropertyType, Allow} from "@tsed/common";

class EventModel {
    @Required()
    name: string;
     
    @PropertyName('startDate')
    startDate: Date;

    @Property({name: 'end-date'})
    endDate: Date;

    @PropertyType(TaskModel)
    @Required()
    @Allow(null)
    tasks: TaskModel[];
}

class TaskModel {
    @Required()
    subject: string;
    
    @Property()
    rate: number;
}
```

### validationModelStrict

The `strict` validation of an object can be modified either globally or for a specific model.

Here is an example of `strict` validation:


```typescript
import {InjectorService, ConvertersService, Required, Property} from "@tsed/common";

InjectorService.load();

class TaskModel {
    @Required()
    subject: string;
    
    @Property()
    rate: number;
}

const convertersService = InjectorService.get(ConvertersService);
convertersService.validationModelStrict = true;

convertersService.deserialize({unknowProperty: "test"}, TaskModel); // BadRequest
```

#### Global

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
   validationModelStrict: true | false
})
export class Server extends ServerLoader {
   
}      
```
> By default, the Converters service is configured on the `strict` mode.

#### ModelStrict

```typescript
import {ModelStrict, Required, Property} from "@tsed/common";

@ModelStrict(false)
class TaskModel {
   @Required()
   subject: string;
   
   @Property()
   rate: number;
   [key: string]: any; // recommended
}
````

In this case, the service will not raise more exception:

```typescript
import {InjectorService, ConvertersService} from "@tsed/common";

InjectorService.load();

const convertersService = InjectorService.get(ConvertersService);
convertersService.validationModelStrict = true;

const result = convertersService.deserialize({unknownProperty: "test"}, TaskModel);
console.log(result) // TaskModel {unknownProperty: "test"}
```

::: tip
If you have disabled `strict` validation at the global level, you can use the `@ModelStrict(true)` decorator
to enable validation for a specific model.
:::

### Converter AdditionalProperty Policy

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
    converter: {
        additionalProperty: "error" | "accept" | "ignore"
    }
})
export class Server extends ServerLoader {
   
}      
```
AdditionalProperty define the policy to adopt if the JSON object contains one more field than expected in the model.

- "error" Throw an error. Equal to `validationModelStrict: true`.
- "accept" Return original JSON object with additional properties `validationModelStrict: false`.
- "ignore" Remove all additional properties that not defined in the model.

::: Note
`additionalProperty` setting override `validationModelStrict` and is overrided by `@ModelStrict`.
:::



