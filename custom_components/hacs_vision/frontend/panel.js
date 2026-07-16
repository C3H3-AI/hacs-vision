!function(){"use strict";
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=o.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&o.set(i,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new r(o,e,i)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:n,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,g=globalThis,u=g.trustedTypes,f=u?u.emptyScript:"",m=g.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!n(e,t),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&l(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const s=o?.call(this);r?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...c(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,o)=>{if(t)i.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of o){const o=document.createElement("style"),r=e.litNonce;void 0!==r&&o.setAttribute("nonce",r),o.textContent=t.cssText,i.appendChild(o)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=o;const s=r.fromAttribute(t,e.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(e,t,i,o=!1,r){if(void 0!==e){const s=this.constructor;if(!1===o&&(r=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??y)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:r},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==r||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[b("elementProperties")]=new Map,_[b("finalized")]=new Map,m?.({ReactiveElement:_}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const w=globalThis,k=e=>e,$=w.trustedTypes,S=$?$.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,R="?"+A,C=`<${R}>`,E=document,T=()=>E.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,F=Array.isArray,L="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,U=/>/g,M=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,P=/"/g,B=/^(?:script|style|textarea|title)$/i,N=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),V=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),q=new WeakMap,G=E.createTreeWalker(E,129);function W(e,t){if(!F(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const K=(e,t)=>{const i=e.length-1,o=[];let r,s=2===t?"<svg>":3===t?"<math>":"",a=I;for(let t=0;t<i;t++){const i=e[t];let n,l,d=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===I?"!--"===l[1]?a=O:void 0!==l[1]?a=U:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=M):void 0!==l[3]&&(a=M):a===M?">"===l[0]?(a=r??I,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?M:'"'===l[3]?P:H):a===P||a===H?a=M:a===O||a===U?a=I:(a=M,r=void 0);const p=a===M&&e[t+1].startsWith("/>")?" ":"";s+=a===I?i+C:d>=0?(o.push(n),i.slice(0,d)+z+i.slice(d)+A+p):i+A+(-2===d?t:p)}return[W(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class Y{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let r=0,s=0;const a=e.length-1,n=this.parts,[l,d]=K(e,t);if(this.el=Y.createElement(l,i),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=G.nextNode())&&n.length<a;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(z)){const t=d[s++],i=o.getAttribute(e).split(A),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?ee:"?"===a[1]?te:"@"===a[1]?ie:Q}),o.removeAttribute(e)}else e.startsWith(A)&&(n.push({type:6,index:r}),o.removeAttribute(e));if(B.test(o.tagName)){const e=o.textContent.split(A),t=e.length-1;if(t>0){o.textContent=$?$.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],T()),G.nextNode(),n.push({type:2,index:++r});o.append(e[t],T())}}}else if(8===o.nodeType)if(o.data===R)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=o.data.indexOf(A,e+1));)n.push({type:7,index:r}),e+=A.length-1}r++}}static createElement(e,t){const i=E.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,o){if(t===V)return t;let r=void 0!==o?i._$Co?.[o]:i._$Cl;const s=D(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=r:i._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,o)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??E).importNode(t,!0);G.currentNode=o;let r=G.nextNode(),s=0,a=0,n=i[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new Z(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new oe(r,this,e)),this._$AV.push(t),n=i[++a]}s!==n?.index&&(r=G.nextNode(),s++)}return G.currentNode=E,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),D(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>F(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new J(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new Y(e)),t}k(e){F(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const r of e)o===t.length?t.push(i=new Z(this.O(T()),this.O(T()),this,this.options)):i=t[o],i._$AI(r),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,t=this,i,o){const r=this.strings;let s=!1;if(void 0===r)e=X(this,e,t,0),s=!D(e)||e!==this._$AH&&e!==V,s&&(this._$AH=e);else{const o=e;let a,n;for(e=r[0],a=0;a<r.length-1;a++)n=X(this,o[i+a],t,a),n===V&&(n=this._$AH[a]),s||=!D(n)||n!==this._$AH[a],n===j?e=j:e!==j&&(e+=(n??"")+r[a+1]),this._$AH[a]=n}s&&!o&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class te extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class ie extends Q{constructor(e,t,i,o,r){super(e,t,i,o,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??j)===V)return;const i=this._$AH,o=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==j&&(i===j||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(Y,Z),(w.litHtmlVersions??=[]).push("3.3.3");const se=globalThis;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */class ae extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let r=o._$litPart$;if(void 0===r){const e=i?.renderBefore??null;o._$litPart$=r=new Z(t.insertBefore(T(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ae._$litElement$=!0,ae.finalized=!0,se.litElementHydrateSupport?.({LitElement:ae});const ne=se.litElementPolyfillSupport;ne?.({LitElement:ae}),(se.litElementVersions??=[]).push("4.2.2");const le="/api/hacs_vision";const de=new class{constructor(){this._token=null,this._hassRef=null}setHass(e){this._hassRef=e;try{e?.auth?.data?.access_token&&(this._token=e.auth.data.access_token)}catch(e){}}_getHeaders(){const e={"Content-Type":"application/json"};return this._token?e.Authorization=`Bearer ${this._token}`:this._hassRef?.auth?.data?.access_token&&(this._token=this._hassRef.auth.data.access_token,e.Authorization=`Bearer ${this._token}`),e}async request(e,t,i,o={}){const r={method:e,headers:this._getHeaders(),credentials:"include"};i&&(r.body=JSON.stringify(i)),r.signal=AbortSignal.timeout(3e4);try{const e=await fetch(`${le}/${t}`,r);if(!e.ok){const t=new Error(`API error: ${e.status}`);throw t.status=e.status,!o.suppressNetworkError&&this._onNetworkStatus&&(429===e.status?this._onNetworkStatus("rate_limited"):e.status>=500&&this._onNetworkStatus("server_error")),t}return this._onNetworkStatus&&this._onNetworkStatus("online"),e.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}get(e,t={}){return this.request("GET",e,null,t)}post(e,t){return this.request("POST",e,t)}delete(e,t){return this.request("DELETE",e,t)}listRepositories(e={}){const t=new URLSearchParams;return e.search&&t.set("search",e.search),e.category&&t.set("category",e.category),e.sort&&t.set("sort",e.sort),e.sortDir&&t.set("sortDir",e.sortDir),e.status&&t.set("status",e.status),e.tag&&t.set("tag",e.tag),e.page&&t.set("page",String(e.page)),e.limit&&t.set("limit",String(e.limit)),this.get(`repositories?${t}`)}getRepository(e){return this.get(`repositories/${e}`)}getInstalled(){return this.get("installed")}getStats(){return this.get("installed/stats")}getUpdates(){return this.get("updates")}install(e,t){return this.post("install",{repository:e,category:t})}update(e){return this.post("update",{repository_ids:e})}remove(e){return this.post("remove",{repository:e})}getConfig(){return this.get("config")}updateConfig(e){return this.post("config",e)}getCustomRepos(){return this.get("config/custom")}addCustomRepo(e,t){return this.post("config/custom",{repository:e,category:t})}removeCustomRepo(e){return this.delete("config/custom",{repository:e})}removeArchivedRepo(e){return this.post("management/remove_archived",{repository:e})}removeRenamedRepo(e){return this.post("management/remove_renamed",{old_name:e})}replaceRenamedRepo(e,t){return this.post("management/replace_renamed",{old_name:e,new_name:t})}exportBackup(){return this.get("backup/export")}importBackup(e){return this.post("backup/import",e)}checkDependencies(){return this.get("dependencies")}refresh(){return this.post("refresh")}redownload(e,t){return this.post("redownload",{repository:e,category:t})}ignoreRepo(e){return this.post("ignore",{repository:e})}unignoreRepo(e){return this.post("unignore",{repository:e})}ignoreVersion(e,t){return this.post("ignore-version",{repository:e,version:t})}unignoreVersion(e){return this.post("unignore-version",{repository:e})}getIgnoredVersions(){return this.get("ignored-versions")}getSkippedVersions(){return this.get("skipped-versions")}getHistory(){return this.get("history")}restartHA(){return this.post("restart")}reloadHA(){return this.post("reload").then(e=>{if(e.success)try{localStorage.removeItem("hacs_vision_pending_reload")}catch(e){}return e})}getPendingReloads(){try{return JSON.parse(localStorage.getItem("hacs_vision_pending_reload")||"[]")}catch(e){return[]}}addPendingReload(e){try{const t=this.getPendingReloads();t.includes(e)||(t.push(e),localStorage.setItem("hacs_vision_pending_reload",JSON.stringify(t)))}catch(e){}}clearPendingReloads(){try{localStorage.removeItem("hacs_vision_pending_reload")}catch(e){}}getSettings(){return this.get("settings")}updateSettings(e){return this.post("settings",e)}async callService(e,t,i={}){const o=this._hassRef;if(o?.callService)return o.callService(e,t,i);const r=this._getHeaders(),s=await fetch(`/api/services/${e}/${t}`,{method:"POST",headers:r,body:JSON.stringify(i)});if(!s.ok)throw new Error(`Service call failed: ${s.status}`);return s.json()}triggerAutoUpdate(){return this.callService("hacs_vision","auto_update_trigger")}reloadAutoUpdateSettings(){return this.callService("hacs_vision","auto_update_reload_settings")}startAutoUpdate(){return this.callService("hacs_vision","auto_update_start")}stopAutoUpdate(){return this.callService("hacs_vision","auto_update_stop")}getConfigEntries(){return this.get("config_entries")}getDeviceCounts(e){return this.get(`device_counts/${e}`,{suppressNetworkError:!0})}getAllDeviceCounts(){return this.get("device_counts",{suppressNetworkError:!0})}getVersion(){return this.get("version")}batchInstall(e){return this.post("batch/install",{repositories:e})}batchRemove(e){return this.post("batch/remove",{repositories:e})}checkUpdatesWithNotify(){return this.post("check_updates")}getFlowHandlers(){return this.get("config_flow/handlers")}startConfigFlow(e,t={}){return this.post("config_flow/start",{handler:e,...t})}stepConfigFlow(e,t){return this.post(`config_flow/step/${e}`,t)}cancelConfigFlow(e){return this.request("DELETE",`config_flow/flow/${e}`)}startOptionsFlow(e){return this.post("config_flow/options/start",{handler:e})}stepOptionsFlow(e,t){return this.post(`config_flow/options/step/${e}`,t)}startSubentryFlow(e,t,i){return this.post("config_flow/subentry/start",{handler:[e,t],...i})}stepSubentryFlow(e,t){return this.post(`config_flow/subentry/step/${e}`,t)}cancelSubentryFlow(e){return this.request("DELETE",`config_flow/subentry/flow/${e}`)}getSubentries(e){return this.request("GET",`config_entries/subentries/${e}`)}getTranslations(e,t){const i=t||"zh-Hans";return this.get(`translations/${encodeURIComponent(e)}?lang=${encodeURIComponent(i)}`)}getRepoStatus(e){return this.get(`repos/status/${encodeURIComponent(e)}`)}getFavorites(){return this.get("favorites")}setFavorites(e){return this.post("favorites",{favorites:e})}verifyGitHubToken(e){return this.post("github/verify_token",{token:e})}importHacsToken(){return this.get("github/import_token")}getGitHubUser(){return this.get("github/oauth/user")}oauthStart(){return this.post("github/oauth/start",{})}oauthPoll(e){return this.post("github/oauth/poll",{device_code:e})}starRepo(e){return this.post("github/star",{repo:e})}unstarRepo(e){return this.post("github/unstar",{repo:e})}autoStarRepo(){return this.post("github/auto-star",{})}checkStarred(e){return this.get(`github/starred/${encodeURIComponent(e)}`)}listStarred(){return this.get("github/starred")}syncStarred(e){return this.post("github/sync-starred",{repos:e})}syncStarsToFavorites(){return this.post("github/sync-favorites")}createIssue(e,t,i,o,r){return this.post("github/create-issue",{repo:e,title:t,body:i,domain:o,screenshots:r})}listOrgRepos(e){return this.get(`github/repos?org=${encodeURIComponent(e)}`)}getRepoReleases(e){return this.get(`repos/releases?id=${encodeURIComponent(e)}`)}installVersion(e,t){return this.post("repos/install_version",{id:e,version:t})}async getChangelog(e,t){const i=`hacs_changelog_${e}_${t||"latest"}`;try{const e=localStorage.getItem(i);if(e){const{data:t,timestamp:i}=JSON.parse(e);if(Date.now()-i<36e5)return t}}catch(e){}try{const o=t?`?tag=${encodeURIComponent(t)}`:"",r=await this.get(`changelog/${e}${o}`);try{localStorage.setItem(i,JSON.stringify({data:r,timestamp:Date.now()}))}catch(e){}return r}catch(e){return console.error("Changelog fetch failed:",e),null}}async getReadme(e){const t=`hacs_readme_${e}`;try{const e=localStorage.getItem(t);if(e){const{html:t,timestamp:i}=JSON.parse(e);if(Date.now()-i<36e5)return t}}catch(e){}try{const i=await fetch(`${le}/readme/${e}`,{headers:this._getHeaders(),credentials:"include"});if(i.ok){const e=await i.text();try{localStorage.setItem(t,JSON.stringify({html:e,timestamp:Date.now()}))}catch(e){}return e}return null}catch(e){return console.error("Failed to fetch README:",e),null}}async getReadmeTranslation(e,t,i){const o=new AbortController,r=setTimeout(()=>o.abort(),16e4);try{const r=await fetch(`${le}/readme/translate`,{method:"POST",headers:this._getHeaders(),credentials:"include",body:JSON.stringify({full_name:e,target_lang:t,source_html:i||null}),signal:o.signal});if(r.ok){return(await r.json()).html||null}try{const e=await r.json();if(e&&e.error)return{error:e.error}}catch(e){}return{error:"translation_failed"}}catch(e){return console.error("README translation failed:",e),{error:e&&"AbortError"===e.name?"agent_timeout":"network_error"}}finally{clearTimeout(r)}}},ce=e=>class extends e{static properties={_themeReady:{type:Boolean,state:!0}};constructor(){super(),this._themeReady=!1,this._cssSource=null}connectedCallback(){super.connectedCallback(),requestAnimationFrame(()=>{this._applyTheme(),this._themeReady=!0}),this._setupThemeObserver()}disconnectedCallback(){super.disconnectedCallback?.(),this._themeObserver&&(this._themeObserver.disconnect(),this._themeObserver=null)}_getHAVar(e,t=""){try{if(!this._cssSource){const t=document.querySelector("home-assistant")?.shadowRoot||document.querySelector("ha-app")?.shadowRoot||document.documentElement,i=[this.renderRoot?.host,t,document.documentElement,document.body];for(const t of i)if(t)try{const i=getComputedStyle(t).getPropertyValue(e).trim();if(i)return this._cssSource=t,i}catch(e){}try{if(window.parent&&window.parent!==window){const t=window.parent.document.querySelector("home-assistant")?.shadowRoot||window.parent.document.documentElement;if(t){const i=getComputedStyle(t).getPropertyValue(e).trim();if(i)return this._cssSource=t,i}}}catch(e){}this._cssSource=document.documentElement}return getComputedStyle(this._cssSource).getPropertyValue(e).trim()||t}catch(e){}return t}_applyTheme(){const e=this.renderRoot?.host||this,t=this._isDarkMode(),i={"--primary-background-color":t?"#111111":"#f5f5f5","--secondary-background-color":t?"#1c1c1c":"#e0e0e0","--primary-text-color":t?"#e1e1e1":"#212121","--secondary-text-color":t?"#9e9e9e":"#727272","--card-background-color":t?"#1c1c1c":"#ffffff","--divider-color":t?"#333333":"#e0e0e0","--primary-color":"#03a9f4","--rgb-primary-color":"3, 169, 244","--ha-card-border-radius":"12px"};for(const[t,o]of Object.entries(i)){const i=this._getHAVar(t);if(e.style.setProperty(t,i||o),"--primary-color"===t&&!i){const t=this._hexToRgb(o);t&&e.style.setProperty("--rgb-primary-color",t)}}const o=e.style.getPropertyValue("--primary-color").trim()||i["--primary-color"],r=this._getHAVar("--rgb-primary-color")||this._hexToRgb(o)||"3, 169, 244";e.style.setProperty("--rgb-primary-color",r)}_isDarkMode(){try{const e=document.documentElement.getAttribute("data-theme");if(e&&e.includes("dark"))return!0;const t=this._getHAVar("--primary-background-color");if(t){const e=this._parseColor(t);if(e){return.299*e.r+.587*e.g+.114*e.b<128}}const i=document.body?.getAttribute("data-theme");if(i&&i.includes("dark"))return!0}catch(e){}try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return!1}}_parseColor(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];if(3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),e.length>=6){const t=parseInt(e.substring(0,2),16),i=parseInt(e.substring(2,4),16),o=parseInt(e.substring(4,6),16);if(!isNaN(t+i+o))return{r:t,g:i,b:o}}}const i=e.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);return i?{r:parseInt(i[1]),g:parseInt(i[2]),b:parseInt(i[3])}:null}_hexToRgb(e){const t=e.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(t)return`${t[1]}, ${t[2]}, ${t[3]}`;if(3===(e=e.replace(/^#/,"")).length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)return null;const i=parseInt(e.substring(0,2),16),o=parseInt(e.substring(2,4),16),r=parseInt(e.substring(4,6),16);return isNaN(i+o+r)?null:`${i}, ${o}, ${r}`}_setupThemeObserver(){try{const e=document.querySelector("home-assistant")||document.querySelector("ha-app")||document.documentElement;e&&(this._themeObserver=new MutationObserver(()=>{this._themeObserver?._debounce||(this._themeObserver._debounce=!0,this._cssSource=null,setTimeout(()=>{this._themeObserver&&(this._themeObserver._debounce=!1),this._applyTheme()},200))}),this._themeObserver.observe(e,{attributes:!0,attributeFilter:["class","style"]}))}catch(e){}}},pe={zh:"zh","zh-cn":"zh","zh-hans":"zh","zh-hant":"zh","zh-tw":"zh","zh-hk":"zh",de:"de","de-de":"de","de-at":"de","de-ch":"de",en:"en","en-us":"en","en-gb":"en","en-au":"en","en-ca":"en"};let he="en",ge="en",ue=null;function fe(e){if(!e)return"en";const t=e.trim().toLowerCase();return pe[t]||pe[t.split("-")[0]]||"en"}!function(){try{const e=window.top||window.parent,t=e?.document?.querySelector("home-assistant");if(t?.hass?.language)return he=fe(t.hass.language),void(ge=he);const i=e?.document?.documentElement?.lang||"";if(i)return he=fe(i),void(ge=he)}catch(e){}try{he=fe(navigator.language),ge=he}catch(e){}}();const me={en:{label:"English",nativeLabel:"English"},zh:{label:"Chinese",nativeLabel:"中文"},de:{label:"German",nativeLabel:"Deutsch"}},be=[{code:"zh",key:"readmeLangZh"},{code:"en",key:"readmeLangEn"},{code:"de",key:"readmeLangDe"},{code:"ja",key:"readmeLangJa"},{code:"ko",key:"readmeLangKo"}],ve=["zh","en","de"],ye={storeTitle:{zh:"HACS Vision",en:"HACS Vision",de:"HACS Vision"},storeSubtitle:{zh:"浏览、管理和更新 HACS 仓库",en:"Browse, manage and update HACS repositories",de:"HACS-Repositorys durchsuchen, verwalten und aktualisieren"},statInstalled:{zh:"已安装",en:"Installed",de:"Installiert"},statUpdates:{zh:"可更新",en:"Updates",de:"Updates"},statFavorites:{zh:"收藏",en:"Favorites",de:"Favoriten"},statCustom:{zh:"自定义",en:"Custom",de:"Benutzerdefiniert"},statRepos:{zh:"仓库数",en:"Repos",de:"Repositorys"},tabBrowse:{zh:"商店",en:"Store",de:"Shop"},tabFavorites:{zh:"收藏",en:"Favorites",de:"Favoriten"},tabCustom:{zh:"自定义",en:"Custom",de:"Benutzerdefiniert"},tabInstalled:{zh:"已安装",en:"Installed",de:"Installiert"},tabUpdates:{zh:"更新",en:"Updates",de:"Updates"},tabConfig:{zh:"配置",en:"Config",de:"Einstellungen"},tabBackup:{zh:"备份",en:"Backup",de:"Backup"},tabManagement:{zh:"仓库管理",en:"Repository",de:"Verwaltung"},tabIntegrations:{zh:"集成管理",en:"Integrations",de:"Integrationen"},searchPlaceholder:{zh:"搜索或添加仓库...",en:"Search or add repositories...",de:"Repositorys suchen oder hinzufügen..."},searchInstalled:{zh:"搜索已安装...",en:"Search installed...",de:"Installierte durchsuchen..."},searchUpdates:{zh:"搜索可更新的仓库...",en:"Search for updates...",de:"Nach Updates suchen..."},filterStatus:{zh:"状态",en:"Status",de:"Status"},filterType:{zh:"类型",en:"Type",de:"Typ"},filterTags:{zh:"标记",en:"Tags",de:"Tags"},repoStatus:{zh:"仓库状态",en:"Repo Status",de:"Repo-Status"},statusAll:{zh:"全部",en:"All",de:"Alle"},statusInstalled:{zh:"已安装",en:"Installed",de:"Installiert"},statusNotInstalled:{zh:"未安装",en:"Not Installed",de:"Nicht installiert"},statusNotLoaded:{zh:"未加载",en:"Not Loaded",de:"Nicht geladen"},statusUpdateAvailable:{zh:"可更新",en:"Update Available",de:"Update verfügbar"},statusPendingRestart:{zh:"待重启",en:"Pending Restart",de:"Neustart ausstehend"},statusPendingReload:{zh:"待加载",en:"Pending Reload",de:"Neuladen ausstehend"},statusPendingUpgrade:{zh:"可更新",en:"Update Available",de:"Update verfügbar"},statusDefault:{zh:"未安装",en:"Available",de:"Verfügbar"},statusDisabled:{zh:"已禁用",en:"Disabled",de:"Deaktiviert"},typeAll:{zh:"全部",en:"All",de:"Alle"},typeIntegration:{zh:"集成",en:"Integration",de:"Integration"},typePlugin:{zh:"插件",en:"Plugin",de:"Plugin"},typeTheme:{zh:"主题",en:"Theme",de:"Theme"},typeTemplate:{zh:"模板",en:"Template",de:"Vorlage"},sortByStars:{zh:"按星数",en:"By Stars",de:"Nach Sternen"},sortByUpdated:{zh:"最近更新",en:"Recently Updated",de:"Kürzlich aktualisiert"},sortByName:{zh:"按名称",en:"By Name",de:"Nach Name"},sortByEntries:{zh:"按条目",en:"By Entries",de:"Nach Einträgen"},catAll:{zh:"全部",en:"All",de:"Alle"},catIntegration:{zh:"集成",en:"Integration",de:"Integration"},catPlugin:{zh:"插件",en:"Plugin",de:"Plugin"},catTheme:{zh:"主题",en:"Theme",de:"Theme"},catTemplate:{zh:"模板",en:"Template",de:"Vorlage"},catDashboard:{zh:"卡片",en:"Cards",de:"Karten"},catAppDaemon:{zh:"AppDaemon",en:"AppDaemon",de:"AppDaemon"},catNetDaemon:{zh:"NetDaemon",en:"NetDaemon",de:"NetDaemon"},catPythonScript:{zh:"Python 脚本",en:"Python Script",de:"Python-Skript"},catCustom:{zh:"自定义",en:"Custom",de:"Benutzerdefiniert"},totalRepos:{zh:"个仓库",en:"repositories",de:"Repositorys"},noMatch:{zh:"没有匹配的仓库",en:"No matching repositories",de:"Keine passenden Repositorys"},noMatchAdd:{zh:"未在 HACS 中找到此仓库，点击下方直接添加为自定义仓库",en:"Not found in HACS, click below to add as custom repository",de:"Nicht in HACS gefunden, klicken Sie unten, um als benutzerdefiniertes Repository hinzuzufügen"},addFromSearch:{zh:"添加为自定义仓库",en:"Add as custom repository",de:"Als benutzerdefiniertes Repository hinzufügen"},noData:{zh:"暂无仓库数据",en:"No repository data",de:"Keine Repository-Daten"},noDevicesOrEntities:{zh:"暂无设备或实体",en:"No devices or entities",de:"Keine Geräte oder Entitäten"},entityCount:{zh:"个实体",en:" entities",de:" Entitäten"},searching:{zh:"查找中...",en:"Searching...",de:"Suche..."},loading:{zh:"加载中...",en:"Loading...",de:"Lade..."},sort:{zh:"排序",en:"Sort",de:"Sortieren"},filterMore:{zh:"筛选与排序",en:"Filter & Sort",de:"Filter & Sortieren"},prevPage:{zh:"← 上一页",en:"← Previous",de:"← Zurück"},nextPage:{zh:"下一页 →",en:"Next →",de:"Weiter →"},page:{zh:"第",en:"Page",de:"Seite"},of:{zh:"/ ",en:" / ",de:" / "},installed:{zh:"已安装",en:"Installed",de:"Installiert"},install:{zh:"安装",en:"Install",de:"Installieren"},update:{zh:"更新",en:"Update",de:"Aktualisieren"},redownload:{zh:"重新下载",en:"Redownload",de:"Erneut herunterladen"},ignore:{zh:"忽略",en:"Ignore",de:"Ignorieren"},confirmIgnore:{zh:"确定要忽略 {repo} 吗？将不再出现在搜索结果和更新提醒中。",en:"Ignore {repo}? It will no longer appear in search results or update notifications.",de:"{repo} ignorieren? Es wird nicht mehr in Suchergebnissen oder Update-Benachrichtigungen angezeigt."},ignoreVersion:{zh:"跳过此版本",en:"Skip this version",de:"Diese Version überspringen"},unignoreVersion:{zh:"取消跳过此版本",en:"Unskip this version",de:"Überspringen rückgängig"},confirmIgnoreVersion:{zh:"确定跳过 {repo} 的 {version} 更新？下次新版本会正常提醒。",en:"Skip {version} for {repo}? Next version will still notify.",de:"{version} für {repo} überspringen? Die nächste Version wird wieder benachrichtigt."},remove:{zh:"卸载",en:"Uninstall",de:"Deinstallieren"},detail:{zh:"详情",en:"Detail",de:"Details"},noDesc:{zh:"暂无描述",en:"No description",de:"Keine Beschreibung"},favOn:{zh:"已收藏",en:"Favorited",de:"Favorisiert"},favOff:{zh:"收藏",en:"Favorite",de:"Favorisieren"},tagFavorites:{zh:"收藏",en:"Favorites",de:"Favoriten"},tagNew:{zh:"新发现",en:"New",de:"Neu"},tagCustom:{zh:"自定义",en:"Custom",de:"Benutzerdefiniert"},badgeConfigured:{zh:"已配置",en:"Configured",de:"Konfiguriert"},badgeLoadFailed:{zh:"加载失败",en:"Load Failed",de:"Laden fehlgeschlagen"},loadFailedSimple:{zh:"加载失败",en:"Failed to load",de:"Laden fehlgeschlagen"},loadingText:{zh:"加载中...",en:"Loading...",de:"Lade..."},adding:{zh:"添加中...",en:"Adding...",de:"Füge hinzu..."},addSelected:{zh:"添加选中",en:"Add Selected",de:"Auswahl hinzufügen"},addedToCustomList:{zh:"已添加到自定义列表",en:"Added to custom list",de:"Zur benutzerdefinierten Liste hinzugefügt"},canUpdate:{zh:"可更新",en:"Updatable",de:"Aktualisierbar"},allTypes:{zh:"全部类型",en:"All Types",de:"Alle Typen"},refresh:{zh:"刷新",en:"Refresh",de:"Aktualisieren"},noInstalled:{zh:"暂无已安装仓库",en:"No installed repositories",de:"Keine installierten Repositorys"},noMatchInstalled:{zh:"没有匹配的已安装仓库",en:"No matching installed repos",de:"Keine passenden installierten Repositorys"},totalInstalled:{zh:"个已安装仓库",en:"installed repositories",de:"installierte Repositorys"},confirmRemove:{zh:"确定要卸载 {repo} 吗？将删除仓库下载文件，已添加的集成配置不会被删除。",en:"Uninstall {repo}? Repository files will be deleted. Existing integration config entries will NOT be deleted.",de:"{repo} deinstallieren? Repository-Dateien werden gelöscht. Bestehende Integrationskonfigurationen bleiben erhalten."},removed:{zh:"已卸载",en:"Uninstalled",de:"Deinstalliert"},removeFailed:{zh:"卸载失败",en:"Uninstall failed",de:"Deinstallation fehlgeschlagen"},removing:{zh:"卸载中…",en:"Uninstalling…",de:"Deinstalliere…"},updating:{zh:"更新中...",en:"Updating...",de:"Aktualisiere..."},checkingUpdates:{zh:"检查更新...",en:"Checking updates...",de:"Prüfe Updates..."},allUpToDate:{zh:"所有仓库已是最新版本",en:"All repositories are up to date",de:"Alle Repositorys sind auf dem neuesten Stand"},totalUpdates:{zh:"个可更新仓库",en:"repositories can be updated",de:"Repositorys können aktualisiert werden"},updateAll:{zh:"全部更新",en:"Update All",de:"Alle aktualisieren"},updateSelected:{zh:"更新已选",en:"Update Selected",de:"Auswahl aktualisieren"},updateAllNow:{zh:"全部更新",en:"Update All",de:"Alle aktualisieren"},currentVersion:{zh:"当前版本",en:"Current",de:"Aktuell"},latestVersion:{zh:"最新版本",en:"Latest",de:"Neueste"},updateNow:{zh:"立即更新",en:"Update Now",de:"Jetzt aktualisieren"},confirmUpdateAll:{zh:"确定要更新全部 {n} 个仓库吗？",en:"Update all {n} repositories?",de:"Alle {n} Repositorys aktualisieren?"},confirmUpdateSelected:{zh:"确定要更新已选的 {n} 个仓库吗？",en:"Update {n} selected repositories?",de:"{n} ausgewählte Repositorys aktualisieren?"},allUpdatesStarted:{zh:"全部更新已开始",en:"All updates started",de:"Alle Updates gestartet"},updateStarted:{zh:"已开始更新",en:"Update started",de:"Update gestartet"},updateFailed:{zh:"更新失败",en:"Update failed",de:"Update fehlgeschlagen"},selectAll:{zh:"全选",en:"Select All",de:"Alle auswählen"},deselectAll:{zh:"取消全选",en:"Deselect All",de:"Alle abwählen"},customRepos:{zh:"自定义仓库",en:"Custom Repositories",de:"Benutzerdefinierte Repositorys"},noCustomRepos:{zh:"暂无自定义仓库",en:"No custom repositories",de:"Keine benutzerdefinierten Repositorys"},noCustomReposHint:{zh:"点击下方按钮添加自定义仓库，或从浏览页安装",en:"Click below to add a custom repo, or install from Browse",de:"Klicken Sie unten, um ein Repository hinzuzufügen, oder installieren Sie es aus dem Shop"},customReposDesc:{zh:"管理 HACS 自定义仓库列表。添加后可在商店中搜索到。",en:"Manage custom repository list. Once added, they become searchable in Store.",de:"Verwalten Sie benutzerdefinierte Repositorys. Nach dem Hinzufügen sind sie im Shop durchsuchbar."},addRepo:{zh:"添加仓库",en:"Add Repository",de:"Repository hinzufügen"},addSuccess:{zh:"添加成功",en:"Added successfully",de:"Erfolgreich hinzugefügt"},invalidRepoUrl:{zh:"无效的仓库地址，请输入 owner/repo 格式或 GitHub URL",en:"Invalid repository URL, use owner/repo format or GitHub URL",de:"Ungültige Repository-URL, verwenden Sie owner/repo oder GitHub-URL"},addCustomRepo:{zh:"添加自定义仓库",en:"Add Custom Repository",de:"Benutzerdefiniertes Repository hinzufügen"},repoUrl:{zh:"仓库 URL (如: https://github.com/user/repo)",en:"Repository URL (e.g. https://github.com/user/repo)",de:"Repository-URL (z.B. https://github.com/user/repo)"},add:{zh:"添加",en:"Add",de:"Hinzufügen"},cancel:{zh:"取消",en:"Cancel",de:"Abbrechen"},addFailed:{zh:"添加失败",en:"Add failed",de:"Hinzufügen fehlgeschlagen"},removeRepo:{zh:"移除",en:"Remove",de:"Entfernen"},confirmRemoveRepo:{zh:"确定要移除 {repo} 吗？只删除 HACS 跟踪记录，仓库文件和集成配置不受影响。",en:"Remove {repo}? Only the HACS tracking record will be deleted. Repository files and integration config are NOT affected.",de:"{repo} entfernen? Nur der HACS-Tracking-Eintrag wird gelöscht. Repository-Dateien und Integrationskonfiguration bleiben erhalten."},removeRepoFailed:{zh:"移除失败",en:"Remove failed",de:"Entfernen fehlgeschlagen"},notInstalled:{zh:"未安装",en:"Not installed",de:"Nicht installiert"},alreadyExists:{zh:"已在列表中",en:"already exists",de:"existiert bereits"},customBadge:{zh:"自定义",en:"Custom",de:"Benutzerdefiniert"},archivedRepos:{zh:"已归档仓库",en:"Archived Repositories",de:"Archivierte Repositorys"},noArchived:{zh:"暂无归档仓库",en:"No archived repositories",de:"Keine archivierten Repositorys"},renamedRepos:{zh:"已重命名仓库",en:"Renamed Repositories",de:"Umbenannte Repositorys"},noRenamed:{zh:"暂无重命名仓库",en:"No renamed repositories",de:"Keine umbenannten Repositorys"},ignoredRepos:{zh:"已忽略仓库",en:"Ignored Repositories",de:"Ignorierte Repositorys"},noIgnored:{zh:"暂无忽略仓库",en:"No ignored repositories",de:"Keine ignorierten Repositorys"},unignore:{zh:"取消忽略",en:"Unignore",de:"Ignorieren aufheben"},confirmUnignore:{zh:"确定取消忽略 {repo}？",en:"Unignore {repo}?",de:"Ignorieren von {repo} aufheben?"},ignoredBadge:{zh:"已忽略",en:"Ignored",de:"Ignoriert"},removeArchived:{zh:"移除归档",en:"Remove Archived",de:"Archivierung entfernen"},removeRenamed:{zh:"移除重命名",en:"Remove Renamed",de:"Umbenennung entfernen"},replace:{zh:"替换",en:"Replace",de:"Ersetzen"},confirmRemoveArchived:{zh:"确定要移除 {repo} 的归档状态吗？将重新出现在搜索结果中。",en:"Unarchive {repo}? It will reappear in search results.",de:"Archivierung von {repo} aufheben? Es erscheint wieder in den Suchergebnissen."},confirmRemoveRenamed:{zh:"确定要删除仓库 {old} 的重命名映射记录吗？仓库将使用旧名，若旧名无效则更新可能失败。",en:"Delete rename mapping for {old}? The repository will use the old name. If the old name is invalid, updates may fail.",de:"Umbenennungszuordnung für {old} löschen? Das Repository verwendet den alten Namen. Bei ungültigem Namen können Updates fehlschlagen."},confirmReplaceRenamed:{zh:"将替换仓库 {old} → {new}？将卸载旧仓库并安装新仓库。",en:"Replace {old} → {new}? Old repo will be uninstalled, new one will be installed.",de:"{old} → {new} ersetzen? Das alte Repository wird deinstalliert, das neue installiert."},viewOnGithub:{zh:"在 GitHub 中查看",en:"View on GitHub",de:"Auf GitHub ansehen"},exportBackup:{zh:"导出备份",en:"Export Backup",de:"Backup exportieren"},exportDesc:{zh:"将 HACS 配置、已安装仓库列表和自定义仓库设置导出为 JSON 文件。导出后可在新环境中导入恢复。",en:"Export HACS config, installed repositories and custom repo settings as JSON. Can be imported in new environments.",de:"Exportiert HACS-Konfiguration, installierte Repositorys und benutzerdefinierte Einstellungen als JSON. Kann in neuen Umgebungen importiert werden."},exportBtn:{zh:"导出备份",en:"Export Backup",de:"Backup exportieren"},exporting:{zh:"导出中...",en:"Exporting...",de:"Exportiere..."},exportSuccess:{zh:"备份导出成功",en:"Backup exported successfully",de:"Backup erfolgreich exportiert"},exportFailed:{zh:"导出失败",en:"Export failed",de:"Export fehlgeschlagen"},importBackup:{zh:"导入备份",en:"Import Backup",de:"Backup importieren"},importDesc:{zh:"从之前导出的 JSON 备份文件恢复 HACS 配置。注意：导入会覆盖当前配置。",en:"Restore HACS config from a previously exported JSON backup. Note: Import will overwrite current config.",de:"HACS-Konfiguration aus einem JSON-Backup wiederherstellen. Hinweis: Der Import überschreibt die aktuelle Konfiguration."},importBtn:{zh:"导入备份",en:"Import Backup",de:"Backup importieren"},importing:{zh:"导入中...",en:"Importing...",de:"Importiere..."},importSuccess:{zh:"备份导入成功",en:"Backup imported successfully",de:"Backup erfolgreich importiert"},importFailed:{zh:"导入失败",en:"Import failed",de:"Import fehlgeschlagen"},depCheck:{zh:"依赖检查",en:"Dependency Check",de:"Abhängigkeitsprüfung"},depDesc:{zh:"检查 HACS Vision 的系统依赖是否完整安装。",en:"Check if HACS Vision system dependencies are fully installed.",de:"Prüft, ob alle HACS Vision-Abhängigkeiten installiert sind."},checkDep:{zh:"检查依赖",en:"Check Dependencies",de:"Abhängigkeiten prüfen"},depOk:{zh:"所有依赖正常",en:"All dependencies OK",de:"Alle Abhängigkeiten in Ordnung"},depMissing:{zh:"部分依赖缺失",en:"Some dependencies missing",de:"Einige Abhängigkeiten fehlen"},checkFailed:{zh:"检查失败",en:"Check failed",de:"Prüfung fehlgeschlagen"},noFavorites:{zh:"暂无收藏",en:"No favorites yet",de:"Noch keine Favoriten"},noFavoritesHint:{zh:"在浏览页点击卡片右上角的 ☆ 收藏仓库",en:"Click ☆ on the top-right of cards to favorite repositories",de:"Klicken Sie ☆ oben rechts auf Karten, um Repositorys zu favorisieren"},clearAll:{zh:"清空收藏",en:"Clear All",de:"Alle löschen"},confirmClear:{zh:"确定要清空所有收藏吗？",en:"Clear all favorites?",de:"Alle Favoriten löschen?"},favoritesCleared:{zh:"已清空收藏",en:"Favorites cleared",de:"Favoriten gelöscht"},openGithub:{zh:"在 GitHub 中打开",en:"Open in GitHub",de:"Auf GitHub öffnen"},description:{zh:"描述",en:"Description",de:"Beschreibung"},version:{zh:"版本",en:"Version",de:"Version"},downloads:{zh:"下载量",en:"Downloads",de:"Downloads"},stars:{zh:"星数",en:"Stars",de:"Sterne"},category:{zh:"分类",en:"Category",de:"Kategorie"},close:{zh:"关闭",en:"Close",de:"Schließen"},unknown:{zh:"未知",en:"unknown",de:"unbekannt"},unavailable:{zh:"不可用",en:"Unavailable",de:"Nicht verfügbar"},stateOn:{zh:"开",en:"On",de:"An"},stateOff:{zh:"关",en:"Off",de:"Aus"},stateOpen:{zh:"已打开",en:"Open",de:"Offen"},stateClosed:{zh:"已关闭",en:"Closed",de:"Geschlossen"},stateHome:{zh:"在家",en:"Home",de:"Zuhause"},stateNotHome:{zh:"离家",en:"Away",de:"Abwesend"},search:{zh:"搜索",en:"Search",de:"Suchen"},refreshTitle:{zh:"刷新",en:"Refresh",de:"Aktualisieren"},totalPrefix:{zh:"共",en:"Total",de:"Gesamt"},selected:{zh:"已选",en:"Selected",de:"Ausgewählt"},totalCount:{zh:"共",en:"Total",de:"Gesamt"},all:{zh:"全部",en:"All",de:"Alle"},repositories:{zh:"仓库",en:"Repositories",de:"Repositorys"},syncing:{zh:"同步中...",en:"Syncing...",de:"Synchronisiere..."},syncSelected:{zh:"同步选中",en:"Sync Selected",de:"Auswahl synchronisieren"},orgRepos:{zh:"组织/用户仓库",en:"Org/User Repos",de:"Organisations-/Benutzer-Repositorys"},orgReposDesc:{zh:"输入 GitHub 组织或用户名，列出仓库后勾选添加到自定义列表",en:"Enter GitHub org or username to list repos, then select to add to custom list",de:"GitHub-Organisation oder -Benutzernamen eingeben, Repositorys auflisten und zur benutzerdefinierten Liste hinzufügen"},successSuffix:{zh:"成功",en:" succeeded",de:" erfolgreich"},failedSuffix:{zh:"失败",en:" failed",de:" fehlgeschlagen"},deviceAndService:{zh:"设备与服务",en:"Devices & Services",de:"Geräte & Dienste"},noDevices:{zh:"暂无设备",en:"No devices",de:"Keine Geräte"},deviceCount:{zh:"个设备",en:" devices",de:" Geräte"},areaCount:{zh:"个区域",en:" areas",de:" Bereiche"},viewDevices:{zh:"查看设备",en:"View Devices",de:"Geräte anzeigen"},delete:{zh:"删除",en:"Delete",de:"Löschen"},expandAll:{zh:"展开全部",en:"Expand All",de:"Alle ausklappen"},collapseAll:{zh:"全部折叠",en:"Collapse All",de:"Alle einklappen"},connectFailed:{zh:"连接 HACS 失败",en:"Failed to connect to HACS",de:"Verbindung zu HACS fehlgeschlagen"},waitingHA:{zh:"等待 HA 连接...",en:"Waiting for HA connection...",de:"Warte auf HA-Verbindung..."},confirm:{zh:"确认",en:"Confirm",de:"Bestätigen"},confirmDelete:{zh:"确定要删除 {domain} 的配置条目吗？该集成将立即停止运行，仓库下载文件不会被删除。",en:"Delete {domain} config entry? The integration will stop immediately. Repository files will NOT be deleted.",de:"{domain}-Konfigurationseintrag löschen? Die Integration wird sofort gestoppt. Repository-Dateien bleiben erhalten."},deleted:{zh:"已删除",en:"Deleted",de:"Gelöscht"},deleteFailed:{zh:"删除失败",en:"Delete failed",de:"Löschen fehlgeschlagen"},confirmUpdate:{zh:"确认更新",en:"Confirm Update",de:"Update bestätigen"},disabled:{zh:"禁用",en:"Disabled",de:"Deaktiviert"},configure:{zh:"配置",en:"Configure",de:"Konfigurieren"},enableEntry:{zh:"启用",en:"Enable",de:"Aktivieren"},disableEntry:{zh:"禁用",en:"Disable",de:"Deaktivieren"},subentryConfig:{zh:"子项配置",en:"Sub-entry Config",de:"Sub-Entry-Konfiguration"},addSubentryHint:{zh:"点击添加新的子项配置",en:"Click to add a new sub-entry",de:"Klicken Sie, um einen neuen Sub-Entry hinzuzufügen"},save:{zh:"保存",en:"Save",de:"Speichern"},loadingReadme:{zh:"加载 README...",en:"Loading README...",de:"Lade README..."},readmeLoadFailed:{zh:"README 加载失败",en:"README load failed",de:"README-Laden fehlgeschlagen"},readmeTitle:{zh:"说明文档",en:"README",de:"README"},readmeTranslateAi:{zh:"README 翻译 AI",en:"README Translation AI",de:"README-Übersetzung (KI)"},readmeTranslateAiDesc:{zh:"选择用于翻译仓库说明文档的对话助手（在「设置 → 语音助手」中配置）",en:"Choose the conversation agent used to translate repository READMEs (configured in Settings → Voice Assistants)",de:"Wähle den Konversations-Agenten zur Übersetzung von READMEs (in Einstellungen → Sprachassistenten)"},readmeTranslateAiNone:{zh:"不翻译（显示原文）",en:"No translation (show original)",de:"Keine Übersetzung (Original)"},readmeLangOriginal:{zh:"原文",en:"Original",de:"Original"},readmeLangZh:{zh:"中文",en:"Chinese",de:"Chinesisch"},readmeLangEn:{zh:"英文",en:"English",de:"Englisch"},readmeLangDe:{zh:"德文",en:"German",de:"Deutsch"},readmeTranslateNoAgent:{zh:"请先在设置中选择「README 翻译 AI」",en:'Select a "README Translation AI" in settings first',de:'Wähle zuerst eine "README-Übersetzung (KI)" in den Einstellungen'},readmeTranslateUnsupported:{zh:"不支持的目标语言",en:"Unsupported target language",de:"Nicht unterstützte Zielsprache"},readmeTranslateRateLimited:{zh:"翻译请求过于频繁，请稍后再试",en:"Too many translation requests — try again later",de:"Zu viele Übersetzungsanfragen — später erneut"},readmeTranslateFailed:{zh:"翻译失败，请确认所选 AI 可用",en:"Translation failed — verify the selected AI is available",de:"Übersetzung fehlgeschlagen — Agent verfügbar?"},readmeTranslateTimeout:{zh:"翻译超时（大模型处理较慢），可换更快的模型或稍后重试",en:"Translation timed out (model too slow) — try a faster model or later",de:"Zeitüberschreitung (Modell zu langsam) — schnelleres Modell wählen"},readmeTranslating:{zh:"翻译中…大模型处理长文档可能需要 10–60 秒",en:"Translating… long docs may take 10–60s",de:"Übersetze… lange Dokumente brauchen 10–60s"},readmeTranslateLangs:{zh:"README 翻译语言",en:"README Translation Languages",de:"README-Übersetzungssprachen"},readmeTranslateLangsDesc:{zh:"勾选后在仓库详情弹窗的「说明文档」语言条中显示对应按钮（原文始终显示）",en:"Checked languages appear as buttons in the README language bar of the repo popup (Original is always shown)",de:"Aktivierte Sprachen erscheinen als Buttons in der README-Sprachleiste (Original immer sichtbar)"},readmeLangJa:{zh:"日文",en:"Japanese",de:"Japanisch"},readmeLangKo:{zh:"韩文",en:"Korean",de:"Koreanisch"},dblZoomHint:{zh:"双击放大",en:"Double-click to expand",de:"Doppelklicken zum Vergrößern"},networkOffline:{zh:"网络连接已断开，请检查网络",en:"Network disconnected — check your connection",de:"Netzwerk getrennt — Verbindung prüfen"},networkRestored:{zh:"网络已恢复",en:"Network restored",de:"Netzwerk wiederhergestellt"},haRestarting:{zh:"Home Assistant 正在重启，请稍候...",en:"Home Assistant is restarting, please wait...",de:"Home Assistant wird neu gestartet, bitte warten..."},cacheMismatch:{zh:"版本已更新，请刷新页面",en:"New version available, please refresh",de:"Neue Version verfügbar, bitte aktualisieren"},rateLimited:{zh:"GitHub API 限流，请稍后重试",en:"GitHub API rate limited — try again later",de:"GitHub-API-Ratenlimit erreicht — bitte später erneut versuchen"},serverError:{zh:"后端服务异常，请检查 Vision 后端状态",en:"Backend service error — check Vision backend status",de:"Backend-Fehler — Vision-Backend-Status prüfen"},restartHA:{zh:"重启",en:"Restart",de:"Neustart"},restartHATitle:{zh:"重启 Home Assistant",en:"Restart Home Assistant",de:"Home Assistant neu starten"},restartConfirm:{zh:"确定要重启 Home Assistant 吗？面板将暂时不可用。",en:"Restart Home Assistant? The panel will be temporarily unavailable.",de:"Home Assistant neu starten? Das Panel ist vorübergehend nicht verfügbar."},restartFailed:{zh:"重启失败",en:"Restart failed",de:"Neustart fehlgeschlagen"},reloadHA:{zh:"重新加载",en:"Reload",de:"Neu laden"},reloadHATitle:{zh:"重新加载核心配置",en:"Reload Core Config",de:"Kernkonfiguration neu laden"},reloadingHA:{zh:"正在重新加载配置...",en:"Reloading config...",de:"Lade Konfiguration neu..."},reloadSuccess:{zh:"配置已重新加载",en:"Config reloaded",de:"Konfiguration neu geladen"},coreReloadFailed:{zh:"重新加载失败",en:"Reload failed",de:"Neuladen fehlgeschlagen"},postInstallRestartMsg:{zh:"已安装/更新完成。需要重启 Home Assistant 才能生效，是否立即重启？",en:"Install/Update complete. Home Assistant needs a restart to apply changes. Restart now?",de:"Installation/Update abgeschlossen. Home Assistant muss neu gestartet werden. Jetzt neu starten?"},later:{zh:"稍后",en:"Later",de:"Später"},installing:{zh:"安装中…",en:"Installing…",de:"Installiere…"},installComplete:{zh:"已安装",en:"Installed",de:"Installiert"},installFailed:{zh:"安装失败",en:"Install failed",de:"Installation fehlgeschlagen"},updatingProgress:{zh:"更新中…",en:"Updating…",de:"Aktualisiere…"},updateComplete:{zh:"已更新",en:"Updated",de:"Aktualisiert"},quickInstall:{zh:"快捷安装",en:"Quick Install",de:"Schnellinstallation"},quickInstallPlaceholder:{zh:"粘贴 GitHub URL 或 owner/repo",en:"Paste GitHub URL or owner/repo",de:"GitHub-URL oder owner/repo einfügen"},quickInstallCategory:{zh:"分类",en:"Category",de:"Kategorie"},quickInstallUrl:{zh:"仓库 URL",en:"Repository URL",de:"Repository-URL"},installRepo:{zh:"安装仓库",en:"Install Repository",de:"Repository installieren"},changelogTitle:{zh:"更新内容",en:"What's New",de:"Neuigkeiten"},changelogTitleVersion:{zh:"{tag} 更新内容",en:"{tag} What's New",de:"{tag} – Neuigkeiten"},viewFullChangelog:{zh:"查看完整更新日志",en:"View full changelog",de:"Vollständiges Änderungsprotokoll anzeigen"},noChangelog:{zh:"暂无更新日志",en:"No changelog available",de:"Kein Änderungsprotokoll verfügbar"},changelogShowMore:{zh:"展开",en:"Show more",de:"Mehr anzeigen"},changelogShowLess:{zh:"收起",en:"Show less",de:"Weniger anzeigen"},viewCard:{zh:"卡片",en:"Cards",de:"Karten"},viewList:{zh:"列表",en:"List",de:"Liste"},list:{zh:"列表",en:"List",de:"Liste"},groupBy:{zh:"分组",en:"Group By",de:"Gruppieren nach"},groupNone:{zh:"不分组",en:"No Grouping",de:"Keine Gruppierung"},groupStatus:{zh:"按状态",en:"By Status",de:"Nach Status"},groupType:{zh:"按类型",en:"By Type",de:"Nach Typ"},selectVersion:{zh:"选择版本",en:"Select Version",de:"Version auswählen"},availableVersion:{zh:"可用版本",en:"Available Version",de:"Verfügbare Version"},installVersion:{zh:"安装此版本",en:"Install This Version",de:"Diese Version installieren"},prerelease:{zh:"预发布",en:"Pre-release",de:"Vorabversion"},prereleaseTab:{zh:"预发布版",en:"Pre-releases",de:"Vorabversionen"},stableReleases:{zh:"正式版",en:"Stable",de:"Stabil"},releaseStable:{zh:"正式版",en:"Release",de:"Veröffentlichung"},releasePrerelease:{zh:"预发布版",en:"Pre-release",de:"Vorabversion"},noReleases:{zh:"暂无发布版本",en:"No releases available",de:"Keine Veröffentlichungen verfügbar"},publishedAt:{zh:"发布于",en:"Published",de:"Veröffentlicht am"},noConfigRequired:{zh:"此集成无需配置",en:"This integration requires no configuration",de:"Diese Integration benötigt keine Konfiguration"},tools:{zh:"工具",en:"Tools",de:"Werkzeuge"},toolsDesc:{zh:"导出、导入和依赖检查",en:"Export, import and dependency check",de:"Export, Import und Abhängigkeitsprüfung"},colName:{zh:"名称",en:"Name",de:"Name"},colDownloads:{zh:"下载",en:"Downloads",de:"Downloads"},colStars:{zh:"星数",en:"Stars",de:"Sterne"},colLastUpdated:{zh:"更新",en:"Updated",de:"Aktualisiert"},colInstalledVer:{zh:"已安装",en:"Installed",de:"Installiert"},colAvailableVer:{zh:"可用",en:"Available",de:"Verfügbar"},colStatus:{zh:"状态",en:"Status",de:"Status"},colInstalledAt:{zh:"安装时间",en:"Installed At",de:"Installiert am"},installedAt:{zh:"安装时间",en:"Installed At",de:"Installiert am"},today:{zh:"今天",en:"Today",de:"Heute"},yesterday:{zh:"昨天",en:"Yesterday",de:"Gestern"},clearCache:{zh:"清除缓存",en:"Clear cache",de:"Cache leeren"},clearCacheConfirm:{zh:"清除面板缓存后，页面将重新加载以获取最新版本。确定继续？",en:"Clear the panel cache? The page will reload to get the latest version.",de:"Panel-Cache leeren? Die Seite wird neu geladen, um die neueste Version zu erhalten."},clearCacheDone:{zh:"缓存已清除，正在重新加载...",en:"Cache cleared, reloading...",de:"Cache geleert, lade neu..."},tabSettings:{zh:"设置",en:"Settings",de:"Einstellungen"},settingsTitle:{zh:"设置",en:"Settings",de:"Einstellungen"},settingsDesc:{zh:"自定义 HACS Vision 的显示和行为",en:"Customize HACS Vision look and behavior",de:"Passen Sie Darstellung und Verhalten von HACS Vision an"},settingsRefreshInterval:{zh:"刷新间隔（秒）",en:"Refresh interval (s)",de:"Aktualisierungsintervall (s)"},settingsDefaultView:{zh:"默认视图",en:"Default view",de:"Standardansicht"},settingsNotifyUpdates:{zh:"推送更新通知",en:"Push update notifications",de:"Update-Benachrichtigungen"},settingsNotifyRestart:{zh:"推送重启提醒",en:"Push restart reminders",de:"Neustart-Erinnerungen"},settingsLanguage:{zh:"语言",en:"Language",de:"Sprache"},settingsSaved:{zh:"设置已保存",en:"Settings saved",de:"Einstellungen gespeichert"},settingsSaveFailed:{zh:"设置保存失败",en:"Settings save failed",de:"Speichern der Einstellungen fehlgeschlagen"},settingsMaintenance:{zh:"维护",en:"Maintenance",de:"Wartung"},batchSelect:{zh:"批量选择",en:"Batch select",de:"Mehrfachauswahl"},batchInstall:{zh:"批量安装",en:"Batch install",de:"Mehrfachinstallation"},batchRemove:{zh:"批量卸载",en:"Batch uninstall",de:"Mehrfachdeinstallation"},batchUpdate:{zh:"批量更新",en:"Batch update",de:"Mehrfachupdate"},batchSelected:{zh:"已选 {n} 个",en:"{n} selected",de:"{n} ausgewählt"},batchInProgress:{zh:"批量操作进行中…",en:"Batch operation in progress…",de:"Stapelverarbeitung läuft…"},batchComplete:{zh:"批量操作完成",en:"Batch complete",de:"Stapelverarbeitung abgeschlossen"},batchRemoveConfirm:{zh:"确定要批量卸载 {n} 个仓库吗？",en:"Uninstall {n} repositories?",de:"{n} Repositorys deinstallieren?"},batchRemoveRepoConfirm:{zh:"确定要批量移除 {n} 个自定义仓库吗？",en:"Remove {n} custom repositories?",de:"{n} benutzerdefinierte Repositorys entfernen?"},quickInstallTitle:{zh:"快捷安装",en:"Quick Install",de:"Schnellinstallation"},quickInstallDetected:{zh:"检测到 GitHub URL",en:"Detected GitHub URL",de:"GitHub-URL erkannt"},quickInstallDetectedDesc:{zh:"是否要安装此仓库？",en:"Install this repository?",de:"Dieses Repository installieren?"},quickInstallAuto:{zh:"自动识别",en:"Auto detect",de:"Automatisch erkennen"},invalidOrgInput:{zh:"无效的仓库地址或组织名，请输入 owner/repo 或 GitHub 组织名",en:"Invalid URL or org name, enter owner/repo or GitHub org name",de:"Ungültige URL oder Organisationsname, geben Sie owner/repo oder GitHub-Organisationsnamen ein"},addIntegrationHint:{zh:"配置此 HA 集成",en:"Configure this HA integration",de:"Diese HA-Integration konfigurieren"},addHAIntegration:{zh:"添加 HA 集成",en:"Add HA Integration",de:"HA-Integration hinzufügen"},addHAIntegrationDesc:{zh:"搜索并添加 Home Assistant 内置或自定义集成",en:"Search and add Home Assistant built-in or custom integrations",de:"Suchen und Hinzufügen von Home Assistant-Integrationen"},searchIntegration:{zh:"搜索集成...",en:"Search integration...",de:"Integration suchen..."},noIntegrationMatch:{zh:"没有匹配的集成",en:"No matching integration",de:"Keine passende Integration"},integrationCount:{zh:"个可用集成",en:"available integrations",de:"verfügbare Integrationen"},filterAll:{zh:"全部",en:"All",de:"Alle"},filterLoaded:{zh:"已加载",en:"Loaded",de:"Geladen"},filterFailed:{zh:"加载失败",en:"Failed",de:"Fehlgeschlagen"},filterDisabled:{zh:"已禁用",en:"Disabled",de:"Deaktiviert"},filterNotLoaded:{zh:"未加载",en:"Not Loaded",de:"Nicht geladen"},entryCount:{zh:"个条目",en:" entries",de:" Einträge"},entryTitle:{zh:"ID: {id}",en:"ID: {id}",de:"ID: {id}"},detailEntries:{zh:"{count} 个条目 · 点击 ⚙ 配置",en:"{count} entries · Click ⚙ to configure",de:"{count} Einträge · Klicken Sie ⚙ zum Konfigurieren"},reloadDomain:{zh:"重载此集成全部条目",en:"Reload all entries",de:"Alle Einträge neu laden"},configureEntry:{zh:"配置此条目",en:"Configure this entry",de:"Diesen Eintrag konfigurieren"},reloadEntry:{zh:"重载此条目",en:"Reload this entry",de:"Diesen Eintrag neu laden"},removeEntry:{zh:"删除此条目",en:"Remove this entry",de:"Diesen Eintrag löschen"},entryDisabled:{zh:"已禁用",en:"Disabled",de:"Deaktiviert"},viewDetail:{zh:"查看详情",en:"View details",de:"Details anzeigen"},loadFailed:{zh:"加载集成列表失败",en:"Failed to load integrations",de:"Laden der Integrationen fehlgeschlagen"},reloaded:{zh:"已重载",en:"Reloaded",de:"Neu geladen"},reloadFailed:{zh:"重载失败",en:"Reload failed",de:"Neuladen fehlgeschlagen"},checkUpdates:{zh:"检查更新",en:"Check Updates",de:"Updates prüfen"},checkUpdatesNotify:{zh:"检查并通知",en:"Check & Notify",de:"Prüfen & Benachrichtigen"},updatesChecked:{zh:"检查完成，{n} 个可更新",en:"Check done, {n} updates",de:"Prüfung abgeschlossen, {n} Updates"},noUpdatesFound:{zh:"所有仓库已是最新",en:"All repositories up to date",de:"Alle Repositorys aktuell"},notifySent:{zh:"通知已发送",en:"Notification sent",de:"Benachrichtigung gesendet"},flowTitle:{zh:"配置 HA 集成",en:"Configure HA Integration",de:"HA-Integration konfigurieren"},flowTitleOptions:{zh:"选项配置",en:"Options Configuration",de:"Optionen konfigurieren"},subentryTitle:{zh:"子项配置",en:"Subentry Configuration",de:"Sub-Entry-Konfiguration"},subentrySelectDesc:{zh:"请选择要配置的子项类型：",en:"Select a subentry type to configure:",de:"Wählen Sie einen Sub-Entry-Typ:"},subentryExisting:{zh:"已有子项",en:"Existing Subentries",de:"Vorhandene Sub-Entries"},subentryAddNew:{zh:"添加新子项",en:"Add New Subentry",de:"Neuen Sub-Entry hinzufügen"},subentryAddPrefix:{zh:"添加",en:"Add",de:"Hinzufügen"},subentryReconfigure:{zh:"配置",en:"Configure",de:"Konfigurieren"},subentryConversation:{zh:"对话",en:"Conversation",de:"Konversation"},subentryTts:{zh:"语音合成",en:"Text-to-Speech",de:"Text-zu-Sprache"},subentryStt:{zh:"语音识别",en:"Speech-to-Text",de:"Spracherkennung"},subentryTranslation:{zh:"翻译",en:"Translation",de:"Übersetzung"},subentryAiTaskData:{zh:"AI 任务数据",en:"AI Task Data",de:"KI-Aufgabendaten"},subentryDevice:{zh:"MQTT 设备",en:"MQTT Device",de:"MQTT-Gerät"},subentryWecom:{zh:"企业微信",en:"WeCom",de:"WeCom"},subentryWechat:{zh:"微信",en:"WeChat",de:"WeChat"},subentryQq:{zh:"QQ",en:"QQ",de:"QQ"},subentryFeishu:{zh:"飞书",en:"Feishu",de:"Feishu"},subentryDingtalk:{zh:"钉钉",en:"DingTalk",de:"DingTalk"},subentryXiaoyi:{zh:"小懿",en:"XiaoYi",de:"XiaoYi"},subentryCustom:{zh:"自定义",en:"Custom",de:"Benutzerdefiniert"},flowProcessing:{zh:"处理中...",en:"Processing...",de:"Verarbeite..."},flowStarting:{zh:"启动配置流程...",en:"Starting configuration...",de:"Starte Konfiguration..."},flowSubmit:{zh:"提交",en:"Submit",de:"Absenden"},flowSelectOption:{zh:"--- 请选择 ---",en:"--- Select ---",de:"--- Auswählen ---"},flowOptionsNotSupported:{zh:"此集成无需配置",en:"This integration does not require configuration",de:"Diese Integration benötigt keine Konfiguration"},flowHandlerNotFound:{zh:"未找到此集成的配置流程",en:"Configuration handler not found",de:"Kein Konfigurationshandler gefunden"},flowAuthError:{zh:"认证失败，请刷新页面后重试",en:"Authentication failed. Please refresh and try again",de:"Authentifizierung fehlgeschlagen. Bitte aktualisieren und erneut versuchen"},flowTimeout:{zh:"配置超时，请重试",en:"Configuration timed out, please try again",de:"Konfiguration abgelaufen, bitte erneut versuchen"},selectEntryTitle:{zh:"选择集成实例",en:"Select Entry",de:"Eintrag auswählen"},selectEntrySubtitle:{zh:"此集成有多个实例，请选择要配置的实例",en:"Multiple instances found, please select one to configure",de:"Mehrere Instanzen gefunden, bitte eine auswählen"},currentEntry:{zh:"当前",en:"Current",de:"Aktuell"},flowSubmitFailed:{zh:"提交失败",en:"Submit failed",de:"Absenden fehlgeschlagen"},flowUnknownType:{zh:"集成返回了未知流程类型（{type}），请前往设备与服务完成配置。",en:"Unknown flow type ({type}). Please configure in Devices & Services.",de:"Unbekannter Flow-Typ ({type}). Bitte in Geräte & Dienste konfigurieren."},flowExternalAuth:{zh:"此集成需要外部认证，请在打开的页面中完成授权。",en:"This integration requires external authentication. Please complete authorization in the opened page.",de:"Diese Integration erfordert externe Authentifizierung. Bitte schließen Sie die Autorisierung auf der geöffneten Seite ab."},flowStepNext:{zh:"下一步",en:"Next",de:"Weiter"},flowStepFinish:{zh:"完成",en:"Finish",de:"Fertigstellen"},flowCancel:{zh:"取消",en:"Cancel",de:"Abbrechen"},flowBack:{zh:"← 返回",en:"← Back",de:"← Zurück"},flowClose:{zh:"关闭",en:"Close",de:"Schließen"},flowDone:{zh:"完成",en:"Done",de:"Fertig"},flowGotIt:{zh:"知道了",en:"Got it",de:"Verstanden"},flowResultCreated:{zh:"配置完成",en:"Setup Complete",de:"Einrichtung abgeschlossen"},flowResultCreatedDesc:{zh:"集成已成功添加到设备与服务",en:"Integration has been added to Devices & Services",de:"Integration wurde zu Geräte & Dienste hinzugefügt"},flowResultAborted:{zh:"无需配置",en:"Skipped",de:"Übersprungen"},flowResultAbortedDesc:{zh:"该集成已被跳过",en:"Integration was skipped",de:"Integration wurde übersprungen"},flowResultExternal:{zh:"外部认证",en:"External Authentication",de:"Externe Authentifizierung"},flowResultExternalDesc:{zh:"请在外部页面完成授权。",en:"Please authorize in the external page.",de:"Bitte auf der externen Seite autorisieren."},flowResultFailed:{zh:"配置失败",en:"Setup Failed",de:"Einrichtung fehlgeschlagen"},flowResultFailedDesc:{zh:"请稍后在设备与服务中重试",en:"Please retry in Devices & Services",de:"Bitte später in Geräte & Dienste erneut versuchen"},flowAbortAlreadyConfigured:{zh:"该集成已在设备与服务中配置",en:"Already configured in Devices & Services",de:"Bereits in Geräte & Dienste konfiguriert"},flowAbortSingleInstance:{zh:"此集成只允许配置一次",en:"Only one instance allowed",de:"Nur eine Instanz erlaubt"},flowAbortNoDevices:{zh:"未找到可配置的设备",en:"No devices found",de:"Keine Geräte gefunden"},flowAbortInProgress:{zh:"已有进行中的流程",en:"Flow already in progress",de:"Flow bereits in Bearbeitung"},flowOpenAuthPage:{zh:"打开认证页面 ↗",en:"Open auth page ↗",de:"Auth-Seite öffnen ↗"},flowStartFailed:{zh:"配置流程启动失败",en:"Failed to start config flow",de:"Konfigurations-Flow konnte nicht gestartet werden"},flowStartFailedOptions:{zh:"选项配置流程启动失败",en:"Failed to start options flow",de:"Options-Flow konnte nicht gestartet werden"},flowStep:{zh:"步骤",en:"Step",de:"Schritt"},logout:{zh:"登出",en:"Logout",de:"Abmelden"},githubTokenDesc:{zh:"在 GitHub Settings → Developer settings → Personal access tokens 生成",en:"Generate in GitHub Settings → Developer settings → Personal access tokens",de:"Erstellen Sie in GitHub Settings → Developer settings → Personal access tokens"},syncStarred:{zh:"星标仓库同步",en:"Starred Repos Sync",de:"Stern-Repo-Synchronisation"},syncStarredDesc:{zh:"从 GitHub 拉取你点赞过的仓库，勾选后添加到自定义仓库列表",en:"Fetch your starred repos from GitHub, select and add to custom list",de:"Holen Sie Ihre Stern-Repositorys von GitHub und fügen Sie sie zur benutzerdefinierten Liste hinzu"},loadStarred:{zh:"加载星标仓库",en:"Load Starred Repos",de:"Stern-Repositorys laden"},load:{zh:"加载",en:"Load",de:"Laden"},star:{zh:"星标",en:"Star",de:"Stern"},unstar:{zh:"取消星标",en:"Unstar",de:"Stern entfernen"},starred:{zh:"已星标",en:"Starred",de:"Mit Stern"},starBtn:{zh:"星标",en:"Star",de:"Stern"},cloud:{zh:"需要互联网",en:"Requires Internet",de:"Erfordert Internet"},importFromHacs:{zh:"从 HACS 导入",en:"Import from HACS",de:"Von HACS importieren"},tokenImported:{zh:"已从 HACS 导入 Token",en:"Token imported from HACS",de:"Token von HACS importiert"},tokenImportFailed:{zh:"HACS 中未找到 Token",en:"No token found in HACS",de:"Kein Token in HACS gefunden"},verifyAndSave:{zh:"验证并保存",en:"Verify & Save",de:"Verifizieren & Speichern"},verifying:{zh:"验证中...",en:"Verifying...",de:"Verifiziere..."},syncFavToStar:{zh:"收藏同步点赞",en:"Favorites → Stars",de:"Favoriten → Sterne"},syncStarToFav:{zh:"点赞同步收藏",en:"Stars → Favorites",de:"Sterne → Favoriten"},addIntegration:{zh:"添加集成",en:"Add Integration",de:"Integration hinzufügen"},orgInputRequired:{zh:"请输入 GitHub 组织名或 URL",en:"Please enter a GitHub org name or URL",de:"Bitte geben Sie einen GitHub-Organisationsnamen oder eine URL ein"},addStarredToCustomList:{zh:"已添加 {n} 个星标仓库到自定义列表",en:"Added {n} starred repos to custom list",de:"{n} Stern-Repositorys zur benutzerdefinierten Liste hinzugefügt"},addReposToCustomList:{zh:"已添加 {n} 个仓库到自定义列表",en:"Added {n} repos to custom list",de:"{n} Repositorys zur benutzerdefinierten Liste hinzugefügt"},syncDoneResult:{zh:"同步完成: {ok} 个成功{failPart}",en:"Sync done: {ok} succeeded{failPart}",de:"Synchronisation abgeschlossen: {ok} erfolgreich{failPart}"},failPartSuffix:{zh:", {fail} 个失败",en:", {fail} failed",de:", {fail} fehlgeschlagen"},noPermissionMsg:{zh:"{n} 个仓库无权限点赞",en:"{n} repos without star permission",de:"{n} Repositorys ohne Stern-Berechtigung"},logoutGithub:{zh:"已登出 GitHub",en:"Logged out of GitHub",de:"Von GitHub abgemeldet"},githubVerifyResult:{zh:"已验证 ✅ 用户: {user} (剩余 {remaining}/5000 次/小时)",en:"Verified ✅ User: {user} ({remaining}/5000 remaining)",de:"Verifiziert ✅ Benutzer: {user} ({remaining}/5000 verbleibend)"},errorPrefix:{zh:"{action}失败: {err}",en:"{action} failed: {err}",de:"{action} fehlgeschlagen: {err}"},tokenSource:{zh:"Token 来源",en:"Token Source",de:"Token-Quelle"},tokenSourceDesc:{zh:"选择使用哪个 GitHub Token 进行 API 调用",en:"Choose which GitHub Token to use for API calls",de:"Wählen Sie, welcher GitHub-Token für API-Aufrufe verwendet werden soll"},useHacsToken:{zh:"优先使用 HACS 的 Token",en:"Prefer HACS Token",de:"HACS-Token bevorzugen"},tokenFromHacs:{zh:"来源：HACS",en:"Source: HACS",de:"Quelle: HACS"},tokenFromVision:{zh:"来源：HACS Vision",en:"Source: HACS Vision",de:"Quelle: HACS Vision"},syncToHacs:{zh:"同时也更新 HACS 的 Token",en:"Also update HACS Token",de:"Auch HACS-Token aktualisieren"},oauthLogin:{zh:"OAuth 授权登录",en:"OAuth Login",de:"OAuth-Anmeldung"},oauthDesc:{zh:"通过 GitHub OAuth 设备流授权，无需手动输入 Token",en:"Authorize via GitHub OAuth device flow, no token needed",de:"Autorisierung per GitHub-OAuth-Gerätefluss, kein Token erforderlich"},oauthStart:{zh:"开始 OAuth 授权",en:"Start OAuth",de:"OAuth starten"},oauthWaiting:{zh:"等待授权...",en:"Waiting for authorization...",de:"Warte auf Autorisierung..."},oauthStep1:{zh:"步骤1: 访问 GitHub",en:"Step 1: Visit GitHub",de:"Schritt 1: GitHub besuchen"},oauthStep2:{zh:"步骤2: 输入验证码",en:"Step 2: Enter the code",de:"Schritt 2: Code eingeben"},oauthVisit:{zh:"访问",en:"Visit",de:"Besuchen"},oauthEnterCode:{zh:"输入验证码：",en:"Enter code:",de:"Code eingeben:"},oauthWaitingDesc:{zh:"等待授权完成后自动保存...",en:"Waiting for authorization... saving automatically...",de:"Warte auf Autorisierung... speichert automatisch..."},oauthStarting:{zh:"启动中...",en:"Starting...",de:"Starte..."},githubToken:{zh:"GitHub Token",en:"GitHub Token",de:"GitHub-Token"},githubSection:{zh:"GitHub",en:"GitHub",de:"GitHub"},hacsUser:{zh:"HACS 用户: {user}",en:"HACS User: {user}",de:"HACS-Benutzer: {user}"},loadingStarred:{zh:"正在从 GitHub 加载星标仓库...",en:"Loading starred repos from GitHub...",de:"Lade Stern-Repositorys von GitHub..."},alreadyStarred:{zh:"已星标过本仓库",en:"Already starred this repo",de:"Dieses Repository bereits mit Stern markiert"},starSuccess:{zh:"已星标 {repo}",en:"Starred {repo}",de:"{repo} mit Stern markiert"},loadingOrgRepos:{zh:"正在加载仓库列表...",en:"Loading repository list...",de:"Lade Repository-Liste..."},filterPlaceholder:{zh:"筛选...",en:"Filter...",de:"Filter..."},syncSelectedCount:{zh:"同步选中 ({n})",en:"Sync Selected ({n})",de:"Auswahl synchronisieren ({n})"},starredCount:{zh:"{n} 个星标仓库",en:"{n} starred repos",de:"{n} Stern-Repositorys"},gitHubOrgInput:{zh:"GitHub 组织名或 URL（如 C3H3-AI 或 https://github.com/C3H3-AI）",en:"GitHub org name or URL (e.g. C3H3-AI or https://github.com/C3H3-AI)",de:"GitHub-Organisation oder URL (z.B. C3H3-AI oder https://github.com/C3H3-AI)"},noSelectedRepos:{zh:"没有选中的仓库",en:"No repos selected",de:"Keine Repositorys ausgewählt"},syncResultSuccess:{zh:"✓ {n} 个同步成功",en:"✓ {n} synced",de:"✓ {n} synchronisiert"},syncResultPartial:{zh:"已完成: {ok} 成功, {fail} 失败",en:"Done: {ok} succeeded, {fail} failed",de:"Abgeschlossen: {ok} erfolgreich, {fail} fehlgeschlagen"},syncFavToStarAdded:{zh:"✓ 新增 {n} 个收藏",en:"✓ {n} favorites added",de:"✓ {n} Favoriten hinzugefügt"},syncFavToStarNone:{zh:"无新增",en:"Nothing new",de:"Nichts Neues"},syncingShort:{zh:"同步中...",en:"Syncing...",de:"Synchronisiere..."},refreshPage:{zh:"请刷新页面重试",en:"Please refresh and try again",de:"Bitte aktualisieren und erneut versuchen"},tokenPlaceholder:{zh:"ghp_xxxxxxxxxxxx",en:"ghp_xxxxxxxxxxxx",de:"ghp_xxxxxxxxxxxx"},noStarredRepos:{zh:"没有找到星标仓库",en:"No starred repos found",de:"Keine Stern-Repositorys gefunden"},noOrgRepos:{zh:"没有找到仓库",en:"No repos found",de:"Keine Repositorys gefunden"},loggedOut:{zh:"已登出",en:"Logged out",de:"Abgemeldet"},githubLoginSuccess:{zh:"GitHub 登录成功: {user}",en:"GitHub login: {user}",de:"GitHub-Anmeldung: {user}"},checkUpdateFailed:{zh:"检查更新失败: {err}",en:"Update check failed: {err}",de:"Update-Prüfung fehlgeschlagen: {err}"},reconfigure:{zh:"重配置",en:"Reconfigure",de:"Neu konfigurieren"},addSubentry:{zh:"添加服务",en:"Add service",de:"Dienst hinzufügen"},enable:{zh:"启用",en:"Enable",de:"Aktivieren"},viewLogs:{zh:"查看日志",en:"View logs",de:"Logs anzeigen"},confirmEnable:{zh:"确认启用此集成?",en:"Enable this integration?",de:"Diese Integration aktivieren?"},enabled:{zh:"已启用",en:"Enabled",de:"Aktiviert"},enableFailed:{zh:"启用失败",en:"Enable failed",de:"Aktivierung fehlgeschlagen"},restartRequired:{zh:"需要重启才能生效",en:"Restart required to apply",de:"Neustart erforderlich, um zu übernehmen"},hideHacsPanel:{zh:"隐藏 HACS 侧边栏",en:"Hide HACS sidebar",de:"HACS-Seitenleiste ausblenden"},hideHacsPanelDesc:{zh:"隐藏/恢复原版 HACS 侧边栏图标，即时生效无需重启",en:"Show/hide original HACS sidebar icon, applies immediately",de:"Originales HACS-Seitenleistensymbol ein-/ausblenden, wirkt sofort"},githubTokenRequired:{zh:"请输入 Token",en:"Token is required",de:"Token erforderlich"},pendingRestart:{zh:"待重启",en:"Pending Restart",de:"Neustart ausstehend"},selectAction:{zh:"选择一个操作",en:"Select an action",de:"Aktion auswählen"},zoom:{zh:"放大",en:"Zoom",de:"Vergrößern"},restarting:{zh:"正在重启 HA…",en:"Restarting HA…",de:"HA wird neu gestartet…"},renderCrash:{zh:"渲染崩溃",en:"Render error",de:"Renderfehler"},fieldError:{zh:"字段渲染错误",en:"Field render error",de:"Feld-Renderfehler"},hvacCool:{zh:"❄️ 制冷",en:"❄️ Cool",de:"❄️ Kühlen"},hvacHeat:{zh:"🔥 制热",en:"🔥 Heat",de:"🔥 Heizen"},hvacFanOnly:{zh:"🌀 送风",en:"🌀 Fan Only",de:"🌀 Nur Lüfter"},hvacDry:{zh:"💧 除湿",en:"💧 Dry",de:"💧 Trocknen"},hvacAuto:{zh:"🤖 自动",en:"🤖 Auto",de:"🤖 Auto"},hvacOff:{zh:"关",en:"Off",de:"Aus"},toggleSidebar:{zh:"切换侧边栏",en:"Toggle sidebar",de:"Seitenleiste umschalten"},reportIssue:{zh:"提交 Issue",en:"Report Issue",de:"Problem melden"},reportIssueDesc:{zh:"提交 GitHub Issue（自动附错误日志）",en:"Submit GitHub issue (auto-attach error logs)",de:"GitHub-Issue einreichen (Fehlerprotokolle automatisch anhängen)"},issueTitle:{zh:"Issue 标题",en:"Issue Title",de:"Issue-Titel"},issueTitlePlaceholder:{zh:"简要描述问题...",en:"Briefly describe the issue...",de:"Problem kurz beschreiben..."},issueBody:{zh:"补充说明（可选）",en:"Additional details (optional)",de:"Weitere Details (optional)"},issueConfirm:{zh:"确认提交",en:"Submit Issue",de:"Issue einreichen"},issueCancel:{zh:"取消",en:"Cancel",de:"Abbrechen"},issueSubmitting:{zh:"正在提交 Issue...",en:"Submitting issue...",de:"Reiche Issue ein..."},issueSuccess:{zh:"Issue #{n} 已创建",en:"Issue #{n} created",de:"Issue #{n} erstellt"},issueFailed:{zh:"Issue 提交失败",en:"Failed to create issue",de:"Issue-Erstellung fehlgeschlagen"},issueNotLoggedIn:{zh:"请先登录 GitHub（设置 → GitHub Token）",en:"Please login to GitHub first (Settings → GitHub Token)",de:"Bitte zuerst bei GitHub anmelden (Einstellungen → GitHub-Token)"},loadingUpdates:{zh:"正在加载更新...",en:"Loading updates...",de:"Lade Aktualisierungen..."},processing:{zh:"处理中...",en:"Processing...",de:"Verarbeite..."},confirmSkipVersion:{zh:"确定要跳过 {n} 个仓库的当前版本？下个新版本会正常提醒。",en:"Skip current version for {n} repos? Next new version will notify normally.",de:"Aktuelle Version für {n} Repositorys überspringen? Nächste neue Version benachrichtigt normal."},skipVersionDone:{zh:"已跳过 {ok}/{total} 个版本",en:"Skipped {ok}/{total} versions",de:"{ok}/{total} Versionen übersprungen"},confirmUnskipVersion:{zh:"确定取消跳过 {name} 的版本 {ver}？",en:"Unskip version {ver} of {name}?",de:"Überspringen von Version {ver} von {name} rückgängig?"},unskipVersionFailed:{zh:"取消跳过失败",en:"Unskip failed",de:"Rückgängig fehlgeschlagen"},showSkipped:{zh:"显示已跳过更新",en:"Show skipped updates",de:"Übersprungene anzeigen"},hideSkipped:{zh:"隐藏已跳过更新",en:"Hide skipped updates",de:"Übersprungene ausblenden"},skippedVersionLabel:{zh:"已跳过版本",en:"Skipped Versions",de:"Übersprungene Versionen"},skippedVersionCount:{zh:"{n} 个 · 点击按钮可隐藏",en:"{n} items · Click button to hide",de:"{n} Einträge · Klicken zum Ausblenden"},skippedBadge:{zh:"🔇 已跳过",en:"🔇 Skipped",de:"🔇 Übersprungen"},skippedVersionTitle:{zh:"跳过的版本",en:"Skipped version",de:"Übersprungene Version"},unskipBtn:{zh:"取消跳过",en:"Unskip",de:"Rückgängig"},issueRestore:{zh:"还原",en:"Restore",de:"Wiederherstellen"},issueExpand:{zh:"放大",en:"Expand",de:"Vergrößern"},haVersion:{zh:"HA 版本",en:"HA Version",de:"HA-Version"},repoVersion:{zh:"集成版本",en:"Integration Version",de:"Integrationsversion"},repoDomain:{zh:"领域",en:"Domain",de:"Bereich"},relatedLogs:{zh:"相关日志",en:"Related logs",de:"Verwandte Logs"},noRelatedLogs:{zh:"(无相关错误日志)",en:"(No related error logs)",de:"(Keine verwandten Fehler-Logs)"},cantGetPreview:{zh:"(无法获取预览信息)",en:"(Cannot get preview info)",de:"(Keine Vorschauinfo verfügbar)"},previewLoadFailed:{zh:"(预览加载失败)",en:"(Preview load failed)",de:"(Vorschauladen fehlgeschlagen)"},fileTooLarge:{zh:"{name} 过大（>5MB），已跳过",en:"{name} too large (>5MB), skipped",de:"{name} zu groß (>5MB), übersprungen"},screenshotsSelected:{zh:"✓ 已选 {n} 张截图",en:"✓ {n} screenshot(s) selected",de:"✓ {n} Screenshot(s) ausgewählt"},enterIssueTitle:{zh:"请输入 Issue 标题",en:"Please enter an issue title",de:"Bitte geben Sie einen Issue-Titel ein"},submitting:{zh:"提交中…",en:"Submitting…",de:"Sende…"},submittingIssue:{zh:"正在提交 Issue...",en:"Submitting issue...",de:"Sende Issue..."},retry:{zh:"重试",en:"Retry",de:"Wiederholen"},addScreenshots:{zh:"添加上传截图（可选，可多选）",en:"Add screenshots (optional, multiple)",de:"Screenshots hinzufügen (optional, mehrere)"},previewContent:{zh:"📋 预览提交内容（含自动收集的日志）",en:"📋 Preview content (with auto-collected logs)",de:"📋 Vorschau (mit automatisch gesammelten Logs)"},togglePasswordShow:{zh:"显示",en:"Show",de:"Anzeigen"},togglePasswordHide:{zh:"隐藏",en:"Hide",de:"Ausblenden"},batchSkip:{zh:"批量跳过",en:"Skip Selected",de:"Ausgewählte überspringen"},oauthError:{zh:"OAuth 错误",en:"OAuth Error",de:"OAuth-Fehler"},inputRepoPlaceholder:{zh:"owner/repo、GitHub URL 或组织名",en:"owner/repo, GitHub URL or org name",de:"owner/repo, GitHub-URL oder Organisationsname"},autoUpdateSection:{zh:"自动更新",en:"Auto Update",de:"Automatisches Update"},autoUpdateEnabled:{zh:"启用自动更新",en:"Enable Auto Update",de:"Automatisches Update aktivieren"},autoUpdateEnabledDesc:{zh:"按设定间隔自动检查并更新已安装的仓库",en:"Automatically check and update installed repos at set intervals",de:"Automatisch nach Updates suchen und installieren"},autoUpdateInterval:{zh:"检查间隔",en:"Check Interval",de:"Prüfintervall"},autoUpdateIntervalDesc:{zh:"两次自动更新之间的最小间隔时间",en:"Minimum time between auto-update cycles",de:"Mindestabstand zwischen Update-Zyklen"},autoUpdateInterval1h:{zh:"1 小时",en:"1 hour",de:"1 Stunde"},autoUpdateInterval3h:{zh:"3 小时",en:"3 hours",de:"3 Stunden"},autoUpdateInterval6h:{zh:"6 小时",en:"6 hours",de:"6 Stunden"},autoUpdateInterval12h:{zh:"12 小时",en:"12 hours",de:"12 Stunden"},autoUpdateInterval24h:{zh:"24 小时",en:"24 hours",de:"24 Stunden"},autoUpdateNotify:{zh:"更新通知",en:"Update Notifications",de:"Update-Benachrichtigungen"},autoUpdateNotifyDesc:{zh:"每次自动更新完成后发送 HA 通知",en:"Send a HA notification after each auto-update cycle",de:"Benachrichtigung nach jedem Update-Zyklus senden"},autoUpdateRestartTime:{zh:"预约重启",en:"Scheduled Restart",de:"Geplanter Neustart"},autoUpdateRestartTimeDesc:{zh:"设置自动重启时间（HH:MM），更新完成后将在指定时间重启 HA。留空不自动重启",en:"Set restart time (HH:MM). HA will restart at this time after updates are installed. Leave empty to disable",de:"Neustart-Zeit (HH:MM). HA wird nach Updates um diese Zeit neu gestartet. Leer lassen zum Deaktivieren"},autoUpdateRepos:{zh:"白名单仓库",en:"Whitelisted Repos",de:"Weiße Liste"},autoUpdateReposDesc:{zh:"每行一个 owner/repo，仅白名单中的仓库会被自动更新",en:"One owner/repo per line. Only whitelisted repos will be auto-updated",de:"Ein owner/repo pro Zeile. Nur gelistete Repositorys werden aktualisiert"},autoUpdateReposPlaceholder:{zh:"owner/repo1\nowner/repo2",en:"owner/repo1\nowner/repo2",de:"owner/repo1\nowner/repo2"},autoUpdateTrigger:{zh:"立即检查更新",en:"Check Now",de:"Jetzt prüfen"},autoUpdateTriggerDesc:{zh:"立即执行一次自动更新检查",en:"Trigger an auto-update cycle immediately",de:"Sofort einen Update-Zyklus ausführen"},autoUpdateReload:{zh:"重载设置",en:"Reload Settings",de:"Einstellungen neu laden"},autoUpdateReloadDesc:{zh:"重新读取设置并调整定时调度",en:"Reload settings and reschedule",de:"Einstellungen neu laden und Zeitplan anpassen"},autoUpdateRunning:{zh:"运行中...",en:"Running...",de:"Läuft..."},autoUpdateScheduled:{zh:"已调度",en:"Scheduled",de:"Geplant"},autoUpdateStopped:{zh:"未运行",en:"Not Running",de:"Nicht aktiv"},autoUpdateDone:{zh:"自动更新完成",en:"Auto-update complete",de:"Automatisches Update abgeschlossen"},autoUpdateTriggered:{zh:"已触发自动更新",en:"Auto-update triggered",de:"Update ausgelöst"},autoUpdateReloaded:{zh:"设置已重载",en:"Settings reloaded",de:"Einstellungen neu geladen"},autoUpdateTriggerFailed:{zh:"触发自动更新失败",en:"Failed to trigger auto-update",de:"Update auslösen fehlgeschlagen"},autoUpdateReloadFailed:{zh:"重载设置失败",en:"Failed to reload settings",de:"Einstellungen neu laden fehlgeschlagen"},autoUpdateEnabledText:{zh:"自动更新已开启",en:"Auto-update ON",de:"Auto-Update EIN"},autoUpdateDisabledText:{zh:"点击开启自动更新",en:"Enable auto-update",de:"Auto-Update aktivieren"},autoUpdateToggledOn:{zh:" 自动更新已开启",en:" auto-update enabled",de:" Auto-Update aktiviert"},autoUpdateToggledOff:{zh:" 自动更新已关闭",en:" auto-update disabled",de:" Auto-Update deaktiviert"},autoUpdateToggleFailed:{zh:"自动更新设置失败",en:"Auto-update setting failed",de:"Auto-Update-Einstellung fehlgeschlagen"},whitelistSaved:{zh:"白名单已保存",en:"Whitelist saved",de:"Whitelist gespeichert"},whitelistSaveFailed:{zh:"保存失败",en:"Save failed",de:"Speichern fehlgeschlagen"},updateQueued:{zh:"更新已排队，将在当前周期完成后执行",en:"Update queued, will run after current cycle completes",de:"Update in Warteschlange, läuft nach aktuellem Zyklus"},noReposAdded:{zh:"暂未添加仓库",en:"No repos added yet",de:"Noch keine Repositorys hinzugefügt"},noReposSelected:{zh:"暂未选择仓库",en:"No repos selected",de:"Keine Repositorys ausgewählt"},selectedCount:{zh:"{n} / {total} 已选",en:"{n} / {total} selected",de:"{n} / {total} ausgewählt"},searchToAdd:{zh:"输入仓库名搜索添加...",en:"Search repos to add...",de:"Repositorys zum Hinzufügen suchen..."},loadingRepos:{zh:"正在加载已安装仓库...",en:"Loading installed repos...",de:"Installierte Repositorys laden..."},noInstalledRepos:{zh:"尚未安装任何仓库",en:"No repos installed",de:"Keine Repositorys installiert"},allInWhitelist:{zh:"没有可添加的仓库（所有已安装仓库已在白名单中）",en:"No repos to add (all installed repos are already in whitelist)",de:"Keine Repositorys zum Hinzufügen (alle installierten sind bereits in der Whitelist)"},prevPage:{zh:"‹ 上一页",en:"‹ Prev",de:"‹ Zurück"},nextPage:{zh:"下一页 ›",en:"Next ›",de:"Weiter ›"},sectionUpdatable:{zh:"可更新",en:"Updatable",de:"Aktualisierbar"},sectionUpdated:{zh:"已更新",en:"Updated",de:"Aktualisiert"},sectionSkipped:{zh:"已略过",en:"Skipped",de:"Übersprungen"},updatedLabel:{zh:"已更新",en:"Updated",de:"Aktualisiert"},updatedFromTo:{zh:"{from} → {to}",en:"{from} → {to}",de:"{from} → {to}"},updatedAt:{zh:"更新于",en:"Updated at",de:"Aktualisiert am"},updatedTimeAgo:{zh:"{ago}前",en:"{ago} ago",de:"vor {ago}"},justNow:{zh:"刚刚",en:"just now",de:"gerade eben"},minAgo:{zh:"{n}分钟",en:"{n}m",de:"{n} Min."},hourAgo:{zh:"{n}小时",en:"{n}h",de:"{n} Std."},dayAgo:{zh:"{n}天",en:"{n}d",de:"{n} T."},noUpdateHistory:{zh:"暂无更新记录",en:"No update history",de:"Keine Update-Verlauf"},previewTitle:{zh:"预览",en:"Preview",de:"Vorschau"},preview:{zh:"预览",en:"Preview",de:"Vorschau"},previewLoading:{zh:"正在加载插件...",en:"Loading plugin...",de:"Plugin wird geladen..."},previewNoRepo:{zh:"未指定仓库",en:"No repository specified",de:"Kein Repository angegeben"},previewNoJs:{zh:"未找到插件 JS 文件",en:"Plugin JS file not found",de:"Plugin-JS-Datei nicht gefunden"}};function xe(e,t){const i=ye[e];if(!i)return e;let o=i[ue||ge||"en"]||i.en||e;if(t)for(const[e,i]of Object.entries(t))o=o.split(`{${e}}`).join(i);return o}function _e(e){e&&me[e]?(ue=e,ge=e):(ue=null,ge=he||"en"),window.dispatchEvent(new CustomEvent("hacs-lang-changed",{detail:{lang:we()}})),function(){const e=["browse-view","updates-view","management-view","config-view","integrations-list","config-flow-dialog","repo-card"];for(const t of e)try{for(const e of document.querySelectorAll(t))"function"==typeof e.requestUpdate&&e.requestUpdate()}catch(e){}try{const e=document.querySelector("hacs-vision-panel");e&&"function"==typeof e.requestUpdate&&e.requestUpdate()}catch(e){}}()}function we(){return ue||ge||"en"}const ke={integration:"#1565c0",plugin:"#7b1fa2",theme:"#2e7d32",appdaemon:"#e65100",netdaemon:"#00838f",python_script:"#f9a825",template:"#6a1b9a",dashboard:"#f57f17"};function $e(e){return ke[e]||function(e){let t=0;for(let i=0;i<e.length;i++)t=e.charCodeAt(i)+((t<<5)-t),t&=t;return`hsl(${Math.abs(t%360)}, 55%, 48%)`}(e||"default")}function Se(){return s`
  /* ===== CSS Variables for Theming ===== */
  :host {
    /* Semantic colors — intended fallbacks (HA cascades its own values) */
    --success-color: #4caf50;
    --error-color: #f44336;
    --warning-color: #ff9800;
    /* Typography scale — single source of truth */
    --fs-xs: 10px;
    --fs-sm: 11px;
    --fs-md: 12px;
    --fs-body: 13px;
    --fs-lg: 14px;
    --fs-xl: 16px;
    --fs-2xl: 20px;
  }

  /* ===== Loading ===== */
  .loading {
    text-align: center; padding: 60px 20px;
    color: var(--secondary-text-color, #727272);
  }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--divider-color, #e0e0e0);
    border-top-color: var(--primary-color, #03a9f4);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }
  .spinner-sm {
    width: 20px; height: 20px;
    border: 2px solid var(--divider-color, #e0e0e0);
    border-top-color: var(--primary-color, #03a9f4);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 8px;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* ===== Mini Icon (inline SVG helper) ===== */
  .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
  .mini-icon.spin { animation: spin 1s linear infinite; }

  /* ===== Empty ===== */
  .empty {
    text-align: center; padding: 60px 20px;
    color: var(--secondary-text-color, #727272);
  }
  .empty svg { width: 60px; height: 60px; margin-bottom: 16px; opacity: 0.3; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }

  /* ===== Info bar ===== */
  .info-bar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px; padding: 8px 14px;
    background: var(--secondary-background-color, #f0f0f0);
    border-radius: 8px;
    font-size: 13px; color: var(--secondary-text-color, #727272);
  }
  .info-bar .count { font-weight: 600; color: var(--primary-text-color, #212121); }

  /* ===== Buttons ===== */
  .btn {
    padding: 6px 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    cursor: pointer; font-size: 12px;
    transition: all 0.2s; white-space: nowrap;
    touch-action: manipulation;
  }
  .btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
  .btn.primary { background: var(--primary-color, #03a9f4); border-color: var(--primary-color, #03a9f4); color: #fff; }
  .btn.primary:hover { opacity: 0.9; }
  .btn.danger { color: var(--error-color, #f44336); border-color: var(--error-color, #f44336); }
  .btn.danger:hover { background: var(--error-color, #f44336); color: #fff; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ===== Icon Buttons (refresh, view-toggle, filter-toggle) ===== */
  .icon-btn {
    width: 36px; height: 36px; padding: 8px; flex-shrink: 0;
    border: 1px solid var(--divider-color, #e0e0e0); border-radius: 10px;
    background: var(--card-background-color, #fff);
    color: var(--secondary-text-color, #727272);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; touch-action: manipulation;
  }
  .icon-btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
  .icon-btn svg { width: 16px; height: 16px; }

  /* ===== Search ===== */
  .search { flex: 1; min-width: 120px; position: relative; }
  .search input {
    width: 100%; box-sizing: border-box; padding: 10px 36px 10px 40px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 10px; font-size: 14px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    outline: none; transition: border-color 0.2s;
  }
  .search input:focus { border-color: var(--primary-color, #03a9f4); }
  .search input::placeholder { color: var(--secondary-text-color, #727272); }
  .search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    width: 16px; height: 16px; color: var(--secondary-text-color, #727272);
  }
  .search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 20px; border-radius: 50%; border: none;
    background: var(--divider-color, #e0e0e0);
    color: var(--secondary-text-color, #727272);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 12px; transition: all 0.2s;
  }
  .search-clear:hover { background: var(--primary-color, #03a9f4); color: #fff; }

  /* ===== Controls ===== */
  .controls {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px; flex-wrap: wrap;
  }

  /* ===== Controls Right ===== */
  .controls-right {
    display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  }

  /* ===== Grid ===== */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 14px;
  }

  /* ===== Responsive ===== */
  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; gap: 10px; }
    .controls { gap: 4px; flex-wrap: wrap; }
    .search { min-width: 0; flex-basis: 120px; flex-grow: 2; }
    .search input { padding: 7px 10px 7px 30px; font-size: 13px; border-radius: 8px; }
    .search-icon { width: 14px; height: 14px; left: 8px; }
    .btn { min-height: 44px; display: flex; align-items: center; justify-content: center; }
  }

  @media (max-width: 480px) {
    .grid { grid-template-columns: 1fr; gap: 8px; }
    .controls { flex-wrap: wrap; gap: 4px; }
    .info-bar { flex-wrap: wrap; gap: 4px; font-size: 12px; }
  }

  /* ===== Skeleton Loading ===== */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }
  .skeleton-card {
    border-radius: 14px; overflow: hidden;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #e0e0e0);
  }
  .skeleton-card-img {
    height: 100px;
    background: var(--secondary-background-color, #f0f0f0);
  }
  .skeleton-card-body {
    padding: 16px;
  }
  .skeleton-line {
    height: 14px; border-radius: 6px; margin-bottom: 12px;
    background: linear-gradient(90deg,
      var(--secondary-background-color, #eee) 25%,
      var(--divider-color, #ddd) 50%,
      var(--secondary-background-color, #eee) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .skeleton-line:last-child { width: 60%; }
  .skeleton-line.wide { width: 100%; }
  .skeleton-line.medium { width: 75%; }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ===== Small inline checkbox (controls bar) ===== */
  .checkbox-sm {
    width: 18px; height: 18px; border-radius: 4px;
    border: 2px solid var(--secondary-text-color); cursor: pointer;
    flex-shrink: 0; transition: all 0.2s; background: transparent;
    -webkit-appearance: none; appearance: none; touch-action: manipulation;
    margin: 0; box-sizing: border-box;
  }
  .checkbox-sm:checked {
    background: var(--primary-color); border-color: var(--primary-color);
  }
  .checkbox-sm:checked::after {
    content: '✓'; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 12px; font-weight: 700; line-height: 1;
  }
  /* Inline label wrapping checkbox-sm */
  .sel-all-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--secondary-text-color);
    cursor: pointer; flex-shrink: 0; white-space: nowrap; min-height: 36px;
  }
`}const ze=new WeakMap,Ae=[];let Re=!1;function Ce(e,t="info"){let i=null;try{const e=document.querySelectorAll("hacs-vision-panel");for(const t of e)if(ze.has(t)){i=t;break}i||(i=e[0])}catch(e){}const o=i?.shadowRoot?.querySelector("#toast-container");o?(Ae.push({msg:e,type:t}),Re||Ee(o)):console.warn("Toast container not found:",e)}function Ee(e){if(0===Ae.length)return void(Re=!1);Re=!0;const{msg:t,type:i}=Ae.shift(),o=document.createElement("div");o.className="toast",i&&o.classList.add(i),o.textContent=t,e.appendChild(o),requestAnimationFrame(()=>{o.classList.add("show")}),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>{o.remove(),Ee(e)},350)},3e3)}const Te="hacs-vision-sb-badge";function De(e){try{const t=Fe(document.body,new Set);if(!t)return;const i=t.parentElement;if(!i)return;t.textContent=t.textContent.replace(/ \(\d+\)$/,"");const o=i.querySelector(`.${Te}`);if(o&&o.remove(),e>0){"static"===getComputedStyle(i).position&&(i.style.position="relative");const t=document.createElement("span");t.className=Te,t.textContent=e,Object.assign(t.style,{position:"absolute",right:"0",top:"50%",transform:"translateY(-50%)",display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",background:"var(--primary-color, #03a9f4)",color:"#fff",borderRadius:"50%",fontSize:"12px",fontWeight:"700",lineHeight:"22px",pointerEvents:"none"}),i.appendChild(t)}}catch(e){}}function Fe(e,t){if(!e||t.has(e))return null;t.add(e);const i=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(;i.nextNode();){const e=i.currentNode,t=e.textContent.trim();if("HACS Vision"===t||/^HACS Vision \(\d+\)$/.test(t))return e}const o=document.createNodeIterator(e,NodeFilter.SHOW_ELEMENT);let r;for(;r=o.nextNode();)if(r.shadowRoot){const e=Fe(r.shadowRoot,t);if(e)return e}return null}
/*! @license DOMPurify 3.4.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.8/LICENSE */function Le(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,o=Array(t);i<t;i++)o[i]=e[i];return o}function Ie(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var o,r,s,a,n=[],l=!0,d=!1;try{if(s=(i=i.call(e)).next,0===t);else for(;!(l=(o=s.call(i)).done)&&(n.push(o.value),n.length!==t);l=!0);}catch(e){d=!0,r=e}finally{try{if(!l&&null!=i.return&&(a=i.return(),Object(a)!==a))return}finally{if(d)throw r}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return Le(e,t);var i={}.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?Le(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const Oe=Object.entries,Ue=Object.setPrototypeOf,Me=Object.isFrozen,He=Object.getPrototypeOf,Pe=Object.getOwnPropertyDescriptor;let Be=Object.freeze,Ne=Object.seal,Ve=Object.create,je="undefined"!=typeof Reflect&&Reflect,qe=je.apply,Ge=je.construct;Be||(Be=function(e){return e}),Ne||(Ne=function(e){return e}),qe||(qe=function(e,t){for(var i=arguments.length,o=new Array(i>2?i-2:0),r=2;r<i;r++)o[r-2]=arguments[r];return e.apply(t,o)}),Ge||(Ge=function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),o=1;o<t;o++)i[o-1]=arguments[o];return new e(...i)});const We=ut(Array.prototype.forEach),Ke=ut(Array.prototype.lastIndexOf),Ye=ut(Array.prototype.pop),Xe=ut(Array.prototype.push),Je=ut(Array.prototype.splice),Ze=Array.isArray,Qe=ut(String.prototype.toLowerCase),et=ut(String.prototype.toString),tt=ut(String.prototype.match),it=ut(String.prototype.replace),ot=ut(String.prototype.indexOf),rt=ut(String.prototype.trim),st=ut(Number.prototype.toString),at=ut(Boolean.prototype.toString),nt="undefined"==typeof BigInt?null:ut(BigInt.prototype.toString),lt="undefined"==typeof Symbol?null:ut(Symbol.prototype.toString),dt=ut(Object.prototype.hasOwnProperty),ct=ut(Object.prototype.toString),pt=ut(RegExp.prototype.test),ht=(gt=TypeError,function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return Ge(gt,t)});var gt;function ut(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var i=arguments.length,o=new Array(i>1?i-1:0),r=1;r<i;r++)o[r-1]=arguments[r];return qe(e,t,o)}}function ft(e,t){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Qe;if(Ue&&Ue(e,null),!Ze(t))return e;let o=t.length;for(;o--;){let r=t[o];if("string"==typeof r){const e=i(r);e!==r&&(Me(t)||(t[o]=e),r=e)}e[r]=!0}return e}function mt(e){for(let t=0;t<e.length;t++){dt(e,t)||(e[t]=null)}return e}function bt(e){const t=Ve(null);for(const o of Oe(e)){var i=Ie(o,2);const r=i[0],s=i[1];dt(e,r)&&(Ze(s)?t[r]=mt(s):s&&"object"==typeof s&&s.constructor===Object?t[r]=bt(s):t[r]=s)}return t}function vt(e,t){for(;null!==e;){const i=Pe(e,t);if(i){if(i.get)return ut(i.get);if("function"==typeof i.value)return ut(i.value)}e=He(e)}return function(){return null}}const yt=Be(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),xt=Be(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),_t=Be(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),wt=Be(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),kt=Be(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),$t=Be(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),St=Be(["#text"]),zt=Be(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),At=Be(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Rt=Be(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Ct=Be(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Et=Ne(/{{[\w\W]*|^[\w\W]*}}/g),Tt=Ne(/<%[\w\W]*|^[\w\W]*%>/g),Dt=Ne(/\${[\w\W]*/g),Ft=Ne(/^data-[\-\w.\u00B7-\uFFFF]+$/),Lt=Ne(/^aria-[\-\w]+$/),It=Ne(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ot=Ne(/^(?:\w+script|data):/i),Ut=Ne(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Mt=Ne(/^html$/i),Ht=Ne(/^[a-z][.\w]*(-[.\w]+)+$/i),Pt=1,Bt=3,Nt=7,Vt=8,jt=9,qt=11,Gt=function(){return"undefined"==typeof window?null:window};var Wt=function e(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Gt();const i=t=>e(t);if(i.version="3.4.8",i.removed=[],!t||!t.document||t.document.nodeType!==jt||!t.Element)return i.isSupported=!1,i;let o=t.document;const r=o,s=r.currentScript;t.DocumentFragment;const a=t.HTMLTemplateElement,n=t.Node,l=t.Element,d=t.NodeFilter,c=t.NamedNodeMap;void 0===c&&(t.NamedNodeMap||t.MozNamedAttrMap),t.HTMLFormElement;const p=t.DOMParser,h=t.trustedTypes,g=l.prototype,u=vt(g,"cloneNode"),f=vt(g,"remove"),m=vt(g,"nextSibling"),b=vt(g,"childNodes"),v=vt(g,"parentNode"),y=vt(g,"shadowRoot"),x=vt(g,"attributes"),_=n&&n.prototype?vt(n.prototype,"nodeType"):null,w=n&&n.prototype?vt(n.prototype,"nodeName"):null;if("function"==typeof a){const e=o.createElement("template");e.content&&e.content.ownerDocument&&(o=e.content.ownerDocument)}let k,$="",S=0;const z=function(e){if(S>0)throw ht('The configured TRUSTED_TYPES_POLICY.createHTML must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose createHTML wraps DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');S++;try{return k.createHTML(e)}finally{S--}},A=o,R=A.implementation,C=A.createNodeIterator,E=A.createDocumentFragment,T=A.getElementsByTagName,D=r.importNode;let F={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]};i.isSupported="function"==typeof Oe&&"function"==typeof v&&R&&void 0!==R.createHTMLDocument;const L=Et,I=Tt,O=Dt,U=Ft,M=Lt,H=Ot,P=Ut,B=Ht;let N=It,V=null;const j=ft({},[...yt,...xt,..._t,...kt,...St]);let q=null;const G=ft({},[...zt,...At,...Rt,...Ct]);let W=Object.seal(Ve(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),K=null,Y=null;const X=Object.seal(Ve(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let J=!0,Z=!0,Q=!1,ee=!0,te=!1,ie=!0,oe=!1,re=!1,se=!1,ae=!1,ne=!1,le=!1,de=!0,ce=!1;const pe="user-content-";let he=!0,ge=!1,ue={},fe=null;const me=ft({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let be=null;const ve=ft({},["audio","video","img","source","image","track"]);let ye=null;const xe=ft({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),_e="http://www.w3.org/1998/Math/MathML",we="http://www.w3.org/2000/svg",ke="http://www.w3.org/1999/xhtml";let $e=ke,Se=!1,ze=null;const Ae=ft({},[_e,we,ke],et);let Re=ft({},["mi","mo","mn","ms","mtext"]),Ce=ft({},["annotation-xml"]);const Ee=ft({},["title","style","font","a","script"]);let Te=null;const De=["application/xhtml+xml","text/html"];let Fe=null,Le=null;const Ie=o.createElement("form"),Ue=function(e){return e instanceof RegExp||e instanceof Function},Me=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(Le&&Le===e)return;e&&"object"==typeof e||(e={}),e=bt(e),Te=-1===De.indexOf(e.PARSER_MEDIA_TYPE)?"text/html":e.PARSER_MEDIA_TYPE,Fe="application/xhtml+xml"===Te?et:Qe,V=dt(e,"ALLOWED_TAGS")&&Ze(e.ALLOWED_TAGS)?ft({},e.ALLOWED_TAGS,Fe):j,q=dt(e,"ALLOWED_ATTR")&&Ze(e.ALLOWED_ATTR)?ft({},e.ALLOWED_ATTR,Fe):G,ze=dt(e,"ALLOWED_NAMESPACES")&&Ze(e.ALLOWED_NAMESPACES)?ft({},e.ALLOWED_NAMESPACES,et):Ae,ye=dt(e,"ADD_URI_SAFE_ATTR")&&Ze(e.ADD_URI_SAFE_ATTR)?ft(bt(xe),e.ADD_URI_SAFE_ATTR,Fe):xe,be=dt(e,"ADD_DATA_URI_TAGS")&&Ze(e.ADD_DATA_URI_TAGS)?ft(bt(ve),e.ADD_DATA_URI_TAGS,Fe):ve,fe=dt(e,"FORBID_CONTENTS")&&Ze(e.FORBID_CONTENTS)?ft({},e.FORBID_CONTENTS,Fe):me,K=dt(e,"FORBID_TAGS")&&Ze(e.FORBID_TAGS)?ft({},e.FORBID_TAGS,Fe):bt({}),Y=dt(e,"FORBID_ATTR")&&Ze(e.FORBID_ATTR)?ft({},e.FORBID_ATTR,Fe):bt({}),ue=!!dt(e,"USE_PROFILES")&&(e.USE_PROFILES&&"object"==typeof e.USE_PROFILES?bt(e.USE_PROFILES):e.USE_PROFILES),J=!1!==e.ALLOW_ARIA_ATTR,Z=!1!==e.ALLOW_DATA_ATTR,Q=e.ALLOW_UNKNOWN_PROTOCOLS||!1,ee=!1!==e.ALLOW_SELF_CLOSE_IN_ATTR,te=e.SAFE_FOR_TEMPLATES||!1,ie=!1!==e.SAFE_FOR_XML,oe=e.WHOLE_DOCUMENT||!1,ae=e.RETURN_DOM||!1,ne=e.RETURN_DOM_FRAGMENT||!1,le=e.RETURN_TRUSTED_TYPE||!1,se=e.FORCE_BODY||!1,de=!1!==e.SANITIZE_DOM,ce=e.SANITIZE_NAMED_PROPS||!1,he=!1!==e.KEEP_CONTENT,ge=e.IN_PLACE||!1,N=function(e){try{return pt(e,""),!0}catch(e){return!1}}(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:It,$e="string"==typeof e.NAMESPACE?e.NAMESPACE:ke,Re=dt(e,"MATHML_TEXT_INTEGRATION_POINTS")&&e.MATHML_TEXT_INTEGRATION_POINTS&&"object"==typeof e.MATHML_TEXT_INTEGRATION_POINTS?bt(e.MATHML_TEXT_INTEGRATION_POINTS):ft({},["mi","mo","mn","ms","mtext"]),Ce=dt(e,"HTML_INTEGRATION_POINTS")&&e.HTML_INTEGRATION_POINTS&&"object"==typeof e.HTML_INTEGRATION_POINTS?bt(e.HTML_INTEGRATION_POINTS):ft({},["annotation-xml"]);const t=dt(e,"CUSTOM_ELEMENT_HANDLING")&&e.CUSTOM_ELEMENT_HANDLING&&"object"==typeof e.CUSTOM_ELEMENT_HANDLING?bt(e.CUSTOM_ELEMENT_HANDLING):Ve(null);if(W=Ve(null),dt(t,"tagNameCheck")&&Ue(t.tagNameCheck)&&(W.tagNameCheck=t.tagNameCheck),dt(t,"attributeNameCheck")&&Ue(t.attributeNameCheck)&&(W.attributeNameCheck=t.attributeNameCheck),dt(t,"allowCustomizedBuiltInElements")&&"boolean"==typeof t.allowCustomizedBuiltInElements&&(W.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),te&&(Z=!1),ne&&(ae=!0),ue&&(V=ft({},St),q=Ve(null),!0===ue.html&&(ft(V,yt),ft(q,zt)),!0===ue.svg&&(ft(V,xt),ft(q,At),ft(q,Ct)),!0===ue.svgFilters&&(ft(V,_t),ft(q,At),ft(q,Ct)),!0===ue.mathMl&&(ft(V,kt),ft(q,Rt),ft(q,Ct))),X.tagCheck=null,X.attributeCheck=null,dt(e,"ADD_TAGS")&&("function"==typeof e.ADD_TAGS?X.tagCheck=e.ADD_TAGS:Ze(e.ADD_TAGS)&&(V===j&&(V=bt(V)),ft(V,e.ADD_TAGS,Fe))),dt(e,"ADD_ATTR")&&("function"==typeof e.ADD_ATTR?X.attributeCheck=e.ADD_ATTR:Ze(e.ADD_ATTR)&&(q===G&&(q=bt(q)),ft(q,e.ADD_ATTR,Fe))),dt(e,"ADD_URI_SAFE_ATTR")&&Ze(e.ADD_URI_SAFE_ATTR)&&ft(ye,e.ADD_URI_SAFE_ATTR,Fe),dt(e,"FORBID_CONTENTS")&&Ze(e.FORBID_CONTENTS)&&(fe===me&&(fe=bt(fe)),ft(fe,e.FORBID_CONTENTS,Fe)),dt(e,"ADD_FORBID_CONTENTS")&&Ze(e.ADD_FORBID_CONTENTS)&&(fe===me&&(fe=bt(fe)),ft(fe,e.ADD_FORBID_CONTENTS,Fe)),he&&(V["#text"]=!0),oe&&ft(V,["html","head","body"]),V.table&&(ft(V,["tbody"]),delete K.tbody),e.TRUSTED_TYPES_POLICY){if("function"!=typeof e.TRUSTED_TYPES_POLICY.createHTML)throw ht('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof e.TRUSTED_TYPES_POLICY.createScriptURL)throw ht('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const t=k;k=e.TRUSTED_TYPES_POLICY;try{$=z("")}catch(e){throw k=t,e}}else void 0===k&&null!==e.TRUSTED_TYPES_POLICY&&(k=function(e,t){if("object"!=typeof e||"function"!=typeof e.createPolicy)return null;let i=null;const o="data-tt-policy-suffix";t&&t.hasAttribute(o)&&(i=t.getAttribute(o));const r="dompurify"+(i?"#"+i:"");try{return e.createPolicy(r,{createHTML:e=>e,createScriptURL:e=>e})}catch(e){return console.warn("TrustedTypes policy "+r+" could not be created."),null}}(h,s)),k&&"string"==typeof $&&($=z(""));(F.uponSanitizeElement.length>0||F.uponSanitizeAttribute.length>0)&&V===j&&(V=bt(V)),F.uponSanitizeAttribute.length>0&&q===G&&(q=bt(q)),Be&&Be(e),Le=e},He=ft({},[...xt,..._t,...wt]),Pe=ft({},[...kt,...$t]),Ne=function(e){Xe(i.removed,{element:e});try{v(e).removeChild(e)}catch(t){f(e)}},je=function(e,t){try{Xe(i.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){Xe(i.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e)if(ae||ne)try{Ne(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}},qe=function(e){let t=null,i=null;if(se)e="<remove></remove>"+e;else{const t=tt(e,/^[\r\n\t ]+/);i=t&&t[0]}"application/xhtml+xml"===Te&&$e===ke&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");const r=k?z(e):e;if($e===ke)try{t=(new p).parseFromString(r,Te)}catch(e){}if(!t||!t.documentElement){t=R.createDocument($e,"template",null);try{t.documentElement.innerHTML=Se?$:r}catch(e){}}const s=t.body||t.documentElement;return e&&i&&s.insertBefore(o.createTextNode(i),s.childNodes[0]||null),$e===ke?T.call(t,oe?"html":"body")[0]:oe?t.documentElement:s},Ge=function(e){return C.call(e.ownerDocument||e,e,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},gt=function(e){var t,i;e.normalize();const o=C.call(e.ownerDocument||e,e,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null);let r=o.nextNode();for(;r;){let e=r.data;We([L,I,O],t=>{e=it(e,t," ")}),r.data=e,r=o.nextNode()}const s=null!==(t=null===(i=e.querySelectorAll)||void 0===i?void 0:i.call(e,"template"))&&void 0!==t?t:[];We(Array.from(s),e=>{mt(e.content)&&gt(e.content)})},ut=function(e){const t=w?w(e):null;return"string"==typeof t&&("form"===Fe(t)&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||e.attributes!==x(e)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes||e.nodeType!==_(e)||e.childNodes!==b(e)))},mt=function(e){if(!_||"object"!=typeof e||null===e)return!1;try{return _(e)===qt}catch(e){return!1}},Wt=function(e){if(!_||"object"!=typeof e||null===e)return!1;try{return"number"==typeof _(e)}catch(e){return!1}};function Kt(e,t,o){We(e,e=>{e.call(i,t,o,Le)})}const Yt=function(e){let t=null;if(Kt(F.beforeSanitizeElements,e,null),ut(e))return Ne(e),!0;const o=Fe(w?w(e):e.nodeName);if(Kt(F.uponSanitizeElement,e,{tagName:o,allowedTags:V}),ie&&e.hasChildNodes()&&!Wt(e.firstElementChild)&&pt(/<[/\w!]/g,e.innerHTML)&&pt(/<[/\w!]/g,e.textContent))return Ne(e),!0;if(ie&&e.namespaceURI===ke&&"style"===o&&Wt(e.firstElementChild))return Ne(e),!0;if(e.nodeType===Nt)return Ne(e),!0;if(ie&&e.nodeType===Vt&&pt(/<[/\w]/g,e.data))return Ne(e),!0;if(K[o]||!(X.tagCheck instanceof Function&&X.tagCheck(o))&&!V[o]){if(!K[o]&&Zt(o)){if(W.tagNameCheck instanceof RegExp&&pt(W.tagNameCheck,o))return!1;if(W.tagNameCheck instanceof Function&&W.tagNameCheck(o))return!1}if(he&&!fe[o]){const t=v(e),i=b(e);if(i&&t){for(let o=i.length-1;o>=0;--o){const r=u(i[o],!0);t.insertBefore(r,m(e))}}}return Ne(e),!0}return((_?_(e):e.nodeType)!==Pt||function(e){let t=v(e);t&&t.tagName||(t={namespaceURI:$e,tagName:"template"});const i=Qe(e.tagName),o=Qe(t.tagName);return!!ze[e.namespaceURI]&&(e.namespaceURI===we?t.namespaceURI===ke?"svg"===i:t.namespaceURI===_e?"svg"===i&&("annotation-xml"===o||Re[o]):Boolean(He[i]):e.namespaceURI===_e?t.namespaceURI===ke?"math"===i:t.namespaceURI===we?"math"===i&&Ce[o]:Boolean(Pe[i]):e.namespaceURI===ke?!(t.namespaceURI===we&&!Ce[o])&&!(t.namespaceURI===_e&&!Re[o])&&!Pe[i]&&(Ee[i]||!He[i]):!("application/xhtml+xml"!==Te||!ze[e.namespaceURI]))}(e))&&("noscript"!==o&&"noembed"!==o&&"noframes"!==o||!pt(/<\/no(script|embed|frames)/i,e.innerHTML))?(te&&e.nodeType===Bt&&(t=e.textContent,We([L,I,O],e=>{t=it(t,e," ")}),e.textContent!==t&&(Xe(i.removed,{element:e.cloneNode()}),e.textContent=t)),Kt(F.afterSanitizeElements,e,null),!1):(Ne(e),!0)},Xt=function(e,t,i){if(Y[t])return!1;if(de&&("id"===t||"name"===t)&&(i in o||i in Ie))return!1;const r=q[t]||X.attributeCheck instanceof Function&&X.attributeCheck(t,e);if(Z&&!Y[t]&&pt(U,t));else if(J&&pt(M,t));else if(!r||Y[t]){if(!(Zt(e)&&(W.tagNameCheck instanceof RegExp&&pt(W.tagNameCheck,e)||W.tagNameCheck instanceof Function&&W.tagNameCheck(e))&&(W.attributeNameCheck instanceof RegExp&&pt(W.attributeNameCheck,t)||W.attributeNameCheck instanceof Function&&W.attributeNameCheck(t,e))||"is"===t&&W.allowCustomizedBuiltInElements&&(W.tagNameCheck instanceof RegExp&&pt(W.tagNameCheck,i)||W.tagNameCheck instanceof Function&&W.tagNameCheck(i))))return!1}else if(ye[t]);else if(pt(N,it(i,P,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==ot(i,"data:")||!be[e]){if(Q&&!pt(H,it(i,P,"")));else if(i)return!1}else;return!0},Jt=ft({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Zt=function(e){return!Jt[Qe(e)]&&pt(B,e)},Qt=function(e){Kt(F.beforeSanitizeAttributes,e,null);const t=e.attributes;if(!t||ut(e))return;const o={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:q,forceKeepAttr:void 0};let r=t.length;for(;r--;){const s=t[r],a=s.name,n=s.namespaceURI,l=s.value,d=Fe(a),c=l;let p="value"===a?c:rt(c);if(o.attrName=d,o.attrValue=p,o.keepAttr=!0,o.forceKeepAttr=void 0,Kt(F.uponSanitizeAttribute,e,o),p=o.attrValue,!ce||"id"!==d&&"name"!==d||0===ot(p,pe)||(je(a,e),p=pe+p),ie&&pt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,p)){je(a,e);continue}if("attributename"===d&&tt(p,"href")){je(a,e);continue}if(o.forceKeepAttr)continue;if(!o.keepAttr){je(a,e);continue}if(!ee&&pt(/\/>/i,p)){je(a,e);continue}te&&We([L,I,O],e=>{p=it(p,e," ")});const g=Fe(e.nodeName);if(Xt(g,d,p)){if(k&&"object"==typeof h&&"function"==typeof h.getAttributeType)if(n);else switch(h.getAttributeType(g,d)){case"TrustedHTML":p=z(p);break;case"TrustedScriptURL":p=k.createScriptURL(p)}if(p!==c)try{n?e.setAttributeNS(n,a,p):e.setAttribute(a,p),ut(e)?Ne(e):Ye(i.removed)}catch(t){je(a,e)}}else je(a,e)}Kt(F.afterSanitizeAttributes,e,null)},ei=function(e){let t=null;const i=Ge(e);for(Kt(F.beforeSanitizeShadowDOM,e,null);t=i.nextNode();){Kt(F.uponSanitizeShadowNode,t,null),Yt(t),Qt(t),mt(t.content)&&ei(t.content);if((_?_(t):t.nodeType)===Pt){const e=y?y(t):t.shadowRoot;mt(e)&&(ti(e),ei(e))}}Kt(F.afterSanitizeShadowDOM,e,null)},ti=function(e){const t=_?_(e):e.nodeType;if(t===Pt){const t=y?y(e):e.shadowRoot;mt(t)&&(ti(t),ei(t))}const i=b?b(e):e.childNodes;if(!i)return;const o=[];We(i,e=>{Xe(o,e)});for(const e of o)ti(e);if(t===Pt){const t=w?w(e):null;if("string"==typeof t&&"template"===Fe(t)){const t=e.content;mt(t)&&ti(t)}}};return i.sanitize=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=null,s=null,a=null,n=null;if(Se=!e,Se&&(e="\x3c!--\x3e"),"string"!=typeof e&&!Wt(e)&&"string"!=typeof(e=function(e){switch(typeof e){case"string":return e;case"number":return st(e);case"boolean":return at(e);case"bigint":return nt?nt(e):"0";case"symbol":return lt?lt(e):"Symbol()";case"undefined":default:return ct(e);case"function":case"object":{if(null===e)return ct(e);const t=e,i=vt(t,"toString");if("function"==typeof i){const e=i(t);return"string"==typeof e?e:ct(e)}return ct(e)}}}(e)))throw ht("dirty is not a string, aborting");if(!i.isSupported)return e;if(re||Me(t),i.removed=[],"string"==typeof e&&(ge=!1),ge){const t=w?w(e):e.nodeName;if("string"==typeof t){const e=Fe(t);if(!V[e]||K[e])throw ht("root node is forbidden and cannot be sanitized in-place")}if(ut(e))throw ht("root node is clobbered and cannot be sanitized in-place");ti(e)}else if(Wt(e))o=qe("\x3c!----\x3e"),s=o.ownerDocument.importNode(e,!0),s.nodeType===Pt&&"BODY"===s.nodeName||"HTML"===s.nodeName?o=s:o.appendChild(s),ti(s);else{if(!ae&&!te&&!oe&&-1===e.indexOf("<"))return k&&le?z(e):e;if(o=qe(e),!o)return ae?null:le?$:""}o&&se&&Ne(o.firstChild);const l=Ge(ge?e:o);for(;a=l.nextNode();)Yt(a),Qt(a),mt(a.content)&&ei(a.content);if(ge)return te&&gt(e),e;if(ae){if(te&&gt(o),ne)for(n=E.call(o.ownerDocument);o.firstChild;)n.appendChild(o.firstChild);else n=o;return(q.shadowroot||q.shadowrootmode)&&(n=D.call(r,n,!0)),n}let d=oe?o.outerHTML:o.innerHTML;return oe&&V["!doctype"]&&o.ownerDocument&&o.ownerDocument.doctype&&o.ownerDocument.doctype.name&&pt(Mt,o.ownerDocument.doctype.name)&&(d="<!DOCTYPE "+o.ownerDocument.doctype.name+">\n"+d),te&&We([L,I,O],e=>{d=it(d,e," ")}),k&&le?z(d):d},i.setConfig=function(){Me(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),re=!0},i.clearConfig=function(){Le=null,re=!1},i.isValidAttribute=function(e,t,i){Le||Me({});const o=Fe(e),r=Fe(t);return Xt(o,r,i)},i.addHook=function(e,t){"function"==typeof t&&Xe(F[e],t)},i.removeHook=function(e,t){if(void 0!==t){const i=Ke(F[e],t);return-1===i?void 0:Je(F[e],i,1)[0]}return Ye(F[e])},i.removeHooks=function(e){F[e]=[]},i.removeAllHooks=function(){F={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},i}();class Kt extends ae{static properties={repo:{type:Object},open:{type:Boolean},_loading:{type:Boolean,state:!0},_error:{type:String,state:!0},_iframeSrc:{type:String,state:!0},_cardName:{type:String,state:!0}};constructor(){super(),this.repo=null,this.open=!1,this._loading=!1,this._error=null,this._iframeSrc=null,this._cardName=null}willUpdate(e){e.has("open")&&this.open&&this.repo&&this._startPreview(),e.has("open")&&!this.open&&this._cleanup()}_cleanup(){this._iframeSrc=null,this._error=null,this._cardName=null,this._loading=!1}async _startPreview(){this._loading=!0,this._error=null,this._iframeSrc=null;const e=this.repo?.full_name,t=this.repo?.default_branch||"main";if(!e)return this._error=xe("previewNoRepo"),void(this._loading=!1);const i=await this._findPluginJs(e,t);if(!i)return this._error=xe("previewNoJs"),void(this._loading=!1);this._iframeSrc=this._buildIframeSrc(e,t,i),this._loading=!1}async _findPluginJs(e,t){const i=`https://raw.githubusercontent.com/${e}/${t}`,o=["dist/card.js","dist/mini-graph-card.js","dist/index.js","dist/card.js"];for(const e of o)try{if((await fetch(`${i}/${e}`,{method:"HEAD"})).ok)return`${i}/${e}`}catch{}try{const o=await fetch(`https://api.github.com/repos/${e}/git/trees/${t}?recursive=1`);if(o.ok){const e=((await o.json()).tree||[]).filter(e=>e.path.endsWith(".js")&&"blob"===e.type).map(e=>e.path),t=e.filter(e=>e.startsWith("dist/")),r=e.filter(e=>!e.includes("/")&&e.endsWith(".js")),s=[...t,...r];for(const e of s)if(!(e.includes("test")||e.includes("config")||e.includes("rollup")||e.includes("webpack")))return`${i}/${e}`;if(s.length>0)return`${i}/${s[0]}`}}catch{}return null}_buildIframeSrc(e,t,i){return"data:text/html;base64,"+btoa(unescape(encodeURIComponent(`<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>\n  body {\n    margin: 0; padding: 20px;\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    background: var(--ha-card-background, #1c1c1c);\n    color: var(--primary-text-color, #e0e0e0);\n    display: flex; align-items: center; justify-content: center;\n    min-height: 100vh;\n  }\n  #card-container {\n    width: 100%; max-width: 500px;\n  }\n  .error {\n    color: #f44336; padding: 20px; text-align: center;\n    font-size: 14px; border: 1px dashed #f44336; border-radius: 8px;\n  }\n  .loading {\n    color: #999; text-align: center; padding: 40px;\n    font-size: 14px;\n  }\n</style>\n</head>\n<body>\n<div id="card-container"><div class="loading">Loading plugin...</div></div>\n\n<script>\n// ── Mock hass object with sample entities ──\nconst MOCK_HASS = {\n  language: 'zh-Hans',\n  config: { unit_system: { length: 'km', mass: 'kg', temperature: '°C' } },\n  states: {\n    'light.living_room': {\n      entity_id: 'light.living_room', state: 'on',\n      attributes: { friendly_name: '客厅灯', brightness: 180, color_temp: 370, icon: 'mdi:ceiling-light' },\n    },\n    'light.bedroom': {\n      entity_id: 'light.bedroom', state: 'off',\n      attributes: { friendly_name: '卧室灯', brightness: 0, icon: 'mdi:lamp' },\n    },\n    'light.kitchen': {\n      entity_id: 'light.kitchen', state: 'on',\n      attributes: { friendly_name: '厨房灯', brightness: 255, rgb_color: [255, 200, 100] },\n    },\n    'sensor.temperature': {\n      entity_id: 'sensor.temperature', state: '24.5',\n      attributes: { friendly_name: '温度', unit_of_measurement: '°C', device_class: 'temperature' },\n    },\n    'sensor.humidity': {\n      entity_id: 'sensor.humidity', state: '62',\n      attributes: { friendly_name: '湿度', unit_of_measurement: '%', device_class: 'humidity' },\n    },\n    'sensor.power': {\n      entity_id: 'sensor.power', state: '1250',\n      attributes: { friendly_name: '功率', unit_of_measurement: 'W', device_class: 'power' },\n    },\n    'switch.fan': {\n      entity_id: 'switch.fan', state: 'on',\n      attributes: { friendly_name: '风扇' },\n    },\n    'binary_sensor.door': {\n      entity_id: 'binary_sensor.door', state: 'off',\n      attributes: { friendly_name: '门传感器', device_class: 'door' },\n    },\n    'binary_sensor.motion': {\n      entity_id: 'binary_sensor.motion', state: 'on',\n      attributes: { friendly_name: '人体传感器', device_class: 'motion' },\n    },\n    'climate.thermostat': {\n      entity_id: 'climate.thermostat', state: 'cool',\n      attributes: {\n        friendly_name: '空调', temperature: 25, current_temperature: 24.5,\n        hvac_modes: ['cool', 'heat', 'off'], hvac_mode: 'cool',\n      },\n    },\n    'cover.garage': {\n      entity_id: 'cover.garage', state: 'closed',\n      attributes: { friendly_name: '车库门', device_class: 'garage' },\n    },\n    'media_player.living_room': {\n      entity_id: 'media_player.living_room', state: 'playing',\n      attributes: { friendly_name: '客厅音箱', media_title: 'Music', volume_level: 0.5 },\n    },\n    'person.user': {\n      entity_id: 'person.user', state: 'home',\n      attributes: { friendly_name: '用户' },\n    },\n    'weather.home': {\n      entity_id: 'weather.home', state: 'sunny',\n      attributes: { friendly_name: '天气', temperature: 26, humidity: 55 },\n    },\n  },\n  // Mock entity helpers\n  states: null, // Will be set above\n  callService: function(domain, service, data) { console.log('callService', domain, service, data); },\n  callWS: function(msg) { return Promise.resolve({}); },\n};\nMOCK_HASS.states = MOCK_HASS.states;\n\n// ── Mock lovelace ──\nwindow.lovelace = {\n  config: { views: [{ cards: [] }] },\n};\n\n// ── Register custom card system ──\nwindow.customCards = window.customCards || [];\n\n// ── Load the plugin JS ──\nconst script = document.createElement('script');\nscript.src = '${i}';\nscript.crossOrigin = 'anonymous';\nscript.onload = function() {\n  // Wait for custom element to be defined\n  setTimeout(function() {\n    const container = document.getElementById('card-container');\n    if (!container) return;\n\n    // Find registered card name\n    const cards = window.customCards || [];\n    if (cards.length === 0) {\n      container.innerHTML = '<div class="error">No custom card registered by this plugin.<br>The JS loaded but did not register via window.customCards.</div>';\n      return;\n    }\n\n    const card = cards[0];\n    const tagName = 'custom:' + card.name;\n\n    // Try to create the element\n    try {\n      const el = document.createElement(tagName);\n\n      // Build a default config\n      const config = {\n        type: tagName,\n        entities: ['light.living_room', 'light.bedroom', 'light.kitchen', 'sensor.temperature', 'sensor.humidity'],\n        entity: 'light.living_room',\n        name: card.name,\n      };\n\n      // Some cards expect specific config\n      if (card.name.includes('graph') || card.name.includes('chart')) {\n        config.entities = ['sensor.temperature', 'sensor.humidity', 'sensor.power'];\n        config.hours_to_show = 24;\n        config.show = { icon: true, name: true, state: true, graph: 'line' };\n      }\n      if (card.name.includes('gauge')) {\n        config.entity = 'sensor.temperature';\n        config.min = 0;\n        config.max = 40;\n        config.severity = [{ value: 0, color: '#2196f3' }, { value: 20, color: '#4caf50' }, { value: 35, color: '#f44336' }];\n      }\n      if (card.name.includes('weather')) {\n        config.entity = 'weather.home';\n      }\n      if (card.name.includes('media') || card.name.includes('player')) {\n        config.entity = 'media_player.living_room';\n      }\n      if (card.name.includes('thermostat') || card.name.includes('climate')) {\n        config.entity = 'climate.thermostat';\n      }\n\n      el.setConfig(config);\n\n      // Try to set hass if the element has the method\n      if (typeof el.setHass === 'function') {\n        el.setHass(MOCK_HASS);\n      } else if ('hass' in el) {\n        el.hass = MOCK_HASS;\n      }\n\n      container.innerHTML = '';\n      container.appendChild(el);\n\n      // Signal success\n      window.parent.postMessage({ type: 'hacs-preview-ready', cardName: card.name }, '*');\n    } catch (e) {\n      container.innerHTML = '<div class="error">Failed to render card:<br><pre>' + e.message + '</pre></div>';\n      window.parent.postMessage({ type: 'hacs-preview-error', error: e.message }, '*');\n    }\n  }, 500); // Wait for element registration\n};\nscript.onerror = function() {\n  document.getElementById('card-container').innerHTML =\n    '<div class="error">Failed to load plugin JS from GitHub.<br>The file may not exist at the expected path.</div>';\n  window.parent.postMessage({ type: 'hacs-preview-error', error: 'Failed to load JS' }, '*');\n};\ndocument.head.appendChild(script);\n<\/script>\n</body>\n</html>`)))}_onMessage(e){"hacs-preview-ready"===e.data?.type?this._cardName=e.data.cardName:"hacs-preview-error"===e.data?.type&&(this._error=e.data.error)}connectedCallback(){super.connectedCallback(),this._messageHandler=this._onMessage.bind(this),window.addEventListener("message",this._messageHandler)}disconnectedCallback(){window.removeEventListener("message",this._messageHandler),super.disconnectedCallback()}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}static styles=s`
    :host { display: none; }
    :host([open]) { display: block; }

    .overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      width: 90vw; max-width: 600px;
      max-height: 85vh;
      display: flex; flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.25s ease;
    }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }
    .header-title {
      font-size: 16px; font-weight: 600;
      color: var(--primary-text-color, #333);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    .header-btn {
      background: none; border: none; cursor: pointer;
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: var(--secondary-text-color, #666);
      transition: background 0.15s;
    }
    .header-btn:hover { background: var(--secondary-background-color, #f0f0f0); }
    .header-btn svg { width: 18px; height: 18px; }

    .body {
      flex: 1; overflow: hidden;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative;
      min-height: 300px;
      background: #1c1c1c;
    }

    .loading-spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loading-text {
      color: #999; font-size: 13px; margin-top: 12px;
    }
    .error-box {
      color: #f44336; padding: 20px; text-align: center;
      font-size: 13px; background: rgba(244,67,54,0.1);
      border-radius: 8px; margin: 16px;
    }

    .preview-iframe {
      width: 100%; height: 100%;
      border: none; min-height: 300px;
    }

    .card-badge {
      position: absolute; top: 8px; right: 8px;
      background: rgba(0,0,0,0.6); color: #fff;
      padding: 4px 10px; border-radius: 10px;
      font-size: 11px; font-weight: 500;
      z-index: 5;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;render(){return this.open?N`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&this._close()}}>
        <div class="dialog">
          <div class="header">
            <div class="header-title">
              ${xe("previewTitle")}: ${this.repo?.manifest_name||this.repo?.name||this.repo?.full_name||""}
            </div>
            <div class="header-actions">
              <button class="header-btn" @click=${this._close} title="${xe("close")}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div class="body">
            ${this._cardName?N`
              <div class="card-badge">${this._cardName}</div>
            `:""}

            ${this._loading?N`
              <div class="loading-spinner"></div>
              <div class="loading-text">${xe("previewLoading")}</div>
            `:this._error?N`
              <div class="error-box">${this._error}</div>
            `:this._iframeSrc?N`
              <iframe class="preview-iframe" src=${this._iframeSrc} sandbox="allow-scripts" allow="cross-origin-isolated"></iframe>
            `:""}
          </div>
        </div>
      </div>
    `:N``}}customElements.define("card-preview-dialog",Kt);class Yt extends(ce(ae)){static properties={currentView:{type:String},stats:{type:Object},hass:{type:Object},narrow:{type:Boolean},_apiReady:{type:Boolean,state:!0},_error:{type:String,state:!0},_detailRepo:{type:Object,state:!0},_showDetail:{type:Boolean,state:!0},_favoriteCount:{type:Number,state:!0},_readmeHtml:{type:String,state:!0},_readmeLoading:{type:Boolean,state:!0},_translationLoading:{type:Boolean,state:!0},_readmeLang:{type:String,state:!0},_viewTransition:{type:Boolean,state:!0},_networkStatus:{type:String,state:!0},_restarting:{type:Boolean,state:!0},_detailExpanded:{type:Boolean,state:!0},_showVersionSelector:{type:Boolean,state:!0},_releases:{type:Array,state:!0},_releasesLoading:{type:Boolean,state:!0},_installingVersion:{type:Boolean,state:!0},_changelogData:{type:Object,state:!0},_changelogLoading:{type:Boolean,state:!0},_presetFilter:{type:String,state:!0},_presetTag:{type:String,state:!0},_releaseTab:{type:Number,state:!0},_configFlowDomain:{type:String,state:!0},_configFlowEntryId:{type:String,state:!0},_configFlowSubentryType:{type:String,state:!0},_configFlowIsReconfigure:{type:Boolean,state:!0},_configFlowAction:{type:String,state:!0},_showConfigFlow:{type:Boolean,state:!0},_previewRepo:{type:Object,state:!0},_showPreview:{type:Boolean,state:!0},_configEntries:{type:Object,state:!0},_ignoredRepos:{type:Array,state:!0},_ignoredVersions:{type:Object,state:!0},_showEntrySelector:{type:Boolean,state:!0},_entrySelectorDomain:{type:String,state:!0},_entrySelectorEntries:{type:Array,state:!0},_entrySelectorCurrentId:{type:String,state:!0},_langVersion:{type:Number,state:!0}};constructor(){var e;super(),this._langVersion=0,this.currentView=(()=>{try{return localStorage.getItem("hacs_vision_tab")}catch{return null}})()||"browse",this.stats={pendingRestart:0},this.narrow=window.innerWidth<768,this._apiReady=!1,this._error="",this._detailRepo=null,this._showDetail=!1,this._favoriteCount=0,this._readmeHtml=null,this._readmeLoading=!1,this._viewTransition=!1,this._networkStatus="online",this._restarting=!1,this._detailExpanded=!1,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._installingVersion=!1,this._changelogData=null,this._changelogLoading=!1,this._presetFilter="",this._presetTag="",this._releaseTab=0,this._configFlowDomain="",this._configFlowEntryId=null,this._showConfigFlow=!1,this._previewRepo=null,this._showPreview=!1,this._configEntries={},this._showEntrySelector=!1,this._entrySelectorDomain="",this._entrySelectorEntries=[],this._entrySelectorCurrentId=null,e=this,ze.set(e,!0),this._resizeHandler=()=>{this.narrow=window.innerWidth<768},window.addEventListener("resize",this._resizeHandler),this._onlineHandler=()=>{this._networkStatus="online"},this._offlineHandler=()=>{this._networkStatus="offline"},window.addEventListener("online",this._onlineHandler),window.addEventListener("offline",this._offlineHandler),this._langChangeHandler=()=>{this._langVersion=(this._langVersion||0)+1},window.addEventListener("hacs-lang-changed",this._langChangeHandler)}async _updateFavoriteCount(){try{const e=await de.getFavorites(),t=Array.isArray(e)?e:e.favorites||[];this._favoriteCount=t.length}catch{this._favoriteCount=0}}willUpdate(e){var t;e.has("hass")&&this.hass&&(t=this.hass,t?.language&&(he=fe(t.language),ue||(ge=he)),de.setHass(this.hass),this._apiReady||(this._apiReady=!0,this._updatePageTitle(this.currentView),Promise.all([this._loadStats(),this._loadConfigEntries()]).catch(e=>console.error("Init error:",e)),this._initLanguage(),de._onNetworkStatus=e=>{this._networkStatus=e}))}static styles=[Se(),s`
    :host {
      display: block;
      --fs-xs: 10px;
      --fs-sm: 11px;
      --fs-md: 12px;
      --fs-body: 13px;
      --fs-lg: 14px;
      --fs-xl: 16px;
    }

    /* ===== Typography Normalization ===== */
    .store { --fs: var(--fs-body); }

    .store {
      padding: 0 16px 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      min-height: 100vh;
      background: var(--primary-background-color, #f5f5f5);
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
      display: flex; flex-direction: column;
    }
    .store-content {
      flex: 1; overflow-y: auto; min-height: 0;
      padding-top: 12px;
    }

    /* ===== Error Banner ===== */
    .error-banner {
      margin-bottom: 12px; padding: 12px 16px;
      background: #fff3e0; border: 1px solid #ff9800; border-radius: 10px;
      color: #e65100; font-size: 13px;
    }
    .error-banner.error { background: #ffebee; border-color: #f44336; color: #c62828; }
    .error-banner code { background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-size: 12px; }

    /* ===== Header ===== */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px; padding: 14px 20px;
      background: linear-gradient(135deg, rgba(var(--rgb-primary-color, 3,169,244), 0.08) 0%, rgba(var(--rgb-primary-color, 3,169,244), 0.03) 100%);
      border-radius: 16px; border: 1px solid var(--divider-color, #e0e0e0);
    }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .header-icon {
      width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    }
    .header-icon ha-icon { --icon-size: 24px; color: var(--primary-color); }
    .sidebar-toggle {
      display: none; align-items: center; justify-content: center;
      width: 36px; height: 36px; border: none; background: transparent;
      color: var(--primary-text-color); cursor: pointer; border-radius: 8px;
      flex-shrink: 0; touch-action: manipulation;
    }
    .sidebar-toggle:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.1); }
    @media (max-width: 768px) { .sidebar-toggle { display: flex; } }
    .title-group h1 { font-size: 19px; font-weight: 700; color: var(--primary-text-color, #212121); margin: 0; }
    .title-group p { font-size: 12px; color: var(--secondary-text-color, #727272); margin: 4px 0 0; }
    .header-right { display: flex; gap: 24px; flex-wrap: wrap; }
    .stat { text-align: center; cursor: pointer; }
    .stat:hover .stat-num { opacity: 0.8; }
    .stat-num { font-size: 20px; font-weight: 700; color: var(--primary-color, #03a9f4); transition: opacity 0.15s; }
    .restart-btn {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 12px; border: 1px solid #f44336; border-radius: 4px;
      background: rgba(244,67,54,0.1); color: #f44336;
      line-height: 1.3; white-space: nowrap; cursor: pointer; font-size: 12px; font-weight: 600;
      transition: background 0.15s;
    }
    .restart-btn:hover { background: rgba(244,67,54,0.25); }
    .restart-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

    /* ===== Restart Bar (between header and content) ===== */
    .restart-bar {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 10px 14px; margin: 0 0 6px;
      background: rgba(244,67,54,0.08); border: 1px solid rgba(244,67,54,0.25);
      border-radius: 10px; font-size: 13px;
    }
    .restart-bar span { font-weight: 600; color: #f44336; flex: 1; }
    .restart-bar-btn {
      padding: 6px 14px; border: none; border-radius: 8px;
      font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap;
      background: #f44336; color: #fff; transition: opacity 0.15s;
    }
    .restart-bar-btn:hover { opacity: 0.85; }
    .restart-bar-btn.outline { background: transparent; border: 1px solid #f44336; color: #f44336; }
    .restart-bar-btn.outline:hover { background: rgba(244,67,54,0.1); }
    .restart-bar svg { flex-shrink: 0; }
    .stat-label { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 2px; text-transform: uppercase; }

    /* ===== Sticky Tabs ===== */
    .sticky-header {
      position: sticky; top: 0; z-index: 100;
      background: var(--primary-background-color, #f5f5f5);
      margin: 0 -16px 12px; padding: 0 16px 12px;
      padding-top: 12px;
    }
    .store-content {
      flex: 1; overflow-y: auto; min-height: 0;
    }
    .tabs-wrapper { position: relative; }
    .tabs {
      display: flex; gap: 6px; overflow-x: auto;
      padding-bottom: 4px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      -webkit-overflow-scrolling: touch;
    }
    .tabs::-webkit-scrollbar { display: none; }
    /* Mobile scroll hint - gradient fade on right */
    .tabs-wrapper::after {
      content: ''; position: absolute; right: 0; top: 0; bottom: 4px; width: 30px;
      background: linear-gradient(to right, transparent, var(--primary-background-color, #f5f5f5));
      pointer-events: none; opacity: 0; transition: opacity 0.3s;
    }
    .tabs-wrapper.scrollable::after { opacity: 1; }
    .tab {
      padding: 10px 18px; border-radius: 10px 10px 0 0;
      background: transparent; border: none;
      color: var(--secondary-text-color, #727272); cursor: pointer;
      font-size: 13px; font-weight: 500; transition: all 0.2s;
      white-space: nowrap; position: relative;
      touch-action: manipulation;
    }
    .tab:hover { color: var(--primary-color, #03a9f4); background: rgba(var(--rgb-primary-color, 3,169,244), 0.05); }
    .tab.active { color: var(--primary-color, #03a9f4); font-weight: 600; }
    .tab.active::after {
      content: ''; position: absolute; bottom: -1px; left: 10px; right: 10px;
      height: 2px; background: var(--primary-color, #03a9f4); border-radius: 2px;
    }
    .tab .badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 18px; height: 18px; padding: 0 5px;
      background: var(--primary-color, #03a9f4); color: #fff;
      border-radius: 9px; font-size: 10px; font-weight: 600;
      margin-left: 6px; vertical-align: middle;
    }

    /* ===== Content with transition ===== */
    .content {
      transition: opacity 0.12s ease;
      position: relative;
    }
    .content.transitioning { opacity: 0; }
    /* Smooth view transitions: hidden views are invisible but stay rendered */
    .content > [hidden] {
      display: none !important;
    }

    /* ===== Network Banner (F2) ===== */
    .network-banner {
      margin-bottom: 12px; padding: 12px 16px;
      border-radius: 10px; font-size: 13px; text-align: center;
      animation: slideDown 0.3s ease;
    }
    .network-banner.offline { background: #ffebee; border: 1px solid #f44336; color: #c62828; }
    .network-banner.warning { background: #fff3e0; border: 1px solid #ff9800; color: #e65100; }
    @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* ===== Toast Queue ===== */
    .toast-container {
      position: fixed;
      bottom: calc(30px + env(safe-area-inset-bottom, 0px));
      left: 50%; transform: translateX(-50%);
      z-index: 10000; display: flex; flex-direction: column-reverse; gap: 8px;
      pointer-events: none; max-width: calc(100vw - 32px);
    }
    .toast {
      background: var(--primary-color, #03a9f4); color: #fff;
      padding: 14px 26px; border-radius: 12px; font-size: 14px; font-weight: 500;
      opacity: 0; transform: translateY(20px);
      transition: all 0.35s; text-align: center;
      pointer-events: auto;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.success { background: var(--success-color, #4caf50); }
    .toast.error { background: var(--error-color, #f44336); }
    .toast.info { background: var(--primary-color, #03a9f4); }

    /* ===== Utility icons ===== */
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .update-badge { background: var(--warning-color, #ff9800); color: #fff; padding: 1px 6px; border-radius: 8px; font-size: 10px; display: inline-flex; align-items: center; gap: 2px; }

    .action-btn-sm {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 3px 10px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer;
      font-size: 11px; white-space: nowrap;
    }
    .action-btn-sm:hover { border-color: var(--primary-color); }

    /* ===== Detail Modal ===== */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 16px; width: 100%; max-width: 720px;
      max-height: 90vh; min-width: 360px; min-height: 300px;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.25s ease;
      position: relative; overflow: hidden;
      resize: both;
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* Resize handle indicator */
    .modal::after {
      content: ''; position: absolute; bottom: 4px; right: 4px;
      width: 14px; height: 14px; pointer-events: none; opacity: 0.3;
      border-right: 2px solid var(--secondary-text-color, #727272);
      border-bottom: 2px solid var(--secondary-text-color, #727272);
    }

    /* Expanded (double-click zoom) */
    .modal.expanded {
      max-width: 95vw; max-height: 95vh;
      width: 95vw; height: 95vh;
      transition: all 0.3s ease;
    }
    .modal:not(.expanded) {
      transition: all 0.3s ease;
    }

    /* Double-click hint */
    .modal-expand-hint {
      position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
      font-size: 10px; color: var(--secondary-text-color, #727272);
      opacity: 0.5; pointer-events: none;
    }

    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px 0; flex-shrink: 0;
    }
    .modal-title { font-size: 18px; font-weight: 700; color: var(--primary-text-color); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .modal-close {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #727272); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; transition: all 0.2s; flex-shrink: 0; margin-left: 12px;
      touch-action: manipulation;
    }
    .modal-close:hover { background: var(--divider-color, #e0e0e0); }
    .modal-expand-btn {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #727272); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; transition: all 0.2s; flex-shrink: 0;
      touch-action: manipulation;
    }
    .modal-expand-btn:hover { background: var(--divider-color, #e0e0e0); }

    .modal-header-left {
      display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;
    }
    .detail-avatar {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; position: relative;
    }
    .detail-avatar-img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
    .detail-avatar-letter { font-size: 18px; font-weight: 700; color: #fff; z-index: 1; }    .modal-body { padding: 16px 24px 24px; overflow-y: auto; flex: 1; }

    .detail-category {
      display: inline-block; padding: 4px 12px; border-radius: 6px;
      font-size: 11px; font-weight: 600; color: #fff; text-transform: uppercase;
      margin-bottom: 12px;
    }

    .detail-desc {
      font-size: 14px; color: var(--secondary-text-color); line-height: 1.6;
      margin-bottom: 16px;
    }

    .detail-authors {
      font-size: 12px; color: var(--secondary-text-color); margin-bottom: 12px;
    }
    .detail-authors svg { width: 14px; height: 14px; vertical-align: -2px; margin-right: 4px; }
    .detail-author-link { color: var(--primary-color); text-decoration: none; margin-right: 8px; }
    .detail-author-link:hover { text-decoration: underline; }

    .detail-topics {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
    }
    .detail-topic-tag {
      display: inline-block; padding: 2px 10px; border-radius: 4px;
      font-size: 11px; background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }

    .detail-stats {
      display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;
    }
    .detail-stat {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--secondary-text-color);
    }
    .detail-stat svg { width: 16px; height: 16px; }
    .detail-stat .val { font-weight: 600; color: var(--primary-text-color); }
    .detail-stat .github-link { text-decoration: none; }
    .detail-stat .github-link:hover { text-decoration: underline; color: var(--primary-color); }

    .detail-version {
      padding: 12px 16px; background: var(--secondary-background-color, #f0f0f0);
      border-radius: 10px; margin-bottom: 16px;
    }
    .detail-version-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-version-label { font-size: 12px; color: var(--secondary-text-color); }
    .detail-version-value { font-size: 14px; font-weight: 600; color: var(--primary-text-color); }

    /* Version Selector */
    .version-selector {
      margin-bottom: 16px; border: 1px solid var(--divider-color);
      border-radius: 10px; overflow: hidden;
    }
    .version-selector-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; cursor: pointer; background: var(--secondary-background-color, #f0f0f0);
      font-size: 13px; font-weight: 600; color: var(--primary-text-color);
      touch-action: manipulation;
    }
    .version-selector-header:hover { background: var(--divider-color, #e0e0e0); }
    .version-selector-arrow { transition: transform 0.2s; font-size: 10px; }
    .version-selector-arrow.open { transform: rotate(180deg); }
    .version-selector-body {
      max-height: 300px; overflow-y: auto; border-top: 1px solid var(--divider-color);
    }
    .release-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; border-bottom: 1px solid var(--divider-color);
      font-size: 13px; transition: background 0.15s;
    }
    .release-item:last-child { border-bottom: none; }
    .release-item:hover { background: var(--secondary-background-color); }
    .release-info { flex: 1; min-width: 0; }
    .release-tag { font-weight: 600; color: var(--primary-text-color); display: flex; align-items: center; gap: 6px; }
    .release-tag .prerelease-badge {
      font-size: 9px; padding: 2px 6px; border-radius: 4px;
      background: #ff9800; color: #fff; font-weight: 600;
    }
    .release-date { font-size: 11px; color: var(--secondary-text-color); margin-top: 2px; }
    .release-install-btn {
      padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600;
      border: 1px solid var(--primary-color); background: transparent;
      color: var(--primary-color); cursor: pointer; transition: all 0.2s;
      touch-action: manipulation; flex-shrink: 0;
    }
    .release-install-btn:hover { background: var(--primary-color); color: #fff; }
    .release-install-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .releases-loading { text-align: center; padding: 16px; color: var(--secondary-text-color); font-size: 13px; }
    .releases-empty { text-align: center; padding: 16px; color: var(--secondary-text-color); font-size: 13px; font-style: italic; }

    .release-tabs {
      display: flex; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      margin: 0 -16px; padding: 0 16px; flex-shrink: 0;
    }
    .release-tab {
      padding: 8px 16px; font-size: 12px; font-weight: 600;
      cursor: pointer; border-bottom: 2px solid transparent;
      color: var(--secondary-text-color); transition: all 0.2s;
      user-select: none;
    }
    .release-tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .release-tab:hover { color: var(--primary-text-color); }

    .modal-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .modal-btn {
      padding: 10px 18px; border-radius: 10px;
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
      touch-action: manipulation;
    }
    .modal-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .modal-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .modal-btn.primary:hover { opacity: 0.9; }
    .modal-btn.danger { color: #f44336; border-color: #f44336; }
    .modal-btn.danger:hover { background: #f44336; color: #fff; }
    .modal-btn svg { width: 16px; height: 16px; }

    .detail-action-btn {
      display: inline-block; padding: 6px 14px; border-radius: 6px;
      background: var(--primary-color); color: #fff;
      border: none; cursor: pointer; font-size: 12px; font-weight: 600;
      margin: 4px 4px 0 0;
    }
    .detail-action-btn:hover { opacity: 0.9; }

    /* ===== Detail README — single scroll (no double scroll) ===== */
    .detail-changelog {
      margin-bottom: 16px; padding: 14px 16px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 10px; border-left: 3px solid var(--success-color, #0f9d58);
    }
    .detail-changelog-title {
      font-size: 14px; font-weight: 600;
      color: var(--primary-text-color); margin-bottom: 10px;
    }
    .changelog-body {
      font-size: 13px; color: var(--primary-text-color);
      line-height: 1.6; white-space: pre-wrap;
      max-height: 200px; overflow-y: auto;
    }
    .changelog-tag {
      font-size: 11px; color: var(--secondary-text-color);
      margin-top: 8px;
    }
    .changelog-link {
      display: inline-block; margin-top: 8px;
      font-size: 12px; color: var(--primary-color);
      text-decoration: none;
    }
    .changelog-link:hover { text-decoration: underline; }
    .changelog-empty {
      font-size: 13px; color: var(--secondary-text-color);
      font-style: italic;
    }

    .detail-readme {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding-top: 16px;
    }
    .detail-readme-title {
      font-size: 14px; font-weight: 600;
      color: var(--primary-text-color); margin-bottom: 12px;
    }
    .readme-lang-bar {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 12px; flex-wrap: wrap;
    }
    .readme-lang-btn {
      padding: 4px 12px; border-radius: 16px; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 12px; transition: all 0.15s ease;
    }
    .readme-lang-btn:hover:not(:disabled) {
      border-color: var(--primary-color, #03a9f4);
    }
    .readme-lang-btn.active {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .readme-lang-btn:disabled { opacity: 0.5; cursor: default; }
    .readme-translating {
      display: flex; align-items: center; gap: 10px;
      padding: 20px 0; font-size: 13px;
      color: var(--secondary-text-color);
    }
    .readme-content {
      font-size: 13px; line-height: 1.6;
      color: var(--primary-text-color); padding-right: 8px;
    }
    .readme-content img { max-width: 100%; height: auto; }
    .readme-content pre {
      background: var(--secondary-background-color, #f5f5f5);
      padding: 12px; border-radius: 8px;
      overflow-x: auto; font-size: 12px;
    }
    .readme-content code {
      background: var(--secondary-background-color, #f5f5f5);
      padding: 2px 6px; border-radius: 4px; font-size: 12px;
    }
    .readme-content h1, .readme-content h2, .readme-content h3 {
      margin-top: 16px; margin-bottom: 8px;
    }
    .readme-content table { border-collapse: collapse; width: 100%; }
    .readme-content th, .readme-content td {
      border: 1px solid var(--divider-color); padding: 8px; text-align: left;
    }
    .readme-loading {
      text-align: center; padding: 20px;
      color: var(--secondary-text-color);
    }
    .readme-error {
      text-align: center; padding: 20px;
      color: var(--secondary-text-color); font-style: italic;
    }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .store { padding: 0 10px 8px; padding-top: calc(0px + env(safe-area-inset-top, 0px)); padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); }
      .sticky-header { position: relative; margin: 0 -10px 0; padding: 0 10px 0; padding-top: 6px; }
      .sidebar-toggle {
        position: absolute; left: max(0px, env(safe-area-inset-left, 0px)); top: 10px; z-index: 10;
        width: 48px; height: 48px;
        display: flex; align-items: center; justify-content: center;
        border: none; background: transparent;
        color: var(--primary-text-color); cursor: pointer;
        touch-action: manipulation;
      }
      .sidebar-toggle svg { width: 24px; height: 24px; }
      .header {
        flex-direction: row; align-items: center; justify-content: space-between;
        padding: 6px 10px 6px 30px; margin-bottom: 0; border-radius: 12px;
      }
      .header-left { gap: 2px; align-items: center; }
      .header-icon { width: 28px; height: 28px; font-size: 14px; border-radius: 8px; flex-shrink: 0; }
      .title-group h1 { font-size: 14px; text-align: left; }
      .title-group p { display: none; }
      .restart-bar { font-size: 12px; padding: 8px 10px; }
      .restart-bar-btn { font-size: 11px; padding: 5px 10px; }
      .header-right { gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
      .stat { text-align: center; min-width: 32px; }
      .stat-num { font-size: 13px; }
      .stat-label { font-size: 10px; white-space: nowrap; }
      .restart-btn { font-size: 10px; padding: 2px 8px; }
      .restart-btn svg { width: 12px; height: 12px; }
      .tab { padding: 4px 12px; font-size: 12px; min-height: 44px; display: flex; align-items: center; }
      .controls-right { gap: 4px; }
      .controls .search { min-width: 80px; }
      .chip { font-size: 11px; padding: 5px 10px; }

      /* Mobile modal: fullscreen */
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal {
        max-width: 100%; max-height: 92vh; border-radius: 16px 16px 0 0;
        resize: none;
      }
      .modal::after { display: none; }
      .modal::before {
        content: ''; display: block; width: 36px; height: 4px;
        border-radius: 2px; background: var(--divider-color, #ccc);
        margin: 8px auto 0; flex-shrink: 0;
      }
      .modal-header { padding: 8px 16px 0; }
      .modal-body { padding: 12px 16px 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
      .modal-actions { flex-direction: column; }
      .modal-btn { width: 100%; justify-content: center; min-height: 44px; }
      .version-selector-body { max-height: 200px; }
    }

    /* ===== Entry Selector ===== */
    .entry-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.15s ease;
    }
    .entry-dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px; padding: 24px;
      max-width: 400px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.2s ease;
      user-select: text;
      -webkit-user-select: text;
    }
    .entry-title { font-size: 17px; font-weight: 600; margin-bottom: 4px; color: var(--primary-text-color, #212121); }
    .entry-subtitle { font-size: 13px; color: var(--secondary-text-color, #727272); margin-bottom: 16px; }
    .entry-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .entry-btn {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px; background: var(--card-background-color, #fff);
      cursor: pointer; transition: all 0.15s; text-align: left; width: 100%;
    }
    .entry-btn:hover { border-color: var(--primary-color, #03a9f4); background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .entry-btn-icon {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.1);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 16px;
    }
    .entry-btn-text { display: flex; flex-direction: column; min-width: 0; }
    .entry-btn-title { font-size: 14px; font-weight: 500; color: var(--primary-text-color, #212121); }
    .entry-btn-domain { font-size: 12px; color: var(--secondary-text-color, #727272); }
    .entry-btn-current { font-size: 11px; color: var(--primary-color, #03a9f4); }
    .entry-cancel {
      display: block; width: 100%; text-align: center;
      padding: 10px; border: none; background: none;
      color: var(--secondary-text-color, #727272); font-size: 14px;
      cursor: pointer; border-radius: 10px;
    }
    .entry-cancel:hover { background: rgba(0,0,0,0.04); }
  `];async connectedCallback(){super.connectedCallback(),this.addEventListener("refresh-stats",()=>this._loadStats()),this.addEventListener("detail",e=>this._openDetail(e.detail.repo)),this.addEventListener("preview",e=>{this._previewRepo=e.detail?.repo,this._showPreview=!0}),this.addEventListener("favorite",()=>this._loadStats()),this.addEventListener("open-flow",e=>{const t=e.detail?.domain;t&&this._openConfigFlow(t)}),this.addEventListener("open-options-flow",e=>{const{entryId:t,domain:i}=e.detail||{};t&&this._openOptionsFlow(t,i)}),this.addEventListener("report-issue",e=>{const t=e.detail?.repo;t&&this._handleIssueReport(t)}),this._keydownHandler=e=>{if("Escape"===e.key&&this._showDetail)return e.preventDefault(),void this._closeDetail();if((e.ctrlKey||e.metaKey)&&"k"===e.key){e.preventDefault();const t=this.renderRoot?.querySelector(".search input");return void(t&&(t.focus(),t.select()))}},window.addEventListener("keydown",this._keydownHandler),document.hidden||this._checkCacheVersion(),this._visibilityHandler=()=>{document.hidden||this._checkCacheVersion()},document.addEventListener("visibilitychange",this._visibilityHandler)}disconnectedCallback(){super.disconnectedCallback(),this._statsRetryTimer&&(clearTimeout(this._statsRetryTimer),this._statsRetryTimer=null),this._clearFlowTimeout(),window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("online",this._onlineHandler),window.removeEventListener("offline",this._offlineHandler),window.removeEventListener("keydown",this._keydownHandler),this._visibilityHandler&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null),this._langChangeHandler&&(window.removeEventListener("hacs-lang-changed",this._langChangeHandler),this._langChangeHandler=null)}async _loadStats(){try{this._error="",this.stats=await de.getStats(),this._updateSidebarBadge(this.stats.available_updates??0),this._restarting&&(this._restarting=!1),"server_error"===this._networkStatus&&(this._networkStatus="online");const e=await de.getFavorites(),t=Array.isArray(e)?e:e.favorites||[];this._favoriteCount=t.length;try{const e=await de.getConfig();this._ignoredRepos=e.ignored_repositories||[]}catch(e){}try{this._ignoredVersions=await de.getIgnoredVersions()}catch(e){}}catch(e){console.error("Stats error:",e),this.stats={},this._error=`API: ${e.message}`,this._restarting&&!this._statsRetryTimer&&(this._statsRetryCount=(this._statsRetryCount||0)+1,this._statsRetryCount<=6?this._scheduleStatsRetry():(this._restarting=!1,this._networkStatus="server_error",console.warn("Stats retry limit reached, giving up restart detection")))}}_updateSidebarBadge(e){De(e)}_scheduleStatsRetry(){this._statsRetryTimer=setTimeout(async()=>{this._statsRetryTimer=null;try{this.stats=await de.getStats(),this._updateSidebarBadge(this.stats.available_updates??0),this._restarting=!1,"server_error"===this._networkStatus&&(this._networkStatus="online")}catch(e){this._statsRetryCount=(this._statsRetryCount||0)+1,this._statsRetryCount<=6?this._scheduleStatsRetry():(this._restarting=!1,this._networkStatus="server_error",console.warn("Stats retry limit reached, giving up restart detection"))}},5e3)}async _checkCacheVersion(){try{const e=document.querySelector('script[src*="panel.js"]');if(!e)return;const t=new URL(e.src,location.href).searchParams.get("v");if(!t)return;const i=await fetch("./build.json?_t="+Date.now());if(!i.ok)return;const o=await i.json();o.hash&&o.hash!==t&&location.reload()}catch(e){console.warn("Cache check error:",e)}}async _restartHA(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Zt});if(await e.show(this,{message:xe("restartConfirm"),confirmText:xe("restartHA"),danger:!0})){this._restarting=!0;try{await de.restartHA(),Ce(xe("haRestarting"),"info")}catch(e){Ce(`${xe("restartFailed")}: ${e.message}`,"error")}}}switchView(e){if(this.currentView!==e){this._viewTransition=!0,this.currentView=e;try{localStorage.setItem("hacs_vision_tab",e)}catch(e){}this.dispatchEvent(new CustomEvent("view-changed",{detail:{view:e},bubbles:!0,composed:!0})),setTimeout(()=>{this._viewTransition=!1},150),this._updatePageTitle(e)}}_updatePageTitle(e){const t={browse:xe("tabBrowse"),integrations:xe("tabIntegrations"),updates:xe("tabUpdates"),management:xe("tabManagement"),settings:xe("tabSettings")};document.title=`${t[e]||e} · HACS Vision`}async _openDetail(e){this._detailRepo=e,this._showDetail=!0,this._readmeHtml=null,this._readmeLoading=!0,this._translationLoading=!1,this._readmeLang="original",this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._changelogData=null,this._changelogLoading=!0;try{const e=await de.getSettings();this._settings=e||{}}catch{}this._loadReadme(e),this._loadChangelog(e),requestAnimationFrame(()=>this._installFocusTrap())}async _loadReadme(e){if(e?.full_name){try{const t=await de.getReadme(e.full_name);this._readmeHtml=t?Wt.sanitize(t):null}catch(e){this._readmeHtml=null}this._readmeLoading=!1}else this._readmeLoading=!1}async _onReadmeLangChange(e){if(e===this._readmeLang||this._translationLoading)return;const t=this._detailRepo;if(!t?.full_name)return;if("original"===e){this._readmeLang="original",this._translationLoading=!0;const e=await de.getReadme(t.full_name);return this._translationLoading=!1,void(this._readmeHtml=e?Wt.sanitize(e):null)}this._readmeLang=e,this._translationLoading=!0;const i=await de.getReadmeTranslation(t.full_name,e,this._readmeHtml);if(this._translationLoading=!1,"string"==typeof i)this._readmeHtml=Wt.sanitize(i);else{const e=i&&i.error;Ce(this._translationErrorMsg(e),"error"),this._readmeLang="original"}}_translationErrorMsg(e){return{no_translation_agent:xe("readmeTranslateNoAgent"),unsupported_lang:xe("readmeTranslateUnsupported"),rate_limited:xe("readmeTranslateRateLimited"),agent_timeout:xe("readmeTranslateTimeout"),not_found:xe("readmeLoadFailed")}[e]||xe("readmeTranslateFailed")}async _loadChangelog(e){if(e?.full_name){try{const t=await de.getChangelog(e.full_name);this._changelogData=t?.body?t:null}catch(e){this._changelogData=null}this._changelogLoading=!1}else this._changelogLoading=!1}_applyFilter(e){this._presetFilter=e,this.switchView("browse"),setTimeout(()=>{this._presetFilter=""},100)}_applyTag(e){this._presetTag=e,this.switchView("browse"),setTimeout(()=>{this._presetTag=""},100)}_linkify(e){if(!e)return"";let t=String(e);return t=t.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--primary-color,#03a9f4);text-decoration:underline">$1</a>'),Wt.sanitize(t,{ALLOWED_TAGS:["a"],ALLOWED_ATTR:["href","target","rel","style"]})}_closeDetail(){this._showDetail=!1,this._detailRepo=null,this._readmeHtml=null,this._readmeLoading=!1,this._detailExpanded=!1,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._removeFocusTrap()}_installFocusTrap(){this._removeFocusTrap();const e=this.renderRoot?.querySelector(".modal-overlay");if(!e)return;this._focusTrapHandler=t=>{if("Tab"!==t.key)return;const i=e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(0===i.length)return;const o=i[0],r=i[i.length-1];t.shiftKey?document.activeElement!==o&&e.contains(document.activeElement)||(t.preventDefault(),r.focus()):document.activeElement!==r&&e.contains(document.activeElement)||(t.preventDefault(),o.focus())};const t=e.querySelector(".modal-close");t&&t.focus(),window.addEventListener("keydown",this._focusTrapHandler)}_removeFocusTrap(){this._focusTrapHandler&&(window.removeEventListener("keydown",this._focusTrapHandler),this._focusTrapHandler=null)}_openConfigFlow(e){this._configFlowDomain=e,this._configFlowEntryId=null,this._showConfigFlow=!0}_openOptionsFlow(e,t){if(this._configFlowDomain=t||"",this._configFlowEntryId=null,t&&this._configEntries&&this._configEntries[t]&&this._configEntries[t].length>1)return this._entrySelectorDomain=t,this._entrySelectorEntries=this._configEntries[t],this._entrySelectorCurrentId=e,void(this._showEntrySelector=!0);this._configFlowEntryId=e,this._showConfigFlow=!0}_selectConfigEntry(e){if(this._showEntrySelector=!1,this._configFlowEntryId=e,this._configEntries)for(const t of Object.values(this._configEntries)){const i=t.find(t=>t.entry_id===e);if(i){this._configFlowDomain=i.domain||"";break}}this._showConfigFlow=!0}async _loadConfigEntries(){try{const e=await de.getConfigEntries(),t=e?.entries||[],i={};if(Array.isArray(t))for(const e of t){const t=e.domain||e.handler||"?";i[t]||(i[t]=[]),i[t].push(e)}this._configEntries=i}catch{this._configEntries={}}}async _initLanguage(){try{const e=await de.getSettings();this._settings=e||{},e?.language&&_e(e.language)}catch{}}get _readmeLangOptions(){const e=this._settings&&this._settings.translation_langs;return["original",...Array.isArray(e)&&e.length?e:ve]}_langLabel(e){return xe({original:"readmeLangOriginal",zh:"readmeLangZh",en:"readmeLangEn",de:"readmeLangDe",ja:"readmeLangJa",ko:"readmeLangKo"}[e]||"readmeLangOriginal")}async _checkUpdates(){try{const e=await de.checkUpdatesWithNotify();e.success&&(e.updates_found>0?Ce(xe("updatesChecked",{n:e.updates_found}),"success"):Ce(xe("noUpdatesFound"),"info"),e.notified&&Ce(xe("notifySent"),"success"),this._loadStats())}catch(e){Ce(xe("checkUpdateFailed",{err:e.message}),"error")}}_onConfigureIntegration(e){const{domain:t,entry_id:i,action:o}=e.detail;console.debug("HACS Vision: _onConfigureIntegration",t,i,"action:",o),this._configFlowDomain=t,this._configFlowEntryId=i,this._configFlowAction=o||"configure",this._configFlowIsReconfigure="reconfigure"===o,this._showConfigFlow&&(this._showConfigFlow=!1,this._configFlowEntryId=null),this.requestUpdate(),setTimeout(()=>{this._configFlowDomain=t,this._configFlowEntryId=i,this._showConfigFlow=!0,this._scheduleFlowTimeout()},10)}_onAddIntegration(e){const{domain:t}=e.detail;this._configFlowDomain=t,this._configFlowEntryId=null,this._showConfigFlow=!0,this._scheduleFlowTimeout()}_scheduleFlowTimeout(){this._clearFlowTimeout(),this._flowTimeout=setTimeout(()=>{this._showConfigFlow&&(this._showConfigFlow=!1,this._configFlowDomain="",this._configFlowEntryId=null)},3e5)}_clearFlowTimeout(){this._flowTimeout&&(clearTimeout(this._flowTimeout),this._flowTimeout=null)}_onFlowClose(){this._clearFlowTimeout(),this._showConfigFlow=!1,this._configFlowDomain="",this._configFlowEntryId=null,this._configFlowSubentryType="",this._configFlowIsReconfigure=!1,this._configFlowAction="",this._showEntrySelector=!1}_toggleDetailExpand(){this._detailExpanded=!this._detailExpanded}_toggleSidebar(){try{this.dispatchEvent(new Event("hass-toggle-menu",{bubbles:!0,composed:!0}))}catch(e){}try{const e=document.querySelector("home-assistant");if(!e)return;const t=e.shadowRoot;if(!t)return;const i=t.querySelector("ha-sidebar");if(i&&"function"==typeof i.toggle)return void i.toggle();i&&i.hasAttribute("opened")?i.removeAttribute("opened"):i&&i.setAttribute("opened","")}catch(e){console.warn("[HACS Vision] Sidebar DOM approach failed:",e)}}async _toggleVersionSelector(){if(this._showVersionSelector=!this._showVersionSelector,this._showVersionSelector&&0===this._releases.length){this._releasesLoading=!0;try{const e=this._detailRepo?.id||this._detailRepo?.full_name;if(e){const t=await de.getRepoReleases(e);this._releases=Array.isArray(t)?t:t.releases||[]}}catch(e){console.error("Failed to load releases:",e),this._releases=[]}this._releasesLoading=!1}}async _selectVersion(e){const t=e.tag_name||e.tag;if(t){this._changelogLoading=!0,this._changelogData=null;try{const e=this._detailRepo?.full_name;if(e){const i=await de.getChangelog(e,t);this._changelogData=i?.body?{...i,tag:t}:{tag:t,body:"(No release notes)"}}}catch(e){this._changelogData={tag:t,body:xe("noChangelog")}}this._changelogLoading=!1}}async _installVersion(e){const t=this._detailRepo?.id||this._detailRepo?.full_name;if(t&&e){this._installingVersion=!0;try{await de.installVersion(t,e),Ce(`${xe("installComplete")}: ${e}`,"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._closeDetail()}catch(e){Ce(`${xe("installFailed")}: ${e.message}`,"error")}this._installingVersion=!1}}_getCategoryLabel(e){return{integration:xe("catIntegration"),plugin:xe("catPlugin"),theme:xe("catTheme"),appdaemon:xe("catAppDaemon"),netdaemon:xe("catNetDaemon"),python_script:xe("catPythonScript"),template:xe("catTemplate"),dashboard:xe("catDashboard")}[e]||e}_getDomainColor(e){const t=["#1565c0","#7b1fa2","#2e7d32","#e65100","#00838f","#6a1b9a","#c62828","#283593"];let i=0;for(let t=0;t<e.length;t++)i=(i<<5)-i+e.charCodeAt(t);return t[Math.abs(i)%t.length]}_renderDetailAvatar(e){const t=e.domain;if(!t)return"";const i=this._getDomainColor(t),o=t.charAt(0).toUpperCase();return N`
      <div class="detail-avatar" style="background:${i}">
        <span class="detail-avatar-letter" style="display:none">${o}</span>
        <img class="detail-avatar-img" alt="" data-domain="${t}">
      </div>
    `}_renderStoreActionButtons(e){const t=e.installed,i=e.domain,o=i?this._configEntries?.[i]:null,r=o&&o.length>0,s=r?o[0]:null,a=e.installed_version&&e.available_version&&e.installed_version!==e.available_version;if(!t)return N`
        <button class="modal-btn primary" @click=${()=>this._modalAction("install")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${xe("install")}
        </button>`;const n=[];if(a&&n.push(N`
        <button class="modal-btn primary" @click=${()=>this._modalAction("update")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          ${xe("update")}
        </button>`),n.push(N`
      <button class="modal-btn" style="color:#ff9800;border-color:#ff9800;" @click=${()=>this._modalAction("redownload")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
        ${xe("redownload")}
      </button>`),i&&r&&s){const e=s.supports_options,t=s.supports_reconfigure,i=s.supported_subentry_types&&s.supported_subentry_types.length>0?s.supported_subentry_types:null,o=s.disabled_by,r=s.state;"user"===o&&n.push(N`
          <button class="modal-btn" @click=${()=>this._modalAction("enable")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ${xe("enable")}
          </button>`),"setup_error"!==r&&"setup_retry"!==r||n.push(N`
          <button class="modal-btn" style="color:#ff9800;border-color:#ff9800;" @click=${()=>this._modalAction("view-logs")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            ${xe("viewLogs")}
          </button>`),"loaded"!==r&&r||(e&&n.push(N`
            <button class="modal-btn" @click=${()=>this._modalAction("configure")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ${xe("configure")}
            </button>`),t&&n.push(N`
            <button class="modal-btn" @click=${()=>this._modalAction("reconfigure")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M21 8a9 9 0 1 1-3.64-6.36L21 2"/></svg>
              ${xe("reconfigure")}
            </button>`),i&&n.push(N`
            <button class="modal-btn" style="background:var(--primary-color, #03a9f4);color:#fff;border-color:var(--primary-color, #03a9f4);" @click=${()=>this._modalAction("add-subentry")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${xe("addSubentry")}
            </button>`))}else i&&!r&&n.push(N`
        <button class="modal-btn" @click=${()=>this._modalAction("configure")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${xe("addIntegration")}
        </button>`);i&&"system"===s?.source||n.push(N`
        <button class="modal-btn danger" @click=${()=>this._modalAction("uninstall")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          ${xe("remove")}
        </button>`),(i||this._detailRepo?.full_name)&&n.push(N`
        <button class="modal-btn" @click=${()=>this._modalAction("report-issue")}>
          <span style="font-size:14px;">🐛</span>
          ${xe("reportIssue")}
        </button>`);const l=this._detailRepo?.full_name||(this._detailRepo?.repository||"").replace("https://github.com/","");if(a&&l){const t=e.available_version||e.latest_version,i=this._ignoredVersions?.[l]===t;n.push(N`
        <button class="modal-btn" style="color:${i?"#4caf50":"#ff9800"};border-color:${i?"#4caf50":"#ff9800"};"
                @click=${()=>this._modalAction(i?"unignore-version":"ignore-version")}>
          <span style="font-size:14px;">${i?"🔇":"🔕"}</span>
          ${xe(i?"unignoreVersion":"ignoreVersion")}
        </button>`)}const d=l&&this._ignoredRepos?.includes(l);return n.push(N`
      <button class="modal-btn" style="color:${d?"#4caf50":"#999"};border-color:${d?"#4caf50":"#ccc"};font-size:12px;"
              @click=${()=>this._modalAction(d?"unignore":"ignore")}>
        ${xe(d?"unignore":"ignore")}
      </button>`),N`${n}`}async _modalAction(e){const t=this._detailRepo;if(t)try{if("install"===e)await de.install(t.id||t.full_name,t.category),Ce(xe("installComplete"),"success");else if("update"===e)await de.update([t.id||t.full_name]),Ce(xe("updateStarted"),"success");else if("redownload"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Zt});if(!await e.show(this,{message:`${xe("redownload")} ${t.full_name||t.name}?`,confirmText:xe("confirm"),danger:!1}))return;await de.redownload(t.id||t.full_name,t.category),Ce(`${xe("redownload")} ${xe("successSuffix")}`,"success")}else if("uninstall"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Zt});if(!await e.show(this,{message:`${xe("confirmRemove")} ${t.full_name||t.name}?`,confirmText:xe("remove"),danger:!0}))return;await de.remove(t.id||t.full_name),Ce(xe("removed"),"success")}else{if("github"===e){const e=t.html_url||`https://github.com/${t.full_name}`;return void window.open(e,"_blank")}if("report-issue"===e)return void await this._handleIssueReport(this._detailRepo);if("enable"===e){this._closeDetail();const e=this._configEntries?.[t.domain];if(e&&e.length>0){const{ConfirmDialog:t}=await Promise.resolve().then(function(){return Zt});if(!await t.show(this,{message:`${xe("confirmEnable")}`,confirmText:xe("enable"),danger:!1}))return;try{const t=this.hass?.auth?.data?.access_token,i=this.hass?.auth?.data?.ha_url||window.location.origin,o=await fetch(`${i}/api/config/config_entries/entry/${e[0].entry_id}/enable`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(o.ok)Ce(xe("enabled"),"success"),this._loadConfigEntries();else{Ce((await o.json().catch(()=>({}))).message||xe("enableFailed"),"error")}}catch(e){Ce(`${xe("enableFailed")}: ${e.message}`,"error")}}return}if("reconfigure"===e){this._closeDetail();const e=this._configEntries?.[t.domain];return void(e&&e.length>0&&(this._configFlowDomain=t.domain,this._configFlowEntryId=e[0].entry_id,this._configFlowIsReconfigure=!0,this._showConfigFlow=!0))}if("add-subentry"===e){this._closeDetail();const e=this._configEntries?.[t.domain];if(e&&e.length>0){const i=e[0],o=i.supported_subentry_types||[];1===o.length?(this._configFlowDomain=t.domain,this._configFlowEntryId=i.entry_id,this._configFlowSubentryType=o[0],this._showConfigFlow=!0):o.length>1&&(this._entrySelectorDomain=t.domain,this._entrySelectorEntries=e,this._entrySelectorCurrentId=e[0].entry_id,this._showEntrySelector=!0)}return}if("view-logs"===e)return void(window.location.href=`/config/logs?filter=${encodeURIComponent(t.domain||"")}`);if("ignore"===e){const e=t.full_name||(t.repository||"").replace("https://github.com/","");if(!e)return;const{ConfirmDialog:i}=await Promise.resolve().then(function(){return Zt});if(!await i.show(this,{message:xe("confirmIgnore",{repo:e}),confirmText:xe("ignore"),danger:!1}))return;return await de.ignoreRepo(e),Ce(`${xe("ignore")}: ${e}`,"success"),void this._loadStats()}if("unignore"===e){const e=t.full_name||(t.repository||"").replace("https://github.com/","");if(!e)return;return await de.unignoreRepo(e),Ce(`${xe("unignore")}: ${e}`,"success"),void this._loadStats()}if("ignore-version"===e){const e=t.full_name||(t.repository||"").replace("https://github.com/",""),i=t.available_version||t.latest_version;if(!e||!i)return;const{ConfirmDialog:o}=await Promise.resolve().then(function(){return Zt});if(!await o.show(this,{message:xe("confirmIgnoreVersion",{repo:e,version:i}),confirmText:xe("ignoreVersion"),danger:!1}))return;return await de.ignoreVersion(e,i),Ce(`${xe("ignoreVersion")}: ${i}`,"success"),void this._loadStats()}if("unignore-version"===e){const e=t.full_name||(t.repository||"").replace("https://github.com/","");if(!e)return;return await de.unignoreVersion(e),Ce(`${xe("unignoreVersion")}: ${e}`,"success"),void this._loadStats()}if("configure"===e){this._closeDetail();const e=t.domain;if(!e)return;const i=this._configEntries?.[e];return void(i&&i.length>0?this._openOptionsFlow(i[0].entry_id,e):this._openConfigFlow(e))}}this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._closeDetail()}catch(e){Ce(`${xe("updateFailed")}: ${e.message}`,"error")}}async _handleIssueReport(e){const t=e.full_name||e.repository&&e.repository.replace("https://github.com/","");if(!t||!t.includes("/"))return void Ce("Invalid repository","error");try{const e=await de.get("github/user");if(!e||e.error)return void Ce(xe("issueNotLoggedIn"),"error")}catch(e){return void Ce(xe("issueNotLoggedIn"),"error")}const i=document.createElement("div");i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;",i.innerHTML=`\n      <div style="background:var(--card-background-color,#fff);border-radius:16px;padding:24px;max-width:1000px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp .2s ease;transition:all .2s;" id="hv-issue-dialog-body">\n        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;cursor:pointer;user-select:none;" id="hv-issue-header">\n          <div>\n            <div style="font-size:17px;font-weight:600;color:var(--primary-text-color,#212121);">${xe("reportIssue")}</div>\n            <div style="font-size:13px;color:var(--secondary-text-color,#727272);margin-top:2px;">${t} <span style="font-size:11px;opacity:0.6;">— ${xe("issueExpand")}</span></div>\n          </div>\n          <span id="hv-issue-expand-btn" style="font-size:13px;color:var(--primary-color,#03a9f4);cursor:pointer;user-select:none;padding:4px 10px;border-radius:6px;background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#e0e0e0);line-height:1.4;" title="${xe("issueExpand")}/${xe("issueRestore")}">⛶ ${xe("issueExpand")}</span>\n        </div>\n        <div style="display:flex;gap:16px;">\n          <div style="flex:1;min-width:0;">\n            <input id="hv-issue-title" placeholder="${xe("issueTitlePlaceholder")}" autofocus style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid var(--divider-color,#e0e0e0);border-radius:8px;background:var(--input-background-color,#f5f5f5);color:var(--primary-text-color);font-size:14px;margin-bottom:10px;">\n            <textarea id="hv-issue-body" placeholder="${xe("issueBody")}" rows="8" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid var(--divider-color,#e0e0e0);border-radius:8px;background:var(--input-background-color,#f5f5f5);color:var(--primary-text-color);font-size:14px;min-height:250px;resize:vertical;margin-bottom:10px;line-height:1.6;"></textarea>\n            <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--secondary-text-color);margin-bottom:8px;cursor:pointer;">\n              <input type="file" accept="image/*" id="hv-issue-screenshots" multiple style="display:none;">\n              <span style="font-size:20px;">📷</span> <span id="hv-issue-screenshot-label">${xe("addScreenshots")}</span>\n            </label>\n            <div id="hv-issue-screenshot-list" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;"></div>\n            <div style="display:flex;gap:8px;justify-content:flex-end;">\n              <button id="hv-issue-cancel" style="padding:8px 20px;border-radius:8px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;font-size:13px;">${xe("issueCancel")}</button>\n              <button id="hv-issue-submit" style="padding:8px 20px;border-radius:8px;border:none;background:var(--primary-color,#03a9f4);color:#fff;cursor:pointer;font-size:13px;font-weight:500;">${xe("issueConfirm")}</button>\n            </div>\n            <div id="hv-issue-status" style="color:#f44336;font-size:12px;margin-top:8px;display:none;"></div>\n          </div>\n          <div style="flex:1;min-width:0;display:flex;flex-direction:column;">\n            <div style="font-size:13px;font-weight:600;color:var(--primary-text-color);margin-bottom:6px;">${xe("previewContent")}</div>\n            <textarea id="hv-issue-preview" style="flex:1;padding:10px;background:var(--secondary-background-color,#f5f5f5);border-radius:8px;font-size:12px;line-height:1.5;width:100%;box-sizing:border-box;min-height:200px;resize:vertical;border:1px solid var(--divider-color,#e0e0e0);color:var(--primary-text-color);font-family:inherit;" readonly>${xe("loadingUpdates")}</textarea>\n          </div>\n        </div>\n      </div>`;const o=this.shadowRoot||this.renderRoot;o&&o.appendChild(i);const r="hv-issue-draft-"+t.replace("/","-"),s=i.querySelector("#hv-issue-title"),a=i.querySelector("#hv-issue-body");try{const e=localStorage.getItem(r);if(e){const t=JSON.parse(e);t.title&&(s.value=t.title),t.body&&(a.value=t.body)}}catch(e){}let n;const l=()=>{try{localStorage.setItem(r,JSON.stringify({title:s.value,body:a.value,savedAt:Date.now()}))}catch(e){}};s.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(l,500)}),a.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(l,500)});const d=i.querySelector("#hv-issue-expand-btn"),c=i.querySelector("#hv-issue-header");if(a&&d){let e=!1;const t=()=>{e=!e;const t=i.querySelector("#hv-issue-dialog-body")||i.firstElementChild,o=i.querySelector("#hv-issue-preview");e?(a.style.height="55vh",a.style.minHeight="55vh",o&&(o.style.minHeight="55vh"),d.title=xe("issueRestore"),t&&(t.style.position="fixed",t.style.top="20px",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.maxWidth="1200px",t.style.width="95vw",t.style.maxHeight="95vh",t.style.overflow="auto")):(a.style.height="",a.style.minHeight="250px",o&&(o.style.minHeight="200px"),d.title=xe("issueExpand"),t&&(t.style.position="",t.style.top="",t.style.left="",t.style.transform="",t.style.maxWidth="1000px",t.style.width="100%",t.style.maxHeight="90vh"))};d.addEventListener("click",t),c.addEventListener("dblclick",t)}const p=i.querySelector("#hv-issue-preview");de.get(`github/issue-logs?repo=${encodeURIComponent(t)}`,{suppressNetworkError:!0}).then(e=>{if(p)if(e&&!e.error){const t=[];t.push(`${xe("haVersion")}: ${e.ha_version||"?"}`),e.repo_version&&t.push(`${xe("repoVersion")}: ${e.repo_version}`),e.repo_domain&&t.push(`${xe("repoDomain")}: ${e.repo_domain}`),t.push(""),e.logs?(t.push(`--- ${xe("relatedLogs")} ---`),t.push(e.logs.substring(0,1500)),e.logs.length>1500&&t.push("...(truncated)")):t.push(xe("noRelatedLogs")),p.value=t.join("\n"),p.readOnly=!1}else p.value=xe("cantGetPreview")}).catch(()=>{p&&(p.value=xe("previewLoadFailed"))});const h=[],g=i.querySelector("#hv-issue-screenshots"),u=i.querySelector("#hv-issue-screenshot-label"),f=i.querySelector("#hv-issue-screenshot-list");g.addEventListener("change",()=>{const e=g.files;if(e&&0!==e.length){f.innerHTML="";for(const t of e){if(t.size>5242880){Ce(xe("fileTooLarge",{name:t.name}),"error");continue}const e=new FileReader;e.onload=e=>{h.push({name:t.name,data:e.target.result});const i=document.createElement("div");i.style.cssText="width:60px;height:60px;border-radius:6px;overflow:hidden;border:1px solid var(--divider-color);position:relative;flex-shrink:0;";const o=document.createElement("img");o.src=e.target.result,o.style.cssText="width:100%;height:100%;object-fit:cover;",i.appendChild(o);const r=document.createElement("span");r.style.cssText="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:#fff;font-size:9px;text-align:center;padding:1px 0;",r.textContent=t.name.slice(-12),i.appendChild(r),f.appendChild(i),u.textContent=xe("screenshotsSelected",{n:h.length})},e.readAsDataURL(t)}}}),i.querySelector("#hv-issue-cancel").addEventListener("click",()=>i.remove()),i.querySelector("#hv-issue-submit").addEventListener("click",async()=>{const o=i.querySelector("#hv-issue-title").value.trim(),s=i.querySelector("#hv-issue-body").value.trim();if(!o)return void Ce(xe("enterIssueTitle"),"error");const a=i.querySelector("#hv-issue-submit"),n=i.querySelector("#hv-issue-cancel"),l=i.querySelector("#hv-issue-status");a.disabled=!0,a.textContent=xe("submitting"),a.style.opacity="0.6",n.style.display="none",l.style.display="block",l.textContent=xe("submittingIssue");try{const d=h.map(e=>e.data),c=i.querySelector("#hv-issue-preview")?.value?.trim()||"",p=s?s+"\n\n---\n"+c:c,g=await de.createIssue(t,o,p,e.domain,d);if(g.ok){i.remove();try{localStorage.removeItem(r)}catch(e){}this._showDetail&&this._closeDetail(),g.issue_url&&window.open(g.issue_url,"_blank")}else l.textContent=g.error||xe("issueFailed"),a.disabled=!1,a.textContent=xe("retry"),a.style.opacity="1",n.style.display=""}catch(e){l.textContent=xe("issueFailed")+": "+e.message,a.disabled=!1,a.textContent=xe("retry"),a.style.opacity="1",n.style.display=""}})}_checkTabsScrollable(){const e=this.renderRoot?.querySelector(".tabs-wrapper"),t=e?.querySelector(".tabs");e&&t&&e.classList.toggle("scrollable",t.scrollWidth>t.clientWidth)}async updated(e){super.updated(e),e.has("narrow")&&requestAnimationFrame(()=>this._checkTabsScrollable()),requestAnimationFrame(()=>this._loadAvatars())}_loadAvatars(){const e=this.shadowRoot?.querySelectorAll(".detail-avatar-img[data-domain]:not([data-avatar-inited])");if(e&&e.length)for(const t of e){t.dataset.avatarInited="1";const e=t.dataset.domain,i=`https://brands.home-assistant.io/${e}/icon.png`,o=`${window.location.origin}/api/hacs_vision_brand/${e}`,r=this._getDomainColor(e),s=()=>{if(t.parentElement&&t.naturalWidth>0){t.style.display="";const e=t.parentElement.querySelector(".detail-avatar-letter");e&&(e.style.display="none"),t.parentElement.style.background=""}},a=()=>{if(t.parentElement)if(t.dataset.fb){t.style.display="none";const e=t.parentElement.querySelector(".detail-avatar-letter");e&&(e.style.display=""),t.parentElement.style.background=r}else t.dataset.fb="1",t.src=o};t.addEventListener("load",s),t.addEventListener("error",a),t.src=i,t.complete&&(t.naturalWidth>0?s():a())}}firstUpdated(){requestAnimationFrame(()=>this._checkTabsScrollable())}render(){try{return this._renderPanel()}catch(e){return console.error("Panel render error:",e),N`<div class="store"><div class="error-banner error"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${xe("connectFailed")}: ${e.message}</div><div style="text-align:center;padding:40px;color:var(--secondary-text-color)"><p>${xe("refreshPage")}</p><button @click=${()=>location.reload()} style="margin-top:12px;padding:8px 24px;border:1px solid var(--primary-color);border-radius:6px;background:var(--card-background-color);color:var(--primary-color);cursor:pointer">${xe("refresh")}</button></div></div>`}}_renderPanel(){const e=[{view:"browse",label:xe("tabBrowse"),icon:"",count:null},{view:"integrations",label:xe("tabIntegrations"),icon:"",count:null},{view:"updates",label:xe("tabUpdates"),icon:"",count:this.stats.available_updates},{view:"management",label:xe("tabManagement"),icon:"",count:null},{view:"settings",label:xe("tabSettings"),icon:"",count:null}];return N`
      <div class="store">
        <!-- ⚠️: modals must render OUTSIDE this .store container.
             .store uses display:flex; modals use position:fixed — placing
             them as flex children causes browser rendering anomalies
             (overlay fails to cover viewport, clicks blocked).
             Render them below, after </div>. -->

        ${this._renderStoreContent(e)}
      </div>

      ${this._renderModals(e)}
    `}_renderStoreContent(e){return N`
      <div class="store">
        ${this._error?N`
          <div class="error-banner error">
            <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${xe("connectFailed")}: <code>${this._error}</code>
          </div>
        `:""}

        ${this._apiReady?"":N`
          <div class="error-banner">
            ${xe("waitingHA")}
          </div>
        `}

        ${"offline"===this._networkStatus?N`
          <div class="network-banner offline">${xe("networkOffline")}</div>
        `:"rate_limited"===this._networkStatus?N`
          <div class="network-banner warning">${xe("rateLimited")}</div>
        `:"server_error"===this._networkStatus?N`
          <div class="network-banner warning">${this._restarting?xe("haRestarting"):xe("serverError")}</div>
        `:""}

        <!-- Sticky Header + Tabs -->
        <div class="sticky-header">
          ${this.narrow?N`<button class="sidebar-toggle" @click=${this._toggleSidebar} aria-label="${xe("toggleSidebar")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>`:""}

        <!-- Header -->
          <div class="header">
          <div class="header-left">
            <div class="header-icon">
              <ha-icon icon="hacs:hacs"></ha-icon>
            </div>
            <div class="title-group">
              <h1>HACS Vision</h1>
              <p>${xe("storeSubtitle")}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="stat" @click=${()=>this._applyFilter("installed")}>
              <div class="stat-num">${this.stats.total_installed??0}</div>
              <div class="stat-label">${xe("statInstalled")}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("update_available")}>
              <div class="stat-num">${this.stats.available_updates??0}</div>
              <div class="stat-label">${xe("statUpdates")}</div>
            </div>
            ${(this.stats.pending_restart??0)>0?N`
            <div class="stat" style="color:#f44336;" @click=${()=>this._applyFilter("pending_restart")}>
              <div class="stat-num">${this.stats.pending_restart}</div>
              <div class="stat-label">${xe("statusPendingRestart")}</div>
            </div>
            `:""}
            <div class="stat" @click=${()=>this._applyTag("favorites")}>
              <div class="stat-num">${this._favoriteCount??0}</div>
              <div class="stat-label">${xe("statFavorites")}</div>
            </div>
            <div class="stat" @click=${()=>this._applyTag("custom")}>
              <div class="stat-num">${this.stats.custom_count??0}</div>
              <div class="stat-label">${xe("statCustom")}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("")}>
              <div class="stat-num">${this.stats.total_repos??0}</div>
              <div class="stat-label">${xe("statRepos")}</div>
            </div>
          </div>
        </div>

        ${(this.stats.pending_restart??0)>0?N`
        <div class="restart-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${xe("statusPendingRestart")}: ${this.stats.pending_restart} ${xe("repositories")}</span>
          <button class="restart-bar-btn" @click=${this._restartHA}>${xe("restartHA")}</button>
          <button class="restart-bar-btn outline" @click=${()=>this._applyFilter("pending_restart")}>${xe("viewDetail")}</button>
        </div>
        `:""}

          <div class="tabs-wrapper">
            <div class="tabs" role="tablist">
              ${e.map(e=>N`
                <button class="tab ${this.currentView===e.view?"active":""}"
                        role="tab" aria-selected=${this.currentView===e.view}
                        aria-label=${e.label}
                        @click=${()=>this.switchView(e.view)}>
                  ${e.icon?N`${e.icon} `:""}${e.label}
                  ${void 0!==e.count&&null!==e.count?N`<span class="badge" aria-label="${e.count}">${e.count}</span>`:""}
                </button>
              `)}
            </div>
          </div>
        </div>

        <!-- Scrollable content -->
        <div class="store-content">

        <!-- Content with fade transition -->
        <div class="content ${this._viewTransition?"transitioning":""}">
          <browse-view .hass=${this.hass} .presetFilter=${this._presetFilter} .presetTag=${this._presetTag} .configEntries=${this._configEntries} .pendingRestart=${this.stats.pending_restart??0} .langVersion=${this._langVersion} ?hidden=${"browse"!==this.currentView}></browse-view>
          <integrations-list .hass=${this.hass} .langVersion=${this._langVersion} ?hidden=${"integrations"!==this.currentView} @configure-integration=${this._onConfigureIntegration} @add-integration=${this._onAddIntegration}></integrations-list>
          <updates-view .hass=${this.hass} .langVersion=${this._langVersion} ?hidden=${"updates"!==this.currentView}></updates-view>
          <management-view .hass=${this.hass} .langVersion=${this._langVersion} ?hidden=${"management"!==this.currentView}></management-view>
          <config-view .hass=${this.hass} .langVersion=${this._langVersion} @refresh-stats=${this._loadStats} ?hidden=${"settings"!==this.currentView}></config-view>
        </div>
      </div>
    `}_renderModals(e){const t=this._detailRepo,i=t?$e(t.category||"integration"):"",o=t?.installed||!1,r=o&&t?.installed_version&&t?.latest_version&&t.installed_version!==t.latest_version;return N`
      <!-- Detail Modal -->
      ${this._showDetail&&t?N`
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="${t.manifest_name||t.full_name||xe("detail")}" @click=${e=>{e.target===e.currentTarget&&this._closeDetail()}}>
          <div class="modal ${this._detailExpanded?"expanded":""}" @dblclick=${this._toggleDetailExpand}>
            ${this._detailExpanded?"":N`<div class="modal-expand-hint">${xe("dblZoomHint")}</div>`}
            <div class="modal-header">
              <div class="modal-header-left">
                ${this._renderDetailAvatar(t)}
                <div>
                  <div class="modal-title">${t.manifest_name||t.repository_manifest?.name||t.full_name||t.name||"unknown"}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="modal-expand-btn" aria-label="${xe("zoom")}" @click=${this._toggleDetailExpand}>${this._detailExpanded?"⤡":"⤢"}</button>
                <button class="modal-close" aria-label="${xe("close")}" @click=${this._closeDetail}>✕</button>
              </div>
            </div>
            <div class="modal-body">
              <div class="detail-category" style="background: ${i}">
                ${this._getCategoryLabel(t.category||"integration")}
              </div>

              <div class="detail-desc" .innerHTML=${this._linkify(t.description)||xe("noDesc")}></div>

              ${t.authors&&t.authors.length?N`
                <div class="detail-authors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ${t.authors.filter(e=>e&&"@user"!==e).map(e=>N`
                    <a class="detail-author-link" href="https://github.com/${e.replace(/^@/,"")}" target="_blank" rel="noopener">@${e.replace(/^@/,"")}</a>
                  `)}
                </div>
              `:""}

              <div class="detail-stats">
                <div class="detail-stat">
                  <svg viewBox="0 0 20 20" fill="#ff9800"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
                  <span class="val">${(t.stars||t.stargazers_count||0).toLocaleString()}</span> ${xe("stars")}
                </div>
                ${t.downloads?N`
                  <div class="detail-stat">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                    <span class="val">${t.downloads.toLocaleString()}</span> ${xe("downloads")}
                  </div>
                `:""}
                <div class="detail-stat">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                  <a class="val github-link" href="https://github.com/${t.full_name||t.name||""}" target="_blank" rel="noopener noreferrer">${t.full_name||t.name||""}</a>
                </div>
              </div>

              ${t.topics&&t.topics.length?N`
                <div class="detail-topics">
                  ${t.topics.map(e=>N`
                    <span class="detail-topic-tag">${e}</span>
                  `)}
                </div>
              `:""}

              ${o?N`
                <div class="detail-version">
                  <div class="detail-version-row">
                    <span class="detail-version-label">${xe("currentVersion")}</span>
                    <span class="detail-version-value">${t.installed_version||xe("unknown")}</span>
                  </div>
                  ${r?N`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${xe("availableVersion")}</span>
                      <span class="detail-version-value" style="color:var(--success-color, #0f9d58);">${t.latest_version||xe("unknown")}</span>
                    </div>
                  `:""}
                  ${t.installed_at?N`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${xe("installedAt")}</span>
                      <span class="detail-version-value">${new Date(t.installed_at).toLocaleString()}</span>
                    </div>
                  `:""}
                </div>
              `:""}

              <!-- Version Selector -->
              <div class="version-selector">
                <div class="version-selector-header" @click=${this._toggleVersionSelector}>
                  ${xe("selectVersion")}
                  <span class="version-selector-arrow ${this._showVersionSelector?"open":""}">▼</span>
                </div>
                ${this._showVersionSelector?N`
                  <div class="version-selector-body">
                    <div class="release-tabs">
                      <div class="release-tab ${0===this._releaseTab?"active":""}" @click=${()=>this._releaseTab=0}>${xe("stableReleases")}</div>
                      <div class="release-tab ${1===this._releaseTab?"active":""}" @click=${()=>this._releaseTab=1}>${xe("prereleaseTab")}</div>
                    </div>
                    ${this._releasesLoading?N`
                      <div class="releases-loading">
                        <div class="spinner-sm"></div>
                        ${xe("loading")}
                      </div>
                    `:(()=>{const e=0===this._releaseTab?this._releases.filter(e=>!e.prerelease):this._releases.filter(e=>e.prerelease);return 0===e.length?N`
                        <div class="releases-empty">${xe("noReleases")}</div>
                      `:e.map(e=>N`
                        <div class="release-item ${this._changelogData?.tag===(e.tag_name||e.tag)?"active":""}" @click=${()=>this._selectVersion(e)}>
                          <div class="release-info">
                            <div class="release-tag">
                              ${e.tag_name||e.tag||"?"}
                              ${e.prerelease?N`<span class="prerelease-badge">${xe("prerelease")}</span>`:""}
                            </div>
                            ${e.published_at||e.created_at?N`
                              <div class="release-date">${xe("publishedAt")} ${new Date(e.published_at||e.created_at).toLocaleDateString()}</div>
                            `:""}
                          </div>
                          <button class="release-install-btn"
                                  @click=${t=>{t.stopPropagation(),this._installVersion(e.tag_name||e.tag)}}
                                  ?disabled=${this._installingVersion}>
                            ${xe("installVersion")}
                          </button>
                        </div>
                      `)})()}
                  </div>
                `:""}
              </div>

              <!-- Changelog (What's New) — shown when update is available or version selected -->
              ${r||this._changelogData?N`
                <div class="detail-changelog">
                  <div class="detail-changelog-title">${xe("changelogTitle")}${this._changelogData?.tag?N` <span style="font-weight:400;font-size:12px;color:var(--secondary-text-color);">— ${this._changelogData.tag}</span>`:""}</div>
                  ${this._changelogLoading?N`
                    <div class="readme-loading">
                      <div class="spinner-sm"></div>
                      ${xe("loading")}
                    </div>
                  `:this._changelogData?N`
                    <div class="changelog-body" .innerHTML=${this._linkify(this._changelogData.body)}></div>
                    ${this._changelogData.tag?N`
                      <div class="changelog-tag">${this._changelogData.tag}</div>
                    `:""}
                    ${this._changelogData.url?N`
                      <a class="changelog-link" href="${this._changelogData.url}" target="_blank" rel="noopener">${xe("viewFullChangelog")} →</a>
                    `:""}
                  `:N`
                    <div class="changelog-empty">${xe("noChangelog")}</div>
                  `}
                </div>
              `:""}

              <div class="modal-actions">
                  ${this._renderStoreActionButtons(t)}
                  <button class="modal-btn" @click=${()=>this._modalAction("github")}>
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                    ${xe("openGithub")}
                  </button>
              </div>

              <!-- README Section — no max-height, single scroll via modal-body -->
              <div class="detail-readme">
                <div class="detail-readme-title">${xe("readmeTitle")}</div>
                <div class="readme-lang-bar">
                  ${this._readmeLangOptions.map(e=>N`
                    <button
                      class="readme-lang-btn ${this._readmeLang===e?"active":""}"
                      ?disabled=${this._translationLoading}
                      @click=${()=>this._onReadmeLangChange(e)}>
                      ${this._langLabel(e)}
                    </button>
                  `)}
                  ${this._translationLoading?N`
                    <div class="readme-translating">
                      <div class="spinner-sm"></div>
                      <span>${xe("readmeTranslating")}</span>
                    </div>
                  `:""}
                </div>
                ${this._readmeLoading?N`
                  <div class="readme-loading">
                    <div class="spinner-sm"></div>
                    ${xe("loadingReadme")}
                  </div>
                `:this._readmeHtml?N`
                  <div class="readme-content" .innerHTML=${this._readmeHtml}></div>
                `:N`
                  <div class="readme-error">${xe("readmeLoadFailed")}</div>
                `}
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- Toast container (supports queue) -->
      <div class="toast-container" id="toast-container" aria-live="polite" aria-atomic="true"></div>

      <!-- Entry Selector (multiple config entries for same domain) -->
      ${this._showEntrySelector?N`
        <div class="entry-overlay" role="dialog" aria-modal="true" aria-label="${xe("selectEntryTitle")}" @click=${()=>{this._showEntrySelector=!1}}>
          <div class="entry-dialog" @click=${e=>e.stopPropagation()}>
            <div class="entry-title">${xe("selectEntryTitle")}</div>
            <div class="entry-subtitle">${xe("selectEntrySubtitle")}</div>
            <div class="entry-list">
              ${this._entrySelectorEntries.map(e=>N`
                <button class="entry-btn" @click=${()=>this._selectConfigEntry(e.entry_id)}>
                  <div class="entry-btn-icon">⚙️</div>
                  <div class="entry-btn-text">
                    <span class="entry-btn-title">${e.title||e.entry_id}</span>
                    <span class="entry-btn-domain">${e.domain}${e.entry_id===this._entrySelectorCurrentId?" · "+xe("currentEntry"):""}</span>
                  </div>
                </button>
              `)}
            </div>
            <button class="entry-cancel" @click=${()=>{this._showEntrySelector=!1}}>${xe("cancel")}</button>
          </div>
        </div>
      `:""}

      <!-- Config Flow Dialog -->
      <config-flow-dialog
        .hass=${this.hass}
        .domain=${this._configFlowDomain}
        .entryId=${this._configFlowEntryId}
        .configEntries=${this._configEntries}
        .isReconfigure=${this._configFlowIsReconfigure}
        .flowAction=${this._configFlowAction}
        .open=${this._showConfigFlow}
        @close=${this._onFlowClose}>
      </config-flow-dialog>

      <!-- Card Preview Dialog -->
      <card-preview-dialog
        .repo=${this._previewRepo}
        .open=${this._showPreview}
        @close=${()=>{this._showPreview=!1,this._previewRepo=null}}>
      </card-preview-dialog>
    `}}class Xt extends ae{static properties={repo:{type:Object},starred:{type:Boolean},_starred:{type:Boolean,state:!0},_starring:{type:Boolean,state:!0},_installing:{type:Boolean},_updating:{type:Boolean,state:!0},_removing:{type:Boolean,state:!0},selected:{type:Boolean},showCheckbox:{type:Boolean},viewMode:{type:String},renamedFrom:{type:String},showRemoveBtn:{type:Boolean},configEntries:{type:Object},autoUpdateRepos:{type:Array}};constructor(){super(),this.repo={},this.starred=!1,this._starred=!1,this._starring=!1,this._installing=!1,this._updating=!1,this._removing=!1,this.viewMode="store",this.renamedFrom=null,this.showRemoveBtn=!1,this.configEntries={},this.autoUpdateRepos=[]}willUpdate(e){e.has("starred")&&void 0!==this.starred&&null!==this.starred&&(this._starred=this.starred),e.has("repo")&&(this._updating=!1,this._removing=!1)}static styles=s`
    :host { display: block; touch-action: manipulation; }
    .card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer;
      box-sizing: border-box;
      display: flex; flex-direction: column;
      position: relative; min-height: 290px;
    }
    .card.custom-repo {
      border-left: 3px solid #ff6f00;
    }
    .card:hover { border-color: var(--primary-color, #03a9f4); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

    .img-container {
      height: 120px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--secondary-background-color, #f0f0f0) 0%, var(--card-background-color, #fff) 100%);
      position: relative;
    }
    .avatar {
      width: 52px; height: 52px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden; background: transparent;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar .initials {
      display: flex; width: 100%; height: 100%;
      align-items: center; justify-content: center;
      border-radius: 50%;
    }
    .badge {
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600; color: #fff;
      text-transform: uppercase; flex-shrink: 0;
    }
    .badge.integration { background: #1565c0; }
    .badge.plugin { background: #7b1fa2; }
    .badge.theme { background: #2e7d32; }
    .badge.template { background: #6a1b9a; }

    /* Status badge — auto switches between states, only one shown */
    .status-badge {
      position: absolute; bottom: 10px; left: 10px;
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600;
    }
    .status-badge.installed { background: rgba(76,175,80,0.15); color: #4caf50; }
    .status-badge.update-available { background: rgba(255,152,0,0.15); color: var(--warning-color,#ff9800); }
    .status-badge.pending-restart { background: rgba(244,67,54,0.15); color: var(--error-color,#f44336); }
    .status-badge.pending-reload { background: rgba(255,152,0,0.15); color: var(--warning-color,#ff9800); }

    /* Right-side independent badges — symmetrical with status-badge */
    .right-tags {
      position: absolute; bottom: 10px; right: 10px;
      display: flex; flex-direction: column; gap: 2px;
      align-items: flex-end; pointer-events: none; z-index: 2;
    }
    .right-tags .tag {
      font-size: 9px; padding: 2px 7px; border-radius: 4px;
      white-space: nowrap; line-height: 1.5;
    }
    .right-tags .tag.configured { background: rgba(33,150,243,0.15); color: #2196f3; }
    .right-tags .tag.load-failed { background: rgba(244,67,54,0.15); color: var(--error-color,#f44336); }
    .right-tags .tag.custom-tag { background: rgba(255,111,0,0.15); color: #ff6f00; font-weight: 600; }

    .top-bar {
      position: absolute; top: 0; left: 0; right: 0;
      display: flex; align-items: center; gap: 6px;
      padding: 10px; z-index: 2;
    }
    .checkbox {
      width: 18px; height: 18px; border-radius: 4px;
      border: 2px solid rgba(255,255,255,0.7); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.2s;
      background: rgba(0,0,0,0.25);
      -webkit-appearance: none; appearance: none; touch-action: manipulation;
    }
    .checkbox:checked {
      background: var(--primary-color); border-color: var(--primary-color);
    }
    .checkbox:checked::after {
      content: '✓'; color: #fff; font-size: 12px; font-weight: 700;
    }

    /* ===== Star/Fav button (merged, top-right) ===== */
    .star-fav-btn {
      position: absolute; top: 8px; right: 8px; z-index: 2;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(0,0,0,0.25); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: transform 0.15s;
    }
    .star-fav-btn:hover { transform: scale(1.15); }
    .star-fav-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .star-fav-btn svg { width: 18px; height: 18px; transition: all 0.2s; }
    .star-fav-btn.starred svg { fill: var(--warning-color,#ff9800); color: var(--warning-color,#ff9800); }
    .star-fav-btn:not(.starred) svg { fill: none; color: #fff; }

    .remove-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(244,67,54,0.12);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 2; padding: 0; color: var(--error-color,#f44336);
      font-size: 16px; font-weight: 700; line-height: 1;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    }
    .remove-btn:hover { background: rgba(244,67,54,0.25); transform: scale(1.1); }

    .content { padding: 14px; flex: 1; display: flex; flex-direction: column; }

    .name {
      font-size: 15px; font-weight: 600; color: var(--primary-text-color, #212121);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px;
    }

    .fullname {
      font-size: 11px; color: var(--secondary-text-color, #727272);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;
      min-height: 16px;
    }

    .desc {
      font-size: 12px; color: var(--secondary-text-color, #727272);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden; margin-bottom: 10px; line-height: 1.5; height: 36px;
    }

    .meta {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 4px; margin-top: auto;
    }
    .author { font-size: 12px; color: var(--primary-color, #03a9f4); }
    .stars {
      display: flex; align-items: center; gap: 3px;
      font-size: 11px; color: var(--secondary-text-color, #727272);
    }
    .stars svg { width: 14px; height: 14px; fill: var(--warning-color,#ff9800); color: var(--warning-color,#ff9800); }

    .tags { display: flex; gap: 4px; flex-wrap: wrap; }
    .tag {
      font-size: 9px; padding: 2px 7px;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      color: var(--primary-color, #03a9f4); border-radius: 4px;
    }
    .custom-tag {
      font-size: 9px; padding: 2px 7px; border-radius: 4px;
      background: #ff6f00; color: #fff; font-weight: 700;
    }
    .rename-tag {
      font-size: 9px; padding: 2px 7px; border-radius: 4px;
      background: var(--warning-color, #ff9800); color: #fff;
      font-weight: 600; display: flex; align-items: center; gap: 2px;
    }
    .topic-tag {
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }

    .actions {
      display: flex; gap: 6px;
      padding: 8px 14px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: auto; background: var(--card-background-color, #fff);
    }
    .action-btn {
      flex: 1; min-width: 0; padding: 8px 4px; border-radius: 10px;
      font-size: 12px; text-align: center; justify-content: center;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 4px;
      touch-action: manipulation;
    }
    .action-btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
    .action-btn.primary {
      background: var(--primary-color, #03a9f4); border-color: var(--primary-color, #03a9f4); color: #fff;
    }
    .action-btn.primary:hover { opacity: 0.9; }
    .action-btn.au-active {
      background: rgba(76,175,80,0.12); border-color: #4caf50; color: #4caf50;
    }
    .action-btn.au-active:hover {
      background: rgba(76,175,80,0.25);
    }
    .action-btn.readme-btn {
      flex: 0 0 auto; min-width: auto; padding: 8px 10px;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      border-color: transparent; color: var(--primary-color, #03a9f4);
    }
    .action-btn.readme-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    .action-btn .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    /* Report Issue button - subtle text link style */
    .issue-btn { background: none; border: none; color: var(--secondary-text-color); cursor: pointer; font-size: 11px; padding: 2px 6px; text-decoration: none; opacity: 0.6; transition: opacity 0.2s; }
    .issue-btn:hover { opacity: 1; color: var(--primary-color, #03a9f4); text-decoration: underline; }
    /* Issue dialog overlay */
    .issue-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999; display: flex; align-items: center; justify-content: center; }
    .issue-dialog { background: var(--card-background-color,#fff); border-radius: 12px; padding: 20px; max-width: 480px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
    .issue-dialog h3 { margin: 0 0 12px; font-size: 16px; color: var(--primary-text-color); }
    .issue-dialog input, .issue-dialog textarea { width: 100%; box-sizing: border-box; padding: 8px 10px; margin-bottom: 10px; border: 1px solid var(--divider-color,#e0e0e0); border-radius: 6px; background: var(--input-background-color,#f5f5f5); color: var(--primary-text-color); font-size: 14px; }
    .issue-dialog textarea { min-height: 60px; resize: vertical; }
    .issue-dialog-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .issue-dialog-actions button { padding: 6px 16px; border-radius: 6px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); cursor: pointer; font-size: 13px; }
    .issue-dialog-actions button.primary { background: var(--primary-color,#03a9f4); color: #fff; border-color: var(--primary-color,#03a9f4); }
    .issue-dialog-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
    .issue-dialog .error { color: #f44336; font-size: 12px; margin-bottom: 8px; }

    .action-btn.installing {
      opacity: 0.7; cursor: not-allowed;
      animation: btnPulse 1.5s infinite;
    }
    @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

    /* Auto-update toggle row (in card body, not actions bar) */
    .au-toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 0 4px; margin: 0 0 2px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      font-size: 12px;
    }
    .au-toggle-row .au-label {
      color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px;
    }
    .au-toggle-row .au-label svg {
      width: 14px; height: 14px;
    }
    .au-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; cursor: pointer; }
    .au-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
    .au-toggle .slider {
      position: absolute; inset: 0; background: var(--divider-color, #ccc);
      border-radius: 20px; transition: 0.3s; cursor: pointer;
    }
    .au-toggle .slider::before {
      content: ''; position: absolute; height: 16px; width: 16px;
      left: 2px; bottom: 2px; background: #fff;
      border-radius: 50%; transition: 0.3s;
    }
    .au-toggle input:checked + .slider { background: #4caf50; }
    .au-toggle input:checked + .slider::before { transform: translateX(16px); }

    @media (max-width: 768px) {
      :host { width: 100%; max-width: 100%; min-width: 0; }
      .card { width: 100%; max-width: 100%; min-height: 270px; box-sizing: border-box; }
      .img-container { height: 100px; }
      .avatar { width: 44px; height: 44px; font-size: 20px; }
      .content { padding: 10px; }
      .name { font-size: 14px; }
      .desc { font-size: 11px; height: 32px; }
      .fullname { min-height: 15px; font-size: 10px; }
      .action-btn {
        min-height: 44px;
        padding: 10px 6px;
        font-size: 11px;
      }
      .action-btn .label { display: none; }
      .star-fav-btn { width: 36px; height: 36px; }
      .star-fav-btn svg { width: 20px; height: 20px; }
      .remove-btn { width: 36px; height: 36px; font-size: 18px; }
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;_getInitials(e){if(!e)return"?";const t=e.split("/");return(t[t.length-1]||e).charAt(0).toUpperCase()}_getIconUrls(e){const t=e.domain,i=e.full_name||e.repository_manifest?.full_name||"",o=i.split("/")[0],r=i.split("/")[1]||"",s=e.default_branch||"main",a=e.custom||e.is_custom||o&&"home-assistant"!==o;if(!t||"integration"!==e.category)return[];const n=[];return n.push(`https://brands.home-assistant.io/${t}/icon.png`),a&&(o&&r&&n.push(`https://raw.githubusercontent.com/${o}/${r}/${s}/custom_components/${t}/brand/icon.png`),n.push(`/api/hacs_vision_brand/${t}`),o&&n.push(`https://github.com/${o}.png`)),n}_getStatusBadge(e){if(e.pending_restart)return{label:xe("statusPendingRestart"),cls:"pending-restart"};const t=de.getPendingReloads();return e.installed&&t.length>0&&e.full_name&&t.includes(e.full_name)?{label:xe("statusPendingReload"),cls:"pending-reload"}:e.installed&&e.has_update?{label:xe("statusPendingUpgrade"),cls:"update-available"}:e.installed?{label:xe("installed"),cls:"installed"}:null}_getCategoryLabel(e){return{integration:xe("catIntegration"),plugin:xe("catPlugin"),theme:xe("catTheme"),template:xe("catTemplate"),dashboard:xe("catDashboard")}[e]||e}_handleAction(e,t){e.stopPropagation(),this.dispatchEvent(new CustomEvent(t,{detail:{repo:this.repo},bubbles:!0,composed:!0}))}_renderConfigButton(e){if(!this.configEntries||"object"!=typeof this.configEntries||0===Object.keys(this.configEntries).length)return"";const t=this.configEntries?.[e.domain],i=t&&t.length>0,o=i?t[0]:null;if(i&&o){if(!(o.supports_options||o.supports_reconfigure||o.supported_subentry_types&&o.supported_subentry_types.length>0))return""}return N`
      <button class="action-btn" @click=${e=>this._handleAction(e,i?"configure":"add-integration")}
        style="${i?"":"background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);"}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span class="label">${xe(i?"configure":"addIntegrationHint")}</span>
      </button>
    `}async _handleReportIssue(){const e=this.repo,t=e.full_name||e.repository&&e.repository.replace("https://github.com/","");if(t&&t.includes("/")){try{const e=await de.get("github/user",{suppressNetworkError:!0});if(!e||e.error)return void this._showCardToast(xe("issueNotLoggedIn"),"error")}catch{return void this._showCardToast(xe("issueNotLoggedIn"),"error")}this.dispatchEvent(new CustomEvent("report-issue",{bubbles:!0,composed:!0,detail:{repo:e}}))}else this._showCardToast("Invalid repository","error")}_showCardToast(e,t){}async _handleStar(e){if(e.stopPropagation(),this._starring)return;this._starring=!0;const t=this.repo.full_name,i=t;if(t){this._starred=!this._starred,this.repo&&(this.repo.stars=this._starred?(this.repo.stars||this.repo.stargazers_count||0)+1:Math.max(0,(this.repo.stars||this.repo.stargazers_count||0)-1)),this.requestUpdate();try{const e=this._starred?de.starRepo(t):de.unstarRepo(t),[o]=await Promise.allSettled([de.getFavorites(),e]),r="fulfilled"===o.status?o.value:{favorites:[]},s=Array.isArray(r)?[...r]:[...r?.favorites||[]];if(this._starred)s.includes(i)||s.push(i);else{const e=s.indexOf(i);e>=0&&s.splice(e,1)}await de.setFavorites(s)}catch(e){}this.dispatchEvent(new CustomEvent("star-changed",{detail:{repo:this.repo,starred:this._starred},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("favorite",{detail:{isFavorite:this._starred,repo:this.repo},bubbles:!0,composed:!0})),this._starring=!1}else this._starring=!1}_handleCardClick(){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:this.repo},bubbles:!0,composed:!0}))}_handleAutoUpdateToggle(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("auto-update-toggle",{detail:{repo:this.repo},bubbles:!0,composed:!0}))}get _isAutoUpdate(){return Array.isArray(this.autoUpdateRepos)&&this.autoUpdateRepos.includes(this.repo?.full_name)}updated(e){}render(){const e=this.repo,t=e.manifest_name||e.repository_manifest?.name||e.full_name||e.name||"unknown",i=e.description||"",o=e.category||"integration",r=e.stars||e.stargazers_count||0,s=e.downloads||0,a=e.installed||!1,n=a&&e.has_update,l=$e(o),d=this._getIconUrls(e);return N`
      <div class="card${e.is_custom?" custom-repo":""}" @click=${this._handleCardClick}>
        <div class="img-container">
          ${this.showCheckbox?N`
            <div class="top-bar">
              <input type="checkbox" class="checkbox" ?checked=${this.selected}
                     @click=${e=>e.stopPropagation()}
                     @change=${()=>this.dispatchEvent(new CustomEvent("check-change",{detail:{fullName:this.repo?.full_name},bubbles:!0,composed:!0}))}>
              <span class="badge ${o}">${this._getCategoryLabel(o)}</span>
            </div>
          `:N`<span class="badge ${o}" style="position:absolute;top:10px;left:10px;">${this._getCategoryLabel(o)}</span>`}
          <div class="avatar">
            ${d.length>0?N`
              <img class="repo-icon" src="${d[0]}"
                data-fallback-chain="${d.slice(1).join(",")}"
                data-fb-idx="0"
                @error=${e=>{const t=(e.target.dataset.fallbackChain||"").split(",");let i=parseInt(e.target.dataset.fbIdx||"0");if(i++,i<t.length&&t[i])e.target.dataset.fbIdx=String(i),e.target.src=t[i];else{e.target.style.display="none";const t=e.target.parentElement.querySelector(".initials");t&&(t.style.display="flex",t.style.background=l)}}} alt="">
              <span class="initials" style="display:none">${this._getInitials(t)}</span>
            `:N`
              <span class="initials" style="display:flex;background:${l}">${this._getInitials(t)}</span>
            `}
          </div>
          ${this._getStatusBadge(e)?N`<span class="status-badge ${this._getStatusBadge(e).cls}">${this._getStatusBadge(e).label}</span>`:""}
          <!-- Right-side badges (symmetrical with status-badge) -->
          <div class="right-tags">
            ${e.config_entry_id?N`<span class="tag configured">${xe("badgeConfigured")}</span>`:""}
            ${e.load_failed?N`<span class="tag load-failed">${xe("badgeLoadFailed")}</span>`:""}
            ${e.is_custom&&"management"!==this.viewMode?N`<span class="tag custom-tag">${xe("customBadge")}</span>`:""}
            ${this.renamedFrom?N`<span class="tag rename-tag"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.renamedFrom}</span>`:""}
          </div>
          ${"management"!==this.viewMode?N`
          <button class="star-fav-btn ${this._starred?"starred":""}"
                  @click=${this._handleStar} ?disabled=${this._starring}
                  title=${this._starred?xe("starred"):xe("starBtn")}>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          `:""}
        </div>

        <div class="content">
          <div class="name" title=${t}>${t}</div>
          <div class="fullname">${e.full_name||""}</div>
          <div class="desc">${i||xe("noDesc")}</div>
          ${"management"!==this.viewMode&&a?N`
          <div class="au-toggle-row">
            <span class="au-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              ${xe("autoUpdateSection")}
            </span>
            <label class="au-toggle" @click=${e=>e.stopPropagation()}>
              <input type="checkbox" .checked=${this._isAutoUpdate}
                @change=${this._handleAutoUpdateToggle}>
              <span class="slider"></span>
            </label>
          </div>
          `:""}
          <div class="meta">
            <div class="tags">
              ${e.topics&&e.topics.length?e.topics.slice(0,3).map(e=>N`<span class="topic-tag">${e}</span>`):""}
            </div>
            <span class="stars">
              <svg viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
              ${"number"==typeof r?r.toLocaleString():r}
            </span>
            ${s?N`
              <span class="stars">
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                ${s.toLocaleString()}
              </span>
            `:""}
            ${"store"!==this.viewMode?N`
              <span style="font-size:10px;color:var(--secondary-text-color);display:flex;align-items:center;gap:3px;">
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                ${n?N`${e.installed_version||"?"} → <span style="color:var(--primary-color);font-weight:600;">${e.latest_version||"?"}</span>`:e.installed_version||xe("installed")}
              </span>
            `:""}
          </div>
        </div>

        ${"management"===this.viewMode?N`
        <div class="actions">
          ${e.pending_restart?N`
            <button class="action-btn primary" @click=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("restart-ha",{bubbles:!0,composed:!0}))}}
              style="flex:1;background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              <span class="label">${xe("pendingRestart")}</span>
            </button>
          `:""}
          ${this.showRemoveBtn?N`
            <button class="action-btn ${this._removing?"installing":""}"
              @click=${e=>{this._removing=!0,this._handleAction(e,"remove-repo")}} ?disabled=${this._removing}
              style="color:var(--error-color,#f44336);border-color:var(--error-color,#f44336);flex:1;">
              ${this._removing?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing?xe("removing"):"management"===this.viewMode?xe("removeRepo"):xe("remove")}</span>
            </button>
          `:""}
        </div>
        `:N`
        <div class="actions">
          ${"management"===this.viewMode?N`
          <button class="action-btn readme-btn" @click=${e=>this._handleAction(e,"readme")} title="README">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          `:""}
          ${"plugin"!==o||a?"":N`
            <button class="action-btn" @click=${e=>this._handleAction(e,"preview")} title="${xe("preview")}"
              style="flex:0 0 auto;padding:8px 10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>
          `}
          ${a?N`
            ${n?N`
              <button class="action-btn primary ${this._updating?"installing":""}"
                @click=${e=>{this._updating=!0,this._handleAction(e,"update")}} ?disabled=${this._updating}>
                ${this._updating?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`}
                <span class="label">${this._updating?xe("updatingProgress"):xe("update")}</span>
              </button>
            `:""}
            ${"integration"===o&&e.domain?N`
              ${this._renderConfigButton(e)}
            `:""}
            <button class="action-btn ${this._removing?"installing":""}"
              @click=${e=>{this._removing=!0,this._handleAction(e,"uninstall")}} ?disabled=${this._removing}
              style="color:var(--error-color,#f44336);border-color:var(--error-color,#f44336);">
              ${this._removing?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing?xe("removing"):"management"===this.viewMode?xe("removeRepo"):xe("remove")}</span>
            </button>
            ${"management"===this.viewMode?N`
            <button class="action-btn" @click=${e=>this._handleAction(e,"ignore")} title="${xe("ignore")}"
              style="flex:0 0 auto;padding:8px 10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </button>
            `:""}
          `:N`
            <button class="action-btn primary ${this._installing?"installing":""}"
                    @click=${e=>this._handleAction(e,"install")} ?disabled=${this._installing}>
              ${this._installing?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("installing")}`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span class="label">${xe("install")}</span>`}
            </button>
          `}
        </div>
        `}
        <!-- Report Issue link -->
        <div style="display:flex;justify-content:flex-end;margin-top:6px;padding:0 2px;">
          <button class="issue-btn" @click=${e=>{e.stopPropagation(),this._handleReportIssue()}}
                  title="${xe("reportIssueDesc")}">🐛 ${xe("reportIssue")}</button>
        </div>
      </div>
    `}}customElements.define("repo-card",Xt);class Jt extends ae{static properties={_title:{type:String,state:!0},_message:{type:String,state:!0},_confirmText:{type:String,state:!0},_cancelText:{type:String,state:!0},_thirdText:{type:String,state:!0},_danger:{type:Boolean,state:!0},_type:{type:String,state:!0},_visible:{type:Boolean,state:!0}};constructor(){super(),this._title="",this._message="",this._confirmText=xe("confirm"),this._cancelText=xe("cancel"),this._thirdText="",this._danger=!1,this._type="info",this._visible=!1,this._resolve=null,this._dialogDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1}}disconnectedCallback(){super.disconnectedCallback()}static styles=s`
    :host { display: contents; }
    .overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001;
      display: flex; align-items: center; justify-content: center;
      padding: 40px; box-sizing: border-box;
      animation: overlayFadeIn 0.15s ease;
    }
    @media (max-width: 768px) {
      .overlay { padding: 16px; }
    }
    @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dialogSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      max-width: 440px; width: 100%;
      max-height: 85vh;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: dialogSlideUp 0.2s ease;
      display: flex; flex-direction: column;
      user-select: text;
      -webkit-user-select: text;
    }

    /* ===== Title Bar ===== */
    .title-bar {
      display: flex; align-items: center; gap: 10px;
      padding: 18px 20px 0;
    }
    .title-icon {
      width: 24px; height: 24px; flex-shrink: 0;
    }
    .title-icon.danger { color: #f44336; }
    .title-icon.warning { color: #ff9800; }
    .title-icon.info { color: var(--primary-color, #03a9f4); }
    .title-text {
      font-size: 16px; font-weight: 600; color: var(--primary-text-color);
    }

    /* ===== Body ===== */
    .message {
      font-size: 14px; color: var(--primary-text-color, #212121);
      line-height: 1.6; padding: 12px 20px 20px;
      overflow-y: auto; flex: 1; min-height: 0;
    }

    /* ===== Actions ===== */
    .actions {
      display: flex; gap: 10px;
      padding: 0 20px 18px; justify-content: flex-end;
    }
    .btn {
      padding: 10px 22px; border-radius: 10px;
      font-size: 14px; font-weight: 500; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      transition: all 0.15s; touch-action: manipulation;
      min-height: 40px; user-select: none;
    }
    .btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn.danger {
      background: #f44336; border-color: #f44336; color: #fff;
    }
    .btn.danger:hover { opacity: 0.9; }
    .btn.warning {
      background: #ff9800; border-color: #ff9800; color: #fff;
    }
    .btn.warning:hover { opacity: 0.9; }

    @media (max-width: 768px) {
      .actions { flex-direction: column-reverse; }
      .btn { width: 100%; text-align: center; min-height: 44px; }
    }
  `;static show(e,{title:t,message:i,confirmText:o,cancelText:r,thirdText:s,danger:a,type:n}={}){let l=e.shadowRoot?.querySelector("confirm-dialog");return l||(l=document.createElement("confirm-dialog"),e.shadowRoot.appendChild(l)),new Promise(e=>{l._resolve=e,l._title=t||"",l._message=i||"Are you sure?",l._confirmText=o||xe("confirm"),l._cancelText=r||xe("cancel"),l._thirdText=s||"",l._danger=!!a,l._type=n||(a?"danger":"info"),l._visible=!0,setTimeout(()=>{const e=l.shadowRoot?.querySelector(".btn-confirm");e&&e.focus()},100)})}_getIcon(e){return"danger"===e?N`<svg class="title-icon danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`:"warning"===e?N`<svg class="title-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`:N`<svg class="title-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`}_onKeyDown(e){"Escape"===e.key&&(e.stopPropagation(),this._onCancel()),"Enter"===e.key&&(e.stopPropagation(),this._onConfirm())}_onConfirm(){this._visible=!1;const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._resolve&&this._resolve(!0)}_onCancel(){this._visible=!1;const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._resolve&&this._resolve(!1)}_onThird(){this._visible=!1;const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._resolve&&this._resolve("third")}_onOverlayClick(e){e.target===e.currentTarget&&this._onCancel()}_dialogPointerDown(e){const t=e.target.closest(".title-bar");if(!t||e.target.closest("button"))return;if(void 0!==e.button&&0!==e.button)return;const i=this._dialogDrag,o=e.currentTarget;i.dragging=!0,i.startX=e.clientX-i.offsetX,i.startY=e.clientY-i.offsetY,o.style.transition="none",o.style.cursor="grabbing",t.style.userSelect="none",o.setPointerCapture(e.pointerId);const r=e=>{i.dragging&&(i.offsetX=e.clientX-i.startX,i.offsetY=e.clientY-i.startY,o.style.transform=`translate(${i.offsetX}px, ${i.offsetY}px)`)},s=e=>{i.dragging=!1,o.style.cursor="",t.style.userSelect="",o.removeEventListener("pointermove",r),o.removeEventListener("pointerup",s),o.removeEventListener("pointercancel",s);try{o.releasePointerCapture(e.pointerId)}catch(e){}};o.addEventListener("pointermove",r),o.addEventListener("pointerup",s),o.addEventListener("pointercancel",s)}render(){return this._visible?N`
      <div class="overlay" @click=${this._onOverlayClick} @keydown=${this._onKeyDown}>
        <div class="dialog" role="alertdialog" aria-modal="true" @pointerdown=${this._dialogPointerDown}>
          ${this._title?N`
            <div class="title-bar">
              ${this._getIcon(this._type)}
              <span class="title-text">${this._title}</span>
            </div>
          `:""}
          <div class="message" .innerHTML=${function(e){if(!e)return"";let t=String(e).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--primary-color,#03a9f4);text-decoration:underline">$1</a>');return Wt.sanitize(t,{ALLOWED_TAGS:["a"],ALLOWED_ATTR:["href","target","rel","style"]})}(this._message)}></div>
          <div class="actions">
            <button class="btn" @click=${this._onCancel}>${this._cancelText}</button>
            ${this._thirdText?N`
              <button class="btn" style="border:1px solid var(--primary-color, #03a9f4);color:var(--primary-color, #03a9f4);" @click=${this._onThird}>${this._thirdText}</button>
            `:""}
            <button class="btn btn-confirm ${this._danger?"danger":"warning"===this._type?"warning":""}" @click=${this._onConfirm}>${this._confirmText}</button>
          </div>
        </div>
      </div>
    `:N``}}customElements.define("confirm-dialog",Jt);var Zt=Object.freeze({__proto__:null,ConfirmDialog:Jt});const Qt="hacs_vision_browse_state",ei="hacs_vision_view_mode";class ti extends ae{static properties={repos:{type:Array},total:{type:Number},search:{type:String},category:{type:String},statusFilter:{type:String},sort:{type:String},sortDir:{type:String},page:{type:Number},loading:{type:Boolean},categoryCounts:{type:Object},statusCounts:{type:Object},tagCounts:{type:Object},viewMode:{type:String},groupBy:{type:String},pageSize:{type:Number},_installingIds:{type:Object,state:!0},_searchText:{type:String,state:!0},_addFromSearchCategory:{type:String,state:!0},_addFromSearchInstalling:{type:Boolean,state:!0},_collapsedGroups:{type:Object,state:!0},_filterExpanded:{type:Boolean,state:!0},_favorites:{type:Array,state:!0},presetFilter:{type:String},presetTag:{type:String},configEntries:{type:Object},pendingRestart:{type:Number},_selectedRepos:{type:Array,state:!0},_tagFilters:{type:Array,state:!0},_starredMap:{type:Object,state:!0},_orgRepos:{type:Array,state:!0},_orgFilter:{type:String,state:!0},_selectedOrgRepos:{type:Object,state:!0},_orgLoading:{type:Boolean,state:!0},_orgSyncing:{type:Boolean,state:!0},_orgSyncResult:{type:String,state:!0},langVersion:{type:Number},_autoUpdateRepos:{type:Array,state:!0}};constructor(){super();const e=function(){try{return JSON.parse(localStorage.getItem(Qt)||"{}")}catch{return{}}}();this.repos=[],this.total=0,this.search=e.search||"",this.category=e.category||"",this.statusFilter=e.statusFilter||"",this.sort=e.sort||"stars",this.sortDir=e.sortDir||"desc",this.page=e.page||1,this.loading=!1,this.limit=e.pageSize||50,this.pageSize=this.limit,this.categoryCounts={},this.statusCounts={},this.tagCounts={},this._installingIds={},this._searchTimer=void 0,this._searchText=e.search||"",this.viewMode=(()=>{try{return localStorage.getItem(ei)}catch{return null}})()||"card",this.groupBy=e.groupBy||"none",this._addFromSearchCategory="integration",this._addFromSearchInstalling=!1,this._collapsedGroups={},this._filterExpanded=!1,this._starredMap={},this._orgRepos=[],this._orgFilter="",this._selectedOrgRepos={},this._orgLoading=!1,this._orgSyncing=!1,this._orgSyncResult="",this._orgSyncFailed=!1,this._orgLoadTimer=null,this._favorites=[],this._selectedRepos=[],this._tagFilters=[],this._autoUpdateRepos=[],this.__auLoaded=!1,this._rebuildOptions()}static styles=s`
    ${Se()}

    :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

    .content-section {
      background: var(--card-background-color, #fff);
      border-radius: 0; padding: 14px;
    }

    /* ===== Controls Bar ===== */
    .controls {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }
    .controls-right { flex-shrink: 0; }
    .search input {
      box-sizing: border-box;
      border: 1px solid var(--divider-color); border-radius: 10px;
      font-size: 14px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; transition: border-color 0.2s;
    }
    .refresh-btn {
      padding: 8px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.25s; width: 36px; height: 36px;
      touch-action: manipulation; flex-shrink: 0;
    }
    .refresh-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .refresh-btn svg { width: 16px; height: 16px; }

    /* ===== Sort Bar (both card and list mode) ===== */
    .sort-bar {
      display: flex; align-items: center;
      margin-bottom: 10px; padding: 6px 14px; background: transparent;
      border-radius: 8px; flex-wrap: wrap; gap: 4px;
    }
    .sort-chips {
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
    }
    .sort-chip {
      padding: 4px 10px; border: 1px solid var(--divider-color); border-radius: 14px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 11px; transition: all 0.2s; white-space: nowrap;
      touch-action: manipulation;
    }
    .sort-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .sort-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .sort-chip .sort-dir { font-size: 9px; margin-left: 2px; }

    /* ===== View Mode Toggle ===== */
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }

    /* ===== Group By Select ===== */
    .group-select {
      padding: 6px 10px; border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--primary-text-color);
      font-size: 12px; cursor: pointer; outline: none; flex-shrink: 0;
    }

    /* ===== Filter-Sort Row (compact, merged) ===== */
    .filter-sort-row {
      display: flex; align-items: center; gap: 6px;
      margin-bottom: 10px; padding: 8px 12px;
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 10px; flex-wrap: wrap;
    }
    .fs-chips {
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap; flex: 1; min-width: 0;
    }
    .fs-divider {
      display: inline-block; width: 1px; height: 22px;
      background: var(--divider-color, #e0e0e0); margin: 0 10px; flex-shrink: 0;
    }
    .fs-label {
      font-size: 11px; font-weight: 700; color: var(--primary-color, #03a9f4);
      text-transform: uppercase; letter-spacing: 0.5px; padding: 0 6px;
      user-select: none; flex-shrink: 0;
    }
    .filter-toggle-sm {
      display: none; width: 36px; height: 36px; flex-shrink: 0;
      border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; align-items: center; justify-content: center; padding: 0;
      touch-action: manipulation;
    }
    .sort-inline { opacity: 0.85; }
    .sort-inline.active { opacity: 1; }
    .sort-inline .sort-dir { font-size: 9px; margin-left: 2px; }

    .fs-actions { display: none; }

    /* ===== Search box responsive ===== */
    /* ===== Filter Groups ===== */
    .filter-group { margin-bottom: 10px; }
    .filter-label {
      font-size: 11px; font-weight: 600; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
    }
    .filter-chips {
      display: flex; gap: 6px; flex-wrap: wrap;
      overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .filter-chips::-webkit-scrollbar { display: none; }
    .filter-chip {
      padding: 6px 12px; border: 1px solid var(--divider-color); border-radius: 18px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 12px; transition: all 0.25s; white-space: nowrap;
      touch-action: manipulation;
    }
    .filter-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .filter-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .filter-chip .chip-count { font-size: 10px; opacity: 0.7; margin-left: 3px; }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Add Custom Repo ===== */
    .form-select {
      padding: 10px 12px; border: 1px solid var(--divider-color); border-radius: 10px;
      font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer; flex-shrink: 0;
    }

    /* ===== List View (HACS-style data table) ===== */
    .list-view { width: 100%; overflow-x: auto; }
    .list-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: auto; }
    .list-table th {
      text-align: left; padding: 10px 8px; font-size: 11px; font-weight: 600;
      color: var(--secondary-text-color); text-transform: uppercase;
      border-bottom: 2px solid var(--divider-color); white-space: nowrap;
      user-select: none; letter-spacing: 0.3px;
    }
    .list-table th.sortable { cursor: pointer; touch-action: manipulation; }
    .list-table th.sortable:hover { color: var(--primary-color); }
    .list-table th .sort-arrow { font-size: 9px; margin-left: 3px; opacity: 0.5; }
    .list-table th.active-sort .sort-arrow { opacity: 1; color: var(--primary-color); }
    .list-table td {
      padding: 10px 8px; border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    .list-table .name-cell,
    .list-table .desc-cell { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 0; }
    .list-table .name-cell { font-weight: 500; color: var(--primary-text-color); width: 100%; }
    .list-table .desc-cell { font-size: 11px; color: var(--secondary-text-color); }
    .custom-tag-list {
      display: inline-block; margin-top: 4px;
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: #ff6f00; color: #fff; font-weight: 700;
    }
    .topic-chips { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .topic-chip {
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }
    .list-table tr { cursor: pointer; transition: background 0.15s; }
    .list-table tbody tr:hover { background: var(--secondary-background-color); }

    .list-table .col-icon { width: 40px; }
    .list-table .icon-cell {
      width: 32px; height: 32px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 14px; font-weight: 700;
      overflow: hidden;
    }
    .list-table .num-cell { font-size: 12px; color: var(--secondary-text-color); text-align: right; }
    .list-table .ver-cell { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; }
    .list-table .status-cell { font-size: 11px; }
    .status-badge {
      display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600;
    }
    .status-badge.installed { background: rgba(76,175,80,0.15); color: #4caf50; }
    .status-badge.pending-upgrade { background: rgba(255,152,0,0.15); color: #ff9800; }
    .status-badge.pending-restart { background: rgba(244,67,54,0.15); color: #f44336; }
    .status-badge.new { background: rgba(33,150,243,0.15); color: #2196f3; }
    .status-badge.default { background: rgba(158,158,158,0.1); color: #9e9e9e; }
    .list-table .actions-cell { white-space: nowrap; }
    .action-sm {
      padding: 4px 8px; border-radius: 6px; font-size: 11px;
      border: 1px solid var(--divider-color); background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer; transition: all 0.2s;
      touch-action: manipulation;
    }
    .action-sm:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .action-sm.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .action-sm.star-btn { padding: 4px 6px; min-width: 28px; display: inline-flex; align-items: center; justify-content: center; }
    .action-sm.star-btn.starred { background: rgba(255,152,0,0.1); border-color: #ff9800; }

    /* ===== Group Headers ===== */
    .group-header {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; margin-top: 12px; margin-bottom: 4px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 8px; cursor: pointer; user-select: none;
      font-size: 13px; font-weight: 600; color: var(--primary-text-color);
      touch-action: manipulation;
    }
    .group-header:first-child { margin-top: 0; }
    .group-header .group-arrow { transition: transform 0.2s; font-size: 10px; }
    .group-header .group-arrow.collapsed { transform: rotate(-90deg); }
    .group-header .group-count { font-size: 11px; color: var(--secondary-text-color); font-weight: 400; margin-left: 4px; }

    /* ===== Pagination ===== */
    .pagination {
      display: flex; justify-content: center; align-items: center; gap: 12px;
      margin-top: 24px; padding: 12px 0;
    }
    .page-btn {
      padding: 8px 16px; border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; font-size: 13px; transition: all 0.2s; touch-action: manipulation;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .page-size-select {
      padding: 6px 8px; border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color);
      font-size: 13px; margin-left: 8px; cursor: pointer;
    }
    .page-info { font-size: 13px; color: var(--secondary-text-color); }

    /* ===== Filter Toggle (mobile) ===== */
    .filter-toggle {
      display: none; width: 100%; padding: 10px 14px;
      border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; font-size: 13px; margin-bottom: 8px;
      justify-content: space-between; align-items: center;
      touch-action: manipulation;
    }
    .filter-toggle .toggle-arrow { transition: transform 0.2s; font-size: 10px; }
    .filter-toggle .toggle-arrow.expanded { transform: rotate(180deg); }
    .filter-toggle .active-filters {
      display: flex; gap: 4px; flex-wrap: wrap; margin-left: 8px;
    }
    .filter-toggle .active-filter-tag {
      font-size: 10px; padding: 2px 6px; border-radius: 8px;
      background: var(--primary-color); color: #fff;
    }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .controls { gap: 4px; margin-bottom: 0; flex-wrap: nowrap; }
      .search { flex: 1; min-width: 0; height: 36px; box-sizing: border-box; border: 1px solid var(--divider-color); border-radius: 10px; }
      .search input { padding: 7px 10px 7px 30px; font-size: 13px; border: none; background: transparent; height: 100%; }
      .search-icon { left: 10px; }
      .controls-right { flex-shrink: 0; }
      .desktop-only { display: none; }
      .filter-sort-row { padding: 6px 10px; flex-wrap: nowrap; overflow: hidden; }
      .filter-sort-row .fs-chips { display: none; }
      .filter-sort-row.expanded .fs-chips { display: flex; }
      .filter-sort-row.expanded { flex-wrap: wrap; }
      .filter-sort-row .fs-actions { display: none; }
      .filter-sort-row.expanded .fs-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; }
      .filter-toggle-sm { display: flex; }
      .filter-row:not(.expanded) { display: none; }
      .filter-row.expanded { display: flex; }
      .filter-row { flex-direction: column; gap: 8px; }
      .filter-row .filter-group { margin-bottom: 0; }
      .filter-chips { flex-wrap: wrap; gap: 3px; }
      .filter-chip { padding: 4px 8px; font-size: 11px; }
      .chip-count { min-width: 16px; height: 16px; font-size: 10px; }
      .page-btn { min-height: 44px; }
      .list-table .col-downloads,
      .list-table .col-stars,
      .list-table .col-installed-ver,
      .list-table .col-available-ver,
      .list-table .col-installed-at { display: none; }
    }

    @media (max-width: 480px) {
      .controls-right { gap: 4px; }
      .filter-chips { gap: 4px; }
      .filter-chip { padding: 4px 8px; font-size: 10px; }
      .filter-label { font-size: 10px; margin-bottom: 4px; }
      .list-table .col-last-updated,
      .list-table .col-status { display: none; }
      .form-select { width: 100%; box-sizing: border-box; }
    }

    .batch-bar {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 8px 12px; margin: 6px 0;
      background: var(--primary-color, #03a9f4); color: #fff;
      border-radius: 8px; font-size: 13px; font-weight: 600;
    }
    .batch-bar-btn {
      padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;
      background: rgba(255,255,255,0.2); color: #fff;
      border: 1px solid rgba(255,255,255,0.4); cursor: pointer;
    }
    .batch-bar-btn:hover { background: rgba(255,255,255,0.35); }
    .batch-bar-btn.danger { border-color: #ff5252; color: #ff5252; }
  `;async connectedCallback(){super.connectedCallback(),window.addEventListener("hacs-lang-changed",this._boundLangRefresh),await this._loadFavorites(),await this._load(),this.__auLoaded||(this._loadAutoUpdateSettings(),this.__auLoaded=!0),this._syncGitHubStarsToFavs(),this.addEventListener("install",e=>this._handleInstall(e.detail.repo)),this.addEventListener("update",e=>this._handleUpdate(e.detail.repo)),this.addEventListener("uninstall",e=>this._handleUninstall(e.detail.repo)),this.addEventListener("redownload",e=>this._handleRedownload(e.detail.repo)),this.addEventListener("ignore",e=>this._handleIgnore(e.detail.repo)),this.addEventListener("configure",e=>this._handleConfigure(e.detail.repo)),this.addEventListener("add-integration",e=>this._handleAddIntegration(e.detail.repo)),this.addEventListener("star-changed",e=>{const{repo:t,starred:i}=e.detail;if(!t?.full_name)return;this._starredMap={...this._starredMap,[t.full_name]:i};const o=String(t.id||t.full_name);!i||this._favorites.includes(o)||this._favorites.includes(t.full_name)?i||(this._favorites=this._favorites.filter(e=>e!==o&&e!==t.full_name)):this._favorites=[...this._favorites,o],this.tagCounts={...this.tagCounts,favorites:this._favorites.length};try{const e=document.querySelector("hacs-vision-panel");e&&(e._favoriteCount=this._favorites.length,e.requestUpdate())}catch(e){}}),this.addEventListener("favorite",e=>{const{isFavorite:t,repo:i}=e.detail,o=i?.id||i?.full_name;o&&(t&&!this._favorites.includes(o)?this._favorites=[...this._favorites,o]:t||(this._favorites=this._favorites.filter(e=>e!==o))),this._syncFavoriteCount()}),this.addEventListener("auto-update-toggle",e=>this._handleAutoUpdateToggle(e.detail.repo))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("hacs-lang-changed",this._boundLangRefresh)}_boundLangRefresh=()=>{this._rebuildOptions(),this.requestUpdate()};_rebuildOptions(){this.statusOptions=[{value:"",label:xe("statusAll")},{value:"installed",label:xe("statusInstalled")},{value:"not_installed",label:xe("statusNotInstalled")},{value:"update_available",label:xe("statusPendingUpgrade")},{value:"pending_restart",label:xe("statusPendingRestart")}],this.typeOptions=[{value:"",label:xe("typeAll")},{value:"integration",label:xe("typeIntegration")},{value:"plugin",label:xe("typePlugin")},{value:"theme",label:xe("typeTheme")},{value:"template",label:xe("typeTemplate")}],this.groupOptions=[{value:"none",label:xe("groupNone")},{value:"status",label:xe("groupStatus")},{value:"type",label:xe("groupType")}],this.sortColumns=[{key:"name",label:xe("colName"),colName:!0},{key:"downloads",label:xe("colDownloads"),colDownloads:!0},{key:"stars",label:xe("colStars"),colStars:!0},{key:"last_updated",label:xe("colLastUpdated"),colLastUpdated:!0},{key:"installed_version",label:xe("colInstalledVer"),colInstalledVer:!0},{key:"latest_version",label:xe("colAvailableVer"),colAvailableVer:!0},{key:"installed_at",label:xe("colInstalledAt"),colInstalledAt:!0},{key:"status",label:xe("colStatus"),colStatus:!0}]}willUpdate(e){if(e.has("presetFilter")){const t=this.presetFilter;if(void 0===e.get("presetFilter")&&""===t)return;this.presetFilter="",this.statusFilter=t,this.page=1,this._persistState(),this._load()}if(e.has("presetTag")&&this.presetTag){const e=this.presetTag;this.presetTag="",this._tagFilters.includes(e)?this._tagFilters=this._tagFilters.filter(t=>t!==e):this._tagFilters=[...this._tagFilters,e],this.page=1,this._load()}}async _loadFavorites(){try{const e=await de.getFavorites();this._favorites=Array.isArray(e)?e:e.favorites||[]}catch(e){this._favorites=[]}}async _syncGitHubStarsToFavs(){try{const e=await de.syncStarsToFavorites();if(!e||e.added?.length>0){await this._loadFavorites(),this.tagCounts={...this.tagCounts,favorites:this._favorites.length};try{const e=document.querySelector("hacs-vision-panel");e&&(e._favoriteCount=this._favorites.length,e.requestUpdate())}catch(e){}"favorites"===this._activeTag||this._tagFilters?.includes("favorites")?await this._load():this.requestUpdate()}}catch(e){}}_syncFavoriteCount(){this.requestUpdate()}_persistState(){!function(e){try{localStorage.setItem(Qt,JSON.stringify(e))}catch{}}({search:this.search,category:this.category,statusFilter:this.statusFilter,sort:this.sort,sortDir:this.sortDir,page:this.page,groupBy:this.groupBy,pageSize:this.pageSize})}async _toggleStar(e){const t=e.full_name,i=t;if(!t)return;const o=this._starredMap?.[t],r=!o;this._starredMap={...this._starredMap,[t]:r},e.stars=r?(e.stars||e.stargazers_count||0)+1:Math.max(0,(e.stars||e.stargazers_count||0)-1),this.requestUpdate();try{const e=r?de.starRepo(t):de.unstarRepo(t),[o]=await Promise.allSettled([de.getFavorites(),e]),s="fulfilled"===o.status?o.value:{favorites:[]},a=Array.isArray(s)?[...s]:[...s?.favorites||[]];if(r)a.includes(i)||a.push(i);else{const e=a.indexOf(i);e>=0&&a.splice(e,1)}await de.setFavorites(a),this._favorites=a}catch(e){}this.tagCounts={...this.tagCounts,favorites:this._favorites.length};try{const e=document.querySelector("hacs-vision-panel");e&&(e._favoriteCount=this._favorites.length,e.requestUpdate())}catch(e){}}async _batchLoadStarStatus(){const e=this.repos||[],t={};for(const i of e)i?.full_name&&(t[i.full_name]=this._favorites.includes(String(i.id))||this._favorites.includes(i.full_name));this._starredMap=t}async _handleInstall(e){const t=e.id||e.full_name;this._installingIds={...this._installingIds,[t]:!0};try{await de.install(t,e.category),Ce(`${xe("installComplete")}: ${e.full_name||e.name}`,"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load(),this._showPostInstallPrompt(e)}catch(e){Ce(`${xe("installFailed")}: ${e.message}`,"error")}const i={...this._installingIds};delete i[t],this._installingIds=i}async _showPostInstallPrompt(e){const t="integration"===(e.category||"integration");await new Promise(e=>setTimeout(e,1500));const{ConfirmDialog:i}=await Promise.resolve().then(function(){return Zt});if(t){if(!await i.show(this,{message:`${e.manifest_name||e.name} ${xe("postInstallRestartMsg")}`,confirmText:xe("restartHA"),cancelText:xe("later"),danger:!0}))return;try{await de.restartHA(),Ce(xe("haRestarting"),"info")}catch(e){Ce(`${xe("restartFailed")}: ${e.message}`,"error")}}else{Ce(xe("reloadingHA"),"info");try{const e=await de.reloadHA();e.success?Ce(xe("reloadSuccess"),"success"):Ce(`${xe("coreReloadFailed")}: ${e.error}`,"error")}catch(e){Ce(`${xe("coreReloadFailed")}: ${e.message}`,"error")}}}async _handleUpdate(e){try{const t=await de.update([e.id||e.full_name]);t?.success?.length>0?Ce(`${xe("updateComplete")}: ${e.full_name||e.name}`,"success"):Ce(`${xe("updateFailed")}: ${e.full_name||e.name}`,"error"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load(),this._showPostInstallPrompt(e)}catch(e){console.error("Update failed",e),Ce(`${xe("updateFailed")}: ${e.message}`,"error")}}async _handleRedownload(e){try{const t=await de.redownload(e.id||e.full_name,e.category);t?.success?Ce(`${xe("redownload")}: ${e.full_name||e.name}`,"success"):Ce(`${xe("updateFailed")}: ${t?.error||e.full_name}`,"error"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){Ce(`${xe("updateFailed")}: ${e.message}`,"error")}}async _handleIgnore(e){if(await Jt.show(this,{message:xe("confirmIgnore",{repo:e.full_name||e.name}),confirmText:xe("ignore"),danger:!1}))try{await de.ignoreRepo(e.id||e.full_name),Ce(`${xe("ignore")}: ${e.full_name||e.name}`,"success"),this._load()}catch(e){Ce(`${xe("updateFailed")}: ${e.message}`,"error")}}async _loadAutoUpdateSettings(){try{const e=await de.getSettings();this._autoUpdateRepos=e?.auto_update_repos||[]}catch(e){console.debug("Failed to load auto-update settings:",e),this._autoUpdateRepos=[]}}async _handleAutoUpdateToggle(e){const t=e?.full_name;if(!t)return;const i=[...this._autoUpdateRepos],o=[...this._autoUpdateRepos],r=o.indexOf(t);r>=0?o.splice(r,1):o.push(t),this._autoUpdateRepos=o;try{await de.updateSettings({auto_update_repos:o}),await de.reloadAutoUpdateSettings(),Ce(t+xe(r>=0?"autoUpdateToggledOff":"autoUpdateToggledOn"),"success")}catch(e){this._autoUpdateRepos=i,Ce(`${xe("autoUpdateToggleFailed")}: ${e.message}`,"error")}}async _handleUninstall(e){if(await Jt.show(this,{message:xe("confirmRemove",{repo:e.full_name||e.name}),confirmText:xe("remove"),danger:!0}))try{await de.remove(e.id||e.full_name),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){console.error("Uninstall failed",e),Ce(`${xe("updateFailed")}: ${e.message}`,"error")}}_handleConfigure(e){const t=e.domain||(e.full_name||"").split("/")[1]||"";this.dispatchEvent(new CustomEvent("open-options-flow",{detail:{entryId:e.config_entry_id,domain:t},bubbles:!0,composed:!0}))}_handleAddIntegration(e){const t=e.domain||(e.full_name||"").split("/")[1]||"";this.dispatchEvent(new CustomEvent("open-flow",{detail:{domain:t},bubbles:!0,composed:!0}))}async _load(){this.loading=!0;try{const e=!(!this.search||!this.search.match(/github\.com\/([^/]+\/[^/\s?#]+)/i)&&!this.search.match(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/));let t=this.search;if(e){const e=this.search.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);e&&(t=e[1].replace(/\.git$/,""))}const i=1===this._tagFilters.length?this._tagFilters[0]:"",o=await de.listRepositories({search:t,category:this.category,sort:this.sort,sortDir:this.sortDir,page:this.page,limit:this.limit,status:this.statusFilter,tag:i});this.repos=o.repositories||[],this.total=o.total||0,this.categoryCounts=o.category_counts||{},this.statusCounts=o.status_counts||{},this.tagCounts=o.tag_counts||{},this.tagCounts={...this.tagCounts,favorites:this._favorites.length},"favorites"===i&&(this.total=this.repos.length),this._batchLoadStarStatus()}catch(e){console.error("Browse load error",e),this.repos=[],this.total=0}this.loading=!1}_onSearch(e){this._searchText=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.search=this._searchText,this.page=1,this._persistState(),this._load(),this.search.trim()&&!this._parseRepoUrl(this.search)?(clearTimeout(this._orgLoadTimer),this._orgLoadTimer=setTimeout(()=>this._loadBrowseOrgRepos(),300)):(this._orgRepos=[],this._selectedOrgRepos={})},300)}_clearSearch(){this._searchText="",this.search="",this.page=1,this._persistState(),this._load()}_onStatusFilter(e){this.statusFilter=e,this.page=1,this._persistState(),this._load()}_onTypeFilter(e){this.category=e,this.page=1,this._persistState(),this._load()}_onTagFilter(e){this._tagFilters.includes(e)?this._tagFilters=this._tagFilters.filter(t=>t!==e):this._tagFilters=[...this._tagFilters,e],this.page=1,this._load()}_onSortColumn(e){this.sort===e?this.sortDir="desc"===this.sortDir?"asc":"desc":(this.sort=e,this.sortDir="name"===e?"asc":"desc"),this.page=1,this._persistState(),this._load()}_onGroupChange(e){this.groupBy=e.target.value,this._persistState()}_onViewModeChange(e){this.viewMode=e;try{localStorage.setItem(ei,e)}catch{}}_toggleGroup(e){this._collapsedGroups={...this._collapsedGroups,[e]:!this._collapsedGroups[e]}}_goPage(e){this.page=e,this._persistState(),this._load()}_onPageSizeChange(e){this.pageSize=parseInt(e.target.value,10),this.limit=this.pageSize,this.page=1,this._persistState(),this._load()}async _refresh(){this.page=1,this._persistState();try{await de.post("refresh",{})}catch(e){}this._load()}async _quickAddFromSearch(){let e=this._parseRepoUrl(this.search);if(!e&&this._orgRepos&&this._orgRepos.length>0&&(e=this._orgRepos[0].full_name),!e&&this.repos&&this.repos.length>0&&(e=this.repos[0].full_name),e&&e.includes("/")){this._addFromSearchInstalling=!0;try{const t=await de.addCustomRepo(e,this._addFromSearchCategory);t.success?(Ce(`${xe("addSuccess")}: ${e}`,"success"),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))):Ce(`${xe("addFailed")}: ${t.error}`,"error")}catch(e){Ce(`${xe("addFailed")}: ${e.message}`,"error")}this._addFromSearchInstalling=!1}else Ce(xe("invalidRepoUrl"),"error")}_parseRepoUrl(e){const t=e.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return t?t[1].replace(/\.git$/,""):/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(e)?e:null}get _browseFilteredSortedOrgRepos(){const e=(this._orgFilter||"").trim().toLowerCase();return e?[...this._orgRepos].filter(t=>t.full_name.toLowerCase().includes(e)).sort((t,i)=>{const o=t.full_name.toLowerCase(),r=i.full_name.toLowerCase();return o===e&&r!==e?-1:r===e&&o!==e?1:o.startsWith(e)&&!r.startsWith(e)?-1:r.startsWith(e)&&!o.startsWith(e)?1:o.length-r.length}):this._orgRepos}get _browseOrgFilteredCount(){return this._browseFilteredSortedOrgRepos.length}async _loadBrowseOrgRepos(){const e=this.search?.trim();if(!(!e||this._parseRepoUrl(e)||e.length<3)){this._orgLoading=!0,this._orgRepos=[],this._selectedOrgRepos={},this._orgSyncResult="";try{const t=await de.listOrgRepos(e);t?.repos&&(this._orgRepos=t.repos)}catch(e){if(404===e.status)return;Ce(`${xe("loadFailedSimple")}: ${e.message}`,"error")}this._orgLoading=!1}}_openOrgRepoDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:{...e,source:"github",custom:!0}},bubbles:!0,composed:!0}))}_toggleBrowseOrgRepo(e){if(this._selectedOrgRepos[e]){const t={...this._selectedOrgRepos};delete t[e],this._selectedOrgRepos=t}else this._selectedOrgRepos={...this._selectedOrgRepos,[e]:!0}}_toggleSelectAllBrowseOrg(e){const t=this._browseFilteredSortedOrgRepos;if(e){const e={};t.forEach(t=>e[t.full_name]=!0),this._selectedOrgRepos=e}else this._selectedOrgRepos={}}async _syncSelectedBrowseOrg(){const e=Object.keys(this._selectedOrgRepos);if(0!==e.length){this._orgSyncing=!0;try{const t=e.map(e=>({full_name:e,category:"integration"})),i=await de.syncStarred(t),o=i?.results||[],r=o.filter(e=>e.success).length,s=o.filter(e=>!e.success).length,a=s?xe("failPartSuffix",{fail:s}):"";this._orgSyncResult=xe("syncDoneResult",{ok:r,failPart:a}),this._orgSyncFailed=!!s,r>0&&(Ce(xe("addedToCustomList")+` (${r})`,"success"),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})))}catch(e){this._orgSyncResult=`${xe("addFailed")}: ${e.message}`,this._orgSyncFailed=!0}this._orgSyncing=!1}}_getRepoStatus(e){return e.pending_restart?"pending_restart":e.installed&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version)?"pending-upgrade":e.installed?"installed":"default"}_getStatusBadge(e){const t={installed:{label:xe("statusInstalled"),cls:"installed"},"pending-upgrade":{label:xe("statusPendingUpgrade"),cls:"pending-upgrade"},"pending-restart":{label:xe("statusPendingRestart"),cls:"pending-restart"},default:{label:xe("statusDefault"),cls:"default"}}[e]||{label:e,cls:"default"};return N`<span class="status-badge ${t.cls}">${t.label}</span>`}_getStatusLabel(e){return{installed:xe("statusInstalled"),not_installed:xe("statusDefault"),update_available:xe("statusPendingUpgrade"),pending_restart:xe("statusPendingRestart")}[e]||e}_applyFilters(e){return this._tagFilters.includes("favorites")?e.filter(e=>this._favorites.includes(String(e.id))||this._favorites.includes(e.full_name)):e}_getFiltered(){let e=this._applyFilters(this.repos);if(!this.search)return e;const t=this.search.toLowerCase();let i=null;const o=t.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return o&&(i=o[1].replace(/\.git$/,"").toLowerCase()),e.filter(e=>{const o=(e.full_name||"").toLowerCase(),r=(e.name||"").toLowerCase(),s=(e.description||"").toLowerCase(),a=(e.authors||[]).join(",").toLowerCase(),n=(e.manifest_name||e.repository_manifest?.name||"").toLowerCase();return!!(o.includes(t)||r.includes(t)||s.includes(t)||a.includes(t))||(!(!i||o!==i&&!o.includes(i))||!!n.includes(t))})}_groupRepos(e){if("none"===this.groupBy)return null;const t={};for(const i of e){let e;e="status"===this.groupBy?this._getRepoStatus(i):"type"===this.groupBy&&i.category||"other",t[e]||(t[e]=[]),t[e].push(i)}const i=["pending-restart","pending-upgrade","installed","default"],o=["integration","plugin","theme","template","other"],r=Object.keys(t);return"status"===this.groupBy?r.sort((e,t)=>i.indexOf(e)-i.indexOf(t)):"type"===this.groupBy&&r.sort((e,t)=>o.indexOf(e)-o.indexOf(t)),r.map(e=>({key:e,label:"status"===this.groupBy?this._getStatusLabel(e):this._getCategoryLabel(e),repos:t[e]}))}_getCategoryLabel(e){return{integration:xe("catIntegration"),plugin:xe("catPlugin"),theme:xe("catTheme"),template:xe("catTemplate"),other:e}[e]||e}_formatDate(e){if(!e)return"";try{const t=new Date(e),i=new Date-t,o=Math.floor(i/864e5);return 0===o?xe("today"):1===o?xe("yesterday"):o<30?`${o}d`:o<365?`${Math.floor(o/30)}mo`:`${Math.floor(o/365)}y`}catch{return""}}_toggleSelect(e){this._selectedRepos.includes(e)?this._selectedRepos=this._selectedRepos.filter(t=>t!==e):this._selectedRepos=[...this._selectedRepos,e]}_isAllSelected(){const e=this._getFiltered();return e.length>0&&this._selectedRepos.length===e.length}_toggleSelectAll(){const e=this._getFiltered();this._isAllSelected()?this._selectedRepos=[]:this._selectedRepos=e.map(e=>e.full_name).filter(Boolean)}async _batchDo(e){if(0===this._selectedRepos.length)return;const t=this._selectedRepos.map(e=>{const t=this.repos.find(t=>t.full_name===e);return{repository:e,category:t?.category||"integration"}});if("remove"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Zt});if(!await e.show(this,{message:xe("batchRemoveConfirm",{n:t.length}),confirmText:xe("batchRemove"),danger:!0}))return}try{let i;Ce(xe("batchInProgress"),"info"),i="install"===e?await de.batchInstall(t):"update"===e?await de.update(t.map(e=>e.repository)):await de.batchRemove(t.map(e=>e.repository)),Ce(xe("batchComplete"),"success"),this._selectedRepos=[],this._load()}catch(t){Ce(`${e} failed: ${t.message}`,"error")}}async _restartHA(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Zt});if(await e.show(this,{message:this.t?.("restartConfirm"),confirmText:this.t?.("restartHA"),danger:!0}))try{await de.restartHA(),Ce(this.t?.("haRestarting"),"info")}catch(e){Ce(`${this.t?.("restartFailed")}: ${e.message}`,"error")}}_renderRepoList(e){return"list"===this.viewMode?N`<div class="list-view">${this._renderListTable(e)}</div>`:N`<div class="grid">${e.map(e=>N`
      <repo-card .repo=${e} ._installing=${!!this._installingIds?.[e.id||e.full_name]}
        ?showCheckbox=${!0} ?selected=${this._selectedRepos.includes(e.full_name)}
        .starred=${this._starredMap?.[e.full_name]??!1}
        .configEntries=${this.configEntries}
        .autoUpdateRepos=${this._autoUpdateRepos}
        @check-change=${e=>{e.detail?.fullName&&this._toggleSelect(e.detail.fullName)}}>
      </repo-card>
    `)}</div>`}_renderListTable(e){const t=e=>this.sort!==e?"":"desc"===this.sortDir?" ▼":" ▲",i=e=>"sortable "+(this.sort===e?"active-sort":"");return N`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th class="${i("name")}" @click=${()=>this._onSortColumn("name")}>${xe("colName")}<span class="sort-arrow">${t("name")}</span></th>
            <th class="${i("downloads")} col-downloads" @click=${()=>this._onSortColumn("downloads")}>${xe("colDownloads")}<span class="sort-arrow">${t("downloads")}</span></th>
            <th class="${i("stars")} col-stars" @click=${()=>this._onSortColumn("stars")}>${xe("colStars")}<span class="sort-arrow">${t("stars")}</span></th>
            <th class="${i("last_updated")} col-last-updated" @click=${()=>this._onSortColumn("last_updated")}>${xe("colLastUpdated")}<span class="sort-arrow">${t("last_updated")}</span></th>
            <th class="${i("installed_version")} col-installed-ver" @click=${()=>this._onSortColumn("installed_version")}>${xe("colInstalledVer")}<span class="sort-arrow">${t("installed_version")}</span></th>
            <th class="${i("latest_version")} col-available-ver" @click=${()=>this._onSortColumn("latest_version")}>${xe("colAvailableVer")}<span class="sort-arrow">${t("latest_version")}</span></th>
            <th class="${i("installed_at")} col-installed-at" @click=${()=>this._onSortColumn("installed_at")}>${xe("colInstalledAt")}<span class="sort-arrow">${t("installed_at")}</span></th>
            <th class="col-status">${xe("colStatus")}</th>
            <th class="actions-cell"></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>this._renderListRow(e))}
        </tbody>
      </table>
    `}_renderListRow(e){const t=$e(e.category||"integration"),i=e.manifest_name||e.repository_manifest?.name||e.full_name||e.name||"?",o=e.stars||e.stargazers_count||0,r=e.downloads||0,s=this._getRepoStatus(e),a=e.installed||!1,n="pending-upgrade"===s,l=e.id||e.full_name,d=!!this._installingIds?.[l];return N`
      <tr @click=${()=>this._handleDetail(e)}>
        <td class="col-icon"><div class="icon-cell" style="background:${t}">
          ${e.domain&&"integration"===e.category?N`
              <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
              <span style="display:none">${i.charAt(0).toUpperCase()}</span>
            `:i.charAt(0).toUpperCase()}
        </div></td>
        <td class="name-cell">${i}<br><span class="desc-cell">${e.description||""}</span>
          ${e.is_custom?N`<span class="custom-tag-list">${xe("customBadge")}</span>`:""}
          ${e.topics&&e.topics.length?N`<br><span class="topic-chips">${e.topics.slice(0,4).map(e=>N`<span class="topic-chip">${e}</span>`)}</span>`:""}
        </td>
        <td class="num-cell col-downloads">${r?r.toLocaleString():"-"}</td>
        <td class="num-cell col-stars"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14" style="vertical-align:middle;"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${"number"==typeof o?o.toLocaleString():o}</td>
        <td class="ver-cell col-last-updated">${this._formatDate(e.last_updated)}</td>
        <td class="ver-cell col-installed-ver">${a&&e.installed_version||"-"}</td>
        <td class="ver-cell col-available-ver">${e.latest_version||"-"}</td>
        <td class="ver-cell col-installed-at">${e.installed_at?this._formatDate(e.installed_at):"-"}</td>
        <td class="status-cell col-status">${this._getStatusBadge(s)}</td>
        <td class="actions-cell">
          <button class="action-sm star-btn ${this._starredMap?.[e.full_name]?"starred":""}"
            @click=${t=>{t.stopPropagation(),this._toggleStar(e)}}
            title=${this._starredMap?.[e.full_name]?xe("unstar"):xe("star")}>
            <svg viewBox="0 0 20 20" fill="${this._starredMap?.[e.full_name]?"#ff9800":"none"}" stroke="#ff9800" stroke-width="1.5" width="12" height="12" style="vertical-align:middle;"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
          </button>
          ${a?N`
            ${n?N`<button class="action-sm primary" @click=${t=>{t.stopPropagation(),this._handleUpdate(e)}}>${xe("update")}</button>`:""}
          `:N`
            <button class="action-sm primary ${d?"installing":""}" @click=${t=>{t.stopPropagation(),this._handleInstall(e)}} ?disabled=${d}>${d?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:xe("install")}</button>
          `}
        </td>
      </tr>
    `}render(){const e=Math.ceil(this.total/this.limit),t=this._getFiltered(),i=this._groupRepos(t);return N`
      <!-- Controls: Search + Action Buttons -->
      <div class="controls">
        <button class="filter-toggle-sm" @click=${()=>{this._filterExpanded=!this._filterExpanded}} title="${xe("filterMore")}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
        </button>
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" autocomplete="off" placeholder="${xe("searchPlaceholder")}" .value=${this._searchText} @input=${this._onSearch} />
          ${this.search?N`<button class="search-clear" @click=${this._clearSearch}>✕</button>`:""}
        </div>
        <div class="controls-right">
          <button class="refresh-btn" @click=${this._refresh} title="${xe("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>
          <button class="view-toggle-btn" @click=${()=>this._onViewModeChange("card"===this.viewMode?"list":"card")} title="${"card"===this.viewMode?xe("viewList"):xe("viewCard")}">
            ${"card"===this.viewMode?N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            `:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            `}
          </button>
          <label class="sel-all-label desktop-only">
            <input type="checkbox" class="checkbox-sm" .checked=${this._isAllSelected()}
                   @click=${e=>e.stopPropagation()} @change=${this._toggleSelectAll}>
            ${xe("selectAll")}
            ${this._selectedRepos.length>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>`:""}
          </label>
        </div>
      </div>

      <!-- Inline Add / Org Repos (integrated with search) -->
      ${this.search&&!this.loading?N`
        ${this._parseRepoUrl(this.search)?N`
        <div class="search-add-bar" style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:10px;background:var(--card-background-color);border-radius:10px;border:1px solid var(--divider-color);flex-wrap:wrap;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>
          <span style="font-size:13px;font-weight:600;color:var(--primary-text-color);flex-shrink:0;">${this._parseRepoUrl(this.search)}</span>
          <span style="font-size:12px;color:var(--secondary-text-color);flex:1;">${xe("noMatchAdd")}</span>
          <select class="form-select" style="padding:6px 10px;font-size:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;flex-shrink:0;"
            .value=${this._addFromSearchCategory} @change=${e=>{this._addFromSearchCategory=e.target.value}}>
            <option value="integration">${xe("catIntegration")}</option>
            <option value="plugin">${xe("catPlugin")}</option>
            <option value="theme">${xe("catTheme")}</option>
            <option value="template">${xe("catTemplate")}</option>
            <option value="dashboard">${xe("catDashboard")}</option>
          </select>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:32px;white-space:nowrap;flex-shrink:0;"
            @click=${this._quickAddFromSearch} ?disabled=${this._addFromSearchInstalling}>
            ${this._addFromSearchInstalling?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("adding")}`:N`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg> ${xe("addFromSearch")}`}
          </button>
        </div>
        `:this._orgRepos.length>0?N`
        <div style="margin-bottom:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 3.5v0c6 6 6 14 0 20"/><path d="M16 3.5v0c-6 6-6 14 0 20"/><path d="M2.5 9h19"/><path d="M2.5 15h19"/></svg>
            <span style="font-size:13px;font-weight:600;color:var(--primary-text-color);flex-shrink:0;">${this.search}</span>
            <span style="font-size:12px;color:var(--secondary-text-color);flex:1;">${this._orgRepos.length} ${xe("repositories")}</span>
            <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;white-space:nowrap;color:var(--primary-text-color);flex-shrink:0;">
              <input type="checkbox" .checked=${this._browseOrgFilteredCount>0&&Object.keys(this._selectedOrgRepos).length===this._browseOrgFilteredCount}
                ?indeterminate=${Object.keys(this._selectedOrgRepos).length>0&&Object.keys(this._selectedOrgRepos).length<this._browseOrgFilteredCount}
                @change=${e=>this._toggleSelectAllBrowseOrg(e.target.checked)}
                style="width:14px;height:14px;accent-color:var(--primary-color);">
              ${xe("selectAll")}
            </label>
            <input type="text" placeholder="${xe("filterPlaceholder")}" .value=${this._orgFilter}
              @input=${e=>{this._orgFilter=e.target.value,this.requestUpdate()}}
              style="width:120px;padding:4px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--input-background-color,var(--card-background-color));color:var(--primary-text-color);outline:none;flex-shrink:0;">
            <button class="btn primary" style="font-size:11px;padding:4px 10px;min-height:28px;white-space:nowrap;flex-shrink:0;" @click=${this._syncSelectedBrowseOrg} ?disabled=${this._orgSyncing||0===Object.keys(this._selectedOrgRepos).length}>
              ${this._orgSyncing?xe("syncing"):`${xe("syncSelected")} (${Object.keys(this._selectedOrgRepos).length})`}
            </button>
          </div>
          ${this._orgSyncResult?N`<div style="font-size:11px;padding:4px 14px 8px;color:${this._orgSyncFailed?"#f44336":"var(--primary-text-color)"};">${this._orgSyncResult}</div>`:""}
          <div style="max-height:200px;overflow-y:auto;border-top:1px solid var(--divider-color);">
            ${this._browseFilteredSortedOrgRepos.map(e=>N`
              <div style="display:flex;align-items:center;gap:8px;padding:6px 14px;border-bottom:1px solid var(--divider-color);font-size:12px;cursor:pointer;transition:background 0.1s;color:var(--primary-text-color);" @click=${()=>this._openOrgRepoDetail(e)}>
                <input type="checkbox" .checked=${!!this._selectedOrgRepos[e.full_name]}
                  @click=${t=>{t.stopPropagation(),this._toggleBrowseOrgRepo(e.full_name)}}
                  style="width:14px;height:14px;cursor:pointer;accent-color:var(--primary-color);flex-shrink:0;">
                <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  <strong>${e.full_name}</strong>
                  <span style="color:var(--secondary-text-color);margin-left:4px;">⭐${e.stars?.toLocaleString()||0}</span>
                  ${e.category?N`<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:var(--primary-color);color:#fff;font-size:10px;">${e.category}</span>`:""}
                </span>
              </div>
            `)}
          </div>
        </div>
        `:this._orgLoading?N`
        <div style="padding:12px 14px;margin-bottom:10px;text-align:center;color:var(--secondary-text-color);font-size:12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);">
          <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("searching")}
        </div>
        `:""}
      `:""}

      <!-- Filters + Sort: compact row with prominent labels -->
      <div class="filter-sort-row ${this._filterExpanded?"expanded":""}">
        <div class="fs-chips">
          <span class="fs-label">${xe("filterStatus")}</span>
          ${this.statusOptions.filter(e=>""===e.value||(this.statusCounts[e.value]??0)>0).map(e=>N`
            <button class="filter-chip ${this.statusFilter===e.value?"active":""}" @click=${()=>this._onStatusFilter(e.value)}>${e.label}${""===e.value?N`<span class="chip-count">${this.total??0}</span>`:""}</button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("filterTags")}</span>
          <button class="filter-chip ${this._tagFilters.includes("favorites")?"active":""}" @click=${()=>this._onTagFilter("favorites")}>
            ${xe("tagFavorites")}
          </button>
          <button class="filter-chip ${this._tagFilters.includes("new")?"active":""}" @click=${()=>this._onTagFilter("new")}>
            ${xe("tagNew")}
          </button>
          <button class="filter-chip ${this._tagFilters.includes("custom")?"active":""}" @click=${()=>this._onTagFilter("custom")}>
            ${xe("tagCustom")}
          </button>
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("filterType")}</span>
          ${this.typeOptions.filter(e=>""===e.value||(this.categoryCounts[e.value]??0)>0).map(e=>N`
            <button class="filter-chip ${this.category===e.value?"active":""}" @click=${()=>this._onTypeFilter(e.value)}>
              ${e.label}
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("sort")}</span>
          ${this.sortColumns.map(e=>N`
            <button class="filter-chip sort-inline ${this.sort===e.key?"active":""}" @click=${()=>this._onSortColumn(e.key)}>
              ${e.label}${this.sort===e.key?N`<span class="sort-dir">${"desc"===this.sortDir?"▼":"▲"}</span>`:""}
            </button>
          `)}
        </div>
        <div class="fs-actions">
          <label class="sel-all-label">
            <input type="checkbox" class="checkbox-sm" .checked=${this._isAllSelected()}
                   @click=${e=>e.stopPropagation()} @change=${this._toggleSelectAll}>
            ${xe("selectAll")}
            ${this._selectedRepos.length>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>`:""}
          </label>
        </div>
      </div>

      ${this._selectedRepos.length>0?N`
      <div class="batch-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span>${xe("selected")}: ${this._selectedRepos.length}</span>
        <div class="batch-actions">
          <button class="batch-bar-btn" @click=${()=>this._batchDo("install")} ?disabled=${this._addingRepo}>${xe("batchInstall")}</button>
          <button class="batch-bar-btn" @click=${()=>this._batchDo("update")} ?disabled=${this._addingRepo}>${xe("batchUpdate")}</button>
          <button class="batch-bar-btn danger" @click=${()=>this._batchDo("remove")} ?disabled=${this._addingRepo}>${xe("batchRemove")}</button>
          <button class="batch-bar-btn" style="background:transparent;border-color:transparent;font-size:14px;" @click=${()=>{this._selectedRepos=[],this.requestUpdate()}}>✕</button>
        </div>
      </div>
      `:""}

      <!-- Content -->
      <div class="content-section">
      ${this.loading?N`
        <div class="skeleton-grid">
          ${[1,2,3,4,5,6].map(()=>N`
            <div class="skeleton-card">
              <div class="skeleton-card-img"></div>
              <div class="skeleton-card-body">
                <div class="skeleton-line wide"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line" style="width:40%"></div>
              </div>
            </div>
          `)}
        </div>
      `:0===t.length?N`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div>${this.search?xe("noMatch"):xe("noData")}</div>
        </div>
      `:N`

        ${i?N`
          ${i.map(e=>N`
            <div class="group-header" @click=${()=>this._toggleGroup(e.key)}>
              <span class="group-arrow ${this._collapsedGroups[e.key]?"collapsed":""}">▼</span>
              ${e.label}<span class="group-count">(${e.repos.length})</span>
            </div>
            ${this._collapsedGroups[e.key]?"":this._renderRepoList(e.repos)}
          `)}
        `:N`${this._renderRepoList(t)}`}

        ${e>1?N`
          <div class="pagination">
            <button class="page-btn" ?disabled=${this.page<=1} @click=${()=>this._goPage(this.page-1)}>${xe("prevPage")}</button>
            <span class="page-info">${xe("page")} ${this.page} / ${e}</span>
            <button class="page-btn primary" ?disabled=${this.page>=e} @click=${()=>this._goPage(this.page+1)}>${xe("nextPage")}</button>
            <select class="page-size-select" .value=${String(this.pageSize)} @change=${this._onPageSizeChange}>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        `:""}
      </div>
      `}
    `}}customElements.define("browse-view",ti);class ii extends ae{static properties={updates:{type:Array},loading:{type:Boolean},refreshing:{type:Boolean},updating:{type:Boolean},search:{type:String},_installingIds:{type:Object,state:!0},_changelogs:{type:Object,state:!0},_searchText:{type:String,state:!0},_selectedIds:{type:Object,state:!0},_selectedRepos:{type:Array,state:!0},_batchMode:{type:Boolean,state:!0},_viewMode:{type:String,state:!0},_favs:{type:Object,state:!0},_categoryFilter:{type:String,state:!0},_filterExpanded:{type:Boolean,state:!0},_updateProgress:{type:Object,state:!0},_skippedVersions:{type:Array,state:!0},_showSkipped:{type:Boolean},_history:{type:Array,state:!0},_showUpdatable:{type:Boolean},_showUpdated:{type:Boolean},autoUpdateRepos:{type:Array},langVersion:{type:Number}};constructor(){super(),this.updates=[],this.loading=!1,this.refreshing=!1,this.updating=!1,this.search="",this._searchTimer=null,this._installingIds={},this._changelogs={},this._changelogsLoading={},this._expandedChangelogs={},this._searchText="",this._selectedIds={},this._selectedRepos=[],this._batchMode=!1,this._favs={},this._updateProgress=null,this._skippedVersions=[],this._showSkipped=!1,this._history=[],this._showUpdatable=!0,this._showUpdated=!1,this.autoUpdateRepos=[],this.__auLoaded=!1;const e=(()=>{try{return localStorage.getItem("hacs_vision_view_mode")}catch{return null}})();this._viewMode=e||"card",this._filterExpanded=!1}static styles=[Se(),s`
      :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

      .controls-right { flex-shrink: 0; }
      .controls-right .btn-icon {
        width: 36px; height: 36px; padding: 0; border-radius: 10px;
        border: 1px solid var(--divider-color); background: var(--card-background-color);
        color: var(--secondary-text-color); cursor: pointer; display: flex;
        align-items: center; justify-content: center; touch-action: manipulation; font-size: 14px;
      }
      .controls-right .btn-icon:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .controls-right .btn-icon.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }

      /* ===== Skipped versions section ===== */
      .skipped-section {
        margin-top: 16px; padding: 16px; background: var(--card-background-color, #fff);
        border-radius: 14px; border: 1px solid var(--divider-color, #e0e0e0);
        animation: fadeSlideIn 0.2s ease;
      }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ===== Collapsible Section ===== */
      .section-header {
        display: flex; align-items: center; gap: 8px;
        padding: 12px 14px; margin-bottom: 10px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 12px; cursor: pointer;
        transition: all 0.15s; user-select: none;
      }
      .section-header:hover { border-color: var(--primary-color); }
      .section-header-icon {
        width: 20px; height: 20px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        color: var(--secondary-text-color);
        transition: transform 0.2s;
      }
      .section-header-icon.expanded { transform: rotate(90deg); }
      .section-header-label {
        flex: 1; font-size: 14px; font-weight: 600;
        color: var(--primary-text-color);
      }
      .section-header-count {
        font-size: 12px; font-weight: 500;
        padding: 2px 10px; border-radius: 10px;
        background: var(--primary-color, #03a9f4);
        color: #fff; flex-shrink: 0;
      }
      .section-header-count.updated-count { background: var(--success-color, #0f9d58); }
      .section-header-count.skipped-count { background: #9e9e9e; }

      /* ===== History (updated) section ===== */
      .history-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 8px; margin-bottom: 12px;
      }
      .history-card {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px; border-radius: 10px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        cursor: pointer; transition: all 0.15s;
        opacity: 0.75;
      }
      .history-card:hover { opacity: 1; border-color: var(--primary-color); }
      .history-avatar {
        width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 13px; font-weight: 700;
        background: #78909c;
      }
      .history-body { flex: 1; min-width: 0; }
      .history-name {
        font-size: 13px; font-weight: 600; color: var(--primary-text-color);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .history-meta {
        font-size: 11px; color: var(--secondary-text-color);
        margin-top: 2px;
      }
      .history-arrow { color: var(--warning-color); font-weight: 600; }
      .history-time {
        font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0;
        white-space: nowrap;
      }
      .skipped-header {
        display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        font-size: 13px; font-weight: 600; color: var(--primary-text-color);
      }
      .skipped-count { color: var(--secondary-text-color); font-weight: 400; }
      .skipped-list { display: flex; flex-direction: column; gap: 6px; }
      .skipped-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 14px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 10px; border: 1px solid var(--divider-color, #e0e0e0);
        transition: background 0.15s;
      }
      .skipped-item:hover { background: var(--card-background-color); }
      .skipped-name {
        flex: 1; font-size: 13px; color: var(--primary-text-color);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .skipped-version {
        font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0;
        padding: 2px 8px; background: rgba(255,152,0,0.12); border-radius: 4px;
      }
      .skipped-unskip {
        flex-shrink: 0; padding: 4px 12px; font-size: 11px; border-radius: 6px;
        border: 1px solid var(--primary-color); color: var(--primary-color);
        background: transparent; cursor: pointer; transition: all 0.15s;
        touch-action: manipulation;
      }
      .skipped-unskip:hover { background: var(--primary-color); color: #fff; }

      .card {
        border: 1px solid var(--divider-color); border-radius: 14px;
        background: var(--card-background-color); overflow: hidden;
        transition: all 0.2s, box-shadow 0.2s; cursor: pointer;
        display: flex; flex-direction: column; min-height: 290px;
        position: relative;
      }
      .card:hover { border-color: var(--primary-color); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

      .img-container {
        height: 120px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, var(--secondary-background-color, #f0f0f0) 0%, var(--card-background-color, #fff) 100%);
        position: relative;
      }
      .avatar {
        width: 52px; height: 52px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; font-weight: 700; color: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        overflow: hidden; background: transparent;
      }
      .avatar img { width: 100%; height: 100%; object-fit: cover; }
      .avatar .initials {
        display: flex; width: 100%; height: 100%;
        align-items: center; justify-content: center; border-radius: 50%;
      }
      .badge-corner {
        padding: 3px 8px; border-radius: 5px;
        font-size: 10px; font-weight: 600; color: #fff;
      }
      .badge-corner.integration { background: #1565c0; }
      .badge-corner.plugin { background: #7b1fa2; }
      .badge-corner.theme { background: #2e7d32; }
      .badge-corner.template { background: #6a1b9a; }

      .refresh-btn {
        padding: 8px; border: 1px solid var(--divider-color); border-radius: 10px;
        background: var(--card-background-color); color: var(--primary-text-color);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.25s; width: 36px; height: 36px;
        touch-action: manipulation; flex-shrink: 0;
      }
      .refresh-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .refresh-btn svg { width: 16px; height: 16px; }

    .filter-toggle-sm {
      display: none; width: 36px; height: 36px; flex-shrink: 0;
      border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; align-items: center; justify-content: center; padding: 0;
      touch-action: manipulation;
    }
    .filter-toggle-sm:hover { border-color: var(--primary-color); color: var(--primary-color); }

      .status-badge-update {
        position: absolute; bottom: 8px; left: 8px; z-index: 2;
        padding: 3px 8px; border-radius: 5px;
        font-size: 10px; font-weight: 600; color: #fff;
        background: rgba(255,152,0,0.85);
      }

      /* Top bar: checkbox + category badge */
      .top-bar {
        position: absolute; top: 0; left: 0; right: 0;
        display: flex; align-items: center; gap: 6px;
        padding: 10px; z-index: 3;
      }
      .top-bar .checkbox {
        width: 18px; height: 18px; border-radius: 4px;
        border: 2px solid rgba(255,255,255,0.7); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all 0.2s;
        background: rgba(0,0,0,0.25);
        -webkit-appearance: none; appearance: none; touch-action: manipulation;
      }
      .top-bar .checkbox:checked {
        background: var(--primary-color); border-color: var(--primary-color);
      }
      .top-bar .checkbox:checked::after {
        content: '✓'; color: #fff; font-size: 12px; font-weight: 700;
      }

      .fav-btn {
        position: absolute; top: 10px; right: 10px; z-index: 3;
        width: 32px; height: 32px; border-radius: 50%;
        border: none; background: rgba(255,255,255,0.85);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.2s; padding: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      }
      .fav-btn:hover { transform: scale(1.1); }
      .fav-btn svg { width: 18px; height: 18px; transition: all 0.2s; }
      .fav-btn.active svg { fill: #ff9800; color: #ff9800; }
      .fav-btn:not(.active) svg { fill: none; color: var(--secondary-text-color, #727272); }

      .card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; }
      .card-name {
        font-size: 15px; font-weight: 600; color: var(--primary-text-color);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 8px;
      }

      .version-row { display: flex; gap: 12px; margin-bottom: 12px; }
      .version-item { flex: 1; text-align: center; padding: 8px; border-radius: 8px; background: var(--secondary-background-color); }
      .version-label { font-size: 10px; color: var(--secondary-text-color); text-transform: uppercase; margin-bottom: 4px; }
      .version-value { font-size: 14px; font-weight: 700; }
      .version-value.old { color: var(--warning-color, #ff8f00); }
      .version-value.new { color: var(--success-color, #0f9d58); }

      .card-desc { font-size: 12px; color: var(--secondary-text-color); margin-bottom: 12px; line-height: 1.5; }

      /* Multi-select checkbox */
      .checkbox {
        width: 18px; height: 18px; border-radius: 4px;
        border: 2px solid var(--secondary-text-color); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all 0.2s; background: transparent;
        -webkit-appearance: none; appearance: none; touch-action: manipulation;
      }
      .checkbox:checked {
        background: var(--primary-color); border-color: var(--primary-color);
      }
      .checkbox:checked::after {
        content: '✓'; color: #fff; font-size: 12px; font-weight: 700;
      }

      /* ===== Action Bar (matches repo-card) ===== */
      .actions {
        display: flex; gap: 6px;
        padding: 8px 14px;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        margin-top: auto; background: var(--card-background-color, #fff);
      }
      .action-btn {
        flex: 1; min-width: 0; padding: 8px 4px; border-radius: 10px;
        font-size: 12px; text-align: center; justify-content: center;
        border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        cursor: pointer; transition: all 0.2s;
        display: flex; align-items: center; gap: 4px;
        touch-action: manipulation;
      }
      .action-btn:hover { border-color: var(--primary-color, #03a9f4); color: var(--primary-color, #03a9f4); }
      .action-btn.primary {
        background: var(--primary-color, #03a9f4); border-color: var(--primary-color, #03a9f4); color: #fff;
      }
      .action-btn.primary:hover { opacity: 0.9; }
      .action-btn.installing {
        opacity: 0.7; cursor: not-allowed;
        animation: btnPulse 1.5s infinite;
      }
      .action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
      @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

      /* Auto-update toggle row (in card body, not actions bar) */
      .au-toggle-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 14px 4px; margin: 0;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        font-size: 12px;
      }
      .au-toggle-row .au-label {
        color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px;
      }
      .au-toggle-row .au-label svg {
        width: 14px; height: 14px;
      }
      .au-toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; cursor: pointer; }
      .au-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
      .au-toggle .slider {
        position: absolute; inset: 0; background: var(--divider-color, #ccc);
        border-radius: 20px; transition: 0.3s; cursor: pointer;
      }
      .au-toggle .slider::before {
        content: ''; position: absolute; height: 16px; width: 16px;
        left: 2px; bottom: 2px; background: #fff;
        border-radius: 50%; transition: 0.3s;
      }
      .au-toggle input:checked + .slider { background: #4caf50; }
      .au-toggle input:checked + .slider::before { transform: translateX(16px); }

      /* ===== Filter bar (matches browse/integrations) ===== */
      .filter-bar {
        display: flex; align-items: center; gap: 6px;
        margin-bottom: 10px; overflow-x: auto; flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      .filter-bar::-webkit-scrollbar { display: none; }
      .filter-bar .chip {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 5px 12px; border-radius: 16px; border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color); color: var(--secondary-text-color);
        font-size: 11px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        touch-action: manipulation; user-select: none;
      }
      .filter-bar .chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .filter-bar .chip-active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
      .filter-bar .chip-count { font-size: 10px; opacity: 0.7; margin-left: 2px; }

      /* F6: Changelog preview */
      .changelog-preview {
        margin-top: 8px; padding: 10px 12px;
        background: var(--secondary-background-color);
        border-radius: 8px; font-size: 12px;
      }
      .changelog-preview-title { font-weight: 600; margin-bottom: 6px; color: var(--primary-text-color); }
      .changelog-preview-body {
        color: var(--secondary-text-color); white-space: pre-wrap;
        line-height: 1.5; max-height: 80px; overflow: hidden;
      }
      .changelog-preview-link {
        color: var(--primary-color); font-size: 11px; text-decoration: none;
        display: inline-block; margin-top: 6px;
      }
      .changelog-preview-link:hover { text-decoration: underline; }
      .changelog-preview-body.expanded { max-height: none; }
      .changelog-expand-btn {
        display: inline-block; margin-top: 6px; margin-right: 10px;
        color: var(--primary-color); font-size: 11px; cursor: pointer;
        background: none; border: none; padding: 0;
      }
      .changelog-expand-btn:hover { text-decoration: underline; }

      @keyframes spin { 100% { transform: rotate(360deg); } }

      /* ===== View Mode Toggle ===== */
      .view-toggle {
        display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
        overflow: hidden; flex-shrink: 0;
      }
      .view-toggle-btn {
        padding: 6px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
        background: var(--card-background-color);
        color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
        transition: all 0.2s; min-width: 36px; min-height: 36px;
        display: flex; align-items: center; justify-content: center;
        touch-action: manipulation;
      }
      .view-toggle-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }

      /* ===== List View (HACS-style table) ===== */
      .list-view { width: 100%; overflow-x: auto; }
      .list-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: auto; }
      .list-table th {
        text-align: left; padding: 10px 8px; font-size: 11px; font-weight: 600;
        color: var(--secondary-text-color); text-transform: uppercase;
        border-bottom: 2px solid var(--divider-color); white-space: nowrap;
        user-select: none; letter-spacing: 0.3px;
      }
      .list-table td {
        padding: 10px 8px; border-bottom: 1px solid var(--divider-color);
        vertical-align: middle;
      }
      .list-table .col-icon { width: 40px; }
      .list-table .icon-cell {
        width: 32px; height: 32px; border-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 14px; font-weight: 700;
        overflow: hidden;
      }
      .list-table .name-cell {
        font-weight: 500; color: var(--primary-text-color); width: 100%;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .list-table .desc-cell {
        font-size: 11px; color: var(--secondary-text-color);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 0;
      }
      .custom-tag-list {
        display: inline-block; margin-top: 4px;
        font-size: 9px; padding: 1px 6px; border-radius: 4px;
        background: #ff6f00; color: #fff; font-weight: 700;
      }
      .topic-chips { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
      .topic-chip {
        font-size: 9px; padding: 1px 6px; border-radius: 4px;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color); border: 1px solid var(--divider-color);
      }
      .list-table tr { cursor: pointer; transition: background 0.15s; }
      .list-table tbody tr:hover { background: var(--secondary-background-color); }

      .status-badge {
        display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600;
      }
      .status-badge.pending-upgrade { background: rgba(255,152,0,0.15); color: #ff9800; }

      .update-all-btn {
        padding: 6px 10px; border-radius: 8px;
        background: var(--primary-color); color: #fff; border: none;
        font-size: 12px; font-weight: 600; cursor: pointer;
        display: flex; align-items: center; gap: 4px; transition: opacity 0.2s;
        touch-action: manipulation; white-space: nowrap; min-height: 36px;
      }
      .update-all-btn:hover { opacity: 0.9; }
      .update-all-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .update-all-btn.selected-btn {
        background: transparent; border: 1px solid var(--primary-color);
        color: var(--primary-color);
      }
      .update-all-btn.selected-btn:disabled { opacity: 0.4; }

      @media (max-width: 768px) {
        .controls { flex-wrap: nowrap; gap: 4px; margin-bottom: 0; }
        .search { flex: 1; min-width: 0; height: 36px; box-sizing: border-box; border: 1px solid var(--divider-color); border-radius: 10px; }
        .search input { padding: 7px 10px 7px 30px; font-size: 13px; border: none; background: transparent; height: 100%; }
        .search-icon { left: 10px; }
        .controls-right { flex-shrink: 0; }
        .desktop-only { display: none; }
        .filter-bar { padding: 6px 10px; flex-wrap: nowrap; overflow: hidden; background: var(--secondary-background-color, #f5f5f5); border-radius: 10px; }
        .filter-bar .fs-chips { display: none; }
        .filter-bar.expanded .fs-chips { display: flex; }
        .filter-bar.expanded { flex-wrap: wrap; }
        .filter-bar .fs-actions { display: none; }
        .filter-bar.expanded .fs-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; }
        .filter-toggle-sm { display: flex; }
        .card { min-height: 260px; }
        .img-container { height: 100px; }
        .avatar { width: 44px; height: 44px; font-size: 20px; }
        .card-body { padding: 10px; }
        .card-name { font-size: 14px; }
        .version-row { gap: 8px; }
        .version-item { padding: 6px; }
        .version-label { font-size: 9px; }
        .version-value { font-size: 12px; }
        .card-desc { font-size: 11px; margin-bottom: 10px; }
        .action-btn { min-height: 44px; padding: 10px 6px; font-size: 11px; }
        .fav-btn { width: 36px; height: 36px; }
        .fav-btn svg { width: 20px; height: 20px; }
        .version-row { gap: 8px; }
        .version-item { padding: 6px; }
        .version-label { font-size: 9px; }
        .version-value { font-size: 12px; }
        .card-desc { font-size: 11px; margin-bottom: 10px; }
        .btn.primary { min-height: 44px; }
        .update-all-btn { flex: 1; min-width: 80px; justify-content: center; min-height: 36px; font-size: 11px; padding: 4px 8px; }
      }

      .batch-bar {
        display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        padding: 8px 12px; margin: 6px 0;
        background: var(--primary-color, #03a9f4); color: #fff;
        border-radius: 8px; font-size: 13px; font-weight: 600;
      }
      .batch-bar-btn {
        padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;
        background: rgba(255,255,255,0.2); color: #fff;
        border: 1px solid rgba(255,255,255,0.4); cursor: pointer;
      }
      .batch-bar-btn:hover { background: rgba(255,255,255,0.35); }
      .batch-bar-btn.danger { border-color: #ff5252; color: #ff5252; }

      /* Progress bar for batch update */
      .update-progress {
        padding: 8px 12px; margin: 6px 0;
        display: flex; align-items: center; gap: 10px;
      }
      .progress-track {
        flex: 1; height: 6px; border-radius: 3px;
        background: var(--divider-color, #e0e0e0); overflow: hidden;
      }
      .progress-fill {
        height: 100%; border-radius: 3px;
        background: var(--primary-color, #03a9f4);
        transition: width 0.3s ease;
      }
      @keyframes pulse {
        0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; }
      }
      .refresh-btn.spinning svg { animation: spin 1s linear infinite; }
      .refresh-btn.spinning { opacity: 0.6; }
      .progress-label {
        font-size: 12px; color: var(--secondary-text-color);
        white-space: nowrap; flex-shrink: 0;
      }

      /* Install progress bar inside card */
      .card-install-progress {
        flex: 1;
        display: flex; align-items: center; gap: 8px;
        padding: 6px 10px; border-radius: 10px;
        background: var(--secondary-background-color, #f5f5f5);
      }
      .card-install-progress-track {
        flex: 1; height: 8px; border-radius: 4px;
        background: var(--divider-color, #e0e0e0); overflow: hidden;
      }
      .card-install-progress-fill {
        height: 100%; border-radius: 4px;
        background: linear-gradient(90deg, var(--primary-color, #03a9f4), #4caf50);
        transition: width 0.5s ease;
      }
      .card-install-progress-label {
        font-size: 12px; font-weight: 700;
        color: var(--primary-color, #03a9f4);
        flex-shrink: 0; min-width: 36px; text-align: right;
      }
    `];async connectedCallback(){super.connectedCallback(),this.loading=!0;try{const e=await de.getUpdates();this.updates=Array.isArray(e)?e:e.updates||[],this._lazyLoadChangelogs()}catch(e){console.error("Failed to load updates",e),this.updates=[]}this.loading=!1,await this._loadSkippedVersions(),await this._loadHistory(),this.__auLoaded||(this._loadAutoUpdateSettings(),this.__auLoaded=!0)}async _refresh(){this.refreshing=!0,this._updateProgress={current:0,total:0,currentName:xe("checkingUpdates")};try{await de.refresh(),this._updateProgress={...this._updateProgress,currentName:xe("loadingUpdates")};const e=await de.getUpdates();this.updates=Array.isArray(e)?e:e.updates||[],this._changelogs={},this._lazyLoadChangelogs(),this._loadSkippedVersions(),this._loadHistory(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){console.error("Refresh failed",e)}this.refreshing=!1,this._updateProgress=null}_lazyLoadChangelogs(){const e=this.updates.filter(e=>e.full_name&&!this._changelogs[e.full_name]);if(0===e.length)return;let t=0;const i=()=>{t>=e.length||(this._loadChangelog(e[t++].full_name,e[t-1].latest_version),setTimeout(i,150))};setTimeout(i,300)}async _load(){this.loading=!0;try{const e=await de.getUpdates();this.updates=Array.isArray(e)?e:e.updates||[],this._loadSkippedVersions(),this._loadHistory()}catch(e){console.error("Failed to load updates",e),this.updates=[]}this.loading=!1}async _loadChangelog(e,t){if(e&&!this._changelogs[e]&&!this._changelogsLoading[e]){this._changelogsLoading={...this._changelogsLoading,[e]:!0};try{const i=await de.getChangelog(e,t);i?.body&&(this._changelogs={...this._changelogs,[e]:i})}catch{}this._changelogsLoading={...this._changelogsLoading,[e]:!1}}}_toggleChangelog(e){this._expandedChangelogs={...this._expandedChangelogs,[e]:!this._expandedChangelogs?.[e]}}async _loadChangelogs(){const e=this.updates.filter(e=>e.full_name);if(0===e.length)return;const t=await Promise.allSettled(e.map(e=>de.getChangelog(e.full_name,e.latest_version).then(t=>({fullName:e.full_name,data:t})))),i={};for(const e of t)"fulfilled"===e.status&&e.value.data?.body&&(i[e.value.fullName]=e.value.data);Object.keys(i).length>0&&(this._changelogs={...this._changelogs,...i})}async _updateSelected(){const e=Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]);if(0===e.length)return;if(await Jt.show(this,{message:xe("confirmUpdateSelected",{n:e.length}),confirmText:xe("confirmUpdate"),danger:!1})){this.updating=!0,this._updateProgress={current:0,total:e.length,currentName:""};try{for(const t of e){const e=this.updates.find(e=>(e.id||e.full_name)===t);this._updateProgress={...this._updateProgress,currentName:e?.name||e?.full_name||t},this.requestUpdate(),await de.update([t]),this._updateProgress={...this._updateProgress,current:this._updateProgress.current+1}}Ce(`${xe("allUpdatesStarted")} (${e.length})`,"success"),this._selectedIds={},this._updateProgress=null,this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("updateFailed")}: ${e.message}`,"error"),this._updateProgress=null}this.updating=!1}}async _skipSelected(){const e=Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]);if(0===e.length)return;if(!await Jt.show(this,{message:xe("confirmSkipVersion",{n:e.length}),confirmText:xe("ignoreVersion"),danger:!1}))return;let t=0;for(const i of e){const e=this.updates.find(e=>(e.id||e.full_name)===i);if(e?.latest_version)try{await de.ignoreVersion(e.full_name,e.latest_version),t++}catch(t){console.warn(`Skip failed for ${e.full_name}:`,t)}}Ce(xe("skipVersionDone",{ok:t,total:e.length}),"success"),this._selectedIds={},this._load(),this._loadSkippedVersions(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}async _updateAll(){const e=this.updates.map(e=>e.id||e.full_name);if(0===e.length)return;if(await Jt.show(this,{message:xe("confirmUpdateAll",{n:e.length}),confirmText:xe("confirmUpdate"),danger:!1})){this.updating=!0,this._updateProgress={current:0,total:e.length,currentName:""};try{for(const e of this.updates){const t=e.id||e.full_name;this._updateProgress={...this._updateProgress,currentName:e.name||e.full_name},this.requestUpdate(),await de.update([t]),this._updateProgress={...this._updateProgress,current:this._updateProgress.current+1}}Ce(`${xe("allUpdatesStarted")} (${e.length})`,"success"),this._selectedIds={},this._updateProgress=null,this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("updateFailed")}: ${e.message}`,"error"),this._updateProgress=null}this.updating=!1}}_toggleSelect(e){this._selectedIds={...this._selectedIds,[e]:!this._selectedIds[e]}}_toggleSelectFull(e){this._selectedRepos.includes(e)?this._selectedRepos=this._selectedRepos.filter(t=>t!==e):this._selectedRepos=[...this._selectedRepos,e]}async _batchDo(e){if(0!==this._selectedRepos.length){if("remove"===e){if(!await Jt.show(this,{message:xe("batchRemoveConfirm",{n:this._selectedRepos.length}),confirmText:xe("batchRemove"),danger:!0}))return}try{if(Ce(xe("batchInProgress"),"info"),"update"===e){this.updating=!0,this._updateProgress={current:0,total:this._selectedRepos.length,currentName:""};for(const e of this._selectedRepos){const t=this.updates.find(t=>(t.id||t.full_name)===e);this._updateProgress={...this._updateProgress,currentName:t?.name||t?.full_name||e},this.requestUpdate(),await de.update([e]),this._updateProgress={...this._updateProgress,current:this._updateProgress.current+1}}this._updateProgress=null}else"remove"===e&&await de.batchRemove(this._selectedRepos.map(e=>e));Ce(xe("batchComplete"),"success"),this._selectedRepos=[],this._batchMode=!1,this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(t){Ce(`${e} failed: ${t.message}`,"error")}}}_toggleSelectAll(){const e=this._getFiltered();if(this._isAllSelected())this._selectedIds={};else{const t={};for(const i of e)t[i.id||i.full_name]=!0;this._selectedIds=t}}_isAllSelected(){const e=this._getFiltered();return 0!==e.length&&e.every(e=>this._selectedIds[e.id||e.full_name])}_selectedCount(){return Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]).length}async _updateOne(e){const t=e.id||e.full_name;this._installingIds={...this._installingIds,[t]:{percentage:0,stage:"starting",message:xe("updatingProgress")}},this.requestUpdate();try{await de.update([t]);const i=e.latest_version;let o=0;const r=async()=>{if(o++>30){const e={...this._installingIds};return delete e[t],this._installingIds=e,this.requestUpdate(),void Ce(`${xe("updateFailed")}: timeout`,"error")}try{const o=await de.getRepoStatus(t);if(o?.progress&&(this._installingIds={...this._installingIds,[t]:o.progress},this.requestUpdate()),o?.installed_version===i||o?.installed&&!o?.has_update){const i={...this._installingIds};return delete i[t],this._installingIds=i,this.requestUpdate(),Ce(`${xe("updateComplete")}: ${e.full_name||e.name}`,"success"),this._load(),void this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}}catch(e){}setTimeout(r,2e3)};setTimeout(r,2e3)}catch(e){const i={...this._installingIds};delete i[t],this._installingIds=i,this.requestUpdate(),Ce(`${xe("updateFailed")}: ${e.message}`,"error")}}async _skipVersion(e){const t=e.full_name;if(!t)return;const i=e.latest_version;if(!i)return;if(await Jt.show(this,{message:xe("confirmIgnoreVersion",{repo:t,version:i}),confirmText:xe("ignoreVersion"),danger:!1}))try{await de.ignoreVersion(t,i),Ce(`${xe("ignoreVersion")}: ${i}`,"success");const e=await de.getUpdates();this.updates=Array.isArray(e)?e:e.updates||[],this._loadSkippedVersions(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("unskipVersionFailed")}: ${e.message}`,"error")}}async _loadSkippedVersions(){try{const e=await de.getSkippedVersions();this._skippedVersions=e&&e.skipped||[]}catch(e){this._skippedVersions=[]}this.requestUpdate()}async _unskipVersion(e){if(await Jt.show(this,{message:xe("confirmUnskipVersion",{name:e.full_name,ver:e.skipped_version}),confirmText:xe("unignoreVersion"),danger:!1}))try{await de.unignoreVersion(e.full_name),Ce(`${xe("unignoreVersion")}: ${e.full_name}`,"success"),this._loadSkippedVersions(),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("unskipVersionFailed")}: ${e.message}`,"error")}}async _loadHistory(){try{const e=await de.getHistory();this._history=e&&e.history||[]}catch(e){this._history=[]}this.requestUpdate()}_timeAgo(e){if(!e)return"";const t=new Date(e),i=Date.now()-t.getTime();if(i<0)return xe("justNow");const o=Math.floor(i/1e3);if(o<60)return xe("justNow");const r=Math.floor(o/60);if(r<60)return xe("minAgo",{n:r});const s=Math.floor(r/60);if(s<24)return xe("hourAgo",{n:s});return xe("dayAgo",{n:Math.floor(s/24)})}async _loadAutoUpdateSettings(){try{const e=await de.getSettings();this.autoUpdateRepos=e?.auto_update_repos||[]}catch(e){console.debug("Failed to load auto-update settings",e),this.autoUpdateRepos=[]}}_isAutoUpdate(e){return Array.isArray(this.autoUpdateRepos)&&this.autoUpdateRepos.includes(e?.full_name)}async _handleAutoUpdateToggle(e){const t=e?.full_name;if(!t)return;const i=[...this.autoUpdateRepos],o=[...this.autoUpdateRepos],r=o.indexOf(t);r>=0?o.splice(r,1):o.push(t),this.autoUpdateRepos=o;try{await de.updateSettings({auto_update_repos:o}),await de.reloadAutoUpdateSettings(),Ce(t+xe(r>=0?"autoUpdateToggledOff":"autoUpdateToggledOn"),"success")}catch(e){this.autoUpdateRepos=i,Ce(`${xe("autoUpdateToggleFailed")}: ${e.message}`,"error")}}_getFiltered(){let e=this.updates;if(this._categoryFilter&&"all"!==this._categoryFilter&&(e=e.filter(e=>(e.category||"integration")===this._categoryFilter)),this.search){const t=this.search.toLowerCase();let i=null;const o=t.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);o&&(i=o[1].replace(/\.git$/,"").toLowerCase());const r=/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(t);e=e.filter(e=>{const o=(e.full_name||"").toLowerCase(),s=(e.manifest_name||e.name||"").toLowerCase(),a=(e.authors||[]).join(",").toLowerCase();return!!(s.includes(t)||o.includes(t)||a.includes(t))||(!(!i||!o.includes(i))||!(!r||!o.includes(t)))})}return e}_clearSearch(){this._searchText="",this.search="",this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_openDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}async _toggleFav(e){const t=e.full_name||e.id,i=!!this._favs[t],o={...this._favs};i?delete o[t]:o[t]=!0,this._favs=o;try{const e=Object.keys(o);await de.setFavorites(e)}catch(e){this._favs=this._favs}}_setViewMode(e){this._viewMode=e;try{localStorage.setItem("hacs_vision_view_mode",e)}catch{}}_renderListTable(e){return N`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th>${xe("colName")}</th>
            <th>${xe("currentVersion")}</th>
            <th>${xe("latestVersion")}</th>
            <th>${xe("colStatus")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>this._renderListRow(e))}
        </tbody>
      </table>
    `}_renderListRow(e){const t=e.id||e.full_name,i=!!this._installingIds?.[t],o=!!this._selectedIds[t],r=e.manifest_name||e.name||e.full_name||"?",s=$e(e.category),a=e.domain;return N`
      <tr @click=${t=>{t.target.closest(".btn")||t.target.closest("a")||t.target.closest(".checkbox")||this._openDetail(e)}}>
        <td class="col-icon">
          <div class="icon-cell" style="background:${s}">
            ${a&&"integration"===e.category?N`
                <img src="https://brands.home-assistant.io/${a}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextElementSibling.style.display="flex"}}>
                <span style="display:none">${r.charAt(0).toUpperCase()}</span>
              `:r.charAt(0).toUpperCase()}
          </div>
        </td>
        <td>
          <div class="name-cell">${r}</div>
          ${e.description?N`<div class="desc-cell">${e.description}</div>`:""}
          ${e.is_custom?N`<span class="custom-tag-list">${xe("customBadge")}</span>`:""}
          ${e.topics&&e.topics.length?N`<div class="topic-chips">${e.topics.slice(0,4).map(e=>N`<span class="topic-chip">${e}</span>`)}</div>`:""}
        </td>
        <td style="font-size:12px;color:var(--warning-color);white-space:nowrap;">${e.installed_version||"?"}</td>
        <td style="font-size:12px;color:var(--success-color);white-space:nowrap;">${e.latest_version||"?"}</td>
        <td><span class="status-badge pending-upgrade">${xe("statusPendingUpgrade")}</span></td>
        <td style="white-space:nowrap;">
          <input type="checkbox" class="checkbox" .checked=${o}
                 @click=${e=>e.stopPropagation()}
                 @change=${()=>this._toggleSelect(t)} style="margin-right:6px;">
          <button class="btn primary ${i?"installing":""}" style="padding:4px 10px;font-size:11px;"
                  @click=${t=>{t.stopPropagation(),this._updateOne(e)}} ?disabled=${i||this.updating}>
            ${i?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:N`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${xe("updateNow")}`}
          </button>
          <button class="btn" style="padding:4px 8px;font-size:11px;margin-left:4px;${this._isAutoUpdate(e)?"background:rgba(76,175,80,0.12);border-color:#4caf50;color:#4caf50;":"color:var(--secondary-text-color);"}"
                  @click=${t=>{t.stopPropagation(),this._handleAutoUpdateToggle(e)}}
                  title="${this._isAutoUpdate(e)?xe("autoUpdateEnabledText")||"ON":xe("autoUpdateDisabledText")||"OFF"}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
          </button>
          <button class="btn" style="padding:4px 8px;font-size:11px;margin-left:4px;color:var(--secondary-text-color);"
                  @click=${t=>{t.stopPropagation(),this._skipVersion(e)}}>
            🔕 ${xe("ignoreVersion")}
          </button>
        </td>
      </tr>
    `}render(){const e=this._getFiltered();return N`
      <div class="controls">
        <!-- 刷新进度条 -->
        ${this.refreshing?N`
          <div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:var(--card-background-color,#fff);border-bottom:1px solid var(--divider-color);padding:10px 16px;display:flex;align-items:center;gap:10px;">
            <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span style="font-size:13px;color:var(--primary-text-color);flex:1;">${this._updateProgress?.currentName||xe("checkingUpdates")}</span>
            <div style="width:120px;height:6px;background:var(--divider-color);border-radius:3px;overflow:hidden;">
              <div class="progress-fill" style="width:100%;animation:pulse 1.5s ease-in-out infinite;"></div>
            </div>
          </div>
        `:""}
        <button class="filter-toggle-sm" @click=${()=>{this._filterExpanded=!this._filterExpanded}} title="${xe("filterMore")}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
        </button>
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" autocomplete="off" placeholder="${xe("searchUpdates")}" .value=${this._searchText||""}
                 @input=${e=>{this._searchText=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.search=this._searchText},300)}}>
          ${this.search?N`
            <button class="search-clear" @click=${this._clearSearch}>✕</button>
          `:""}
        </div>
        <div class="controls-right">
          <button class="refresh-btn ${this.refreshing?"spinning":""}" @click=${this._refresh} ?disabled=${this.refreshing} title="${xe("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
          <button class="view-toggle-btn" @click=${()=>this._setViewMode("card"===this._viewMode?"list":"card")} title="${"card"===this._viewMode?xe("viewList"):xe("viewCard")}">
            ${"card"===this._viewMode?N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            `:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            `}
          </button>
          ${this.updates.length>0?N`
            <button class="update-all-btn" @click=${this._updateAll} ?disabled=${this.updating||0===this.updates.length}>
              <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.updating?xe("updatingProgress"):xe("updateAllNow")}
            </button>
          `:""}
          <label class="sel-all-label desktop-only">
            <input type="checkbox" class="checkbox-sm" .checked=${this._isAllSelected()}
                   @click=${e=>e.stopPropagation()} @change=${this._toggleSelectAll}>
            ${xe("selectAll")}
            ${this._selectedCount()>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedCount()})</span>`:""}
          </label>
        </div>
      </div>

      ${(()=>{const e=["all","integration","plugin","theme","template"],t={};for(const i of e)t[i]="all"===i?this.updates.length:this.updates.filter(e=>(e.category||"integration")===i).length;return N`
        <div class="filter-bar ${this._filterExpanded?"expanded":""}">
          <div class="fs-chips">
          ${e.map(e=>N`
            <button class="chip ${this._categoryFilter===e?"chip-active":""}"
              @click=${()=>{this._categoryFilter=e}}>
              ${xe("all"===e?"filterAll":"integration"===e?"catIntegration":"plugin"===e?"catPlugin":"theme"===e?"catTheme":"catTemplate")}
              <span class="chip-count">${t[e]}</span>
            </button>
          `)}
          </div>
          <div class="fs-actions">
            ${this._skippedVersions&&this._skippedVersions.length>0?N`
              <button class="chip" @click=${()=>{this._showSkipped=!this._showSkipped,this.requestUpdate()}}>
                🔇 ${this._showSkipped?xe("hideSkipped"):xe("showSkipped")} (${this._skippedVersions.length})
              </button>
            `:""}
            ${this._selectedCount()>0?N`
              <button class="update-all-btn selected-btn" @click=${this._updateSelected} ?disabled=${this.updating||0===this._selectedCount()}>
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> ${xe("updateSelected")} (${this._selectedCount()||0})
              </button>
            `:""}
            <label class="sel-all-label">
              <input type="checkbox" class="checkbox-sm" .checked=${this._isAllSelected()}
                     @click=${e=>e.stopPropagation()} @change=${this._toggleSelectAll}>
              ${xe("selectAll")}
              ${this._selectedCount()>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedCount()})</span>`:""}
            </label>
          </div>
        </div>`})()}

      ${this._updateProgress?N`
        <div class="update-progress">
          <div class="progress-track">
            <div class="progress-fill" style="width:${this._updateProgress.current/this._updateProgress.total*100}%"></div>
          </div>
          <span class="progress-label">${xe("updatingProgress")} ${this._updateProgress.current}/${this._updateProgress.total} — ${this._updateProgress.currentName}</span>
        </div>
      `:""}

      ${this.loading?N`
        <div class="skeleton-grid">
          ${[1,2,3,4,5,6].map(()=>N`
            <div class="skeleton-card">
              <div class="skeleton-card-img"></div>
              <div class="skeleton-card-body">
                <div class="skeleton-line wide"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line" style="width:50%"></div>
              </div>
            </div>
          `)}
        </div>
      `:N`

        <div class="section-header" @click=${()=>{this._showUpdatable=!this._showUpdatable,this.requestUpdate()}}
             style="margin-bottom:${this._showUpdatable?"6px":"16px"};">
          <span class="section-header-icon ${this._showUpdatable?"expanded":""}">▶</span>
          <span class="section-header-label">${xe("sectionUpdatable")}</span>
          <span class="section-header-count">${this.updates.length}</span>
        </div>

        ${this._showUpdatable?N`

          ${this._selectedCount()>0?N`
            <div class="batch-bar" style="margin-bottom:10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span style="font-weight:600;">${xe("selected")}: ${this._selectedCount()}</span>
              <div class="batch-actions">
                <button class="batch-bar-btn" @click=${this._updateSelected} ?disabled=${this.updating}>${xe("batchUpdate")}</button>
                <button class="batch-bar-btn" style="color:var(--warning-color,#ff9800);border-color:var(--warning-color,#ff9800);" @click=${this._skipSelected} ?disabled=${this.updating}>🔕 ${xe("batchSkip")}</button>
                <button class="batch-bar-btn danger" @click=${()=>this._batchDo("remove")} ?disabled=${this.updating}>${xe("batchRemove")}</button>
                <button class="batch-bar-btn" style="background:transparent;border-color:transparent;font-size:14px;" @click=${()=>{this._selectedIds={},this.requestUpdate()}}>✕</button>
              </div>
            </div>
          `:""}

          ${this._batchMode&&this._selectedRepos.length>0?N`
            <div class="batch-bar">
              <span>${xe("batchSelected",{n:this._selectedRepos.length})}</span>
              <button class="batch-bar-btn" @click=${()=>this._batchDo("update")}>${xe("batchUpdate")}</button>
              <button class="batch-bar-btn danger" @click=${()=>this._batchDo("remove")}>${xe("batchRemove")}</button>
              <button class="batch-bar-btn" @click=${()=>{this._selectedRepos=[],this._batchMode=!1}}>${xe("cancel")}</button>
            </div>
          `:""}

          ${0===e.length?N`
            <div class="empty" style="margin-bottom:16px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>${xe("allUpToDate")}</div>
            </div>
          `:"list"===this._viewMode?N`
            <div class="list-view" style="margin-bottom:16px;">${this._renderListTable(e)}</div>
          `:N`
            <div class="grid" style="margin-bottom:16px;">
              ${e.map(e=>{const t=e.id||e.full_name,i=!!this._installingIds?.[t],o=this._changelogs?.[e.full_name],r=!!this._selectedIds[t];return N`
                <div class="card" @click=${t=>{t.target.closest(".action-btn")||t.target.closest("a")||t.target.closest(".checkbox")||t.target.closest(".fav-btn")||this._openDetail(e)}}>
                  <div class="img-container">
                    <div class="top-bar">
                      <input type="checkbox" class="checkbox" .checked=${r}
                             @click=${e=>e.stopPropagation()}
                             @change=${()=>this._toggleSelect(t)}>
                      <span class="badge-corner ${e.category||"integration"}">${xe("cat"+(e.category||"integration").charAt(0).toUpperCase()+(e.category||"integration").slice(1))}</span>
                    </div>
                    <div class="avatar">
                      ${(()=>{const t=[];if(e.domain&&"integration"===e.category&&t.push("https://brands.home-assistant.io/"+e.domain+"/icon.png"),e.full_name){const i=e.full_name.split("/")[0];i&&t.push("https://github.com/"+i+".png")}const i=$e(e.category);return t.length>0?N`
                            <img src="${t[0]}" alt=""
                              @error=${function(){this.style.display="none";const e=this.parentElement?.querySelector(".initials");e&&(e.style.display="flex",e.style.background=i)}}>
                            <span class="initials" style="display:none">${(e.name||e.full_name||"?").charAt(0).toUpperCase()}</span>
                          `:N`<span class="initials" style="display:flex;background:${i}">${(e.name||e.full_name||"?").charAt(0).toUpperCase()}</span>`})()}
                    </div>
                    <span class="status-badge-update">${xe("statusPendingUpgrade")}</span>
                    <button class="fav-btn ${this._favs?.[e.id||e.full_name]?"active":""}"
                      @click=${t=>{t.stopPropagation(),this._toggleFav(e)}}
                      title=${this._favs?.[e.id||e.full_name]?xe("favOn"):xe("favOff")}>
                      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="card-body">
                    <div class="card-name" title="${e.name||e.full_name}">${e.name||e.full_name}</div>
                    <div class="version-row">
                      <div class="version-item">
                        <div class="version-label">${xe("currentVersion")}</div>
                        <div class="version-value old">${e.installed_version||"?"}</div>
                      </div>
                      <div class="version-item">
                        <div class="version-label">${xe("latestVersion")}</div>
                        <div class="version-value new">${e.latest_version||"?"}</div>
                      </div>
                    </div>
                    <div class="card-desc">${e.description||""}</div>
                    ${o?.body?N`
                      <div class="changelog-preview">
                        <div class="changelog-preview-title">${xe("changelogTitle")} ${o.tag?N`<small>(${o.tag})</small>`:""}</div>
                        <div class="changelog-preview-body${this._expandedChangelogs?.[e.full_name]?" expanded":""}">${o.body}</div>
                        <div>
                          <button class="changelog-expand-btn" @click=${()=>this._toggleChangelog(e.full_name)}>${this._expandedChangelogs?.[e.full_name]?xe("changelogShowLess"):xe("changelogShowMore")}</button>
                          <a class="changelog-preview-link" href="${o.url||`https://github.com/${e.full_name}/releases`}" target="_blank" rel="noopener">${xe("viewFullChangelog")} →</a>
                        </div>
                      </div>
                    `:""}
                  <div class="au-toggle-row">
                    <span class="au-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 4v6h6"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                      </svg>
                      ${xe("autoUpdateSection")}
                    </span>
                    <label class="au-toggle" @click=${e=>e.stopPropagation()}>
                      <input type="checkbox" .checked=${this._isAutoUpdate(e)}
                        @change=${()=>this._handleAutoUpdateToggle(e)}>
                      <span class="slider"></span>
                    </label>
                  </div>
                  </div>
                  <div class="actions">
                    ${e.pending_restart?N`
                      <button class="action-btn primary" @click=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("restart-ha",{bubbles:!0,composed:!0}))}}
                        style="flex:1;background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                        ${xe("pendingRestart")}
                      </button>
                    `:N`
                    ${i?N`
                      <div class="card-install-progress" @click=${e=>e.stopPropagation()}>
                        <div class="card-install-progress-track">
                          <div class="card-install-progress-fill" style="width:${this._installingIds[t]?.percentage||0}%"></div>
                        </div>
                        <span class="card-install-progress-label">${this._installingIds[t]?.percentage||0}%</span>
                      </div>
                      <button class="action-btn" @click=${()=>this._skipVersion(e)}
                        style="color:var(--secondary-text-color);font-size:12px;min-width:auto;padding:8px 10px;" ?disabled=${!0}>
                        🔕 ${xe("ignoreVersion")}
                      </button>
                    `:N`
                    <button class="action-btn primary"
                      @click=${()=>this._updateOne(e)} ?disabled=${i||this.updating}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${xe("updateNow")}
                    </button>
                    <button class="action-btn" @click=${()=>this._skipVersion(e)}
                      style="color:var(--secondary-text-color);font-size:12px;min-width:auto;padding:8px 10px;">
                      🔕 ${xe("ignoreVersion")}
                    </button>
                    `}
                    `}
                  </div>
                </div>
              `})}
            </div>
          `}

        `:""}


        <div class="section-header" @click=${()=>{this._showUpdated=!this._showUpdated,this.requestUpdate()}}
             style="margin-bottom:${this._showUpdated?"6px":"16px"};">
          <span class="section-header-icon ${this._showUpdated?"expanded":""}">▶</span>
          <span class="section-header-label">${xe("sectionUpdated")}</span>
          <span class="section-header-count updated-count">${this._history.length}</span>
        </div>

        ${this._showUpdated?N`
          ${0===this._history.length?N`
            <div class="empty" style="margin-bottom:16px;">${xe("noUpdateHistory")}</div>
          `:N`
            <div class="history-grid" style="margin-bottom:16px;">
              ${this._history.map(e=>{const t=(e.full_name||"?").charAt(0).toUpperCase();return N`
                  <div class="history-card" @click=${()=>{e.full_name&&this._openDetail({full_name:e.full_name})}}>
                    <div class="history-avatar">${t}</div>
                    <div class="history-body">
                      <div class="history-name">${e.full_name||"?"}</div>
                      <div class="history-meta">
                        <span class="history-arrow">${xe("updatedFromTo",{from:e.from_version||"?",to:e.to_version||"?"})}</span>
                      </div>
                    </div>
                    <div class="history-time">${this._timeAgo(e.updated_at)}</div>
                  </div>
                `})}
            </div>
          `}
        `:""}


        ${this._skippedVersions&&this._skippedVersions.length>0?N`
          <div class="section-header" @click=${()=>{this._showSkipped=!this._showSkipped,this.requestUpdate()}}
               style="margin-bottom:${this._showSkipped?"6px":"0"};">
            <span class="section-header-icon ${this._showSkipped?"expanded":""}">▶</span>
            <span class="section-header-label">${xe("sectionSkipped")}</span>
            <span class="section-header-count skipped-count">${this._skippedVersions.length}</span>
          </div>

          ${this._showSkipped?N`
            <div class="grid" style="margin-bottom:16px;">
              ${this._skippedVersions.map(e=>N`
                <div class="card" style="opacity:0.75;">
                  <div class="img-container">
                    <div class="avatar" style="background:#9e9e9e;display:flex;align-items:center;justify-content:center;">
                      <span class="initials">${(e.full_name||"?").charAt(0).toUpperCase()}</span>
                    </div>
                    <span class="status-badge-update" style="background:rgba(158,158,158,0.85)">${xe("skippedBadge")}</span>
                  </div>
                  <div class="card-body">
                    <div class="card-name">${e.full_name||"?"}</div>
                    <div class="version-row">
                      <div class="version-item">
                        <div class="version-label">${xe("currentVersion")}</div>
                        <div class="version-value old">${e.installed_version||"?"}</div>
                      </div>
                      <div class="version-item">
                        <div class="version-label">${xe("skippedVersionTitle")}</div>
                        <div class="version-value" style="color:#9e9e9e;text-decoration:line-through;">${e.skipped_version||"?"}</div>
                      </div>
                    </div>
                  </div>
                  <div class="actions" style="justify-content:flex-end;">
                    <button class="action-btn" @click=${()=>this._unskipVersion(e)}
                      style="color:var(--primary-color);border-color:var(--primary-color);padding:8px 16px;">
                      ${xe("unskipBtn")}
                    </button>
                  </div>
                </div>
              `)}
            </div>
          `:""}
        `:""}
      `}
    `}}customElements.define("updates-view",ii);const oi="hacs_vision_mgmt_state";function ri(e){try{localStorage.setItem(oi,JSON.stringify(e))}catch{}}class si extends ae{static properties={customRepos:{type:Array},archivedRepos:{type:Array},ignoredRepos:{type:Array},renamedEntries:{type:Array},loading:{type:Boolean},erLoading:{type:Boolean},iLoading:{type:Boolean},importing:{type:Boolean},exporting:{type:Boolean},_viewMode:{type:String},_collapsed:{type:Object},_renamedRefreshing:{type:Boolean},_customRepoSearch:{type:String},_customRepofilter:{type:String},_customRepoSort:{type:String},_statusFilter:{type:String},_typeFilter:{type:String},_selectedRepos:{type:Array,state:!0},_favorites:{type:Array,state:!0},_tagFilters:{type:Array,state:!0},_orgUrl:{type:String},_orgRepos:{type:Array,state:!0},_orgLoading:{type:Boolean,state:!0},_orgFilter:{type:String,state:!0},_selectedOrgRepos:{type:Object,state:!0},_filterExpanded:{type:Boolean,state:!0},_orgSyncResult:{type:String,state:!0},_orgSyncing:{type:Boolean,state:!0},langVersion:{type:Number}};constructor(){super();const e=function(){try{return JSON.parse(localStorage.getItem(oi)||"{}")}catch{return{}}}();this.customRepos=[],this.archivedRepos=[],this.ignoredRepos=[],this.renamedEntries=[],this.loading=!1,this.exporting=!1,this.importing=!1,this._renamedRefreshing=!1,this._addFromSearchCategory="integration",this._addFromSearchInstalling=!1,this._viewMode="card",this._customRepoSearch="",this._customRepofilter=e.customRepofilter||"all",this._customRepoSort=e.customRepoSort||"name",this._statusFilter=e.statusFilter||"",this._typeFilter=e.typeFilter||"",this._selectedRepos=[],this._favorites=[],this._tagFilters=[],this._collapsed={customRepos:!1,archived:!1,ignored:!1,tools:!1},this._orgRepos=[],this._orgLoading=!1,this._orgFilter="",this._selectedOrgRepos={},this._orgSyncResult="",this._orgSyncFailed=!1,this._orgSyncing=!1,this._filterExpanded=!1}static styles=[Se(),s`
    :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

    /* ===== Section Base ===== */
    .section {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; padding: 20px; margin-bottom: 16px;
    }
    .section-title {
      font-size: 15px; font-weight: 700; color: var(--primary-text-color);
      display: flex; align-items: center; gap: 8px; flex: 1;
    }
    .section-title svg { width: 20px; height: 20px; color: var(--primary-color); flex-shrink: 0; }
    .section-desc { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 16px; line-height: 1.6; }

    /* ===== Search (uses shared styles from styles.js) ===== */
    .search { position: relative; }
    .edit-input {
      padding: 8px 12px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; transition: border-color 0.2s;
      box-sizing: border-box; font-family: inherit;
    }
    .edit-input:focus { border-color: var(--primary-color); }

    /* ===== Collapsible ===== */
    .section-header {
      display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
      cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
    }
    .section-header .arrow {
      width: 18px; height: 18px; transition: transform 0.25s; flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .section-header .arrow.open { transform: rotate(0deg); }
    .section-header .arrow.closed { transform: rotate(-90deg); }
    .section-content { overflow: hidden; }
    .section-content.collapsed { display: none; }

    /* ===== View Toggle (aligned with browse) ===== */
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle button {
      padding: 6px 10px; border: none; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation; font-family: inherit;
    }
    .view-toggle button + button { border-left: 1px solid var(--divider-color); }
    .view-toggle button.active {
      background: var(--primary-color); color: #fff;
      box-shadow: none;
    }
    .view-toggle button:hover:not(.active) { color: var(--primary-color); }

    /* ===== List View (enhanced) ===== */
    .repo-list { display: flex; flex-direction: column; gap: 8px; }
    .repo-item {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 12px 14px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; transition: all 0.2s; gap: 12px;
      cursor: pointer;
    }
    .repo-item:hover { border-color: var(--primary-color); }
    .col-icon { flex-shrink: 0; }
    .icon-cell {
      width: 32px; height: 32px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 14px; font-weight: 700;
      overflow: hidden;
    }
    .repo-info { flex: 1; min-width: 0; }
    .repo-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
    .repo-name { color: var(--primary-text-color); font-weight: 600; font-size: 14px; }
    .repo-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: var(--secondary-text-color); margin-bottom: 4px; }
    .repo-fullname { color: var(--secondary-text-color); }
    .repo-version { color: var(--text-primary-color); }
    .repo-not-installed { color: var(--secondary-text-color); font-style: italic; font-size: 10px; }
    .update-badge { color: #f44336; font-weight: 600; }
    .repo-stars { color: #f9a825; }
    .repo-desc { font-size: 12px; color: var(--secondary-text-color); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 2px; }
    .topic-chips { display: flex; gap: 4px; flex-wrap: wrap; }
    .topic-chip {
      font-size: 9px; padding: 1px 6px; border-radius: 4px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color); border: 1px solid var(--divider-color);
    }
    .repo-actions { display: flex; gap: 4px; flex-shrink: 0; align-items: center; flex-wrap: wrap; }

    .category-badge {
      display: inline-block; padding: 1px 8px; border-radius: 4px;
      font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
    }
    .category-badge.integration { background: #e3f2fd; color: #1565c0; }
    .category-badge.plugin { background: #f3e5f5; color: #7b1fa2; }
    .category-badge.theme { background: #e8f5e9; color: #2e7d32; }
    .category-badge.python_script { background: #fff8e1; color: #f9a825; }
    .category-badge.template { background: #f3e5f5; color: #6a1b9a; }
    .category-badge.appdaemon { background: #fbe9e7; color: #e65100; }
    .category-badge.netdaemon { background: #e0f7fa; color: #00838f; }
    .category-badge.dashboard { background: #fff8e1; color: #f57f17; }

    .renamed-badge {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;
      background: #fff3e0; color: #e65100; letter-spacing: 0.3px;
    }
    .custom-badge-tag { font-size: 10px; padding: 1px 6px; border-radius: 4px; background: #ff6f00; color: #fff; font-weight: 700; display: inline-flex; align-items: center; }

    .refresh-btn {
      padding: 8px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.25s; width: 36px; height: 36px;
      touch-action: manipulation; flex-shrink: 0;
    }
    .refresh-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .refresh-btn svg { width: 16px; height: 16px; }

    /* ===== Filter Chips (aligned with browse) ===== */
    .filter-group { margin-bottom: 10px; }
    .filter-label { font-size: 11px; font-weight: 600; color: var(--secondary-text-color); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; overflow-x: auto; scrollbar-width: none; }
    .filter-chips::-webkit-scrollbar { display: none; }
    .filter-chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 12px; border-radius: 18px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color); color: var(--secondary-text-color, #727272);
      font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
      touch-action: manipulation; user-select: none;
    }
    .filter-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .filter-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .filter-chip .chip-count { font-size: 10px; opacity: 0.7; margin-left: 3px; }

    /* ===== Controls (aligned with browse) ===== */
    .controls-right { flex-shrink: 0; }
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color,#fff);
      color: var(--secondary-text-color,#727272);
      cursor: pointer; font-size: 14px; transition: all 0.2s;
      min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }

    .sort-bar { display: flex; align-items: center; margin-bottom: 10px; padding: 6px 14px; background: var(--secondary-background-color,#f0f0f0); border-radius: 8px; flex-wrap: wrap; gap: 4px; }
    .sort-chips { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .sort-chip {
      padding: 4px 10px; border: 1px solid var(--divider-color); border-radius: 14px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 11px; transition: all 0.2s; white-space: nowrap;
      touch-action: manipulation;
    }
    .sort-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .sort-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .sort-chip .sort-dir { font-size: 9px; margin-left: 2px; }

    .fs-actions { display: none; }

    .filter-toggle-sm {
      display: none; width: 36px; height: 36px; flex-shrink: 0;
      border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; align-items: center; justify-content: center; padding: 0;
      touch-action: manipulation;
    }
    .filter-toggle-sm:hover { border-color: var(--primary-color); color: var(--primary-color); }

    /* ===== Filter-Sort Row (compact, aligned with store) ===== */
    .filter-sort-row {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 10px; padding: 8px 12px;
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 10px; flex-wrap: wrap;
    }
    .filter-sort-row .fs-chips {
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap; flex: 1; min-width: 0;
    }
    .filter-sort-row .fs-divider {
      display: inline-block; width: 1px; height: 22px;
      background: var(--divider-color, #e0e0e0); margin: 0 10px; flex-shrink: 0;
    }
    .sort-inline { opacity: 0.85; }
    .sort-inline.active { opacity: 1; }
    .sort-inline .sort-dir { font-size: 9px; margin-left: 2px; }
    .fs-label {
      font-size: 11px; font-weight: 700; color: var(--primary-color, #03a9f4);
      text-transform: uppercase; letter-spacing: 0.5px; padding: 0 4px;
      user-select: none; flex-shrink: 0;
    }
    .add-repo-form {
      background: var(--card-background-color,#fff); border: 1px solid var(--divider-color,#e0e0e0);
      border-radius: 14px; padding: 16px; margin-bottom: 14px;
    }
    .form-input, .form-select {
      padding: 10px 12px; border: 1px solid var(--divider-color,#e0e0e0); border-radius: 10px;
      background: var(--card-background-color,#fff); color: var(--primary-text-color,#212121);
      font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.2s;
    }
    .form-input:focus, .form-select:focus { border-color: var(--primary-color); }

    @media (max-width: 768px) {
      .filter-chips { flex-wrap: wrap; gap: 3px; }
      .filter-chip { padding: 4px 8px; font-size: 11px; }
      .controls-right { flex-wrap: wrap; }
      .form-input, .form-select { width: 100%; }
    }

    .section-badge {
      display: inline-flex; align-items: center; padding: 2px 10px;
      border-radius: 10px; font-size: 11px; font-weight: 500;
      background: var(--primary-color); color: #fff;
    }

    /* ===== Card View ===== */
    .repo-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }
    .repo-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer;
      display: flex; flex-direction: column; position: relative;
    }
    .repo-card:hover { border-color: var(--primary-color, #03a9f4); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .repo-card-img {
      height: 100px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .repo-card-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
    }
    .repo-card-badge-cat {
      position: absolute; top: 10px; left: 10px;
      padding: 3px 8px; border-radius: 6px;
      font-size: 10px; font-weight: 600; color: #fff; text-transform: uppercase;
    }
    .repo-card-custom {
      position: absolute; top: 10px; left: 50%;
      transform: translateX(-50%);
      padding: 3px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 700; color: #fff; text-transform: uppercase;
      background: #ff6f00; box-shadow: 0 2px 6px rgba(255,111,0,0.4);
    }
    .repo-card-actions-img {
      position: absolute; top: 10px; right: 10px; z-index: 2;
    }
    .repo-card-actions-img .btn-icon {
      width: 30px; height: 30px;
      background: rgba(255,255,255,0.85); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.12);
      padding: 0; color: var(--secondary-text-color);
      transition: all 0.2s;
    }
    .repo-card-actions-img .btn-icon:hover { color: #f44336; }
    .repo-card-installed {
      position: absolute; bottom: 10px; left: 10px;
      padding: 2px 8px; border-radius: 6px;
      font-size: 10px; font-weight: 600;
      background: rgba(76,175,80,0.15); color: #4caf50;
    }
    .repo-card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; }
    .repo-card-body .name {
      font-size: 14px; font-weight: 600; color: var(--primary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px;
    }
    .repo-card-body .fullname {
      font-size: 11px; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;
    }
    .repo-card-body .desc {
      font-size: 12px; color: var(--secondary-text-color);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden; margin-bottom: 8px; line-height: 1.5; height: 36px;
    }
    .repo-card-body .meta {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 4px; margin-top: auto;
    }
    .repo-card-body .meta .stars {
      display: flex; align-items: center; gap: 3px;
      font-size: 11px; color: var(--secondary-text-color);
    }
    .repo-card-renamed {
      position: absolute; top: 10px; right: 48px; z-index: 2;
      padding: 3px 8px; border-radius: 6px; font-size: 9px; font-weight: 600;
      background: #fff3e0; color: #e65100;
    }

    /* ===== Buttons ===== */
    .btn {
      padding: 8px 14px; border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--primary-text-color);
      cursor: pointer; font-size: 12px; transition: all 0.2s;
      touch-action: manipulation; display: inline-flex; align-items: center; gap: 8px; font-family: inherit;
    }
    .btn.sm { padding: 4px 10px; font-size: 11px; }
    .btn-icon {
      width: 32px; height: 32px; padding: 0; display: inline-flex;
      align-items: center; justify-content: center; border-radius: 8px;
      border: 1px solid var(--divider-color); cursor: pointer;
      color: var(--primary-text-color); transition: all 0.2s; text-decoration: none;
    }
    .btn-icon:hover { border-color: var(--primary-color); color: var(--primary-color); }

    .edit-input {
      padding: 6px 10px; border: 1px solid var(--primary-color); border-radius: 6px;
      font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; flex: 1; min-width: 0; font-family: inherit;
    }
    .edit-input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color), 0.15); }

    .btn-group { display: flex; gap: 4px; flex-shrink: 0; align-items: center; }
    .btn-group-wide { display: flex; gap: 12px; flex-wrap: wrap; }

    .empty { font-size: 13px; color: var(--secondary-text-color); padding: 32px 0; text-align: center; }

    /* ===== Add Form ===== */
    .add-form {
      padding: 14px; border: 1px dashed var(--primary-color);
      border-radius: 10px; background: rgba(var(--rgb-primary-color, 0, 123, 255), 0.04);
      margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px;
    }
    .add-form-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .add-form-controls select { flex: 0 0 auto; max-width: 160px; }
    .add-preview { font-size: 12px; color: var(--secondary-text-color); padding: 4px 2px; }
    .add-error { color: #f44336; }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Batch Bar (aligned with browse) ===== */
    .batch-bar {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 8px 12px; margin: 6px 0;
      background: var(--primary-color, #03a9f4); color: #fff;
      border-radius: 8px; font-size: 13px; font-weight: 600;
    }
    .batch-bar-btn {
      padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;
      background: rgba(255,255,255,0.2); color: #fff;
      border: 1px solid rgba(255,255,255,0.4); cursor: pointer;
    }
    .batch-bar-btn:hover { background: rgba(255,255,255,0.35); }

    /* ===== Mobile ===== */
    @media (max-width: 768px) {
      .section { padding: 14px; border-radius: 12px; }
      .controls { flex-wrap: nowrap; gap: 4px; margin-bottom: 0; }
      .search { flex: 1; min-width: 0; height: 36px; box-sizing: border-box; border: 1px solid var(--divider-color); border-radius: 10px; }
      .search input { width: 100%; padding: 7px 10px 7px 30px; font-size: 13px; border: none; background: transparent; height: 100%; }
      .search-icon { left: 10px; }
      .controls-right { flex-shrink: 0; }
      .sel-all-label { font-size: 0; }
      .desktop-only { display: none; }
      .filter-sort-row { padding: 6px 10px; flex-wrap: nowrap; overflow: hidden; }
      .filter-sort-row .fs-chips { display: none; }
      .filter-sort-row.expanded .fs-chips { display: flex; }
      .filter-sort-row.expanded { flex-wrap: wrap; }
      .filter-sort-row .fs-actions { display: none; }
      .filter-sort-row.expanded .fs-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; }
      .filter-toggle-sm { display: flex; }
      .btn { min-height: 44px; }
      .btn.sm { min-height: 36px; }
      .btn-group-wide { flex-direction: column; gap: 8px; }
      .btn-group-wide .btn { width: 100%; justify-content: center; }
      .repo-item { flex-direction: column; gap: 8px; padding: 10px 12px; }
      .repo-actions { width: 100%; justify-content: flex-end; }
      .repo-name { font-size: 13px; }
      .repo-meta { font-size: 10px; }
      .repo-desc { font-size: 11px; }
      .repo-cards { grid-template-columns: 1fr; }
      .repo-card-img { height: 80px; }
      .repo-card-avatar { width: 36px; height: 36px; font-size: 16px; }
      .add-form { padding: 10px; }
      .add-form-controls { flex-direction: column; align-items: stretch; }
      .add-form-controls select { max-width: 100%; }
      .add-form-controls .btn { width: 100%; justify-content: center; }
      .section-badge { font-size: 10px; padding: 1px 8px; }
      .category-badge { font-size: 9px; padding: 1px 6px; }
      .form-row { flex-direction: column; }
      .form-input, .form-select { width: 100%; }
      .form-actions { flex-direction: column; }
      .form-actions .btn { width: 100%; min-height: 44px; justify-content: center; }
    }
  `];async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){this.loading=!0;try{const e=await de.getConfig()||{};this.archivedRepos=e.archived_repositories||[],this.ignoredRepos=e.ignored_repositories||[],this.renamedEntries=Object.entries(e.renamed_repositories||{});const t=await de.getCustomRepos();this.customRepos=Array.isArray(t)?t:t.custom_repositories||[];try{const e=await de.getFavorites();this._favorites=Array.isArray(e)?e:e.favorites||[]}catch{this._favorites=[]}}catch(e){console.error("Config load error",e)}this.loading=!1}async _removeArchivedRepo(e){if(await Jt.show(this,{message:xe("confirmRemoveArchived",{repo:e}),confirmText:xe("removeArchived"),danger:!0}))try{await de.removeArchivedRepo(e),this._load()}catch(e){Ce(`${xe("removeRepoFailed")}: ${e.message}`,"error")}}async _removeRenamedRepo(e){if(await Jt.show(this,{message:xe("confirmRemoveRenamed",{old:e}),confirmText:xe("removeRenamed"),danger:!0}))try{await de.removeRenamedRepo(e),this._load()}catch(e){Ce(`${xe("removeRepoFailed")}: ${e.message}`,"error")}}async _replaceRenamedOneClick(e,t){if(await Jt.show(this,{message:xe("confirmReplaceRenamed",{old:e,new:t}),confirmText:xe("replace"),danger:!0})){this._renamedRefreshing=!0;try{await de.replaceRenamedRepo(e,t),Ce(`${xe("replace")}: ${e} → ${t}`,"success"),await de.refresh(),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("updateFailed")}: ${e.message}`,"error")}this._renamedRefreshing=!1}}async _export(){this.exporting=!0;try{const e=await de.exportBackup(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`hacs-vision-backup-${(new Date).toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i),Ce(xe("exportSuccess"),"success")}catch(e){Ce(`${xe("exportFailed")}: ${e.message}`,"error")}this.exporting=!1}async _import(){const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=async()=>{const t=e.files[0];if(t){this.importing=!0;try{const e=await t.text(),i=JSON.parse(e);await de.importBackup(i),Ce(xe("importSuccess"),"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("importFailed")}: ${e.message}`,"error")}this.importing=!1}},e.click()}async _quickAddFromSearch(){let e=this._parseRepoUrl(this._customRepoSearch);if(!e&&this._customRepoSearch){const t=this.customRepos.find(e=>(e.full_name||e.repository||"").toLowerCase().includes(this._customRepoSearch.toLowerCase()));e=t?t.full_name||t.repository:this._customRepoSearch.trim()}if(!e||!e.includes("/"))return void Ce(xe("invalidRepoUrl"),"error");const t=this.customRepos.some(t=>(t.full_name||t.repository)===e);if(t)Ce(`${e} ${xe("alreadyExists")}`,"error");else{this._addFromSearchInstalling=!0;try{const t=await de.addCustomRepo(e,this._addFromSearchCategory);t.success?(Ce(`${xe("addSuccess")}: ${e}`,"success"),this._customRepoSearch="",this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))):Ce(`${xe("addFailed")}: ${t.error}`,"error")}catch(e){Ce(`${xe("addFailed")}: ${e.message}`,"error")}this._addFromSearchInstalling=!1}}get _mgmtOrgFilteredCount(){return this._getFilteredSortedOrgRepos().length}_parseRepoUrl(e){const t=(e=e.trim()).match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return t?t[1].replace(/\.git$/,""):/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(e)?e:null}_isRepoUrl(e){return e?.includes("/")}async _restartHA(){try{Ce(xe("restarting"),"info"),await de.restartHA()}catch(e){Ce(`${xe("restartFailed")}: ${e.message}`,"error")}}async _loadMgmtOrgRepos(){const e=this._customRepoSearch?.trim();if(!(!e||this._isRepoUrl(e)||e.length<3)){this._orgLoading=!0,this._orgRepos=[],this._selectedOrgRepos={},this._orgSyncResult="";try{const t=await de.listOrgRepos(e);t?.repos&&(this._orgRepos=t.repos)}catch(e){if(404===e.status)return;Ce(`${xe("loadFailedSimple")}: ${e.message}`,"error")}this._orgLoading=!1}}_toggleSelectMgmtOrg(e){if(this._selectedOrgRepos[e]){const t={...this._selectedOrgRepos};delete t[e],this._selectedOrgRepos=t}else this._selectedOrgRepos={...this._selectedOrgRepos,[e]:!0}}_toggleSelectAllMgmtOrg(e){const t=this._orgRepos.filter(e=>!this._orgFilter||e.full_name.toLowerCase().includes(this._orgFilter.toLowerCase()));if(e){const e={};t.forEach(t=>e[t.full_name]=!0),this._selectedOrgRepos=e}else this._selectedOrgRepos={}}async _syncSelectedMgmtOrg(){if(0!==Object.keys(this._selectedOrgRepos).length){this._orgSyncing=!0,this._orgSyncResult="";try{const e=this._orgRepos.filter(e=>this._selectedOrgRepos[e.full_name]).map(e=>({full_name:e.full_name,category:e.category||"integration"}));if(0===e.length)return this._orgSyncResult=xe("noSelectedRepos"),this._orgSyncFailed=!1,void(this._orgSyncing=!1);const t=await de.syncStarred(e),i=t?.results||[],o=i.filter(e=>e.success).length,r=i.filter(e=>!e.success).length,s=r?xe("failPartSuffix",{fail:r}):"";this._orgSyncResult=xe("syncDoneResult",{ok:o,failPart:s}),Ce(`${xe("addedToCustomList")} (${o})`,r?"warning":"success"),o>0&&(this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})))}catch(e){this._orgSyncResult=`${xe("addFailed")}: ${e.message}`,this._orgSyncFailed=!0,Ce(`${xe("addFailed")}: ${e.message}`,"error")}this._orgSyncing=!1}}async _removeCustomRepo(e,t){if(await Jt.show(this,{message:xe("confirmRemoveRepo",{repo:e}),confirmText:xe("removeRepo"),danger:!0}))try{const t=await de.removeCustomRepo(e);t&&!1===t.success&&Ce(`${xe("removeRepoFailed")}: ${t.error}`,"error"),this._selectedRepos=this._selectedRepos.filter(t=>t!==e),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Ce(`${xe("removeRepoFailed")}: ${e.message}`,"error")}}_toggleSelectRepo(e){this._selectedRepos.includes(e)?this._selectedRepos=this._selectedRepos.filter(t=>t!==e):this._selectedRepos=[...this._selectedRepos,e]}async _batchRemove(){const e=this._selectedRepos.length;if(await Jt.show(this,{message:`${xe("batchRemoveRepoConfirm")} ${e} ${xe("totalRepos")}?`,confirmText:xe("removeRepo"),danger:!0})){for(const e of[...this._selectedRepos])try{await de.removeCustomRepo(e)}catch(t){Ce(`${xe("removeRepoFailed")}: ${e} - ${t.message}`,"error")}this._selectedRepos=[],this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}}_toggleSection(e){this._collapsed={...this._collapsed,[e]:!this._collapsed[e]}}_setViewMode(e){this._viewMode=e}_openCardDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}_getRepoStatus(e){return e.pending_restart?"pending_restart":e.installed&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version)?"update_available":e.installed?"installed":"not_installed"}_getFilteredCustomRepos(){let e=[...this.customRepos];const t=(this._customRepoSearch||"").toLowerCase();if(t){let i=null;const o=t.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);o&&(i=o[1].replace(/\.git$/,"").toLowerCase());const r=/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(t);e=e.filter(e=>{const o=(e.full_name||"").toLowerCase(),s=(e.manifest_name||e.name||"").toLowerCase(),a=(e.description||"").toLowerCase(),n=(e.authors||[]).join(",").toLowerCase();return!!(s.includes(t)||a.includes(t)||n.includes(t))||(!!o.includes(t)||(!(!i||!o.includes(i))||!(!r||!o.includes(t))))})}const i=this._statusFilter||"";i&&(e=e.filter(e=>this._getRepoStatus(e)===i));const o=this._typeFilter||"";o&&(e=e.filter(e=>(e.category||"")===o)),this._tagFilters.includes("favorites")&&(e=e.filter(e=>this._favorites.includes(e.id||e.full_name)));const r=this._customRepoSort||"name";return"stars"===r?e.sort((e,t)=>(t.stargazers_count||0)-(e.stargazers_count||0)):"updated"===r?e.sort((e,t)=>(t.last_updated||"").localeCompare(e.last_updated||"")):e.sort((e,t)=>(e.manifest_name||e.name||e.full_name||"").localeCompare(t.manifest_name||t.name||t.full_name||"")),e}_getStatusCounts(){const e={installed:0,update_available:0,not_installed:0,pending_restart:0};for(const t of this.customRepos){const i=this._getRepoStatus(t);void 0!==e[i]&&e[i]++}return e}_getTypeCounts(){const e={};for(const t of this.customRepos){const i=t.category||"other";e[i]=(e[i]||0)+1}return e}_renderFilteredContent(e,t,i,o){const r=this._customRepofilter||"all";return"archived"===r?t.length>0?N`
        <div class="repo-cards">${t.map(e=>N`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#6a1b9a20,#7b1fa220);">
              <div class="repo-card-avatar" style="background:#7b1fa2;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:13px;font-weight:600;">${e}</div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${xe("archivedRepos")}</span>
              </div>
            </div>
            <div class="actions" style="display:flex;gap:6px;padding:8px 14px;border-top:1px solid var(--divider-color,#e0e0e0);">
              <a class="action-btn" href="https://github.com/${e}" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;font-size:12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                ${xe("viewOnGithub")}
              </a>
              <button class="action-btn" @click=${()=>this._removeArchivedRepo(e)} style="color:#f44336;border-color:#f44336;flex:1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                ${xe("removeArchived")}
              </button>
            </div>
          </div>
        `)}</div>
      `:N`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div>${xe("noArchived")}</div></div>`:"ignored"===r?i.length>0?N`
        <div class="repo-cards">${i.map(e=>N`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#e0e0e0,#f5f5f5);">
              <div class="repo-card-avatar" style="background:#9e9e9e;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:13px;font-weight:600;">${e}</div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${xe("ignoredRepos")}</span>
              </div>
            </div>
          </div>
        `)}</div>
      `:N`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg><div>${xe("noIgnored")}</div></div>`:"renamed"===r?o.length>0?N`
        <div class="repo-cards">${o.map(([e,t])=>N`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#ff8f0020,#ff980020);">
              <div class="repo-card-avatar" style="background:#ff9800;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:12px;color:var(--secondary-text-color);text-decoration:line-through;">${e}</div>
              <div style="display:flex;align-items:center;gap:4px;margin:2px 0;">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                <span class="name" style="font-size:13px;font-weight:600;color:var(--primary-color);">${t}</span>
              </div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${xe("renamedRepos")}</span>
              </div>
            </div>
            <div class="actions" style="display:flex;gap:6px;padding:8px 14px;border-top:1px solid var(--divider-color,#e0e0e0);">
              <button class="action-btn primary" @click=${()=>this._replaceRenamedOneClick(e,t)} ?disabled=${this._renamedRefreshing} style="flex:1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                ${xe("replace")}
              </button>
              <button class="action-btn" @click=${()=>this._removeRenamedRepo(e)} style="color:#f44336;border-color:#f44336;flex:0 0 auto;padding:8px 10px;" title="${xe("removeRenamed")}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `)}</div>
      `:N`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg><div>${xe("noRenamed")}</div></div>`:0===e.length?N`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div>${xe("noCustomRepos")}</div></div>`:"card"===this._viewMode?N`<div class="repo-cards">${this._getFilteredCustomRepos().map(e=>{const t=o.find(([t,i])=>i===(e.full_name||e.repository));return N`
          <repo-card .repo=${e} viewMode="management"
            .renamedFrom=${t?t[0]:void 0}
            showRemoveBtn=true
            .showCheckbox=${!0}
            .selected=${this._selectedRepos.includes(e.full_name||e.repository)}
            @detail=${e=>this._openCardDetail(e.detail.repo)}
            @remove-repo=${e=>this._removeCustomRepo(e.detail.repo?.full_name||e.detail.repo?.repository,e.detail.repo?.category)}
            @check-change=${e=>{const t=e.detail.fullName;t&&this._toggleSelectRepo(t)}}
            @restart-ha=${()=>this._restartHA()}>
          </repo-card>`})}</div>`:N`<div class="repo-list">${this._getFilteredCustomRepos().map(e=>this._renderListItem(e,o))}</div>`}_getInitials(e){if(!e)return"?";const t=e.split("/");return(t[t.length-1]||e).charAt(0).toUpperCase()}_getCategoryColor(e){return $e(e)}_getFilteredSortedOrgRepos(){const e=(this._orgFilter||"").trim().toLowerCase();return e?this._orgRepos.filter(t=>t.full_name.toLowerCase().includes(e)).sort((t,i)=>{const o=t.full_name.toLowerCase(),r=i.full_name.toLowerCase();return o===e&&r!==e?-1:r===e&&o!==e?1:o.startsWith(e)&&!r.startsWith(e)?-1:r.startsWith(e)&&!o.startsWith(e)?1:o.length-r.length}):this._orgRepos}_getCategoryLabel(e){return{integration:xe("catIntegration"),plugin:xe("catPlugin"),theme:xe("catTheme"),appdaemon:xe("catAppDaemon"),netdaemon:xe("catNetDaemon"),python_script:xe("catPythonScript"),template:xe("catTemplate"),dashboard:xe("catDashboard")}[e]||e}_renderCard(e,t){const i=e.full_name||e.repository,o=e.manifest_name||e.name||i,r=t.find(([e,t])=>t===i),s=!!r,a=s?r[0]:null,n=e.installed_version||"",l=e.latest_version||"",d=e.has_update,c=e.stargazers_count||0,p=e.description||"",h=e.installed||!1,g=this._getCategoryColor(e.category);return N`
      <div class="repo-card" @click=${()=>this._openCardDetail(e)}>
        <div class="repo-card-img" style="background:linear-gradient(135deg, ${g}44 0%, ${g}22 100%);">
          <div class="repo-card-avatar" style="background:${g}">
            ${e.domain&&"integration"===e.category?N`
              <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
              <span style="display:none">${this._getInitials(o)}</span>
            `:this._getInitials(o)}
          </div>
          <span class="repo-card-badge-cat" style="background:${g}">
            ${this._getCategoryLabel(e.category)}
          </span>
          ${e.is_custom?N`<span class="repo-card-custom">${xe("customBadge")}</span>`:""}
          ${s?N`<span class="repo-card-renamed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${a}</span>`:""}
          ${h?N`<span class="repo-card-installed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${xe("installed")}</span>`:""}
          <div class="repo-card-actions-img">
            <button class="btn-icon" @click=${t=>{t.stopPropagation(),this._removeCustomRepo(i,e.category)}} title="${xe("removeRepo")}">
              ✕
            </button>
          </div>
        </div>
        <div class="repo-card-body">
          <div class="name" title=${o}>${o}</div>
          <div class="fullname">${i}</div>
          <div class="desc">${p||xe("noDesc")}</div>
          ${e.topics&&e.topics.length?N`
            <div class="topic-chips" style="margin-top:6px;">
              ${e.topics.slice(0,3).map(e=>N`<span class="topic-chip">${e}</span>`)}
            </div>
          `:""}
          <div class="meta">
            <span class="stars">
              <svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${c>0?"number"==typeof c?c.toLocaleString():c:0}
            </span>
            ${h?N`
              <span style="font-size:10px;color:var(--secondary-text-color);">
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${n}${d?N` <span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${l}</span>`:""}
              </span>
            `:N`<span class="repo-not-installed">${xe("notInstalled")}</span>`}
          </div>
        </div>
      </div>
    `}_renderListItem(e,t){const i=e.full_name||e.repository,o=e.manifest_name||e.name||i,r=t.find(([e,t])=>t===i),s=!!r,a=s?r[0]:null,n=e.installed_version||"",l=e.latest_version||"",d=e.has_update,c=e.stargazers_count||0,p=e.description||"";return N`
      <div class="repo-item" @click=${()=>this._openCardDetail(e)}>
        <div class="col-icon">
          <div class="icon-cell" style="background:${this._getCategoryColor(e.category)}">
            ${e.domain&&"integration"===e.category?N`
                <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
                <span style="display:none">${o.charAt(0).toUpperCase()}</span>
              `:o.charAt(0).toUpperCase()}
          </div>
        </div>
        <div class="repo-info">
          <div class="repo-top">
            <span class="repo-name">${o}</span>
            <span class="category-badge ${e.category}">${this._getCategoryLabel(e.category)}</span>
            ${e.is_custom?N`<span class="custom-badge-tag">${xe("customBadge")}</span>`:""}
            ${s?N`<span class="renamed-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${a}</span>`:""}
          </div>
          <div class="repo-meta">
            <span class="repo-fullname">${i}</span>
            <span class="stars" style="color:#f9a825;"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${c>0?"number"==typeof c?c.toLocaleString():c:0}</span>
            ${e.installed?N`
              <span class="repo-version"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${n}</span>
              ${d?N`<span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${l}</span>`:""}
            `:N`<span class="repo-not-installed">${xe("notInstalled")}</span>`}
          </div>
          ${p?N`<div class="repo-desc">${p}</div>`:""}
          ${e.topics&&e.topics.length?N`
            <div class="topic-chips" style="margin-top:4px;">
              ${e.topics.slice(0,4).map(e=>N`<span class="topic-chip">${e}</span>`)}
            </div>
          `:""}
        </div>
        <div class="repo-actions">
          <a class="btn btn-icon" href="https://github.com/${i}" target="_blank" rel="noopener" @click=${e=>e.stopPropagation()} title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          ${s?N`
            <button class="btn primary sm" @click=${e=>{e.stopPropagation(),this._replaceRenamedOneClick(a,i)}} ?disabled=${this._renamedRefreshing}>
              ${this._renamedRefreshing?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:xe("replace")}
            </button>
            <button class="btn danger sm" @click=${e=>{e.stopPropagation(),this._removeRenamedRepo(a)}} title=${xe("removeRenamed")}>✕</button>
          `:""}
          <button class="btn danger sm" @click=${t=>{t.stopPropagation(),this._removeCustomRepo(i,e.category)}}>✕</button>
        </div>
      </div>
    `}render(){const{archivedRepos:e,ignoredRepos:t,renamedEntries:i,customRepos:o,loading:r,_viewMode:s,_collapsed:a}=this;return N`
      ${r?N`
        <div class="skeleton-grid" style="margin-bottom:16px;">
          ${[1,2,3,4,5,6].map(()=>N`
            <div class="skeleton-card">
              <div class="skeleton-card-img"></div>
              <div class="skeleton-card-body">
                <div class="skeleton-line wide"></div>
                <div class="skeleton-line" style="width:40%"></div>
              </div>
            </div>
          `)}
        </div>
      `:""}

      <!-- Controls: Search + Sort Dropdown + Add Button + View Toggle -->
      <div class="controls">
        <button class="filter-toggle-sm" @click=${()=>{this._filterExpanded=!this._filterExpanded}} title="${xe("filterMore")}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
        </button>
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" autocomplete="off" placeholder="${xe("searchPlaceholder")}" .value=${this._customRepoSearch} @input=${e=>{this._customRepoSearch=e.target.value,this.requestUpdate(),this._customRepoSearch.trim()&&!this._parseRepoUrl(this._customRepoSearch)?(clearTimeout(this._orgLoadTimer),this._orgLoadTimer=setTimeout(()=>this._loadMgmtOrgRepos(),300)):(this._orgRepos=[],this._selectedOrgRepos={})}}>
          ${this._customRepoSearch?N`<button class="search-clear" @click=${()=>{this._customRepoSearch="",this._orgRepos=[],this.requestUpdate()}}>✕</button>`:""}
        </div>
        <div class="controls-right">
          <button class="refresh-btn" @click=${()=>this._load()} title="${xe("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
          <button class="view-toggle-btn" @click=${()=>this._setViewMode("card"===s?"list":"card")} title="${xe("card"===s?"viewList":"viewCard")}">
            ${"card"===s?N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            `:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            `}
          </button>
          <label class="sel-all-label desktop-only">
            <input type="checkbox" class="checkbox-sm" .checked=${this._getFilteredCustomRepos().length>0&&this._selectedRepos.length===this._getFilteredCustomRepos().length}
                   @click=${e=>e.stopPropagation()}
                   @change=${()=>{this._selectedRepos.length>0?this._selectedRepos=[]:this._selectedRepos=this._getFilteredCustomRepos().map(e=>e.full_name||e.repository).filter(Boolean)}}>
            ${xe("selectAll")}
            ${this._selectedRepos.length>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>`:""}
          </label>
        </div>
      </div>

      <!-- Inline Add / Org Repos (integrated with search) -->
      ${this._customRepoSearch&&!this.loading?N`
        ${this._parseRepoUrl(this._customRepoSearch)?N`
        <div class="search-add-bar" style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:10px;background:var(--card-background-color);border-radius:10px;border:1px solid var(--divider-color);flex-wrap:wrap;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>
          <span style="font-size:13px;font-weight:600;color:var(--primary-text-color);flex-shrink:0;">${this._parseRepoUrl(this._customRepoSearch)}</span>
          <span style="font-size:12px;color:var(--secondary-text-color);flex:1;">${xe("noMatchAdd")}</span>
          <select class="form-select" style="padding:6px 10px;font-size:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;flex-shrink:0;"
            .value=${this._addFromSearchCategory} @change=${e=>{this._addFromSearchCategory=e.target.value}}>
            <option value="integration">${xe("catIntegration")}</option>
            <option value="plugin">${xe("catPlugin")}</option>
            <option value="theme">${xe("catTheme")}</option>
            <option value="template">${xe("catTemplate")}</option>
            <option value="dashboard">${xe("catDashboard")}</option>
          </select>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:32px;white-space:nowrap;flex-shrink:0;"
            @click=${this._quickAddFromSearch} ?disabled=${this._addFromSearchInstalling}>
            ${this._addFromSearchInstalling?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("adding")}`:N`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg> ${xe("addFromSearch")}`}
          </button>
        </div>
        `:this._orgRepos.length>0?N`
        <div style="margin-bottom:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 3.5v0c6 6 6 14 0 20"/><path d="M16 3.5v0c-6 6-6 14 0 20"/><path d="M2.5 9h19"/><path d="M2.5 15h19"/></svg>
            <span style="font-size:13px;font-weight:600;color:var(--primary-text-color);flex-shrink:0;">${this._customRepoSearch}</span>
            <span style="font-size:12px;color:var(--secondary-text-color);flex:1;">${this._orgRepos.length} ${xe("repositories")}</span>
            <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;white-space:nowrap;color:var(--primary-text-color);flex-shrink:0;">
              <input type="checkbox" .checked=${this._mgmtOrgFilteredCount>0&&Object.keys(this._selectedOrgRepos).length===this._mgmtOrgFilteredCount}
                ?indeterminate=${Object.keys(this._selectedOrgRepos).length>0&&Object.keys(this._selectedOrgRepos).length<this._mgmtOrgFilteredCount}
                @change=${e=>this._toggleSelectAllMgmtOrg(e.target.checked)}
                style="width:14px;height:14px;accent-color:var(--primary-color);">
              ${xe("selectAll")}
            </label>
            <input type="text" placeholder="${xe("filterPlaceholder")}" .value=${this._orgFilter}
              @input=${e=>{this._orgFilter=e.target.value,this.requestUpdate()}}
              style="width:120px;padding:4px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--input-background-color,var(--card-background-color));color:var(--primary-text-color);outline:none;flex-shrink:0;">
            <button class="btn primary" style="font-size:11px;padding:4px 10px;min-height:28px;white-space:nowrap;flex-shrink:0;" @click=${this._syncSelectedMgmtOrg} ?disabled=${this._orgSyncing||0===Object.keys(this._selectedOrgRepos).length}>
              ${this._orgSyncing?xe("syncing"):`${xe("addSelected")} (${Object.keys(this._selectedOrgRepos).length})`}
            </button>
          </div>
          ${this._orgSyncResult?N`<div style="font-size:11px;padding:4px 14px 8px;color:${this._orgSyncFailed?"#f44336":"var(--primary-text-color)"};">${this._orgSyncResult}</div>`:""}
          <div style="max-height:200px;overflow-y:auto;border-top:1px solid var(--divider-color);">
            ${this._getFilteredSortedOrgRepos().map(e=>N`
              <div style="display:flex;align-items:center;gap:8px;padding:6px 14px;border-bottom:1px solid var(--divider-color);font-size:12px;cursor:pointer;transition:background 0.1s;color:var(--primary-text-color);" @click=${()=>this._toggleSelectMgmtOrg(e.full_name)}>
                <input type="checkbox" .checked=${!!this._selectedOrgRepos[e.full_name]}
                  @click=${t=>{t.stopPropagation(),this._toggleSelectMgmtOrg(e.full_name)}}
                  style="width:14px;height:14px;cursor:pointer;accent-color:var(--primary-color);flex-shrink:0;">
                <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  <strong>${e.full_name}</strong>
                  <span style="color:var(--secondary-text-color);margin-left:4px;">⭐${e.stars?.toLocaleString()||0}</span>
                  ${e.category?N`<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:var(--primary-color);color:#fff;font-size:10px;">${this._getCategoryLabel(e.category)}</span>`:""}
                </span>
              </div>
            `)}
          </div>
        </div>
        `:this._orgLoading?N`
        <div style="padding:12px 14px;margin-bottom:10px;text-align:center;color:var(--secondary-text-color);font-size:12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);">
          <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("searching")}
        </div>
        `:""}
      `:""}

      <!-- Filter + Sort: single compact row -->
      <div class="filter-sort-row ${this._filterExpanded?"expanded":""}">
        <div class="fs-chips">
          <span class="fs-label">${xe("repoStatus")}</span>
          <button class="filter-chip ${"all"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="all",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${xe("all")}</button>
          ${e.length>0?N`<button class="filter-chip ${"archived"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="archived",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${xe("archivedRepos")} (${e.length})</button>`:""}
          ${i.length>0?N`<button class="filter-chip ${"renamed"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="renamed",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${xe("renamedRepos")} (${i.length})</button>`:""}
          ${t.length>0?N`<button class="filter-chip ${"ignored"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="ignored",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${xe("ignoredRepos")} (${t.length})</button>`:""}
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("filterStatus")}</span>
          <button class="filter-chip ${this._statusFilter?"":"active"}" @click=${()=>{this._statusFilter="",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${xe("all")}</button>
          ${["installed","update_available","not_installed","pending_restart"].filter(e=>(this._getStatusCounts()[e]??0)>0).map(e=>N`
            <button class="filter-chip ${this._statusFilter===e?"active":""}" @click=${()=>{this._statusFilter=e,ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
              ${xe("installed"===e?"statusInstalled":"update_available"===e?"statusPendingUpgrade":"not_installed"===e?"statusNotInstalled":"statusPendingRestart")}
              <span class="chip-count">${this._getStatusCounts()[e]}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("filterType")}</span>
          <button class="filter-chip ${this._typeFilter?"":"active"}" @click=${()=>{this._typeFilter="",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${xe("all")}</button>
          ${Object.entries(this._getTypeCounts()).filter(([e,t])=>t>0).map(([e,t])=>N`
            <button class="filter-chip ${this._typeFilter===e?"active":""}" @click=${()=>{this._typeFilter=e,ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
              ${this._getCategoryLabel(e)}<span class="chip-count">${t}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("sort")}</span>
          <button class="filter-chip sort-inline ${"name"===this._customRepoSort?"active":""}" @click=${()=>{this._customRepoSort="name",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
            ${xe("sortByName")}${"name"===this._customRepoSort?N`<span class="sort-dir">▲</span>`:""}
          </button>
          <button class="filter-chip sort-inline ${"stars"===this._customRepoSort?"active":""}" @click=${()=>{this._customRepoSort="stars",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
            ${xe("sortByStars")}${"stars"===this._customRepoSort?N`<span class="sort-dir">▼</span>`:""}
          </button>
          <button class="filter-chip sort-inline ${"updated"===this._customRepoSort?"active":""}" @click=${()=>{this._customRepoSort="updated",ri({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
            ${xe("sortByUpdated")}${"updated"===this._customRepoSort?N`<span class="sort-dir">▼</span>`:""}
          </button>
        </div>
        <div class="fs-actions">
          <label class="sel-all-label">
            <input type="checkbox" class="checkbox-sm" .checked=${this._getFilteredCustomRepos().length>0&&this._selectedRepos.length===this._getFilteredCustomRepos().length}
                   @click=${e=>e.stopPropagation()}
                   @change=${()=>{this._selectedRepos.length>0?this._selectedRepos=[]:this._selectedRepos=this._getFilteredCustomRepos().map(e=>e.full_name||e.repository).filter(Boolean)}}>
            ${xe("selectAll")}
            ${this._selectedRepos.length>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>`:""}
          </label>
        </div>
      </div>

      <!-- Batch Action Bar -->
      ${this._selectedRepos.length>0?N`
        <div class="batch-bar">
          <span>${xe("batchSelected",{n:this._selectedRepos.length})}</span>
          <button class="batch-bar-btn" @click=${()=>this._batchRemove()} style="border-color:#ff5252;color:#ff5252;">${xe("removeRepo")}</button>
          <button class="batch-bar-btn" @click=${()=>{this._selectedRepos=[]}}>${xe("cancel")}</button>
        </div>
      `:""}

      ${this._renderFilteredContent(o,e,t,i)}
    `}}customElements.define("management-view",si);class ai extends ae{static properties={hass:{type:Object},_settings:{type:Object,state:!0},_saving:{type:Boolean,state:!0},_version:{type:String,state:!0},_importing:{type:Boolean,state:!0},_exporting:{type:Boolean,state:!0},_depLoading:{type:Boolean,state:!0},_depResults:{type:Object,state:!0},_githubUser:{type:String,state:!0},_githubAvatar:{type:String,state:!0},_githubTokenInput:{type:String,state:!0},_githubVerifying:{type:Boolean,state:!0},_githubVerifyMsg:{type:String,state:!0},_githubVerifyOk:{type:Boolean,state:!0},_starredRepos:{type:Array,state:!0},_starredLoading:{type:Boolean,state:!0},_starredSyncing:{type:Boolean,state:!0},_starredSyncResult:{type:String,state:!0},_auRunning:{type:Boolean,state:!0},_auScheduled:{type:Boolean,state:!0},_installedRepos:{type:Array,state:!0},_installedLoaded:{type:Boolean,state:!0},_auFilter:{type:String,state:!0},_auPage:{type:Number,state:!0},_showAuDialog:{type:Boolean,state:!0},_auDialogWhitelist:{type:Array,state:!0},_starredFilter:{type:String,state:!0},_selectedStarred:{type:Object,state:!0},_orgInput:{type:String,state:!0},_orgRepos:{type:Array,state:!0},_orgLoading:{type:Boolean,state:!0},_orgFilter:{type:String,state:!0},_selectedOrgRepos:{type:Object,state:!0},_orgSyncResult:{type:String,state:!0},_orgSyncing:{type:Boolean,state:!0},langVersion:{type:Number}};static _LOGIN_CACHE_KEY="hacs_vision_github_login";static _saveLoginCache(e,t){try{localStorage.setItem(ai._LOGIN_CACHE_KEY,JSON.stringify({user:e,avatar:t||"",timestamp:Date.now(),ttl:864e5}))}catch(e){}}static _getLoginCache(){try{const e=localStorage.getItem(ai._LOGIN_CACHE_KEY);if(!e)return null;const t=JSON.parse(e);return!t.user||Date.now()-t.timestamp>(t.ttl||864e5)?(localStorage.removeItem(ai._LOGIN_CACHE_KEY),null):{user:t.user,avatar:t.avatar||""}}catch(e){return null}}static _clearLoginCache(){try{localStorage.removeItem(ai._LOGIN_CACHE_KEY)}catch(e){}}constructor(){super(),this._settings={},this._saving=!1,this.__unsubAutoUpdateState=null,this._version="",this._importing=!1,this._exporting=!1,this._depLoading=!1,this._depResults=null,this._githubUser="",this._githubAvatar="",this._githubTokenInput="",this._githubVerifying=!1,this._githubVerifyMsg="",this._githubVerifyOk=!1,this._githubOAuthing=!1,this._githubOAuthCode="",this._githubOAuthDeviceCode="",this._syncFavToStarring=!1,this._syncFavToStarResult="",this._syncStarToFaving=!1,this._syncStarToFavResult="",this._starredRepos=[],this._starredLoading=!1,this._starredSyncing=!1,this._starredSyncResult="",this._starredSyncFailed=!1,this._auRunning=!1,this._auScheduled=!1,this._installedRepos=[],this._installedLoaded=!1,this._auFilter="",this._auPage=1,this._showAuDialog=!1,this._auDialogWhitelist=[],this._starredFilter="",this._selectedStarred={},this._orgInput="",this._orgRepos=[],this._orgLoading=!1,this._orgFilter="",this._selectedOrgRepos={},this._orgSyncResult="",this._orgSyncFailed=!1,this._orgSyncing=!1}get _filteredStarredCount(){return this._starredFilter?this._starredRepos.filter(e=>e.full_name.toLowerCase().includes(this._starredFilter.toLowerCase())).length:this._starredRepos.length}get _orgFilteredCount(){return this._filteredSortedOrgRepos.length}connectedCallback(){super.connectedCallback(),this._load(),this._subscribeAutoUpdateState()}disconnectedCallback(){super.disconnectedCallback(),this.__unsubAutoUpdateState&&(this.__unsubAutoUpdateState(),this.__unsubAutoUpdateState=null)}async _subscribeAutoUpdateState(){if(this.hass?.connection||(await new Promise(e=>setTimeout(e,0)),this.hass?.connection))try{const e=await this.hass.connection.subscribeEvents(e=>{this._auRunning=e.data.running,this._auScheduled=e.data.scheduled},"hacs_vision_auto_update_state");this.__unsubAutoUpdateState=e}catch(e){console.debug("Auto-update state subscription failed:",e)}}async _load(){try{this._settings=await de.getSettings()||{},this._settings.language&&_e(this._settings.language)}catch(e){console.error("Settings load failed:",e),this._settings={}}try{const e=await de.getVersion();this._version=e?.version||""}catch(e){console.debug("Version fetch failed (optional):",e)}try{const e=await de.getInstalled();this._installedRepos=(e?.installed||e?.repositories||[]).filter(e=>e.full_name).map(e=>({full_name:e.full_name,category:e.category||"integration",name:e.name||e.full_name.split("/")[1]})).sort((e,t)=>e.full_name.localeCompare(t.full_name))}catch(e){console.debug("Installed repos fetch failed:",e),this._installedRepos=[]}this._installedLoaded=!0;const e=ai._getLoginCache();e&&(this._githubUser=e.user,this._githubAvatar=e.avatar);try{const t=await de.getGitHubUser();t?.login&&(ai._saveLoginCache(t.login,t.avatar_url||""),e&&e.user===t.login||(this._githubUser=t.login,this._githubAvatar=t.avatar_url||""),this._autoStar())}catch(t){e||ai._clearLoginCache(),e&&console.debug("GitHub user check failed but cache present; keeping logged-in UI")}}async _toggleImmediate(e,t){this._settings={...this._settings,[e]:t},await this._save(),"hide_hacs_panel"===e&&this._toggleSidebarHacs(!t)}_toggleSidebarHacs(e){const t=document.querySelector('ha-sidebar-item a[href*="hacs"], ha-sidebar-item a[href*="HACS"]');if(t){const i=t.closest("ha-sidebar-item");return void(i&&(i.style.display=e?"":"none"))}document.querySelectorAll("ha-sidebar-item").forEach(t=>{t.textContent.toLowerCase().includes("hacs")&&(t.style.display=e?"":"none")})}async _save(){this._saving=!0;try{await de.updateSettings(this._settings),Ce(xe("settingsSaved"),"success")}catch(e){Ce(`${xe("settingsSaveFailed")}: ${e.message}`,"error")}this._saving=!1}async _onAutoUpdateEnabled(e){this._settings={...this._settings,auto_update_enabled:e},await this._save(),await this._reloadAutoUpdateSettings()}_onAutoUpdateNotify(e){this._set("auto_update_notify",e)}_onAutoUpdateRestart(e){this._set("auto_update_restart",e)}_onAutoUpdateRestartTime(e){this._set("auto_update_restart_time",e)}async _onAutoUpdateInterval(e){this._settings={...this._settings,auto_update_interval:parseInt(e)||21600},await this._save(),await this._reloadAutoUpdateSettings()}get _auFilteredInstalled(){const e=(this._auFilter||"").trim().toLowerCase();return e?this._installedRepos.filter(t=>t.full_name.toLowerCase().includes(e)):this._installedRepos}get _auCandidateRepos(){const e=new Set(this._settings.auto_update_repos||[]),t=(this._auFilter||"").trim().toLowerCase();let i=this._installedRepos;return t&&(i=i.filter(e=>e.full_name.toLowerCase().includes(t))),i.filter(t=>!e.has(t.full_name))}get _auTotalPages(){return Math.max(1,Math.ceil(this._auCandidateRepos.length/15))}get _auPagedCandidates(){const e=15*(this._auPage-1);return this._auCandidateRepos.slice(e,e+15)}_onAuFilterInput(e){this._auFilter=e.target.value,this._auPage=1,this.requestUpdate()}_auPrevPage(){this._auPage>1&&(this._auPage--,this.requestUpdate())}_auNextPage(){this._auPage<this._auTotalPages&&(this._auPage++,this.requestUpdate())}async _auToggleRepo(e){const t=[...this._settings.auto_update_repos||[]],i=t.indexOf(e);i>=0?t.splice(i,1):t.push(e),this._settings={...this._settings,auto_update_repos:t},await this._save(),await this._reloadAutoUpdateSettings()}async _auSelectAll(){const e=this._auFilteredInstalled.map(e=>e.full_name),t=new Set(this._settings.auto_update_repos||[]);e.forEach(e=>t.add(e)),this._settings={...this._settings,auto_update_repos:[...t]},await this._save(),await this._reloadAutoUpdateSettings()}async _auDeselectAll(){const e=new Set(this._auFilteredInstalled.map(e=>e.full_name)),t=(this._settings.auto_update_repos||[]).filter(t=>!e.has(t));this._settings={...this._settings,auto_update_repos:t},await this._save(),await this._reloadAutoUpdateSettings()}get _dialogCandidates(){const e=new Set(this._auDialogWhitelist||[]),t=(this._auFilter||"").trim().toLowerCase();let i=this._installedRepos;return t&&(i=i.filter(e=>e.full_name.toLowerCase().includes(t))),i.filter(t=>!e.has(t.full_name))}get _dialogTotalPages(){return Math.max(1,Math.ceil(this._dialogCandidates.length/15))}get _dialogPagedCandidates(){const e=15*(this._auPage-1);return this._dialogCandidates.slice(e,e+15)}_openAuDialog(){this._auDialogWhitelist=[...this._settings.auto_update_repos||[]],this._auFilter="",this._auPage=1,this._showAuDialog=!0}_closeAuDialog(){this._showAuDialog=!1,this._auFilter="",this._auDialogWhitelist=[]}async _saveAuDialog(){this._settings={...this._settings,auto_update_repos:this._auDialogWhitelist},this._saving=!0;try{await de.updateSettings(this._settings),Ce(xe("whitelistSaved"),"success"),await this._reloadAutoUpdateSettings()}catch(e){Ce(`${xe("whitelistSaveFailed")}: ${e.message}`,"error")}this._saving=!1,this._closeAuDialog()}_dialogAuToggleRepo(e){const t=[...this._auDialogWhitelist],i=t.indexOf(e);i>=0?t.splice(i,1):t.push(e),this._auDialogWhitelist=t,this.requestUpdate()}_dialogAuSelectAll(){const e=new Set(this._installedRepos.map(e=>e.full_name)),t=new Set(this._auDialogWhitelist);e.forEach(e=>t.add(e)),this._auDialogWhitelist=[...t],this.requestUpdate()}_dialogAuDeselectAll(){const e=new Set(this._installedRepos.map(e=>e.full_name));this._auDialogWhitelist=(this._auDialogWhitelist||[]).filter(t=>!e.has(t)),this.requestUpdate()}async _triggerAutoUpdate(){try{this._auRunning=!0;const e=await de.triggerAutoUpdate();Ce(xe(e?.queued?"updateQueued":"autoUpdateTriggered"),"info")}catch(e){Ce(`${xe("autoUpdateTriggerFailed")}: ${e.message}`,"error")}this._auRunning=!1}async _reloadAutoUpdateSettings(){try{await de.reloadAutoUpdateSettings(),Ce(xe("autoUpdateReloaded"),"success")}catch(e){Ce(`${xe("autoUpdateReloadFailed")}: ${e.message}`,"error")}}async _set(e,t){this._settings={...this._settings,[e]:t},await this._save()}async _onLanguageChange(e){_e(e),this._settings={...this._settings,language:e},await this._save()}get _translationAgents(){if(!this.hass?.states)return[];const e=[];for(const[t,i]of Object.entries(this.hass.states)){if(!t.startsWith("conversation."))continue;if("conversation.home_assistant"===t)continue;const o=i?.attributes?.friendly_name||t;e.push({id:t,name:o})}return e.sort((e,t)=>e.name.localeCompare(t.name))}async _onTranslationAgentChange(e){await this._set("translation_agent",e||null),Ce(xe("settingsSaved"),"success")}_onTranslationLangsChange(){const e=[];for(const t of be){const i=this.shadowRoot.querySelector(`input[data-lang="${t.code}"]`);i&&i.checked&&e.push(t.code)}this._set("translation_langs",e)}async _reloadCore(){try{Ce(xe("reloadingHA"),"info");const e=await de.reloadHA();e.success?Ce(xe("reloadSuccess"),"success"):Ce(`${xe("coreReloadFailed")}: ${e.error}`,"error")}catch(e){Ce(`${xe("coreReloadFailed")}: ${e.message}`,"error")}}async _checkDependencies(){this._depLoading=!0;try{const e=await de.checkDependencies();this._depResults=e,e.all_ok?Ce(xe("depOk"),"success"):Ce(`${xe("depMissing")} (${e.issues_count})`,"error")}catch(e){this._depResults=null,Ce(`${xe("checkFailed")}: ${e.message}`,"error")}this._depLoading=!1}static styles=[Se(),s`
    :host { display: block; color: var(--primary-text-color); }
    .container {
      margin: 0 auto; padding: 14px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px;
    }

    .config-grid {
      display: grid; grid-template-columns: 1fr; gap: 14px;
      align-items: start;
    }
    @media (min-width: 1024px) {
      .config-grid { grid-template-columns: 1fr 1fr 1fr; }
    }
    .config-col {
      display: flex; flex-direction: column; gap: 14px;
    }

    .section {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; padding: 16px;
    }
    .section-title {
      font-size: 14px; font-weight: 700; color: var(--primary-text-color, #212121);
      margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
    }
    .section-title .icon { width: 18px; height: 18px; flex-shrink: 0; }

    .setting-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0; border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .setting-row:last-of-type { border-bottom: none; }
    .setting-info { flex: 1; min-width: 0; }
    .setting-info .label { font-size: 13px; font-weight: 500; color: var(--primary-text-color, #212121); }
    .setting-info .desc { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 2px; }
    .setting-control { flex-shrink: 0; margin-left: 12px; }
    .setting-control select, .setting-control input {
      padding: 6px 10px; border-radius: 8px; font-size: 13px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color); min-width: 100px;
    }
    .setting-control select:focus, .setting-control input:focus {
      border-color: var(--primary-color, #03a9f4); outline: none;
    }
    .readme-lang-options { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; }
    .lang-check { display: inline-flex; align-items: center; gap: 5px; cursor: pointer; font-size: 13px; }
    .lang-check input { min-width: auto; margin: 0; cursor: pointer; }

    /* Toggle switch */
    .toggle {
      position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0;
    }
    .toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
    .toggle .slider {
      position: absolute; cursor: pointer; inset: 0;
      background: var(--secondary-background-color, #bdbdbd);
      border-radius: 24px; transition: 0.3s;
    }
    .toggle .slider::before {
      content: ''; position: absolute; width: 18px; height: 18px;
      left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.3s;
    }
    .toggle input:checked + .slider { background: var(--primary-color, #03a9f4); }
    .toggle input:checked + .slider::before { transform: translateX(20px); }

    .action-grid {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .action-grid .btn {
      flex: 1; min-width: 100px;
      display: flex; align-items: center; justify-content: center; gap: 5px;
      padding: 8px 10px; font-size: 12px;
    }
    .action-grid .btn svg { width: 16px; height: 16px; flex-shrink: 0; }

    .backup-row {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .backup-row .file-input {
      position: relative; overflow: hidden; display: inline-flex;
    }
    .backup-row .file-input input[type=file] {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer;
    }

    .version {
      text-align: center; font-size: 12px; color: var(--secondary-text-color, #727272);
      padding: 12px 0 4px;
    }

    .au-textarea {
      width: 100%; box-sizing: border-box;
      padding: 8px; border-radius: 8px; font-size: 12px; font-family: monospace;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--primary-text-color); resize: vertical; min-height: 60px;
    }
    .au-textarea:focus {
      border-color: var(--primary-color, #03a9f4); outline: none;
    }

    /* Whitelist chips */
    .au-chips {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0 6px;
    }
    .au-chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 6px 3px 10px; border-radius: 14px;
      background: rgba(76,175,80,0.12); color: #2e7d32;
      font-size: 11px; line-height: 1.4;
    }
    .au-chip .remove {
      display: inline-flex; align-items: center; justify-content: center;
      width: 16px; height: 16px; border-radius: 50%; border: none;
      background: transparent; color: #2e7d32; cursor: pointer;
      font-size: 12px; line-height: 1; padding: 0; transition: background 0.15s;
    }
    .au-chip .remove:hover { background: rgba(76,175,80,0.25); }

    .au-candidate-item {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 6px; cursor: pointer;
      transition: background 0.15s;
    }
    .au-candidate-item:hover { background: var(--secondary-background-color, #f0f0f0); }
    .au-candidate-item .add-btn {
      width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--primary-color, #03a9f4);
      background: transparent; color: var(--primary-color, #03a9f4);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; flex-shrink: 0; padding: 0; line-height: 1; transition: all 0.15s;
    }
    .au-candidate-item .add-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }

    /* Whitelist dialog modal */
    .au-dialog-overlay {
      position: fixed; inset: 0; z-index: 1000;
      display: grid; place-items: center;
      background: rgba(0,0,0,0.5);
      padding: 16px;
    }
    @media (max-width: 600px) {
      .au-dialog-overlay {
        padding: 0;
        align-items: flex-end;
      }
    }
    .au-dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px; width: 100%; max-width: 520px;
      max-height: 80vh; display: flex; flex-direction: column;
      box-shadow: 0 8px 40px rgba(0,0,0,0.2);
      color: var(--primary-text-color);
    }
    @media (max-width: 600px) {
      .au-dialog {
        max-width: 100%; max-height: 85vh;
        border-radius: 16px 16px 0 0;
        padding-bottom: env(safe-area-inset-bottom, 0);
      }
    }
    .au-dialog-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 16px 12px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      font-size: 15px; font-weight: 600;
    }
    .au-dialog-close {
      width: 28px; height: 28px; border-radius: 50%; border: none;
      background: transparent; color: var(--secondary-text-color, #727272);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 16px; transition: background 0.15s;
    }
    .au-dialog-close:hover { background: var(--secondary-background-color, #f0f0f0); }
    .au-dialog-body {
      flex: 1; overflow-y: auto; padding: 12px 16px;
    }
    .au-dialog-footer {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 12px 16px 16px; border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .au-dialog-summary {
      font-size: 11px; color: var(--secondary-text-color); padding: 4px 0 8px;
    }
  `];render(){return N`
      <div class="container">

        <div class="config-grid">

        <!-- 列1：🔑 GitHub -->
        <div class="config-col">

        <!-- 🔑 GitHub 集成 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            ${xe("githubSection")}
          </div>
          ${this._githubUser?N`
            <div class="flex-row-wide">
              ${this._githubAvatar?N`<img src="${this._githubAvatar}" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--divider-color);flex-shrink:0;" @error=${e=>e.target.style.display="none"}>`:N`<span style="width:28px;height:28px;border-radius:50%;background:var(--primary-color,#03a9f4);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">${this._githubUser[0].toUpperCase()}</span>`}
              <span class="flex-row-wide" style="font-size:13px;">${xe("hacsUser",{user:this._githubUser})}</span>
              <button class="btn btn-sm" @click=${this._githubLogout}>${xe("logout")}</button>
            </div>
            <div class="flex-wrap" style="margin-top:8px;">
              <button class="btn btn-mid" @click=${this._syncFavToStar} ?disabled=${this._syncFavToStarring}>
                ${this._syncFavToStarring?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("syncingShort")}`:this._syncFavToStarResult?N`<span style="color:var(--primary-color,#03a9f4)">${this._syncFavToStarResult}</span>`:N`<svg class=\"mini-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" style=\"width:14px;height:14px;vertical-align:middle;\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/></svg> ${xe("syncFavToStar")}`}
              </button>
              <button class="btn btn-mid" @click=${this._syncStarToFav} ?disabled=${this._syncStarToFaving}>
                ${this._syncStarToFaving?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("syncingShort")}`:this._syncStarToFavResult?N`<span style="color:var(--primary-color,#03a9f4)">${this._syncStarToFavResult}</span>`:N`<svg class=\"mini-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" style=\"width:14px;height:14px;vertical-align:middle;\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"/></svg> ${xe("syncStarToFav")}`}
              </button>
            </div>
          `:N`
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("githubToken")}</div>
                <div class="desc">${xe("githubTokenDesc")}</div>
              </div>
              <div class="setting-control flex-col">
                <input type="text" class="token-input" autocomplete="off" placeholder="ghp_xxxxxxxxxxxx" .value=${this._githubTokenInput||""} @input=${e=>this._githubTokenInput=e.target.value} />
                <div class="flex-end">
                  <button class="btn btn-md primary" @click=${this._importHacsToken}>${this._githubVerifying?xe("importing"):xe("importFromHacs")}</button>
                  <button class="btn btn-sm" @click=${this._githubVerifyToken} ?disabled=${this._githubVerifying}>${xe("verifyAndSave")}</button>
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <!-- OAuth 方式 -->
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("oauthLogin")}</div>
                <div class="desc">${xe("oauthDesc")}</div>
              </div>
              <div class="setting-control">
                <button class="btn btn-md primary" @click=${this._githubOAuthStart} ?disabled=${this._githubOAuthing}>
                  ${this._githubOAuthing?this._githubOAuthCode?N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("oauthWaiting")}`:N`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${xe("oauthStarting")}`:N`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> ${xe("oauthStart")}`}
                </button>
              </div>
            </div>
            ${this._githubOAuthCode?N`
              <div style="background:var(--secondary-background-color);border-radius:10px;padding:14px;margin-top:8px;">
                <div class="oauth-step">${xe("oauthStep1")}</div>
                <div class="oauth-text">${xe("oauthVisit")} <a href="https://github.com/login/device" target="_blank" rel="noopener" style="color:var(--primary-color);">github.com/login/device</a></div>
                <div class="oauth-step" style="margin-bottom:6px;">${xe("oauthStep2")}</div>
                <div class="oauth-text" style="margin-bottom:8px;">${xe("oauthEnterCode")}</div>
                <div class="oauth-code">${this._githubOAuthCode}</div>
                <div class="oauth-status">
                  <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;vertical-align:middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  ${xe("oauthWaitingDesc")}
                  <button class="btn btn-xs" style="margin-left:8px;" @click=${this._githubOAuthCancel}>${xe("cancel")}</button>
                </div>
              </div>
            `:""}
          `}
          ${this._githubVerifyMsg?N`<div class="msg-bar" style="color:${this._githubVerifyOk?"var(--primary-color,#03a9f4)":"#f44336"};">${this._githubVerifyMsg}</div>`:""}
        </div>

        ${this._githubUser?N`
        <!-- ⭐ 星标仓库同步 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${xe("syncStarred")}
          </div>
          <div class="section-desc">
            ${xe("syncStarredDesc")}
          </div>
          ${this._starredLoading?N`
            <div class="loading-box">
              <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ${xe("loadingStarred")}
            </div>
          `:this._starredRepos.length>0?N`
            <div class="flex-row" style="margin-bottom:8px;">
              <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;">
                <input type="checkbox" .checked=${this._filteredStarredCount>0&&Object.keys(this._selectedStarred).length===this._filteredStarredCount}
                  ?indeterminate=${Object.keys(this._selectedStarred).length>0&&Object.keys(this._selectedStarred).length<this._filteredStarredCount}
                  @change=${e=>this._toggleSelectAllStarred(e.target.checked)}>
                ${xe("selectAll")}
              </label>
              <span style="font-size:13px;font-weight:600;">${xe("starredCount",{n:this._starredRepos.length})}</span>
              <input type="text" class="search-input" placeholder="${xe("filterPlaceholder")}" .value=${this._starredFilter}
                @input=${e=>{this._starredFilter=e.target.value,this.requestUpdate()}}
                style="flex:1;padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--card-background-color);color:var(--primary-text-color);">
              <button class="btn primary" style="font-size:11px;padding:4px 10px;" @click=${this._syncSelectedStarred} ?disabled=${this._starredSyncing||0===Object.keys(this._selectedStarred).length}>
                ${this._starredSyncing?xe("syncingShort"):xe("syncSelectedCount",{n:Object.keys(this._selectedStarred).length})}
              </button>
              <button class="btn btn-sm" @click=${this._refreshStarred}>
                ${xe("refresh")}
              </button>
            </div>
            ${this._starredSyncResult?N`<div class="result-msg" style="color:${this._starredSyncFailed?"#f44336":"var(--primary-text-color)"};">${this._starredSyncResult}</div>`:""}
            <div class="scroll-list">
              ${this._starredRepos.filter(e=>!this._starredFilter||e.full_name.toLowerCase().includes(this._starredFilter.toLowerCase())).map(e=>N`
                <div class="list-item" @click=${()=>this._toggleSelectStarred(e.full_name)}>
                  <input type="checkbox" .checked=${!!this._selectedStarred[e.full_name]}
                    @click=${t=>{t.stopPropagation(),this._toggleSelectStarred(e.full_name)}}
                    style="cursor:pointer;">
                  <span style="flex:1;">
                    <strong>${e.full_name}</strong>
                    <span style="color:var(--secondary-text-color);margin-left:6px;">
                      ⭐${e.stars?.toLocaleString()||0}
                      ${e.category?N`<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:var(--primary-color);color:#fff;font-size:10px;">${e.category}</span>`:""}
                    </span>
                    ${e.description?N`<br><span style="color:var(--secondary-text-color);">${e.description.slice(0,80)}</span>`:""}
                  </span>
                </div>
              `)}
            </div>
          `:N`
            <button class="btn btn-lg" @click=${this._loadStarredRepos}>
              ${xe("loadStarred")}
            </button>
          `}
        </div>
        `:""}

        <!-- 👥 组织/用户仓库 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ${xe("orgRepos")}
          </div>
          <div class="section-desc">
            ${xe("orgReposDesc")}
          </div>
          <div class="flex-wrap" style="margin-bottom:10px;">
            <input type="text" class="search-input" placeholder="${xe("gitHubOrgInput")}" .value=${this._orgInput}
              @input=${e=>this._orgInput=e.target.value}
              @keydown=${e=>"Enter"===e.key&&this._loadOrgRepos()}
              style="flex:1;padding:8px;border:1px solid var(--divider-color);border-radius:8px;font-size:13px;background:var(--card-background-color);color:var(--primary-text-color);">
            <button class="btn btn-lg primary" style="white-space:nowrap;" @click=${this._loadOrgRepos} ?disabled=${this._orgLoading}>
              ${this._orgLoading?xe("searching"):xe("load")}
            </button>
          </div>
          ${this._orgLoading?N`
            <div class="loading-box">
              <svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ${xe("loadingOrgRepos")}
            </div>
          `:this._orgRepos.length>0?N`
            <div class="flex-row" style="margin-bottom:8px;">
              <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;">
                <input type="checkbox" .checked=${this._orgFilteredCount>0&&Object.keys(this._selectedOrgRepos).length===this._orgFilteredCount}
                  ?indeterminate=${Object.keys(this._selectedOrgRepos).length>0&&Object.keys(this._selectedOrgRepos).length<this._orgFilteredCount}
                  @change=${e=>this._toggleSelectAllOrgRepos(e.target.checked)}>
              ${xe("selectAll")}
              </label>
              <span style="font-size:13px;font-weight:600;">${this._orgRepos.length} ${xe("repositories")}</span>
              <input type="text" class="search-input" placeholder="${xe("filterPlaceholder")}" .value=${this._orgFilter}
                @input=${e=>{this._orgFilter=e.target.value,this.requestUpdate()}}
                style="flex:1;padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--card-background-color);color:var(--primary-text-color);">
              <button class="btn primary" style="font-size:11px;padding:4px 10px;" @click=${this._syncSelectedOrgRepos} ?disabled=${this._orgSyncing||0===Object.keys(this._selectedOrgRepos).length}>
                ${this._orgSyncing?xe("syncing"):`${xe("syncSelected")} (${Object.keys(this._selectedOrgRepos).length})`}
              </button>
            </div>
            ${this._orgSyncResult?N`<div class="result-msg" style="color:${this._orgSyncFailed?"#f44336":"var(--primary-text-color)"};">${this._orgSyncResult}</div>`:""}
            <div class="scroll-list">
              ${this._filteredSortedOrgRepos.map(e=>N`
                <div class="list-item" @click=${()=>this._toggleSelectOrgRepo(e.full_name)}>
                  <input type="checkbox" .checked=${!!this._selectedOrgRepos[e.full_name]}
                    @click=${t=>{t.stopPropagation(),this._toggleSelectOrgRepo(e.full_name)}}
                    style="cursor:pointer;">
                  <span style="flex:1;">
                    <strong>${e.full_name}</strong>
                    <span style="color:var(--secondary-text-color);margin-left:6px;">
                      ⭐${e.stars?.toLocaleString()||0}
                      ${e.category?N`<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:var(--primary-color);color:#fff;font-size:10px;">${e.category}</span>`:""}
                      ${e.language?N`<span style="margin-left:4px;color:var(--secondary-text-color);font-size:10px;">${e.language}</span>`:""}
                    </span>
                    ${e.description?N`<br><span style="color:var(--secondary-text-color);">${e.description.slice(0,80)}</span>`:""}
                  </span>
                </div>
              `)}
            </div>
          `:""}
        </div>
        </div> <!-- /config-col: GitHub -->

        <!-- 列2：⚙️ 基本设置 -->
        <div class="config-col">
          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ${xe("settingsTitle")}
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("settingsRefreshInterval")}</div>
                <div class="desc">${xe("settingsDesc")}</div>
              </div>
              <div class="setting-control">
                <input type="number" min="60" max="86400" style="width:90px;"
                  .value=${this._settings.refresh_interval??3600}
                  @change=${e=>this._set("refresh_interval",parseInt(e.target.value)||3600)} />
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("settingsDefaultView")}</div>
              </div>
              <div class="setting-control">
                <select @change=${e=>this._set("default_view",e.target.value)}
                  .value=${this._settings.default_view||"browse"}>
                  <option value="browse">${xe("tabBrowse")}</option>
                  <option value="updates">${xe("tabUpdates")}</option>
                  <option value="management">${xe("tabManagement")}</option>
                </select>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("settingsNotifyUpdates")}</div>
              </div>
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" .checked=${this._settings.notify_updates??!0}
                    @change=${e=>this._toggleImmediate("notify_updates",e.target.checked)}>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("settingsNotifyRestart")}</div>
              </div>
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" .checked=${this._settings.notify_restart??!0}
                    @change=${e=>this._toggleImmediate("notify_restart",e.target.checked)}>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("hideHacsPanel")}</div>
                <div class="desc">${xe("hideHacsPanelDesc")}</div>
              </div>
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" .checked=${this._settings.hide_hacs_panel??!1}
                    @change=${e=>this._toggleImmediate("hide_hacs_panel",e.target.checked)}>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("settingsLanguage")}</div>
              </div>
              <div class="setting-control">
                <select @change=${e=>this._onLanguageChange(e.target.value)}
                  .value=${this._settings.language||we()}>
                  ${Object.keys(me).map(e=>({code:e,label:me[e].label,nativeLabel:me[e].nativeLabel})).map(e=>N`
                    <option value=${e.code}>${e.nativeLabel} (${e.label})</option>
                  `)}
                </select>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("readmeTranslateAi")}</div>
                <div class="desc">${xe("readmeTranslateAiDesc")}</div>
              </div>
              <div class="setting-control">
                <select @change=${e=>this._onTranslationAgentChange(e.target.value)}
                  .value=${this._settings.translation_agent||""}>
                  <option value="">${xe("readmeTranslateAiNone")}</option>
                  ${this._translationAgents.map(e=>N`
                    <option value=${e.id}>${e.name}</option>
                  `)}
                </select>
              </div>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("readmeTranslateLangs")}</div>
                <div class="desc">${xe("readmeTranslateLangsDesc")}</div>
              </div>
              <div class="setting-control readme-lang-options">
                ${be.map(e=>N`
                  <label class="lang-check">
                    <input type="checkbox" data-lang=${e.code}
                      .checked=${(this._settings.translation_langs||ve).includes(e.code)}
                      @change=${()=>this._onTranslationLangsChange()}>
                    <span>${xe(e.key)}</span>
                  </label>
                `)}
              </div>
            </div>
          </div>

        <!-- 🔄 自动更新 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
            ${xe("autoUpdateSection")}
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${xe("autoUpdateEnabled")}</div>
              <div class="desc">${xe("autoUpdateEnabledDesc")}</div>
            </div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" .checked=${this._settings.auto_update_enabled??!1}
                  @change=${e=>this._onAutoUpdateEnabled(e.target.checked)}>
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${xe("autoUpdateInterval")}</div>
              <div class="desc">${xe("autoUpdateIntervalDesc")}</div>
            </div>
            <div class="setting-control">
              <select @change=${e=>this._onAutoUpdateInterval(e.target.value)}
                .value=${this._settings.auto_update_interval??21600}>
                <option value="3600">${xe("autoUpdateInterval1h")}</option>
                <option value="10800">${xe("autoUpdateInterval3h")}</option>
                <option value="21600">${xe("autoUpdateInterval6h")}</option>
                <option value="43200">${xe("autoUpdateInterval12h")}</option>
                <option value="86400">${xe("autoUpdateInterval24h")}</option>
              </select>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${xe("autoUpdateNotify")}</div>
              <div class="desc">${xe("autoUpdateNotifyDesc")}</div>
            </div>
            <div class="setting-control">
              <label class="toggle">
                <input type="checkbox" .checked=${this._settings.auto_update_notify??!0}
                  @change=${e=>this._onAutoUpdateNotify(e.target.checked)}>
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${xe("autoUpdateRestartTime")}</div>
              <div class="desc">${xe("autoUpdateRestartTimeDesc")}</div>
            </div>
            <div class="setting-control">
              <input type="time" .value=${this._settings.auto_update_restart_time||""}
                @change=${e=>this._onAutoUpdateRestartTime(e.target.value)}
                style="padding:4px 8px;border-radius:8px;font-size:13px;border:1px solid var(--divider-color);background:var(--secondary-background-color);color:var(--primary-text-color);">
            </div>
          </div>
          <div class="setting-row" style="border-bottom:none;">
            <div class="setting-info">
              <div class="label">${xe("autoUpdateRepos")}</div>
              <div class="desc">${xe("autoUpdateReposDesc")}</div>
            </div>
          </div>
          <!-- Chips + button to open dialog -->
          ${(()=>{const e=this._settings.auto_update_repos||[];return 0===e.length?N`
              <div style="padding:6px 0 4px;font-size:11px;color:var(--secondary-text-color);font-style:italic;">
                ${xe("noReposAdded")}
              </div>
            `:N`
              <div class="au-chips">
              ${e.map(e=>N`
                <span class="au-chip">
                  ${e}
                  <button class="remove" @click=${t=>{t.stopPropagation(),this._auToggleRepo(e)}}>✕</button>
                </span>
              `)}
              </div>
            `})()}
          <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0 8px;">
            <span style="font-size:11px;color:var(--secondary-text-color);">
              ${xe("selectedCount",{n:(this._settings.auto_update_repos||[]).length,total:this._installedRepos.length})}
            </span>
            <button class="btn btn-md primary" @click=${this._openAuDialog} ?disabled=${!this._installedLoaded||0===this._installedRepos.length}>
              ${xe("autoUpdateRepos")}
            </button>
          </div>
          <div class="setting-row" style="border-bottom:none;">
            <div class="setting-info">
              <div class="label" style="font-size:11px;color:var(--secondary-text-color);">
                ${this._auRunning?N`<span style="color:var(--primary-color);">⟳ ${xe("autoUpdateRunning")}</span>`:this._auScheduled?N`<span style="color:#4caf50;">● ${xe("autoUpdateScheduled")}</span>`:N`<span style="color:#999;">○ ${xe("autoUpdateStopped")}</span>`}
              </div>
            </div>
            <div class="setting-control" style="display:flex;gap:6px;">
              <button class="btn btn-sm primary" @click=${this._triggerAutoUpdate} ?disabled=${this._auRunning}>
                ${xe("autoUpdateTrigger")}
              </button>
              <button class="btn btn-sm" @click=${this._reloadAutoUpdateSettings}>
                ${xe("autoUpdateReload")}
              </button>
            </div>
          </div>
        </div>

        <!-- Dialog modal for whitelist settings -->
        ${this._showAuDialog?N`
        <div class="au-dialog-overlay" @click=${this._closeAuDialog}>
          <div class="au-dialog" @click=${e=>e.stopPropagation()}>
            <div class="au-dialog-header">
              <span>${xe("autoUpdateRepos")}</span>
              <button class="au-dialog-close" @click=${this._closeAuDialog}>✕</button>
            </div>
            <div class="au-dialog-body">
              <!-- Chips in dialog -->
              ${(()=>{const e=this._auDialogWhitelist||[];return 0===e.length?N`
                  <div style="padding:4px 0 6px;font-size:11px;color:var(--secondary-text-color);font-style:italic;">
                    ${xe("noReposSelected")}
                  </div>
                `:N`
                  <div class="au-chips" style="padding-top:2px;">
                  ${e.map(e=>N`
                    <span class="au-chip">
                      ${e}
                      <button class="remove" @click=${t=>{t.stopPropagation(),this._dialogAuToggleRepo(e)}}>✕</button>
                    </span>
                  `)}
                  </div>
                `})()}
              <!-- Search -->
              <div style="padding:4px 0;">
                <input type="text" class="search-input" placeholder="${xe("searchToAdd")}"
                  .value=${this._auFilter}
                  @input=${this._onAuFilterInput}
                  style="width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;font-size:12px;background:var(--card-background-color);color:var(--primary-text-color);">
              </div>
              <!-- Candidate list -->
              ${this._installedLoaded?0===this._installedRepos.length?N`
                <div style="padding:12px;text-align:center;font-size:12px;color:var(--secondary-text-color);">
                  ${xe("noInstalledRepos")}
                </div>
              `:0===this._dialogCandidates.length?N`
                <div style="padding:12px;text-align:center;font-size:12px;color:var(--secondary-text-color);">
                  ${xe("allInWhitelist")}
                </div>
              `:N`
              <div class="scroll-list" style="max-height:240px;overflow-y:auto;">
                ${this._dialogPagedCandidates.map(e=>N`
                  <div class="au-candidate-item" @click=${()=>this._dialogAuToggleRepo(e.full_name)}>
                    <button class="add-btn" @click=${t=>{t.stopPropagation(),this._dialogAuToggleRepo(e.full_name)}}>+</button>
                    <span style="flex:1;font-size:12px;">
                      <strong>${e.full_name}</strong>
                      <span style="margin-left:4px;font-size:10px;padding:1px 5px;border-radius:3px;background:var(--primary-color);color:#fff;">${e.category}</span>
                    </span>
                  </div>
                `)}
              </div>
              ${this._dialogTotalPages>1?N`
              <div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:6px 0 0;font-size:12px;">
                <button class="btn btn-xs" @click=${this._auPrevPage} ?disabled=${this._auPage<=1}>${xe("prevPage")}</button>
                <span style="color:var(--secondary-text-color);">${this._auPage} / ${this._dialogTotalPages}</span>
                <button class="btn btn-xs" @click=${this._auNextPage} ?disabled=${this._auPage>=this._dialogTotalPages}>${xe("nextPage")}</button>
              </div>
              `:""}
              `:N`
                <div style="padding:12px;text-align:center;font-size:12px;color:var(--secondary-text-color);">
                  ${xe("loadingRepos")}
                </div>
              `}
              <!-- Summary + select all -->
              <div class="au-dialog-summary">
                ${xe("selectedCount",{n:(this._auDialogWhitelist||[]).length,total:this._installedRepos.length})}
              </div>
              <div style="display:flex;gap:6px;padding:2px 0 4px;">
                <button class="btn btn-xs" @click=${this._dialogAuSelectAll}>${xe("selectAll")}</button>
                <button class="btn btn-xs" @click=${this._dialogAuDeselectAll}>${xe("deselectAll")}</button>
              </div>
            </div>
            <div class="au-dialog-footer">
              <button class="btn" @click=${this._closeAuDialog}>${xe("cancel")}</button>
              <button class="btn primary" @click=${this._saveAuDialog}>${xe("save")}</button>
            </div>
          </div>
        </div>
        `:""}

        </div>

        <!-- 列3：🛠️ 维护 + 数据 + 依赖 -->
        <div class="config-col">
          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              ${xe("settingsMaintenance")}
            </div>
            <div class="action-grid">
              <button class="btn" @click=${this._checkUpdates}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                ${xe("checkUpdatesNotify")}
              </button>
              <button class="btn" style="color:#ff9800;border-color:#ff9800;" @click=${this._reloadCore}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                ${xe("reloadHA")}
              </button>
              <button class="btn danger" @click=${this._checkAndRestart}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ${xe("restartHA")}
              </button>
              <button class="btn" style="color:#ff9800;border-color:#ff9800;" @click=${this._clearPanelCache}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                ${xe("clearCache")}
              </button>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ${xe("exportBackup")}
            </div>
            <div class="backup-row">
              <button class="btn primary" @click=${this._export} ?disabled=${this._exporting}>
                ${this._exporting?N`<span class="spinner-sm" style="display:inline-block;width:14px;height:14px;border-width:2px;margin:0;"></span> ${xe("exporting")}`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${xe("exportBtn")}`}
              </button>
              <button class="btn file-input" ?disabled=${this._importing}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                ${this._importing?N`${xe("importing")}`:N`${xe("importBackup")}`}
                <input type="file" accept=".json" @change=${e=>this._import(e)} />
              </button>
              <span style="font-size:11px;color:var(--secondary-text-color,#727272);">${xe("importDesc")}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ${xe("depCheck")}
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <div class="label">${xe("depDesc")}</div>
              </div>
              <div class="setting-control">
                <button class="btn" @click=${this._checkDependencies} ?disabled=${this._depLoading}>
                  ${this._depLoading?"⟳":"🔗"} ${xe("checkDep")}
                </button>
              </div>
            </div>
            ${this._depResults?.dependencies?.filter(e=>e.has_issues).length>0?N`
              <div style="margin-top:8px;font-size:12px;color:var(--secondary-text-color);">
                ${this._depResults.dependencies.filter(e=>e.has_issues).map(e=>N`
                  <div style="padding:4px 0;display:flex;gap:6px;align-items:center;">
                    <span style="color:#f44336;">✕</span> <span>${e.name}</span>
                    ${e.missing_dependencies?.length?N`<span style="color:var(--secondary-text-color);">— ${xe("depMissing")}: ${e.missing_dependencies.join(", ")}</span>`:""}
                  </div>
                `)}
              </div>
            `:this._depResults?.all_ok?N`
              <div style="margin-top:8px;font-size:12px;color:#4caf50;">✅ ${xe("depOk")}</div>
            `:""}
          </div>
        </div>

        </div> <!-- /config-col: 维护 -->
        </div> <!-- config-grid -->

        <div class="version">HACS Vision${this._version?` v${this._version}`:""}</div>
      </div>
    `}async _githubVerifyToken(){if(!this._githubTokenInput?.trim())return this._githubVerifyMsg=xe("githubTokenRequired"),void(this._githubVerifyOk=!1);this._githubVerifying=!0,this._githubVerifyMsg="";try{const e=await de.verifyGitHubToken(this._githubTokenInput.trim());e?.ok?(this._githubUser=e.user,this._githubAvatar=e.avatar_url||"",this._githubTokenInput="",this._githubVerifyMsg=xe("githubVerifyResult",{user:e.user,remaining:e.rate_limit_remaining}),this._githubVerifyOk=!0,ai._saveLoginCache(e.user,e.avatar_url||""),Ce(xe("githubLoginSuccess",{user:e.user}),"success"),this._autoStar()):(this._githubVerifyMsg=e?.error||xe("verifying"),this._githubVerifyOk=!1)}catch(e){this._githubVerifyMsg=xe("errorPrefix",{action:xe("verifying"),err:e.message}),this._githubVerifyOk=!1}this._githubVerifying=!1}async _autoStar(){try{const e=await de.autoStarRepo();e?.already_starred?Ce(xe("alreadyStarred"),"info"):e?.ok&&Ce(xe("starSuccess",{repo:"C3H3-AI/hacs-vision"}),"success")}catch(e){}}async _githubLogout(){try{await de.verifyGitHubToken(""),this._githubUser="",this._githubAvatar="",this._githubVerifyMsg=xe("loggedOut"),this._githubVerifyOk=!1,ai._clearLoginCache(),this._starredRepos=[],this._syncFavToStarResult="",this._syncStarToFavResult="",this._githubOAuthCode="",this._githubOAuthDeviceCode="",this._githubOAuthing=!1,Ce(xe("logoutGithub"),"info")}catch(e){}}async _githubOAuthStart(){this._githubOAuthing=!0,this._githubOAuthCode="",this._githubOAuthDeviceCode="",this._githubVerifyMsg="";try{const e=await de.post("github/oauth/start",{});e?.user_code?(this._githubOAuthCode=e.user_code,this._githubOAuthDeviceCode=e.device_code,this._pollOAuth()):(this._githubVerifyMsg=e?.error,this._githubOAuthing=!1)}catch(e){this._githubVerifyMsg=`${xe("oauthError")}: ${e.message}`,this._githubOAuthing=!1}}async _pollOAuth(){if(this._githubOAuthDeviceCode)try{const e=await de.post("github/oauth/poll",{device_code:this._githubOAuthDeviceCode});e?.ok?(this._githubUser=e.user,this._githubAvatar=e.avatar_url||"",this._githubOAuthCode="",this._githubOAuthDeviceCode="",this._githubOAuthing=!1,this._githubVerifyMsg=`${xe("githubLoginSuccess",{user:e.user})} (OAuth)`,this._githubVerifyOk=!0,ai._saveLoginCache(e.user,e.avatar_url||""),Ce(xe("githubLoginSuccess",{user:e.user}),"success"),this._autoStar()):"pending"===e?.status?setTimeout(()=>this._pollOAuth(),3e3):(this._githubVerifyMsg=e?.error,this._githubOAuthing=!1,this._githubOAuthCode="")}catch(e){setTimeout(()=>this._pollOAuth(),5e3)}}async _githubOAuthCancel(){this._githubOAuthing=!1,this._githubOAuthCode="",this._githubOAuthDeviceCode=""}async _syncFavToStar(){this._syncFavToStarResult="",this._syncFavToStarring=!0;try{const e=await de.getFavorites(),t=(Array.isArray(e)?e:e?.favorites||[]).filter(e=>"string"==typeof e&&e.includes("/")),i=await Promise.allSettled(t.map(e=>de.starRepo(e))),o=i.filter(e=>"fulfilled"===e.status).length,r=i.filter(e=>"rejected"===e.status).length;this._syncFavToStarResult=r>0?xe("syncResultPartial",{ok:o,fail:r}):xe("syncResultSuccess",{n:o}),r>0&&Ce(xe("noPermissionMsg",{n:r}),"warning")}catch(e){this._syncFavToStarResult=xe("errorPrefix",{action:xe("syncFavToStar"),err:e.message}),Ce(xe("errorPrefix",{action:xe("syncFavToStar"),err:e.message}),"error")}this._syncFavToStarring=!1}async _syncStarToFav(){this._syncStarToFavResult="",this._syncStarToFaving=!0;try{const e=await de.listStarred(),t=(e?.repos||[]).map(e=>e.full_name||e.fullName||e.name||"").filter(Boolean),i=await de.getFavorites(),o=Array.isArray(i)?[...i]:[...i?.favorites||[]];let r=0;for(const e of t)o.includes(e)||(o.push(e),r++);r>0?(await de.setFavorites(o),this._syncStarToFavResult=xe("syncFavToStarAdded",{n:r})):this._syncStarToFavResult=xe("syncFavToStarNone")}catch(e){this._syncStarToFavResult=xe("errorPrefix",{action:xe("syncStarToFav"),err:e.message}),Ce(xe("errorPrefix",{action:xe("syncStarToFav"),err:e.message}),"error")}this._syncStarToFaving=!1}async _loadStarredRepos(){this._starredLoading=!0,this._starredSyncResult="",this._selectedStarred={};try{const e=await de.listStarred();e?.repos?(this._starredRepos=e.repos,0===e.repos.length&&Ce(xe("noStarredRepos"),"info")):Ce(e?.error||xe("loadFailedSimple"),"error")}catch(e){Ce(xe("errorPrefix",{action:xe("loadStarred"),err:e.message}),"error")}this._starredLoading=!1}async _refreshStarred(){this._starredRepos=[],await this._loadStarredRepos()}_toggleSelectStarred(e){this._selectedStarred[e]?(this._selectedStarred={...this._selectedStarred},delete this._selectedStarred[e]):this._selectedStarred={...this._selectedStarred,[e]:!0}}_toggleSelectAllStarred(e){const t=this._starredRepos.filter(e=>!this._starredFilter||e.full_name.toLowerCase().includes(this._starredFilter.toLowerCase()));if(e){const e={};t.forEach(t=>e[t.full_name]=!0),this._selectedStarred=e}else this._selectedStarred={}}async _syncSelectedStarred(){if(0!==Object.keys(this._selectedStarred).length){this._starredSyncing=!0,this._starredSyncResult="";try{const e=this._starredRepos.filter(e=>this._selectedStarred[e.full_name]).map(e=>({full_name:e.full_name,category:e.category||"integration"}));if(0===e.length)return this._starredSyncResult=xe("noSelectedRepos"),void(this._starredSyncing=!1);const t=await de.syncStarred(e),i=t?.results||[],o=i.filter(e=>e.success).length,r=i.filter(e=>!e.success).length,s=r?xe("failPartSuffix",{fail:r}):"";this._starredSyncResult=xe("syncDoneResult",{ok:o,failPart:s}),Ce(xe("addStarredToCustomList",{n:o}),r?"warning":"success")}catch(e){this._starredSyncResult=xe("errorPrefix",{action:xe("syncing"),err:e.message}),this._starredSyncFailed=!0,Ce(xe("errorPrefix",{action:xe("syncing"),err:e.message}),"error")}this._starredSyncing=!1}}get _filteredSortedOrgRepos(){const e=(this._orgFilter||"").trim().toLowerCase();return e?[...this._orgRepos].filter(t=>t.full_name.toLowerCase().includes(e)).sort((t,i)=>{const o=t.full_name.toLowerCase(),r=i.full_name.toLowerCase();return o===e&&r!==e?-1:r===e&&o!==e?1:o.startsWith(e)&&!r.startsWith(e)?-1:r.startsWith(e)&&!o.startsWith(e)?1:o.length-r.length}):this._orgRepos}async _importHacsToken(){this._githubVerifying=!0,this._githubVerifyMsg="";try{const e=await de.importHacsToken();e?.ok?(this._githubUser=e.user,this._githubAvatar=e.avatar_url||"",this._githubVerifyMsg=xe("tokenImported"),this._githubVerifyOk=!0,ai._saveLoginCache(e.user,e.avatar_url||""),Ce(xe("githubLoginSuccess",{user:e.user}),"success"),this._autoStar()):Ce(e?.error||xe("tokenImportFailed"),"warning")}catch(e){this._githubVerifying=!1,Ce(xe("errorPrefix",{action:xe("importFromHacs"),err:e.message}),"error")}this._githubVerifying=!1}async _loadOrgRepos(){const e=this._orgInput?.trim();if(e){this._orgLoading=!0,this._orgRepos=[],this._selectedOrgRepos={},this._orgSyncResult="";try{const t=await de.listOrgRepos(e);t?.repos?(this._orgRepos=t.repos,0===t.repos.length&&Ce(xe("noOrgRepos"),"info")):Ce(t?.error||xe("loadFailedSimple"),"error")}catch(e){Ce(xe("errorPrefix",{action:xe("load"),err:e.message}),"error")}this._orgLoading=!1}else Ce(xe("orgInputRequired"),"warning")}_toggleSelectOrgRepo(e){if(this._selectedOrgRepos[e]){const t={...this._selectedOrgRepos};delete t[e],this._selectedOrgRepos=t}else this._selectedOrgRepos={...this._selectedOrgRepos,[e]:!0}}_toggleSelectAllOrgRepos(e){const t=this._orgRepos.filter(e=>!this._orgFilter||e.full_name.toLowerCase().includes(this._orgFilter.toLowerCase()));if(e){const e={};t.forEach(t=>e[t.full_name]=!0),this._selectedOrgRepos=e}else this._selectedOrgRepos={}}async _syncSelectedOrgRepos(){if(0!==Object.keys(this._selectedOrgRepos).length){this._orgSyncing=!0,this._orgSyncResult="";try{const e=this._orgRepos.filter(e=>this._selectedOrgRepos[e.full_name]).map(e=>({full_name:e.full_name,category:e.category||"integration"}));if(0===e.length)return this._orgSyncResult=xe("noSelectedRepos"),this._orgSyncFailed=!1,void(this._orgSyncing=!1);const t=await de.syncStarred(e),i=t?.results||[],o=i.filter(e=>e.success).length,r=i.filter(e=>!e.success).length,s=r?xe("failPartSuffix",{fail:r}):"";this._orgSyncResult=xe("syncDoneResult",{ok:o,failPart:s}),Ce(xe("addReposToCustomList",{n:o}),r?"warning":"success")}catch(e){this._orgSyncResult=xe("errorPrefix",{action:xe("syncing"),err:e.message}),this._orgSyncFailed=!0,Ce(xe("errorPrefix",{action:xe("syncing"),err:e.message}),"error")}this._orgSyncing=!1}}async _export(){this._exporting=!0;try{const e=await de.exportBackup(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`hacs_backup_${(new Date).toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i),Ce(xe("exportSuccess"),"success")}catch(e){Ce(`${xe("exportFailed")}: ${e.message}`,"error")}this._exporting=!1}async _import(e){const t=e.target?.files?.[0];if(!t)return;if(await Jt.show(this,{message:xe("importDesc"),confirmText:xe("importBackup"),danger:!0})){this._importing=!0;try{const e=await t.text(),i=JSON.parse(e),o=await de.importBackup(i);o.success?(Ce(xe("importSuccess"),"success"),this._load()):Ce(`${xe("importFailed")}: ${o.error}`,"error")}catch(e){Ce(`${xe("importFailed")}: ${e.message}`,"error")}this._importing=!1,e.target.value=""}}async _checkUpdates(){try{const e=await de.checkUpdatesWithNotify();e.success&&(e.updates_found>0?Ce(xe("updatesChecked",{n:e.updates_found}),"success"):Ce(xe("noUpdatesFound"),"info"),e.notified&&Ce(xe("notifySent"),"success"))}catch(e){Ce(xe("errorPrefix",{action:xe("checkUpdates"),err:e.message}),"error")}}async _checkAndRestart(){if(await Jt.show(this,{message:xe("restartConfirm"),confirmText:xe("restartHA"),danger:!0}))try{await de.restartHA(),Ce(xe("haRestarting"),"info")}catch(e){Ce(`${xe("restartFailed")}: ${e.message}`,"error")}}async _clearPanelCache(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Zt});if(await e.show(this,{message:xe("clearCacheConfirm"),confirmText:xe("confirm"),danger:!1}))try{if("undefined"!=typeof caches||void 0!==window.caches){const e="undefined"!=typeof caches?caches:window.caches,t=await e.keys();await Promise.all(t.map(t=>e.delete(t)))}const e=Object.keys(localStorage).filter(e=>e.startsWith("hacs_vision"));e.forEach(e=>localStorage.removeItem(e)),Ce(xe("clearCacheDone"),"success"),setTimeout(()=>{location.href=location.pathname+"?_t="+Date.now()},1500)}catch(e){Ce(`${xe("clearCache")}: ${e.message}`,"error")}}}customElements.define("config-view",ai);class ni extends ae{static properties={hass:{type:Object},configEntries:{type:Array},loading:{type:Boolean},searchText:{type:String},_statusFilter:{type:String,state:!0},_showAddDialog:{type:Boolean,state:!0},_handlerSearch:{type:String,state:!0},_handlers:{type:Array,state:!0},_handlersLoading:{type:Boolean,state:!0},_removing:{type:Object,state:!0},_reloading:{type:Object,state:!0},_detailDomain:{type:String,state:!0},_detailEntries:{type:Array,state:!0},_detailDeviceCounts:{type:Object,state:!0},_showDetail:{type:Boolean,state:!0},_domainNames:{type:Object,state:!0},_viewMode:{type:String,state:!0},_filterExpanded:{type:Boolean,state:!0},_toggledEntries:{type:Object,state:!0},_entryDevices:{type:Object,state:!0},_toggledDevices:{type:Object,state:!0},_entryDeviceLoading:{type:Object,state:!0},_toggling:{type:Object,state:!0},_selectedEntryIds:{type:Object,state:!0},_selectedDomains:{type:Object,state:!0},_sortBy:{type:String,state:!0},_sortDir:{type:String,state:!0},_configMenuFor:{type:Object,state:!0},_showOperationDialog:{type:Boolean,state:!0},_activeAction:{type:String,state:!0},_activeActionResult:{type:String,state:!0},_configureEntry:{type:Object,state:!0},_configureGroup:{type:Object,state:!0},_testIframeUrl:{type:String,state:!0},_expanded:{type:Boolean,state:!0},_deviceCounts:{type:Object,state:!0},langVersion:{type:Number}};constructor(){super(),this.configEntries=[],this.loading=!0,this.searchText="",this._statusFilter="all",this._showAddDialog=!1,this._handlerSearch="",this._handlers=[],this._handlersLoading=!1,this._removing={},this._reloading={},this._detailDomain="",this._detailEntries=[],this._showDetail=!1,this._domainNames={},this._viewMode=localStorage.getItem("hacs_int_view_mode")||"card";const e=(localStorage.getItem("hacs_int_sort_by")||"").split(":");this._sortBy=e[0]||"name",this._sortDir=e[1]||("name"===e[0]?"asc":"desc"),this._filterExpanded=!1,this._detailOpenedAt=0,this._modalDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1,cleanup:null},this._toggledEntries={},this._entryDevices={},this._toggledDevices={},this._entryDeviceLoading={},this._toggling={},this._selectedEntryIds={},this._expanded=!1,this._selectedDomains={},this._iframeZoom=1,this._deviceCounts={}}_modalPointerDown(e){const t=e.target.closest(".modal-header, .dv-header");if(!t||e.target.closest("button, input, select, textarea"))return;if(void 0!==e.button&&0!==e.button)return;const i=this._modalDrag,o=e.currentTarget;i.dragging=!0,i.startX=e.clientX-i.offsetX,i.startY=e.clientY-i.offsetY,o.style.transition="none",o.style.cursor="grabbing",t.style.userSelect="none",o.setPointerCapture(e.pointerId);const r=e=>{i.dragging&&(i.offsetX=e.clientX-i.startX,i.offsetY=e.clientY-i.startY,o.style.transform=`translate(${i.offsetX}px, ${i.offsetY}px)`)},s=e=>{i.dragging=!1,o.style.cursor="",t.style.userSelect="",o.removeEventListener("pointermove",r),o.removeEventListener("pointerup",s),o.removeEventListener("pointercancel",s);try{o.releasePointerCapture(e.pointerId)}catch(e){}};o.addEventListener("pointermove",r),o.addEventListener("pointerup",s),o.addEventListener("pointercancel",s)}_toggleExpand(){this._expanded=!this._expanded}connectedCallback(){super.connectedCallback(),this._load()}updated(e){super.updated(e),requestAnimationFrame(()=>this._loadAvatars())}_loadAvatars(){const e=this.shadowRoot?.querySelectorAll(".avatar-img[data-domain]:not([data-avatar-inited])");if(e&&e.length)for(const t of e){t.dataset.avatarInited="1";const e=t.dataset.domain,i=`https://brands.home-assistant.io/${e}/icon.png`,o=`${window.location.origin}/api/hacs_vision_brand/${e}`,r=this._getDomainColor(e),s=()=>{if(t.naturalWidth>0){t.style.display="";const e=t.parentElement.querySelector(".avatar-letter");e&&(e.style.display="none"),t.parentElement.style.background=""}},a=()=>{if(t.dataset.fb){t.style.display="none";const e=t.parentElement.querySelector(".avatar-letter");e&&(e.style.display=""),t.parentElement.style.background=r}else t.dataset.fb="1",t.src=o};t.addEventListener("load",s),t.addEventListener("error",a),t.src=i,t.complete&&(t.naturalWidth>0?s():a())}}_setViewMode(e){this._viewMode=e;try{localStorage.setItem("hacs_int_view_mode",e)}catch(e){}}_setSortBy(e){this._sortBy=e;try{localStorage.setItem("hacs_int_sort_by",e)}catch(e){}}async _load(){this.loading=!0;try{const e=await de.getConfigEntries();this.configEntries=e.entries||[];const t={};for(const e of this.configEntries)t[e.domain]||(t[e.domain]=e.translated_name||e.domain);this._domainNames=t,this._loadHandlers(),this._loadDeviceCounts()}catch(e){console.error("Failed to load config entries:",e),Ce(xe("loadFailed"),"error")}this.loading=!1}async _loadDeviceCounts(){try{const e=await de.getAllDeviceCounts();e&&"object"==typeof e&&(this._deviceCounts=e)}catch(e){}}async _loadHandlers(){if(!(this._handlers.length>0)){this._handlersLoading=!0;try{const e=await this.hass.callApi("GET","config/config_entries/flow_handlers");this._handlers=Array.isArray(e)?e.map(e=>"string"==typeof e?{domain:e,name:e}:e):[],this._handlers.sort((e,t)=>(e.name||e.domain).localeCompare(t.name||t.domain))}catch(e){console.error("Failed to load flow handlers:",e),this._handlers=[]}this._handlersLoading=!1}}async _removeEntry(e,t,i){if(t.stopPropagation(),!i){const{ConfirmDialog:t}=await Promise.resolve().then(function(){return Zt});if(!await t.show(this,{title:e.domain,message:xe("confirmDelete",{domain:e.domain}),confirmText:xe("delete"),danger:!0}))return}this._removing={...this._removing,[e.entry_id]:!0};try{const t=de._getHeaders(),i=await fetch(`/api/config/config_entries/entry/${e.entry_id}`,{method:"DELETE",headers:t,credentials:"include"});if(!i.ok)throw new Error(`HTTP ${i.status}`);Ce(`${e.domain} ${xe("deleted")}`,"success"),this._load()}catch(t){Ce(`${xe("deleteFailed")}: ${t.message}`,"error")}const o={...this._removing};delete o[e.entry_id],this._removing=o}async _reloadEntry(e,t){t.stopPropagation(),this._reloading={...this._reloading,[e.entry_id]:!0};try{const t=de._getHeaders(),i=await fetch(`/api/config/config_entries/entry/${e.entry_id}/reload`,{method:"POST",headers:{...t,"Content-Type":"application/json"},credentials:"include",body:"{}"});if(!i.ok)throw new Error(`HTTP ${i.status}`);Ce(`${e.domain} ${xe("reloaded")}`,"success"),this._activeActionResult=`${xe("reloaded")} ✅`,setTimeout(()=>this._closeOperationDialog(),1200),setTimeout(()=>this._load(),1500)}catch(t){Ce(`${xe("reloadFailed")}: ${t.message}`,"error"),this._activeActionResult=`${xe("reloadFailed")}: ${t.message}`}const i={...this._reloading};delete i[e.entry_id],this._reloading=i}async _toggleDisabled(e,t){t.stopPropagation();const i=e.disabled_by?null:"user",o=xe(i?"disableEntry":"enableEntry");try{const t=de._getHeaders(),r=await fetch("/api/config/config_entries/entry",{method:"POST",headers:{...t,"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({entry_id:e.entry_id,disabled_by:i})});if(!r.ok)throw new Error(`HTTP ${r.status}`);Ce(`${e.domain} ${o}${xe("successSuffix")}`,"success"),this._activeActionResult=`${o}${xe("successSuffix")} ✅`,setTimeout(()=>this._closeOperationDialog(),1200),setTimeout(()=>this._load(),1500)}catch(e){Ce(`${o}${xe("failedSuffix")}: ${e.message}`,"error"),this._activeActionResult=`${o}${xe("failedSuffix")}: ${e.message}`}}_openEntryOptions(e,t){t.stopPropagation(),this._closeDetail(),this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id}}))}_openAddDialog(){this._showAddDialog=!0,this._handlerSearch="",this._loadHandlers()}_closeAddDialog(){this._showAddDialog=!1,this._handlerSearch=""}_onConfigure(e,t){console.debug("HACS Vision: _onConfigure called for",e?.domain,"entry_id:",e?.entry_id),this._configureEntry=e,this._configureGroup=t,this._showOperationDialog=!0}_onAddEntry(e){const t=this.configEntries.filter(t=>t.domain===e),i=t.some(e=>e.supported_subentry_types?.length>0);if(i&&t.length>0)return this._closeDetail(),void this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e,entry_id:t[0].entry_id}}));this._closeDetail(),this.dispatchEvent(new CustomEvent("add-integration",{bubbles:!0,composed:!0,detail:{domain:e}}))}_menuSelectEntry(e){this._configMenuFor=null,this._closeDetail(),this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id}}))}_addIntegration(e){this._closeAddDialog(),this.dispatchEvent(new CustomEvent("add-integration",{bubbles:!0,composed:!0,detail:{domain:e}}))}_openDetail(e,t){this._detailOpenedAt=Date.now(),this._detailDomain=e,this._detailEntries=t,this._showDetail=!0,this._deviceViewEntryId="",console.debug("HACS Vision: _openDetail, cleared _deviceViewEntryId"),this._detailDeviceCounts=null,de.getDeviceCounts(e).then(e=>{this._detailDeviceCounts=e}).catch(t=>{console.warn("Failed to get device counts for",e,t)})}_closeDetail(){if(this._detailOpenedAt&&Date.now()-this._detailOpenedAt<500)return void console.debug("HACS Vision: _closeDetail blocked by 500ms guard");console.debug("HACS Vision: _closeDetail CALLED"),this._showDetail=!1,this._detailDomain="",this._detailEntries=[],this._detailOpenedAt=0;const e=this.shadowRoot?.querySelector(".modal");e&&(e.style.transform="")}_closeOperationDialog(){this._showOperationDialog=!1,this._activeAction="",this._activeActionResult="",this._configureEntry=null,this._configureGroup=null}_triggerOperation(e,t){if("configure"===e||"reconfigure"===e||"add-subentry"===e)return this._closeOperationDialog(),void this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:t.domain,entry_id:t.entry_id,action:e}}));this._activeAction=e,this._activeActionResult="","enable"===e?(this._showActionProgress(),this._toggleDisabled(t,{stopPropagation:()=>{}})):"reload"===e?(this._showActionProgress(),this._reloadEntry(t,{stopPropagation:()=>{}})):"remove"===e&&(this._activeActionResult=xe("confirmDelete"))}_showActionProgress(){this._activeActionResult=xe("processing")}_toggleEntry(e){const t=e.entry_id;if(this._toggledEntries[t])return this._toggledEntries={...this._toggledEntries},delete this._toggledEntries[t],void this.requestUpdate();this._toggledEntries={...this._toggledEntries,[t]:!0},this._entryDevices[t]||this._entryDeviceLoading[t]||this._loadEntryDevices(e),this.requestUpdate()}async _loadEntryDevices(e){const t=e.entry_id;this._entryDeviceLoading={...this._entryDeviceLoading,[t]:!0};try{const e=await de.get(`devices/${t}`);this._entryDevices={...this._entryDevices,[t]:e.groups||[]}}catch(e){this._entryDevices={...this._entryDevices,[t]:[]}}this._entryDeviceLoading={...this._entryDeviceLoading},delete this._entryDeviceLoading[t],this.requestUpdate()}_toggleDevice(e,t){this._toggledDevices[e]?(this._toggledDevices={...this._toggledDevices},delete this._toggledDevices[e]):this._toggledDevices={...this._toggledDevices,[e]:!0},this.requestUpdate()}_expandAll(){const e={};for(const t of this._detailEntries||[])e[t.entry_id]=!0,this._entryDevices[t.entry_id]||this._entryDeviceLoading[t.entry_id]||this._loadEntryDevices(t);this._toggledEntries=e;const t={};for(const e of Object.keys(this._entryDevices)){const i=this._entryDevices[e]||[];for(const e of i)for(const i of e.devices||[])t[i.device_id||i.entity_id||i.name]=!0}this._toggledDevices=t,this.requestUpdate()}_collapseAll(){this._toggledEntries={},this._toggledDevices={},this.requestUpdate()}_entityIcon(e,t){if(!t||"unavailable"===t||"unknown"===t)return"⊙";if("on"===t||"open"===t||"home"===t)return"●";if("off"===t||"closed"===t||"not_home"===t)return"○";return{light:"💡",switch:"🔌",sensor:"📊",binary_sensor:"🔍",climate:"🌡️",cover:"🚪",fan:"🌀",lock:"🔒",alarm_control_panel:"🔔",camera:"📷",media_player:"📺",vacuum:"🧹",weather:"☀️",device_tracker:"📍",person:"👤",sun:"☀️",automation:"⚡",script:"📜",input_boolean:"🔘",input_number:"🔢",input_select:"📋",number:"🔢",select:"📋",button:"🔘",text:"📝"}[e]||"◆"}_stateColor(e){return e&&"unavailable"!==e&&"unknown"!==e?"on"===e||"open"===e||"home"===e?"#4caf50":"off"===e||"closed"===e||"not_home"===e?"#9e9e9e":"var(--primary-text-color, #212121)":"var(--secondary-text-color, #888)"}_formatState(e,t,i){if(!e||"unavailable"===e)return xe("unavailable");if("unknown"===e)return xe("unknown");if("on"===e)return xe("stateOn");if("off"===e)return xe("stateOff");if("open"===e)return xe("stateOpen");if("closed"===e)return xe("stateClosed");if("home"===e)return xe("stateHome");if("not_home"===e)return xe("stateNotHome");const o={cool:xe("hvacCool"),heat:xe("hvacHeat"),fan_only:xe("hvacFanOnly"),dry:xe("hvacDry"),auto:xe("hvacAuto"),off:xe("hvacOff")};return o[e]?o[e]:i?`${e} ${i}`:e}_canToggle(e){return["switch","light","fan","input_boolean","automation","script","lock","cover","vacuum"].includes(e.domain)&&this.hass}async _toggleEntity(e,t){if(t.stopPropagation(),!this._toggling?.[e.entity_id]){this._toggling||(this._toggling={}),this._toggling={...this._toggling,[e.entity_id]:!0};try{if("lock"===e.domain){const t="locked"===e.state?"unlock":"lock";await this.hass.callService(e.domain,t,{entity_id:e.entity_id})}else if("cover"===e.domain){const t="open"===e.state||"opening"===e.state?"close":"open";await this.hass.callService(e.domain,t,{entity_id:e.entity_id})}else"vacuum"===e.domain?await this.hass.callService(e.domain,"toggle",{entity_id:e.entity_id}):await this.hass.callService("homeassistant","toggle",{entity_id:e.entity_id})}catch(t){console.error("Toggle failed:",t)}this._toggling={...this._toggling,[e.entity_id]:!1}}}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_toggleSelectEntry(e,t){t&&t.stopPropagation();const i={...this._selectedEntryIds};i[e]?delete i[e]:i[e]=!0,this._selectedEntryIds=i}_isAllSelected(){const e=this._detailEntries||[];return 0!==e.length&&e.every(e=>this._selectedEntryIds[e.entry_id])}_toggleSelectAll(){const e=this._detailEntries||[];if(this._isAllSelected())this._selectedEntryIds={};else{const t={};for(const i of e)t[i.entry_id]=!0;this._selectedEntryIds=t}}_selectedCount(){return Object.keys(this._selectedEntryIds).filter(e=>this._selectedEntryIds[e]).length}async _batchAction(e){const t=Object.keys(this._selectedEntryIds).filter(e=>this._selectedEntryIds[e]);if(0===t.length)return;const i=(this._detailEntries||[]).filter(e=>t.includes(e.entry_id));for(const t of i)try{"remove"===e?await this._removeEntry(t,{stopPropagation:()=>{}}):"reload"===e?await this._reloadEntry(t,{stopPropagation:()=>{}}):"enable"===e?t.disabled_by&&await this._toggleDisabled(t,{stopPropagation:()=>{}}):"disable"===e&&(t.disabled_by||await this._toggleDisabled(t,{stopPropagation:()=>{}}))}catch(i){console.error(`Batch ${e} failed for ${t.entry_id}:`,i)}this._selectedEntryIds={},this.requestUpdate(),Ce(`${xe("batchComplete")} (${t.length})`,"success")}_toggleSelectDomain(e){const t={...this._selectedDomains};t[e]?delete t[e]:t[e]=!0,this._selectedDomains=t}_isAllDomainsSelected(e){return!(!e||0===e.length)&&e.every(e=>this._selectedDomains[e.domain])}_toggleSelectAllDomains(e){if(this._isAllDomainsSelected(e))this._selectedDomains={};else{const t={};for(const i of e)t[i.domain]=!0;this._selectedDomains=t}}_selectedDomainCount(){return Object.keys(this._selectedDomains).filter(e=>this._selectedDomains[e]).length}async _batchDomainAction(e){const t=Object.keys(this._selectedDomains).filter(e=>this._selectedDomains[e]);if(0===t.length)return;const i=(this._filteredDomainGroups||[]).filter(e=>t.includes(e.domain)).flatMap(e=>e.entries||[]);if(0!==i.length){for(const t of i)try{"remove"===e?await this._removeEntry(t,{stopPropagation:()=>{}}):"reload"===e?await this._reloadEntry(t,{stopPropagation:()=>{}}):"enable"===e?t.disabled_by&&await this._toggleDisabled(t,{stopPropagation:()=>{}}):"disable"===e&&(t.disabled_by||await this._toggleDisabled(t,{stopPropagation:()=>{}}))}catch(i){console.error(`Batch ${e} failed for ${t.entry_id}:`,i)}this._selectedDomains={},this.requestUpdate(),Ce(`${xe("batchComplete")} (${t.length} ${xe("catIntegration")}, ${i.length} ${xe("entryCount",{n:i.length}).trim()})`,"success")}}_translateDomain(e){return this._domainNames?.[e]||e}_needsCloud(e){return"cloud_polling"===e}_onSortColumn(e){e===this._sortBy?this._sortDir="asc"===this._sortDir?"desc":"asc":this._sortDir="name"===e?"asc":"desc",this._sortBy=e;try{localStorage.setItem("hacs_int_sort_by",`${e}:${this._sortDir}`)}catch(e){}}_sortLabel(e){return{name:xe("sortByName"),entries:xe("sortByEntries"),status:xe("filterStatus")}[e]||e}_renderAvatar(e){const t=this._getDomainColor(e),i=e.charAt(0).toUpperCase();return N`
      <div class="avatar" style="background:${t}">
        <span class="avatar-letter" style="display:none">${i}</span>
        <img class="avatar-img" alt="" data-domain="${e}">
      </div>
    `}_getDomainColor(e){const t=["#1565c0","#7b1fa2","#2e7d32","#e65100","#00838f","#6a1b9a","#c62828","#283593"];let i=0;for(let t=0;t<e.length;t++)i=(i<<5)-i+e.charCodeAt(t);return t[Math.abs(i)%t.length]}_getState(e){const t=(e.state||"loaded").toLowerCase();return e.disabled_by?{label:xe("statusDisabled"),cls:"state-disabled",dot:"#9e9e9e"}:t.includes("fail")||t.includes("setup_retry")||t.includes("retry")?{label:xe("badgeLoadFailed"),cls:"state-failed",dot:"#f44336"}:t.includes("not_loaded")?{label:xe("statusNotLoaded"),cls:"state-not-loaded",dot:"#ff9800"}:{label:xe("statusInstalled"),cls:"state-loaded",dot:"#4caf50"}}_groupState(e){const t=e.some(e=>!e.disabled_by&&((e.state||"").toLowerCase().includes("fail")||(e.state||"").toLowerCase().includes("setup_retry")||(e.state||"").toLowerCase().includes("retry"))),i=e.some(e=>!e.disabled_by&&(e.state||"").toLowerCase().includes("not_loaded")),o=e.some(e=>e.disabled_by);return t?"failed":i?"not-loaded":o?"disabled":"loaded"}_groupLabel(e){return{loaded:xe("statusInstalled"),failed:xe("badgeLoadFailed"),disabled:xe("statusDisabled"),"not-loaded":xe("statusNotLoaded")}[e]||e}_groupColor(e){return{loaded:"#4caf50",failed:"#f44336",disabled:"#9e9e9e","not-loaded":"#ff9800"}[e]||"#999"}get _filteredDomainGroups(){const e=this.searchText.toLowerCase().trim(),t={};for(const i of this.configEntries){if(e){const t=this._translateDomain(i.domain).toLowerCase(),o=this._groupLabel(this._groupState([i])).toLowerCase();if(!i.domain.toLowerCase().includes(e)&&!t.includes(e)&&!o.includes(e))continue}t[i.domain]||(t[i.domain]=[]),t[i.domain].push(i)}let i=Object.entries(t).map(([e,t])=>({domain:e,entries:t,_state:this._groupState(t),_supports_options:t.some(e=>e.supports_options),_has_subentry:t.some(e=>e.supported_subentry_types?.length>0),_can_add:this._handlers.some(t=>t.domain===e)}));"all"!==this._statusFilter&&(i=i.filter(e=>e._state===this._statusFilter));const o="desc"===this._sortDir?-1:1;if("status"===this._sortBy){const e={failed:0,"not-loaded":1,disabled:2,loaded:3};i.sort((t,i)=>{const r=e[t._state]??3,s=e[i._state]??3;return r!==s?(r-s)*o:t.domain.localeCompare(i.domain)})}else"entries"===this._sortBy?i.sort((e,t)=>e.entries.length!==t.entries.length?(t.entries.length-e.entries.length)*o:e.domain.localeCompare(t.domain)):i.sort((e,t)=>{const i=this._translateDomain(e.domain).toLowerCase(),r=this._translateDomain(t.domain).toLowerCase();return i!==r?i<r?-1*o:1*o:e.domain.localeCompare(t.domain)*o});return i}get _chipCounts(){const e={all:0,loaded:0,failed:0,disabled:0,"not-loaded":0},t={};for(const i of this.configEntries)t[i.domain]||(t[i.domain]=!0,e.all++);const i={};for(const e of this.configEntries)i[e.domain]||(i[e.domain]=[]),i[e.domain].push(e);for(const[t,o]of Object.entries(i)){const t=this._groupState(o);void 0!==e[t]&&e[t]++}return e}get _filteredHandlers(){const e=this._handlerSearch.toLowerCase().trim();return e?this._handlers.filter(t=>{const i=(this._domainNames?.[t.domain]||"").toLowerCase();return(t.name||"").toLowerCase().includes(e)||(t.domain||"").toLowerCase().includes(e)||i.includes(e)}):this._handlers}render(){const e=this._filteredDomainGroups,t=this._chipCounts;return N`
      <div class="integrations">
      <div class="controls">
        <button class="filter-toggle-sm" @click=${()=>{this._filterExpanded=!this._filterExpanded}} title="${xe("filterMore")}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
        </button>
        <div class="search">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" autocomplete="off"
              .value=${this.searchText}
              @input=${e=>{this.searchText=e.target.value}}
              placeholder="${xe("searchIntegration")}">
            ${this.searchText?N`<button class="search-clear" @click=${()=>{this.searchText=""}}>✕</button>`:""}
          </div>
          <div class="controls-right">
            <button class="refresh-btn" @click=${this._load} title="${xe("refresh")}" style="width:36px;height:36px;padding:8px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
            <button class="view-toggle-btn" @click=${()=>this._setViewMode("card"===this._viewMode?"list":"card")} title="${"card"===this._viewMode?xe("viewList"):xe("viewCard")}">
            ${"card"===this._viewMode?N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            `:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            `}
          </button>
            <button class="action-btn primary desktop-only" @click=${this._openAddDialog}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${xe("addHAIntegration")}
            </button>
            <label class="sel-all-label desktop-only">
              <input type="checkbox" class="checkbox-sm"
                .checked=${this._isAllDomainsSelected(e)}
                @change=${()=>this._toggleSelectAllDomains(e)}>
              ${xe("selectAll")} ${this._selectedDomainCount()>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedDomainCount()})</span>`:""}
            </label>
          </div>
        </div>

        <!-- Filter chips -->
        <div class="filter-bar ${this._filterExpanded?"expanded":""}">
          <div class="fs-chips">
          ${["all","loaded","failed","disabled","not-loaded"].map(e=>N`
            <button class="filter-chip ${this._statusFilter===e?"active":""}"
              @click=${()=>{this._statusFilter=e}}>
              <span class="chip-label">${xe("all"===e?"filterAll":"loaded"===e?"filterLoaded":"failed"===e?"filterFailed":"disabled"===e?"filterDisabled":"filterNotLoaded")}</span>
              <span class="chip-count">${t[e]??0}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${xe("sort")}</span>
          ${[{key:"name",label:xe("sortByName")},{key:"entries",label:xe("sortByEntries")},{key:"status",label:xe("filterStatus")}].map(e=>N`
            <button class="filter-chip sort-inline ${this._sortBy===e.key?"active":""}" @click=${()=>this._onSortColumn(e.key)}>
              ${e.label}${this._sortBy===e.key?N`<span class="sort-dir">${"desc"===this._sortDir?"▼":"▲"}</span>`:""}
            </button>
          `)}
          </div>
          <div class="fs-actions">
            <button class="action-btn primary" style="padding:4px 10px;font-size:11px;min-height:32px;" @click=${this._openAddDialog}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${xe("addHAIntegration")}
            </button>
            <label class="sel-all-label">
              <input type="checkbox" class="checkbox-sm"
                .checked=${this._isAllDomainsSelected(e)}
                @change=${()=>this._toggleSelectAllDomains(e)}>
              ${xe("selectAll")} ${this._selectedDomainCount()>0?N`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedDomainCount()})</span>`:""}
            </label>
          </div>
        </div>

        ${this._selectedDomainCount()>0?N`
          <div class="batch-bar" style="margin-bottom:10px;">
            <span style="font-weight:600;">${this._selectedDomainCount()} ${xe("selected")}</span>
            <div class="batch-actions">
              <button class="batch-btn enable" @click=${()=>this._batchDomainAction("enable")}>${xe("enableEntry")}</button>
              <button class="batch-btn disable" @click=${()=>this._batchDomainAction("disable")}>${xe("disableEntry")}</button>
              <button class="batch-btn reload" @click=${()=>this._batchDomainAction("reload")}>${xe("reloadEntry")}</button>
              <button class="batch-btn remove" @click=${()=>this._batchDomainAction("remove")}>${xe("removeEntry")}</button>
              <button class="batch-btn cancel" @click=${()=>{this._selectedDomains={},this.requestUpdate()}}>✕</button>
            </div>
          </div>
        `:""}

        ${this.loading?N`
          <div class="loading"><div class="spinner-sm"></div><div class="loading-text">${xe("loading")}</div></div>
        `:0===e.length?N`
          <div class="empty-state">
            <div class="empty-icon">⚙</div>
            <div class="empty-title">${xe("noData")}</div>
          </div>
        `:"list"===this._viewMode?N`
          <div class="integrations-list">
            <div class="list-header">
              <span class="list-header-name">${xe("colName")}</span>
              <span class="list-header-status">${xe("colStatus")}</span>
              <span class="list-header-action"></span>
            </div>
            ${e.map(e=>this._renderListRow(e))}
          </div>
        `:N`
          <div class="grid">
            ${e.map(e=>this._renderCard(e))}
          </div>
        `}
      </div>

      ${this._renderAddDialog()}
      ${this._showDetail?this._renderDetailDialog():""}
      ${this._showOperationDialog?this._renderOperationDialog():""}
      <!-- 跳转到 HA 原生配置页 (使用 hass.navigate 保持侧边栏同步) -->
    `}_renderListRow(e){const{domain:t,entries:i}=e,o=e._state,r=i.length>1,s=i[0],a=i.some(e=>this._removing[e.entry_id]||this._reloading[e.entry_id]),n=this._deviceCounts?.[t];return N`
      <div class="list-row list-row-${o}" @click=${()=>{this.hass?.navigate?this.hass.navigate("/config/integrations/integration/"+t):window.location.href="/config/integrations/integration/"+t}}>
        <span class="list-row-name">
          <span class="list-row-icon">${this._renderAvatar(t)}</span>
          <span class="list-row-title">${this._translateDomain(t)}</span>
          <span class="list-row-domain">${t}</span>
        </span>
        <span class="list-row-status">
          <span class="list-status-badge state-${o}">${this._groupLabel(o)}</span>
          ${r?N`<span class="list-entry-count">${i.length} ${xe("entryCount")}</span>`:""}
          ${n?N`<span class="list-device-count" title="${n.devices} ${xe("deviceCount")}, ${n.entities} ${xe("entityCount")}">📱${n.devices} · 🔹${n.entities}</span>`:""}
        </span>
        <span class="list-row-actions">
          ${e._has_subentry||e._supports_options||"not-loaded"===e._state?N`
          <button class="list-action-btn manage" @click=${t=>{t.stopPropagation(),this._onConfigure(s||i[0],e)}} title="${xe("configureEntry")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          `:""}
          <button class="list-action-btn reload" @click=${e=>{e.stopPropagation(),this._reloadEntry(s||i[0],e)}} title="${xe("reloadEntry")}" ?disabled=${a}>
            ${this._reloading[s?.entry_id||""]?"⋯":N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`}
          </button>
        </span>
      </div>
    `}_renderCard(e){const{domain:t,entries:i}=e;this._getDomainColor(t);const o=e._state,r=i.some(e=>this._removing[e.entry_id]||this._reloading[e.entry_id]);i.length;const s=i[0],a=this._deviceCounts?.[t];return N`
      <div class="card card-${o}" @click=${()=>{this.hass?.navigate?this.hass.navigate("/config/integrations/integration/"+t):window.location.href="/config/integrations/integration/"+t}} role="button" tabindex="0"
        @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.hass?.navigate?this.hass.navigate("/config/integrations/integration/"+t):window.location.href="/config/integrations/integration/"+t)}}>

          <div class="card-img">
            <div class="card-top-bar" @click=${e=>e.stopPropagation()}>
              <input type="checkbox" class="card-checkbox" .checked=${!!this._selectedDomains[t]}
                     @change=${()=>this._toggleSelectDomain(t)}>
            </div>
            ${this._renderAvatar(t)}
            ${"loaded"!==o?N`<span class="img-status-badge state-${o}">${this._groupLabel(o)}</span>`:""}
          </div>

        <div class="card-body">
          <div class="img-badges">
            ${s?.is_custom?N`<span class="img-badge custom-badge" title="${xe("customBadge")}">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M2 10.96a.985.985 0 0 1-.37-1.37L3.13 7c.11-.2.28-.34.47-.42l7.83-4.4c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.19.1.35.26.44.46l1.45 2.52c.28.48.11 1.09-.36 1.36l-1 .58v4.96c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.99.99 0 0 1 3 16.5v-5.54c-.3.17-.68.18-1 0m10-6.81v6.7l5.96-3.35zM5 15.91l6 3.38v-6.71L5 9.21zm14 0v-3.22l-5 2.9c-.33.18-.7.17-1 .01v3.69zm-5.15-2.55l6.28-3.63l-.58-1.01l-6.28 3.63z"/></svg>
            </span>`:""}
            ${this._needsCloud(s?.iot_class)?N`<span class="img-badge cloud-badge" title="${xe("cloud")}">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>
            </span>`:""}
          </div>
          <div class="card-name" title="${t}">${this._translateDomain(t)}</div>
          <div class="card-meta">
            <span class="count-info">
              ${i.length} ${xe("entryCount")}
              ${s?.supported_subentry_types?N` · ${s.supported_subentry_types.length} ${xe("tools")}`:""}
              ${a?N`
                · <span class="meta-devices">${a.devices} ${xe("deviceCount")}</span>
                · <span class="meta-entities">${a.entities} ${xe("entityCount")}</span>
              `:""}
            </span>
          </div>
        </div>

        <div class="card-footer" @click=${e=>e.stopPropagation()}>
          ${e._has_subentry||e._supports_options||"not-loaded"===e._state?N`
          <button class="footer-btn manage" @click=${()=>this._onConfigure(s||i[0],e)}
            title="${xe("configureEntry")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span class="btn-label">${xe("configure")}</span>
          </button>
          `:""}
          ${this._configMenuFor?.domain===t&&"configure"===this._configMenuFor?.mode?N`
          <div class="config-dropdown">
            ${i.map(e=>N`
              <button class="config-dropdown-item" @click=${()=>this._menuSelectEntry(e)}>
                <span class="dd-icon">${e.domain}</span>
                <span class="dd-label">${e.title||e.entry_id.substring(0,8)}</span>
                ${e.supports_options?N`<span class="dd-badge">${xe("configure")}</span>`:""}
                ${e.supported_subentry_types?N`<span class="dd-badge sub">+${e.supported_subentry_types.length}</span>`:""}
              </button>
            `)}
          </div>
          `:""}
          <button class="footer-btn reload" @click=${()=>this._reloadEntry(s||i[0],{stopPropagation:()=>{}})}
            title="${xe("reloadEntry")}" ?disabled=${r}>
            ${r?N`<span class="spinning-mini">⟳</span>`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`}
            <span class="btn-label">${xe("reloadEntry")}</span>
          </button>
          <button class="footer-btn remove" @click=${e=>this._removeEntry(s||i[0],e)}
            title="${xe("removeEntry")}" ?disabled=${r}>
            ${r?N`<span class="spinning-mini">⋯</span>`:N`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
            <span class="btn-label">${xe("delete")}</span>
          </button>
        </div>
      </div>
    `}_renderDetailDialog(){if(!this._showDetail)return"";const e=this._detailDomain,t=this._detailEntries;return N`
      <div class="detail-overlay" role="dialog" aria-modal="true" aria-label="${this._translateDomain(e)}" @click=${e=>{e.target===e.currentTarget&&this._closeDetail()}} @keydown=${e=>{"Escape"===e.key&&this._closeDetail()}}>
        <div class="modal ${this._expanded?"expanded":""}" @pointerdown=${this._modalPointerDown} @dblclick=${this._toggleExpand}>
          <div class="modal-header">
            <div class="modal-header-left">
              ${this._renderAvatar(e)}
              <div>
                <div class="modal-title">${this._translateDomain(e)}</div>
                <div class="modal-subtitle" style="display:flex;align-items:center;gap:8px;">
                  <span>${t.length} ${xe("entryCount")}</span>
                  <label class="sel-all-label" @click=${e=>e.stopPropagation()}>
                    <input type="checkbox" class="entry-checkbox" .checked=${this._isAllSelected()}
                           @change=${this._toggleSelectAll}>
                    <span style="font-size:12px;color:var(--secondary-text-color);cursor:pointer;">${xe("selectAll")}</span>
                  </label>
                  ${this._selectedCount()>0?N`<span style="font-size:12px;color:var(--primary-color);font-weight:600;">${this._selectedCount()} ${xe("selected")}</span>`:""}
                </div>
              </div>
            </div>
            <div class="modal-header-right">
              <button class="tree-action-btn" @click=${this._toggleExpand} title="${xe("zoom")}">${this._expanded?"⤡":"⤢"}</button>
              <button class="tree-action-btn" @click=${this._expandAll} title="${xe("expandAll")}">⊕</button>
              <button class="tree-action-btn" @click=${this._collapseAll} title="${xe("collapseAll")}">⊖</button>
              <button class="modal-close" aria-label="${xe("close")}" @click=${this._closeDetail}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="tree-container">
            ${this._selectedCount()>0?N`
            <div class="batch-bar">
              <span style="font-weight:600;">${this._selectedCount()} ${xe("selected")}</span>
              <div class="batch-actions">
                <button class="batch-btn enable" @click=${()=>this._batchAction("enable")} title="${xe("enableEntry")}">${xe("enableEntry")}</button>
                <button class="batch-btn disable" @click=${()=>this._batchAction("disable")} title="${xe("disableEntry")}">${xe("disableEntry")}</button>
                <button class="batch-btn reload" @click=${()=>this._batchAction("reload")} title="${xe("reloadEntry")}">${xe("reloadEntry")}</button>
                <button class="batch-btn remove" @click=${()=>this._batchAction("remove")} title="${xe("removeEntry")}">${xe("removeEntry")}</button>
                <button class="batch-btn cancel" @click=${()=>{this._selectedEntryIds={},this.requestUpdate()}}>✕</button>
              </div>
            </div>
            `:""}
            ${0===t.length?N`<div class="tree-empty">${xe("noData")}</div>`:t.map(e=>this._renderEntryRow(e))}
          </div>
        </div>
      </div>
    `}_renderTestIframe(){return this._testIframeUrl?N`
      <div class="detail-overlay" role="dialog" aria-modal="true"
        @click=${e=>{e.target===e.currentTarget&&(this._testIframeUrl=null)}}
        @keydown=${e=>{"Escape"===e.key&&(this._testIframeUrl=null)}}>
        <div class="modal iframe-modal ${this._expanded?"expanded":""}" @pointerdown=${this._modalPointerDown} @dblclick=${this._toggleExpand}>
          <div class="modal-header">
            <div class="modal-title">${this._translateDomain(this._testIframeDomain)||this._testIframeDomain}</div>
            <div class="modal-header-right">
              <button class="tree-action-btn" @click=${this._toggleExpand} title="${xe("zoom")}">${this._expanded?"⤡":"⤢"}</button>
              <button class="modal-close" aria-label="${xe("close")}" @click=${()=>{this._testIframeUrl=null}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="iframe-body">
            <iframe src="${this._testIframeUrl}" class="config-iframe" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
          </div>
        </div>
      </div>
    `:""}_renderOperationDialog(){const e=this._configureEntry;if(this._configureGroup,!e)return"";const t=e.domain,i=!!e.disabled_by,o=this._getState(e),r=this._activeAction,s=this._activeActionResult,a=e.supports_options,n=e.supports_reconfigure,l=e.supported_subentry_types;return N`
      <div class="detail-overlay" role="dialog" aria-modal="true"
        @click=${e=>{e.target===e.currentTarget&&this._closeOperationDialog()}}
        @keydown=${e=>{"Escape"===e.key&&this._closeOperationDialog()}}>
        <div class="modal op-modal ${this._expanded?"expanded":""}" @pointerdown=${this._modalPointerDown} @dblclick=${this._toggleExpand}>
          <div class="modal-header">
            <div class="modal-header-left">
              ${this._renderAvatar(t)}
              <div>
                <div class="modal-title">${this._translateDomain(t)}</div>
                <div class="modal-subtitle" style="display:flex;align-items:center;gap:8px;">
                  <span class="entry-dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${o.dot}"></span>
                  <span>${o.label}</span>
                  <span style="color:var(--secondary-text-color);font-size:11px;">· ${t}</span>
                </div>
              </div>
            </div>
            <div class="modal-header-right">
              <button class="tree-action-btn" @click=${this._toggleExpand} title="${xe("zoom")}">${this._expanded?"⤡":"⤢"}</button>
              <button class="modal-close" aria-label="${xe("close")}" @click=${this._closeOperationDialog}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="op-body">
            <!-- Left: vertical action buttons -->
            <div class="op-left">
              ${a?N`
                <button class="op-btn ${"configure"===r?"active":""}" @click=${()=>this._triggerOperation("configure",e)}
                  title="${xe("configure")}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <span class="op-btn-label">${xe("configure")}</span>
                </button>
              `:""}
              ${n?N`
                <button class="op-btn ${"reconfigure"===r?"active":""}" @click=${()=>this._triggerOperation("reconfigure",e)}
                  title="${xe("reconfigure")}">
                  🔄 <span class="op-btn-label">${xe("reconfigure")}</span>
                </button>
              `:""}
              ${l&&l.length>0?N`
                <button class="op-btn ${"add-subentry"===r?"active":""}" @click=${()=>this._triggerOperation("add-subentry",e)}
                  title="${xe("addSubentry")}">
                  ➕ <span class="op-btn-label">${xe("addSubentry")}</span>
                </button>
              `:""}
              ${i?N`
                <button class="op-btn enable ${"enable"===r?"active":""}" @click=${()=>this._triggerOperation("enable",e)}
                  title="${xe("enableEntry")}">
                  ▶️ <span class="op-btn-label">${xe("enableEntry")}</span>
                </button>
              `:N`
                <button class="op-btn ${"disable"===r?"active":""}" @click=${()=>this._triggerOperation("disable",e)}
                  title="${xe("disableEntry")}">
                  ⏹ <span class="op-btn-label">${xe("disableEntry")}</span>
                </button>
              `}
              <button class="op-btn ${"reload"===r?"active":""}" @click=${()=>this._triggerOperation("reload",e)}
                title="${xe("reloadEntry")}">
                🔁 <span class="op-btn-label">${xe("reloadEntry")}</span>
              </button>
              ${"system"!==e.source?N`
                <button class="op-btn danger ${"remove"===r?"active":""}" @click=${()=>this._triggerOperation("remove",e)}
                  title="${xe("removeEntry")}">
                  🗑 <span class="op-btn-label">${xe("removeEntry")}</span>
                </button>
              `:""}
            </div>
            <!-- Right: content panel -->
            <div class="op-right">
              ${(()=>r&&s?"remove"===r?N`
            <div class="op-confirm">
              <div class="op-result-text">${s}</div>
              <div class="op-confirm-actions">
                <button class="op-btn-confirm danger" @click=${()=>{this._activeActionResult=xe("processing"),this._removeEntry(e,{stopPropagation:()=>{}},!0)}}>${xe("confirm")}</button>
                <button class="op-btn-cancel" @click=${()=>{this._activeAction="",this._activeActionResult=""}}>${xe("cancel")}</button>
              </div>
            </div>
          `:N`<div class="op-result"><div class="op-spinner"></div><div class="op-result-text">${s}</div></div>`:N`<div class="op-prompt">${xe("selectAction")}</div>`)()}
            </div>
          </div>
        </div>
      </div>
    `}_renderEntryRow(e){const t=this._getState(e),i=this._removing[e.entry_id]||this._reloading[e.entry_id],o=e.title||e.entry_id.substring(0,8),r=!!e.disabled_by,s=!!this._toggledEntries[e.entry_id],a=this._entryDevices[e.entry_id],n=!!this._entryDeviceLoading[e.entry_id];return N`
      <div class="entry-row ${r?"disabled":""} ${s?"expanded":""}">
        <span class="entry-check-wrap" @click=${e=>e.stopPropagation()}>
          <input type="checkbox" class="entry-checkbox" .checked=${!!this._selectedEntryIds[e.entry_id]}
                 @change=${()=>this._toggleSelectEntry(e.entry_id)}>
        </span>
        <span class="tree-arrow ${s?"open":""}" @click=${t=>{t.stopPropagation(),this._toggleEntry(e)}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
        <div class="entry-icon">
          ${this._renderAvatar(this._detailDomain)}
        </div>
        <span class="entry-dot" style="background:${t.dot}"></span>
        <div class="entry-info">
          <span class="entry-label">${t.label}</span>
          <span class="entry-id" title="entry_id: ${e.entry_id}">${o}</span>
        </div>
        <div class="entry-actions" @click=${e=>e.stopPropagation()}>
          <!-- Enable/Disable toggle -->
          <button class="entry-btn ${r?"enable":"disable"}"
            @click=${t=>this._toggleDisabled(e,t)}
            title="${xe(r?"enableEntry":"disableEntry")}"
            ?disabled=${i}>
            ${r?N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            `:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            `}
          </button>
          ${e.supports_options?N`
          <button class="entry-btn" @click=${t=>this._openEntryOptions(e,t)} title="${xe("configureEntry")}" ?disabled=${i}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          `:""}
          ${e.supports_reconfigure?N`
          <button class="entry-btn" @click=${t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id,action:"reconfigure"}})),this._closeDetail()}} title="${xe("reconfigure")}" ?disabled=${i}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M21 8a9 9 0 1 1-3.64-6.36L21 2"/></svg>
          </button>
          `:""}
          ${e.supported_subentry_types&&e.supported_subentry_types.length>0?N`
          <button class="entry-btn sub" @click=${t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id,action:"add-subentry"}})),this._closeDetail()}} title="${xe("addSubentry")}" ?disabled=${i}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          `:""}
          <button class="entry-btn reload" @click=${t=>this._reloadEntry(e,t)} title="${xe("reloadEntry")}" ?disabled=${i}>
            ${this._reloading[e.entry_id]?N`<span class="spinning">⋯</span>`:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            `}
          </button>
          <button class="entry-btn remove" @click=${t=>this._removeEntry(e,t)} title="${xe("removeEntry")}" ?disabled=${i}>
            ${this._removing[e.entry_id]?N`<span class="spinning">⋯</span>`:N`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            `}
          </button>
        </div>
      </div>
      <!-- Entry children: device tree -->
      ${s?N`
        <div class="entry-children">
          ${n?N`
            <div class="tree-loading"><div class="spinner-xs"></div><span>${xe("loading")}</span></div>
          `:a&&0!==a.length?a.map(t=>this._renderDeviceGroup(t,e)):N`
            <div class="tree-empty-msg">${xe("noDevicesOrEntities")}</div>
          `}
        </div>
      `:""}
    `}_renderDeviceGroup(e,t){const{area:i,devices:o}=e;return N`
      <div class="device-group">
        <div class="device-group-header">
          <span class="device-group-name">${i}</span>
          <span class="device-group-count">${o.length} ${xe("deviceCount")}</span>
        </div>
        <div class="device-group-body">
          ${o.map(e=>this._renderDevice(e,t))}
        </div>
      </div>
    `}_renderDevice(e,t){const i=e.device_id||e.entity_id||e.name,o=!!this._toggledDevices[i],r=e.entities?e.entities.filter(e=>!e.disabled).length:0;return N`
      <div class="device-row ${o?"expanded":""}">
        <div class="device-header" @click=${()=>this._toggleDevice(i,t)}>
          <span class="device-arrow ${o?"open":""}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
          <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span class="device-name">${e.name}</span>
          ${e.model?N`<span class="device-model">${e.model}</span>`:""}
          <span class="device-ecount">${r} ${xe("entityCount")}</span>
        </div>
        ${o&&e.entities?N`
          <div class="device-entities">
            ${e.entities.filter(e=>!e.disabled).map(e=>this._renderEntity(e))}
          </div>
        `:""}
      </div>
    `}_renderEntity(e){const t=this._canToggle(e);return N`
      <div class="entity-row ${t?"toggleable":""}"
        @click=${t?t=>this._toggleEntity(e,t):()=>this._openMoreInfo(e.entity_id)}>
        <span class="entity-icon">${this._entityIcon(e.domain,e.state)}</span>
        <span class="entity-name" title="${e.entity_id}">${e.name||e.entity_id.split(".").pop()}</span>
        <span class="entity-state" style="color:${this._stateColor(e.state)}">${this._formatState(e.state,e.domain,e.unit)}</span>
        ${t?N`
          <span class="entity-toggle ${"on"===e.state||"open"===e.state?"on":""}">
            ${this._toggling?.[e.entity_id]?N`<span class="spinning-xs">⟳</span>`:""}
          </span>
        `:N`
          <span class="entity-more">›</span>
        `}
      </div>
    `}_renderAddDialog(){if(!this._showAddDialog)return"";const e=this._filteredHandlers;return N`
      <div class="detail-overlay" role="dialog" aria-modal="true" aria-label="${xe("addHAIntegration")}" @click=${e=>{e.target===e.currentTarget&&this._closeAddDialog()}}>
        <div class="modal add-modal ${this._expanded?"expanded":""}" @pointerdown=${this._modalPointerDown} @dblclick=${this._toggleExpand}>
          <div class="modal-header">
            <span class="modal-title">${xe("addHAIntegration")}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <button class="tree-action-btn" @click=${this._toggleExpand} title="${xe("zoom")}">${this._expanded?"⤡":"⤢"}</button>
              <button class="modal-close" aria-label="${xe("close")}" @click=${this._closeAddDialog}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="modal-search">
            <input type="text" class="add-search-input" autocomplete="off"
              placeholder="${xe("searchIntegration")}"
              .value=${this._handlerSearch}
              @input=${e=>{this._handlerSearch=e.target.value}}
              @keydown=${e=>{"Escape"===e.key&&this._closeAddDialog()}} />
          </div>
          <div class="add-panel-count">${e.length} ${xe("integrationCount")}</div>
          <div class="modal-body">
            ${this._handlersLoading?N`
              <div class="dv-loading"><div class="spinner-sm"></div><div>${xe("loading")}</div></div>
            `:0===e.length?N`
              <div class="dv-empty">${xe("noIntegrationMatch")}</div>
            `:e.map(e=>N`
              <div class="add-item" @click=${()=>this._addIntegration(e.domain)}>
                ${this._renderAvatar(e.domain)}
                <span class="add-item-name">${this._translateDomain(e.domain)}</span>
                ${e.name&&e.name!==e.domain?N`<span class="add-item-domain">${e.domain}</span>`:""}
              </div>
            `)}
          </div>
        </div>
      </div>
    `}static styles=[Se(),s`
    :host { display: block; touch-action: manipulation; }

    /* ===== Controls Bar (unified with store/management/updates) ===== */
    .controls {
      display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
    }
    .page-title { margin: 0; font-size: 20px; font-weight: 700; color: var(--primary-text-color); }

    .action-btn {
      padding: 9px 18px; border-radius: 10px; font-size: 12px; font-weight: 600;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s; white-space: nowrap; min-height: 36px;
    }
    .action-btn:hover { border-color: var(--primary-color, #03a9f4); }
    .action-btn.primary {
      background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color, #03a9f4);
    }
    .action-btn.primary:hover { opacity: 0.9; }

    /* ===== Operation Dialog — Left/Right Layout ===== */
    .op-modal { max-width: 680px; max-height: 80vh; }
    .op-body {
      display: flex; flex: 1; overflow: hidden;
    }
    .op-left {
      width: 160px; flex-shrink: 0;
      display: flex; flex-direction: column; gap: 4px;
      padding: 12px 8px; overflow-y: auto;
      border-right: 1px solid var(--divider-color, #e0e0e0);
    }
    .op-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; border: none; border-radius: 8px;
      background: transparent; color: var(--primary-text-color);
      cursor: pointer; font-size: 13px; text-align: left;
      transition: all 0.12s; white-space: nowrap;
    }
    .op-btn:hover { background: rgba(0,0,0,0.05); }
    .op-btn.active { background: var(--primary-color, #03a9f4); color: #fff; }
    .op-btn.danger { color: #f44336; }
    .op-btn.danger.active { background: #f44336; color: #fff; }
    .op-btn.danger:hover:not(.active) { background: rgba(244,67,54,0.08); }
    .op-btn.enable { color: #4caf50; }
    .op-btn.enable.active { background: #4caf50; color: #fff; }
    .op-btn-label { font-weight: 500; }

    .op-right {
      flex: 1; min-width: 0;
      display: flex; align-items: center; justify-content: center;
      padding: 24px; overflow-y: auto;
    }
    .op-prompt {
      color: var(--secondary-text-color); font-size: 14px;
    }
    .op-result {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .op-result-text { font-size: 14px; color: var(--primary-text-color); text-align: center; }
    .op-spinner {
      width: 24px; height: 24px; border: 3px solid var(--divider-color);
      border-top-color: var(--primary-color); border-radius: 50%;
      animation: op-spin 0.8s linear infinite;
    }
    @keyframes op-spin { to { transform: rotate(360deg); } }
    .op-confirm { text-align: center; }
    .op-confirm-actions { display: flex; gap: 12px; margin-top: 16px; justify-content: center; }
    .op-btn-confirm, .op-btn-cancel {
      padding: 8px 20px; border-radius: 8px; border: none;
      font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .op-btn-confirm { background: var(--primary-color); color: #fff; }
    .op-btn-confirm.danger { background: #f44336; }
    .op-btn-cancel { background: var(--divider-color); color: var(--primary-text-color); }

    /* ===== View Toggle ===== */
    .view-toggle {
      display: inline-flex; border: 1px solid var(--divider-color);
      border-radius: 8px; overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }

    /* ===== Filter/Sort row (matching browse.js exactly) ===== */
    .filter-bar {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin-bottom: 10px; padding: 8px 12px;
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 10px;
    }
    .fs-divider {
      display: inline-block; width: 1px; height: 22px;
      background: var(--divider-color, #e0e0e0); margin: 0 10px; flex-shrink: 0;
    }
    .fs-label {
      font-size: 11px; font-weight: 700; color: var(--primary-color, #03a9f4);
      text-transform: uppercase; letter-spacing: 0.5px; padding: 0 6px;
      user-select: none; flex-shrink: 0;
    }
    .filter-chip {
      padding: 6px 12px; border: 1px solid var(--divider-color); border-radius: 18px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; font-size: 12px; transition: all 0.25s; white-space: nowrap;
      touch-action: manipulation;
    }
    .filter-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .filter-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .filter-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .filter-chip .chip-count { font-size: 10px; opacity: 0.7; margin-left: 3px; }

    .filter-toggle-sm {
      display: none; width: 36px; height: 36px; flex-shrink: 0;
      border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; align-items: center; justify-content: center; padding: 0;
      touch-action: manipulation;
    }
    .filter-toggle-sm:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .sort-inline { opacity: 0.85; }
    .sort-inline.active { opacity: 1; }
    .sort-dir { font-size: 9px; margin-left: 2px; }

    /* ===== List View ===== */
    .integrations-list {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px; overflow: hidden;
    }
    .list-header {
      display: flex; align-items: center; padding: 10px 14px;
      background: var(--secondary-background-color, #f5f5f5);
      font-size: 11px; font-weight: 600; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .list-header-name { flex: 1; }
    .list-header-status { width: 120px; text-align: center; }
    .list-header-action { width: 80px; text-align: right; }
    .list-row {
      display: flex; align-items: center; padding: 10px 14px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer; transition: background 0.15s;
    }
    .list-row:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.03); }
    .list-row-name { flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0; }
    .list-row-icon { width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .list-row-icon img { width: 100%; height: 100%; object-fit: cover; }
    .list-row-icon .initials { font-size: 12px; font-weight: 700; color: #fff; }
    .list-row-title { font-size: 13px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .list-row-domain { font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0; }
    .list-row-status { width: 120px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .list-status-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
    .list-status-badge.state-loaded { background: rgba(76,175,80,0.12); color: #4caf50; }
    .list-status-badge.state-failed { background: rgba(244,67,54,0.12); color: #f44336; }
    .list-status-badge.state-disabled { background: rgba(158,158,158,0.12); color: #9e9e9e; }
    .list-status-badge.state-not-loaded { background: rgba(255,152,0,0.12); color: #ff9800; }
    .list-entry-count { font-size: 11px; color: var(--secondary-text-color); }
    .list-row-actions { width: 80px; text-align: right; display: flex; gap: 4px; justify-content: flex-end; }
    .list-action-btn {
      width: 28px; height: 28px; border: 1px solid var(--divider-color);
      border-radius: 6px; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .list-action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .list-action-btn.manage:hover { border-color: #9c27b0; color: #9c27b0; }
    .list-action-btn.reload:hover { border-color: #ff9800; color: #ff9800; }
    .list-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .chip-label { color: var(--primary-text-color); }
    .chip-count {
      font-size: 11px; padding: 1px 7px; border-radius: 10px;
      background: var(--divider-color, #e8e8e8); font-weight: 600;
    }

    .loading { text-align: center; padding: 60px 0; }
    .loading-text { font-size: 14px; color: var(--secondary-text-color); margin-top: 8px; }
    .spinner-sm {
      width: 20px; height: 20px; margin: 0 auto;
      border: 2px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%; animation: spin 1s linear infinite;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spinning { animation: spin 1s linear infinite; display: inline-block; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }

    /* ===== Card Grid ===== */
    .card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; overflow: hidden;
      cursor: pointer; position: relative;
      display: flex; flex-direction: column;
      transition: box-shadow 0.2s; touch-action: manipulation;
    }
    .card:hover {
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    }
    .card.card-failed { border-color: rgba(244,67,54,0.25); }
    .card.card-disabled { border-color: rgba(158,158,158,0.25); }
    .card.card-not-loaded { border-color: rgba(255,152,0,0.25); }
    .card:focus-visible {
      box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3,169,244), 0.3);
      outline: none;
    }

    /* ===== Card Image Area (compact, like store) ===== */
    .card-img {
      height: 120px; flex-shrink: 0; position: relative;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--secondary-background-color, #f0f0f0) 0%, var(--card-background-color, #fff) 100%);
    }
    .avatar {
      width: 52px; height: 52px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden; position: relative;
    }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
    .avatar-letter { font-size: 24px; font-weight: 700; color: #fff; z-index: 1; }
    /* Status badge overlay on image area (bottom left, like store) */
    .img-status-badge {
      position: absolute; bottom: 8px; left: 8px;
      padding: 3px 8px; border-radius: 5px;
      font-size: 11px; font-weight: 600; color: #fff; line-height: 1.3;
    }
    .img-status-badge.state-loaded { background: rgba(76,175,80,0.85); }
    .img-status-badge.state-failed { background: rgba(244,67,54,0.85); }
    .img-status-badge.state-disabled { background: rgba(158,158,158,0.85); }

    /* ===== Custom Integration & IoT Badges ===== */
    .img-badges {
      display: flex; gap: 3px;
      align-self: flex-end; margin-top: auto;
    }
    .img-badge {
      width: 18px; height: 18px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .img-badge.custom-badge { background: #9c27b0; color: #fff; }
    .img-badge.cloud-badge { background: rgba(0,0,0,0.4); color: #fff; }

    /* Category badge at top-left */
    .category-badge {
      position: absolute; top: 8px; left: 8px;
      padding: 3px 8px; border-radius: 5px;
      font-size: 10px; font-weight: 600; color: #fff; text-transform: uppercase;
    }

    .card-top-bar {
      position: absolute; top: 0; left: 0; right: 0; z-index: 2;
      display: flex; align-items: center; gap: 6px; padding: 8px;
    }
    .card-top-bar .category-badge {
      position: static; font-size: 9px; padding: 2px 7px; border-radius: 4px;
    }

    /* ===== Card Body ===== */
    .card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .card-name {
      font-size: 15px; font-weight: 600;
      color: var(--primary-text-color, #212121);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .card-meta {
      font-size: 12px; color: var(--secondary-text-color, #727272);
      display: flex; align-items: center; gap: 4px;
      flex-wrap: wrap;
    }
    .card-meta .dot-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--divider-color); }
    .card-meta .status-label { font-weight: 500; }

    /* ===== Card Footer Action Bar ===== */
    .card-footer {
      display: flex; gap: 4px; padding: 8px 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: 8px; position: relative;
    }
    .card-footer .footer-btn {
      flex: 1; min-width: 0;
      padding: 7px 10px; border-radius: 8px;
      font-size: 11px; font-weight: 500;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; touch-action: manipulation;
      display: flex; align-items: center; justify-content: center; gap: 3px;
      transition: all 0.15s; white-space: nowrap;
    }
    .card-footer .footer-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .card-footer .footer-btn.configure:hover { border-color: #2196f3; color: #2196f3; }
    .card-footer .footer-btn.manage:hover { border-color: #9c27b0; color: #9c27b0; }
    .card-footer .footer-btn.reload:hover { border-color: #ff9800; color: #ff9800; }
    .card-footer .footer-btn.remove:hover { border-color: #f44336; color: #f44336; }
    .card-footer .footer-btn svg { width: 13px; height: 13px; flex-shrink: 0; }
    .card-footer .footer-btn .spinning-mini { display: inline-block; animation: spin 1s linear infinite; font-size: 13px; }
    .card-footer .footer-btn .btn-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .config-arrow { font-size: 8px; margin-left: 2px; opacity: 0.7; }

    /* ===== Config Dropdown (multi-entry selector) ===== */
    .config-dropdown {
      position: absolute; top: 100%; left: 0; z-index: 100;
      min-width: 200px; margin-top: 4px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden; padding: 4px;
    }
    .config-dropdown-item {
      display: flex; align-items: center; gap: 8px; width: 100%;
      padding: 8px 10px; border: none; background: transparent;
      color: var(--primary-text-color); cursor: pointer;
      font-size: 12px; border-radius: 6px; text-align: left;
      transition: background 0.15s;
    }
    .config-dropdown-item:hover { background: var(--divider-color, #f0f0f0); }
    .config-dropdown-item .dd-icon {
      width: 24px; height: 24px; border-radius: 6px;
      background: var(--primary-color, #03a9f4); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 700; flex-shrink: 0;
    }
    .config-dropdown-item .dd-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .config-dropdown-item .dd-badge {
      font-size: 9px; padding: 2px 6px; border-radius: 4px;
      background: var(--primary-color, #03a9f4); color: #fff; font-weight: 600; flex-shrink: 0;
    }
    .config-dropdown-item .dd-badge.sub { background: #ff9800; }
    .config-dropdown-item .dd-badge.add { background: #4caf50; }

    /* ===== Modal ===== */
    .detail-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      padding: 40px; box-sizing: border-box;
      animation: overlayFadeIn 0.15s ease;
    }
    @media (max-width: 768px) {
      .controls { flex-wrap: nowrap; gap: 4px; margin-bottom: 0; }
      .search { flex: 1; min-width: 0; height: 36px; box-sizing: border-box; border: 1px solid var(--divider-color); border-radius: 10px; }
      .search input { padding: 7px 10px 7px 30px; font-size: 13px; border: none; background: transparent; height: 100%; }
      .search-icon { left: 10px; }
      .controls-right { flex-shrink: 0; }
      .desktop-only { display: none; }
      .filter-bar { padding: 6px 10px; flex-wrap: nowrap; overflow: hidden; }
      .filter-bar .fs-chips { display: none; }
      .filter-bar.expanded .fs-chips { display: flex; }
      .filter-bar.expanded { flex-wrap: wrap; }
      .filter-bar .fs-actions { display: none; }
      .filter-bar.expanded .fs-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; }
      .filter-toggle-sm { display: flex; }
      .detail-overlay { padding: 16px; }
      .filter-chip { padding: 4px 8px; font-size: 11px; }
    }
    @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px; width: 100%; max-width: 720px;
      max-height: 90vh; min-width: 360px;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
      user-select: text;
      -webkit-user-select: text;
      transition: all 0.3s ease;
    }
    .modal.expanded { max-width: 95vw; max-height: 95vh; width: 95vw; height: 95vh; }
    @media (min-width: 1024px) {
      .modal { max-width: 860px; }
      .modal.two-col { max-width: 960px; }
      .filter-bar { gap: 10px; }
      .fs-divider { margin: 0 18px; }
      .filter-chip { padding: 6px 16px; }
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }
    .modal-header-left { display: flex; align-items: center; gap: 12px; }
    .modal-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }
    .modal-subtitle { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
    .modal-close {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color);
      cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .modal-close svg { width: 16px; height: 16px; }
    .modal-close:hover { background: var(--primary-color, #03a9f4); color: #fff; }

    /* iframe modal 已废弃 (v5.0 改用直接跳转) */

    /* Tree action buttons (expand/collapse all) */
    .modal-header-right { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
    /* ===== Tree Container ===== */
    .tree-container {
      overflow-y: auto; flex: 1; padding: 4px 0;
    }
    .tree-empty {
      padding: 40px; text-align: center; color: var(--secondary-text-color); font-size: 14px;
    }
    .tree-action-btn {
      width: 30px; height: 30px; border: none; border-radius: 6px;
      background: none; cursor: pointer;
      font-size: 15px; line-height: 1;
      color: var(--secondary-text-color);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .tree-action-btn:hover { background: var(--divider-color, #e0e0e0); color: var(--primary-text-color); }
    .modal-search { padding: 12px 20px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    .modal-body {
      overflow-y: auto; flex: 1; padding: 8px 0;
    }
    .modal-body.grid-2col {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 0;
    }
    @media (min-width: 1024px) {
      .modal-body.grid-2col { grid-template-columns: 1.2fr 0.8fr; }
    }
    .col-left { overflow-y: auto; border-right: 1px solid var(--divider-color, #e0e0e0); padding: 8px 0; }
    .col-right { overflow-y: auto; padding: 16px; display: flex; flex-direction: column; align-items: center; }
    .col-title {
      font-size: 12px; font-weight: 600; color: var(--secondary-text-color);
      padding: 8px 20px 12px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .add-subentry-card {
      width: 100%; max-width: 240px;
      background: var(--secondary-background-color, #f5f5f5);
      border: 2px dashed var(--divider-color, #ccc);
      border-radius: 12px; padding: 24px 16px;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      text-align: center; margin-top: 8px;
    }
    .add-subentry-icon { color: var(--primary-color, #03a9f4); opacity: 0.5; }
    .add-subentry-text { font-size: 13px; color: var(--secondary-text-color); line-height: 1.5; }
    .add-subentry-btn {
      padding: 10px 20px; border-radius: 10px; border: none;
      background: var(--primary-color, #03a9f4); color: #fff;
      font-size: 14px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      transition: all 0.15s; touch-action: manipulation;
    }
    .add-subentry-btn:hover { opacity: 0.9; }

    /* Entry rows */
    .entry-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 20px; transition: background 0.1s;
    }
    .entry-row:hover { background: var(--secondary-background-color, #f5f5f5); }
    .entry-row.disabled { opacity: 0.45; }

    .entry-check-wrap {
      display: flex; align-items: center; flex-shrink: 0;
    }
    /* Unified custom checkbox style (consistent with updates view) */
    .integ-checkbox,
    .entry-checkbox,
    .card-checkbox {
      width: 18px; height: 18px; border-radius: 4px;
      border: 2px solid var(--secondary-text-color); cursor: pointer;
      flex-shrink: 0; transition: all 0.2s; background: transparent;
      -webkit-appearance: none; appearance: none; touch-action: manipulation;
      margin: 0; box-sizing: border-box;
    }
    .integ-checkbox:checked,
    .entry-checkbox:checked,
    .card-checkbox:checked {
      background: var(--primary-color); border-color: var(--primary-color);
    }
    .integ-checkbox:checked::after,
    .entry-checkbox:checked::after,
    .card-checkbox:checked::after {
      content: '✓'; display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 12px; font-weight: 700; line-height: 1;
    }
    .entry-icon {
      width: 28px; height: 28px; flex-shrink: 0;
      overflow: hidden; border-radius: 50%;
    }
    .entry-icon .avatar {
      width: 28px; height: 28px; font-size: 12px;
      box-shadow: none;
    }
    .entry-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .entry-info { flex: 1; min-width: 0; }
    .entry-label { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
    .entry-id {
      font-size: 11px; font-family: monospace;
      color: var(--secondary-text-color); display: block; margin-top: 1px;
    }
    .entry-actions { display: flex; gap: 2px; flex-shrink: 0; }

    /* ===== Batch Bar ===== */
    .batch-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; margin: 6px 0;
      background: var(--primary-color, #03a9f4); color: #fff;
      border-radius: 8px; font-size: 13px;
    }
    .batch-actions { display: flex; gap: 4px; margin-left: auto; }
    .batch-btn {
      padding: 4px 10px; border-radius: 5px; font-size: 11px; font-weight: 600;
      background: rgba(255,255,255,0.2); color: #fff;
      border: 1px solid rgba(255,255,255,0.35); cursor: pointer;
      transition: background 0.15s;
    }
    .batch-btn:hover { background: rgba(255,255,255,0.35); }
    .batch-btn.cancel {
      background: none; border-color: transparent; font-size: 14px; padding: 4px 6px;
    }
    .batch-btn.cancel:hover { background: rgba(255,255,255,0.15); }
    .entry-btn {
      width: 28px; height: 28px; padding: 0;
      display: inline-flex; align-items: center; justify-content: center;
      border: none; border-radius: 6px;
      background: none; font-size: 13px; cursor: pointer;
      color: var(--secondary-text-color); transition: all 0.15s;
    }
    .entry-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .entry-btn:not(:disabled):hover { background: rgba(33,150,243,0.08); color: #2196f3; }
    .entry-btn.reload:not(:disabled):hover { background: rgba(255,152,0,0.08); color: #ff9800; }
    .entry-btn.remove:not(:disabled):hover { background: rgba(244,67,54,0.08); color: #f44336; }
    .entry-btn.enable:not(:disabled):hover { background: rgba(76,175,80,0.08); color: #4caf50; }
    .entry-btn.disable:not(:disabled):hover { background: rgba(158,158,158,0.08); color: #9e9e9e; }

    /* ===== Tree Arrow ===== */
    .tree-arrow {
      width: 20px; height: 20px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--secondary-text-color);
      transition: transform 0.2s; border-radius: 4px;
    }
    .tree-arrow:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.08); color: var(--primary-color); }
    .tree-arrow svg { transition: transform 0.2s; }
    .tree-arrow.open svg { transform: rotate(0deg); }
    .tree-arrow:not(.open) svg { transform: rotate(-90deg); }
    .entry-row.expanded { background: var(--secondary-background-color, #f5f5f5); }

    /* ===== Entry Children (device tree container) ===== */
    .entry-children {
      padding: 0 20px 8px 48px;
    }
    .tree-loading {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 0; font-size: 13px; color: var(--secondary-text-color);
    }
    .spinner-xs {
      width: 14px; height: 14px;
      border: 2px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%; animation: spin 1s linear infinite; flex-shrink: 0;
    }
    .spinning-xs { animation: spin 1s linear infinite; display: inline-block; font-size: 11px; }
    .tree-empty-msg {
      padding: 12px 0; font-size: 13px; color: var(--secondary-text-color);
      text-align: center;
    }

    /* ===== Device Group ===== */
    .device-group { margin-bottom: 4px; }
    .device-group-header {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 0; border-bottom: 1px solid var(--divider-color, #eee);
      margin-bottom: 4px;
    }
    .device-group-name { font-size: 13px; font-weight: 600; color: var(--primary-text-color); }
    .device-group-count { font-size: 13px; color: var(--secondary-text-color); margin-left: auto; }

    /* ===== Device Row ===== */
    .device-row {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e8e8e8);
      border-radius: 8px; margin-bottom: 6px; overflow: hidden;
    }
    .device-row.expanded { border-color: var(--primary-color, #03a9f4); }
    .device-header {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 10px; cursor: pointer; user-select: none;
      transition: background 0.1s;
    }
    .device-header:hover { background: var(--secondary-background-color, #f5f5f5); }
    .device-arrow {
      width: 18px; height: 18px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      color: var(--secondary-text-color); transition: transform 0.2s;
    }
    .device-arrow svg { transition: transform 0.2s; }
    .device-arrow.open svg { transform: rotate(0deg); }
    .device-arrow:not(.open) svg { transform: rotate(-90deg); }
    .device-icon { color: var(--primary-color, #03a9f4); flex-shrink: 0; }
    .device-name { font-size: 13px; font-weight: 500; color: var(--primary-text-color); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .device-model { font-size: 13px; color: var(--secondary-text-color); }
    .device-ecount {
      font-size: 13px; color: var(--secondary-text-color);
      background: var(--divider-color, #e8e8e8);
      padding: 1px 7px; border-radius: 6px; flex-shrink: 0;
    }

    /* ===== Entity Rows ===== */
    .device-entities { border-top: 1px solid var(--divider-color, #eee); }
    .entity-row {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 10px; cursor: pointer; transition: background 0.1s;
      min-height: 30px;
    }
    .entity-row:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .entity-icon { font-size: 13px; width: 18px; text-align: center; flex-shrink: 0; }
    .entity-name {
      font-size: 13px; color: var(--primary-text-color);
      flex: 1; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .entity-state { font-size: 13px; font-weight: 500; flex-shrink: 0; margin-right: 2px; }
    .entity-toggle {
      width: 24px; height: 16px; border-radius: 8px; flex-shrink: 0;
      background: var(--secondary-background-color, #e0e0e0); position: relative;
      transition: background 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .entity-toggle.on { background: var(--primary-color, #03a9f4); }
    .entity-toggle::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 12px; height: 12px; border-radius: 50%;
      background: #fff; transition: transform 0.2s;
    }
    .entity-toggle.on::after { transform: translateX(8px); }
    .entity-toggle .spinning-xs { position: relative; z-index: 1; color: #fff; font-size: 10px; }
    .entity-more {
      font-size: 14px; color: var(--secondary-text-color); width: 16px; text-align: center; flex-shrink: 0;
      opacity: 0; transition: opacity 0.15s;
    }
    .entity-row:hover .entity-more { opacity: 1; }

    /* Mobile responsive */
    @media (max-width: 600px) {
      .detail-overlay { padding: 12px; }
      .modal { max-width: 100%; max-height: 92vh; }
      .modal-search { padding: 10px 16px; }
      .modal-body { padding: 4px 0; }
      .entry-btn { width: 32px; height: 32px; }
      .modal-body.grid-2col { grid-template-columns: 1fr; }
      .col-left { border-right: none; border-bottom: 1px solid var(--divider-color, #e0e0e0); max-height: 50vh; }
    }

    /* ===== Add Integration Side Panel ===== */
    /* Add integration search input */
    .add-search-input {
      width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color); font-size: 14px; outline: none; box-sizing: border-box;
    }
    .add-search-input:focus { border-color: var(--primary-color, #03a9f4); }
    .add-panel-count { padding: 8px 20px; font-size: 12px; color: var(--secondary-text-color); flex-shrink: 0; }
    .add-panel-list { flex: 1; overflow-y: auto; padding: 4px 0; }
    .add-loading, .add-empty { padding: 40px; text-align: center; color: var(--secondary-text-color); }
    .add-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 20px; cursor: pointer; transition: background 0.1s;
    }
    .add-item:hover { background: rgba(var(--rgb-primary-color, 3,169,244), 0.04); }
    .add-item-name { font-size: 14px; font-weight: 500; color: var(--primary-text-color); }
    .add-item-domain {
      font-size: 12px; background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      color: var(--primary-color, #03a9f4); padding: 2px 8px; border-radius: 4px; margin-left: auto;
    }

    @media (max-width: 600px) {
      .card-img { height: 100px; }
      .avatar { width: 44px; height: 44px; font-size: 20px; }
      .card-footer .footer-btn { min-height: 44px; font-size: 12px; }
      .card-footer .footer-btn .btn-label { display: inline; }
      .detail-overlay { padding: 12px; }
      .modal { max-width: 100%; max-height: 92vh; }
      /* Tree mobile */
      .entry-children { padding: 0 12px 8px 36px; }
      .entry-row { padding: 10px 12px; }
      .entity-row { min-height: 36px; padding: 7px 8px; }
      .device-header { padding: 8px 8px; }
      .device-name { font-size: 13px; }
      .entity-name { font-size: 13px; }
      .entity-state { font-size: 13px; }
    }
  `]}customElements.define("integrations-list",ni);class li extends ae{static properties={hass:{type:Object},domain:{type:String},entryId:{type:String},configEntries:{type:Object},isReconfigure:{type:Boolean},flowAction:{type:String},open:{type:Boolean,reflect:!0},_loading:{type:Boolean,state:!0},_flowId:{type:String,state:!0},_step:{type:Object,state:!0},_errors:{type:Object,state:!0},_finished:{type:Boolean,state:!0},_result:{type:Object,state:!0},_isOptions:{type:Boolean,state:!0},_isSubentry:{type:Boolean,state:!0},_subentryTypes:{type:Array,state:!0},_subentryType:{type:String,state:!0},_existingSubentries:{type:Array,state:!0},_isSubentryReconfigure:{type:Boolean,state:!0},_subentryReconfigureId:{type:String,state:!0},_forceFlowType:{type:String},_passwordVisible:{type:Boolean,state:!0}};constructor(){super(),this.domain="",this.entryId=null,this.configEntries=null,this.open=!1,this._loading=!1,this._flowId=null,this._step=null,this._errors={},this._finished=!1,this._result=null,this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this._loadingTimeout=null,this._translations=null,this._lang="zh-Hans",this._dialogDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1},this._cleanedUp=!1}_getHass(){if(this.hass)return this.hass;try{const e=window.parent?.document?.querySelector("home-assistant");return e?.hass||null}catch(e){return null}}_clearLoadingTimeout(){this._loadingTimeout&&(clearTimeout(this._loadingTimeout),this._loadingTimeout=null)}_startLoadingTimeout(){this._clearLoadingTimeout(),this._loadingTimeout=setTimeout(()=>{this._loading&&!this._finished&&(this._clearLoadingTimeout(),this._finished=!0,this._result={type:"error",message:xe("flowTimeout")},this._loading=!1,this.requestUpdate())},3e4)}connectedCallback(){super.connectedCallback(),this._boundDelegatedClick=this._delegatedClick.bind(this),this._boundDelegatedSubmit=this._delegatedSubmit.bind(this)}firstUpdated(){this.shadowRoot&&(this.shadowRoot.addEventListener("click",this._boundDelegatedClick),this.shadowRoot.addEventListener("submit",this._boundDelegatedSubmit))}disconnectedCallback(){super.disconnectedCallback(),this._clearLoadingTimeout(),this._cleanedUp=!0,this.shadowRoot&&(this.shadowRoot.removeEventListener("click",this._boundDelegatedClick),this.shadowRoot.removeEventListener("submit",this._boundDelegatedSubmit))}_delegatedClick(e){const t=e.target?.closest?.(".btn.primary");if(!t||"submit"!==t.type||t.disabled)return;if(this._loading||this._finished)return;e.preventDefault(),e.stopPropagation();const i=t.closest("form");i&&this._submitStep(this._collectFormData(i))}_delegatedSubmit(e){const t=e.target?.closest?.("form");t&&(e.preventDefault(),e.stopPropagation(),this._loading||this._finished||this._submitStep(this._collectFormData(t)))}_dialogPointerDown(e){const t=e.target.closest(".header");if(!t||e.target.closest("button"))return;if(void 0!==e.button&&0!==e.button)return;const i=this._dialogDrag,o=e.currentTarget;i.dragging=!0,i.startX=e.clientX-i.offsetX,i.startY=e.clientY-i.offsetY,o.style.transition="none",o.style.cursor="grabbing",t.style.userSelect="none",o.setPointerCapture(e.pointerId);const r=e=>{i.dragging&&(i.offsetX=e.clientX-i.startX,i.offsetY=e.clientY-i.startY,o.style.transform=`translate(${i.offsetX}px, ${i.offsetY}px)`)},s=e=>{i.dragging=!1,o.style.cursor="",t.style.userSelect="",o.removeEventListener("pointermove",r),o.removeEventListener("pointerup",s),o.removeEventListener("pointercancel",s);try{o.releasePointerCapture(e.pointerId)}catch(e){}};o.addEventListener("pointermove",r),o.addEventListener("pointerup",s),o.addEventListener("pointercancel",s)}updated(e){try{(e.has("open")&&this.open||this.open&&(e.has("entryId")||e.has("domain")))&&this._startFlowWithEntryCheck(),e.has("open")&&!this.open&&!0===e.get("open")&&console.warn("HACS Vision: dialog closed unexpectedly",{flowId:this._flowId,loading:this._loading,finished:this._finished,step:this._step?.step_id,isOptions:this._isOptions,isReconfigure:this.isReconfigure,isSubentry:this._isSubentry,result:this._result?.type,errorMsg:this._result?.message?.slice(0,80)})}catch(e){console.error("HACS Vision: updated() error:",e)}}_startFlowWithEntryCheck(){if(this.entryId)if(this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.isReconfigure)this._isOptions=!1,this._startFlow();else if("add-subentry"===this.flowAction){const e=this._findEntry(this.entryId);e&&e.supported_subentry_types&&e.supported_subentry_types.length>0&&(this._isSubentry=!0,this._subentryTypes=e.supported_subentry_types,this._loadExistingSubentries()),this._startFlow()}else{if("options"===this._forceFlowType)return this._isOptions=!0,void this._startFlow();if("reconfigure"===this._forceFlowType)return this.isReconfigure=!0,void this._startFlow();if("subentry"===this._forceFlowType){const e=this._findEntry(this.entryId);return e&&e.supported_subentry_types&&e.supported_subentry_types.length>0&&(this._isSubentry=!0,this._subentryTypes=e.supported_subentry_types,this._loadExistingSubentries()),void this._startFlow()}const e=this._findEntry(this.entryId);e?.supports_options?(this._isOptions=!0,this._startFlow()):e?.supported_subentry_types?.length>0?(this._isSubentry=!0,this._subentryTypes=e.supported_subentry_types,this._loadExistingSubentries(),this._startFlow()):(this._loading=!1,this._finished=!0,this._result={type:"abort",reason:"no_config"},this.requestUpdate())}else this.domain&&(this._isOptions=!1,this.entryId=null,this._startFlow())}openFlow(e){this.entryId=null,this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.domain=e,this.open=!0}openOptionsFlow(e){this.domain="",this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.entryId=e,this.open=!0}_findEntry(e){if(!this.configEntries||!e)return null;for(const t of Object.values(this.configEntries)){const i=t.find(t=>t.entry_id===e);if(i)return i}return null}async _loadExistingSubentries(){if(this.entryId)try{const e=await de.getSubentries(this.entryId);this._existingSubentries=e?.subentries||[]}catch{this._existingSubentries=[]}}async _loadTranslations(e){if(!e)return;if(this._translations&&this._translations._domain===e)return;let t={};try{const i=await de.getTranslations(e,this._lang),o=i?.data||{};t=this._deepMerge(t,o)}catch(e){}try{const i=this._getHass();if(i&&"function"==typeof i.loadBackendTranslation){let o;try{o=await i.loadBackendTranslation("config",e)}catch(t){try{o=await i.loadBackendTranslation(e,"config")}catch(i){console.warn(`HACS Vision: loadBackendTranslation failed for ${e}:`,t?.message||i?.message)}}o&&"object"==typeof o&&"object"==typeof o&&Object.keys(o).length>0&&(o=this._flatToNested(o),t=this._deepMerge(t,o),console.debug(`HACS Vision: loaded HA backend translations for ${e}:`,Object.keys(o).length,"keys"))}else console.warn("HACS Vision: hass.loadBackendTranslation is not available")}catch(t){console.warn(`HACS Vision: loadBackendTranslation error for ${e}:`,t)}if(this._isOptions)try{const i=this._getHass();if(i&&"function"==typeof i.loadBackendTranslation){let o;try{o=await i.loadBackendTranslation("options",e)}catch(t){try{o=await i.loadBackendTranslation(e,"options")}catch(e){}}o&&"object"==typeof o&&Object.keys(o).length>0&&(o=this._flatToNested(o),t=this._deepMerge(t,o))}}catch(e){}this._translations={_domain:e,_data:t}}_deepMerge(e,t){for(const i of Object.keys(t))t[i]&&"object"==typeof t[i]&&!Array.isArray(t[i])?(e[i]&&"object"==typeof e[i]||(e[i]={}),this._deepMerge(e[i],t[i])):e[i]=t[i];return e}_flatToNested(e){if(!e||"object"!=typeof e)return e;const t=Object.keys(e)[0];if(!t||!t.includes("."))return e;const i={};for(const[t,o]of Object.entries(e)){if("string"!=typeof o)continue;const e=t.split(".");let r=i;for(let t=0;t<e.length-1;t++)r[e[t]]&&"object"==typeof r[e[t]]||(r[e[t]]={}),r=r[e[t]];r[e[e.length-1]]=o}return i}_t(e){if(!this._translations?._data)return null;const t="component."+this._translations._domain+".",i=e.startsWith(t)?e.slice(t.length):e;let o=this._traverse(this._translations._data,i);return o||(i.startsWith("config.")&&(o=this._traverse(this._translations._data,"options."+i.slice(7)),o)?o:null)}_traverse(e,t){const i=t.split(".");let o=e;for(const e of i){if(null==o||"object"!=typeof o)return null;o=o[e]}return"string"==typeof o?o:null}async _startFlow(){if(this._isSubentry&&!this._subentryType&&!this._isSubentryReconfigure)return this._loading=!1,this._finished=!1,this._result=null,this._step=null,void this.requestUpdate();this._loading=!0,this._finished=!1,this._result=null,this._step=null,this._errors={},this.requestUpdate(),this._startLoadingTimeout();try{const e=this._isOptions||this._isSubentry?this._getFlowDomain():this.domain;let t;e&&await this._loadTranslations(e),t=this._isSubentryReconfigure&&this._subentryType&&this.entryId?await de.startSubentryFlow(this.entryId,this._subentryType,{source:"reconfigure",subentry_id:this._subentryReconfigureId}):this._isSubentry&&this._subentryType&&this.entryId?await de.startSubentryFlow(this.entryId,this._subentryType):this._isOptions&&this.entryId?await de.startOptionsFlow(this.entryId):this.isReconfigure&&this.entryId?await de.startConfigFlow(this.domain,{source:"reconfigure",entry_id:this.entryId}):await de.startConfigFlow(this.domain),await this._handleFlowResponse(t)}catch(e){console.error("HACS Vision: _startFlow caught error:",e?.message,e?.stack);const t=e?.message?.includes("404");console.warn("HACS Vision: _startFlow error",{is404:t,isOptions:this._isOptions,entryId:this.entryId,domain:this.domain}),t?console.warn("HACS Vision: config flow 404 (expected for non-configurable integrations):",e?.message):console.error("HACS Vision: config flow start error:",e),this._clearLoadingTimeout(),this._finished=!0,this._result={type:"error",message:this._getFlowErrorMessage(e)},this._loading=!1,this.requestUpdate()}}async _handleFlowResponse(e){if("abort"===e.type)return this._finished=!0,this._result={type:"abort",reason:e.reason},this._loading=!1,void this.requestUpdate();if("create_entry"===e.type)return this._finished=!0,this._result={type:"create_entry",title:e.title||this.domain||xe("flowDone")},this._loading=!1,this.requestUpdate(),void setTimeout(()=>{try{this._close()}catch(e){}},600);if("already_in_progress"!==e.type){if("form"===e.type){this._flowId=e.flow_id||e.flowId,this._step=e,this._errors=e.errors||{};const t=this._getFlowDomain()||e.handler;return t&&await this._loadTranslations(t),this._loading=!1,void this.requestUpdate()}if("external"===e.type){this._finished=!0;const t=e.url||"";return this._result={type:"external",url:t,message:xe("flowExternalAuth")},this._loading=!1,void this.requestUpdate()}if("menu"===e.type)return this._flowId=e.flow_id||e.flowId,this._step=e,this._errors={},this._loading=!1,void this.requestUpdate();this._finished=!0,this._result={type:"unsupported",message:xe("flowUnknownType",{type:e.type})},this._loading=!1,this.requestUpdate()}else{this._flowId=e.flow_id||e.flowId,this._clearLoadingTimeout();try{const e=await(this._isOptions?de.stepOptionsFlow(this._flowId,{}):de.stepConfigFlow(this._flowId,{}));await this._handleFlowResponse(e)}catch(e){this._finished=!0,this._result={type:"error",message:this._getFlowErrorMessage(e)},this._loading=!1,this.requestUpdate()}}}async _submitStep(e){this._loading=!0,this._errors={},this.requestUpdate();try{let t;t=this._isSubentry&&this._flowId?await de.stepSubentryFlow(this._flowId,e):this._isOptions&&this._step?await de.stepOptionsFlow(this._flowId,e):await de.stepConfigFlow(this._flowId,e),await this._handleFlowResponse(t)}catch(e){console.error("HACS Vision: flow step error:",e),this._errors={base:e.message||xe("flowSubmitFailed")},this._loading=!1,this.requestUpdate()}}_collectFormData(e){const t={};try{const i=this._step?.data_schema||[];for(const o of i){const i=o.name;if(!i)continue;const r=e[i];if(r)if("checkbox"===r.type)if("number"==typeof r.length&&r.length>1&&"checkbox"===r[0]?.type){t[i]=[];for(let e=0;e<r.length;e++)r[e].checked&&t[i].push(r[e].value)}else t[i]=r.checked;else void 0!==r.value&&null!==r.value&&(t[i]=void 0===r.valueAsNumber||isNaN(r.valueAsNumber)||"number"!==r.type?r.value:r.valueAsNumber)}}catch(e){console.error("HACS Vision: _collectFormData error:",e)}return t}_handleSubmit(e){e.preventDefault(),this._loading||this._submitStep(this._collectFormData(e.target))}_handlePrimaryClick(e){if(this._loading)return;const t=e.currentTarget?.closest?.("form");t&&this._submitStep(this._collectFormData(t))}_handleMenuSelect(e){this._submitStep({next_step_id:e})}_onMultiCheckboxChange(e){this.requestUpdate()}_handleSubentrySelect(e){this._subentryType=e,this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this._startFlow()}_handleExistingSubentrySelect(e){this._subentryType=e.subentry_type,this._isSubentryReconfigure=!0,this._subentryReconfigureId=e.subentry_id,this._subentryType=e.subentry_type,this._startFlow()}_cancelFlow(){const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._dialogDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1},this._flowId&&(this._isSubentry?de.cancelSubentryFlow(this._flowId).catch(()=>{}):de.cancelConfigFlow(this._flowId).catch(()=>{})),this._close()}_close(){try{this._clearLoadingTimeout(),this.open=!1,this._flowId=null,this._step=null,this._finished=!1,this._result=null,this._errors={},this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.domain="",this.entryId=null,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}catch(e){console.error("HACS Vision: config flow close error:",e),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}}static styles=[Se(),s`
    :host { display: block; }
    :host([open]) {
      /* Use position:fixed with inset:0 for full-viewport coverage.
         Note: In shadow DOM, fixed position is relative to the shadow host's
         containing block, not the viewport. Use vw/vh as cross-check. */
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9999;
      pointer-events: none;
    }
    .overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 9999;
      display: grid; place-items: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.2s ease;
      pointer-events: auto;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 90%; max-width: 580px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      animation: slideUp 0.25s ease;
      user-select: text;
      -webkit-user-select: text;
    }
    @media (min-width: 1024px) {
      .overlay { padding: 40px; }
      .dialog { max-width: 680px; max-height: 80vh; }
    }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .title { font-size: 18px; font-weight: 700; color: var(--primary-text-color, #212121); }
    .cfg-avatar {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--primary-color, #03a9f4); overflow: hidden;
    }
    .cfg-avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .cfg-avatar-letter { font-size: 14px; font-weight: 700; color: #fff; z-index: 1; }
    .close-btn {
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: var(--divider-color, #e0e0e0);
      color: var(--secondary-text-color, #727272);
      cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .close-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .close-btn svg { width: 16px; height: 16px; }

    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 12px;
    }
    .step-desc {
      font-size: 14px; color: var(--secondary-text-color, #727272);
      margin-bottom: 16px;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .step-desc a { color: var(--primary-color, #03a9f4); text-decoration: underline; word-break: break-all; }
    .step-indicator {
      font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 1px;
    }

    /* Form Fields — match store card style */
    .form-field { margin-bottom: 16px; }
    .form-field label {
      display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;
      color: var(--primary-text-color, #212121);
    }
    .form-field input, .form-field select, .form-field textarea {
      width: 100%; box-sizing: border-box;
      padding: 10px 12px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; font-size: 14px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .form-field textarea {
      min-height: 80px; resize: vertical;
      line-height: 1.5;
    }
    .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
      border-color: var(--primary-color, #03a9f4); outline: none;
    }
    .form-field select { cursor: pointer; appearance: auto; }
    .field-desc { font-size: 12px; color: var(--secondary-text-color, #727272); margin-bottom: 6px; line-height: 1.5; }
    .checkbox-label {
      display: inline-flex; align-items: center; gap: 10px;
      cursor: pointer; font-size: 14px; font-weight: 400;
      padding: 6px 0;
    }
    .checkbox-label input[type="checkbox"] { width: auto; margin: 0; flex-shrink: 0; }
    .multi-select-checkboxes { display: flex; flex-direction: column; gap: 4px; padding: 4px 0; }
    .multi-select-checkboxes .multi-option { display: flex; align-items: center; gap: 8px; padding: 4px 0; cursor: pointer; }
    .multi-select-checkboxes .multi-option:hover { background: var(--primary-color, #03a9f4)08; }
    .form-error { color: #f44336; font-size: 12px; margin-top: 4px; }

    /* Menu (step type) — match store action-btn style */
    .menu-option {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; margin-bottom: 8px;
      cursor: pointer; transition: all 0.2s;
      background: var(--card-background-color, #fff);
    }
    .menu-option:hover {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.04);
    }
    .menu-option .menu-label { font-size: 14px; font-weight: 500; flex: 1; }
    .menu-option .menu-desc { font-size: 12px; color: var(--secondary-text-color); }
    .menu-option .menu-arrow { color: var(--secondary-text-color); font-size: 18px; }
    .menu-label-group { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .menu-sublabel { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 1px; }
    .menu-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; background: rgba(var(--rgb-primary-color, 3,169,244), 0.1); flex-shrink: 0; }
    .subentry-divider { height: 1px; background: var(--divider-color, #e0e0e0); margin: 10px 0; }
    .subentry-columns { display: flex; gap: 20px; }
    .subentry-col { flex: 1; min-width: 0; }

    /* Result States */
    .result { text-align: center; padding: 24px 0; }
    .result-icon { width: 48px; height: 48px; margin: 0 auto 12px; }
    .result-icon.success { color: #4caf50; }
    .result-icon.abort { color: #ff9800; }
    .result-icon.error { color: #f44336; }
    .result-icon.external { color: #2196f3; }
    .result-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
    .result-desc { font-size: 14px; color: var(--secondary-text-color, #727272); margin-bottom: 16px; }

    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
    .btn {
      padding: 8px 20px; border-radius: 10px; border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; font-size: 14px; font-family: inherit;
      transition: all 0.2s;
    }
    .btn.primary {
      background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color);
    }
    .btn.primary:hover { opacity: 0.9; color: #fff; }
    .btn.external {
      background: #2196f3; border-color: #2196f3; color: #fff;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
      border-radius: 10px; padding: 8px 20px;
    }

    @media (max-width: 600px) {
      .overlay { padding: 12px; }
      .dialog { padding: 16px; }
      .dialog { max-width: 100%; max-height: 92vh; border-radius: 16px; padding-bottom: 24px; }
    }

    /* Loading overlay for form submission */
    .submit-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.45); display: flex;
      align-items: center; justify-content: center;
      flex-direction: column; gap: 16px;
    }
    .submit-spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: submit-spin 0.8s linear infinite;
    }
    @keyframes submit-spin { to { transform: rotate(360deg); } }
    .submit-text { color: #fff; font-size: 15px; font-weight: 500; }
  `];render(){try{return this.open?this._renderContent():""}catch(e){return console.error("HACS Vision: render crash:",e,e?.stack),N`<div class="overlay" style="display:flex;align-items:center;justify-content:center;"><div class="dialog" style="padding:40px;color:red;background:#fff;">${xe("renderCrash")}: ${e?.message}<br><br><button class="btn primary" @click=${this._close}>${xe("close")}</button></div></div>`}}_renderContent(){const e=this._isSubentry?(this._getFlowDomain()||"")+" - "+xe("subentryTitle"):this._isOptions?this._getFlowDomain()||xe("flowTitleOptions"):this._step?.title||this._localizeTitle()||this._step?.handler||this.domain||xe("flowTitle");this._step;const t=this._step?.step_id&&this._flowId&&!this._loading&&!this._finished;return N`
      <div class="overlay" role="dialog" aria-modal="true" aria-label="${this._flowTitle||xe("flowTitle")}" @click=${e=>{e.target.classList.contains("overlay")&&this._cancelFlow()}} @keydown=${e=>{"Escape"===e.key&&this._cancelFlow()}}>
        <div class="dialog" @pointerdown=${this._dialogPointerDown}>
          <div class="header">
            <div class="header-left">
              ${this.domain?N`
                <div class="cfg-avatar">
                  <img class="cfg-avatar-img" src="https://brands.home-assistant.io/${this.domain}/icon.png" alt=""
                    @error=${function(){try{if(!this.parentElement)return;this.style.display="none";const e=this.parentElement.querySelector(".cfg-avatar-letter");e&&(e.style.display="flex")}catch(e){}}}>
                  <span class="cfg-avatar-letter" style="display:none">${this.domain.charAt(0).toUpperCase()}</span>
                </div>
              `:""}
              <div>
                <span class="title">${e}</span>
                ${t?N`<div class="step-indicator">${xe("flowStep")} ${this._step.step_id}</div>`:""}
              </div>
            </div>
            <button class="close-btn" aria-label="${xe("close")}" @click=${this._cancelFlow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          ${this._loading?N`
            <div class="loading">
              <div class="spinner"></div>
              <div>${xe("flowProcessing")}</div>
            </div>
          `:""}

          ${this._finished&&this._result?this._renderResult():""}

          ${this._loading||this._finished||!this._step?"":this._renderStep()}

          ${this._loading&&this._step&&!this._finished?N`
            <div class="submit-overlay">
              <div class="submit-spinner"></div>
              <div class="submit-text">${xe("flowProcessing")}</div>
            </div>
          `:""}

          ${this._loading||this._finished||this._step||this._result||!this._isSubentry||this._subentryType?"":N`
            <div class="subentry-list">
              <div class="subentry-columns">
              ${this._existingSubentries.length>0?N`
                <div class="subentry-col">
                  <div class="step-desc" style="margin-bottom:8px;font-weight:600;">${xe("subentryExisting")}</div>
                  ${this._existingSubentries.map(e=>N`
                    <div class="menu-option" @click=${()=>this._handleExistingSubentrySelect(e)}>
                      <span class="menu-icon">⚙</span>
                      <div class="menu-label-group">
                        <span class="menu-label">${e.title||this._getSubentryTypeLabel(e.subentry_type)}</span>
                        <span class="menu-sublabel">${this._getSubentryTypeLabel(e.subentry_type)}</span>
                      </div>
                      <span class="menu-arrow">${xe("subentryReconfigure")}</span>
                    </div>
                  `)}
                </div>
              `:""}

                <div class="subentry-col">
                  <div class="step-desc" style="margin-bottom:8px;font-weight:600;">${xe("subentryAddNew")}</div>
                  ${this._subentryTypes.map(e=>N`
                    <div class="menu-option" @click=${()=>this._handleSubentrySelect(e)}>
                      <span class="menu-icon">+</span>
                      <span class="menu-label">${xe("subentryAddPrefix")} ${this._getSubentryTypeLabel(e)}</span>
                      <span class="menu-arrow">→</span>
                    </div>
                  `)}
                </div>
              </div>
              <div class="actions" style="margin-top:16px">
                <button class="btn" @click=${this._cancelFlow}>${xe("flowCancel")}</button>
              </div>
            </div>
          `}

          ${this._loading||this._finished||this._step||this._result||this._isSubentry&&!this._subentryType?"":N`
            <div class="loading">
              <div class="spinner"></div>
              <div>${xe("flowStarting")}</div>
            </div>
          `}
        </div>
      </div>
    `}_renderStep(){const e=this._step;return e?"menu"===e.type?this._renderMenu(e):"form"===e.type?this._renderForm(e):N`<div class="result error"><div class="result-title">${xe("flowResultFailed")}: ${e.type}</div></div>`:""}_renderMenu(e){const t=this._buildDescription(e),i=e.menu_options||[];return N`
      ${t?N`<div class="step-desc" .innerHTML=${t}></div>`:""}
      <div class="menu-list">
        ${i.map((t,i)=>{const o="string"==typeof t,r=o?t:t.value||"",s=this._t(`component.${this._getFlowDomain()}.config.step.${e.step_id}.menu_options.${r}`)||this._isOptions&&this._t(`component.${this._getFlowDomain()}.options.step.${e.step_id}.menu_options.${r}`)||(o?t:t.label||t.title||t.value||""),a=o?"":t.description||"";return N`
            <div class="menu-option" @click=${()=>this._handleMenuSelect(r)}>
              <span class="menu-label">${s}</span>
              ${a?N`<span class="menu-desc">${a}</span>`:""}
              <span class="menu-arrow">→</span>
            </div>
          `})}
      </div>
      <div class="actions">
        <button class="btn" @click=${this._cancelFlow}>${xe("flowCancel")}</button>
      </div>
    `}_renderForm(e){const t=this._buildDescription(e),i=e.data_schema||[],o=this._errors?.base||"";return N`
      ${t?N`<div class="step-desc" .innerHTML=${t}></div>`:""}
      ${o?N`<div class="form-error" style="margin-bottom:12px">${o}</div>`:""}
      <form @submit=${this._handleSubmit}>
        ${i.map(e=>this._renderField(e))}
        <div class="actions">
          <button type="button" class="btn" @click=${this._cancelFlow} ?disabled=${this._loading}>${xe("flowCancel")}</button>
          <button type="submit" class="btn primary" @click=${this._handlePrimaryClick} ?disabled=${this._loading}>
            ${this._loading?xe("flowProcessing"):this._isOptions||e.last_step?xe("flowSubmit"):xe("flowStepNext")}
          </button>
        </div>
      </form>
    `}_buildDescription(e){let t=e.description||e.description_placeholders?.description||"";if(t&&t.includes(".")){const e=this._t(t)||null;e&&(t=e)}if(!t){const e=this._translateField("description");e&&(t=e)}const i=e.description_placeholders||{};for(const[e,o]of Object.entries(i)){const i=null!=o&&"object"!=typeof o?String(o):"";t=t.replace(new RegExp(`\\{${e}\\}`,"g"),i)}if(t=t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%;height:auto;display:block;margin:8px 0" loading="lazy">'),/<\s*a\b[\s\S]*?<\/a>/i.test(t)||(t=t.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--primary-color,#03a9f4);text-decoration:underline">$1</a>')),!t&&Object.keys(i).length>0){const e=Object.entries(i).map(([,e])=>null!=e&&"object"!=typeof e?String(e):"").filter(Boolean);t=e.join("\n")}return t?Wt.sanitize(t,{ALLOWED_TAGS:["a","img","b","i","strong","em","code","br"],ALLOWED_ATTR:["href","target","rel","style","src","alt","loading"],ALLOW_DATA_ATTR:!1}):""}_getFlowDomain(){if(this.domain)return this.domain;if(this.entryId&&this.configEntries)for(const e of Object.values(this.configEntries))for(const t of e)if(t.entry_id===this.entryId)return t.domain||"";const e=this._step?.handler;return e&&!/^[0-9A-Z]{20,}$/.test(e)?e:""}_getSubentryTypeLabel(e){const t={conversation:"subentryConversation",tts:"subentryTts",stt:"subentryStt",translation:"subentryTranslation",ai_task_data:"subentryAiTaskData",device:"subentryDevice",wecom:"subentryWecom",wechat:"subentryWechat",qq:"subentryQq",feishu:"subentryFeishu",dingtalk:"subentryDingtalk",xiaoyi:"subentryXiaoyi",custom:"subentryCustom"}[e];return t?xe(t):e}_localizeTitle(){const e=this._getFlowDomain(),t=this._step?.step_id;if(e&&t){const e=this._translateField("title");if(e)return e}if(e){const t=`component.${e}.title`,i=this._t(t);if(i)return i}return""}_translateField(e){const t=this._getFlowDomain(),i=this._step?.step_id;if(!t||!i)return null;if(this._isSubentry&&this._subentryType){const o=`component.${t}.config_subentries.${this._subentryType}.step.${i}.${e}`,r=this._t(o);if(r)return r}const o=`component.${t}.config.step.${i}.${e}`;return this._t(o)}_getFieldLabel(e){const t=this._translateField(`data.${e.name}`);return t||(e.label||this._friendlyName(e.name))}_friendlyName(e){return e.replace(/_/g," ").replace(/(^|\s)\w/g,e=>e.toUpperCase()).replace(/Id\b/gi,"ID").replace(/Ip\b/gi,"IP").replace(/Url\b/gi,"URL").replace(/Api\b/gi,"API")}_getFieldDescription(e){const t=this._translateField(`data.${e.name}.description`);if(t)return t;const i=e.description;return"string"==typeof i?i:""}_getFieldPlaceholder(e){const t=this._translateField(`data.${e.name}.placeholder`);return t||(e.placeholder||"")}_getOptionLabel(e,t){const i=this._translateField(`data.${e.name}.options.${t}`);return i||null}_getFlowErrorMessage(e){const t=e?.message||"";return t.includes("404")?this._isSubentry?this._getSubentryTypeLabel(this._subentryType)+" "+xe("flowHandlerNotFound"):this._isOptions?xe("flowOptionsNotSupported"):xe("flowHandlerNotFound"):t.includes("500")&&this._isOptions?xe("flowOptionsNotSupported"):t.includes("401")||t.includes("403")?xe("flowAuthError"):t||(this._isOptions?xe("flowStartFailedOptions"):xe("flowStartFailed"))}_renderField(e){try{return this._renderFieldSafe(e)}catch(t){return console.error("HACS Vision: field render error:",e?.name,t),N`<div style="color:red;padding:8px;">${xe("fieldError")}: "${e?.name}" ${t?.message}</div>`}}_renderFieldSafe(e){const t=e.name,i=this._getFieldLabel(e),o=e.type||"string",r=!1!==e.required,s=e.description?.suggested_value,a=void 0!==e.default&&null!==e.default||null!=s,n=void 0!==e.default&&null!==e.default?e.default:void 0!==s?s:"",l=this._getFieldPlaceholder(e),d=this._getFieldDescription(e),c=this._errors?.[t]||"",p=!0===e.multiline,h=!0===e.password||"password"===e.type||/token|secret|password|key|api_key|apiKey/i.test(t)&&"string"===o,g=e.selector||{},u=Object.keys(g)[0];if("select"===o||"multi_select"===o||e.options||e.enum||"select"===u){let s=e.options||e.enum||[];!s.length&&g.select?.options&&(s=g.select.options);const l="multi_select"===o||!0===g.select?.multiple;s.length||console.warn(`HACS Vision: select field "${t}" has empty options`,e);let p=[];return Array.isArray(s)?p=s:s&&"object"==typeof s&&(p=Object.entries(s).map(([e,t])=>({value:e,label:t}))),p=p.filter(Boolean).map(e=>{if("string"==typeof e)return{value:e,label:e};if(Array.isArray(e))return{value:e[0],label:e[1]||e[0]};if(e&&"object"==typeof e){const t=e.value??e.val??e.id??Object.values(e)[0]??"",i=e.label??e.name??e.description??Object.values(e)[1]??t;return{value:String(t),label:String(i)}}return{value:String(e),label:String(e)}}),N`
        <div class="form-field">
          <label>${i}${r?" *":""}</label>
          ${d?N`<div class="field-desc">${d}</div>`:""}
          ${l?N`
            <!-- multi_select: render as checkboxes instead of multi-select dropdown -->
            <div class="multi-select-checkboxes">
              ${p.map(i=>{const o=this._getOptionLabel(e,i.value)||i.label,r=a&&(Array.isArray(n)?n.includes(i.value):n===i.value);return N`
                  <label class="checkbox-label multi-option">
                    <input type="checkbox" name=${t} value=${i.value}
                           ?checked=${r} @change=${this._onMultiCheckboxChange}>
                    <span>${o}</span>
                  </label>
                `})}
            </div>
          `:N`
            <select name=${t} ?required=${r}>
              ${r?"":N`<option value="">${xe("flowSelectOption")}</option>`}
              ${p.map(t=>{const i=this._getOptionLabel(e,t.value)||t.label,o=a&&n===t.value;return N`<option value=${t.value} ?selected=${o}>${i}</option>`})}
            </select>
          `}
          ${c?N`<div class="form-error">${c}</div>`:""}
        </div>
      `}if("boolean"===o||"boolean"===u){if("back"===t&&!r)return N`
          <div class="form-field">
            <button type="button" class="btn" @click=${this._cancelFlow}>${xe("flowBack")}</button>
          </div>
        `;return N`
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" name=${t} ?checked=${!0===n||"true"===n||1===n||"1"===n}>
            <span>${i!==e.name.replace(/_/g," ")?i:d||i}</span>
          </label>
          ${c?N`<div class="form-error">${c}</div>`:""}
        </div>
      `}if("integer"===o||"number"===o||"number"===u||"integer"===u){const s=g.number?.step||("integer"===o?1:"any"),a=g.number?.min??e.valueMin??e.minimum??"",p=g.number?.max??e.valueMax??e.maximum??"";return N`
        <div class="form-field">
          <label>${i}${r?" *":""}</label>
          ${d?N`<div class="field-desc">${d}</div>`:""}
          <input type="number" name=${t} .value=${n}
                 ?required=${r} placeholder=${l}
                 step=${s} min=${a??""} max=${p??""}>
          ${c?N`<div class="form-error">${c}</div>`:""}
        </div>
      `}return p||"text"===u&&g.text?.multiline?N`
        <div class="form-field">
          <label>${i}${r?" *":""}</label>
          ${d?N`<div class="field-desc">${d}</div>`:""}
          <textarea name=${t} .value=${n}
                    ?required=${r} placeholder=${l}></textarea>
          ${c?N`<div class="form-error">${c}</div>`:""}
        </div>
      `:N`
      <div class="form-field">
        <label>${i}${r?" *":""}</label>
        ${d&&d!==l?N`<div class="field-desc">${d}</div>`:""}
        <div style="position:relative;display:flex;align-items:center;">
          <input type=${h?this._passwordVisible?"text":"password":"text"} name=${t}
                 .value=${n} ?required=${r} placeholder=${l}
                 style="padding-right:36px;">
          ${h?N`
            <button type="button" @click=${()=>{this._passwordVisible=!this._passwordVisible,this.requestUpdate()}}
                    style="position:absolute;right:8px;background:none;border:none;cursor:pointer;padding:4px;color:var(--secondary-text-color,#727272);font-size:14px;line-height:1;"
                    title="${this._passwordVisible?xe("togglePasswordHide"):xe("togglePasswordShow")}">
              ${this._passwordVisible?"🙈":"👁"}
            </button>
          `:""}
        </div>
        ${c?N`<div class="form-error">${c}</div>`:""}
      </div>
    `}_renderResult(){if(!this._result)return"";const e=this._result;if("create_entry"===e.type)return N`
        <div class="result">
          <svg class="result-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div class="result-title">${xe("flowResultCreated")}</div>
          <div class="result-desc">${e.title||xe("flowResultCreatedDesc")}</div>
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${xe("flowDone")}</button>
          </div>
        </div>
      `;if("abort"===e.type){const t={already_configured:xe("flowAbortAlreadyConfigured"),single_instance_allowed:xe("flowAbortSingleInstance"),no_devices_found:xe("flowAbortNoDevices"),already_in_progress:xe("flowAbortInProgress"),no_config:xe("flowOptionsNotSupported")};return N`
        <div class="result">
          <svg class="result-icon abort" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div class="result-title">${xe("flowResultAborted")}</div>
          <div class="result-desc">${t[e.reason]||e.reason||xe("flowResultAbortedDesc")}</div>
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${xe("flowGotIt")}</button>
          </div>
        </div>
      `}return"external"===e.type?N`
        <div class="result">
          <svg class="result-icon external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <div class="result-title">${xe("flowResultExternal")}</div>
          <div class="result-desc">${e.message||xe("flowResultExternalDesc")}</div>
          ${e.url?N`<a href=${e.url} target="_blank" class="btn external">${xe("flowOpenAuthPage")}</a>`:""}
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${xe("flowClose")}</button>
          </div>
        </div>
      `:N`
      <div class="result">
        <svg class="result-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <div class="result-title">${xe("flowResultFailed")}</div>
        <div class="result-desc">${e.message||xe("flowResultFailedDesc")}</div>
        <div class="actions">
          <button class="btn primary" @click=${this._close}>${xe("flowClose")}</button>
        </div>
      </div>
    `}}customElements.define("config-flow-dialog",li),customElements.define("hacs-vision-panel",Yt)}();
