const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,u=globalThis,g=u.trustedTypes,m=g?g.emptyScript:"",b=u.reactiveElementPolyfillSupport,v=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},x=(t,e)=>!n(t,e),y={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=h(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:f).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??x)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,b?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const _=globalThis,w=t=>t,A=_.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,R=`<${C}>`,P=document,O=()=>P.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,T="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,M=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),V=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,J=P.createTreeWalker(P,129);function K(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",a=N;for(let e=0;e<s;e++){const s=t[e];let n,l,c=-1,d=0;for(;d<s.length&&(a.lastIndex=d,l=a.exec(s),null!==l);)d=a.lastIndex,a===N?"!--"===l[1]?a=H:void 0!==l[1]?a=M:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=j):void 0!==l[3]&&(a=j):a===j?">"===l[0]?(a=o??N,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?j:'"'===l[3]?D:B):a===D||a===B?a=j:a===H||a===M?a=N:(a=j,o=void 0);const p=a===j&&t[e+1].startsWith("/>")?" ":"";r+=a===N?s+R:c>=0?(i.push(n),s.slice(0,c)+S+s.slice(c)+E+p):s+E+(-2===c?e:p)}return[K(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class F{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const a=t.length-1,n=this.parts,[l,c]=Z(t,e);if(this.el=F.createElement(l,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[r++],s=i.getAttribute(t).split(E),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:a[2],strings:s,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?st:X}),i.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:o}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),J.nextNode(),n.push({type:2,index:++o});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===C)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)n.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===V)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=U(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);J.currentNode=i;let o=J.nextNode(),r=0,a=0,n=s[0];for(;void 0!==n;){if(r===n.index){let e;2===n.type?e=new Q(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new it(o,this,t)),this._$AV.push(e),n=s[++a]}r!==n?.index&&(o=J.nextNode(),r++)}return J.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new F(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Q(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=G(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const i=t;let a,n;for(t=o[0],a=0;a<o.length-1;a++)n=G(this,i[s+a],e,a),n===V&&(n=this._$AH[a]),r||=!U(n)||n!==this._$AH[a],n===q?t=q:t!==q&&(t+=(n??"")+o[a+1]),this._$AH[a]=n}r&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class st extends X{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??q)===V)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=_.litHtmlPolyfillSupport;ot?.(F,Q),(_.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Q(e.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const nt=rt.litElementPolyfillSupport;nt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const lt=new class{async request(t,e,s){const i={method:t,headers:{"Content-Type":"application/json"}};s&&(i.body=JSON.stringify(s));const o=await fetch(`/api/hacs_enhanced/${e}`,i);if(!o.ok)throw new Error(`API error: ${o.status}`);return o.json()}get(t){return this.request("GET",t)}post(t,e){return this.request("POST",t,e)}delete(t,e){return this.request("DELETE",t,e)}listRepositories(t={}){const e=new URLSearchParams;return t.search&&e.set("search",t.search),t.category&&e.set("category",t.category),t.sort&&e.set("sort",t.sort),t.page&&e.set("page",String(t.page)),t.limit&&e.set("limit",String(t.limit)),this.get(`repositories?${e}`)}getRepository(t){return this.get(`repositories/${t}`)}getInstalled(){return this.get("installed")}getStats(){return this.get("installed/stats")}getUpdates(){return this.get("updates")}install(t,e){return this.post("install",{repository:t,category:e})}update(t){return this.post("update",{repository_ids:t})}remove(t){return this.post("remove",{repository:t})}getConfig(){return this.get("config")}updateConfig(t){return this.post("config",t)}getCustomRepos(){return this.get("config/custom")}addCustomRepo(t,e){return this.post("config/custom",{repository:t,category:e})}removeCustomRepo(t){return this.delete("config/custom",{repository:t})}exportBackup(){return this.get("backup/export")}importBackup(t){return this.post("backup/import",t)}checkDependencies(){return this.get("dependencies")}refresh(){return this.post("refresh")}};class ct extends at{static properties={currentView:{type:String},stats:{type:Object}};constructor(){super(),this.currentView="dashboard",this.stats={}}static styles=r`
    :host {
      display: block; height: 100%;
      --primary-color: var(--primary-color, #03a9f4);
      --card-bg: var(--card-background-color, var(--paper-card-background-color, white));
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
    }
    .container { padding: 16px; max-width: 1400px; margin: 0 auto; }
    .nav { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid var(--divider-color, #e0e0e0); padding-bottom: 8px; flex-wrap: wrap; }
    .nav-btn {
      padding: 8px 16px; cursor: pointer; border: none; background: none;
      font-size: 14px; color: var(--secondary-text-color, #727272); border-radius: 8px 8px 0 0;
      transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--sidebar-selected-icon-color, rgba(0,0,0,0.05)); }
    .nav-btn.active { color: var(--primary-color); font-weight: 500; border-bottom: 2px solid var(--primary-color); }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .stat-card {
      background: var(--card-bg); border-radius: 12px; padding: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1));
      text-align: center;
    }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--primary-color); }
    .stat-label { font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; }
  `;async connectedCallback(){super.connectedCallback();try{this.stats=await lt.getStats()}catch(t){}}navigate(t){this.currentView=t}render(){return I`
      <div class="container">
        <div class="nav">
          ${[{view:"dashboard",label:"📊 概览"},{view:"browse",label:"🔍 浏览"},{view:"installed",label:"📦 已安装"},{view:"updates",label:"🔄 更新"},{view:"config",label:"⚙️ 配置"},{view:"backup",label:"💾 备份"}].map(t=>I`
            <button class="nav-btn ${this.currentView===t.view?"active":""}"
                    @click=${()=>this.navigate(t.view)}>${t.label}</button>
          `)}
        </div>
        ${"dashboard"===this.currentView?this.renderDashboard():""}
        ${"browse"===this.currentView?I`<browse-view></browse-view>`:""}
        ${"installed"===this.currentView?I`<installed-view></installed-view>`:""}
        ${"updates"===this.currentView?I`<updates-view></updates-view>`:""}
        ${"config"===this.currentView?I`<config-view></config-view>`:""}
        ${"backup"===this.currentView?I`<backup-view></backup-view>`:""}
      </div>
    `}renderDashboard(){return I`
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-value">${this.stats.total_installed??"-"}</div>
          <div class="stat-label">已安装</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.available_updates??"-"}</div>
          <div class="stat-label">可更新</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this.stats.total_repos??"-"}</div>
          <div class="stat-label">总仓库数</div>
        </div>
      </div>
      <h3>HACS Enhanced</h3>
      <p>为 HACS 提供增强的浏览和管理体验。使用顶部导航切换不同功能页面。</p>
    `}}class dt extends at{static properties={repo:{type:Object}};static styles=r`
    :host { display: block; }
    .card {
      background: var(--card-bg); border-radius: 12px; padding: 16px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0,0,0,0.1));
      cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
      height: 100%; display: flex; flex-direction: column;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .name { font-size: 14px; font-weight: 500; margin-bottom: 4px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .desc { font-size: 12px; color: var(--secondary-text-color); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; flex: 1; }
    .meta { display: flex; gap: 8px; font-size: 11px; color: var(--secondary-text-color); align-items: center; flex-wrap: wrap; }
    .tag { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 500; }
    .tag.integration { background: #e3f2fd; color: #1565c0; }
    .tag.plugin { background: #f3e5f5; color: #7b1fa2; }
    .tag.theme { background: #e8f5e9; color: #2e7d32; }
    .tag.appdaemon { background: #fff3e0; color: #e65100; }
    .stars { display: flex; align-items: center; gap: 2px; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .install-btn {
      padding: 4px 12px; border-radius: 6px; border: none; cursor: pointer;
      background: var(--primary-color); color: white; font-size: 12px; font-weight: 500;
    }
    .installed-badge { font-size: 11px; color: #2e7d32; font-weight: 500; }
  `;constructor(){super(),this.repo={}}render(){const t=this.repo,e=t.full_name||t.name||"unknown",s=t.description||"",i=t.category||"integration",o=t.stars||t.stargazers_count||0,r=t.installed||!1;return I`
      <div class="card">
        <div class="name" title=${e}>${e}</div>
        <div class="desc">${s}</div>
        <div class="meta">
          <span class="tag ${i}">${i}</span>
          <span class="stars">⭐ ${"number"==typeof o?o.toLocaleString():o}</span>
        </div>
        <div class="footer">
          ${r?I`<span class="installed-badge">✅ 已安装</span>`:I`<button class="install-btn" @click=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("install",{detail:t}))}}>安装</button>`}
        </div>
      </div>
    `}}customElements.define("repo-card",dt);class pt extends at{static properties={repos:{type:Array},total:{type:Number},search:{type:String},category:{type:String},sort:{type:String},page:{type:Number},loading:{type:Boolean}};constructor(){super(),this.repos=[],this.total=0,this.search="",this.category="",this.sort="stars",this.page=1,this.loading=!1,this.limit=50,this._searchTimer=void 0}static styles=r`
    :host { display: block; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid var(--divider-color); border-radius: 8px; font-size: 14px; background: var(--card-bg); color: var(--primary-text-color); }
    select { padding: 8px; border: 1px solid var(--divider-color); border-radius: 8px; font-size: 14px; background: var(--card-bg); color: var(--primary-text-color); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
    .loading { text-align: center; padding: 40px; color: var(--secondary-text-color); }
    .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 16px; align-items: center; }
    .page-btn { padding: 4px 12px; border: 1px solid var(--divider-color); border-radius: 4px; cursor: pointer; background: var(--card-bg); font-size: 13px; color: var(--primary-text-color); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .total { color: var(--secondary-text-color); font-size: 13px; margin-bottom: 8px; }
  `;async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){this.loading=!0;try{const t=await lt.listRepositories({search:this.search,category:this.category,sort:this.sort,page:this.page,limit:this.limit});this.repos=t.repositories,this.total=t.total}catch(t){console.error("Browse load error",t)}this.loading=!1}_onSearch(t){this.search=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.page=1,this._load()},300)}_onCategoryChange(t){this.category=t.target.value,this.page=1,this._load()}_onSortChange(t){this.sort=t.target.value,this.page=1,this._load()}_goPage(t){this.page=t,this._load()}render(){const t=Math.ceil(this.total/this.limit);return I`
      <div class="toolbar">
        <input class="search-input" placeholder="搜索仓库..." .value=${this.search} @input=${this._onSearch} />
        <select @change=${this._onCategoryChange}>
          <option value="">所有类型</option>
          <option value="integration">Integration</option>
          <option value="plugin">Plugin</option>
          <option value="theme">Theme</option>
          <option value="appdaemon">AppDaemon</option>
        </select>
        <select @change=${this._onSortChange}>
          <option value="stars">按星数</option>
          <option value="updated">最近更新</option>
          <option value="name">按名称</option>
        </select>
      </div>

      ${this.loading?I`<div class="loading">加载中...</div>`:I`
        <div class="total">共 ${this.total} 个仓库</div>
        <div class="grid">
          ${this.repos.map(t=>I`<repo-card .repo=${t}></repo-card>`)}
        </div>
        ${t>1?I`
          <div class="pagination">
            <button class="page-btn" ?disabled=${this.page<=1} @click=${()=>this._goPage(this.page-1)}>上一页</button>
            <span>第 ${this.page}/${t} 页</span>
            <button class="page-btn" ?disabled=${this.page>=t} @click=${()=>this._goPage(this.page+1)}>下一页</button>
          </div>
        `:""}
      `}
    `}}customElements.define("browse-view",pt);class ht extends at{static properties={installed:{type:Array},selected:{type:Object}};constructor(){super(),this.installed=[],this.selected=new Set}static styles=r`
    :host { display: block; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    th { font-weight: 500; color: var(--secondary-text-color, #727272); }
    td { color: var(--primary-text-color); }
    .actions { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .btn { padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .badge-ok { color: #2e7d32; }
    .badge-warn { color: #f57f17; }
    .badge-err { color: #c62828; }
    .empty { text-align: center; padding: 40px; color: var(--secondary-text-color); }
  `;async connectedCallback(){super.connectedCallback();try{const t=await lt.getInstalled();this.installed=t.installed}catch(t){console.error("load installed error",t)}}_toggle(t){this.selected.has(t)?this.selected.delete(t):this.selected.add(t),this.requestUpdate()}_toggleAll(){this.selected.size===this.installed.length?this.selected.clear():this.installed.forEach(t=>this.selected.add(t.full_name||t.id)),this.requestUpdate()}async _updateSelected(){const t=Array.from(this.selected);if(!t.length)return;await lt.update(t),this.selected.clear();const e=await lt.getInstalled();this.installed=e.installed}render(){return this.installed.length?I`
      <div class="actions">
        <button class="btn btn-primary" ?disabled=${!this.selected.size} @click=${this._updateSelected}>
          更新选中 (${this.selected.size})
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" .checked=${this.selected.size===this.installed.length&&this.installed.length>0} @change=${this._toggleAll} /></th>
            <th>仓库名</th>
            <th>类型</th>
            <th>当前版本</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${this.installed.map(t=>I`
            <tr>
              <td><input type="checkbox" .checked=${this.selected.has(t.full_name||t.id)} @change=${()=>this._toggle(t.full_name||t.id)} /></td>
              <td>${t.full_name||t.name||"unknown"}</td>
              <td>${t.category||"-"}</td>
              <td>${t.installed_version||"-"}</td>
              <td class=${t.update_available?"badge-warn":"badge-ok"}>
                ${t.update_available?"⚠️ 可更新":"✅ 最新"}
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `:I`<div class="empty">暂无已安装仓库</div>`}}customElements.define("installed-view",ht);class ut extends at{static properties={updates:{type:Array}};constructor(){super(),this.updates=[]}static styles=r`
    :host { display: block; }
    .actions { margin-bottom: 12px; }
    .btn { padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; }
    .btn-primary { background: var(--primary-color); color: white; }
    .update-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--card-bg); border-radius: 8px; margin-bottom: 8px; box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0,0,0,0.1)); }
    .info { flex: 1; }
    .name { font-weight: 500; font-size: 14px; color: var(--primary-text-color); }
    .version { font-size: 12px; color: var(--secondary-text-color); }
    .version .old { color: #999; text-decoration: line-through; margin-right: 4px; }
    .version .new { color: var(--primary-color); font-weight: 500; }
    .update-btn { padding: 4px 10px; border-radius: 4px; border: 1px solid var(--primary-color); background: transparent; color: var(--primary-color); cursor: pointer; font-size: 12px; }
    .no-updates { text-align: center; padding: 40px; color: var(--secondary-text-color); }
  `;async connectedCallback(){super.connectedCallback();try{const t=await lt.getUpdates();this.updates=t.updates}catch(t){console.error("load updates error",t)}}async _updateAll(){const t=this.updates.map(t=>t.full_name||t.id);await lt.update(t),window.location.reload()}async _updateOne(t){await lt.update([t]),window.location.reload()}render(){return this.updates.length?I`
      <div class="actions">
        <button class="btn btn-primary" @click=${this._updateAll}>全部更新 (${this.updates.length})</button>
      </div>
      ${this.updates.map(t=>I`
        <div class="update-item">
          <div class="info">
            <div class="name">${t.full_name}</div>
            <div class="version">
              <span class="old">${t.installed_version}</span>→
              <span class="new">${t.latest_version}</span>
            </div>
          </div>
          <button class="update-btn" @click=${()=>this._updateOne(t.full_name||t.id)}>更新</button>
        </div>
      `)}
    `:I`<div class="no-updates">✅ 所有仓库已是最新</div>`}}customElements.define("updates-view",ut);class gt extends at{static properties={customRepos:{type:Array},newRepo:{type:String},newCategory:{type:String},verified:{type:Object}};constructor(){super(),this.customRepos=[],this.newRepo="",this.newCategory="integration",this.verified=null}static styles=r`
    :host { display: block; }
    section { margin-bottom: 24px; }
    h3 { font-size: 16px; font-weight: 500; margin-bottom: 12px; color: var(--primary-text-color); }
    .repo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px; }
    .repo-item { display: flex; align-items: center; gap: 8px; padding: 12px; background: var(--card-bg); border-radius: 8px; box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0,0,0,0.1)); }
    .repo-item .info { flex: 1; }
    .repo-item .name { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
    .repo-item .cat { font-size: 11px; color: var(--secondary-text-color); }
    .btn { padding: 4px 10px; border-radius: 4px; border: none; cursor: pointer; font-size: 12px; }
    .btn-danger { background: #ef5350; color: white; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-outline { border: 1px solid var(--primary-color); background: transparent; color: var(--primary-color); }
    .add-form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; padding: 16px; background: var(--card-bg); border-radius: 8px; box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0,0,0,0.1)); }
    .add-form input { flex: 1; min-width: 200px; padding: 8px; border: 1px solid var(--divider-color); border-radius: 4px; font-size: 13px; background: var(--card-bg); color: var(--primary-text-color); }
    .add-form select { padding: 8px; border: 1px solid var(--divider-color); border-radius: 4px; font-size: 13px; background: var(--card-bg); color: var(--primary-text-color); }
    .verified-info { padding: 12px; background: #e8f5e9; border-radius: 6px; margin: 8px 0; font-size: 13px; color: #2e7d32; }
    .empty { text-align: center; padding: 20px; color: var(--secondary-text-color); }
  `;async connectedCallback(){super.connectedCallback();try{const t=await lt.getCustomRepos();this.customRepos=t.custom_repositories}catch(t){console.error("load config error",t)}}async _verifyRepo(){if(!this.newRepo.trim())return;let t=this.newRepo.trim();t.includes("github.com")&&(t=t.split("github.com/")[1]?.replace(/\.git$/,"")||t),this.verified={full_name:t,stars:"?"}}async _addRepo(){let t=this.newRepo.trim();if(t.includes("github.com")&&(t=t.split("github.com/")[1]?.replace(/\.git$/,"")||t),!t)return;await lt.addCustomRepo(t,this.newCategory),this.newRepo="",this.verified=null;const e=await lt.getCustomRepos();this.customRepos=e.custom_repositories}async _removeRepo(t){await lt.removeCustomRepo(t);const e=await lt.getCustomRepos();this.customRepos=e.custom_repositories}render(){return I`
      <section>
        <h3>➕ 添加自定义仓库</h3>
        <div class="add-form">
          <input placeholder="author/repo 或 https://github.com/author/repo" .value=${this.newRepo} @input=${t=>this.newRepo=t.target.value} />
          <select @change=${t=>this.newCategory=t.target.value}>
            <option value="integration">Integration</option>
            <option value="plugin">Plugin</option>
            <option value="theme">Theme</option>
            <option value="appdaemon">AppDaemon</option>
            <option value="python_script">Python Script</option>
          </select>
          <button class="btn btn-outline" @click=${this._verifyRepo}>验证</button>
          <button class="btn btn-primary" @click=${this._addRepo}>添加到列表</button>
        </div>
        ${this.verified?I`
          <div class="verified-info">📦 ${this.verified.full_name}</div>
        `:""}
      </section>

      <section>
        <h3>已添加的自定义仓库 (${this.customRepos.length})</h3>
        ${this.customRepos.length?I`
          <div class="repo-grid">
            ${this.customRepos.map(t=>I`
              <div class="repo-item">
                <div class="info">
                  <div class="name">${t.repository}</div>
                  <div class="cat">${t.category}</div>
                </div>
                <button class="btn btn-danger" @click=${()=>this._removeRepo(t.repository)}>移除</button>
              </div>
            `)}
          </div>
        `:I`<div class="empty">暂无自定义仓库</div>`}
      </section>
    `}}customElements.define("config-view",gt);class mt extends at{static properties={exporting:{type:Boolean},importing:{type:Boolean},message:{type:String}};constructor(){super(),this.exporting=!1,this.importing=!1,this.message=""}static styles=r`
    :host { display: block; max-width: 600px; }
    section { margin-bottom: 24px; padding: 20px; background: var(--card-bg); border-radius: 12px; box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0,0,0,0.1)); }
    h3 { font-size: 16px; font-weight: 500; margin-bottom: 8px; color: var(--primary-text-color); }
    p { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 12px; }
    .btn { padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .msg { padding: 10px 16px; background: #e8f5e9; border-radius: 6px; margin-top: 12px; font-size: 13px; color: #2e7d32; }
    .msg.error { background: #ffebee; color: #c62828; }
    .file-input { margin: 8px 0; }
  `;async _exportBackup(){this.exporting=!0,this.message="";try{const t=await lt.exportBackup(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(e),i=document.createElement("a");i.href=s,i.download=`hacs-backup-${(new Date).toISOString().slice(0,10)}.json`,i.click(),URL.revokeObjectURL(s),this.message="✅ 备份已下载"}catch(t){this.message="❌ 导出失败",this.messageClass="error"}this.exporting=!1}async _importBackup(t){const e=t.target.files?.[0];if(e){this.importing=!0,this.message="";try{const t=await e.text(),s=JSON.parse(t);await lt.importBackup(s),this.message=`✅ 导入成功: ${s.installed?.length||0} 个仓库, ${s.custom_repositories?.length||0} 个自定义`}catch(t){this.message="❌ 导入失败，请检查文件格式"}this.importing=!1}}render(){return I`
      <section>
        <h3>📤 导出备份</h3>
        <p>将当前已安装的仓库列表导出为 JSON 文件。</p>
        <button class="btn btn-primary" @click=${this._exportBackup} ?disabled=${this.exporting}>
          ${this.exporting?"导出中...":"导出已安装列表"}
        </button>
      </section>

      <section>
        <h3>📥 导入备份</h3>
        <p>从之前导出的 JSON 文件恢复仓库配置。</p>
        <input type="file" accept=".json" @change=${this._importBackup} class="file-input" />
      </section>

      ${this.message?I`<div class="msg">${this.message}</div>`:""}
    `}}customElements.define("backup-view",mt),customElements.define("hacs-enhanced-panel",ct);
