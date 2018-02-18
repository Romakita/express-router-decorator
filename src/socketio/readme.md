# @tsed/socketio
> Experimental feature. You can contribute to improve this feature !

A package of Ts.ED framework. See website: https://romakita.github.io/ts-express-decorators/

Socket.io enable real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.

## Installation

Before using the Socket.io, we need to install the [Socket.io](https://www.npmjs.com/package/socket.io) module.

```bash
npm install --save socket.io @types/socket.io @tsed/socketio
```

Then add the following configuration in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/socketio"; // import socketio Ts.ED module
import Path = require("path");
const rootDir = Path.resolve(__dirname)

@ServerSettings({
    rootDir,
    socketIO: {
        // ... see configuration
    }
})
export class Server extends ServerLoader {

}
```

## Socket Service

> Socket.IO allows you to “namespace” your sockets, which essentially means assigning different endpoints or paths.
This is a useful feature to minimize the number of resources (TCP connections) and at the same time separate concerns within your application
 by introducing separation between communication channels. See [namespace documentation](https://socket.io/docs/rooms-and-namespaces/#).

All Socket service work under a namespace and you can create one Socket service per namespace.

Example:

```typescript
import * as SocketIO from "socket.io";
import {SocketService, IO, Nsp, Socket, SocketSession} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {

    @Nsp nsp: SocketIO.Namespace;

    constructor(@IO private io: SocketIO.Server) {}
    /**
     * Triggered the namespace is created
     */
    $onNamespaceInit(nsp: SocketIO.Namespace) {

    }
    /**
     * Triggered when a new client connects to the Namespace.
     */
    $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {

    }
    /**
     * Triggered when a client disconnects from the Namespace.
     */
    $onDisconnect(@Socket socket: SocketIO.Socket) {

    }
}
```

> @SocketService inherit from @Service decorator. That means, a SocketService can be injected to another Service, Controller or Middleware.

### Declaring an Input Event

[@Input](api/socketio/input.md) decorator declare a method as a new handler for a specific `event`.

```typescript
@SocketService("/my-namespace")
export class MySocketService {
    @Input("eventName")
    myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
        console.log(userName);
    }
}
```

- [@Args](api/socketio/args.md) &lt;any|any[]&gt;: List of the parameters sent by the input event.
- [@Socket](api/socketio/socket.md) &lt;SocketIO.Socket&gt;: Socket instance.
- [@Nsp](api/socketio/nsp.md) &lt;[SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#)&gt;: Namespace instance.

### Send a response

You have a many choice to send a response to your client. Ts.ED offer some decorators to send a response:

![socketio](_media/socketio.png)

Example:

```typescript
@SocketService("/my-namespace")
export class MySocketService {
    @Input("eventName")
    @Emit("responseEventName") // or Broadcast or BroadcastOthers
    async myMethod(@Args(0) userName: string, @Socket socket: SocketIO.Socket) {
        return "Message " + userName;
    }
}
```
> The method accept a promise as returned value.

!> Return value is only possible when the method is decorated by [@Emit](api/socketio/emit.md), [@Broadcast](api/socketio/broadcast.md) and [@BroadcastOthers](api/socketio/broadcastothers.md).

### Socket Session

Ts.ED create a new session for each socket.

```typescript
@SocketService("/my-namespace")
export class MySocketService {
    @Input("eventName")
    @Emit("responseEventName") // or Broadcast or BroadcastOthers
    async myMethod(@Args(0) userName: string, @SocketSession session: SocketSession) {

        const user = session.get("user") || {}
        user.name = userName;

        session.set("user", user);

        return user;
    }
}
```

## Documentation

See our documentation https://romakita.github.io/ts-express-decorators/#/api/index