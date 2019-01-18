---
meta:
 - name: description
   content: Use Mongoose with Express, TypeScript and Ts.ED. Mongoose provides a straight-forward, schema-based solution to model your application data.
 - name: keywords
   content: ts.ed express typescript mongoose node.js javascript decorators
---
# Mongoose <Badge text="beta" type="warn"/> <Badge text="Contributors are welcome" />

<Banner src="http://mongodb-tools.com/img/mongoose.png" height="128" href="http://mongoosejs.com/"></Banner>

This tutorials show you, how you can use mongoose package with Ts.ED. 

## Feature

Currently, `@tsed/mongoose` allows you:
 
- Configure one or more MongoDB database connections via the `@ServerSettings` configuration. 
All databases will be initialized when the server starts during the server's `OnInit` phase.
- Declare a Model from a class with annotation,
- Add a plugin, PreHook method and PostHook on your model.
- Inject a Model to a Service, Controller, Middleware, etc...

::: tip Note
`@tsed/mongoose` use the JsonSchema and his decorators to generate the mongoose schema.
:::

## Installation

Before using the `@tsed/mongoose` package, we need to install the [mongoose](https://www.npmjs.com/package/mongoose) module.

```bash
npm install --save mongoose
npm install --save @tsed/mongoose
```

Then import `@tsed/mongoose` in your [ServerLoader](/api/common/server/components/ServerLoader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose"; // import mongoose ts.ed module

@ServerSettings({
   mongoose: {
       url: "mongodb://127.0.0.1:27017/db1",
       connectionOptions: {
           
       }
   }
})
export class Server extends ServerLoader {

}
```

## Multi databases

The mongoose module of Ts.ED Mongoose allows to configure several basic connections to MongoDB.
Here is an example configuration:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose"; // import mongoose ts.ed module

@ServerSettings({
    mongoose: {
       urls: {
           db1: {
               url: "mongodb://127.0.0.1:27017/db1",
               connectionOptions: {
                   
               }
           },
           db2: {
              url: "mongodb://127.0.0.1:27017/db2",
              connectionOptions: {
                  
              }
           }
       }
    }
})
export class Server extends ServerLoader {

}
```

## MongooseService

MongooseService let you to retrieve an instance of Mongoose.Connection. 

```typescript
import {Service} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";

@Service()
export class MyService {
    
    constructor(mongooseService: MongooseService) {
        mongooseService.get(); // return the default instance of Mongoose.
        // If you have one or more database configured with Ts.ED
        mongooseService.get("db1");
        mongooseService.get("db2");
    }
}
```

## API

Ts.ED give some decorators and service to write your code:

<ApiList query="labels.indexOf('mongoose') > -1 || module === '@tsed/mongoose' && symbolType === 'decorator'" />

## Declaring a Schema

By default, `@tsed/mongoose` reuse the metadata stored by the decorators dedicated
to describe a JsonSchema. These decorators come from the `@tsed/common` package.

To use subdocuments in a Model, the subdocument can be declared as either a Model or a Schema.

Here a schema example:

```typescript
import {Schema} from "@tsed/mongoose"

@Schema()
export class MySchema {
    
    unique: string;
}
```

## Declaring a Model

Mongoose only handle models directly.

Here a model example:

```typescript
import {
    Minimum, Maximum, MaxLength, MinLength, 
    Enum, Pattern, IgnoreProperty, Required, 
    PropertyType
} from "@tsed/common";
import {Model, Unique, Indexed, Ref} from "@tsed/mongoose"

enum Categories {
    CAT1 = "cat1",
    CAT2 = "cat2"
}

@Model()
export class MyModel {
    
    @IgnoreProperty() // exclude _id from mongoose in the generated schema
    _id: string;
    
    @Unique()
    @Required()
    unique: string;
    
    @Indexed()
    @MinLength(3)
    @MaxLength(50)
    indexed: string;
    
    @Minimum(0)
    @Maximum(100)
    rate: Number;
    
    @Enum(Categories)
    // or @Enum("type1", "type2")
    category: Categories;
    
    @Pattern(/[a-z]/) // equivalent of match field in mongoose 
    pattern: String;
}
```

## Collections

`@tsed/mongoose` supports both list and map. Map must 

```typescript
@PropertyType(String) list: string[];
@PropertyType(String) list: Map<string, string>;
```

## Inject model

It's possible to inject a model into a Service (or Controller, Middleware, etc...):

```typescript
import {Service, Inject} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {MyModel} from "./models/MyModel";

@Service()
export class MyService {
    
    constructor(@Inject(MyModel) private model: MongooseModel<MyModel>): MyModel {
        console.log(model) // Mongoose.model class
    }
    
    async save(obj: MyModel): MongooseModel<MyModel> {
        
        const doc = new this.model(obj);
        await doc.save();
        
        return doc;
    }
    
    async find(query: any) {
        const list = await this.model.find(query).exec();
        
        console.log(list);
        
        return list;
    }
}
```

## Register hook

Mongoose allows the developer to add pre and post [hooks / middlewares](http://mongoosejs.com/docs/middleware.html) to the schema. 
With this it is possible to add document transformations and observations before or after validation, save and more.

Ts.ED provide class decorator to register middlewares on the pre and post hook.

### Pre hook

We can simply attach a `@PreHook` decorator to your model class and
 define the hook function like you normally would in Mongoose.
 
```typescript
import {IgnoreProperty, Required} from "@tsed/common";
import {PreHook, Model} from "@tsed/mongoose";

@Model()
@PreHook("save", (car: CarModel, next) => {
    if (car.model === 'Tesla') {
        car.isFast = true;
      }
      next();
})
export class CarModel {
    
    @IgnoreProperty()
    _id: string;
    
    @Required()
    model: string;
    
    @Required()
    isFast: boolean;
    
    // or Prehook on static method
    @PreHook("save")
    static preSave(car: CarModel, next) {
       if (car.model === 'Tesla') {
           car.isFast = true;
       }
       next();
    }
}
```

This will execute the pre-save hook each time a `CarModel` document is saved. 

### Post hook

We can simply attach a `@PostHook` decorator to your model class and
 define the hook function like you normally would in Mongoose.
 
```typescript
import {IgnoreProperty, Required} from "@tsed/common";
import {PostHook, Model} from "@tsed/mongoose";

@Model()
@PostHook("save", (car: CarModel) => {
    if (car.topSpeedInKmH > 300) {
        console.log(car.model, 'is fast!');
    }
})
export class CarModel {
    
    @IgnoreProperty()
    _id: string;
    
    @Required()
    model: string;
    
    @Required()
    isFast: boolean;
    
    // or Prehook on static method
    @PostHook("save")
    static postSave(car: CarModel) {
       if (car.topSpeedInKmH > 300) {
           console.log(car.model, 'is fast!');
       }
    }
}
```

This will execute the post-save hook each time a `CarModel` document is saved. 

## Plugin

Using the `@Plugin` decorator enables the developer to attach various Mongoose plugins to the schema. 
Just like the regular `schema.plugin()` call, the decorator accepts 1 or 2 parameters: the plugin itself, and an optional configuration object. 
Multiple `plugin` decorator can be used for a single model class.

```typescript
import {IgnoreProperty, Required} from "@tsed/common";
import {MongoosePlugin, Model, MongooseModel} from "@tsed/mongoose";
import * as findOrCreate from 'mongoose-findorcreate';

@Model()
@MongoosePlugin(findOrCreate)
class UserModel {
  // this isn't the complete method signature, just an example
  static findOrCreate(condition: InstanceType<User>):
    Promise<{ doc: InstanceType<User>, created: boolean }>;
}

@Service()
class UserService {
    constructor(@Inject(UserModel) userModel: MongooseModel<UserModel>) {
        userModel.findOrCreate({ ... }).then(findOrCreateResult => {
          ...
        });
    }
}
```
::: tip
You can find a working example on [Mongoose & Swagger here](https://github.com/Romakita/example-ts-express-decorator/tree/4.0.0/example-mongoose).
:::