
<header class="symbol-info-header"><h1 id="iinjectablepropertyservice">IInjectablePropertyService</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInjectablePropertyService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.23.1/src//common/di/interfaces/IInjectableProperties.ts#L0-L0">/common/di/interfaces/IInjectableProperties.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInjectablePropertyService <span class="token keyword">extends</span> <a href="#api/common/di/iinjectableproperty"><span class="token">IInjectableProperty</span></a> <span class="token punctuation">{</span>
    bindingType<span class="token punctuation">:</span> "method" | "property"<span class="token punctuation">;</span>
    propertyType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    useType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">bindingType<span class="token punctuation">:</span> "method" | "property"</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">propertyType<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useType<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>








