
<header class="symbol-info-header"><h1 id="registerservice">registerService</h1><label class="symbol-info-type-label function">Function</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.23.1/src//common/di/registries/ProviderRegistry.ts#L0-L0">/common/di/registries/ProviderRegistry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerService<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Add a new service in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerService, InjectorService} from "@tsed/common";

export default class MyFooService {
    constructor(){}
    getFoo() {
        return "test";
    }
}

registerService({provide: MyFooService});
// or
registerService(MyFooService);

const injector = new InjectorService();
injector.load();

const myFooService = injector.get<MyFooService>(MyFooService);
myFooService.getFoo(); // test
```

<!-- Members -->

