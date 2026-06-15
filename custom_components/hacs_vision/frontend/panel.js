!function(){"use strict";
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const o=this.t;if(t&&void 0===e){const t=void 0!==o&&1===o.length;t&&(e=i.get(o)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(o,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new r(i,e,o)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,g=globalThis,u=g.trustedTypes,f=u?u.emptyScript:"",m=g.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},x=(e,t)=>!n(e,t),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:x};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:r}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const s=i?.call(this);r?.call(this,t),this.requestUpdate(e,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...d(e),...p(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const o=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((o,i)=>{if(t)o.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=t.cssText,o.appendChild(i)}})(o,this.constructor.elementStyles),o}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:v).toAttribute(t,o.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=i;const s=r.fromAttribute(t,e.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(e,t,o,i=!1,r){if(void 0!==e){const s=this.constructor;if(!1===i&&(r=this[e]),o??=s.getPropertyOptions(e),!((o.hasChanged??x)(r,t)||o.useDefault&&o.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:r},s){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==r||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,o,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[b("elementProperties")]=new Map,_[b("finalized")]=new Map,m?.({ReactiveElement:_}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const w=globalThis,$=e=>e,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+C,R=`<${A}>`,E=document,T=()=>E.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,F=Array.isArray,I="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,O=/>/g,N=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,P=/"/g,U=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...o)=>({_$litType$:e,strings:t,values:o}))(1),j=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,G=E.createTreeWalker(E,129);function Y(e,t){if(!F(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const W=(e,t)=>{const o=e.length-1,i=[];let r,s=2===t?"<svg>":3===t?"<math>":"",a=L;for(let t=0;t<o;t++){const o=e[t];let n,l,c=-1,d=0;for(;d<o.length&&(a.lastIndex=d,l=a.exec(o),null!==l);)d=a.lastIndex,a===L?"!--"===l[1]?a=M:void 0!==l[1]?a=O:void 0!==l[2]?(U.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=N):void 0!==l[3]&&(a=N):a===N?">"===l[0]?(a=r??L,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?N:'"'===l[3]?P:B):a===P||a===B?a=N:a===M||a===O?a=L:(a=N,r=void 0);const p=a===N&&e[t+1].startsWith("/>")?" ":"";s+=a===L?o+R:c>=0?(i.push(n),o.slice(0,c)+z+o.slice(c)+C+p):o+C+(-2===c?t:p)}return[Y(e,s+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let r=0,s=0;const a=e.length-1,n=this.parts,[l,c]=W(e,t);if(this.el=X.createElement(l,o),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(z)){const t=c[s++],o=i.getAttribute(e).split(C),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:a[2],strings:o,ctor:"."===a[1]?ee:"?"===a[1]?te:"@"===a[1]?oe:Q}),i.removeAttribute(e)}else e.startsWith(C)&&(n.push({type:6,index:r}),i.removeAttribute(e));if(U.test(i.tagName)){const e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],T()),G.nextNode(),n.push({type:2,index:++r});i.append(e[t],T())}}}else if(8===i.nodeType)if(i.data===A)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(C,e+1));)n.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const o=E.createElement("template");return o.innerHTML=e,o}}function J(e,t,o=e,i){if(t===j)return t;let r=void 0!==i?o._$Co?.[i]:o._$Cl;const s=D(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=r:o._$Cl=r),void 0!==r&&(t=J(e,r._$AS(e,t.values),r,i)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??E).importNode(t,!0);G.currentNode=i;let r=G.nextNode(),s=0,a=0,n=o[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new Z(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new ie(r,this,e)),this._$AV.push(t),n=o[++a]}s!==n?.index&&(r=G.nextNode(),s++)}return G.currentNode=E,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),D(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>F(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=X.createElement(Y(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new K(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new X(e)),t}k(e){F(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const r of e)i===t.length?t.push(o=new Z(this.O(T()),this.O(T()),this,this.options)):o=t[i],o._$AI(r),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(e,t=this,o,i){const r=this.strings;let s=!1;if(void 0===r)e=J(this,e,t,0),s=!D(e)||e!==this._$AH&&e!==j,s&&(this._$AH=e);else{const i=e;let a,n;for(e=r[0],a=0;a<r.length-1;a++)n=J(this,i[o+a],t,a),n===j&&(n=this._$AH[a]),s||=!D(n)||n!==this._$AH[a],n===V?e=V:e!==V&&(e+=(n??"")+r[a+1]),this._$AH[a]=n}s&&!i&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class te extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class oe extends Q{constructor(e,t,o,i,r){super(e,t,o,i,r),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??V)===j)return;const o=this._$AH,i=e===V&&o!==V||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,r=e!==V&&(o===V||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(X,Z),(w.litHtmlVersions??=[]).push("3.3.3");const se=globalThis;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */class ae extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=o?.renderBefore??null;i._$litPart$=r=new Z(t.insertBefore(T(),e),e,void 0,o??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}ae._$litElement$=!0,ae.finalized=!0,se.litElementHydrateSupport?.({LitElement:ae});const ne=se.litElementPolyfillSupport;ne?.({LitElement:ae}),(se.litElementVersions??=[]).push("4.2.2");const le="/api/hacs_vision";const ce=new class{constructor(){this._token=null,this._hassRef=null}setHass(e){this._hassRef=e;try{if(e?.auth?.data?.access_token)return void(this._token=e.auth.data.access_token)}catch(e){}try{e?.connection?.accessToken?this._token=e.connection.accessToken:e?.authToken&&(this._token=e.authToken)}catch(e){}}_getHeaders(){const e={"Content-Type":"application/json"};if(!this._token)try{this._hassRef?.auth?.data?.access_token&&(this._token=this._hassRef.auth.data.access_token)}catch(e){}if(!this._token)try{const e=window.parent?.document;if(e){const t=e.querySelector("home-assistant"),o=t?.hass;o?.auth?.data?.access_token&&(this._token=o.auth.data.access_token)}}catch(e){console.warn("[HACS Vision] Cross-origin iframe context: cannot extract token from parent frame")}if(!this._token)try{const e=document.querySelector("home-assistant"),t=e?.hass;t?.auth?.data?.access_token&&(this._token=t.auth.data.access_token)}catch(e){}return this._token&&(e.Authorization=`Bearer ${this._token}`),e}async request(e,t,o,i={}){const r={method:e,headers:this._getHeaders(),credentials:"include"};o&&(r.body=JSON.stringify(o));try{const e=await fetch(`${le}/${t}`,r);if(!e.ok){const t=new Error(`API error: ${e.status}`);throw t.status=e.status,!i.suppressNetworkError&&this._onNetworkStatus&&(429===e.status?this._onNetworkStatus("rate_limited"):e.status>=500&&this._onNetworkStatus("server_error")),t}return this._onNetworkStatus&&this._onNetworkStatus("online"),e.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}get(e,t={}){return this.request("GET",e,null,t)}post(e,t){return this.request("POST",e,t)}delete(e,t){return this.request("DELETE",e,t)}listRepositories(e={}){const t=new URLSearchParams;return e.search&&t.set("search",e.search),e.category&&t.set("category",e.category),e.sort&&t.set("sort",e.sort),e.sortDir&&t.set("sortDir",e.sortDir),e.status&&t.set("status",e.status),e.tag&&t.set("tag",e.tag),e.page&&t.set("page",String(e.page)),e.limit&&t.set("limit",String(e.limit)),this.get(`repositories?${t}`)}getRepository(e){return this.get(`repositories/${e}`)}getInstalled(){return this.get("installed")}getStats(){return this.get("installed/stats")}getUpdates(){return this.get("updates")}install(e,t){return this.post("install",{repository:e,category:t})}update(e){return this.post("update",{repository_ids:e})}remove(e){return this.post("remove",{repository:e})}getConfig(){return this.get("config")}updateConfig(e){return this.post("config",e)}getCustomRepos(){return this.get("config/custom")}addCustomRepo(e,t){return this.post("config/custom",{repository:e,category:t})}removeCustomRepo(e){return this.delete("config/custom",{repository:e})}removeArchivedRepo(e){return this.post("management/remove_archived",{repository:e})}removeRenamedRepo(e){return this.post("management/remove_renamed",{old_name:e})}replaceRenamedRepo(e,t){return this.post("management/replace_renamed",{old_name:e,new_name:t})}exportBackup(){return this.get("backup/export")}importBackup(e){return this.post("backup/import",e)}checkDependencies(){return this.get("dependencies")}refresh(){return this.post("refresh")}redownload(e,t){return this.post("redownload",{repository:e,category:t})}ignoreRepo(e){return this.post("ignore",{repository:e})}restartHA(){return this.post("restart")}reloadHA(){return this.post("reload").then(e=>{if(e.success)try{localStorage.removeItem("hacs_vision_pending_reload")}catch(e){}return e})}getPendingReloads(){try{return JSON.parse(localStorage.getItem("hacs_vision_pending_reload")||"[]")}catch(e){return[]}}addPendingReload(e){try{const t=this.getPendingReloads();t.includes(e)||(t.push(e),localStorage.setItem("hacs_vision_pending_reload",JSON.stringify(t)))}catch(e){}}clearPendingReloads(){try{localStorage.removeItem("hacs_vision_pending_reload")}catch(e){}}getSettings(){return this.get("settings")}updateSettings(e){return this.post("settings",e)}getConfigEntries(){return this.get("config_entries")}getDeviceCounts(e){return this.get(`device_counts/${e}`,{suppressNetworkError:!0})}getVersion(){return this.get("version")}batchInstall(e){return this.post("batch/install",{repositories:e})}batchRemove(e){return this.post("batch/remove",{repositories:e})}checkUpdatesWithNotify(){return this.post("check_updates")}getFlowHandlers(){return this.get("config_flow/handlers")}startConfigFlow(e){return this.post("config_flow/start",{handler:e})}stepConfigFlow(e,t){return this.post(`config_flow/step/${e}`,t)}cancelConfigFlow(e){return this.request("DELETE",`config_flow/flow/${e}`)}startOptionsFlow(e){return this.post("config_flow/options/start",{handler:e})}stepOptionsFlow(e,t){return this.post(`config_flow/options/step/${e}`,t)}startSubentryFlow(e,t,o){return this.post("config_flow/subentry/start",{handler:[e,t],...o})}stepSubentryFlow(e,t){return this.post(`config_flow/subentry/step/${e}`,t)}cancelSubentryFlow(e){return this.request("DELETE",`config_flow/subentry/flow/${e}`)}getSubentries(e){return this.request("GET",`config_entries/subentries/${e}`)}getTranslations(e,t){const o=t||"zh-Hans";return this.get(`translations/${encodeURIComponent(e)}?lang=${encodeURIComponent(o)}`)}getRepoStatus(e){return this.get(`repos/status/${encodeURIComponent(e)}`)}getFavorites(){return this.get("favorites")}setFavorites(e){return this.post("favorites",{favorites:e})}getRepoReleases(e){return this._fetch(`/repos/releases?id=${encodeURIComponent(e)}`)}installVersion(e,t){return this._post("/repos/install_version",{id:e,version:t})}async _fetch(e){const t={method:"GET",headers:this._getHeaders(),credentials:"include"};try{const o=await fetch(`${le}${e}`,t);if(!o.ok){const e=new Error(`API error: ${o.status}`);throw e.status=o.status,e}return o.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}async _post(e,t){const o={method:"POST",headers:this._getHeaders(),credentials:"include",body:JSON.stringify(t)};try{const t=await fetch(`${le}${e}`,o);if(!t.ok){const e=new Error(`API error: ${t.status}`);throw e.status=t.status,this._onNetworkStatus&&(429===t.status?this._onNetworkStatus("rate_limited"):t.status>=500&&this._onNetworkStatus("server_error")),e}return this._onNetworkStatus&&this._onNetworkStatus("online"),t.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}async getChangelog(e,t){const o=`hacs_changelog_${e}_${t||"latest"}`;try{const e=localStorage.getItem(o);if(e){const{data:t,timestamp:o}=JSON.parse(e);if(Date.now()-o<36e5)return t}}catch(e){}try{const i=t?`?tag=${encodeURIComponent(t)}`:"",r=await this.get(`changelog/${e}${i}`);try{localStorage.setItem(o,JSON.stringify({data:r,timestamp:Date.now()}))}catch(e){}return r}catch(e){return console.error("Changelog fetch failed:",e),null}}async getReadme(e){const t=`hacs_readme_${e}`;try{const e=localStorage.getItem(t);if(e){const{html:t,timestamp:o}=JSON.parse(e);if(Date.now()-o<36e5)return t}}catch(e){}try{const o=await fetch(`${le}/readme/${e}`,{headers:this._getHeaders(),credentials:"include"});if(o.ok){const e=await o.text();try{localStorage.setItem(t,JSON.stringify({html:e,timestamp:Date.now()}))}catch(e){}return e}return null}catch(e){return console.error("Failed to fetch README:",e),null}}},de=e=>class extends e{static properties={_themeReady:{type:Boolean,state:!0}};constructor(){super(),this._themeReady=!1}connectedCallback(){super.connectedCallback(),requestAnimationFrame(()=>{this._applyTheme(),this._themeReady=!0}),this._setupThemeObserver()}disconnectedCallback(){super.disconnectedCallback?.(),this._themeObserver&&(this._themeObserver.disconnect(),this._themeObserver=null)}_getHAVar(e,t=""){try{const t=document.querySelector("home-assistant")?.shadowRoot||document.querySelector("ha-app")?.shadowRoot||document.documentElement,o=[this.renderRoot?.host,t,document.documentElement,document.body];for(const t of o)if(t)try{const o=getComputedStyle(t).getPropertyValue(e).trim();if(o)return o}catch(e){}try{if(window.parent&&window.parent!==window){const t=window.parent.document.querySelector("home-assistant")?.shadowRoot||window.parent.document.documentElement;if(t){const o=getComputedStyle(t).getPropertyValue(e).trim();if(o)return o}}}catch(e){}}catch(e){}return t}_applyTheme(){const e=this.renderRoot?.host||this,t=this._isDarkMode(),o={"--primary-background-color":t?"#111111":"#f5f5f5","--secondary-background-color":t?"#1c1c1c":"#e0e0e0","--primary-text-color":t?"#e1e1e1":"#212121","--secondary-text-color":t?"#9e9e9e":"#727272","--card-background-color":t?"#1c1c1c":"#ffffff","--divider-color":t?"#333333":"#e0e0e0","--primary-color":"#03a9f4","--rgb-primary-color":"3, 169, 244","--ha-card-border-radius":"12px"};for(const[t,i]of Object.entries(o)){const o=this._getHAVar(t);if(e.style.setProperty(t,o||i),"--primary-color"===t&&!o){const t=this._hexToRgb(i);t&&e.style.setProperty("--rgb-primary-color",t)}}const i=e.style.getPropertyValue("--primary-color").trim()||o["--primary-color"],r=this._getHAVar("--rgb-primary-color")||this._hexToRgb(i)||"3, 169, 244";e.style.setProperty("--rgb-primary-color",r)}_isDarkMode(){try{const e=document.documentElement.getAttribute("data-theme");if(e&&e.includes("dark"))return!0;const t=this._getHAVar("--primary-background-color");if(t){const e=this._parseColor(t);if(e){return.299*e.r+.587*e.g+.114*e.b<128}}const o=document.body?.getAttribute("data-theme");if(o&&o.includes("dark"))return!0}catch(e){}try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return!1}}_parseColor(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];if(3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),e.length>=6){const t=parseInt(e.substring(0,2),16),o=parseInt(e.substring(2,4),16),i=parseInt(e.substring(4,6),16);if(!isNaN(t+o+i))return{r:t,g:o,b:i}}}const o=e.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);return o?{r:parseInt(o[1]),g:parseInt(o[2]),b:parseInt(o[3])}:null}_hexToRgb(e){const t=e.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(t)return`${t[1]}, ${t[2]}, ${t[3]}`;if(3===(e=e.replace(/^#/,"")).length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)return null;const o=parseInt(e.substring(0,2),16),i=parseInt(e.substring(2,4),16),r=parseInt(e.substring(4,6),16);return isNaN(o+i+r)?null:`${o}, ${i}, ${r}`}_setupThemeObserver(){try{const e=document.querySelector("home-assistant")||document.querySelector("ha-app")||document.documentElement;e&&(this._themeObserver=new MutationObserver(()=>{this._themeObserver?._debounce||(this._themeObserver._debounce=!0,setTimeout(()=>{this._themeObserver&&(this._themeObserver._debounce=!1),this._applyTheme()},200))}),this._themeObserver.observe(e,{attributes:!0,attributeFilter:["class","style"],subtree:!0}))}catch(e){}}};let pe=(()=>{try{const e=window.top||window.parent,t=e?.document?.querySelector("home-assistant");if(t?.hass?.language)return 0===t.hass.language.indexOf("zh")?"zh":"en";return 0===(e?.document?.documentElement?.lang||"").indexOf("zh")?"zh":"en"}catch(e){}try{return 0===navigator.language?.indexOf("zh")?"zh":"en"}catch(e){return"en"}})();const he={storeTitle:{zh:"HACS Vision",en:"HACS Vision"},storeSubtitle:{zh:"浏览、管理和更新 HACS 仓库",en:"Browse, manage and update HACS repositories"},statInstalled:{zh:"已安装",en:"Installed"},statUpdates:{zh:"可更新",en:"Updates"},statFavorites:{zh:"收藏",en:"Favorites"},statCustom:{zh:"自定义",en:"Custom"},statRepos:{zh:"仓库数",en:"Repos"},tabBrowse:{zh:"商店",en:"Store"},tabFavorites:{zh:"收藏",en:"Favorites"},tabCustom:{zh:"自定义",en:"Custom"},tabInstalled:{zh:"已安装",en:"Installed"},tabUpdates:{zh:"更新",en:"Updates"},tabConfig:{zh:"配置",en:"Config"},tabBackup:{zh:"备份",en:"Backup"},tabManagement:{zh:"仓库管理",en:"Repository"},tabIntegrations:{zh:"集成管理",en:"Integrations"},searchPlaceholder:{zh:"搜索仓库...",en:"Search repositories..."},searchInstalled:{zh:"搜索已安装...",en:"Search installed..."},searchUpdates:{zh:"搜索可更新的仓库...",en:"Search for updates..."},filterStatus:{zh:"状态",en:"Status"},filterType:{zh:"类型",en:"Type"},filterTags:{zh:"标记",en:"Tags"},repoStatus:{zh:"仓库状态",en:"Repo Status"},statusAll:{zh:"全部",en:"All"},statusInstalled:{zh:"已安装",en:"Installed"},statusNotInstalled:{zh:"未安装",en:"Not Installed"},statusNotLoaded:{zh:"未加载",en:"Not Loaded"},statusUpdateAvailable:{zh:"可更新",en:"Update Available"},statusPendingRestart:{zh:"待重启",en:"Pending Restart"},statusPendingReload:{zh:"待加载",en:"Pending Reload"},statusPendingUpgrade:{zh:"可更新",en:"Update Available"},statusDefault:{zh:"未安装",en:"Available"},statusDisabled:{zh:"已禁用",en:"Disabled"},typeAll:{zh:"全部",en:"All"},typeIntegration:{zh:"集成",en:"Integration"},typePlugin:{zh:"插件",en:"Plugin"},typeTheme:{zh:"主题",en:"Theme"},typeTemplate:{zh:"模板",en:"Template"},sortByStars:{zh:"按星数",en:"By Stars"},sortByUpdated:{zh:"最近更新",en:"Recently Updated"},sortByName:{zh:"按名称",en:"By Name"},sortByEntries:{zh:"按条目",en:"By Entries"},catAll:{zh:"全部",en:"All"},catIntegration:{zh:"集成",en:"Integration"},catPlugin:{zh:"插件",en:"Plugin"},catTheme:{zh:"主题",en:"Theme"},catTemplate:{zh:"模板",en:"Template"},catDashboard:{zh:"卡片",en:"Cards"},catAppDaemon:{zh:"AppDaemon",en:"AppDaemon"},catNetDaemon:{zh:"NetDaemon",en:"NetDaemon"},catPythonScript:{zh:"Python 脚本",en:"Python Script"},catCustom:{zh:"自定义",en:"Custom"},totalRepos:{zh:"个仓库",en:"repositories"},noMatch:{zh:"没有匹配的仓库",en:"No matching repositories"},noData:{zh:"暂无仓库数据",en:"No repository data"},noDevicesOrEntities:{zh:"暂无设备或实体",en:"No devices or entities"},entityCount:{zh:"个实体",en:" entities"},loading:{zh:"加载中...",en:"Loading..."},sort:{zh:"排序",en:"Sort"},filterMore:{zh:"筛选与排序",en:"Filter & Sort"},tagNew:{zh:"新",en:"New"},prevPage:{zh:"← 上一页",en:"← Previous"},nextPage:{zh:"下一页 →",en:"Next →"},page:{zh:"第",en:"Page"},of:{zh:"/ ",en:" / "},installed:{zh:"已安装",en:"Installed"},install:{zh:"安装",en:"Install"},update:{zh:"更新",en:"Update"},redownload:{zh:"重新下载",en:"Redownload"},ignore:{zh:"忽略",en:"Ignore"},confirmIgnore:{zh:"确定要忽略 {repo} 吗？将不再出现在搜索结果和更新提醒中。",en:"Ignore {repo}? It will no longer appear in search results or update notifications."},remove:{zh:"卸载",en:"Uninstall"},detail:{zh:"详情",en:"Detail"},noDesc:{zh:"暂无描述",en:"No description"},favOn:{zh:"已收藏",en:"Favorited"},favOff:{zh:"收藏",en:"Favorite"},tagFavorites:{zh:"收藏",en:"Favorites"},tagNew:{zh:"新发现",en:"New"},tagCustom:{zh:"自定义",en:"Custom"},badgeConfigured:{zh:"已配置",en:"Configured"},badgeLoadFailed:{zh:"加载失败",en:"Load Failed"},canUpdate:{zh:"可更新",en:"Updatable"},allTypes:{zh:"全部类型",en:"All Types"},refresh:{zh:"刷新",en:"Refresh"},noInstalled:{zh:"暂无已安装仓库",en:"No installed repositories"},noMatchInstalled:{zh:"没有匹配的已安装仓库",en:"No matching installed repos"},totalInstalled:{zh:"个已安装仓库",en:"installed repositories"},confirmRemove:{zh:"确定要卸载 {repo} 吗？将删除仓库下载文件，已添加的集成配置不会被删除。",en:"Uninstall {repo}? Repository files will be deleted. Existing integration config entries will NOT be deleted."},removed:{zh:"已卸载",en:"Uninstalled"},removeFailed:{zh:"卸载失败",en:"Uninstall failed"},removing:{zh:"卸载中…",en:"Uninstalling…"},updating:{zh:"更新中...",en:"Updating..."},checkingUpdates:{zh:"检查更新...",en:"Checking updates..."},allUpToDate:{zh:"所有仓库已是最新版本",en:"All repositories are up to date"},totalUpdates:{zh:"个可更新仓库",en:"repositories can be updated"},updateAll:{zh:"全部更新",en:"Update All"},updateSelected:{zh:"更新已选",en:"Update Selected"},updateAllNow:{zh:"全部更新",en:"Update All"},currentVersion:{zh:"当前版本",en:"Current"},latestVersion:{zh:"最新版本",en:"Latest"},updateNow:{zh:"立即更新",en:"Update Now"},confirmUpdateAll:{zh:"确定要更新全部 {n} 个仓库吗？",en:"Update all {n} repositories?"},confirmUpdateSelected:{zh:"确定要更新已选的 {n} 个仓库吗？",en:"Update {n} selected repositories?"},allUpdatesStarted:{zh:"全部更新已开始",en:"All updates started"},updateStarted:{zh:"已开始更新",en:"Update started"},updateFailed:{zh:"更新失败",en:"Update failed"},selectAll:{zh:"全选",en:"Select All"},customRepos:{zh:"自定义仓库",en:"Custom Repositories"},noCustomRepos:{zh:"暂无自定义仓库",en:"No custom repositories"},noCustomReposHint:{zh:"点击下方按钮添加自定义仓库，或从浏览页安装",en:"Click below to add a custom repo, or install from Browse"},customReposDesc:{zh:"管理 HACS 自定义仓库列表。添加后可在商店中搜索到。",en:"Manage custom repository list. Once added, they become searchable in Store."},addRepo:{zh:"添加仓库",en:"Add Repository"},addSuccess:{zh:"添加成功",en:"Added successfully"},invalidRepoUrl:{zh:"无效的仓库地址，请输入 owner/repo 格式或 GitHub URL",en:"Invalid repository URL, use owner/repo format or GitHub URL"},addCustomRepo:{zh:"添加自定义仓库",en:"Add Custom Repository"},repoUrl:{zh:"仓库 URL (如: https://github.com/user/repo)",en:"Repository URL (e.g. https://github.com/user/repo)"},add:{zh:"添加",en:"Add"},cancel:{zh:"取消",en:"Cancel"},addFailed:{zh:"添加失败",en:"Add failed"},removeRepo:{zh:"移除",en:"Remove"},confirmRemoveRepo:{zh:"确定要移除 {repo} 吗？只删除 HACS 跟踪记录，仓库文件和集成配置不受影响。",en:"Remove {repo}? Only the HACS tracking record will be deleted. Repository files and integration config are NOT affected."},removeRepoFailed:{zh:"移除失败",en:"Remove failed"},notInstalled:{zh:"未安装",en:"Not installed"},alreadyExists:{zh:"已在列表中",en:"already exists"},customBadge:{zh:"自定义",en:"Custom"},archivedRepos:{zh:"已归档仓库",en:"Archived Repositories"},noArchived:{zh:"暂无归档仓库",en:"No archived repositories"},renamedRepos:{zh:"已重命名仓库",en:"Renamed Repositories"},noRenamed:{zh:"暂无重命名仓库",en:"No renamed repositories"},ignoredRepos:{zh:"已忽略仓库",en:"Ignored Repositories"},noIgnored:{zh:"暂无忽略仓库",en:"No ignored repositories"},removeArchived:{zh:"移除归档",en:"Remove Archived"},removeRenamed:{zh:"移除重命名",en:"Remove Renamed"},replace:{zh:"替换",en:"Replace"},viewDetail:{zh:"查看详情",en:"View Detail"},confirmRemoveArchived:{zh:"确定要移除 {repo} 的归档状态吗？将重新出现在搜索结果中。",en:"Unarchive {repo}? It will reappear in search results."},confirmRemoveRenamed:{zh:"确定要删除仓库 {old} 的重命名映射记录吗？仓库将使用旧名，若旧名无效则更新可能失败。",en:"Delete rename mapping for {old}? The repository will use the old name. If the old name is invalid, updates may fail."},confirmReplaceRenamed:{zh:"将替换仓库 {old} → {new}？将卸载旧仓库并安装新仓库。",en:"Replace {old} → {new}? Old repo will be uninstalled, new one will be installed."},viewOnGithub:{zh:"在 GitHub 中查看",en:"View on GitHub"},exportBackup:{zh:"导出备份",en:"Export Backup"},exportDesc:{zh:"将 HACS 配置、已安装仓库列表和自定义仓库设置导出为 JSON 文件。导出后可在新环境中导入恢复。",en:"Export HACS config, installed repositories and custom repo settings as JSON. Can be imported in new environments."},exportBtn:{zh:"导出备份",en:"Export Backup"},exporting:{zh:"导出中...",en:"Exporting..."},exportSuccess:{zh:"备份导出成功",en:"Backup exported successfully"},exportFailed:{zh:"导出失败",en:"Export failed"},importBackup:{zh:"导入备份",en:"Import Backup"},importDesc:{zh:"从之前导出的 JSON 备份文件恢复 HACS 配置。注意：导入会覆盖当前配置。",en:"Restore HACS config from a previously exported JSON backup. Note: Import will overwrite current config."},importBtn:{zh:"导入备份",en:"Import Backup"},importing:{zh:"导入中...",en:"Importing..."},importSuccess:{zh:"备份导入成功",en:"Backup imported successfully"},importFailed:{zh:"导入失败",en:"Import failed"},depCheck:{zh:"依赖检查",en:"Dependency Check"},depDesc:{zh:"检查 HACS Vision 的系统依赖是否完整安装。",en:"Check if HACS Vision system dependencies are fully installed."},checkDep:{zh:"检查依赖",en:"Check Dependencies"},depOk:{zh:"所有依赖正常",en:"All dependencies OK"},depMissing:{zh:"部分依赖缺失",en:"Some dependencies missing"},checkFailed:{zh:"检查失败",en:"Check failed"},noFavorites:{zh:"暂无收藏",en:"No favorites yet"},noFavoritesHint:{zh:"在浏览页点击卡片右上角的 ☆ 收藏仓库",en:"Click ☆ on the top-right of cards to favorite repositories"},clearAll:{zh:"清空收藏",en:"Clear All"},confirmClear:{zh:"确定要清空所有收藏吗？",en:"Clear all favorites?"},favoritesCleared:{zh:"已清空收藏",en:"Favorites cleared"},openGithub:{zh:"在 GitHub 中打开",en:"Open in GitHub"},description:{zh:"描述",en:"Description"},version:{zh:"版本",en:"Version"},downloads:{zh:"下载量",en:"Downloads"},stars:{zh:"星数",en:"Stars"},category:{zh:"分类",en:"Category"},close:{zh:"关闭",en:"Close"},unknown:{zh:"未知",en:"unknown"},unavailable:{zh:"不可用",en:"Unavailable"},stateOn:{zh:"开",en:"On"},stateOff:{zh:"关",en:"Off"},stateOpen:{zh:"已打开",en:"Open"},stateClosed:{zh:"已关闭",en:"Closed"},stateHome:{zh:"在家",en:"Home"},stateNotHome:{zh:"离家",en:"Away"},search:{zh:"搜索",en:"Search"},refreshTitle:{zh:"刷新",en:"Refresh"},totalPrefix:{zh:"共",en:"Total"},selected:{zh:"已选",en:"selected"},totalCount:{zh:"共",en:"Total"},all:{zh:"全部",en:"All"},repositories:{zh:"仓库",en:"Repositories"},successSuffix:{zh:"成功",en:" succeeded"},failedSuffix:{zh:"失败",en:" failed"},deviceAndService:{zh:"设备与服务",en:"Devices & Services"},noDevices:{zh:"暂无设备",en:"No devices"},deviceCount:{zh:"个设备",en:" devices"},areaCount:{zh:"个区域",en:" areas"},viewDevices:{zh:"查看设备",en:"View Devices"},delete:{zh:"删除",en:"Delete"},expandAll:{zh:"展开全部",en:"Expand All"},collapseAll:{zh:"全部折叠",en:"Collapse All"},connectFailed:{zh:"连接 HACS 失败",en:"Failed to connect to HACS"},waitingHA:{zh:"等待 HA 连接...",en:"Waiting for HA connection..."},confirm:{zh:"确认",en:"Confirm"},confirmDelete:{zh:"确定要删除 {domain} 的配置条目吗？该集成将立即停止运行，仓库下载文件不会被删除。",en:"Delete {domain} config entry? The integration will stop immediately. Repository files will NOT be deleted."},deleted:{zh:"已删除",en:"Deleted"},deleteFailed:{zh:"删除失败",en:"Delete failed"},confirmUpdate:{zh:"确认更新",en:"Confirm Update"},enabled:{zh:"启用",en:"Enabled"},disabled:{zh:"禁用",en:"Disabled"},configure:{zh:"配置",en:"Configure"},enableEntry:{zh:"启用",en:"Enable"},disableEntry:{zh:"禁用",en:"Disable"},subentryConfig:{zh:"子项配置",en:"Sub-entry Config"},addSubentry:{zh:"添加新子项",en:"Add Sub-entry"},addSubentryHint:{zh:"点击添加新的子项配置",en:"Click to add a new sub-entry"},save:{zh:"保存",en:"Save"},loadingReadme:{zh:"加载 README...",en:"Loading README..."},readmeLoadFailed:{zh:"README 加载失败",en:"README load failed"},readmeTitle:{zh:"说明文档",en:"README"},dblZoomHint:{zh:"双击放大",en:"Double-click to expand"},networkOffline:{zh:"网络连接已断开，请检查网络",en:"Network disconnected — check your connection"},networkRestored:{zh:"网络已恢复",en:"Network restored"},haRestarting:{zh:"Home Assistant 正在重启，请稍候...",en:"Home Assistant is restarting, please wait..."},cacheMismatch:{zh:"版本已更新，请刷新页面",en:"New version available, please refresh"},rateLimited:{zh:"GitHub API 限流，请稍后重试",en:"GitHub API rate limited — try again later"},restartHA:{zh:"重启",en:"Restart"},restartHATitle:{zh:"重启 Home Assistant",en:"Restart Home Assistant"},restartConfirm:{zh:"确定要重启 Home Assistant 吗？面板将暂时不可用。",en:"Restart Home Assistant? The panel will be temporarily unavailable."},restartFailed:{zh:"重启失败",en:"Restart failed"},reloadHA:{zh:"重新加载",en:"Reload"},reloadHATitle:{zh:"重新加载核心配置",en:"Reload Core Config"},reloadingHA:{zh:"正在重新加载配置...",en:"Reloading config..."},reloadSuccess:{zh:"配置已重新加载",en:"Config reloaded"},coreReloadFailed:{zh:"重新加载失败",en:"Reload failed"},postInstallRestartMsg:{zh:"已安装/更新完成。需要重启 Home Assistant 才能生效，是否立即重启？",en:"Install/Update complete. Home Assistant needs a restart to apply changes. Restart now?"},later:{zh:"稍后",en:"Later"},installing:{zh:"安装中…",en:"Installing…"},installComplete:{zh:"已安装",en:"Installed"},installFailed:{zh:"安装失败",en:"Install failed"},updatingProgress:{zh:"更新中…",en:"Updating…"},updateComplete:{zh:"已更新",en:"Updated"},quickInstall:{zh:"快捷安装",en:"Quick Install"},quickInstallPlaceholder:{zh:"粘贴 GitHub URL 或 owner/repo",en:"Paste GitHub URL or owner/repo"},quickInstallCategory:{zh:"分类",en:"Category"},quickInstallUrl:{zh:"仓库 URL",en:"Repository URL"},installRepo:{zh:"安装仓库",en:"Install Repository"},changelogTitle:{zh:"更新内容",en:"What's New"},changelogTitleVersion:{zh:"{tag} 更新内容",en:"{tag} What's New"},viewFullChangelog:{zh:"查看完整更新日志",en:"View full changelog"},noChangelog:{zh:"暂无更新日志",en:"No changelog available"},changelogShowMore:{zh:"展开",en:"Show more"},changelogShowLess:{zh:"收起",en:"Show less"},viewCard:{zh:"卡片",en:"Cards"},viewList:{zh:"列表",en:"List"},list:{zh:"列表",en:"List"},groupBy:{zh:"分组",en:"Group By"},groupNone:{zh:"不分组",en:"No Grouping"},groupStatus:{zh:"按状态",en:"By Status"},groupType:{zh:"按类型",en:"By Type"},selectVersion:{zh:"选择版本",en:"Select Version"},availableVersion:{zh:"可用版本",en:"Available Version"},installVersion:{zh:"安装此版本",en:"Install This Version"},prerelease:{zh:"预发布",en:"Pre-release"},prereleaseTab:{zh:"预发布版",en:"Pre-releases"},stableReleases:{zh:"正式版",en:"Stable"},releaseStable:{zh:"正式版",en:"Release"},releasePrerelease:{zh:"预发布版",en:"Pre-release"},noReleases:{zh:"暂无发布版本",en:"No releases available"},publishedAt:{zh:"发布于",en:"Published"},noConfigRequired:{zh:"此集成无需配置",en:"This integration requires no configuration"},tools:{zh:"工具",en:"Tools"},toolsDesc:{zh:"导出、导入和依赖检查",en:"Export, import and dependency check"},colName:{zh:"名称",en:"Name"},colDownloads:{zh:"下载",en:"Downloads"},colStars:{zh:"星数",en:"Stars"},colLastUpdated:{zh:"更新",en:"Updated"},colInstalledVer:{zh:"已安装",en:"Installed"},colAvailableVer:{zh:"可用",en:"Available"},colStatus:{zh:"状态",en:"Status"},colInstalledAt:{zh:"安装时间",en:"Installed At"},installedAt:{zh:"安装时间",en:"Installed At"},today:{zh:"今天",en:"Today"},yesterday:{zh:"昨天",en:"Yesterday"},clearCache:{zh:"清除缓存",en:"Clear cache"},clearCacheConfirm:{zh:"清除面板缓存后，页面将重新加载以获取最新版本。确定继续？",en:"Clear the panel cache? The page will reload to get the latest version."},clearCacheDone:{zh:"缓存已清除，正在重新加载...",en:"Cache cleared, reloading..."},tabSettings:{zh:"设置",en:"Settings"},settingsTitle:{zh:"设置",en:"Settings"},settingsDesc:{zh:"自定义 HACS Vision 的显示和行为",en:"Customize HACS Vision look and behavior"},settingsRefreshInterval:{zh:"刷新间隔（秒）",en:"Refresh interval (s)"},settingsDefaultView:{zh:"默认视图",en:"Default view"},settingsNotifyUpdates:{zh:"推送更新通知",en:"Push update notifications"},settingsNotifyRestart:{zh:"推送重启提醒",en:"Push restart reminders"},settingsLanguage:{zh:"语言",en:"Language"},settingsSaved:{zh:"设置已保存",en:"Settings saved"},settingsSaveFailed:{zh:"设置保存失败",en:"Settings save failed"},settingsMaintenance:{zh:"维护",en:"Maintenance"},batchSelect:{zh:"批量选择",en:"Batch select"},batchInstall:{zh:"批量安装",en:"Batch install"},batchRemove:{zh:"批量卸载",en:"Batch uninstall"},batchUpdate:{zh:"批量更新",en:"Batch update"},batchSelected:{zh:"已选 {n} 个",en:"{n} selected"},batchInProgress:{zh:"批量操作进行中…",en:"Batch operation in progress…"},batchComplete:{zh:"批量操作完成",en:"Batch complete"},batchRemoveConfirm:{zh:"确定要批量卸载 {n} 个仓库吗？",en:"Uninstall {n} repositories?"},batchRemoveRepoConfirm:{zh:"确定要批量移除 {n} 个自定义仓库吗？",en:"Remove {n} custom repositories?"},quickInstallTitle:{zh:"快捷安装",en:"Quick Install"},quickInstallDetected:{zh:"检测到 GitHub URL",en:"Detected GitHub URL"},quickInstallDetectedDesc:{zh:"是否要安装此仓库？",en:"Install this repository?"},quickInstallAuto:{zh:"自动识别",en:"Auto detect"},addIntegration:{zh:"配置",en:"Configure"},addIntegrationHint:{zh:"配置此 HA 集成",en:"Configure this HA integration"},addHAIntegration:{zh:"添加 HA 集成",en:"Add HA Integration"},addHAIntegrationDesc:{zh:"搜索并添加 Home Assistant 内置或自定义集成",en:"Search and add Home Assistant built-in or custom integrations"},searchIntegration:{zh:"搜索集成...",en:"Search integration..."},noIntegrationMatch:{zh:"没有匹配的集成",en:"No matching integration"},integrationCount:{zh:"个可用集成",en:"available integrations"},filterAll:{zh:"全部",en:"All"},filterLoaded:{zh:"已加载",en:"Loaded"},filterFailed:{zh:"加载失败",en:"Failed"},filterDisabled:{zh:"已禁用",en:"Disabled"},filterNotLoaded:{zh:"未加载",en:"Not Loaded"},entryCount:{zh:"个条目",en:" entries"},entryTitle:{zh:"ID: {id}",en:"ID: {id}"},detailEntries:{zh:"{count} 个条目 · 点击 ⚙ 配置",en:"{count} entries · Click ⚙ to configure"},reloadDomain:{zh:"重载此集成全部条目",en:"Reload all entries"},configureEntry:{zh:"配置此条目",en:"Configure this entry"},reloadEntry:{zh:"重载此条目",en:"Reload this entry"},removeEntry:{zh:"删除此条目",en:"Remove this entry"},entryDisabled:{zh:"已禁用",en:"Disabled"},viewDetail:{zh:"查看详情",en:"View details"},loadFailed:{zh:"加载集成列表失败",en:"Failed to load integrations"},reloaded:{zh:"已重载",en:"Reloaded"},reloadFailed:{zh:"重载失败",en:"Reload failed"},checkUpdates:{zh:"检查更新",en:"Check Updates"},checkUpdatesNotify:{zh:"检查并通知",en:"Check & Notify"},updatesChecked:{zh:"检查完成，{n} 个可更新",en:"Check done, {n} updates"},noUpdatesFound:{zh:"所有仓库已是最新",en:"All repositories up to date"},notifySent:{zh:"通知已发送",en:"Notification sent"},flowTitle:{zh:"配置 HA 集成",en:"Configure HA Integration"},flowTitleOptions:{zh:"选项配置",en:"Options Configuration"},subentryTitle:{zh:"子项配置",en:"Subentry Configuration"},subentrySelectDesc:{zh:"请选择要配置的子项类型：",en:"Select a subentry type to configure:"},subentryExisting:{zh:"已有子项",en:"Existing Subentries"},subentryAddNew:{zh:"添加新子项",en:"Add New Subentry"},subentryAddPrefix:{zh:"添加",en:"Add"},subentryReconfigure:{zh:"配置",en:"Configure"},subentryConversation:{zh:"对话",en:"Conversation"},subentryTts:{zh:"语音合成",en:"Text-to-Speech"},subentryStt:{zh:"语音识别",en:"Speech-to-Text"},subentryTranslation:{zh:"翻译",en:"Translation"},subentryAiTaskData:{zh:"AI 任务数据",en:"AI Task Data"},subentryDevice:{zh:"MQTT 设备",en:"MQTT Device"},subentryWecom:{zh:"企业微信",en:"WeCom"},subentryWechat:{zh:"微信",en:"WeChat"},subentryQq:{zh:"QQ",en:"QQ"},subentryFeishu:{zh:"飞书",en:"Feishu"},subentryDingtalk:{zh:"钉钉",en:"DingTalk"},subentryXiaoyi:{zh:"小懿",en:"XiaoYi"},subentryCustom:{zh:"自定义",en:"Custom"},flowProcessing:{zh:"处理中...",en:"Processing..."},flowStarting:{zh:"启动配置流程...",en:"Starting configuration..."},flowSubmit:{zh:"提交",en:"Submit"},flowSelectOption:{zh:"--- 请选择 ---",en:"--- Select ---"},flowOptionsNotSupported:{zh:"此集成无需配置",en:"This integration does not require configuration"},flowHandlerNotFound:{zh:"未找到此集成的配置流程",en:"Configuration handler not found"},flowAuthError:{zh:"认证失败，请刷新页面后重试",en:"Authentication failed. Please refresh and try again"},flowTimeout:{zh:"配置超时，请重试",en:"Configuration timed out, please try again"},selectEntryTitle:{zh:"选择集成实例",en:"Select Entry"},selectEntrySubtitle:{zh:"此集成有多个实例，请选择要配置的实例",en:"Multiple instances found, please select one to configure"},currentEntry:{zh:"当前",en:"Current"},flowSubmitFailed:{zh:"提交失败",en:"Submit failed"},flowUnknownType:{zh:"集成返回了未知流程类型（{type}），请前往设备与服务完成配置。",en:"Unknown flow type ({type}). Please configure in Devices & Services."},flowExternalAuth:{zh:"此集成需要外部认证，请在打开的页面中完成授权。",en:"This integration requires external authentication. Please complete authorization in the opened page."},flowStepNext:{zh:"下一步",en:"Next"},flowStepFinish:{zh:"完成",en:"Finish"},flowCancel:{zh:"取消",en:"Cancel"},flowBack:{zh:"← 返回",en:"← Back"},flowClose:{zh:"关闭",en:"Close"},flowDone:{zh:"完成",en:"Done"},flowGotIt:{zh:"知道了",en:"Got it"},flowResultCreated:{zh:"配置完成",en:"Setup Complete"},flowResultCreatedDesc:{zh:"集成已成功添加到设备与服务",en:"Integration has been added to Devices & Services"},flowResultAborted:{zh:"无需配置",en:"Skipped"},flowResultAbortedDesc:{zh:"该集成已被跳过",en:"Integration was skipped"},flowResultExternal:{zh:"外部认证",en:"External Authentication"},flowResultExternalDesc:{zh:"请在外部页面完成授权。",en:"Please authorize in the external page."},flowResultFailed:{zh:"配置失败",en:"Setup Failed"},flowResultFailedDesc:{zh:"请稍后在设备与服务中重试",en:"Please retry in Devices & Services"},flowAbortAlreadyConfigured:{zh:"该集成已在设备与服务中配置",en:"Already configured in Devices & Services"},flowAbortSingleInstance:{zh:"此集成只允许配置一次",en:"Only one instance allowed"},flowAbortNoDevices:{zh:"未找到可配置的设备",en:"No devices found"},flowAbortInProgress:{zh:"已有进行中的流程",en:"Flow already in progress"},flowOpenAuthPage:{zh:"打开认证页面 ↗",en:"Open auth page ↗"},flowStartFailed:{zh:"配置流程启动失败",en:"Failed to start config flow"},flowStartFailedOptions:{zh:"选项配置流程启动失败",en:"Failed to start options flow"}};function ge(e,t){const o=he[e];if(!o)return e;let i=o[pe]||o.zh||o.en||e;if(t)for(const[e,o]of Object.entries(t))i=i.replace(new RegExp(`\\{${e}\\}`,"g"),o);return i}const ue={integration:"#1565c0",plugin:"#7b1fa2",theme:"#2e7d32",appdaemon:"#e65100",netdaemon:"#00838f",python_script:"#f9a825",template:"#6a1b9a",dashboard:"#f57f17"};function fe(e){return ue[e]||function(e){let t=0;for(let o=0;o<e.length;o++)t=e.charCodeAt(o)+((t<<5)-t),t&=t;return`hsl(${Math.abs(t%360)}, 55%, 48%)`}(e||"default")}function me(){return s`
  /* ===== CSS Variables for Theming ===== */
  :host {
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

  /* ===== Empty ===== */
  .empty {
    text-align: center; padding: 60px 20px;
    color: var(--secondary-text-color, #727272);
  }
  .empty svg { width: 60px; height: 60px; margin-bottom: 16px; opacity: 0.3; }

  /* ===== Info Bar ===== */
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
  .btn.danger { color: #f44336; border-color: #f44336; }
  .btn.danger:hover { background: #f44336; color: #fff; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

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
`}
/*! @license DOMPurify 3.4.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.8/LICENSE */function be(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,i=Array(t);o<t;o++)i[o]=e[o];return i}function ve(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var o=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=o){var i,r,s,a,n=[],l=!0,c=!1;try{if(s=(o=o.call(e)).next,0===t);else for(;!(l=(i=s.call(o)).done)&&(n.push(i.value),n.length!==t);l=!0);}catch(e){c=!0,r=e}finally{try{if(!l&&null!=o.return&&(a=o.return(),Object(a)!==a))return}finally{if(c)throw r}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return be(e,t);var o={}.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?be(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const xe=Object.entries,ye=Object.setPrototypeOf,_e=Object.isFrozen,we=Object.getPrototypeOf,$e=Object.getOwnPropertyDescriptor;let ke=Object.freeze,Se=Object.seal,ze=Object.create,Ce="undefined"!=typeof Reflect&&Reflect,Ae=Ce.apply,Re=Ce.construct;ke||(ke=function(e){return e}),Se||(Se=function(e){return e}),Ae||(Ae=function(e,t){for(var o=arguments.length,i=new Array(o>2?o-2:0),r=2;r<o;r++)i[r-2]=arguments[r];return e.apply(t,i)}),Re||(Re=function(e){for(var t=arguments.length,o=new Array(t>1?t-1:0),i=1;i<t;i++)o[i-1]=arguments[i];return new e(...o)});const Ee=Ke(Array.prototype.forEach),Te=Ke(Array.prototype.lastIndexOf),De=Ke(Array.prototype.pop),Fe=Ke(Array.prototype.push),Ie=Ke(Array.prototype.splice),Le=Array.isArray,Me=Ke(String.prototype.toLowerCase),Oe=Ke(String.prototype.toString),Ne=Ke(String.prototype.match),Be=Ke(String.prototype.replace),Pe=Ke(String.prototype.indexOf),Ue=Ke(String.prototype.trim),He=Ke(Number.prototype.toString),je=Ke(Boolean.prototype.toString),Ve="undefined"==typeof BigInt?null:Ke(BigInt.prototype.toString),qe="undefined"==typeof Symbol?null:Ke(Symbol.prototype.toString),Ge=Ke(Object.prototype.hasOwnProperty),Ye=Ke(Object.prototype.toString),We=Ke(RegExp.prototype.test),Xe=(Je=TypeError,function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return Re(Je,t)});var Je;function Ke(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var o=arguments.length,i=new Array(o>1?o-1:0),r=1;r<o;r++)i[r-1]=arguments[r];return Ae(e,t,i)}}function Ze(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Me;if(ye&&ye(e,null),!Le(t))return e;let i=t.length;for(;i--;){let r=t[i];if("string"==typeof r){const e=o(r);e!==r&&(_e(t)||(t[i]=e),r=e)}e[r]=!0}return e}function Qe(e){for(let t=0;t<e.length;t++){Ge(e,t)||(e[t]=null)}return e}function et(e){const t=ze(null);for(const i of xe(e)){var o=ve(i,2);const r=o[0],s=o[1];Ge(e,r)&&(Le(s)?t[r]=Qe(s):s&&"object"==typeof s&&s.constructor===Object?t[r]=et(s):t[r]=s)}return t}function tt(e,t){for(;null!==e;){const o=$e(e,t);if(o){if(o.get)return Ke(o.get);if("function"==typeof o.value)return Ke(o.value)}e=we(e)}return function(){return null}}const ot=ke(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),it=ke(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),rt=ke(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),st=ke(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),at=ke(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),nt=ke(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),lt=ke(["#text"]),ct=ke(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),dt=ke(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),pt=ke(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ht=ke(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),gt=Se(/{{[\w\W]*|^[\w\W]*}}/g),ut=Se(/<%[\w\W]*|^[\w\W]*%>/g),ft=Se(/\${[\w\W]*/g),mt=Se(/^data-[\-\w.\u00B7-\uFFFF]+$/),bt=Se(/^aria-[\-\w]+$/),vt=Se(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),xt=Se(/^(?:\w+script|data):/i),yt=Se(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),_t=Se(/^html$/i),wt=Se(/^[a-z][.\w]*(-[.\w]+)+$/i),$t=1,kt=3,St=7,zt=8,Ct=9,At=11,Rt=function(){return"undefined"==typeof window?null:window};var Et=function e(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Rt();const o=t=>e(t);if(o.version="3.4.8",o.removed=[],!t||!t.document||t.document.nodeType!==Ct||!t.Element)return o.isSupported=!1,o;let i=t.document;const r=i,s=r.currentScript;t.DocumentFragment;const a=t.HTMLTemplateElement,n=t.Node,l=t.Element,c=t.NodeFilter,d=t.NamedNodeMap;void 0===d&&(t.NamedNodeMap||t.MozNamedAttrMap),t.HTMLFormElement;const p=t.DOMParser,h=t.trustedTypes,g=l.prototype,u=tt(g,"cloneNode"),f=tt(g,"remove"),m=tt(g,"nextSibling"),b=tt(g,"childNodes"),v=tt(g,"parentNode"),x=tt(g,"shadowRoot"),y=tt(g,"attributes"),_=n&&n.prototype?tt(n.prototype,"nodeType"):null,w=n&&n.prototype?tt(n.prototype,"nodeName"):null;if("function"==typeof a){const e=i.createElement("template");e.content&&e.content.ownerDocument&&(i=e.content.ownerDocument)}let $,k="",S=0;const z=function(e){if(S>0)throw Xe('The configured TRUSTED_TYPES_POLICY.createHTML must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose createHTML wraps DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');S++;try{return $.createHTML(e)}finally{S--}},C=i,A=C.implementation,R=C.createNodeIterator,E=C.createDocumentFragment,T=C.getElementsByTagName,D=r.importNode;let F={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]};o.isSupported="function"==typeof xe&&"function"==typeof v&&A&&void 0!==A.createHTMLDocument;const I=gt,L=ut,M=ft,O=mt,N=bt,B=xt,P=yt,U=wt;let H=vt,j=null;const V=Ze({},[...ot,...it,...rt,...at,...lt]);let q=null;const G=Ze({},[...ct,...dt,...pt,...ht]);let Y=Object.seal(ze(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),W=null,X=null;const J=Object.seal(ze(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let K=!0,Z=!0,Q=!1,ee=!0,te=!1,oe=!0,ie=!1,re=!1,se=!1,ae=!1,ne=!1,le=!1,ce=!0,de=!1;const pe="user-content-";let he=!0,ge=!1,ue={},fe=null;const me=Ze({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let be=null;const ve=Ze({},["audio","video","img","source","image","track"]);let ye=null;const _e=Ze({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),we="http://www.w3.org/1998/Math/MathML",$e="http://www.w3.org/2000/svg",Se="http://www.w3.org/1999/xhtml";let Ce=Se,Ae=!1,Re=null;const Je=Ze({},[we,$e,Se],Oe);let Ke=Ze({},["mi","mo","mn","ms","mtext"]),Qe=Ze({},["annotation-xml"]);const Et=Ze({},["title","style","font","a","script"]);let Tt=null;const Dt=["application/xhtml+xml","text/html"];let Ft=null,It=null;const Lt=i.createElement("form"),Mt=function(e){return e instanceof RegExp||e instanceof Function},Ot=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(It&&It===e)return;e&&"object"==typeof e||(e={}),e=et(e),Tt=-1===Dt.indexOf(e.PARSER_MEDIA_TYPE)?"text/html":e.PARSER_MEDIA_TYPE,Ft="application/xhtml+xml"===Tt?Oe:Me,j=Ge(e,"ALLOWED_TAGS")&&Le(e.ALLOWED_TAGS)?Ze({},e.ALLOWED_TAGS,Ft):V,q=Ge(e,"ALLOWED_ATTR")&&Le(e.ALLOWED_ATTR)?Ze({},e.ALLOWED_ATTR,Ft):G,Re=Ge(e,"ALLOWED_NAMESPACES")&&Le(e.ALLOWED_NAMESPACES)?Ze({},e.ALLOWED_NAMESPACES,Oe):Je,ye=Ge(e,"ADD_URI_SAFE_ATTR")&&Le(e.ADD_URI_SAFE_ATTR)?Ze(et(_e),e.ADD_URI_SAFE_ATTR,Ft):_e,be=Ge(e,"ADD_DATA_URI_TAGS")&&Le(e.ADD_DATA_URI_TAGS)?Ze(et(ve),e.ADD_DATA_URI_TAGS,Ft):ve,fe=Ge(e,"FORBID_CONTENTS")&&Le(e.FORBID_CONTENTS)?Ze({},e.FORBID_CONTENTS,Ft):me,W=Ge(e,"FORBID_TAGS")&&Le(e.FORBID_TAGS)?Ze({},e.FORBID_TAGS,Ft):et({}),X=Ge(e,"FORBID_ATTR")&&Le(e.FORBID_ATTR)?Ze({},e.FORBID_ATTR,Ft):et({}),ue=!!Ge(e,"USE_PROFILES")&&(e.USE_PROFILES&&"object"==typeof e.USE_PROFILES?et(e.USE_PROFILES):e.USE_PROFILES),K=!1!==e.ALLOW_ARIA_ATTR,Z=!1!==e.ALLOW_DATA_ATTR,Q=e.ALLOW_UNKNOWN_PROTOCOLS||!1,ee=!1!==e.ALLOW_SELF_CLOSE_IN_ATTR,te=e.SAFE_FOR_TEMPLATES||!1,oe=!1!==e.SAFE_FOR_XML,ie=e.WHOLE_DOCUMENT||!1,ae=e.RETURN_DOM||!1,ne=e.RETURN_DOM_FRAGMENT||!1,le=e.RETURN_TRUSTED_TYPE||!1,se=e.FORCE_BODY||!1,ce=!1!==e.SANITIZE_DOM,de=e.SANITIZE_NAMED_PROPS||!1,he=!1!==e.KEEP_CONTENT,ge=e.IN_PLACE||!1,H=function(e){try{return We(e,""),!0}catch(e){return!1}}(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:vt,Ce="string"==typeof e.NAMESPACE?e.NAMESPACE:Se,Ke=Ge(e,"MATHML_TEXT_INTEGRATION_POINTS")&&e.MATHML_TEXT_INTEGRATION_POINTS&&"object"==typeof e.MATHML_TEXT_INTEGRATION_POINTS?et(e.MATHML_TEXT_INTEGRATION_POINTS):Ze({},["mi","mo","mn","ms","mtext"]),Qe=Ge(e,"HTML_INTEGRATION_POINTS")&&e.HTML_INTEGRATION_POINTS&&"object"==typeof e.HTML_INTEGRATION_POINTS?et(e.HTML_INTEGRATION_POINTS):Ze({},["annotation-xml"]);const t=Ge(e,"CUSTOM_ELEMENT_HANDLING")&&e.CUSTOM_ELEMENT_HANDLING&&"object"==typeof e.CUSTOM_ELEMENT_HANDLING?et(e.CUSTOM_ELEMENT_HANDLING):ze(null);if(Y=ze(null),Ge(t,"tagNameCheck")&&Mt(t.tagNameCheck)&&(Y.tagNameCheck=t.tagNameCheck),Ge(t,"attributeNameCheck")&&Mt(t.attributeNameCheck)&&(Y.attributeNameCheck=t.attributeNameCheck),Ge(t,"allowCustomizedBuiltInElements")&&"boolean"==typeof t.allowCustomizedBuiltInElements&&(Y.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),te&&(Z=!1),ne&&(ae=!0),ue&&(j=Ze({},lt),q=ze(null),!0===ue.html&&(Ze(j,ot),Ze(q,ct)),!0===ue.svg&&(Ze(j,it),Ze(q,dt),Ze(q,ht)),!0===ue.svgFilters&&(Ze(j,rt),Ze(q,dt),Ze(q,ht)),!0===ue.mathMl&&(Ze(j,at),Ze(q,pt),Ze(q,ht))),J.tagCheck=null,J.attributeCheck=null,Ge(e,"ADD_TAGS")&&("function"==typeof e.ADD_TAGS?J.tagCheck=e.ADD_TAGS:Le(e.ADD_TAGS)&&(j===V&&(j=et(j)),Ze(j,e.ADD_TAGS,Ft))),Ge(e,"ADD_ATTR")&&("function"==typeof e.ADD_ATTR?J.attributeCheck=e.ADD_ATTR:Le(e.ADD_ATTR)&&(q===G&&(q=et(q)),Ze(q,e.ADD_ATTR,Ft))),Ge(e,"ADD_URI_SAFE_ATTR")&&Le(e.ADD_URI_SAFE_ATTR)&&Ze(ye,e.ADD_URI_SAFE_ATTR,Ft),Ge(e,"FORBID_CONTENTS")&&Le(e.FORBID_CONTENTS)&&(fe===me&&(fe=et(fe)),Ze(fe,e.FORBID_CONTENTS,Ft)),Ge(e,"ADD_FORBID_CONTENTS")&&Le(e.ADD_FORBID_CONTENTS)&&(fe===me&&(fe=et(fe)),Ze(fe,e.ADD_FORBID_CONTENTS,Ft)),he&&(j["#text"]=!0),ie&&Ze(j,["html","head","body"]),j.table&&(Ze(j,["tbody"]),delete W.tbody),e.TRUSTED_TYPES_POLICY){if("function"!=typeof e.TRUSTED_TYPES_POLICY.createHTML)throw Xe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof e.TRUSTED_TYPES_POLICY.createScriptURL)throw Xe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const t=$;$=e.TRUSTED_TYPES_POLICY;try{k=z("")}catch(e){throw $=t,e}}else void 0===$&&null!==e.TRUSTED_TYPES_POLICY&&($=function(e,t){if("object"!=typeof e||"function"!=typeof e.createPolicy)return null;let o=null;const i="data-tt-policy-suffix";t&&t.hasAttribute(i)&&(o=t.getAttribute(i));const r="dompurify"+(o?"#"+o:"");try{return e.createPolicy(r,{createHTML:e=>e,createScriptURL:e=>e})}catch(e){return console.warn("TrustedTypes policy "+r+" could not be created."),null}}(h,s)),$&&"string"==typeof k&&(k=z(""));(F.uponSanitizeElement.length>0||F.uponSanitizeAttribute.length>0)&&j===V&&(j=et(j)),F.uponSanitizeAttribute.length>0&&q===G&&(q=et(q)),ke&&ke(e),It=e},Nt=Ze({},[...it,...rt,...st]),Bt=Ze({},[...at,...nt]),Pt=function(e){Fe(o.removed,{element:e});try{v(e).removeChild(e)}catch(t){f(e)}},Ut=function(e,t){try{Fe(o.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){Fe(o.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e)if(ae||ne)try{Pt(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}},Ht=function(e){let t=null,o=null;if(se)e="<remove></remove>"+e;else{const t=Ne(e,/^[\r\n\t ]+/);o=t&&t[0]}"application/xhtml+xml"===Tt&&Ce===Se&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");const r=$?z(e):e;if(Ce===Se)try{t=(new p).parseFromString(r,Tt)}catch(e){}if(!t||!t.documentElement){t=A.createDocument(Ce,"template",null);try{t.documentElement.innerHTML=Ae?k:r}catch(e){}}const s=t.body||t.documentElement;return e&&o&&s.insertBefore(i.createTextNode(o),s.childNodes[0]||null),Ce===Se?T.call(t,ie?"html":"body")[0]:ie?t.documentElement:s},jt=function(e){return R.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},Vt=function(e){var t,o;e.normalize();const i=R.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null);let r=i.nextNode();for(;r;){let e=r.data;Ee([I,L,M],t=>{e=Be(e,t," ")}),r.data=e,r=i.nextNode()}const s=null!==(t=null===(o=e.querySelectorAll)||void 0===o?void 0:o.call(e,"template"))&&void 0!==t?t:[];Ee(Array.from(s),e=>{Gt(e.content)&&Vt(e.content)})},qt=function(e){const t=w?w(e):null;return"string"==typeof t&&("form"===Ft(t)&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||e.attributes!==y(e)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes||e.nodeType!==_(e)||e.childNodes!==b(e)))},Gt=function(e){if(!_||"object"!=typeof e||null===e)return!1;try{return _(e)===At}catch(e){return!1}},Yt=function(e){if(!_||"object"!=typeof e||null===e)return!1;try{return"number"==typeof _(e)}catch(e){return!1}};function Wt(e,t,i){Ee(e,e=>{e.call(o,t,i,It)})}const Xt=function(e){let t=null;if(Wt(F.beforeSanitizeElements,e,null),qt(e))return Pt(e),!0;const i=Ft(w?w(e):e.nodeName);if(Wt(F.uponSanitizeElement,e,{tagName:i,allowedTags:j}),oe&&e.hasChildNodes()&&!Yt(e.firstElementChild)&&We(/<[/\w!]/g,e.innerHTML)&&We(/<[/\w!]/g,e.textContent))return Pt(e),!0;if(oe&&e.namespaceURI===Se&&"style"===i&&Yt(e.firstElementChild))return Pt(e),!0;if(e.nodeType===St)return Pt(e),!0;if(oe&&e.nodeType===zt&&We(/<[/\w]/g,e.data))return Pt(e),!0;if(W[i]||!(J.tagCheck instanceof Function&&J.tagCheck(i))&&!j[i]){if(!W[i]&&Zt(i)){if(Y.tagNameCheck instanceof RegExp&&We(Y.tagNameCheck,i))return!1;if(Y.tagNameCheck instanceof Function&&Y.tagNameCheck(i))return!1}if(he&&!fe[i]){const t=v(e),o=b(e);if(o&&t){for(let i=o.length-1;i>=0;--i){const r=u(o[i],!0);t.insertBefore(r,m(e))}}}return Pt(e),!0}return((_?_(e):e.nodeType)!==$t||function(e){let t=v(e);t&&t.tagName||(t={namespaceURI:Ce,tagName:"template"});const o=Me(e.tagName),i=Me(t.tagName);return!!Re[e.namespaceURI]&&(e.namespaceURI===$e?t.namespaceURI===Se?"svg"===o:t.namespaceURI===we?"svg"===o&&("annotation-xml"===i||Ke[i]):Boolean(Nt[o]):e.namespaceURI===we?t.namespaceURI===Se?"math"===o:t.namespaceURI===$e?"math"===o&&Qe[i]:Boolean(Bt[o]):e.namespaceURI===Se?!(t.namespaceURI===$e&&!Qe[i])&&!(t.namespaceURI===we&&!Ke[i])&&!Bt[o]&&(Et[o]||!Nt[o]):!("application/xhtml+xml"!==Tt||!Re[e.namespaceURI]))}(e))&&("noscript"!==i&&"noembed"!==i&&"noframes"!==i||!We(/<\/no(script|embed|frames)/i,e.innerHTML))?(te&&e.nodeType===kt&&(t=e.textContent,Ee([I,L,M],e=>{t=Be(t,e," ")}),e.textContent!==t&&(Fe(o.removed,{element:e.cloneNode()}),e.textContent=t)),Wt(F.afterSanitizeElements,e,null),!1):(Pt(e),!0)},Jt=function(e,t,o){if(X[t])return!1;if(ce&&("id"===t||"name"===t)&&(o in i||o in Lt))return!1;const r=q[t]||J.attributeCheck instanceof Function&&J.attributeCheck(t,e);if(Z&&!X[t]&&We(O,t));else if(K&&We(N,t));else if(!r||X[t]){if(!(Zt(e)&&(Y.tagNameCheck instanceof RegExp&&We(Y.tagNameCheck,e)||Y.tagNameCheck instanceof Function&&Y.tagNameCheck(e))&&(Y.attributeNameCheck instanceof RegExp&&We(Y.attributeNameCheck,t)||Y.attributeNameCheck instanceof Function&&Y.attributeNameCheck(t,e))||"is"===t&&Y.allowCustomizedBuiltInElements&&(Y.tagNameCheck instanceof RegExp&&We(Y.tagNameCheck,o)||Y.tagNameCheck instanceof Function&&Y.tagNameCheck(o))))return!1}else if(ye[t]);else if(We(H,Be(o,P,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==Pe(o,"data:")||!be[e]){if(Q&&!We(B,Be(o,P,"")));else if(o)return!1}else;return!0},Kt=Ze({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Zt=function(e){return!Kt[Me(e)]&&We(U,e)},Qt=function(e){Wt(F.beforeSanitizeAttributes,e,null);const t=e.attributes;if(!t||qt(e))return;const i={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:q,forceKeepAttr:void 0};let r=t.length;for(;r--;){const s=t[r],a=s.name,n=s.namespaceURI,l=s.value,c=Ft(a),d=l;let p="value"===a?d:Ue(d);if(i.attrName=c,i.attrValue=p,i.keepAttr=!0,i.forceKeepAttr=void 0,Wt(F.uponSanitizeAttribute,e,i),p=i.attrValue,!de||"id"!==c&&"name"!==c||0===Pe(p,pe)||(Ut(a,e),p=pe+p),oe&&We(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,p)){Ut(a,e);continue}if("attributename"===c&&Ne(p,"href")){Ut(a,e);continue}if(i.forceKeepAttr)continue;if(!i.keepAttr){Ut(a,e);continue}if(!ee&&We(/\/>/i,p)){Ut(a,e);continue}te&&Ee([I,L,M],e=>{p=Be(p,e," ")});const g=Ft(e.nodeName);if(Jt(g,c,p)){if($&&"object"==typeof h&&"function"==typeof h.getAttributeType)if(n);else switch(h.getAttributeType(g,c)){case"TrustedHTML":p=z(p);break;case"TrustedScriptURL":p=$.createScriptURL(p)}if(p!==d)try{n?e.setAttributeNS(n,a,p):e.setAttribute(a,p),qt(e)?Pt(e):De(o.removed)}catch(t){Ut(a,e)}}else Ut(a,e)}Wt(F.afterSanitizeAttributes,e,null)},eo=function(e){let t=null;const o=jt(e);for(Wt(F.beforeSanitizeShadowDOM,e,null);t=o.nextNode();){Wt(F.uponSanitizeShadowNode,t,null),Xt(t),Qt(t),Gt(t.content)&&eo(t.content);if((_?_(t):t.nodeType)===$t){const e=x?x(t):t.shadowRoot;Gt(e)&&(to(e),eo(e))}}Wt(F.afterSanitizeShadowDOM,e,null)},to=function(e){const t=_?_(e):e.nodeType;if(t===$t){const t=x?x(e):e.shadowRoot;Gt(t)&&(to(t),eo(t))}const o=b?b(e):e.childNodes;if(!o)return;const i=[];Ee(o,e=>{Fe(i,e)});for(const e of i)to(e);if(t===$t){const t=w?w(e):null;if("string"==typeof t&&"template"===Ft(t)){const t=e.content;Gt(t)&&to(t)}}};return o.sanitize=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=null,s=null,a=null,n=null;if(Ae=!e,Ae&&(e="\x3c!--\x3e"),"string"!=typeof e&&!Yt(e)&&"string"!=typeof(e=function(e){switch(typeof e){case"string":return e;case"number":return He(e);case"boolean":return je(e);case"bigint":return Ve?Ve(e):"0";case"symbol":return qe?qe(e):"Symbol()";case"undefined":default:return Ye(e);case"function":case"object":{if(null===e)return Ye(e);const t=e,o=tt(t,"toString");if("function"==typeof o){const e=o(t);return"string"==typeof e?e:Ye(e)}return Ye(e)}}}(e)))throw Xe("dirty is not a string, aborting");if(!o.isSupported)return e;if(re||Ot(t),o.removed=[],"string"==typeof e&&(ge=!1),ge){const t=w?w(e):e.nodeName;if("string"==typeof t){const e=Ft(t);if(!j[e]||W[e])throw Xe("root node is forbidden and cannot be sanitized in-place")}if(qt(e))throw Xe("root node is clobbered and cannot be sanitized in-place");to(e)}else if(Yt(e))i=Ht("\x3c!----\x3e"),s=i.ownerDocument.importNode(e,!0),s.nodeType===$t&&"BODY"===s.nodeName||"HTML"===s.nodeName?i=s:i.appendChild(s),to(s);else{if(!ae&&!te&&!ie&&-1===e.indexOf("<"))return $&&le?z(e):e;if(i=Ht(e),!i)return ae?null:le?k:""}i&&se&&Pt(i.firstChild);const l=jt(ge?e:i);for(;a=l.nextNode();)Xt(a),Qt(a),Gt(a.content)&&eo(a.content);if(ge)return te&&Vt(e),e;if(ae){if(te&&Vt(i),ne)for(n=E.call(i.ownerDocument);i.firstChild;)n.appendChild(i.firstChild);else n=i;return(q.shadowroot||q.shadowrootmode)&&(n=D.call(r,n,!0)),n}let c=ie?i.outerHTML:i.innerHTML;return ie&&j["!doctype"]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&We(_t,i.ownerDocument.doctype.name)&&(c="<!DOCTYPE "+i.ownerDocument.doctype.name+">\n"+c),te&&Ee([I,L,M],e=>{c=Be(c,e," ")}),$&&le?z(c):c},o.setConfig=function(){Ot(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),re=!0},o.clearConfig=function(){It=null,re=!1},o.isValidAttribute=function(e,t,o){It||Ot({});const i=Ft(e),r=Ft(t);return Jt(i,r,o)},o.addHook=function(e,t){"function"==typeof t&&Fe(F[e],t)},o.removeHook=function(e,t){if(void 0!==t){const o=Te(F[e],t);return-1===o?void 0:Ie(F[e],o,1)[0]}return De(F[e])},o.removeHooks=function(e){F[e]=[]},o.removeAllHooks=function(){F={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},o}();class Tt extends(de(ae)){static properties={currentView:{type:String},stats:{type:Object},hass:{type:Object},narrow:{type:Boolean},_apiReady:{type:Boolean,state:!0},_error:{type:String,state:!0},_detailRepo:{type:Object,state:!0},_showDetail:{type:Boolean,state:!0},_favoriteCount:{type:Number,state:!0},_readmeHtml:{type:String,state:!0},_readmeLoading:{type:Boolean,state:!0},_viewTransition:{type:Boolean,state:!0},_networkStatus:{type:String,state:!0},_detailExpanded:{type:Boolean,state:!0},_showVersionSelector:{type:Boolean,state:!0},_releases:{type:Array,state:!0},_releasesLoading:{type:Boolean,state:!0},_installingVersion:{type:Boolean,state:!0},_changelogData:{type:Object,state:!0},_changelogLoading:{type:Boolean,state:!0},_presetFilter:{type:String,state:!0},_presetTag:{type:String,state:!0},_releaseTab:{type:Number,state:!0},_configFlowDomain:{type:String,state:!0},_configFlowEntryId:{type:String,state:!0},_showConfigFlow:{type:Boolean,state:!0},_configEntries:{type:Object,state:!0},_showEntrySelector:{type:Boolean,state:!0},_entrySelectorDomain:{type:String,state:!0},_entrySelectorEntries:{type:Array,state:!0},_entrySelectorCurrentId:{type:String,state:!0}};constructor(){super(),this.currentView=(()=>{try{return localStorage.getItem("hacs_vision_tab")}catch{return null}})()||"browse",this.stats={pendingRestart:0},this.narrow=window.innerWidth<768,this._apiReady=!1,this._error="",this._detailRepo=null,this._showDetail=!1,this._favoriteCount=0,this._readmeHtml=null,this._readmeLoading=!1,this._viewTransition=!1,this._networkStatus="online",this._detailExpanded=!1,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._installingVersion=!1,this._changelogData=null,this._changelogLoading=!1,this._presetFilter="",this._presetTag="",this._releaseTab=0,this._configFlowDomain="",this._configFlowEntryId=null,this._showConfigFlow=!1,this._configEntries=null,this._showEntrySelector=!1,this._entrySelectorDomain="",this._entrySelectorEntries=[],this._entrySelectorCurrentId=null,Ft(this),this._resizeHandler=()=>{this.narrow=window.innerWidth<768},window.addEventListener("resize",this._resizeHandler),this._onlineHandler=()=>{this._networkStatus="online"},this._offlineHandler=()=>{this._networkStatus="offline"},window.addEventListener("online",this._onlineHandler),window.addEventListener("offline",this._offlineHandler)}async _updateFavoriteCount(){try{const e=await ce.getFavorites(),t=Array.isArray(e)?e:e.favorites||[];this._favoriteCount=t.length}catch{this._favoriteCount=0}}willUpdate(e){var t;e.has("hass")&&this.hass&&(t=this.hass,t?.language&&(pe=0===t.language.indexOf("zh")?"zh":"en"),ce.setHass(this.hass),this._apiReady||(this._apiReady=!0,Promise.all([this._loadStats(),this._loadConfigEntries()]).catch(e=>console.error("Init error:",e)),ce._onNetworkStatus=e=>{this._networkStatus=e}))}static styles=[me(),s`
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
      padding: 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      min-height: 60vh;
      background: var(--primary-background-color, #f5f5f5);
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
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
      background: var(--primary-color, #03a9f4); border-radius: 12px; color: #fff;
      font-size: 22px; font-weight: 700;
    }
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
      line-height: 1.3; white-space: nowrap; cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap;
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
      padding-top: env(safe-area-inset-top, 0px);
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
      transition: opacity 0.15s ease;
    }
    .content.transitioning { opacity: 0; }
    /* Force hidden views to not display (child :host display overrides [hidden]) */
    .content > [hidden] { display: none !important; }

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
    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
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
      .store { padding: 8px 10px; padding-top: calc(8px + env(safe-area-inset-top, 0px)); padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); }
      .header {
        flex-direction: row; align-items: center; justify-content: space-between;
        padding: 8px 12px; margin-bottom: 8px; border-radius: 12px;
      }
      .header-left { gap: 6px; align-items: center; }
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
      .sticky-header { margin: 0 -10px 8px; padding: 0 10px 8px; }
      .tab { padding: 8px 12px; font-size: 12px; min-height: 44px; display: flex; align-items: center; }
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
  `];async connectedCallback(){super.connectedCallback(),this.addEventListener("refresh-stats",()=>this._loadStats()),this.addEventListener("detail",e=>this._openDetail(e.detail.repo)),this.addEventListener("favorite",()=>this._loadStats()),this.addEventListener("open-flow",e=>{const t=e.detail?.domain;t&&this._openConfigFlow(t)}),this.addEventListener("open-options-flow",e=>{const{entryId:t,domain:o}=e.detail||{};t&&this._openOptionsFlow(t,o)}),this._keydownHandler=e=>{if("Escape"===e.key&&this._showDetail)return e.preventDefault(),void this._closeDetail();if((e.ctrlKey||e.metaKey)&&"k"===e.key){e.preventDefault();const t=this.renderRoot?.querySelector(".search input");return void(t&&(t.focus(),t.select()))}if(!this._showDetail&&"INPUT"!==document.activeElement?.tagName&&"SELECT"!==document.activeElement?.tagName&&"TEXTAREA"!==document.activeElement?.tagName){const t=["browse","updates","management","settings"],o=parseInt(e.key);o>=1&&o<=t.length&&(e.preventDefault(),this.switchView(t[o-1]))}},window.addEventListener("keydown",this._keydownHandler),document.hidden||this._checkCacheVersion(),this._visibilityHandler=()=>{document.hidden||this._checkCacheVersion()},document.addEventListener("visibilitychange",this._visibilityHandler)}disconnectedCallback(){super.disconnectedCallback(),this._clearFlowTimeout(),window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("online",this._onlineHandler),window.removeEventListener("offline",this._offlineHandler),window.removeEventListener("keydown",this._keydownHandler),this._visibilityHandler&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)}async _loadStats(){try{this._error="",this.stats=await ce.getStats();const e=await ce.getFavorites(),t=Array.isArray(e)?e:e.favorites||[];this._favoriteCount=t.length}catch(e){console.error("Stats error:",e),this.stats={},this._error=`API: ${e.message}`}}async _checkCacheVersion(){try{const e=document.querySelector('script[src*="panel.js"]');if(!e)return;const t=new URL(e.src,location.href).searchParams.get("v");if(!t)return;const o=await fetch("./build.json?_t="+Date.now());if(!o.ok)return;const i=await o.json();i.hash&&i.hash!==t&&location.reload()}catch(e){console.warn("Cache check error:",e)}}async _restartHA(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Ut});if(await e.show(this,{message:ge("restartConfirm"),confirmText:ge("restartHA"),danger:!0}))try{await ce.restartHA(),Mt(ge("haRestarting"),"info")}catch(e){Mt(`${ge("restartFailed")}: ${e.message}`,"error")}}switchView(e){if(this.currentView!==e){this._viewTransition=!0,this.currentView=e;try{localStorage.setItem("hacs_vision_tab",e)}catch(e){}this.dispatchEvent(new CustomEvent("view-changed",{detail:{view:e},bubbles:!0,composed:!0})),setTimeout(()=>{this._viewTransition=!1},150)}}_openDetail(e){this._detailRepo=e,this._showDetail=!0,this._readmeHtml=null,this._readmeLoading=!0,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._changelogData=null,this._changelogLoading=!0,this._loadReadme(e),this._loadChangelog(e),requestAnimationFrame(()=>this._installFocusTrap())}async _loadReadme(e){if(e?.full_name){try{const t=await ce.getReadme(e.full_name);this._readmeHtml=t?Et.sanitize(t):null}catch(e){this._readmeHtml=null}this._readmeLoading=!1}else this._readmeLoading=!1}async _loadChangelog(e){if(e?.full_name){try{const t=await ce.getChangelog(e.full_name);this._changelogData=t?.body?t:null}catch(e){this._changelogData=null}this._changelogLoading=!1}else this._changelogLoading=!1}_applyFilter(e){this._presetFilter=e,this.switchView("browse"),setTimeout(()=>{this._presetFilter=""},100)}_applyTag(e){this._presetTag=e,this.switchView("browse"),setTimeout(()=>{this._presetTag=""},100)}_closeDetail(){this._showDetail=!1,this._detailRepo=null,this._readmeHtml=null,this._readmeLoading=!1,this._detailExpanded=!1,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._removeFocusTrap()}_installFocusTrap(){this._removeFocusTrap();const e=this.renderRoot?.querySelector(".modal-overlay");if(!e)return;this._focusTrapHandler=t=>{if("Tab"!==t.key)return;const o=e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(0===o.length)return;const i=o[0],r=o[o.length-1];t.shiftKey?document.activeElement!==i&&e.contains(document.activeElement)||(t.preventDefault(),r.focus()):document.activeElement!==r&&e.contains(document.activeElement)||(t.preventDefault(),i.focus())};const t=e.querySelector(".modal-close");t&&t.focus(),window.addEventListener("keydown",this._focusTrapHandler)}_removeFocusTrap(){this._focusTrapHandler&&(window.removeEventListener("keydown",this._focusTrapHandler),this._focusTrapHandler=null)}_openConfigFlow(e){this._configFlowDomain=e,this._configFlowEntryId=null,this._showConfigFlow=!0}_openOptionsFlow(e,t){if(this._configFlowDomain=t||"",this._configFlowEntryId=null,t&&this._configEntries&&this._configEntries[t]&&this._configEntries[t].length>1)return this._entrySelectorDomain=t,this._entrySelectorEntries=this._configEntries[t],this._entrySelectorCurrentId=e,void(this._showEntrySelector=!0);this._configFlowEntryId=e,this._showConfigFlow=!0}_selectConfigEntry(e){if(this._showEntrySelector=!1,this._configFlowEntryId=e,this._configEntries)for(const t of Object.values(this._configEntries)){const o=t.find(t=>t.entry_id===e);if(o){this._configFlowDomain=o.domain||"";break}}this._showConfigFlow=!0}async _loadConfigEntries(){try{const e=await ce.getConfigEntries(),t=e?.entries||[],o={};if(Array.isArray(t))for(const e of t){const t=e.domain||e.handler||"?";o[t]||(o[t]=[]),o[t].push(e)}this._configEntries=o}catch{this._configEntries=null}}async _checkUpdates(){try{const e=await ce.checkUpdatesWithNotify();e.success&&(e.updates_found>0?Mt(ge("updatesChecked",{n:e.updates_found}),"success"):Mt(ge("noUpdatesFound"),"info"),e.notified&&Mt(ge("notifySent"),"success"),this._loadStats())}catch(e){Mt(`Update check failed: ${e.message}`,"error")}}_onConfigureIntegration(e){const{domain:t,entry_id:o}=e.detail;this._configFlowDomain=t,this._configFlowEntryId=o,this._showConfigFlow=!0,this._scheduleFlowTimeout()}_onAddIntegration(e){const{domain:t}=e.detail;this._configFlowDomain=t,this._configFlowEntryId=null,this._showConfigFlow=!0,this._scheduleFlowTimeout()}_scheduleFlowTimeout(){this._clearFlowTimeout(),this._flowTimeout=setTimeout(()=>{this._showConfigFlow&&(this._showConfigFlow=!1,this._configFlowDomain="",this._configFlowEntryId=null)},8e3)}_clearFlowTimeout(){this._flowTimeout&&(clearTimeout(this._flowTimeout),this._flowTimeout=null)}_onFlowClose(){this._clearFlowTimeout(),this._showConfigFlow=!1,this._configFlowDomain="",this._configFlowEntryId=null,this._showEntrySelector=!1}_toggleDetailExpand(){this._detailExpanded=!this._detailExpanded}async _toggleVersionSelector(){if(this._showVersionSelector=!this._showVersionSelector,this._showVersionSelector&&0===this._releases.length){this._releasesLoading=!0;try{const e=this._detailRepo?.id||this._detailRepo?.full_name;if(e){const t=await ce.getRepoReleases(e);this._releases=Array.isArray(t)?t:t.releases||[]}}catch(e){console.error("Failed to load releases:",e),this._releases=[]}this._releasesLoading=!1}}async _installVersion(e){const t=this._detailRepo?.id||this._detailRepo?.full_name;if(t&&e){this._installingVersion=!0;try{await ce.installVersion(t,e),Mt(`${ge("installComplete")}: ${e}`,"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._closeDetail()}catch(e){Mt(`${ge("installFailed")}: ${e.message}`,"error")}this._installingVersion=!1}}_getCategoryLabel(e){return{integration:ge("catIntegration"),plugin:ge("catPlugin"),theme:ge("catTheme"),appdaemon:ge("catAppDaemon"),netdaemon:ge("catNetDaemon"),python_script:ge("catPython"),template:ge("catTemplate"),dashboard:ge("catDashboard")}[e]||e}_getDomainColor(e){const t=["#1565c0","#7b1fa2","#2e7d32","#e65100","#00838f","#6a1b9a","#c62828","#283593"];let o=0;for(let t=0;t<e.length;t++)o=(o<<5)-o+e.charCodeAt(t);return t[Math.abs(o)%t.length]}_renderDetailAvatar(e){const t=e.domain;if(!t)return"";const o=`https://brands.home-assistant.io/${t}/icon.png`,i=`${window.location.origin}/api/hacs_vision_brand/${t}`,r=this._getDomainColor(t),s=t.charAt(0).toUpperCase();return H`
      <div class="detail-avatar">
        <img class="detail-avatar-img" src="${o}" alt=""
          @error=${function(){if(this.dataset.fallbackTried){this.style.display="none",this.parentElement.style.background=r;const e=this.parentElement.querySelector(".detail-avatar-letter");e&&(e.style.display="flex")}else this.dataset.fallbackTried="cdn",this.src=i}}>
        <span class="detail-avatar-letter" style="display:none">${s}</span>
      </div>
    `}async _modalAction(e){const t=this._detailRepo;if(t)try{if("install"===e)await ce.install(t.id||t.full_name,t.category),Mt(ge("installComplete"),"success");else if("update"===e)await ce.update([t.id||t.full_name]),Mt(ge("updateStarted"),"success");else if("redownload"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Ut});if(!await e.show(this,{message:`${ge("redownload")} ${t.full_name||t.name}?`,confirmText:ge("confirm"),danger:!1}))return;await ce.redownload(t.id||t.full_name,t.category),Mt(`${ge("redownload")} ${ge("successSuffix")}`,"success")}else if("uninstall"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Ut});if(!await e.show(this,{message:`${ge("confirmRemove")} ${t.full_name||t.name}?`,confirmText:ge("remove"),danger:!0}))return;await ce.remove(t.id||t.full_name),Mt(ge("removed"),"success")}else{if("github"===e){const e=t.html_url||`https://github.com/${t.full_name}`;return void window.open(e,"_blank")}if("configure"===e){this._closeDetail();const e=t.domain;if(!e)return;const o=this._configEntries?.[e];return void(o&&o.length>0?this._openOptionsFlow(o[0].entry_id,e):this._openConfigFlow(e))}}this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._closeDetail()}catch(e){Mt(`${ge("updateFailed")}: ${e.message}`,"error")}}_checkTabsScrollable(){const e=this.renderRoot?.querySelector(".tabs-wrapper"),t=e?.querySelector(".tabs");e&&t&&e.classList.toggle("scrollable",t.scrollWidth>t.clientWidth)}async updated(e){super.updated(e),e.has("narrow")&&requestAnimationFrame(()=>this._checkTabsScrollable())}firstUpdated(){requestAnimationFrame(()=>this._checkTabsScrollable())}render(){const e=[{view:"browse",label:ge("tabBrowse"),icon:"",count:null},{view:"integrations",label:ge("tabIntegrations")||"集成管理",icon:"",count:null},{view:"updates",label:ge("tabUpdates"),icon:"",count:this.stats.available_updates},{view:"management",label:ge("tabManagement"),icon:"",count:null},{view:"settings",label:ge("tabSettings"),icon:"",count:null}],t=this._detailRepo,o=t?.installed||!1,i=o&&(t?.has_update||t?.installed_version&&t?.latest_version&&t.installed_version!==t.latest_version),r=t?fe(t.category):"#03a9f4";return H`
      <div class="store">
        ${this._error?H`
          <div class="error-banner error">
            <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${ge("connectFailed")}: <code>${this._error}</code>
          </div>
        `:""}
        ${this._apiReady?"":H`
          <div class="error-banner">
            ${ge("waitingHA")}
          </div>
        `}

        ${"offline"===this._networkStatus?H`
          <div class="network-banner offline">${ge("networkOffline")}</div>
        `:"rate_limited"===this._networkStatus?H`
          <div class="network-banner warning">${ge("rateLimited")}</div>
        `:"server_error"===this._networkStatus?H`
          <div class="network-banner warning">${ge("haRestarting")}</div>
        `:""}

        <!-- Header -->
          <div class="header">
          <div class="header-left">
            <div class="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="title-group">
              <h1>HACS Vision</h1>
              <p>${ge("storeSubtitle")}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="stat" @click=${()=>this._applyFilter("installed")}>
              <div class="stat-num">${this.stats.total_installed??0}</div>
              <div class="stat-label">${ge("statInstalled")}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("update_available")}>
              <div class="stat-num">${this.stats.available_updates??0}</div>
              <div class="stat-label">${ge("statUpdates")}</div>
            </div>
            ${(this.stats.pending_restart??0)>0?H`
            <div class="stat" style="color:#f44336;" @click=${()=>this._applyFilter("pending_restart")}>
              <div class="stat-num">${this.stats.pending_restart}</div>
              <div class="stat-label">${ge("statusPendingRestart")}</div>
            </div>
            `:""}
            <div class="stat" @click=${()=>this._applyTag("favorites")}>
              <div class="stat-num">${this._favoriteCount??0}</div>
              <div class="stat-label">${ge("statFavorites")||"收藏"}</div>
            </div>
            <div class="stat" @click=${()=>this._applyTag("custom")}>
              <div class="stat-num">${this.stats.custom_count??0}</div>
              <div class="stat-label">${ge("statCustom")||"自定义"}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("")}>
              <div class="stat-num">${this.stats.total_repos??0}</div>
              <div class="stat-label">${ge("statRepos")}</div>
            </div>
          </div>
        </div>

        ${(this.stats.pending_restart??0)>0?H`
        <div class="restart-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${ge("statusPendingRestart")}: ${this.stats.pending_restart} ${ge("repositories")}</span>
          <button class="restart-bar-btn" @click=${this._restartHA}>${ge("restartHA")}</button>
          <button class="restart-bar-btn outline" @click=${()=>this._applyFilter("pending_restart")}>${ge("viewDetail")||"查看"}</button>
        </div>
        `:""}

        <!-- Sticky Tabs -->
        <div class="sticky-header">
          <div class="tabs-wrapper">
            <div class="tabs" role="tablist">
              ${e.map(e=>H`
                <button class="tab ${this.currentView===e.view?"active":""}"
                        role="tab" aria-selected=${this.currentView===e.view}
                        aria-label=${e.label}
                        @click=${()=>this.switchView(e.view)}>
                  ${e.icon?H`${e.icon} `:""}${e.label}
                  ${void 0!==e.count&&null!==e.count?H`<span class="badge" aria-label="${e.count}">${e.count}</span>`:""}
                </button>
              `)}
            </div>
          </div>
        </div>

        <!-- Content with fade transition -->
        <div class="content ${this._viewTransition?"transitioning":""}">
          <browse-view .hass=${this.hass} .presetFilter=${this._presetFilter} .presetTag=${this._presetTag} .pendingRestart=${this.stats.pending_restart??0} ?hidden=${"browse"!==this.currentView}></browse-view>
          <integrations-list .hass=${this.hass} ?hidden=${"integrations"!==this.currentView} @configure-integration=${this._onConfigureIntegration} @add-integration=${this._onAddIntegration}></integrations-list>
          <updates-view .hass=${this.hass} ?hidden=${"updates"!==this.currentView}></updates-view>
          <management-view .hass=${this.hass} ?hidden=${"management"!==this.currentView}></management-view>
          <config-view .hass=${this.hass} @refresh-stats=${this._loadStats} ?hidden=${"settings"!==this.currentView}></config-view>
        </div>
      </div>

      <!-- Detail Modal -->
      ${this._showDetail&&t?H`
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="${t.manifest_name||t.full_name||ge("detail")}" @click=${e=>{e.target===e.currentTarget&&this._closeDetail()}}>
          <div class="modal ${this._detailExpanded?"expanded":""}" @dblclick=${this._toggleDetailExpand}>
            ${this._detailExpanded?"":H`<div class="modal-expand-hint">${ge("dblZoomHint")||"双击放大"}</div>`}
            <div class="modal-header">
              <div class="modal-header-left">
                ${this._renderDetailAvatar(t)}
                <div>
                  <div class="modal-title">${t.manifest_name||t.repository_manifest?.name||t.full_name||t.name||"unknown"}</div>
                </div>
              </div>
              <button class="modal-close" aria-label="${ge("close")||"关闭"}" @click=${this._closeDetail}>✕</button>
            </div>
            <div class="modal-body">
              <div class="detail-category" style="background: ${r}">
                ${this._getCategoryLabel(t.category||"integration")}
              </div>

              <div class="detail-desc">${t.description||ge("noDesc")}</div>

              ${t.authors&&t.authors.length?H`
                <div class="detail-authors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ${t.authors.filter(e=>e&&"@user"!==e).map(e=>H`
                    <a class="detail-author-link" href="https://github.com/${e.replace(/^@/,"")}" target="_blank" rel="noopener">@${e.replace(/^@/,"")}</a>
                  `)}
                </div>
              `:""}

              <div class="detail-stats">
                <div class="detail-stat">
                  <svg viewBox="0 0 20 20" fill="#ff9800"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
                  <span class="val">${(t.stars||t.stargazers_count||0).toLocaleString()}</span> ${ge("stars")}
                </div>
                ${t.downloads?H`
                  <div class="detail-stat">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                    <span class="val">${t.downloads.toLocaleString()}</span> ${ge("downloads")}
                  </div>
                `:""}
                <div class="detail-stat">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                  <span class="val">${t.full_name||t.name||""}</span>
                </div>
              </div>

              ${t.topics&&t.topics.length?H`
                <div class="detail-topics">
                  ${t.topics.map(e=>H`
                    <span class="detail-topic-tag">${e}</span>
                  `)}
                </div>
              `:""}

              ${o?H`
                <div class="detail-version">
                  <div class="detail-version-row">
                    <span class="detail-version-label">${ge("currentVersion")}</span>
                    <span class="detail-version-value">${t.installed_version||ge("unknown")}</span>
                  </div>
                  ${i?H`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${ge("availableVersion")}</span>
                      <span class="detail-version-value" style="color:var(--success-color, #0f9d58);">${t.latest_version||ge("unknown")}</span>
                    </div>
                  `:""}
                  ${t.installed_at?H`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${ge("installedAt")}</span>
                      <span class="detail-version-value">${new Date(t.installed_at).toLocaleString()}</span>
                    </div>
                  `:""}
                </div>
              `:""}

              <!-- Version Selector -->
              <div class="version-selector">
                <div class="version-selector-header" @click=${this._toggleVersionSelector}>
                  ${ge("selectVersion")}
                  <span class="version-selector-arrow ${this._showVersionSelector?"open":""}">▼</span>
                </div>
                ${this._showVersionSelector?H`
                  <div class="version-selector-body">
                    <div class="release-tabs">
                      <div class="release-tab ${0===this._releaseTab?"active":""}" @click=${()=>this._releaseTab=0}>${ge("stableReleases")||"正式版"}</div>
                      <div class="release-tab ${1===this._releaseTab?"active":""}" @click=${()=>this._releaseTab=1}>${ge("prereleaseTab")||"预发布"}</div>
                    </div>
                    ${this._releasesLoading?H`
                      <div class="releases-loading">
                        <div class="spinner-sm"></div>
                        ${ge("loading")}
                      </div>
                    `:(()=>{const e=0===this._releaseTab?this._releases.filter(e=>!e.prerelease):this._releases.filter(e=>e.prerelease);return 0===e.length?H`
                        <div class="releases-empty">${ge("noReleases")}</div>
                      `:e.map(e=>H`
                        <div class="release-item">
                          <div class="release-info">
                            <div class="release-tag">
                              ${e.tag_name||e.tag||"?"}
                              ${e.prerelease?H`<span class="prerelease-badge">${ge("prerelease")}</span>`:""}
                            </div>
                            ${e.published_at||e.created_at?H`
                              <div class="release-date">${ge("publishedAt")} ${new Date(e.published_at||e.created_at).toLocaleDateString()}</div>
                            `:""}
                          </div>
                          <button class="release-install-btn"
                                  @click=${()=>this._installVersion(e.tag_name||e.tag)}
                                  ?disabled=${this._installingVersion}>
                            ${ge("installVersion")}
                          </button>
                        </div>
                      `)})()}
                  </div>
                `:""}
              </div>

              <!-- Changelog (What's New) — shown when update is available -->
              ${i?H`
                <div class="detail-changelog">
                  <div class="detail-changelog-title">${ge("changelogTitle")||"更新内容"}</div>
                  ${this._changelogLoading?H`
                    <div class="readme-loading">
                      <div class="spinner-sm"></div>
                      ${ge("loading")||"加载中..."}
                    </div>
                  `:this._changelogData?H`
                    <div class="changelog-body">${this._changelogData.body}</div>
                    ${this._changelogData.tag?H`
                      <div class="changelog-tag">${this._changelogData.tag}</div>
                    `:""}
                    ${this._changelogData.url?H`
                      <a class="changelog-link" href="${this._changelogData.url}" target="_blank" rel="noopener">${ge("viewFullChangelog")||"查看完整更新日志"} →</a>
                    `:""}
                  `:H`
                    <div class="changelog-empty">${ge("noChangelog")||"暂无更新日志"}</div>
                  `}
                </div>
              `:""}

              <div class="modal-actions">
                ${o?H`
                  ${i?H`
                    <button class="modal-btn primary" @click=${()=>this._modalAction("update")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                      ${ge("update")}
                    </button>
                  `:""}
                  <button class="modal-btn" style="color:#ff9800;border-color:#ff9800;" @click=${()=>this._modalAction("redownload")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                    ${ge("redownload")}
                  </button>
                  ${t.domain?H`
                    <button class="modal-btn" @click=${()=>this._modalAction("configure")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      ${ge("configure")}
                    </button>
                  `:""}
                  <button class="modal-btn danger" @click=${()=>this._modalAction("uninstall")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    ${ge("remove")}
                  </button>
                `:H`
                  <button class="modal-btn primary" @click=${()=>this._modalAction("install")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ${ge("install")}
                  </button>
                `}
                <button class="modal-btn" @click=${()=>this._modalAction("github")}>
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                  ${ge("openGithub")}
                </button>
              </div>

              <!-- README Section — no max-height, single scroll via modal-body -->
              <div class="detail-readme">
                <div class="detail-readme-title">${ge("readmeTitle")}</div>
                ${this._readmeLoading?H`
                  <div class="readme-loading">
                    <div class="spinner-sm"></div>
                    ${ge("loadingReadme")}
                  </div>
                `:this._readmeHtml?H`
                  <div class="readme-content" .innerHTML=${this._readmeHtml}></div>
                `:H`
                  <div class="readme-error">${ge("readmeLoadFailed")}</div>
                `}
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- Toast container (supports queue) -->
      <div class="toast-container" id="toast-container" aria-live="polite" aria-atomic="true"></div>

      <!-- Entry Selector (multiple config entries for same domain) -->
      ${this._showEntrySelector?H`
        <div class="entry-overlay" role="dialog" aria-modal="true" aria-label="${ge("selectEntryTitle")}" @click=${()=>{this._showEntrySelector=!1}}>
          <div class="entry-dialog" @click=${e=>e.stopPropagation()}>
            <div class="entry-title">${ge("selectEntryTitle")}</div>
            <div class="entry-subtitle">${ge("selectEntrySubtitle")||"请选择要配置的集成实例"}</div>
            <div class="entry-list">
              ${this._entrySelectorEntries.map(e=>H`
                <button class="entry-btn" @click=${()=>this._selectConfigEntry(e.entry_id)}>
                  <div class="entry-btn-icon">⚙️</div>
                  <div class="entry-btn-text">
                    <span class="entry-btn-title">${e.title||e.entry_id}</span>
                    <span class="entry-btn-domain">${e.domain}${e.entry_id===this._entrySelectorCurrentId?" · "+(ge("currentEntry")||"当前"):""}</span>
                  </div>
                </button>
              `)}
            </div>
            <button class="entry-cancel" @click=${()=>{this._showEntrySelector=!1}}>${ge("cancel")}</button>
          </div>
        </div>
      `:""}

      <!-- Config Flow Dialog -->
      <config-flow-dialog
        .hass=${this.hass}
        .domain=${this._configFlowDomain}
        .entryId=${this._configFlowEntryId}
        .configEntries=${this._configEntries}
        .open=${this._showConfigFlow}
        @close=${this._onFlowClose}>
      </config-flow-dialog>
    `}}const Dt=new WeakMap;function Ft(e){Dt.set(e,!0)}const It=[];let Lt=!1;function Mt(e,t="info"){let o=null;try{const e=document.querySelectorAll("hacs-vision-panel");for(const t of e)if(Dt.has(t)){o=t;break}o||(o=e[0])}catch(e){}const i=o?.shadowRoot?.querySelector("#toast-container");i?(It.push({msg:e,type:t}),Lt||Ot(i)):console.warn("Toast container not found:",e)}function Ot(e){if(0===It.length)return void(Lt=!1);Lt=!0;const{msg:t,type:o}=It.shift(),i=document.createElement("div");i.className="toast",o&&i.classList.add(o),i.textContent=t,e.appendChild(i),requestAnimationFrame(()=>{i.classList.add("show")}),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{i.remove(),Ot(e)},350)},3e3)}var Nt=Object.freeze({__proto__:null,HacsVisionPanel:Tt,registerPanel:Ft,showToast:Mt});class Bt extends ae{static properties={repo:{type:Object},_isFavorite:{type:Boolean,state:!0},_installing:{type:Boolean},_updating:{type:Boolean,state:!0},_removing:{type:Boolean,state:!0},favorites:{type:Array},selected:{type:Boolean},showCheckbox:{type:Boolean},viewMode:{type:String},renamedFrom:{type:String},showRemoveBtn:{type:Boolean}};constructor(){super(),this.repo={},this._isFavorite=!1,this._installing=!1,this._updating=!1,this._removing=!1,this.favorites=[],this.viewMode="store",this.renamedFrom=null,this.showRemoveBtn=!1}_updateFavoriteState(){this.repo&&this.favorites&&(this._isFavorite=this.favorites.includes(this.repo.id||this.repo.full_name))}willUpdate(e){(e.has("repo")||e.has("favorites"))&&this._updateFavoriteState(),e.has("repo")&&(this._updating=!1,this._removing=!1)}static styles=s`
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
    .status-badge.update-available { background: rgba(255,152,0,0.15); color: #ff9800; }
    .status-badge.pending-restart { background: rgba(244,67,54,0.15); color: #f44336; }
    .status-badge.pending-reload { background: rgba(255,152,0,0.15); color: #ff9800; }

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
    .right-tags .tag.load-failed { background: rgba(244,67,54,0.15); color: #f44336; }
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

    .fav-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(255,255,255,0.85);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 2; padding: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    }
    .fav-btn:hover { transform: scale(1.1); }
    .fav-btn svg { width: 18px; height: 18px; transition: all 0.2s; }
    .fav-btn.active svg { fill: #ff9800; color: #ff9800; }
    .fav-btn:not(.active) svg { fill: none; color: var(--secondary-text-color, #727272); }

    .remove-btn {
      position: absolute; top: 10px; right: 10px;
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: rgba(244,67,54,0.12);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 2; padding: 0; color: #f44336;
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
    .stars svg { width: 14px; height: 14px; fill: #ff9800; color: #ff9800; }

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
    .action-btn.readme-btn {
      flex: 0 0 auto; min-width: auto; padding: 8px 10px;
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
      border-color: transparent; color: var(--primary-color, #03a9f4);
    }
    .action-btn.readme-btn:hover { background: var(--primary-color, #03a9f4); color: #fff; }
    .action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    .action-btn .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .action-btn.installing {
      opacity: 0.7; cursor: not-allowed;
      animation: btnPulse 1.5s infinite;
    }
    @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

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
      .fav-btn { width: 36px; height: 36px; }
      .fav-btn svg { width: 20px; height: 20px; }
      .remove-btn { width: 36px; height: 36px; font-size: 18px; }
    }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;_getInitials(e){if(!e)return"?";const t=e.split("/");return(t[t.length-1]||e).charAt(0).toUpperCase()}_getIconUrls(e){const t=e.domain,o=e.full_name||e.repository_manifest?.full_name||"",i=o.split("/")[0],r=o.split("/")[1]||"",s=e.default_branch||"main",a=e.custom||e.is_custom||i&&"home-assistant"!==i;if(!t||"integration"!==e.category)return[];const n=[];return n.push(`https://brands.home-assistant.io/${t}/icon.png`),a&&(i&&r&&n.push(`https://raw.githubusercontent.com/${i}/${r}/${s}/custom_components/${t}/brand/icon.png`),n.push(`/api/hacs_vision_brand/${t}`),i&&n.push(`https://github.com/${i}.png`)),n}_getStatusBadge(e){if(e.pending_restart)return{label:ge("statusPendingRestart"),cls:"pending-restart"};const t=ce.getPendingReloads();return e.installed&&t.length>0&&e.full_name&&t.includes(e.full_name)?{label:ge("statusPendingReload"),cls:"pending-reload"}:e.installed&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version)?{label:ge("statusPendingUpgrade"),cls:"update-available"}:e.installed?{label:ge("installed"),cls:"installed"}:null}_getCategoryLabel(e){return{integration:ge("catIntegration"),plugin:ge("catPlugin"),theme:ge("catTheme"),template:ge("catTemplate"),dashboard:ge("catDashboard")}[e]||e}_handleAction(e,t){e.stopPropagation(),this.dispatchEvent(new CustomEvent(t,{detail:{repo:this.repo},bubbles:!0,composed:!0}))}async _handleFavorite(e){e.stopPropagation();const t=this.repo.id||this.repo.full_name,o=[...this.favorites],i=o.indexOf(t);i>=0?(o.splice(i,1),this._isFavorite=!1):(o.push(t),this._isFavorite=!0);try{await ce.setFavorites(o),this.favorites=o}catch(e){this._isFavorite=!this._isFavorite}this.dispatchEvent(new CustomEvent("favorite",{detail:{repo:this.repo,isFavorite:this._isFavorite},bubbles:!0,composed:!0}))}_handleCardClick(){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:this.repo},bubbles:!0,composed:!0}))}render(){const e=this.repo,t=e.manifest_name||e.repository_manifest?.name||e.full_name||e.name||"unknown",o=e.description||"",i=e.category||"integration",r=e.stars||e.stargazers_count||0,s=e.downloads||0,a=e.installed||!1,n=a&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version),l=fe(i),c=this._getIconUrls(e);return H`
      <div class="card${e.is_custom?" custom-repo":""}" @click=${this._handleCardClick}>
        <div class="img-container">
          ${this.showCheckbox?H`
            <div class="top-bar">
              <input type="checkbox" class="checkbox" ?checked=${this.selected}
                     @click=${e=>e.stopPropagation()}
                     @change=${()=>this.dispatchEvent(new CustomEvent("check-change",{detail:{fullName:this.repo?.full_name},bubbles:!0,composed:!0}))}>
              <span class="badge ${i}">${this._getCategoryLabel(i)}</span>
            </div>
          `:H`<span class="badge ${i}" style="position:absolute;top:10px;left:10px;">${this._getCategoryLabel(i)}</span>`}
          <div class="avatar">
            ${c.length>0?H`
              <img class="repo-icon" src="${c[0]}"
                data-fallback-chain="${c.slice(1).join(",")}"
                data-fb-idx="0"
                @error=${e=>{const t=(e.target.dataset.fallbackChain||"").split(",");let o=parseInt(e.target.dataset.fbIdx||"0");if(o++,o<t.length&&t[o])e.target.dataset.fbIdx=String(o),e.target.src=t[o];else{e.target.style.display="none";const t=e.target.parentElement.querySelector(".initials");t&&(t.style.display="flex",t.style.background="${categoryColor}")}}} alt="">
              <span class="initials" style="display:none">${this._getInitials(t)}</span>
            `:H`
              <span class="initials" style="display:flex;background:${l}">${this._getInitials(t)}</span>
            `}
          </div>
          ${this._getStatusBadge(e)?H`<span class="status-badge ${this._getStatusBadge(e).cls}">${this._getStatusBadge(e).label}</span>`:""}
          <!-- Right-side badges (symmetrical with status-badge) -->
          <div class="right-tags">
            ${e.config_entry_id?H`<span class="tag configured">${ge("badgeConfigured")}</span>`:""}
            ${e.load_failed?H`<span class="tag load-failed">${ge("badgeLoadFailed")}</span>`:""}
            ${e.is_custom&&"management"!==this.viewMode?H`<span class="tag custom-tag">${ge("customBadge")}</span>`:""}
            ${this.renamedFrom?H`<span class="tag" style="background:#ff9800;color:#fff;font-weight:600;display:flex;align-items:center;gap:2px;"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.renamedFrom}</span>`:""}
          </div>
          ${"management"!==this.viewMode?H`
          <button class="fav-btn ${this._isFavorite?"active":""}"
                  @click=${this._handleFavorite}
                  title=${this._isFavorite?ge("favOn"):ge("favOff")}>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          `:""}
        </div>

        <div class="content">
          <div class="name" title=${t}>${t}</div>
          <div class="fullname">${e.full_name||""}</div>
          <div class="desc">${o||ge("noDesc")}</div>
          <div class="meta">
            <div class="tags">
              ${e.topics&&e.topics.length?e.topics.slice(0,3).map(e=>H`<span class="topic-tag">${e}</span>`):""}
            </div>
            <span class="stars">
              <svg viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
              ${"number"==typeof r?r.toLocaleString():r}
            </span>
            ${s?H`
              <span class="stars">
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                ${s.toLocaleString()}
              </span>
            `:""}
            ${"store"!==this.viewMode?H`
              <span style="font-size:10px;color:var(--secondary-text-color);display:flex;align-items:center;gap:3px;">
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                ${n?H`${e.installed_version||"?"} → <span style="color:var(--primary-color);font-weight:600;">${e.latest_version||"?"}</span>`:e.installed_version||ge("installed")}
              </span>
            `:""}
          </div>
        </div>

        ${"management"===this.viewMode?H`
        <div class="actions">
          ${this.showRemoveBtn?H`
            <button class="action-btn ${this._removing?"installing":""}"
              @click=${e=>{this._removing=!0,this._handleAction(e,"remove-repo")}} ?disabled=${this._removing}
              style="color:#f44336;border-color:#f44336;flex:1;">
              ${this._removing?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing?ge("removing")||"移除中…":"management"===this.viewMode?ge("removeRepo"):ge("remove")}</span>
            </button>
          `:""}
        </div>
        `:H`
        <div class="actions">
          ${"management"===this.viewMode?H`
          <button class="action-btn readme-btn" @click=${e=>this._handleAction(e,"readme")} title="README">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          `:""}
          ${a?H`
            ${n?H`
              <button class="action-btn primary ${this._updating?"installing":""}"
                @click=${e=>{this._updating=!0,this._handleAction(e,"update")}} ?disabled=${this._updating}>
                ${this._updating?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`}
                <span class="label">${this._updating?ge("updatingProgress"):ge("update")}</span>
              </button>
            `:""}
            ${"integration"===i?H`
              <button class="action-btn" @click=${t=>this._handleAction(t,e.config_entry_id?"configure":"add-integration")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span class="label">${e.config_entry_id?ge("addIntegration"):ge("addIntegrationHint")}</span>
              </button>
            `:""}
            <button class="action-btn ${this._removing?"installing":""}"
              @click=${e=>{this._removing=!0,this._handleAction(e,"uninstall")}} ?disabled=${this._removing}
              style="color:#f44336;border-color:#f44336;">
              ${this._removing?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="label">${this._removing?ge("removing")||"卸载中…":"management"===this.viewMode?ge("removeRepo"):ge("remove")}</span>
            </button>
            ${"management"===this.viewMode?H`
            <button class="action-btn" @click=${e=>this._handleAction(e,"ignore")} title="${ge("ignore")}"
              style="flex:0 0 auto;padding:8px 10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </button>
            `:""}
          `:H`
            <button class="action-btn primary ${this._installing?"installing":""}"
                    @click=${e=>this._handleAction(e,"install")} ?disabled=${this._installing}>
              ${this._installing?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ge("installing")}`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span class="label">${ge("install")}</span>`}
            </button>
          `}
        </div>
        `}
      </div>
    `}}customElements.define("repo-card",Bt);class Pt extends ae{static properties={_title:{type:String,state:!0},_message:{type:String,state:!0},_confirmText:{type:String,state:!0},_cancelText:{type:String,state:!0},_thirdText:{type:String,state:!0},_danger:{type:Boolean,state:!0},_type:{type:String,state:!0},_visible:{type:Boolean,state:!0}};constructor(){super(),this._title="",this._message="",this._confirmText=ge("confirm"),this._cancelText=ge("cancel"),this._thirdText="",this._danger=!1,this._type="info",this._visible=!1,this._resolve=null,this._dialogDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1}}disconnectedCallback(){super.disconnectedCallback()}static styles=s`
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
  `;static show(e,{title:t,message:o,confirmText:i,cancelText:r,thirdText:s,danger:a,type:n}={}){let l=e.shadowRoot?.querySelector("confirm-dialog");return l||(l=document.createElement("confirm-dialog"),e.shadowRoot.appendChild(l)),new Promise(e=>{l._resolve=e,l._title=t||"",l._message=o||"Are you sure?",l._confirmText=i||ge("confirm"),l._cancelText=r||ge("cancel"),l._thirdText=s||"",l._danger=!!a,l._type=n||(a?"danger":"info"),l._visible=!0,setTimeout(()=>{const e=l.shadowRoot?.querySelector(".btn-confirm");e&&e.focus()},100)})}_getIcon(e){return"danger"===e?H`<svg class="title-icon danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`:"warning"===e?H`<svg class="title-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`:H`<svg class="title-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`}_onKeyDown(e){"Escape"===e.key&&(e.stopPropagation(),this._onCancel()),"Enter"===e.key&&(e.stopPropagation(),this._onConfirm())}_onConfirm(){this._visible=!1;const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._resolve&&this._resolve(!0)}_onCancel(){this._visible=!1;const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._resolve&&this._resolve(!1)}_onThird(){this._visible=!1;const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._resolve&&this._resolve("third")}_onOverlayClick(e){e.target===e.currentTarget&&this._onCancel()}_dialogPointerDown(e){const t=e.target.closest(".title-bar");if(!t||e.target.closest("button"))return;if(void 0!==e.button&&0!==e.button)return;const o=this._dialogDrag,i=e.currentTarget;o.dragging=!0,o.startX=e.clientX-o.offsetX,o.startY=e.clientY-o.offsetY,i.style.transition="none",i.style.cursor="grabbing",t.style.userSelect="none",i.setPointerCapture(e.pointerId);const r=e=>{o.dragging&&(o.offsetX=e.clientX-o.startX,o.offsetY=e.clientY-o.startY,i.style.transform=`translate(${o.offsetX}px, ${o.offsetY}px)`)},s=e=>{o.dragging=!1,i.style.cursor="",t.style.userSelect="",i.removeEventListener("pointermove",r),i.removeEventListener("pointerup",s),i.removeEventListener("pointercancel",s);try{i.releasePointerCapture(e.pointerId)}catch(e){}};i.addEventListener("pointermove",r),i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)}render(){return this._visible?H`
      <div class="overlay" @click=${this._onOverlayClick} @keydown=${this._onKeyDown}>
        <div class="dialog" role="alertdialog" aria-modal="true" @pointerdown=${this._dialogPointerDown}>
          ${this._title?H`
            <div class="title-bar">
              ${this._getIcon(this._type)}
              <span class="title-text">${this._title}</span>
            </div>
          `:""}
          <div class="message">${this._message}</div>
          <div class="actions">
            <button class="btn" @click=${this._onCancel}>${this._cancelText}</button>
            ${this._thirdText?H`
              <button class="btn" style="border:1px solid var(--primary-color, #03a9f4);color:var(--primary-color, #03a9f4);" @click=${this._onThird}>${this._thirdText}</button>
            `:""}
            <button class="btn btn-confirm ${this._danger?"danger":"warning"===this._type?"warning":""}" @click=${this._onConfirm}>${this._confirmText}</button>
          </div>
        </div>
      </div>
    `:H``}}customElements.define("confirm-dialog",Pt);var Ut=Object.freeze({__proto__:null,ConfirmDialog:Pt});const Ht="hacs_vision_browse_state",jt="hacs_vision_view_mode";const Vt="hacs_vision_search_history";function qt(){try{return JSON.parse(localStorage.getItem(Vt)||"[]")}catch{return[]}}class Gt extends ae{static properties={repos:{type:Array},total:{type:Number},search:{type:String},category:{type:String},statusFilter:{type:String},sort:{type:String},sortDir:{type:String},page:{type:Number},loading:{type:Boolean},categoryCounts:{type:Object},statusCounts:{type:Object},tagCounts:{type:Object},viewMode:{type:String},groupBy:{type:String},pageSize:{type:Number},_installingIds:{type:Object,state:!0},_searchText:{type:String,state:!0},_showAddRepo:{type:Boolean,state:!0},_newRepoUrl:{type:String,state:!0},_newRepoCategory:{type:String,state:!0},_addRepoInstalling:{type:Boolean,state:!0},_collapsedGroups:{type:Object,state:!0},_filterExpanded:{type:Boolean,state:!0},_favorites:{type:Array,state:!0},_searchHistory:{type:Array,state:!0},presetFilter:{type:String},presetTag:{type:String},pendingRestart:{type:Number},_selectedRepos:{type:Array,state:!0},_tagFilters:{type:Array,state:!0}};constructor(){super();const e=function(){try{return JSON.parse(localStorage.getItem(Ht)||"{}")}catch{return{}}}();this.repos=[],this.total=0,this.search=e.search||"",this.category=e.category||"",this.statusFilter=e.statusFilter||"",this.sort=e.sort||"stars",this.sortDir=e.sortDir||"desc",this.page=e.page||1,this.loading=!1,this.limit=e.pageSize||50,this.pageSize=this.limit,this.categoryCounts={},this.statusCounts={},this.tagCounts={},this._installingIds={},this._searchTimer=void 0,this._searchText=e.search||"",this.viewMode=(()=>{try{return localStorage.getItem(jt)}catch{return null}})()||"card",this.groupBy=e.groupBy||"none",this._showAddRepo=!1,this._newRepoUrl="",this._newRepoCategory="integration",this._addRepoInstalling=!1,this._collapsedGroups={},this._filterExpanded=!1,this._favorites=[],this._selectedRepos=[],this._tagFilters=[],this._searchHistory=qt(),this._showSearchHistory=!1,this.statusOptions=[{value:"",label:ge("statusAll")},{value:"installed",label:ge("statusInstalled")},{value:"not_installed",label:ge("statusNotInstalled")},{value:"update_available",label:ge("statusPendingUpgrade")},{value:"pending_restart",label:ge("statusPendingRestart")}],this.typeOptions=[{value:"",label:ge("typeAll")},{value:"integration",label:ge("typeIntegration")},{value:"plugin",label:ge("typePlugin")},{value:"theme",label:ge("typeTheme")},{value:"template",label:ge("typeTemplate")}],this.groupOptions=[{value:"none",label:ge("groupNone")},{value:"status",label:ge("groupStatus")},{value:"type",label:ge("groupType")}],this.sortColumns=[{key:"name",label:ge("colName")||"名称",sortable:!0},{key:"downloads",label:ge("colDownloads")||"下载",sortable:!0},{key:"stars",label:ge("colStars")||"星数",sortable:!0},{key:"last_updated",label:ge("colLastUpdated")||"更新时间",sortable:!0},{key:"installed_version",label:ge("colInstalledVer")||"已安装",sortable:!0},{key:"latest_version",label:ge("colAvailableVer")||"可用",sortable:!0},{key:"installed_at",label:ge("colInstalledAt")||"安装时间",sortable:!0},{key:"status",label:ge("colStatus")||"状态",sortable:!0}]}static styles=s`
    ${me()}

    :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

    .search-history {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 100;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      max-height: 260px; overflow-y: auto;
    }
    .search-history-item {
      display: flex; align-items: center; gap: 8px; padding: 8px 12px;
      cursor: pointer; transition: background 0.1s;
    }
    .search-history-item:hover { background: var(--secondary-background-color, #f5f5f5); }
    .history-text { flex: 1; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .history-remove {
      width: 20px; height: 20px; border-radius: 50%; border: none;
      background: transparent; color: var(--secondary-text-color); cursor: pointer;
      font-size: 10px; display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: all 0.15s;
    }
    .search-history-item:hover .history-remove { opacity: 1; }
    .history-remove:hover { background: rgba(244,67,54,0.1); color: #f44336; }

    .content-section {
      background: var(--card-background-color, #fff);
      border-radius: 0; padding: 14px;
    }

    /* ===== Controls Bar ===== */
    .controls {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }
    .controls-right {
      display: flex; align-items: center; gap: 6px; flex-shrink: 0;
    }
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
      padding: 6px 10px; border: none; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
    .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
    .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

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
      display: none; width: 32px; height: 32px; flex-shrink: 0;
      border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color); color: var(--secondary-text-color);
      cursor: pointer; align-items: center; justify-content: center; padding: 0;
      touch-action: manipulation;
    }
    .sort-inline { opacity: 0.85; }
    .sort-inline.active { opacity: 1; }
    .sort-inline .sort-dir { font-size: 9px; margin-left: 2px; }

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

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Add Custom Repo ===== */
    .add-repo-form {
      margin-bottom: 14px; padding: 16px;
      border: 1px solid var(--divider-color); border-radius: 14px;
      background: var(--card-background-color);
    }
    .form-row { display: flex; gap: 8px; margin-bottom: 10px; }
    .form-input {
      flex: 1; padding: 10px 12px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none;
    }
    .form-input:focus { border-color: var(--primary-color); }
    .form-select {
      padding: 10px 12px; border: 1px solid var(--divider-color); border-radius: 10px;
      font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); cursor: pointer; flex-shrink: 0;
    }
    .form-actions { display: flex; gap: 8px; }

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
      .controls { gap: 4px; margin-bottom: 6px; flex-wrap: wrap; }
      .search { flex: 1; min-width: 0; }
      .search input { padding: 7px 10px 7px 30px; font-size: 13px; border-radius: 8px; }
      .controls-right { flex-wrap: wrap; }
      .filter-sort-row { padding: 6px 10px; flex-wrap: nowrap; overflow: hidden; }
      .filter-sort-row .fs-chips { display: none; }
      .filter-sort-row.expanded .fs-chips { display: flex; }
      .filter-sort-row.expanded { flex-wrap: wrap; }
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
      .form-row { flex-direction: column; }
      .form-input, .form-select { width: 100%; box-sizing: border-box; }
      .form-actions { flex-direction: column; }
      .form-actions .btn { width: 100%; min-height: 44px; justify-content: center; }
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
  `;async connectedCallback(){super.connectedCallback(),await this._loadFavorites(),await this._load(),this.addEventListener("install",e=>this._handleInstall(e.detail.repo)),this.addEventListener("update",e=>this._handleUpdate(e.detail.repo)),this.addEventListener("uninstall",e=>this._handleUninstall(e.detail.repo)),this.addEventListener("redownload",e=>this._handleRedownload(e.detail.repo)),this.addEventListener("ignore",e=>this._handleIgnore(e.detail.repo)),this.addEventListener("configure",e=>this._handleConfigure(e.detail.repo)),this.addEventListener("add-integration",e=>this._handleAddIntegration(e.detail.repo)),this.addEventListener("favorite",e=>{const{isFavorite:t,repo:o}=e.detail,i=o?.id||o?.full_name;i&&(t&&!this._favorites.includes(i)?this._favorites=[...this._favorites,i]:t||(this._favorites=this._favorites.filter(e=>e!==i))),this._syncFavoriteCount()})}willUpdate(e){if(e.has("presetFilter")){const t=this.presetFilter;if(void 0===e.get("presetFilter")&&""===t)return;this.presetFilter="",this.statusFilter=t,this.page=1,this._persistState(),this._load()}if(e.has("presetTag")&&this.presetTag){const e=this.presetTag;this.presetTag="",this._tagFilters.includes(e)?this._tagFilters=this._tagFilters.filter(t=>t!==e):this._tagFilters=[...this._tagFilters,e],this.page=1,this._load()}}async _loadFavorites(){try{const e=await ce.getFavorites();this._favorites=Array.isArray(e)?e:e.favorites||[]}catch(e){this._favorites=[]}}_syncFavoriteCount(){this.requestUpdate()}_persistState(){!function(e){try{localStorage.setItem(Ht,JSON.stringify(e))}catch{}}({search:this.search,category:this.category,statusFilter:this.statusFilter,sort:this.sort,sortDir:this.sortDir,page:this.page,groupBy:this.groupBy,pageSize:this.pageSize})}async _handleInstall(e){const t=e.id||e.full_name;this._installingIds={...this._installingIds,[t]:!0};try{await ce.install(t,e.category),Mt(`${ge("installComplete")}: ${e.full_name||e.name}`,"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load(),this._showPostInstallPrompt(e)}catch(e){Mt(`${ge("installFailed")}: ${e.message}`,"error")}const o={...this._installingIds};delete o[t],this._installingIds=o}async _showPostInstallPrompt(e){const t="integration"===(e.category||"integration");await new Promise(e=>setTimeout(e,1500));const{ConfirmDialog:o}=await Promise.resolve().then(function(){return Ut});if(t){if(!await o.show(this,{message:`${e.manifest_name||e.name} ${ge("postInstallRestartMsg")}`,confirmText:ge("restartHA"),cancelText:ge("later"),danger:!0}))return;try{await ce.restartHA(),Mt(ge("haRestarting"),"info")}catch(e){Mt(`${ge("restartFailed")}: ${e.message}`,"error")}}else{Mt(ge("reloadingHA"),"info");try{const e=await ce.reloadHA();e.success?Mt(ge("reloadSuccess"),"success"):Mt(`${ge("coreReloadFailed")}: ${e.error}`,"error")}catch(e){Mt(`${ge("coreReloadFailed")}: ${e.message}`,"error")}}}async _handleUpdate(e){try{const t=await ce.update([e.id||e.full_name]);t?.success?.length>0?Mt(`${ge("updateComplete")}: ${e.full_name||e.name}`,"success"):Mt(`${ge("updateFailed")}: ${e.full_name||e.name}`,"error"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load(),this._showPostInstallPrompt(e)}catch(e){console.error("Update failed",e),Mt(`${ge("updateFailed")}: ${e.message}`,"error")}}async _handleRedownload(e){try{const t=await ce.redownload(e.id||e.full_name,e.category);t?.success?Mt(`${ge("redownload")}: ${e.full_name||e.name}`,"success"):Mt(`${ge("updateFailed")}: ${t?.error||e.full_name}`,"error"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){Mt(`${ge("updateFailed")}: ${e.message}`,"error")}}async _handleIgnore(e){if(await Pt.show(this,{message:ge("confirmIgnore",{repo:e.full_name||e.name}),confirmText:ge("ignore"),danger:!1}))try{await ce.ignoreRepo(e.id||e.full_name),Mt(`${ge("ignore")}: ${e.full_name||e.name}`,"success"),this._load()}catch(e){Mt(`${ge("updateFailed")}: ${e.message}`,"error")}}async _handleUninstall(e){if(await Pt.show(this,{message:ge("confirmRemove",{repo:e.full_name||e.name}),confirmText:ge("remove"),danger:!0}))try{await ce.remove(e.id||e.full_name),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){console.error("Uninstall failed",e),Mt(`${ge("updateFailed")}: ${e.message}`,"error")}}_handleConfigure(e){const t=e.domain||(e.full_name||"").split("/")[1]||"";this.dispatchEvent(new CustomEvent("open-options-flow",{detail:{entryId:e.config_entry_id,domain:t},bubbles:!0,composed:!0}))}_handleAddIntegration(e){const t=e.domain||(e.full_name||"").split("/")[1]||"";this.dispatchEvent(new CustomEvent("open-flow",{detail:{domain:t},bubbles:!0,composed:!0}))}async _load(){this.loading=!0;try{const e=!(!this.search||!this.search.match(/github\.com\/([^/]+\/[^/\s?#]+)/i)&&!this.search.match(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/));let t=this.search;if(e){const e=this.search.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);e&&(t=e[1].replace(/\.git$/,""))}const o=1===this._tagFilters.length?this._tagFilters[0]:"",i=await ce.listRepositories({search:t,category:this.category,sort:this.sort,sortDir:this.sortDir,page:this.page,limit:this.limit,status:this.statusFilter,tag:o});this.repos=i.repositories||[],this.total=i.total||0,this.categoryCounts=i.category_counts||{},this.statusCounts=i.status_counts||{},this.tagCounts=i.tag_counts||{},this.tagCounts={...this.tagCounts,favorites:this._favorites.length}}catch(e){console.error("Browse load error",e),this.repos=[],this.total=0}this.loading=!1}_onSearch(e){this._searchText=e.target.value,this._showSearchHistory=!1,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.search=this._searchText,this.page=1,this._persistState(),this._load(),this._searchText&&function(e){if(!e||!e.trim())return;e=e.trim();let t=qt();t=t.filter(t=>t!==e),t.unshift(e),t.length>10&&(t=t.slice(0,10));try{localStorage.setItem(Vt,JSON.stringify(t))}catch{}}(this._searchText)},300)}_onSearchFocus(){const e=qt();e.length>0&&(this._searchHistory=e,this._showSearchHistory=!0)}_onSearchHistoryClick(e){this._showSearchHistory=!1,this._searchText=e,this.search=e,this.page=1,this._persistState(),this._load()}_clearSearchHistory(e,t){e.stopPropagation(),function(e){let t=qt().filter(t=>t!==e);try{localStorage.setItem(Vt,JSON.stringify(t))}catch{}}(t),this._searchHistory=qt(),0===this._searchHistory.length&&(this._showSearchHistory=!1)}_clearSearch(){this._searchText="",this.search="",this.page=1,this._showSearchHistory=!1,this._persistState(),this._load()}_onStatusFilter(e){this.statusFilter=e,this.page=1,this._persistState(),this._load()}_onTypeFilter(e){this.category=e,this.page=1,this._persistState(),this._load()}_onTagFilter(e){this._tagFilters.includes(e)?this._tagFilters=this._tagFilters.filter(t=>t!==e):this._tagFilters=[...this._tagFilters,e],this.page=1,this._load()}_onSortColumn(e){this.sort===e?this.sortDir="desc"===this.sortDir?"asc":"desc":(this.sort=e,this.sortDir="name"===e?"asc":"desc"),this.page=1,this._persistState(),this._load()}_onGroupChange(e){this.groupBy=e.target.value,this._persistState()}_onViewModeChange(e){this.viewMode=e;try{localStorage.setItem(jt,e)}catch{}}_toggleGroup(e){this._collapsedGroups={...this._collapsedGroups,[e]:!this._collapsedGroups[e]}}_goPage(e){this.page=e,this._persistState(),this._load()}_onPageSizeChange(e){this.pageSize=parseInt(e.target.value,10),this.limit=this.pageSize,this.page=1,this._persistState(),this._load()}_refresh(){this.page=1,this._persistState(),this._load()}async _addRepo(){const e=this._parseRepoUrl(this._newRepoUrl);if(e){this._addRepoInstalling=!0;try{const t=await ce.addCustomRepo(e,this._newRepoCategory);t.success?(Mt(`${ge("addSuccess")}: ${e}`,"success"),this._newRepoUrl="",this._showAddRepo=!1,this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))):Mt(`${ge("addFailed")}: ${t.error}`,"error")}catch(e){Mt(`${ge("addFailed")}: ${e.message}`,"error")}this._addRepoInstalling=!1}else Mt(ge("invalidRepoUrl"),"error")}_parseRepoUrl(e){const t=e.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return t?t[1].replace(/\.git$/,""):/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(e)?e:null}_getRepoStatus(e){return e.pending_restart?"pending_restart":e.installed&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version)?"pending-upgrade":e.installed?"installed":"default"}_getStatusBadge(e){const t={installed:{label:ge("statusInstalled"),cls:"installed"},"pending-upgrade":{label:ge("statusPendingUpgrade"),cls:"pending-upgrade"},"pending-restart":{label:ge("statusPendingRestart"),cls:"pending-restart"},default:{label:ge("statusDefault"),cls:"default"}}[e]||{label:e,cls:"default"};return H`<span class="status-badge ${t.cls}">${t.label}</span>`}_getStatusLabel(e){return{installed:ge("statusInstalled"),not_installed:ge("statusDefault"),update_available:ge("statusPendingUpgrade"),pending_restart:ge("statusPendingRestart")}[e]||e}_applyFilters(e){return this._tagFilters.includes("favorites")?e.filter(e=>this._favorites.includes(e.id||e.full_name)):e}_getFiltered(){let e=this._applyFilters(this.repos);if(!this.search)return e;const t=this.search.toLowerCase();let o=null;const i=t.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return i&&(o=i[1].replace(/\.git$/,"").toLowerCase()),e.filter(e=>{const i=(e.full_name||"").toLowerCase(),r=(e.name||"").toLowerCase(),s=(e.description||"").toLowerCase(),a=(e.authors||[]).join(",").toLowerCase(),n=(e.manifest_name||e.repository_manifest?.name||"").toLowerCase();return!!(i.includes(t)||r.includes(t)||s.includes(t)||a.includes(t))||(!(!o||i!==o&&!i.includes(o))||!!n.includes(t))})}_groupRepos(e){if("none"===this.groupBy)return null;const t={};for(const o of e){let e;e="status"===this.groupBy?this._getRepoStatus(o):"type"===this.groupBy&&o.category||"other",t[e]||(t[e]=[]),t[e].push(o)}const o=["pending-restart","pending-upgrade","installed","default"],i=["integration","plugin","theme","template","other"],r=Object.keys(t);return"status"===this.groupBy?r.sort((e,t)=>o.indexOf(e)-o.indexOf(t)):"type"===this.groupBy&&r.sort((e,t)=>i.indexOf(e)-i.indexOf(t)),r.map(e=>({key:e,label:"status"===this.groupBy?this._getStatusLabel(e):this._getCategoryLabel(e),repos:t[e]}))}_getCategoryLabel(e){return{integration:ge("catIntegration"),plugin:ge("catPlugin"),theme:ge("catTheme"),template:ge("catTemplate"),other:e}[e]||e}_formatDate(e){if(!e)return"";try{const t=new Date(e),o=new Date-t,i=Math.floor(o/864e5);return 0===i?ge("today")||"今天":1===i?ge("yesterday")||"昨天":i<30?`${i}d`:i<365?`${Math.floor(i/30)}mo`:`${Math.floor(i/365)}y`}catch{return""}}_toggleSelect(e){this._selectedRepos.includes(e)?this._selectedRepos=this._selectedRepos.filter(t=>t!==e):this._selectedRepos=[...this._selectedRepos,e]}_isAllSelected(){const e=this._getFiltered();return e.length>0&&this._selectedRepos.length===e.length}_toggleSelectAll(){const e=this._getFiltered();this._isAllSelected()?this._selectedRepos=[]:this._selectedRepos=e.map(e=>e.full_name).filter(Boolean)}async _batchDo(e){if(0===this._selectedRepos.length)return;const t=this._selectedRepos.map(e=>{const t=this.repos.find(t=>t.full_name===e);return{repository:e,category:t?.category||"integration"}});if("remove"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Ut});if(!await e.show(this,{message:ge("batchRemoveConfirm",{n:t.length}),confirmText:ge("batchRemove"),danger:!0}))return}try{let o;Mt(ge("batchInProgress"),"info"),o="install"===e?await ce.batchInstall(t):"update"===e?await ce.update(t.map(e=>e.repository)):await ce.batchRemove(t.map(e=>e.repository)),Mt(ge("batchComplete"),"success"),this._selectedRepos=[],this._load()}catch(t){Mt(`${e} failed: ${t.message}`,"error")}}async _restartHA(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Ut});if(await e.show(this,{message:this.t?.("restartConfirm"),confirmText:this.t?.("restartHA"),danger:!0}))try{await ce.restartHA(),Mt(this.t?.("haRestarting"),"info")}catch(e){Mt(`${this.t?.("restartFailed")}: ${e.message}`,"error")}}_renderRepoList(e){return"list"===this.viewMode?H`<div class="list-view">${this._renderListTable(e)}</div>`:H`<div class="grid">${e.map(e=>H`
      <repo-card .repo=${e} ._installing=${!!this._installingIds?.[e.id||e.full_name]}
        .favorites=${this._favorites}
        ?showCheckbox=${!0} ?selected=${this._selectedRepos.includes(e.full_name)}
        @check-change=${e=>{e.detail?.fullName&&this._toggleSelect(e.detail.fullName)}}>
      </repo-card>
    `)}</div>`}_renderListTable(e){const t=e=>this.sort!==e?"":"desc"===this.sortDir?" ▼":" ▲",o=e=>"sortable "+(this.sort===e?"active-sort":"");return H`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th class="${o("name")}" @click=${()=>this._onSortColumn("name")}>${ge("colName")||"名称"}<span class="sort-arrow">${t("name")}</span></th>
            <th class="${o("downloads")} col-downloads" @click=${()=>this._onSortColumn("downloads")}>${ge("colDownloads")||"下载"}<span class="sort-arrow">${t("downloads")}</span></th>
            <th class="${o("stars")} col-stars" @click=${()=>this._onSortColumn("stars")}>${ge("colStars")||"星数"}<span class="sort-arrow">${t("stars")}</span></th>
            <th class="${o("last_updated")} col-last-updated" @click=${()=>this._onSortColumn("last_updated")}>${ge("colLastUpdated")||"更新"}<span class="sort-arrow">${t("last_updated")}</span></th>
            <th class="${o("installed_version")} col-installed-ver" @click=${()=>this._onSortColumn("installed_version")}>${ge("colInstalledVer")||"已安装"}<span class="sort-arrow">${t("installed_version")}</span></th>
            <th class="${o("latest_version")} col-available-ver" @click=${()=>this._onSortColumn("latest_version")}>${ge("colAvailableVer")||"可用"}<span class="sort-arrow">${t("latest_version")}</span></th>
            <th class="${o("installed_at")} col-installed-at" @click=${()=>this._onSortColumn("installed_at")}>${ge("colInstalledAt")||"安装时间"}<span class="sort-arrow">${t("installed_at")}</span></th>
            <th class="col-status">${ge("colStatus")||"状态"}</th>
            <th class="actions-cell"></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>this._renderListRow(e))}
        </tbody>
      </table>
    `}_renderListRow(e){const t=fe(e.category||"integration"),o=e.manifest_name||e.repository_manifest?.name||e.full_name||e.name||"?",i=e.stars||e.stargazers_count||0,r=e.downloads||0,s=this._getRepoStatus(e),a=e.installed||!1,n="pending-upgrade"===s,l=e.id||e.full_name,c=!!this._installingIds?.[l];return H`
      <tr @click=${()=>this._handleDetail(e)}>
        <td class="col-icon"><div class="icon-cell" style="background:${t}">
          ${e.domain&&"integration"===e.category?H`
              <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
              <span style="display:none">${o.charAt(0).toUpperCase()}</span>
            `:o.charAt(0).toUpperCase()}
        </div></td>
        <td class="name-cell">${o}<br><span class="desc-cell">${e.description||""}</span>
          ${e.is_custom?H`<span class="custom-tag-list">${ge("customBadge")}</span>`:""}
          ${e.topics&&e.topics.length?H`<br><span class="topic-chips">${e.topics.slice(0,4).map(e=>H`<span class="topic-chip">${e}</span>`)}</span>`:""}
        </td>
        <td class="num-cell col-downloads">${r?r.toLocaleString():"-"}</td>
        <td class="num-cell col-stars"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14" style="vertical-align:middle;"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${"number"==typeof i?i.toLocaleString():i}</td>
        <td class="ver-cell col-last-updated">${this._formatDate(e.last_updated)}</td>
        <td class="ver-cell col-installed-ver">${a&&e.installed_version||"-"}</td>
        <td class="ver-cell col-available-ver">${e.latest_version||"-"}</td>
        <td class="ver-cell col-installed-at">${e.installed_at?this._formatDate(e.installed_at):"-"}</td>
        <td class="status-cell col-status">${this._getStatusBadge(s)}</td>
        <td class="actions-cell">
          ${a?H`
            ${n?H`<button class="action-sm primary" @click=${t=>{t.stopPropagation(),this._handleUpdate(e)}}>${ge("update")}</button>`:""}
          `:H`
            <button class="action-sm primary ${c?"installing":""}" @click=${t=>{t.stopPropagation(),this._handleInstall(e)}} ?disabled=${c}>${c?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:ge("install")}</button>
          `}
        </td>
      </tr>
    `}render(){const e=Math.ceil(this.total/this.limit),t=this._getFiltered(),o=this._groupRepos(t);return H`
      <!-- Controls: Search + Action Buttons -->
      <div class="controls">
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="${ge("searchPlaceholder")}" .value=${this._searchText} @input=${this._onSearch} @focus=${this._onSearchFocus} @blur=${()=>setTimeout(()=>this._showSearchHistory=!1,200)} />
          ${this.search?H`<button class="search-clear" @click=${this._clearSearch}>✕</button>`:""}
          ${this._showSearchHistory&&this._searchHistory.length>0?H`
            <div class="search-history">
              ${this._searchHistory.map(e=>H`
                <div class="search-history-item" @mousedown=${()=>this._onSearchHistoryClick(e)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span class="history-text">${e}</span>
                  <button class="history-remove" @mousedown=${t=>this._clearSearchHistory(t,e)}>✕</button>
                </div>
              `)}
            </div>
          `:""}
        </div>
        <div class="controls-right">
          <button class="refresh-btn" @click=${this._refresh} title="${ge("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>
          <div class="view-toggle">
            <button class="view-toggle-btn ${"card"===this.viewMode?"active":""}" @click=${()=>this._onViewModeChange("card")} title="${ge("viewCard")}">${ge("viewCard")}</button>
            <button class="view-toggle-btn ${"list"===this.viewMode?"active":""}" @click=${()=>this._onViewModeChange("list")} title="${ge("viewList")}">${ge("viewList")}</button>
          </div>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:36px;" @click=${()=>{this._showAddRepo=!this._showAddRepo}}>+ ${ge("addRepo")}</button>
          <label class="sel-all-label">
            <input type="checkbox" class="checkbox-sm" .checked=${this._isAllSelected()}
                   @click=${e=>e.stopPropagation()} @change=${this._toggleSelectAll}>
            ${ge("selectAll")||"全选"}
            ${this._selectedRepos.length>0?H`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>`:""}
          </label>
        </div>
      </div>

      <!-- Add Custom Repo Form -->
      ${this._showAddRepo?H`
        <div class="add-repo-form">
          <div class="form-row">
            <input class="form-input" type="text" placeholder="${ge("repoUrl")}" .value=${this._newRepoUrl} @input=${e=>{this._newRepoUrl=e.target.value}} @keydown=${e=>{"Enter"===e.key&&this._addRepo()}}>
            <select class="form-select" .value=${this._newRepoCategory} @change=${e=>{this._newRepoCategory=e.target.value}}>
              <option value="integration">${ge("catIntegration")}</option><option value="plugin">${ge("catPlugin")}</option>
              <option value="theme">${ge("catTheme")}</option><option value="template">${ge("catTemplate")}</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn primary" @click=${this._addRepo} ?disabled=${this._addRepoInstalling}>${this._addRepoInstalling?ge("installing"):ge("add")}</button>
            <button class="btn" @click=${()=>{this._showAddRepo=!1}}>${ge("cancel")}</button>
          </div>
        </div>
      `:""}

      <!-- Filters + Sort: compact row with prominent labels -->
      <div class="filter-sort-row ${this._filterExpanded?"expanded":""}">
        <div class="fs-chips">
          <span class="fs-label">${ge("filterStatus")}</span>
          ${this.statusOptions.filter(e=>""===e.value||(this.statusCounts[e.value]??0)>0).map(e=>H`
            <button class="filter-chip ${this.statusFilter===e.value?"active":""}" @click=${()=>this._onStatusFilter(e.value)}>${e.label}${""===e.value?H`<span class="chip-count">${this.total??0}</span>`:""}</button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("filterTags")}</span>
          <button class="filter-chip ${this._tagFilters.includes("favorites")?"active":""}" @click=${()=>this._onTagFilter("favorites")}>
            ${ge("tagFavorites")}
          </button>
          <button class="filter-chip ${this._tagFilters.includes("new")?"active":""}" @click=${()=>this._onTagFilter("new")}>
            ${ge("tagNew")||"新"}
          </button>
          <button class="filter-chip ${this._tagFilters.includes("custom")?"active":""}" @click=${()=>this._onTagFilter("custom")}>
            ${ge("tagCustom")}
          </button>
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("filterType")}</span>
          ${this.typeOptions.filter(e=>""===e.value||(this.categoryCounts[e.value]??0)>0).map(e=>H`
            <button class="filter-chip ${this.category===e.value?"active":""}" @click=${()=>this._onTypeFilter(e.value)}>
              ${e.label}
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("sort")||"排序"}</span>
          ${this.sortColumns.map(e=>H`
            <button class="filter-chip sort-inline ${this.sort===e.key?"active":""}" @click=${()=>this._onSortColumn(e.key)}>
              ${e.label}${this.sort===e.key?H`<span class="sort-dir">${"desc"===this.sortDir?"▼":"▲"}</span>`:""}
            </button>
          `)}
        </div>
        <button class="filter-toggle-sm" @click=${()=>{this._filterExpanded=!this._filterExpanded}} title="${ge("filterMore")||"筛选/排序"}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
        </button>
      </div>

      ${this._selectedRepos.length>0?H`
      <div class="batch-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span>${ge("selected")}: ${this._selectedRepos.length}</span>
        <div class="batch-actions">
          <button class="batch-bar-btn" @click=${()=>this._batchDo("install")} ?disabled=${this._addingRepo}>${ge("batchInstall")}</button>
          <button class="batch-bar-btn" @click=${()=>this._batchDo("update")} ?disabled=${this._addingRepo}>${ge("batchUpdate")}</button>
          <button class="batch-bar-btn danger" @click=${()=>this._batchDo("remove")} ?disabled=${this._addingRepo}>${ge("batchRemove")}</button>
          <button class="batch-bar-btn" style="background:transparent;border-color:transparent;font-size:14px;" @click=${()=>{this._selectedRepos=[],this.requestUpdate()}}>✕</button>
        </div>
      </div>
      `:""}

      <!-- Content -->
      <div class="content-section">
      ${this.loading?H`
        <div class="skeleton-grid">
          ${[1,2,3,4,5,6].map(()=>H`
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
      `:0===t.length?H`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div>${this.search?ge("noMatch"):ge("noData")}</div>
        </div>
      `:H`

        ${o?H`
          ${o.map(e=>H`
            <div class="group-header" @click=${()=>this._toggleGroup(e.key)}>
              <span class="group-arrow ${this._collapsedGroups[e.key]?"collapsed":""}">▼</span>
              ${e.label}<span class="group-count">(${e.repos.length})</span>
            </div>
            ${this._collapsedGroups[e.key]?"":this._renderRepoList(e.repos)}
          `)}
        `:H`${this._renderRepoList(t)}`}

        ${e>1?H`
          <div class="pagination">
            <button class="page-btn" ?disabled=${this.page<=1} @click=${()=>this._goPage(this.page-1)}>${ge("prevPage")}</button>
            <span class="page-info">${ge("page")} ${this.page} / ${e}</span>
            <button class="page-btn primary" ?disabled=${this.page>=e} @click=${()=>this._goPage(this.page+1)}>${ge("nextPage")}</button>
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
    `}}customElements.define("browse-view",Gt);class Yt extends ae{static properties={updates:{type:Array},loading:{type:Boolean},updating:{type:Boolean},search:{type:String},_installingIds:{type:Object,state:!0},_changelogs:{type:Object,state:!0},_searchText:{type:String,state:!0},_selectedIds:{type:Object,state:!0},_selectedRepos:{type:Array,state:!0},_batchMode:{type:Boolean,state:!0},_viewMode:{type:String,state:!0},_favs:{type:Object,state:!0},_categoryFilter:{type:String,state:!0}};constructor(){super(),this.updates=[],this.loading=!1,this.updating=!1,this.search="",this._searchTimer=null,this._installingIds={},this._changelogs={},this._changelogsLoading={},this._expandedChangelogs={},this._searchText="",this._selectedIds={},this._selectedRepos=[],this._batchMode=!1,this._favs={};const e=(()=>{try{return localStorage.getItem("hacs_vision_view_mode")}catch{return null}})();this._viewMode=e||"card"}static styles=[me(),s`
      :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

      .controls-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

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
        font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
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

      .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
      .mini-icon.spin { animation: spin 1s linear infinite; }
      @keyframes spin { 100% { transform: rotate(360deg); } }

      /* ===== View Mode Toggle ===== */
      .view-toggle {
        display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
        overflow: hidden; flex-shrink: 0;
      }
      .view-toggle-btn {
        padding: 6px 10px; border: none; background: var(--card-background-color);
        color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
        transition: all 0.2s; min-width: 36px; min-height: 36px;
        display: flex; align-items: center; justify-content: center;
        touch-action: manipulation;
      }
      .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
      .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
      .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

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
        .search { min-width: 0; }
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
    `];async connectedCallback(){super.connectedCallback(),await this._load()}_lazyLoadChangelogs(){const e=this.updates.filter(e=>e.full_name&&!this._changelogs[e.full_name]);if(0===e.length)return;let t=0;const o=()=>{t>=e.length||(this._loadChangelog(e[t++].full_name),setTimeout(o,150))};setTimeout(o,300)}async _load(){this.loading=!0;try{ce.refresh().catch(()=>{});const e=await ce.getUpdates();this.updates=Array.isArray(e)?e:e.updates||[],this._lazyLoadChangelogs()}catch(e){console.error("Failed to load updates",e),this.updates=[]}this.loading=!1}async _loadChangelog(e){if(e&&!this._changelogs[e]&&!this._changelogsLoading[e]){this._changelogsLoading={...this._changelogsLoading,[e]:!0};try{const t=await ce.getChangelog(e);t?.body&&(this._changelogs={...this._changelogs,[e]:t})}catch{}this._changelogsLoading={...this._changelogsLoading,[e]:!1}}}_toggleChangelog(e){this._expandedChangelogs={...this._expandedChangelogs,[e]:!this._expandedChangelogs?.[e]}}async _loadChangelogs(){const e=this.updates.filter(e=>e.full_name);if(0===e.length)return;const t=await Promise.allSettled(e.map(e=>ce.getChangelog(e.full_name).then(t=>({fullName:e.full_name,data:t})))),o={};for(const e of t)"fulfilled"===e.status&&e.value.data?.body&&(o[e.value.fullName]=e.value.data);Object.keys(o).length>0&&(this._changelogs={...this._changelogs,...o})}async _updateSelected(){const e=Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]);if(0===e.length)return;if(await Pt.show(this,{message:ge("confirmUpdateSelected",{n:e.length}),confirmText:ge("confirmUpdate"),danger:!1})){this.updating=!0;try{await ce.update(e),Mt(`${ge("allUpdatesStarted")} (${e.length})`,"success"),this._selectedIds={},this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Mt(`${ge("updateFailed")}: ${e.message}`,"error")}this.updating=!1}}async _updateAll(){const e=this.updates.map(e=>e.id||e.full_name);if(0===e.length)return;if(await Pt.show(this,{message:ge("confirmUpdateAll",{n:e.length}),confirmText:ge("confirmUpdate"),danger:!1})){this.updating=!0;try{await ce.update(e),Mt(`${ge("allUpdatesStarted")} (${e.length})`,"success"),this._selectedIds={},this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Mt(`${ge("updateFailed")}: ${e.message}`,"error")}this.updating=!1}}_toggleSelect(e){this._selectedIds={...this._selectedIds,[e]:!this._selectedIds[e]}}_toggleSelectFull(e){this._selectedRepos.includes(e)?this._selectedRepos=this._selectedRepos.filter(t=>t!==e):this._selectedRepos=[...this._selectedRepos,e]}async _batchDo(e){if(0!==this._selectedRepos.length){if("remove"===e){if(!await Pt.show(this,{message:ge("batchRemoveConfirm",{n:this._selectedRepos.length}),confirmText:ge("batchRemove"),danger:!0}))return}try{Mt(ge("batchInProgress"),"info"),"update"===e?await ce.update(this._selectedRepos):"remove"===e&&await ce.batchRemove(this._selectedRepos.map(e=>e)),Mt(ge("batchComplete"),"success"),this._selectedRepos=[],this._batchMode=!1,this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(t){Mt(`${e} failed: ${t.message}`,"error")}}}_toggleSelectAll(){const e=this._getFiltered();if(this._isAllSelected())this._selectedIds={};else{const t={};for(const o of e)t[o.id||o.full_name]=!0;this._selectedIds=t}}_isAllSelected(){const e=this._getFiltered();return 0!==e.length&&e.every(e=>this._selectedIds[e.id||e.full_name])}_selectedCount(){return Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]).length}async _updateOne(e){const t=e.id||e.full_name;this._installingIds={...this._installingIds,[t]:!0};try{await ce.update([t]);const o=e.latest_version;let i=0;const r=async()=>{if(i++>30){const e={...this._installingIds};return delete e[t],this._installingIds=e,void Mt(`${ge("updateFailed")}: timeout`,"error")}try{const i=await ce.getRepoStatus(t);if(i?.installed_version===o||i?.installed&&!i?.has_update){const o={...this._installingIds};return delete o[t],this._installingIds=o,Mt(`${ge("updateComplete")}: ${e.full_name||e.name}`,"success"),this._load(),void this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}}catch(e){}setTimeout(r,2e3)};setTimeout(r,2e3)}catch(e){const o={...this._installingIds};delete o[t],this._installingIds=o,Mt(`${ge("updateFailed")}: ${e.message}`,"error")}}_getFiltered(){let e=this.updates;if(this._categoryFilter&&"all"!==this._categoryFilter&&(e=e.filter(e=>(e.category||"integration")===this._categoryFilter)),this.search){const t=this.search.toLowerCase();e=e.filter(e=>(e.manifest_name||e.full_name||e.name||"").toLowerCase().includes(t))}return e}_clearSearch(){this._searchText="",this.search="",this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_openDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}async _toggleFav(e){const t=e.id||e.full_name,o=!!this._favs[t],i={...this._favs};o?delete i[t]:i[t]=!0,this._favs=i;try{const e=Object.keys(i);await ce.setFavorites(e)}catch(e){this._favs=this._favs}}_setViewMode(e){this._viewMode=e;try{localStorage.setItem("hacs_vision_view_mode",e)}catch{}}_renderListTable(e){return H`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th>${ge("colName")||"名称"}</th>
            <th>${ge("currentVersion")}</th>
            <th>${ge("latestVersion")}</th>
            <th>${ge("colStatus")||"状态"}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>this._renderListRow(e))}
        </tbody>
      </table>
    `}_renderListRow(e){const t=e.id||e.full_name,o=!!this._installingIds?.[t],i=!!this._selectedIds[t],r=e.manifest_name||e.name||e.full_name||"?",s=fe(e.category),a=e.domain;return H`
      <tr @click=${t=>{t.target.closest(".btn")||t.target.closest("a")||t.target.closest(".checkbox")||this._openDetail(e)}}>
        <td class="col-icon">
          <div class="icon-cell" style="background:${s}">
            ${a&&"integration"===e.category?H`
                <img src="https://brands.home-assistant.io/${a}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextElementSibling.style.display="flex"}}>
                <span style="display:none">${r.charAt(0).toUpperCase()}</span>
              `:r.charAt(0).toUpperCase()}
          </div>
        </td>
        <td>
          <div class="name-cell">${r}</div>
          ${e.description?H`<div class="desc-cell">${e.description}</div>`:""}
          ${e.is_custom?H`<span class="custom-tag-list">${ge("customBadge")}</span>`:""}
          ${e.topics&&e.topics.length?H`<div class="topic-chips">${e.topics.slice(0,4).map(e=>H`<span class="topic-chip">${e}</span>`)}</div>`:""}
        </td>
        <td style="font-size:12px;color:var(--warning-color);white-space:nowrap;">${e.installed_version||"?"}</td>
        <td style="font-size:12px;color:var(--success-color);white-space:nowrap;">${e.latest_version||"?"}</td>
        <td><span class="status-badge pending-upgrade">${ge("statusPendingUpgrade")}</span></td>
        <td style="white-space:nowrap;">
          <input type="checkbox" class="checkbox" .checked=${i}
                 @click=${e=>e.stopPropagation()}
                 @change=${()=>this._toggleSelect(t)} style="margin-right:6px;">
          <button class="btn primary ${o?"installing":""}" style="padding:4px 10px;font-size:11px;"
                  @click=${t=>{t.stopPropagation(),this._updateOne(e)}} ?disabled=${o||this.updating}>
            ${o?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${ge("updateNow")}`}
          </button>
        </td>
      </tr>
    `}render(){const e=this._getFiltered();return H`
      <div class="controls">
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="${ge("searchUpdates")}" .value=${this._searchText||""}
                 @input=${e=>{this._searchText=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.search=this._searchText},300)}}>
          ${this.search?H`
            <button class="search-clear" @click=${this._clearSearch}>✕</button>
          `:""}
        </div>
        <div class="controls-right">
          <button class="refresh-btn" @click=${this._load} title="${ge("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
          <div class="view-toggle">
            <button class="view-toggle-btn ${"card"===this._viewMode?"active":""}" @click=${()=>this._setViewMode("card")} title="${ge("viewCard")}">${ge("viewCard")}</button>
            <button class="view-toggle-btn ${"list"===this._viewMode?"active":""}" @click=${()=>this._setViewMode("list")} title="${ge("viewList")}">${ge("viewList")}</button>
          </div>
          ${this.updates.length>0?H`
            <button class="update-all-btn" @click=${this._updateAll} ?disabled=${this.updating||0===this.updates.length}>
              <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.updating?ge("updatingProgress"):ge("updateAllNow")}
            </button>
            ${this._selectedCount()>0?H`
              <button class="update-all-btn selected-btn" @click=${this._updateSelected} ?disabled=${this.updating||0===this._selectedCount()}>
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> ${ge("updateSelected")} (${this._selectedCount()||0})
              </button>
            `:""}
          `:""}
          <label class="sel-all-label">
            <input type="checkbox" class="checkbox-sm" .checked=${this._isAllSelected()}
                   @click=${e=>e.stopPropagation()} @change=${this._toggleSelectAll}>
            ${ge("selectAll")||"全选"}
            ${this._selectedCount()>0?H`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedCount()})</span>`:""}
          </label>
        </div>
      </div>

      ${(()=>{const e=["all","integration","plugin","theme","template"],t={};for(const o of e)t[o]="all"===o?this.updates.length:this.updates.filter(e=>(e.category||"integration")===o).length;return H`
        <div class="filter-bar">
          ${e.map(e=>H`
            <button class="chip ${this._categoryFilter===e?"chip-active":""}"
              @click=${()=>{this._categoryFilter=e}}>
              ${ge("all"===e?"filterAll":"integration"===e?"catIntegration":"plugin"===e?"catPlugin":"theme"===e?"catTheme":"catTemplate")}
              <span class="chip-count">${t[e]}</span>
            </button>
          `)}
        </div>`})()}

      ${this.loading?H`
        <div class="skeleton-grid">
          ${[1,2,3,4,5,6].map(()=>H`
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
      `:0===this.updates.length?H`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div>${ge("allUpToDate")}</div>
        </div>
      `:H`

        ${this._selectedCount()>0?H`
          <div class="batch-bar" style="margin-bottom:10px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span style="font-weight:600;">${ge("selected")}: ${this._selectedCount()}</span>
            <div class="batch-actions">
              <button class="batch-bar-btn" @click=${this._updateSelected} ?disabled=${this.updating}>${ge("batchUpdate")}</button>
              <button class="batch-bar-btn danger" @click=${()=>this._batchDo("remove")} ?disabled=${this.updating}>${ge("batchRemove")}</button>
              <button class="batch-bar-btn" style="background:transparent;border-color:transparent;font-size:14px;" @click=${()=>{this._selectedIds={},this.requestUpdate()}}>✕</button>
            </div>
          </div>
        `:""}

        ${this._batchMode&&this._selectedRepos.length>0?H`
          <div class="batch-bar">
            <span>${ge("batchSelected",{n:this._selectedRepos.length})}</span>
            <button class="batch-bar-btn" @click=${()=>this._batchDo("update")}>${ge("batchUpdate")}</button>
            <button class="batch-bar-btn danger" @click=${()=>this._batchDo("remove")}>${ge("batchRemove")}</button>
            <button class="batch-bar-btn" @click=${()=>{this._selectedRepos=[],this._batchMode=!1}}>${ge("cancel")}</button>
          </div>
        `:""}

        ${"list"===this._viewMode?H`
          <div class="list-view">${this._renderListTable(e)}</div>
        `:H`
          <div class="grid">
            ${e.map(e=>{const t=e.id||e.full_name,o=!!this._installingIds?.[t],i=this._changelogs?.[e.full_name],r=!!this._selectedIds[t];return H`
              <div class="card" @click=${t=>{t.target.closest(".action-btn")||t.target.closest("a")||t.target.closest(".checkbox")||t.target.closest(".fav-btn")||this._openDetail(e)}}>
                <div class="img-container">
                  <div class="top-bar">
                    <input type="checkbox" class="checkbox" .checked=${r}
                           @click=${e=>e.stopPropagation()}
                           @change=${()=>this._toggleSelect(t)}>
                    <span class="badge-corner ${e.category||"integration"}">${ge("cat"+(e.category||"integration").charAt(0).toUpperCase()+(e.category||"integration").slice(1))}</span>
                  </div>
                  <div class="avatar">
                    ${(()=>{const t=[];if(e.domain&&"integration"===e.category&&t.push("https://brands.home-assistant.io/"+e.domain+"/icon.png"),e.full_name){const o=e.full_name.split("/")[0];o&&t.push("https://github.com/"+o+".png")}const o=fe(e.category);return t.length>0?H`
                          <img src="${t[0]}" alt=""
                            @error=${function(){this.style.display="none";const e=this.parentElement?.querySelector(".initials");e&&(e.style.display="flex",e.style.background=o)}}>
                          <span class="initials" style="display:none">${(e.name||e.full_name||"?").charAt(0).toUpperCase()}</span>
                        `:H`<span class="initials" style="display:flex;background:${o}">${(e.name||e.full_name||"?").charAt(0).toUpperCase()}</span>`})()}
                  </div>
                  <span class="status-badge-update">${ge("statusPendingUpgrade")}</span>
                  <button class="fav-btn ${this._favs?.[e.id||e.full_name]?"active":""}"
                    @click=${t=>{t.stopPropagation(),this._toggleFav(e)}}
                    title=${this._favs?.[e.id||e.full_name]?ge("favOn")||"取消收藏":ge("favOff")||"收藏"}>
                    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                </div>
                <div class="card-body">
                  <div class="card-name" title="${e.name||e.full_name}">${e.name||e.full_name}</div>
                  <div class="version-row">
                    <div class="version-item">
                      <div class="version-label">${ge("currentVersion")}</div>
                      <div class="version-value old">${e.installed_version||"?"}</div>
                    </div>
                    <div class="version-item">
                      <div class="version-label">${ge("latestVersion")}</div>
                      <div class="version-value new">${e.latest_version||"?"}</div>
                    </div>
                  </div>
                  <div class="card-desc">${e.description||""}</div>
                  ${i?.body?H`
                    <div class="changelog-preview">
                      <div class="changelog-preview-title">${ge("changelogTitle")} ${i.tag?H`<small>(${i.tag})</small>`:""}</div>
                      <div class="changelog-preview-body${this._expandedChangelogs?.[e.full_name]?" expanded":""}">${i.body}</div>
                      <div>
                        <button class="changelog-expand-btn" @click=${()=>this._toggleChangelog(e.full_name)}>${this._expandedChangelogs?.[e.full_name]?ge("changelogShowLess"):ge("changelogShowMore")}</button>
                        <a class="changelog-preview-link" href="${i.url||`https://github.com/${e.full_name}/releases`}" target="_blank" rel="noopener">${ge("viewFullChangelog")} →</a>
                      </div>
                    </div>
                  `:""}
                </div>
                <div class="actions">
                  <button class="action-btn primary ${o?"installing":""}"
                    @click=${()=>this._updateOne(e)} ?disabled=${o||this.updating}>
                    ${o?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ge("updatingProgress")}`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${ge("updateNow")}`}
                  </button>
                </div>
              </div>
            `})}
          </div>
        `}
      `}
    `}}customElements.define("updates-view",Yt);const Wt="hacs_vision_mgmt_state";function Xt(e){try{localStorage.setItem(Wt,JSON.stringify(e))}catch{}}class Jt extends ae{static properties={customRepos:{type:Array},archivedRepos:{type:Array},ignoredRepos:{type:Array},renamedEntries:{type:Array},loading:{type:Boolean},_customRepoUrl:{type:String},_customRepoCategory:{type:String},_showAddCustom:{type:Boolean},_addingCustom:{type:Boolean},erLoading:{type:Boolean},iLoading:{type:Boolean},importing:{type:Boolean},exporting:{type:Boolean},_viewMode:{type:String},_collapsed:{type:Object},_renamedRefreshing:{type:Boolean},_customRepoSearch:{type:String},_customRepofilter:{type:String},_customRepoSort:{type:String},_statusFilter:{type:String},_typeFilter:{type:String},_selectedRepos:{type:Array,state:!0},_favorites:{type:Array,state:!0},_tagFilters:{type:Array,state:!0}};constructor(){super();const e=function(){try{return JSON.parse(localStorage.getItem(Wt)||"{}")}catch{return{}}}();this.customRepos=[],this.archivedRepos=[],this.ignoredRepos=[],this.renamedEntries=[],this.loading=!1,this.exporting=!1,this.importing=!1,this._renamedRefreshing=!1,this._showAddCustom=!1,this._customRepoUrl="",this._customRepoCategory="integration",this._addingCustom=!1,this._viewMode="card",this._customRepoSearch="",this._customRepofilter=e.customRepofilter||"all",this._customRepoSort=e.customRepoSort||"name",this._statusFilter=e.statusFilter||"",this._typeFilter=e.typeFilter||"",this._selectedRepos=[],this._favorites=[],this._tagFilters=[],this._collapsed={customRepos:!1,archived:!1,ignored:!1,tools:!1}}static styles=[me(),s`
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
    .controls-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .view-toggle {
      display: flex; border: 1px solid var(--divider-color); border-radius: 8px;
      overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: none; background: var(--card-background-color,#fff);
      color: var(--secondary-text-color,#727272);
      cursor: pointer; font-size: 14px; transition: all 0.2s;
      min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
    .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
    .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

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

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
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
      .controls { flex-wrap: wrap; }
      .search { flex: 1; min-width: 0; }
      .search input { width: 100%; }
      .filter-sort-row { padding: 6px 10px; }
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
  `];async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){this.loading=!0;try{const e=await ce.getConfig()||{};this.archivedRepos=e.archived_repositories||[],this.ignoredRepos=e.ignored_repositories||[],this.renamedEntries=Object.entries(e.renamed_repositories||{});const t=await ce.getCustomRepos();this.customRepos=Array.isArray(t)?t:t.custom_repositories||[];try{const e=await ce.getFavorites();this._favorites=Array.isArray(e)?e:e.favorites||[]}catch{this._favorites=[]}}catch(e){console.error("Config load error",e)}this.loading=!1}async _removeArchivedRepo(e){if(await Pt.show(this,{message:ge("confirmRemoveArchived",{repo:e}),confirmText:ge("removeArchived"),danger:!0}))try{await ce.removeArchivedRepo(e),this._load()}catch(e){Mt(`${ge("removeRepoFailed")}: ${e.message}`,"error")}}async _removeRenamedRepo(e){if(await Pt.show(this,{message:ge("confirmRemoveRenamed",{old:e}),confirmText:ge("removeRenamed"),danger:!0}))try{await ce.removeRenamedRepo(e),this._load()}catch(e){Mt(`${ge("removeRepoFailed")}: ${e.message}`,"error")}}async _replaceRenamedOneClick(e,t){if(await Pt.show(this,{message:ge("confirmReplaceRenamed",{old:e,new:t}),confirmText:ge("replace"),danger:!0})){this._renamedRefreshing=!0;try{await ce.replaceRenamedRepo(e,t),Mt(`${ge("replace")}: ${e} → ${t}`,"success"),await ce.refresh(),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Mt(`${ge("updateFailed")}: ${e.message}`,"error")}this._renamedRefreshing=!1}}async _export(){this.exporting=!0;try{const e=await ce.exportBackup(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),o=URL.createObjectURL(t),i=document.createElement("a");i.href=o,i.download=`hacs-vision-backup-${(new Date).toISOString().slice(0,10)}.json`,i.click(),URL.revokeObjectURL(o),Mt(ge("exportSuccess"),"success")}catch(e){Mt(`${ge("exportFailed")}: ${e.message}`,"error")}this.exporting=!1}async _import(){const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=async()=>{const t=e.files[0];if(t){this.importing=!0;try{const e=await t.text(),o=JSON.parse(e);await ce.importBackup(o),Mt(ge("importSuccess"),"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Mt(`${ge("importFailed")}: ${e.message}`,"error")}this.importing=!1}},e.click()}_toggleAddCustom(){this._showAddCustom=!this._showAddCustom,this._showAddCustom||(this._customRepoUrl="",this._customRepoCategory="integration")}_parseRepoUrl(e){const t=(e=e.trim()).match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return t?t[1].replace(/\.git$/,""):/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(e)?e:null}async _addCustomRepo(){const e=this._parseRepoUrl(this._customRepoUrl);if(!e)return void Mt(ge("invalidRepoUrl"),"error");const t=this.customRepos.some(t=>(t.full_name||t.repository)===e);if(t)Mt(`${e} ${ge("alreadyExists")}`,"error");else{this._addingCustom=!0;try{const t=await ce.addCustomRepo(e,this._customRepoCategory);t.success?(Mt(`${ge("addSuccess")}: ${e}`,"success"),this._customRepoUrl="",this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))):Mt(`${ge("addFailed")}: ${t.error}`,"error")}catch(e){Mt(`${ge("addFailed")}: ${e.message}`,"error")}this._addingCustom=!1}}async _removeCustomRepo(e,t){if(await Pt.show(this,{message:ge("confirmRemoveRepo",{repo:e}),confirmText:ge("removeRepo"),danger:!0}))try{const t=await ce.removeCustomRepo(e);t&&!1===t.success&&Mt(`${ge("removeRepoFailed")}: ${t.error}`,"error"),this._selectedRepos=this._selectedRepos.filter(t=>t!==e),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Mt(`${ge("removeRepoFailed")}: ${e.message}`,"error")}}_toggleSelectRepo(e){this._selectedRepos.includes(e)?this._selectedRepos=this._selectedRepos.filter(t=>t!==e):this._selectedRepos=[...this._selectedRepos,e]}async _batchRemove(){const e=this._selectedRepos.length;if(await Pt.show(this,{message:`${ge("batchRemoveRepoConfirm")||"确认移除"} ${e} ${ge("totalRepos")}?`,confirmText:ge("removeRepo"),danger:!0})){for(const e of[...this._selectedRepos])try{await ce.removeCustomRepo(e)}catch(t){Mt(`${ge("removeRepoFailed")}: ${e} - ${t.message}`,"error")}this._selectedRepos=[],this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}}_toggleSection(e){this._collapsed={...this._collapsed,[e]:!this._collapsed[e]}}_setViewMode(e){this._viewMode=e}_openCardDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}_getRepoStatus(e){return e.pending_restart?"pending_restart":e.installed&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version)?"update_available":e.installed?"installed":"not_installed"}_getFilteredCustomRepos(){let e=[...this.customRepos];const t=(this._customRepoSearch||"").toLowerCase();t&&(e=e.filter(e=>{const o=(e.manifest_name||e.name||e.full_name||"").toLowerCase(),i=(e.description||"").toLowerCase();return o.includes(t)||i.includes(t)}));const o=this._statusFilter||"";o&&(e=e.filter(e=>this._getRepoStatus(e)===o));const i=this._typeFilter||"";i&&(e=e.filter(e=>(e.category||"")===i)),this._tagFilters.includes("favorites")&&(e=e.filter(e=>this._favorites.includes(e.id||e.full_name)));const r=this._customRepoSort||"name";return"stars"===r?e.sort((e,t)=>(t.stargazers_count||0)-(e.stargazers_count||0)):"updated"===r?e.sort((e,t)=>(t.last_updated||"").localeCompare(e.last_updated||"")):e.sort((e,t)=>(e.manifest_name||e.name||e.full_name||"").localeCompare(t.manifest_name||t.name||t.full_name||"")),e}_getStatusCounts(){const e={installed:0,update_available:0,not_installed:0,pending_restart:0};for(const t of this.customRepos){const o=this._getRepoStatus(t);void 0!==e[o]&&e[o]++}return e}_getTypeCounts(){const e={};for(const t of this.customRepos){const o=t.category||"other";e[o]=(e[o]||0)+1}return e}_renderFilteredContent(e,t,o,i){const r=this._customRepofilter||"all";return"archived"===r?t.length>0?H`
        <div class="repo-cards">${t.map(e=>H`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#6a1b9a20,#7b1fa220);">
              <div class="repo-card-avatar" style="background:#7b1fa2;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:13px;font-weight:600;">${e}</div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${ge("archivedRepos")}</span>
              </div>
            </div>
            <div class="actions" style="display:flex;gap:6px;padding:8px 14px;border-top:1px solid var(--divider-color,#e0e0e0);">
              <a class="action-btn" href="https://github.com/${e}" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;font-size:12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                ${ge("viewOnGithub")}
              </a>
              <button class="action-btn" @click=${()=>this._removeArchivedRepo(e)} style="color:#f44336;border-color:#f44336;flex:1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                ${ge("removeArchived")}
              </button>
            </div>
          </div>
        `)}</div>
      `:H`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div>${ge("noArchived")}</div></div>`:"ignored"===r?o.length>0?H`
        <div class="repo-cards">${o.map(e=>H`
          <div class="repo-card" style="cursor:default;">
            <div class="repo-card-img" style="background:linear-gradient(135deg,#e0e0e0,#f5f5f5);">
              <div class="repo-card-avatar" style="background:#9e9e9e;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
            </div>
            <div class="repo-card-body">
              <div class="name" style="font-size:13px;font-weight:600;">${e}</div>
              <div class="meta">
                <span style="font-size:10px;color:var(--secondary-text-color);">${ge("ignoredRepos")}</span>
              </div>
            </div>
          </div>
        `)}</div>
      `:H`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg><div>${ge("noIgnored")}</div></div>`:"renamed"===r?i.length>0?H`
        <div class="repo-cards">${i.map(([e,t])=>H`
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
                <span style="font-size:10px;color:var(--secondary-text-color);">${ge("renamedRepos")}</span>
              </div>
            </div>
            <div class="actions" style="display:flex;gap:6px;padding:8px 14px;border-top:1px solid var(--divider-color,#e0e0e0);">
              <button class="action-btn primary" @click=${()=>this._replaceRenamedOneClick(e,t)} ?disabled=${this._renamedRefreshing} style="flex:1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                ${ge("replace")||"替换"}
              </button>
              <button class="action-btn" @click=${()=>this._removeRenamedRepo(e)} style="color:#f44336;border-color:#f44336;flex:0 0 auto;padding:8px 10px;" title="${ge("removeRenamed")}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `)}</div>
      `:H`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg><div>${ge("noRenamed")||"无重命名仓库"}</div></div>`:0===e.length?H`<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;opacity:0.4;margin-bottom:8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div>${ge("noCustomRepos")}</div></div>`:"card"===this._viewMode?H`<div class="repo-cards">${this._getFilteredCustomRepos().map(e=>{const t=i.find(([t,o])=>o===(e.full_name||e.repository));return H`
          <repo-card .repo=${e} viewMode="management"
            .renamedFrom=${t?t[0]:void 0}
            showRemoveBtn=true
            .showCheckbox=${!0}
            .selected=${this._selectedRepos.includes(e.full_name||e.repository)}
            @detail=${e=>this._openCardDetail(e.detail.repo)}
            @remove-repo=${e=>this._removeCustomRepo(e.detail.repo?.full_name||e.detail.repo?.repository,e.detail.repo?.category)}
            @check-change=${e=>{const t=e.detail.fullName;t&&this._toggleSelectRepo(t)}}>
          </repo-card>`})}</div>`:H`<div class="repo-list">${this._getFilteredCustomRepos().map(e=>this._renderListItem(e,i))}</div>`}_getInitials(e){if(!e)return"?";const t=e.split("/");return(t[t.length-1]||e).charAt(0).toUpperCase()}_getCategoryColor(e){return fe(e)}_getCategoryLabel(e){return{integration:ge("catIntegration"),plugin:ge("catPlugin"),theme:ge("catTheme"),appdaemon:ge("catAppDaemon"),netdaemon:ge("catNetDaemon"),python_script:ge("catPythonScript"),template:ge("catTemplate"),dashboard:ge("catDashboard")}[e]||e}_renderCard(e,t){const o=e.full_name||e.repository,i=e.manifest_name||e.name||o,r=t.find(([e,t])=>t===o),s=!!r,a=s?r[0]:null,n=e.installed_version||"",l=e.latest_version||"",c=e.has_update,d=e.stargazers_count||0,p=e.description||"",h=e.installed||!1,g=this._getCategoryColor(e.category);return H`
      <div class="repo-card" @click=${()=>this._openCardDetail(e)}>
        <div class="repo-card-img" style="background:linear-gradient(135deg, ${g}44 0%, ${g}22 100%);">
          <div class="repo-card-avatar" style="background:${g}">
            ${e.domain&&"integration"===e.category?H`
              <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
              <span style="display:none">${this._getInitials(i)}</span>
            `:this._getInitials(i)}
          </div>
          <span class="repo-card-badge-cat" style="background:${g}">
            ${this._getCategoryLabel(e.category)}
          </span>
          ${e.is_custom?H`<span class="repo-card-custom">${ge("customBadge")}</span>`:""}
          ${s?H`<span class="repo-card-renamed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${a}</span>`:""}
          ${h?H`<span class="repo-card-installed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${ge("installed")}</span>`:""}
          <div class="repo-card-actions-img">
            <button class="btn-icon" @click=${t=>{t.stopPropagation(),this._removeCustomRepo(o,e.category)}} title="${ge("removeRepo")}">
              ✕
            </button>
          </div>
        </div>
        <div class="repo-card-body">
          <div class="name" title=${i}>${i}</div>
          <div class="fullname">${o}</div>
          <div class="desc">${p||ge("noDesc")}</div>
          ${e.topics&&e.topics.length?H`
            <div class="topic-chips" style="margin-top:6px;">
              ${e.topics.slice(0,3).map(e=>H`<span class="topic-chip">${e}</span>`)}
            </div>
          `:""}
          <div class="meta">
            <span class="stars">
              <svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${d>0?"number"==typeof d?d.toLocaleString():d:0}
            </span>
            ${h?H`
              <span style="font-size:10px;color:var(--secondary-text-color);">
                <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${n}${c?H` <span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${l}</span>`:""}
              </span>
            `:H`<span class="repo-not-installed">${ge("notInstalled")}</span>`}
          </div>
        </div>
      </div>
    `}_renderListItem(e,t){const o=e.full_name||e.repository,i=e.manifest_name||e.name||o,r=t.find(([e,t])=>t===o),s=!!r,a=s?r[0]:null,n=e.installed_version||"",l=e.latest_version||"",c=e.has_update,d=e.stargazers_count||0,p=e.description||"";return H`
      <div class="repo-item" @click=${()=>this._openCardDetail(e)}>
        <div class="col-icon">
          <div class="icon-cell" style="background:${this._getCategoryColor(e.category)}">
            ${e.domain&&"integration"===e.category?H`
                <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
                <span style="display:none">${i.charAt(0).toUpperCase()}</span>
              `:i.charAt(0).toUpperCase()}
          </div>
        </div>
        <div class="repo-info">
          <div class="repo-top">
            <span class="repo-name">${i}</span>
            <span class="category-badge ${e.category}">${this._getCategoryLabel(e.category)}</span>
            ${e.is_custom?H`<span class="custom-badge-tag">${ge("customBadge")}</span>`:""}
            ${s?H`<span class="renamed-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${a}</span>`:""}
          </div>
          <div class="repo-meta">
            <span class="repo-fullname">${o}</span>
            <span class="stars" style="color:#f9a825;"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${d>0?"number"==typeof d?d.toLocaleString():d:0}</span>
            ${e.installed?H`
              <span class="repo-version"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${n}</span>
              ${c?H`<span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${l}</span>`:""}
            `:H`<span class="repo-not-installed">${ge("notInstalled")}</span>`}
          </div>
          ${p?H`<div class="repo-desc">${p}</div>`:""}
          ${e.topics&&e.topics.length?H`
            <div class="topic-chips" style="margin-top:4px;">
              ${e.topics.slice(0,4).map(e=>H`<span class="topic-chip">${e}</span>`)}
            </div>
          `:""}
        </div>
        <div class="repo-actions">
          <a class="btn btn-icon" href="https://github.com/${o}" target="_blank" rel="noopener" @click=${e=>e.stopPropagation()} title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          ${s?H`
            <button class="btn primary sm" @click=${e=>{e.stopPropagation(),this._replaceRenamedOneClick(a,o)}} ?disabled=${this._renamedRefreshing}>
              ${this._renamedRefreshing?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:ge("replace")}
            </button>
            <button class="btn danger sm" @click=${e=>{e.stopPropagation(),this._removeRenamedRepo(a)}} title=${ge("removeRenamed")}>✕</button>
          `:""}
          <button class="btn danger sm" @click=${t=>{t.stopPropagation(),this._removeCustomRepo(o,e.category)}}>✕</button>
        </div>
      </div>
    `}render(){const{archivedRepos:e,ignoredRepos:t,renamedEntries:o,customRepos:i,loading:r,_viewMode:s,_collapsed:a}=this;return H`
      ${r?H`
        <div class="skeleton-grid" style="margin-bottom:16px;">
          ${[1,2,3,4,5,6].map(()=>H`
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
        <div class="search" style="flex:1;min-width:150px;">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="${ge("search")||"搜索..."}" .value=${this._customRepoSearch} @input=${e=>this._customRepoSearch=e.target.value}>
          ${this._customRepoSearch?H`<button class="search-clear" @click=${()=>this._customRepoSearch=""}>✕</button>`:""}
        </div>
        <div class="controls-right">
          <button class="refresh-btn" @click=${()=>this._load()} title="${ge("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          </button>
          <div class="view-toggle">
            <button class="view-toggle-btn ${"card"===s?"active":""}" @click=${()=>this._setViewMode("card")}>${ge("viewCard")}</button>
            <button class="view-toggle-btn ${"list"===s?"active":""}" @click=${()=>this._setViewMode("list")}>${ge("viewList")}</button>
          </div>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:36px;" @click=${this._toggleAddCustom}>+ ${ge("addRepo")}</button>
          <label class="sel-all-label">
            <input type="checkbox" class="checkbox-sm" .checked=${this._getFilteredCustomRepos().length>0&&this._selectedRepos.length===this._getFilteredCustomRepos().length}
                   @click=${e=>e.stopPropagation()}
                   @change=${()=>{this._selectedRepos.length>0?this._selectedRepos=[]:this._selectedRepos=this._getFilteredCustomRepos().map(e=>e.full_name||e.repository).filter(Boolean)}}>
            ${ge("selectAll")||"全选"}
            ${this._selectedRepos.length>0?H`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedRepos.length})</span>`:""}
          </label>
        </div>
      </div>

      <!-- Add Custom Repo Form (right after controls, before filters — matches store) -->
      ${this._showAddCustom?H`
        <div class="add-repo-form">
          <div class="form-row" style="display:flex;gap:8px;flex-wrap:wrap;">
            <input class="form-input" type="text" style="flex:1;min-width:200px;" .value=${this._customRepoUrl} @input=${e=>this._customRepoUrl=e.target.value} placeholder="owner/repo 或 GitHub URL" @keydown=${e=>"Enter"===e.key&&this._addCustomRepo()}>
            <select class="form-select" .value=${this._customRepoCategory} @change=${e=>this._customRepoCategory=e.target.value}>
              ${["integration","plugin","theme","dashboard","python_script","template","appdaemon","netdaemon"].map(e=>H`<option value=${e}>${this._getCategoryLabel(e)}</option>`)}
            </select>
          </div>
          <div class="form-actions" style="display:flex;gap:6px;margin-top:8px;">
            <button class="btn primary" @click=${this._addCustomRepo} ?disabled=${this._addingCustom||!this._customRepoUrl.trim()}>
              ${this._addingCustom?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ge("add")}`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${ge("add")}`}
            </button>
            <button class="btn" @click=${this._toggleAddCustom}>${ge("cancel")}</button>
          </div>
          ${this._customRepoUrl.trim()&&this._parseRepoUrl(this._customRepoUrl)?H`
            <div style="margin-top:4px;font-size:11px;color:var(--secondary-text-color);display:flex;align-items:center;gap:4px;">
              <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${this._parseRepoUrl(this._customRepoUrl)}
            </div>
          `:this._customRepoUrl.trim()?H`
            <div style="margin-top:4px;font-size:11px;color:#f44336;">${ge("invalidRepoUrl")}</div>
          `:""}
        </div>
      `:""}

      <!-- Filter + Sort: single compact row -->
      <div class="filter-sort-row">
        <div class="fs-chips">
          <span class="fs-label">${ge("repoStatus")}</span>
          <button class="filter-chip ${"all"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="all",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${ge("all")||"全部"}</button>
          ${e.length>0?H`<button class="filter-chip ${"archived"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="archived",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${ge("archivedRepos")} (${e.length})</button>`:""}
          ${o.length>0?H`<button class="filter-chip ${"renamed"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="renamed",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${ge("renamedRepos")} (${o.length})</button>`:""}
          ${t.length>0?H`<button class="filter-chip ${"ignored"===this._customRepofilter?"active":""}" @click=${()=>{this._customRepofilter="ignored",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${ge("ignoredRepos")} (${t.length})</button>`:""}
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("filterStatus")}</span>
          <button class="filter-chip ${this._statusFilter?"":"active"}" @click=${()=>{this._statusFilter="",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${ge("all")||"全部"}</button>
          ${["installed","update_available","not_installed","pending_restart"].filter(e=>(this._getStatusCounts()[e]??0)>0).map(e=>H`
            <button class="filter-chip ${this._statusFilter===e?"active":""}" @click=${()=>{this._statusFilter=e,Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
              ${ge("installed"===e?"statusInstalled":"update_available"===e?"statusPendingUpgrade":"not_installed"===e?"statusNotInstalled":"statusPendingRestart")}
              <span class="chip-count">${this._getStatusCounts()[e]}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("filterType")}</span>
          <button class="filter-chip ${this._typeFilter?"":"active"}" @click=${()=>{this._typeFilter="",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>${ge("all")||"全部"}</button>
          ${Object.entries(this._getTypeCounts()).filter(([e,t])=>t>0).map(([e,t])=>H`
            <button class="filter-chip ${this._typeFilter===e?"active":""}" @click=${()=>{this._typeFilter=e,Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
              ${this._getCategoryLabel(e)}<span class="chip-count">${t}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("sort")||"排序"}</span>
          <button class="filter-chip sort-inline ${"name"===this._customRepoSort?"active":""}" @click=${()=>{this._customRepoSort="name",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
            ${ge("sortByName")}${"name"===this._customRepoSort?H`<span class="sort-dir">▲</span>`:""}
          </button>
          <button class="filter-chip sort-inline ${"stars"===this._customRepoSort?"active":""}" @click=${()=>{this._customRepoSort="stars",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
            ${ge("sortByStars")}${"stars"===this._customRepoSort?H`<span class="sort-dir">▼</span>`:""}
          </button>
          <button class="filter-chip sort-inline ${"updated"===this._customRepoSort?"active":""}" @click=${()=>{this._customRepoSort="updated",Xt({customRepofilter:this._customRepofilter,customRepoSort:this._customRepoSort,statusFilter:this._statusFilter,typeFilter:this._typeFilter})}}>
            ${ge("sortByUpdated")}${"updated"===this._customRepoSort?H`<span class="sort-dir">▼</span>`:""}
          </button>
        </div>
      </div>

      <!-- Batch Action Bar -->
      ${this._selectedRepos.length>0?H`
        <div class="batch-bar">
          <span>${ge("batchSelected",{n:this._selectedRepos.length})}</span>
          <button class="batch-bar-btn" @click=${()=>this._batchRemove()} style="border-color:#ff5252;color:#ff5252;">${ge("removeRepo")}</button>
          <button class="batch-bar-btn" @click=${()=>{this._selectedRepos=[]}}>${ge("cancel")}</button>
        </div>
      `:""}

      ${this._renderFilteredContent(i,e,t,o)}
    `}}customElements.define("management-view",Jt);class Kt extends ae{static properties={hass:{type:Object},_settings:{type:Object,state:!0},_saving:{type:Boolean,state:!0},_version:{type:String,state:!0},_importing:{type:Boolean,state:!0},_exporting:{type:Boolean,state:!0},_depLoading:{type:Boolean,state:!0},_depResults:{type:Object,state:!0}};constructor(){super(),this._settings={},this._saving=!1,this._version="",this._importing=!1,this._exporting=!1,this._depLoading=!1,this._depResults=null}connectedCallback(){super.connectedCallback(),this._load()}async _load(){try{this._settings=await ce.getSettings()||{}}catch(e){console.error("Settings load failed:",e),this._settings={}}try{const e=await ce.getVersion();this._version=e?.version||""}catch(e){}}async _save(){this._saving=!0;try{await ce.updateSettings(this._settings);const{showToast:e}=await Promise.resolve().then(function(){return Nt});e(ge("settingsSaved"),"success")}catch(e){showToast(`${ge("settingsSaveFailed")}: ${e.message}`,"error")}this._saving=!1}_set(e,t){this._settings={...this._settings,[e]:t}}async _reloadCore(){try{const{showToast:e}=await Promise.resolve().then(function(){return Nt});e(ge("reloadingHA"),"info");const t=await ce.reloadHA();t.success?e(ge("reloadSuccess"),"success"):e(`${ge("coreReloadFailed")}: ${t.error}`,"error")}catch(e){const{showToast:t}=await Promise.resolve().then(function(){return Nt});t(`${ge("coreReloadFailed")}: ${e.message}`,"error")}}async _checkDependencies(){this._depLoading=!0;try{const e=await ce.checkDependencies();this._depResults=e,e.all_ok?showToast(ge("depOk"),"success"):showToast(`${ge("depMissing")} (${e.issues_count})`,"error")}catch(e){this._depResults=null,showToast(`${ge("checkFailed")}: ${e.message}`,"error")}this._depLoading=!1}static styles=[me(),s`
    :host { display: block; }
    .container {
      margin: 0 auto; padding: 14px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px;
    }

    @media (min-width: 1024px) {
      .config-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        align-items: start;
      }
    }

    .section {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 14px; padding: 16px; margin-bottom: 14px;
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

    .save-bar {
      display: flex; justify-content: flex-end; padding-top: 14px;
    }

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
  `];render(){return H`
      <div class="container">
        <div class="config-grid">

        <!-- ⚙️ 基本设置 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            ${ge("settingsTitle")}
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${ge("settingsRefreshInterval")}</div>
              <div class="desc">${ge("settingsDesc")}</div>
            </div>
            <div class="setting-control">
              <input type="number" min="60" max="86400" style="width:90px;"
                .value=${this._settings.refresh_interval??3600}
                @change=${e=>this._set("refresh_interval",parseInt(e.target.value)||3600)} />
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${ge("settingsDefaultView")}</div>
            </div>
            <div class="setting-control">
              <select @change=${e=>this._set("default_view",e.target.value)}
                .value=${this._settings.default_view||"browse"}>
                <option value="browse">${ge("tabBrowse")}</option>
                <option value="updates">${ge("tabUpdates")}</option>
                <option value="management">${ge("tabManagement")}</option>
              </select>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${ge("settingsNotifyUpdates")}</div>
            </div>
            <div class="setting-control">
              <select @change=${e=>this._set("notify_updates","true"===e.target.value)}
                .value=${String(this._settings.notify_updates??!0)}>
                <option value="true">${ge("enabled")}</option>
                <option value="false">${ge("disabled")}</option>
              </select>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${ge("settingsNotifyRestart")}</div>
            </div>
            <div class="setting-control">
              <select @change=${e=>this._set("notify_restart","true"===e.target.value)}
                .value=${String(this._settings.notify_restart??!0)}>
                <option value="true">${ge("enabled")}</option>
                <option value="false">${ge("disabled")}</option>
              </select>
            </div>
          </div>

          <div class="save-bar">
            <button class="btn primary" @click=${this._save} ?disabled=${this._saving}>
              ${this._saving?H`<span class="spinner-sm" style="display:inline-block;width:14px;height:14px;border-width:2px;margin:0;vertical-align:-2px;"></span> ${ge("loading")}`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> ${ge("save")}`}
            </button>
          </div>
        </div>

        <!-- 🛠️ 维护 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            ${ge("settingsMaintenance")}
          </div>
          <div class="action-grid">
            <button class="btn" @click=${this._checkUpdates}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              ${ge("checkUpdatesNotify")}
            </button>
            <button class="btn" style="color:#ff9800;border-color:#ff9800;" @click=${this._reloadCore}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
              ${ge("reloadHA")}
            </button>
            <button class="btn danger" @click=${this._checkAndRestart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ${ge("restartHA")}
            </button>
            <button class="btn" style="color:#ff9800;border-color:#ff9800;" @click=${this._clearPanelCache}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              ${ge("clearCache")}
            </button>
          </div>
        </div>

        <!-- 💾 数据管理 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${ge("exportBackup")}
          </div>
          <div class="backup-row">
            <button class="btn primary" @click=${this._export} ?disabled=${this._exporting}>
              ${this._exporting?H`<span class="spinner-sm" style="display:inline-block;width:14px;height:14px;border-width:2px;margin:0;"></span> ${ge("exporting")}`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${ge("exportBtn")}`}
            </button>
            <button class="btn file-input" ?disabled=${this._importing}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              ${this._importing?H`${ge("importing")}`:H`${ge("importBackup")}`}
              <input type="file" accept=".json" @change=${e=>this._import(e)} />
            </button>
            <span style="font-size:11px;color:var(--secondary-text-color,#727272);">${ge("importDesc")}</span>
          </div>
        </div>

        <!-- 依赖检查 -->
        <div class="section">
          <div class="section-title">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${ge("depCheck")}
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <div class="label">${ge("depDesc")}</div>
            </div>
            <div class="setting-control">
              <button class="btn" @click=${this._checkDependencies} ?disabled=${this._depLoading}>
                ${this._depLoading?"⟳":"🔗"} ${ge("checkDep")}
              </button>
            </div>
          </div>
          ${this._depResults?.dependencies?.filter(e=>e.has_issues).length>0?H`
            <div style="margin-top:8px;font-size:12px;color:var(--secondary-text-color);">
              ${this._depResults.dependencies.filter(e=>e.has_issues).map(e=>H`
                <div style="padding:4px 0;display:flex;gap:6px;align-items:center;">
                  <span style="color:#f44336;">✕</span> <span>${e.name}</span>
                  ${e.missing_dependencies?.length?H`<span style="color:var(--secondary-text-color);">— ${ge("depMissing")}: ${e.missing_dependencies.join(", ")}</span>`:""}
                </div>
              `)}
            </div>
          `:this._depResults?.all_ok?H`
            <div style="margin-top:8px;font-size:12px;color:#4caf50;">✅ ${ge("depOk")}</div>
          `:""}
        </div>

        </div> <!-- config-grid -->
        <div class="version">HACS Vision${this._version?` v${this._version}`:""}</div>
      </div>
    `}async _export(){this._exporting=!0;try{const e=await ce.exportBackup(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),o=URL.createObjectURL(t),i=document.createElement("a");i.href=o,i.download=`hacs_backup_${(new Date).toISOString().slice(0,10)}.json`,i.click(),URL.revokeObjectURL(o);const{showToast:r}=await Promise.resolve().then(function(){return Nt});r(ge("exportSuccess"),"success")}catch(e){showToast(`${ge("exportFailed")}: ${e.message}`,"error")}this._exporting=!1}async _import(e){const t=e.target?.files?.[0];if(!t)return;if(await Pt.show(this,{message:ge("importDesc"),confirmText:ge("importBackup"),danger:!0})){this._importing=!0;try{const e=await t.text(),o=JSON.parse(e),i=await ce.importBackup(o),{showToast:r}=await Promise.resolve().then(function(){return Nt});i.success?(r(ge("importSuccess"),"success"),this._load()):r(`${ge("importFailed")}: ${i.error}`,"error")}catch(e){showToast(`${ge("importFailed")}: ${e.message}`,"error")}this._importing=!1,e.target.value=""}}async _checkUpdates(){try{const e=await ce.checkUpdatesWithNotify(),{showToast:t}=await Promise.resolve().then(function(){return Nt});e.success&&(e.updates_found>0?t(ge("updatesChecked",{n:e.updates_found}),"success"):t(ge("noUpdatesFound"),"info"),e.notified&&t(ge("notifySent"),"success"))}catch(e){showToast(`Update check failed: ${e.message}`,"error")}}async _checkAndRestart(){if(await Pt.show(this,{message:ge("restartConfirm"),confirmText:ge("restartHA"),danger:!0}))try{await ce.restartHA();const{showToast:e}=await Promise.resolve().then(function(){return Nt});e(ge("haRestarting"),"info")}catch(e){showToast(`${ge("restartFailed")}: ${e.message}`,"error")}}async _clearPanelCache(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Ut});if(await e.show(this,{message:ge("clearCacheConfirm"),confirmText:ge("confirm"),danger:!1}))try{if("undefined"!=typeof caches||void 0!==window.caches){const e="undefined"!=typeof caches?caches:window.caches,t=await e.keys();await Promise.all(t.map(t=>e.delete(t)))}const e=Object.keys(localStorage).filter(e=>e.startsWith("hacs_vision"));e.forEach(e=>localStorage.removeItem(e));const{showToast:t}=await Promise.resolve().then(function(){return Nt});t(ge("clearCacheDone"),"success"),setTimeout(()=>{location.href=location.pathname+"?_t="+Date.now()},1500)}catch(e){const{showToast:t}=await Promise.resolve().then(function(){return Nt});t(`${ge("clearCache")}: ${e.message}`,"error")}}}customElements.define("config-view",Kt);class Zt extends ae{static properties={hass:{type:Object},configEntries:{type:Array},loading:{type:Boolean},searchText:{type:String},_statusFilter:{type:String,state:!0},_showAddDialog:{type:Boolean,state:!0},_handlerSearch:{type:String,state:!0},_handlers:{type:Array,state:!0},_handlersLoading:{type:Boolean,state:!0},_removing:{type:Object,state:!0},_reloading:{type:Object,state:!0},_detailDomain:{type:String,state:!0},_detailEntries:{type:Array,state:!0},_detailDeviceCounts:{type:Object,state:!0},_showDetail:{type:Boolean,state:!0},_domainNames:{type:Object,state:!0},_viewMode:{type:String,state:!0},_toggledEntries:{type:Object,state:!0},_entryDevices:{type:Object,state:!0},_toggledDevices:{type:Object,state:!0},_entryDeviceLoading:{type:Object,state:!0},_toggling:{type:Object,state:!0},_selectedEntryIds:{type:Object,state:!0},_selectedDomains:{type:Object,state:!0},_sortBy:{type:String,state:!0},_sortDir:{type:String,state:!0},_configMenuFor:{type:Object,state:!0}};constructor(){super(),this.configEntries=[],this.loading=!0,this.searchText="",this._statusFilter="all",this._showAddDialog=!1,this._handlerSearch="",this._handlers=[],this._handlersLoading=!1,this._removing={},this._reloading={},this._detailDomain="",this._detailEntries=[],this._showDetail=!1,this._domainNames={},this._viewMode=localStorage.getItem("hacs_int_view_mode")||"card";const e=(localStorage.getItem("hacs_int_sort_by")||"").split(":");this._sortBy=e[0]||"name",this._sortDir=e[1]||("name"===e[0]?"asc":"desc"),this._detailOpenedAt=0,this._modalDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1,cleanup:null},this._toggledEntries={},this._entryDevices={},this._toggledDevices={},this._entryDeviceLoading={},this._toggling={},this._selectedEntryIds={},this._selectedDomains={}}_modalPointerDown(e){const t=e.target.closest(".modal-header, .dv-header");if(!t||e.target.closest("button, input, select, textarea"))return;if(void 0!==e.button&&0!==e.button)return;const o=this._modalDrag,i=e.currentTarget;o.dragging=!0,o.startX=e.clientX-o.offsetX,o.startY=e.clientY-o.offsetY,i.style.transition="none",i.style.cursor="grabbing",t.style.userSelect="none",i.setPointerCapture(e.pointerId);const r=e=>{o.dragging&&(o.offsetX=e.clientX-o.startX,o.offsetY=e.clientY-o.startY,i.style.transform=`translate(${o.offsetX}px, ${o.offsetY}px)`)},s=e=>{o.dragging=!1,i.style.cursor="",t.style.userSelect="",i.removeEventListener("pointermove",r),i.removeEventListener("pointerup",s),i.removeEventListener("pointercancel",s);try{i.releasePointerCapture(e.pointerId)}catch(e){}};i.addEventListener("pointermove",r),i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)}connectedCallback(){super.connectedCallback(),this._load()}_setViewMode(e){this._viewMode=e;try{localStorage.setItem("hacs_int_view_mode",e)}catch(e){}}_setSortBy(e){this._sortBy=e;try{localStorage.setItem("hacs_int_sort_by",e)}catch(e){}}async _load(){this.loading=!0;try{const e=await ce.getConfigEntries();this.configEntries=e.entries||[];const t={};for(const e of this.configEntries)t[e.domain]||(t[e.domain]=e.translated_name||e.domain);this._domainNames=t,this._loadHandlers()}catch(e){console.error("Failed to load config entries:",e),Mt(ge("loadFailed"),"error")}this.loading=!1}async _loadHandlers(){if(!(this._handlers.length>0)){this._handlersLoading=!0;try{const e=await this.hass.callApi("GET","config/config_entries/flow_handlers");this._handlers=Array.isArray(e)?e.map(e=>"string"==typeof e?{domain:e,name:e}:e):[],this._handlers.sort((e,t)=>(e.name||e.domain).localeCompare(t.name||t.domain))}catch(e){console.error("Failed to load flow handlers:",e),this._handlers=[]}this._handlersLoading=!1}}async _removeEntry(e,t){t.stopPropagation();const{ConfirmDialog:o}=await Promise.resolve().then(function(){return Ut});if(!await o.show(this,{title:e.domain,message:ge("confirmDelete",{domain:e.domain}),confirmText:ge("delete"),danger:!0}))return;this._removing={...this._removing,[e.entry_id]:!0};try{const t=ce._getHeaders(),o=await fetch(`/api/config/config_entries/entry/${e.entry_id}`,{method:"DELETE",headers:t,credentials:"include"});if(!o.ok)throw new Error(`HTTP ${o.status}`);Mt(`${e.domain} ${ge("deleted")}`,"success"),this._load()}catch(t){Mt(`${ge("deleteFailed")}: ${t.message}`,"error")}const i={...this._removing};delete i[e.entry_id],this._removing=i}async _reloadEntry(e,t){t.stopPropagation(),this._reloading={...this._reloading,[e.entry_id]:!0};try{const t=ce._getHeaders(),o=await fetch(`/api/config/config_entries/entry/${e.entry_id}/reload`,{method:"POST",headers:{...t,"Content-Type":"application/json"},credentials:"include",body:"{}"});if(!o.ok)throw new Error(`HTTP ${o.status}`);Mt(`${e.domain} ${ge("reloaded")}`,"success"),setTimeout(()=>this._load(),1500)}catch(t){Mt(`${ge("reloadFailed")}: ${t.message}`,"error")}const o={...this._reloading};delete o[e.entry_id],this._reloading=o}async _toggleDisabled(e,t){t.stopPropagation();const o=e.disabled_by?null:"user",i=o?ge("disableEntry")||"禁用":ge("enableEntry")||"启用";try{const t=ce._getHeaders(),r=await fetch("/api/config/config_entries/entry",{method:"POST",headers:{...t,"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({entry_id:e.entry_id,disabled_by:o})});if(!r.ok)throw new Error(`HTTP ${r.status}`);Mt(`${e.domain} ${i}${ge("successSuffix")||"成功"}`,"success"),setTimeout(()=>this._load(),1500)}catch(e){Mt(`${i}${ge("failedSuffix")||"失败"}: ${e.message}`,"error")}}_configureEntry(e,t){t.stopPropagation(),this._closeDetail(),this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id}}))}_openAddDialog(){this._showAddDialog=!0,this._handlerSearch="",this._loadHandlers()}_closeAddDialog(){this._showAddDialog=!1,this._handlerSearch=""}_onConfigure(e,t){if(1===t.entries.length)return this._closeDetail(),void this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id}}));this._configMenuFor=this._configMenuFor?.domain===t.domain?null:{domain:t.domain,entries:t.entries,mode:"configure"}}_onAddEntry(e){const t=this.configEntries.filter(t=>t.domain===e),o=t.some(e=>e.supported_subentry_types?.length>0);if(o&&t.length>0)return this._closeDetail(),void this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e,entry_id:t[0].entry_id}}));this._closeDetail(),this.dispatchEvent(new CustomEvent("add-integration",{bubbles:!0,composed:!0,detail:{domain:e}}))}_menuSelectEntry(e){this._configMenuFor=null,this._closeDetail(),this.dispatchEvent(new CustomEvent("configure-integration",{bubbles:!0,composed:!0,detail:{domain:e.domain,entry_id:e.entry_id}}))}_addIntegration(e){this._closeAddDialog(),this.dispatchEvent(new CustomEvent("add-integration",{bubbles:!0,composed:!0,detail:{domain:e}}))}_openDetail(e,t){this._detailOpenedAt=Date.now(),this._detailDomain=e,this._detailEntries=t,this._showDetail=!0,this._deviceViewEntryId="",console.debug("HACS Vision: _openDetail, cleared _deviceViewEntryId"),this._detailDeviceCounts=null,ce.getDeviceCounts(e).then(e=>{this._detailDeviceCounts=e}).catch(t=>{console.warn("Failed to get device counts for",e,t)})}_closeDetail(){if(this._detailOpenedAt&&Date.now()-this._detailOpenedAt<500)return void console.debug("HACS Vision: _closeDetail blocked by 500ms guard");console.debug("HACS Vision: _closeDetail CALLED"),this._showDetail=!1,this._detailDomain="",this._detailEntries=[],this._detailOpenedAt=0;const e=this.shadowRoot?.querySelector(".modal");e&&(e.style.transform="")}_toggleEntry(e){const t=e.entry_id;if(this._toggledEntries[t])return this._toggledEntries={...this._toggledEntries},delete this._toggledEntries[t],void this.requestUpdate();this._toggledEntries={...this._toggledEntries,[t]:!0},this._entryDevices[t]||this._entryDeviceLoading[t]||this._loadEntryDevices(e),this.requestUpdate()}async _loadEntryDevices(e){const t=e.entry_id;this._entryDeviceLoading={...this._entryDeviceLoading,[t]:!0};try{const e=await ce.get(`devices/${t}`);this._entryDevices={...this._entryDevices,[t]:e.groups||[]}}catch(e){this._entryDevices={...this._entryDevices,[t]:[]}}this._entryDeviceLoading={...this._entryDeviceLoading},delete this._entryDeviceLoading[t],this.requestUpdate()}_toggleDevice(e,t){this._toggledDevices[e]?(this._toggledDevices={...this._toggledDevices},delete this._toggledDevices[e]):this._toggledDevices={...this._toggledDevices,[e]:!0},this.requestUpdate()}_expandAll(){const e={};for(const t of this._detailEntries||[])e[t.entry_id]=!0,this._entryDevices[t.entry_id]||this._entryDeviceLoading[t.entry_id]||this._loadEntryDevices(t);this._toggledEntries=e;const t={};for(const e of Object.keys(this._entryDevices)){const o=this._entryDevices[e]||[];for(const e of o)for(const o of e.devices||[])t[o.device_id||o.entity_id||o.name]=!0}this._toggledDevices=t,this.requestUpdate()}_collapseAll(){this._toggledEntries={},this._toggledDevices={},this.requestUpdate()}_entityIcon(e,t){if(!t||"unavailable"===t||"unknown"===t)return"⊙";if("on"===t||"open"===t||"home"===t)return"●";if("off"===t||"closed"===t||"not_home"===t)return"○";return{light:"💡",switch:"🔌",sensor:"📊",binary_sensor:"🔍",climate:"🌡️",cover:"🚪",fan:"🌀",lock:"🔒",alarm_control_panel:"🔔",camera:"📷",media_player:"📺",vacuum:"🧹",weather:"☀️",device_tracker:"📍",person:"👤",sun:"☀️",automation:"⚡",script:"📜",input_boolean:"🔘",input_number:"🔢",input_select:"📋",number:"🔢",select:"📋",button:"🔘",text:"📝"}[e]||"◆"}_stateColor(e){return e&&"unavailable"!==e&&"unknown"!==e?"on"===e||"open"===e||"home"===e?"#4caf50":"off"===e||"closed"===e||"not_home"===e?"#9e9e9e":"var(--primary-text-color, #212121)":"var(--secondary-text-color, #888)"}_formatState(e,t,o){if(!e||"unavailable"===e)return ge("unavailable")||"不可用";if("unknown"===e)return ge("unknown")||"未知";if("on"===e)return ge("stateOn")||"开";if("off"===e)return ge("stateOff")||"关";if("open"===e)return ge("stateOpen")||"已打开";if("closed"===e)return ge("stateClosed")||"已关闭";if("home"===e)return ge("stateHome")||"在家";if("not_home"===e)return ge("stateNotHome")||"离家";const i={cool:"❄️ 制冷",heat:"🔥 制热",fan_only:"🌀 送风",dry:"💧 除湿",auto:"🤖 自动",off:"关"};return i[e]?i[e]:o?`${e} ${o}`:e}_canToggle(e){return["switch","light","fan","input_boolean","automation","script","lock","cover","vacuum"].includes(e.domain)&&this.hass}async _toggleEntity(e,t){if(t.stopPropagation(),!this._toggling?.[e.entity_id]){this._toggling||(this._toggling={}),this._toggling={...this._toggling,[e.entity_id]:!0};try{if("lock"===e.domain){const t="locked"===e.state?"unlock":"lock";await this.hass.callService(e.domain,t,{entity_id:e.entity_id})}else if("cover"===e.domain){const t="open"===e.state||"opening"===e.state?"close":"open";await this.hass.callService(e.domain,t,{entity_id:e.entity_id})}else"vacuum"===e.domain?await this.hass.callService(e.domain,"toggle",{entity_id:e.entity_id}):await this.hass.callService("homeassistant","toggle",{entity_id:e.entity_id})}catch(t){console.error("Toggle failed:",t)}this._toggling={...this._toggling,[e.entity_id]:!1}}}_openMoreInfo(e){this.dispatchEvent(new CustomEvent("more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_toggleSelectEntry(e,t){t&&t.stopPropagation();const o={...this._selectedEntryIds};o[e]?delete o[e]:o[e]=!0,this._selectedEntryIds=o}_isAllSelected(){const e=this._detailEntries||[];return 0!==e.length&&e.every(e=>this._selectedEntryIds[e.entry_id])}_toggleSelectAll(){const e=this._detailEntries||[];if(this._isAllSelected())this._selectedEntryIds={};else{const t={};for(const o of e)t[o.entry_id]=!0;this._selectedEntryIds=t}}_selectedCount(){return Object.keys(this._selectedEntryIds).filter(e=>this._selectedEntryIds[e]).length}async _batchAction(e){const t=Object.keys(this._selectedEntryIds).filter(e=>this._selectedEntryIds[e]);if(0===t.length)return;const o=(this._detailEntries||[]).filter(e=>t.includes(e.entry_id));for(const t of o)try{"remove"===e?await this._removeEntry(t,{stopPropagation:()=>{}}):"reload"===e?await this._reloadEntry(t,{stopPropagation:()=>{}}):"enable"===e?t.disabled_by&&await this._toggleDisabled(t,{stopPropagation:()=>{}}):"disable"===e&&(t.disabled_by||await this._toggleDisabled(t,{stopPropagation:()=>{}}))}catch(o){console.error(`Batch ${e} failed for ${t.entry_id}:`,o)}this._selectedEntryIds={},this.requestUpdate();const{showToast:i}=await Promise.resolve().then(function(){return Nt});i(`${ge("batchComplete")||"批量操作完成"} (${t.length})`,"success")}_toggleSelectDomain(e){const t={...this._selectedDomains};t[e]?delete t[e]:t[e]=!0,this._selectedDomains=t}_isAllDomainsSelected(e){return!(!e||0===e.length)&&e.every(e=>this._selectedDomains[e.domain])}_toggleSelectAllDomains(e){if(this._isAllDomainsSelected(e))this._selectedDomains={};else{const t={};for(const o of e)t[o.domain]=!0;this._selectedDomains=t}}_selectedDomainCount(){return Object.keys(this._selectedDomains).filter(e=>this._selectedDomains[e]).length}async _batchDomainAction(e){const t=Object.keys(this._selectedDomains).filter(e=>this._selectedDomains[e]);if(0===t.length)return;const o=(this._filteredDomainGroups||[]).filter(e=>t.includes(e.domain)).flatMap(e=>e.entries||[]);if(0===o.length)return;for(const t of o)try{"remove"===e?await this._removeEntry(t,{stopPropagation:()=>{}}):"reload"===e?await this._reloadEntry(t,{stopPropagation:()=>{}}):"enable"===e?t.disabled_by&&await this._toggleDisabled(t,{stopPropagation:()=>{}}):"disable"===e&&(t.disabled_by||await this._toggleDisabled(t,{stopPropagation:()=>{}}))}catch(o){console.error(`Batch ${e} failed for ${t.entry_id}:`,o)}this._selectedDomains={},this.requestUpdate();const{showToast:i}=await Promise.resolve().then(function(){return Nt});i(`${ge("batchComplete")||"批量操作完成"} (${t.length} 集成, ${o.length} 条目)`,"success")}_translateDomain(e){return this._domainNames?.[e]||e}_onSortColumn(e){e===this._sortBy?this._sortDir="asc"===this._sortDir?"desc":"asc":this._sortDir="name"===e?"asc":"desc",this._sortBy=e;try{localStorage.setItem("hacs_int_sort_by",`${e}:${this._sortDir}`)}catch(e){}}_sortLabel(e){return{name:ge("sortByName"),entries:ge("sortByEntries"),status:ge("filterStatus")}[e]||e}_renderAvatar(e){const t=`https://brands.home-assistant.io/${e}/icon.png`,o=`${window.location.origin}/api/hacs_vision_brand/${e}`,i=this._getDomainColor(e),r=e.charAt(0).toUpperCase();return H`
      <div class="avatar">
        <img class="avatar-img" src="${t}" alt=""
          @error=${e=>{if(e.target.dataset.fallbackTried){e.target.style.display="none",e.target.parentElement.style.background=i;const t=e.target.parentElement.querySelector(".avatar-letter");t&&(t.style.display="flex")}else e.target.dataset.fallbackTried="cdn",e.target.src=o}}>
        <span class="avatar-letter" style="display:none">${r}</span>
      </div>
    `}_getDomainColor(e){const t=["#1565c0","#7b1fa2","#2e7d32","#e65100","#00838f","#6a1b9a","#c62828","#283593"];let o=0;for(let t=0;t<e.length;t++)o=(o<<5)-o+e.charCodeAt(t);return t[Math.abs(o)%t.length]}_getState(e){const t=(e.state||"loaded").toLowerCase();return e.disabled_by?{label:ge("statusDisabled"),cls:"state-disabled",dot:"#9e9e9e"}:t.includes("fail")||t.includes("setup_retry")||t.includes("retry")?{label:ge("badgeLoadFailed"),cls:"state-failed",dot:"#f44336"}:t.includes("not_loaded")?{label:ge("statusNotLoaded"),cls:"state-not-loaded",dot:"#ff9800"}:{label:ge("statusInstalled"),cls:"state-loaded",dot:"#4caf50"}}_groupState(e){const t=e.some(e=>!e.disabled_by&&((e.state||"").toLowerCase().includes("fail")||(e.state||"").toLowerCase().includes("setup_retry")||(e.state||"").toLowerCase().includes("retry"))),o=e.some(e=>!e.disabled_by&&(e.state||"").toLowerCase().includes("not_loaded")),i=e.some(e=>e.disabled_by);return t?"failed":o?"not-loaded":i?"disabled":"loaded"}_groupLabel(e){return{loaded:ge("statusInstalled"),failed:ge("badgeLoadFailed"),disabled:ge("statusDisabled"),"not-loaded":ge("statusNotLoaded")}[e]||e}_groupColor(e){return{loaded:"#4caf50",failed:"#f44336",disabled:"#9e9e9e","not-loaded":"#ff9800"}[e]||"#999"}get _filteredDomainGroups(){const e=this.searchText.toLowerCase().trim(),t={};for(const o of this.configEntries){if(e){const t=this._translateDomain(o.domain).toLowerCase(),i=this._groupLabel(this._groupState([o])).toLowerCase();if(!o.domain.toLowerCase().includes(e)&&!t.includes(e)&&!i.includes(e))continue}t[o.domain]||(t[o.domain]=[]),t[o.domain].push(o)}let o=Object.entries(t).map(([e,t])=>({domain:e,entries:t,_state:this._groupState(t),_supports_options:t.some(e=>e.supports_options),_has_subentry:t.some(e=>e.supported_subentry_types?.length>0),_can_add:this._handlers.some(t=>t.domain===e)}));"all"!==this._statusFilter&&(o=o.filter(e=>e._state===this._statusFilter));const i="desc"===this._sortDir?-1:1;if("status"===this._sortBy){const e={failed:0,"not-loaded":1,disabled:2,loaded:3};o.sort((t,o)=>{const r=e[t._state]??3,s=e[o._state]??3;return r!==s?(r-s)*i:t.domain.localeCompare(o.domain)})}else"entries"===this._sortBy?o.sort((e,t)=>e.entries.length!==t.entries.length?(t.entries.length-e.entries.length)*i:e.domain.localeCompare(t.domain)):o.sort((e,t)=>{const o=this._translateDomain(e.domain).toLowerCase(),r=this._translateDomain(t.domain).toLowerCase();return o!==r?o<r?-1*i:1*i:e.domain.localeCompare(t.domain)*i});return o}get _chipCounts(){const e={all:0,loaded:0,failed:0,disabled:0,"not-loaded":0},t={};for(const o of this.configEntries)t[o.domain]||(t[o.domain]=!0,e.all++);const o={};for(const e of this.configEntries)o[e.domain]||(o[e.domain]=[]),o[e.domain].push(e);for(const[t,i]of Object.entries(o)){const t=this._groupState(i);void 0!==e[t]&&e[t]++}return e}get _filteredHandlers(){const e=this._handlerSearch.toLowerCase().trim();return e?this._handlers.filter(t=>{const o=(this._domainNames?.[t.domain]||"").toLowerCase();return(t.name||"").toLowerCase().includes(e)||(t.domain||"").toLowerCase().includes(e)||o.includes(e)}):this._handlers}render(){const e=this._filteredDomainGroups,t=this._chipCounts;return H`
      <div class="integrations">
        <div class="controls">
          <div class="search" style="flex:1;min-width:120px;">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text"
              .value=${this.searchText}
              @input=${e=>{this.searchText=e.target.value}}
              placeholder="${ge("searchIntegration")}">
            ${this.searchText?H`<button class="search-clear" @click=${()=>{this.searchText=""}}>✕</button>`:""}
          </div>
          <div class="controls-right">
            <button class="refresh-btn" @click=${this._load} title="${ge("refresh")}" style="width:36px;height:36px;padding:8px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
            <div class="view-toggle">
              <button class="view-toggle-btn ${"card"===this._viewMode?"active":""}" @click=${()=>this._setViewMode("card")} title="${ge("viewCard")}">${ge("viewCard")}</button>
              <button class="view-toggle-btn ${"list"===this._viewMode?"active":""}" @click=${()=>this._setViewMode("list")} title="${ge("viewList")}">${ge("viewList")}</button>
            </div>
            <button class="action-btn primary" @click=${this._openAddDialog}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${ge("addHAIntegration")}
            </button>
            <label class="sel-all-label">
              <input type="checkbox" class="checkbox-sm"
                .checked=${this._isAllDomainsSelected(e)}
                @change=${()=>this._toggleSelectAllDomains(e)}>
              ${ge("selectAll")||"全选"} ${this._selectedDomainCount()>0?H`<span style="color:var(--primary-color);font-weight:600;">(${this._selectedDomainCount()})</span>`:""}
            </label>
          </div>
        </div>

        <!-- Filter chips -->
        <div class="filter-bar">
          ${["all","loaded","failed","disabled","not-loaded"].map(e=>H`
            <button class="filter-chip ${this._statusFilter===e?"active":""}"
              @click=${()=>{this._statusFilter=e}}>
              <span class="chip-label">${ge("all"===e?"filterAll":"loaded"===e?"filterLoaded":"failed"===e?"filterFailed":"disabled"===e?"filterDisabled":"filterNotLoaded")}</span>
              <span class="chip-count">${t[e]??0}</span>
            </button>
          `)}
          <span class="fs-divider"></span>
          <span class="fs-label">${ge("sort")||"排序"}</span>
          ${[{key:"name",label:ge("sortByName")},{key:"entries",label:ge("sortByEntries")},{key:"status",label:ge("filterStatus")}].map(e=>H`
            <button class="filter-chip sort-inline ${this._sortBy===e.key?"active":""}" @click=${()=>this._onSortColumn(e.key)}>
              ${e.label}${this._sortBy===e.key?H`<span class="sort-dir">${"desc"===this._sortDir?"▼":"▲"}</span>`:""}
            </button>
          `)}
        </div>

        ${this._selectedDomainCount()>0?H`
          <div class="batch-bar" style="margin-bottom:10px;">
            <span style="font-weight:600;">${this._selectedDomainCount()} ${ge("selected")||"个集成已选"}</span>
            <div class="batch-actions">
              <button class="batch-btn enable" @click=${()=>this._batchDomainAction("enable")}>${ge("enableEntry")||"启用"}</button>
              <button class="batch-btn disable" @click=${()=>this._batchDomainAction("disable")}>${ge("disableEntry")||"禁用"}</button>
              <button class="batch-btn reload" @click=${()=>this._batchDomainAction("reload")}>${ge("reloadEntry")||"重载"}</button>
              <button class="batch-btn remove" @click=${()=>this._batchDomainAction("remove")}>${ge("removeEntry")||"删除"}</button>
              <button class="batch-btn cancel" @click=${()=>{this._selectedDomains={},this.requestUpdate()}}>✕</button>
            </div>
          </div>
        `:""}

        ${this.loading?H`
          <div class="loading"><div class="spinner-sm"></div><div class="loading-text">${ge("loading")}</div></div>
        `:0===e.length?H`
          <div class="empty-state">
            <div class="empty-icon">⚙</div>
            <div class="empty-title">${ge("noData")}</div>
          </div>
        `:"list"===this._viewMode?H`
          <div class="integrations-list">
            <div class="list-header">
              <span class="list-header-name">${ge("colName")}</span>
              <span class="list-header-status">${ge("colStatus")}</span>
              <span class="list-header-action"></span>
            </div>
            ${e.map(e=>this._renderListRow(e))}
          </div>
        `:H`
          <div class="grid">
            ${e.map(e=>this._renderCard(e))}
          </div>
        `}
      </div>

      ${this._renderAddDialog()}
      ${this._renderDetailDialog()}
    `}_renderListRow(e){const{domain:t,entries:o}=e,i=e._state,r=o.length>1,s=o[0],a=o.some(e=>this._removing[e.entry_id]||this._reloading[e.entry_id]);return H`
      <div class="list-row list-row-${i}" @click=${()=>this._openDetail(t,o)}>
        <span class="list-row-name">
          <span class="list-row-icon">${this._renderAvatar(t)}</span>
          <span class="list-row-title">${this._translateDomain(t)}</span>
          <span class="list-row-domain">${t}</span>
        </span>
        <span class="list-row-status">
          <span class="list-status-badge state-${i}">${this._groupLabel(i)}</span>
          ${r?H`<span class="list-entry-count">${o.length} ${ge("entryCount")}</span>`:""}
        </span>
        <span class="list-row-actions">
          ${e._has_subentry?H`
          <button class="list-action-btn manage" @click=${t=>{t.stopPropagation(),this._onConfigure(s||o[0],e)}} title="${ge("configureEntry")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          `:e._can_add?H`
          <button class="list-action-btn add" @click=${e=>{e.stopPropagation(),this._onAddEntry(t)}} title="${ge("addIntegration")||"添加"}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          `:""}
          <button class="list-action-btn reload" @click=${e=>{e.stopPropagation(),this._reloadEntry(s||o[0],e)}} title="${ge("reloadEntry")}" ?disabled=${a}>
            ${this._reloading[s?.entry_id||""]?"⋯":H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`}
          </button>
        </span>
      </div>
    `}_renderCard(e){const{domain:t,entries:o}=e;this._getDomainColor(t);const i=e._state,r=o.some(e=>this._removing[e.entry_id]||this._reloading[e.entry_id]);o.length;const s=o[0];return H`
      <div class="card card-${i}" @click=${()=>this._openDetail(t,o)} role="button" tabindex="0"
        @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDetail(t,o))}}>

          <div class="card-img">
            <div class="card-top-bar" @click=${e=>e.stopPropagation()}>
              <input type="checkbox" class="card-checkbox" .checked=${!!this._selectedDomains[t]}
                     @change=${()=>this._toggleSelectDomain(t)}>
            </div>
            ${this._renderAvatar(t)}
            ${"loaded"!==i?H`<span class="img-status-badge state-${i}">${this._groupLabel(i)}</span>`:""}
          </div>

        <div class="card-body">
          <div class="card-name" title="${t}">${this._translateDomain(t)}</div>
          <div class="card-meta">
            <span>${o.length} ${ge("entryCount")}</span>
            ${s?H`<span class="dot-sep"></span><span class="status-label" style="color:${this._groupColor(i)}">${s.title||s.entry_id.substring(0,8)}</span>`:""}
          </div>
        </div>

        <div class="card-footer" @click=${e=>e.stopPropagation()}>
          <div class="footer-left">
            ${e._has_subentry?H`
            <!-- Subentry integrations (AI Hub): single button covers both configure + add -->
            <button class="footer-btn manage" @click=${()=>this._onConfigure(s||o[0],e)}
              title="${ge("configureEntry")}" ?disabled=${r}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span class="btn-label">${ge("configure")||"配置"}</span>
            </button>
            `:e._can_add?H`
            <!-- Can add: always prefer ＋ (configure via detail dialog if needed) -->
            <button class="footer-btn add-entry" @click=${()=>this._onAddEntry(t)}
              title="${ge("addIntegration")||"添加设备"}" ?disabled=${r}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span class="btn-label">${ge("add")||"添加"}</span>
            </button>
            `:""}
            ${this._configMenuFor?.domain===t&&"configure"===this._configMenuFor?.mode?H`
            <div class="config-dropdown">
              ${o.map(e=>H`
                <button class="config-dropdown-item" @click=${()=>this._menuSelectEntry(e)}>
                  <span class="dd-icon">${e.domain}</span>
                  <span class="dd-label">${e.title||e.entry_id.substring(0,8)}</span>
                  ${e.supports_options?H`<span class="dd-badge">${ge("configure")}</span>`:""}
                  ${e.supported_subentry_types?H`<span class="dd-badge sub">+${e.supported_subentry_types.length}</span>`:""}
                </button>
              `)}
            </div>
            `:""}
          </div>
          <div class="footer-right">
            <button class="footer-btn reload" @click=${()=>this._reloadEntry(s||o[0],{stopPropagation:()=>{}})}
              title="${ge("reloadEntry")}" ?disabled=${r}>
              ${r?H`<span class="spinning-mini">⟳</span>`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`}
              <span class="btn-label">${ge("reloadEntry")||"重载"}</span>
            </button>
            <button class="footer-btn remove" @click=${e=>this._removeEntry(s||o[0],e)}
              title="${ge("removeEntry")}" ?disabled=${r}>
              ${r?H`<span class="spinning-mini">⋯</span>`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
              <span class="btn-label">${ge("delete")}</span>
            </button>
          </div>
        </div>
      </div>
    `}_renderDetailDialog(){if(!this._showDetail)return"";const e=this._detailDomain,t=this._detailEntries;return H`
      <div class="detail-overlay" role="dialog" aria-modal="true" aria-label="${this._translateDomain(e)}" @click=${e=>{e.target===e.currentTarget&&this._closeDetail()}} @keydown=${e=>{"Escape"===e.key&&this._closeDetail()}}>
        <div class="modal" @pointerdown=${this._modalPointerDown}>
          <div class="modal-header">
            <div class="modal-header-left">
              ${this._renderAvatar(e)}
              <div>
                <div class="modal-title">${this._translateDomain(e)}</div>
                <div class="modal-subtitle" style="display:flex;align-items:center;gap:8px;">
                  <span>${t.length} ${ge("entryCount")}</span>
                  <label class="sel-all-label" @click=${e=>e.stopPropagation()}>
                    <input type="checkbox" class="entry-checkbox" .checked=${this._isAllSelected()}
                           @change=${this._toggleSelectAll}>
                    <span style="font-size:12px;color:var(--secondary-text-color);cursor:pointer;">${ge("selectAll")||"全选"}</span>
                  </label>
                  ${this._selectedCount()>0?H`<span style="font-size:12px;color:var(--primary-color);font-weight:600;">${this._selectedCount()} ${ge("selected")||"已选"}</span>`:""}
                </div>
              </div>
            </div>
            <div class="modal-header-right">
              <button class="tree-action-btn" @click=${this._expandAll} title="${ge("expandAll")||"展开全部"}">⊕</button>
              <button class="tree-action-btn" @click=${this._collapseAll} title="${ge("collapseAll")||"全部折叠"}">⊖</button>
              <button class="modal-close" aria-label="${ge("close")||"关闭"}" @click=${this._closeDetail}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="tree-container">
            ${this._selectedCount()>0?H`
            <div class="batch-bar">
              <span style="font-weight:600;">${this._selectedCount()} ${ge("selected")||"已选"}</span>
              <div class="batch-actions">
                <button class="batch-btn enable" @click=${()=>this._batchAction("enable")} title="${ge("enableEntry")||"启用"}">${ge("enableEntry")||"启用"}</button>
                <button class="batch-btn disable" @click=${()=>this._batchAction("disable")} title="${ge("disableEntry")||"禁用"}">${ge("disableEntry")||"禁用"}</button>
                <button class="batch-btn reload" @click=${()=>this._batchAction("reload")} title="${ge("reloadEntry")||"重载"}">${ge("reloadEntry")||"重载"}</button>
                <button class="batch-btn remove" @click=${()=>this._batchAction("remove")} title="${ge("removeEntry")||"删除"}">${ge("removeEntry")||"删除"}</button>
                <button class="batch-btn cancel" @click=${()=>{this._selectedEntryIds={},this.requestUpdate()}}>✕</button>
              </div>
            </div>
            `:""}
            ${0===t.length?H`<div class="tree-empty">${ge("noData")||"暂无数据"}</div>`:t.map(e=>this._renderEntryRow(e))}
          </div>
        </div>
      </div>
    `}_renderEntryRow(e){const t=this._getState(e),o=this._removing[e.entry_id]||this._reloading[e.entry_id],i=e.title||e.entry_id.substring(0,8),r=!!e.disabled_by,s=!!this._toggledEntries[e.entry_id],a=this._entryDevices[e.entry_id],n=!!this._entryDeviceLoading[e.entry_id];return H`
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
          <span class="entry-id" title="entry_id: ${e.entry_id}">${i}</span>
        </div>
        <div class="entry-actions" @click=${e=>e.stopPropagation()}>
          <!-- Enable/Disable toggle -->
          <button class="entry-btn ${r?"enable":"disable"}"
            @click=${t=>this._toggleDisabled(e,t)}
            title="${r?ge("enableEntry")||"启用":ge("disableEntry")||"禁用"}"
            ?disabled=${o}>
            ${r?H`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            `:H`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            `}
          </button>
          ${e.supports_options?H`
          <button class="entry-btn" @click=${t=>this._configureEntry(e,t)} title="${ge("configureEntry")}" ?disabled=${o}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          `:""}
          <button class="entry-btn reload" @click=${t=>this._reloadEntry(e,t)} title="${ge("reloadEntry")}" ?disabled=${o}>
            ${this._reloading[e.entry_id]?H`<span class="spinning">⋯</span>`:H`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            `}
          </button>
          <button class="entry-btn remove" @click=${t=>this._removeEntry(e,t)} title="${ge("removeEntry")}" ?disabled=${o}>
            ${this._removing[e.entry_id]?H`<span class="spinning">⋯</span>`:H`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            `}
          </button>
        </div>
      </div>
      <!-- Entry children: device tree -->
      ${s?H`
        <div class="entry-children">
          ${n?H`
            <div class="tree-loading"><div class="spinner-xs"></div><span>${ge("loading")}</span></div>
          `:a&&0!==a.length?a.map(t=>this._renderDeviceGroup(t,e)):H`
            <div class="tree-empty-msg">${ge("noDevicesOrEntities")||"无设备"}</div>
          `}
        </div>
      `:""}
    `}_renderDeviceGroup(e,t){const{area:o,devices:i}=e;return H`
      <div class="device-group">
        <div class="device-group-header">
          <span class="device-group-name">${o}</span>
          <span class="device-group-count">${i.length} ${ge("deviceCount")||"设备"}</span>
        </div>
        <div class="device-group-body">
          ${i.map(e=>this._renderDevice(e,t))}
        </div>
      </div>
    `}_renderDevice(e,t){const o=e.device_id||e.entity_id||e.name,i=!!this._toggledDevices[o],r=e.entities?e.entities.filter(e=>!e.disabled).length:0;return H`
      <div class="device-row ${i?"expanded":""}">
        <div class="device-header" @click=${()=>this._toggleDevice(o,t)}>
          <span class="device-arrow ${i?"open":""}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
          <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span class="device-name">${e.name}</span>
          ${e.model?H`<span class="device-model">${e.model}</span>`:""}
          <span class="device-ecount">${r} ${ge("entityCount")||"实体"}</span>
        </div>
        ${i&&e.entities?H`
          <div class="device-entities">
            ${e.entities.filter(e=>!e.disabled).map(e=>this._renderEntity(e))}
          </div>
        `:""}
      </div>
    `}_renderEntity(e){const t=this._canToggle(e);return H`
      <div class="entity-row ${t?"toggleable":""}"
        @click=${t?t=>this._toggleEntity(e,t):()=>this._openMoreInfo(e.entity_id)}>
        <span class="entity-icon">${this._entityIcon(e.domain,e.state)}</span>
        <span class="entity-name" title="${e.entity_id}">${e.name||e.entity_id.split(".").pop()}</span>
        <span class="entity-state" style="color:${this._stateColor(e.state)}">${this._formatState(e.state,e.domain,e.unit)}</span>
        ${t?H`
          <span class="entity-toggle ${"on"===e.state||"open"===e.state?"on":""}">
            ${this._toggling?.[e.entity_id]?H`<span class="spinning-xs">⟳</span>`:""}
          </span>
        `:H`
          <span class="entity-more">›</span>
        `}
      </div>
    `}_renderAddDialog(){if(!this._showAddDialog)return"";const e=this._filteredHandlers;return H`
      <div class="detail-overlay" role="dialog" aria-modal="true" aria-label="${ge("addHAIntegration")}" @click=${e=>{e.target===e.currentTarget&&this._closeAddDialog()}}>
        <div class="modal add-modal" @pointerdown=${this._modalPointerDown}>
          <div class="modal-header">
            <span class="modal-title">${ge("addHAIntegration")}</span>
            <button class="modal-close" aria-label="${ge("close")||"关闭"}" @click=${this._closeAddDialog}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-search">
            <input type="text" class="add-search-input"
              placeholder="${ge("searchIntegration")}"
              .value=${this._handlerSearch}
              @input=${e=>{this._handlerSearch=e.target.value}}
              @keydown=${e=>{"Escape"===e.key&&this._closeAddDialog()}} />
          </div>
          <div class="add-panel-count">${e.length} ${ge("integrationCount")}</div>
          <div class="modal-body">
            ${this._handlersLoading?H`
              <div class="dv-loading"><div class="spinner-sm"></div><div>${ge("loading")}</div></div>
            `:0===e.length?H`
              <div class="dv-empty">${ge("noIntegrationMatch")}</div>
            `:e.map(e=>H`
              <div class="add-item" @click=${()=>this._addIntegration(e.domain)}>
                ${this._renderAvatar(e.domain)}
                <span class="add-item-name">${this._translateDomain(e.domain)}</span>
                ${e.name&&e.name!==e.domain?H`<span class="add-item-domain">${e.domain}</span>`:""}
              </div>
            `)}
          </div>
        </div>
      </div>
    `}static styles=[me(),s`
    :host { display: block; touch-action: manipulation; }

    /* ===== Controls Bar (unified with store/management/updates) ===== */
    .controls {
      display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
    }
    .page-title { margin: 0; font-size: 20px; font-weight: 700; color: var(--primary-text-color); }
    .controls-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

    .action-btn {
      padding: 9px 18px; border-radius: 10px; font-size: 14px; font-weight: 600;
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

    /* ===== View Toggle ===== */
    .view-toggle {
      display: inline-flex; border: 1px solid var(--divider-color);
      border-radius: 8px; overflow: hidden; flex-shrink: 0;
    }
    .view-toggle-btn {
      padding: 6px 10px; border: none; background: var(--card-background-color);
      color: var(--secondary-text-color); cursor: pointer; font-size: 14px;
      transition: all 0.2s; min-width: 36px; min-height: 36px;
      display: flex; align-items: center; justify-content: center;
      touch-action: manipulation;
    }
    .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
    .view-toggle-btn.active { background: var(--primary-color); color: #fff; }
    .view-toggle-btn:hover:not(.active) { color: var(--primary-color); }

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
    .filter-chip .chip-count { font-size: 10px; opacity: 0.7; margin-left: 3px; }
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
    .list-action-btn.add:hover { border-color: #4caf50; color: #4caf50; }
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
    .empty-icon { font-size: 48px; margin-bottom: 12px; }
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

    /* ===== Card Footer Action Bar (always visible, like store) ===== */
    .card-footer {
      display: flex; justify-content: space-between; gap: 4px; padding: 8px 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: 8px; position: relative;
    }
    .footer-left { display: flex; align-items: stretch; gap: 4px; position: relative; }
    .footer-right { display: flex; align-items: stretch; gap: 4px; }
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
    .card-footer .footer-btn.add-entry:hover { border-color: #4caf50; color: #4caf50; }
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
    }
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
      .controls { flex-direction: column; align-items: flex-start; }
      .controls-right { width: 100%; }
      .search input { width: 100%; }
      .card-img { height: 100px; }
      .avatar { width: 44px; height: 44px; font-size: 20px; }
      .card-footer .footer-btn { min-height: 44px; font-size: 12px; }
      .card-footer .footer-btn .btn-label { display: inline; }
      .filter-chip { padding: 4px 8px; font-size: 10px; }
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
  `]}customElements.define("integrations-list",Zt);class Qt extends ae{static properties={hass:{type:Object},domain:{type:String},entryId:{type:String},configEntries:{type:Object},open:{type:Boolean,reflect:!0},_loading:{type:Boolean,state:!0},_flowId:{type:String,state:!0},_step:{type:Object,state:!0},_errors:{type:Object,state:!0},_finished:{type:Boolean,state:!0},_result:{type:Object,state:!0},_isOptions:{type:Boolean,state:!0},_isSubentry:{type:Boolean,state:!0},_subentryTypes:{type:Array,state:!0},_subentryType:{type:String,state:!0},_existingSubentries:{type:Array,state:!0},_isSubentryReconfigure:{type:Boolean,state:!0},_subentryReconfigureId:{type:String,state:!0}};constructor(){super(),this.domain="",this.entryId=null,this.configEntries=null,this.open=!1,this._loading=!1,this._flowId=null,this._step=null,this._errors={},this._finished=!1,this._result=null,this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this._loadingTimeout=null,this._translations=null,this._lang="zh-Hans",this._dialogDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1},this._cleanedUp=!1}_getHass(){if(this.hass)return this.hass;try{const e=window.parent?.document?.querySelector("home-assistant");return e?.hass||null}catch(e){return null}}disconnectedCallback(){super.disconnectedCallback(),this._clearLoadingTimeout(),this._cleanedUp=!0}_clearLoadingTimeout(){this._loadingTimeout&&(clearTimeout(this._loadingTimeout),this._loadingTimeout=null)}_startLoadingTimeout(){this._clearLoadingTimeout(),this._loadingTimeout=setTimeout(()=>{this._loading&&!this._finished&&(this._clearLoadingTimeout(),this._finished=!0,this._result={type:"error",message:ge("flowTimeout")},this._loading=!1,this.requestUpdate())},3e4)}connectedCallback(){super.connectedCallback()}_dialogPointerDown(e){const t=e.target.closest(".header");if(!t||e.target.closest("button"))return;if(void 0!==e.button&&0!==e.button)return;const o=this._dialogDrag,i=e.currentTarget;o.dragging=!0,o.startX=e.clientX-o.offsetX,o.startY=e.clientY-o.offsetY,i.style.transition="none",i.style.cursor="grabbing",t.style.userSelect="none",i.setPointerCapture(e.pointerId);const r=e=>{o.dragging&&(o.offsetX=e.clientX-o.startX,o.offsetY=e.clientY-o.startY,i.style.transform=`translate(${o.offsetX}px, ${o.offsetY}px)`)},s=e=>{o.dragging=!1,i.style.cursor="",t.style.userSelect="",i.removeEventListener("pointermove",r),i.removeEventListener("pointerup",s),i.removeEventListener("pointercancel",s);try{i.releasePointerCapture(e.pointerId)}catch(e){}};i.addEventListener("pointermove",r),i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)}updated(e){if(e.has("open")&&this.open)if(this.entryId){this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="";const e=this._findEntry(this.entryId);e&&e.supported_subentry_types&&e.supported_subentry_types.length>0?(this._isOptions=!0,this._subentryTypes=e.supported_subentry_types,this._loadExistingSubentries(),this._startFlow()):(this._isOptions=!0,this._startFlow())}else this.domain&&(this._isOptions=!1,this.entryId=null,this._startFlow())}openFlow(e){this.entryId=null,this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.domain=e,this.open=!0}openOptionsFlow(e){this.domain="",this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.entryId=e,this.open=!0}_findEntry(e){if(!this.configEntries||!e)return null;for(const t of Object.values(this.configEntries)){const o=t.find(t=>t.entry_id===e);if(o)return o}return null}async _loadExistingSubentries(){if(this.entryId)try{const e=await ce.getSubentries(this.entryId);this._existingSubentries=e?.subentries||[]}catch{this._existingSubentries=[]}}async _loadTranslations(e){if(!e)return;if(this._translations&&this._translations._domain===e)return;let t={};try{const o=await ce.getTranslations(e,this._lang),i=o?.data||{};t=this._deepMerge(t,i)}catch(e){}try{const o=this._getHass();if(o&&"function"==typeof o.loadBackendTranslation){let i;try{i=await o.loadBackendTranslation("config",e)}catch(t){try{i=await o.loadBackendTranslation(e,"config")}catch(o){console.warn(`HACS Vision: loadBackendTranslation failed for ${e}:`,t?.message||o?.message)}}i&&"object"==typeof i&&"object"==typeof i&&Object.keys(i).length>0&&(i=this._flatToNested(i),t=this._deepMerge(t,i),console.debug(`HACS Vision: loaded HA backend translations for ${e}:`,Object.keys(i).length,"keys"))}else console.warn("HACS Vision: hass.loadBackendTranslation is not available")}catch(t){console.warn(`HACS Vision: loadBackendTranslation error for ${e}:`,t)}if(this._isOptions)try{const o=this._getHass();if(o&&"function"==typeof o.loadBackendTranslation){let i;try{i=await o.loadBackendTranslation("options",e)}catch(t){try{i=await o.loadBackendTranslation(e,"options")}catch(e){}}i&&"object"==typeof i&&Object.keys(i).length>0&&(i=this._flatToNested(i),t=this._deepMerge(t,i))}}catch(e){}this._translations={_domain:e,_data:t}}_deepMerge(e,t){for(const o of Object.keys(t))t[o]&&"object"==typeof t[o]&&!Array.isArray(t[o])?(e[o]&&"object"==typeof e[o]||(e[o]={}),this._deepMerge(e[o],t[o])):e[o]=t[o];return e}_flatToNested(e){if(!e||"object"!=typeof e)return e;const t=Object.keys(e)[0];if(!t||!t.includes("."))return e;const o={};for(const[t,i]of Object.entries(e)){if("string"!=typeof i)continue;const e=t.split(".");let r=o;for(let t=0;t<e.length-1;t++)r[e[t]]&&"object"==typeof r[e[t]]||(r[e[t]]={}),r=r[e[t]];r[e[e.length-1]]=i}return o}_t(e){if(!this._translations?._data)return null;const t="component."+this._translations._domain+".",o=e.startsWith(t)?e.slice(t.length):e;let i=this._traverse(this._translations._data,o);return i||(o.startsWith("config.")&&(i=this._traverse(this._translations._data,"options."+o.slice(7)),i)?i:null)}_traverse(e,t){const o=t.split(".");let i=e;for(const e of o){if(null==i||"object"!=typeof i)return null;i=i[e]}return"string"==typeof i?i:null}async _startFlow(){if(this._isSubentry&&!this._subentryType&&!this._isSubentryReconfigure)return this._loading=!1,this._finished=!1,this._result=null,this._step=null,void this.requestUpdate();this._loading=!0,this._finished=!1,this._result=null,this._step=null,this._errors={},this.requestUpdate(),this._startLoadingTimeout();try{const e=this._isOptions||this._isSubentry?this._getFlowDomain():this.domain;let t;e&&await this._loadTranslations(e),t=this._isSubentryReconfigure&&this._subentryType&&this.entryId?await ce.startSubentryFlow(this.entryId,this._subentryType,{source:"reconfigure",subentry_id:this._subentryReconfigureId}):this._isSubentry&&this._subentryType&&this.entryId?await ce.startSubentryFlow(this.entryId,this._subentryType):this._isOptions&&this.entryId?await ce.startOptionsFlow(this.entryId):await ce.startConfigFlow(this.domain),await this._handleFlowResponse(t)}catch(e){console.error("HACS Vision: config flow start error:",e),this._clearLoadingTimeout(),this._finished=!0,this._result={type:"error",message:this._getFlowErrorMessage(e)},this._loading=!1,this.requestUpdate()}}async _handleFlowResponse(e){if("abort"===e.type)return this._finished=!0,this._result={type:"abort",reason:e.reason},this._loading=!1,void this.requestUpdate();if("create_entry"===e.type)return this._isOptions&&this._subentryTypes.length>0?(this._isOptions=!1,this._isSubentry=!0,this._subentryType="",this._flowId=null,this._step=null,this._errors={},this._loading=!1,void this.requestUpdate()):(this._finished=!0,this._result={type:"create_entry",title:e.title||this.domain||ge("flowDone")},this._loading=!1,void this.requestUpdate());if("already_in_progress"!==e.type){if("form"===e.type){this._flowId=e.flow_id||e.flowId,this._step=e,this._errors=e.errors||{};const t=this._getFlowDomain()||e.handler;return t&&await this._loadTranslations(t),this._loading=!1,void this.requestUpdate()}if("external"===e.type){this._finished=!0;const t=e.url||"";return this._result={type:"external",url:t,message:ge("flowExternalAuth")},this._loading=!1,void this.requestUpdate()}if("menu"===e.type)return this._flowId=e.flow_id||e.flowId,this._step=e,this._errors={},this._loading=!1,void this.requestUpdate();this._finished=!0,this._result={type:"unsupported",message:ge("flowUnknownType",{type:e.type})},this._loading=!1,this.requestUpdate()}else{this._flowId=e.flow_id||e.flowId,this._clearLoadingTimeout();try{const e=await(this._isOptions?ce.stepOptionsFlow(this._flowId,{}):ce.stepConfigFlow(this._flowId,{}));await this._handleFlowResponse(e)}catch(e){this._finished=!0,this._result={type:"error",message:this._getFlowErrorMessage(e)},this._loading=!1,this.requestUpdate()}}}async _submitStep(e){this._loading=!0,this._errors={},this.requestUpdate();try{let t;t=this._isSubentry&&this._flowId?await ce.stepSubentryFlow(this._flowId,e):this._isOptions&&this._step?await ce.stepOptionsFlow(this._flowId,e):await ce.stepConfigFlow(this._flowId,e),this._handleFlowResponse(t)}catch(e){console.error("HACS Vision: flow step error:",e),this._errors={base:e.message||ge("flowSubmitFailed")},this._loading=!1,this.requestUpdate()}}_handleSubmit(e){e.preventDefault();const t=e.target,o={},i={};for(const e of t.elements)"checkbox"===e.type&&e.name&&(i[e.name]=(i[e.name]||0)+1);for(const e of t.elements)e.name&&"submit"!==e.type&&"button"!==e.type&&("checkbox"===e.type?i[e.name]>1?(Array.isArray(o[e.name])||(o[e.name]=[]),e.checked&&o[e.name].push(e.value)):o[e.name]=e.checked:void 0!==e.value&&null!==e.value&&(o[e.name]=void 0===e.valueAsNumber||isNaN(e.valueAsNumber)||"number"!==e.type?e.value:e.valueAsNumber));this._submitStep(o)}_handleMenuSelect(e){this._submitStep({next_step_id:e})}_onMultiCheckboxChange(e){this.requestUpdate()}_handleSubentrySelect(e){this._subentryType=e,this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this._startFlow()}_handleExistingSubentrySelect(e){this._subentryType=e.subentry_type,this._isSubentryReconfigure=!0,this._subentryReconfigureId=e.subentry_id,this._subentryType=e.subentry_type,this._startFlow()}_cancelFlow(){const e=this.shadowRoot?.querySelector(".dialog");e&&(e.style.transform=""),this._dialogDrag={offsetX:0,offsetY:0,startX:0,startY:0,dragging:!1},this._flowId&&(this._isSubentry?ce.cancelSubentryFlow(this._flowId).catch(()=>{}):ce.cancelConfigFlow(this._flowId).catch(()=>{})),this._close()}_close(){try{this._clearLoadingTimeout(),this.open=!1,this._flowId=null,this._step=null,this._finished=!1,this._result=null,this._errors={},this._isOptions=!1,this._isSubentry=!1,this._subentryTypes=[],this._subentryType="",this._existingSubentries=[],this._isSubentryReconfigure=!1,this._subentryReconfigureId="",this.domain="",this.entryId=null,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}catch(e){console.error("HACS Vision: config flow close error:",e),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}}static styles=[me(),s`
    :host { display: block; }
    :host([open]) {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9999;
      pointer-events: none;
    }
    .overlay {
      position: fixed; inset: 0;
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
  `];render(){if(!this.open)return"";const e=this._isSubentry?(this._getFlowDomain()||"")+" - "+ge("subentryTitle"):this._isOptions?this._getFlowDomain()||ge("flowTitleOptions"):this._step?.title||this._localizeTitle()||this._step?.handler||this.domain||ge("flowTitle");return H`
      <div class="overlay" role="dialog" aria-modal="true" aria-label="${this._flowTitle||ge("flowTitle")}" @keydown=${e=>{"Escape"===e.key&&this._cancelFlow()}} @click=${e=>{e.target===e.currentTarget&&this._cancelFlow()}}>
        <div class="dialog" @pointerdown=${this._dialogPointerDown}>
          <div class="header">
            <div class="header-left">
              ${this.domain?H`
                <div class="cfg-avatar">
                  <img class="cfg-avatar-img" src="https://brands.home-assistant.io/${this.domain}/icon.png" alt=""
                    @error=${function(){try{if(!this.parentElement)return;this.style.display="none";const e=this.parentElement.querySelector(".cfg-avatar-letter");e&&(e.style.display="flex")}catch(e){}}}>
                  <span class="cfg-avatar-letter" style="display:none">${this.domain.charAt(0).toUpperCase()}</span>
                </div>
              `:""}
              <span class="title">${e}</span>
            </div>
            <button class="close-btn" aria-label="${ge("close")}" @click=${this._cancelFlow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          ${this._loading?H`
            <div class="loading">
              <div class="spinner"></div>
              <div>${ge("flowProcessing")}</div>
            </div>
          `:""}

          ${this._finished&&this._result?this._renderResult():""}

          ${this._loading||this._finished||!this._step?"":this._renderStep()}

          ${this._loading||this._finished||this._step||this._result||!this._isSubentry||this._subentryType?"":H`
            <div class="subentry-list">
              <div class="subentry-columns">
              ${this._existingSubentries.length>0?H`
                <div class="subentry-col">
                  <div class="step-desc" style="margin-bottom:8px;font-weight:600;">${ge("subentryExisting")}</div>
                  ${this._existingSubentries.map(e=>H`
                    <div class="menu-option" @click=${()=>this._handleExistingSubentrySelect(e)}>
                      <span class="menu-icon">⚙</span>
                      <div class="menu-label-group">
                        <span class="menu-label">${e.title||this._getSubentryTypeLabel(e.subentry_type)}</span>
                        <span class="menu-sublabel">${this._getSubentryTypeLabel(e.subentry_type)}</span>
                      </div>
                      <span class="menu-arrow">${ge("subentryReconfigure")}</span>
                    </div>
                  `)}
                </div>
              `:""}

                <div class="subentry-col">
                  <div class="step-desc" style="margin-bottom:8px;font-weight:600;">${ge("subentryAddNew")}</div>
                  ${this._subentryTypes.map(e=>H`
                    <div class="menu-option" @click=${()=>this._handleSubentrySelect(e)}>
                      <span class="menu-icon">+</span>
                      <span class="menu-label">${ge("subentryAddPrefix")} ${this._getSubentryTypeLabel(e)}</span>
                      <span class="menu-arrow">→</span>
                    </div>
                  `)}
                </div>
              </div>
              <div class="actions" style="margin-top:16px">
                <button class="btn" @click=${this._cancelFlow}>${ge("flowCancel")}</button>
              </div>
            </div>
          `}

          ${this._loading||this._finished||this._step||this._result||this._isSubentry&&!this._subentryType?"":H`
            <div class="loading">
              <div class="spinner"></div>
              <div>${ge("flowStarting")}</div>
            </div>
          `}
        </div>
      </div>
    `}_renderStep(){const e=this._step;return e?"menu"===e.type?this._renderMenu(e):"form"===e.type?this._renderForm(e):H`<div class="result error"><div class="result-title">${ge("flowResultFailed")}: ${e.type}</div></div>`:""}_renderMenu(e){const t=this._buildDescription(e),o=e.menu_options||[];return H`
      ${t?H`<div class="step-desc">${t}</div>`:""}
      <div class="menu-list">
        ${o.map((t,o)=>{const i="string"==typeof t,r=i?t:t.value||"",s=this._t(`component.${this._getFlowDomain()}.config.step.${e.step_id}.menu_options.${r}`)||this._isOptions&&this._t(`component.${this._getFlowDomain()}.options.step.${e.step_id}.menu_options.${r}`)||(i?t:t.label||t.title||t.value||""),a=i?"":t.description||"";return H`
            <div class="menu-option" @click=${()=>this._handleMenuSelect(r)}>
              <span class="menu-label">${s}</span>
              ${a?H`<span class="menu-desc">${a}</span>`:""}
              <span class="menu-arrow">→</span>
            </div>
          `})}
      </div>
      <div class="actions">
        <button class="btn" @click=${this._cancelFlow}>${ge("flowCancel")}</button>
      </div>
    `}_renderForm(e){const t=this._buildDescription(e),o=e.data_schema||[],i=this._errors?.base||"";return H`
      ${t?H`<div class="step-desc">${t}</div>`:""}
      ${i?H`<div class="form-error" style="margin-bottom:12px">${i}</div>`:""}
      <form @submit=${this._handleSubmit}>
        ${o.map(e=>this._renderField(e))}
        <div class="actions">
          <button type="button" class="btn" @click=${this._cancelFlow}>${ge("flowCancel")}</button>
          <button type="submit" class="btn primary" ?disabled=${this._loading}>
            ${this._loading?ge("flowProcessing"):e.last_step?ge("flowStepFinish"):ge("flowStepNext")}
          </button>
        </div>
      </form>
    `}_buildDescription(e){let t=e.description||e.description_placeholders?.description||"";if(t&&t.includes(".")){const e=this._t(t)||null;e&&(t=e)}if(!t){const e=this._translateField("description");e&&(t=e)}const o=e.description_placeholders||{};for(const[e,i]of Object.entries(o)){const o=null!=i&&"object"!=typeof i?String(i):"";t=t.replace(new RegExp(`\\{${e}\\}`,"g"),o)}if(!t&&Object.keys(o).length>0){const e=Object.entries(o).map(([,e])=>null!=e&&"object"!=typeof e?String(e):"").filter(Boolean);t=e.join("\n")}return t}_getFlowDomain(){if(this.domain)return this.domain;if(this.entryId&&this.configEntries)for(const e of Object.values(this.configEntries))for(const t of e)if(t.entry_id===this.entryId)return t.domain||"";const e=this._step?.handler;return e&&!/^[0-9A-Z]{20,}$/.test(e)?e:""}_getSubentryTypeLabel(e){const t={conversation:"subentryConversation",tts:"subentryTts",stt:"subentryStt",translation:"subentryTranslation",ai_task_data:"subentryAiTaskData",device:"subentryDevice",wecom:"subentryWecom",wechat:"subentryWechat",qq:"subentryQq",feishu:"subentryFeishu",dingtalk:"subentryDingtalk",xiaoyi:"subentryXiaoyi",custom:"subentryCustom"}[e];return t?ge(t):e}_localizeTitle(){const e=this._getFlowDomain(),t=this._step?.step_id;if(e&&t){const e=this._translateField("title");if(e)return e}if(e){const t=`component.${e}.title`,o=this._t(t);if(o)return o}return""}_translateField(e){const t=this._getFlowDomain(),o=this._step?.step_id;if(!t||!o)return null;if(this._isSubentry&&this._subentryType){const i=`component.${t}.config_subentries.${this._subentryType}.step.${o}.${e}`,r=this._t(i);if(r)return r}const i=`component.${t}.config.step.${o}.${e}`;return this._t(i)}_getFieldLabel(e){const t=this._translateField(`data.${e.name}`);return t||(e.label||this._friendlyName(e.name))}_friendlyName(e){return e.replace(/_/g," ").replace(/(^|\s)\w/g,e=>e.toUpperCase()).replace(/Id\b/gi,"ID").replace(/Ip\b/gi,"IP").replace(/Url\b/gi,"URL").replace(/Api\b/gi,"API")}_getFieldDescription(e){const t=this._translateField(`data.${e.name}.description`);if(t)return t;const o=e.description;return"string"==typeof o?o:""}_getFieldPlaceholder(e){const t=this._translateField(`data.${e.name}.placeholder`);return t||(e.placeholder||"")}_getOptionLabel(e,t){const o=this._translateField(`data.${e.name}.options.${t}`);return o||null}_getFlowErrorMessage(e){const t=e?.message||"";return t.includes("404")?this._isSubentry?this._getSubentryTypeLabel(this._subentryType)+" "+ge("flowHandlerNotFound"):this._isOptions?ge("flowOptionsNotSupported"):ge("flowHandlerNotFound"):t.includes("500")&&this._isOptions?ge("flowOptionsNotSupported"):t.includes("401")||t.includes("403")?ge("flowAuthError"):t||(this._isOptions?ge("flowStartFailedOptions"):ge("flowStartFailed"))}_renderField(e){const t=e.name,o=this._getFieldLabel(e),i=e.type||"string",r=!1!==e.required,s=e.description?.suggested_value,a=void 0!==e.default&&null!==e.default||null!=s,n=void 0!==e.default&&null!==e.default?e.default:void 0!==s?s:"",l=this._getFieldPlaceholder(e),c=this._getFieldDescription(e),d=this._errors?.[t]||"",p=!0===e.multiline,h=!0===e.password||"password"===e.type||/token|secret|password|key|api_key|apiKey/i.test(t)&&"string"===i,g=e.selector||{},u=Object.keys(g)[0];if("select"===i||"multi_select"===i||e.options||e.enum||"select"===u){let s=e.options||e.enum||[];!s.length&&g.select?.options&&(s=g.select.options);const l="multi_select"===i||!0===g.select?.multiple;s.length?console.debug(`HACS Vision: select field "${t}" options:`,JSON.stringify(s).slice(0,200)):console.warn(`HACS Vision: select field "${t}" has empty options`,e);let p=[];return Array.isArray(s)?p=s:s&&"object"==typeof s&&(p=Object.entries(s).map(([e,t])=>({value:e,label:t}))),p=p.filter(Boolean).map(e=>{if("string"==typeof e)return{value:e,label:e};if(Array.isArray(e))return{value:e[0],label:e[1]||e[0]};if(e&&"object"==typeof e){const t=e.value??e.val??e.id??Object.values(e)[0]??"",o=e.label??e.name??e.description??Object.values(e)[1]??t;return{value:String(t),label:String(o)}}return{value:String(e),label:String(e)}}),H`
        <div class="form-field">
          <label>${o}${r?" *":""}</label>
          ${c?H`<div class="field-desc">${c}</div>`:""}
          ${l?H`
            <!-- multi_select: render as checkboxes instead of multi-select dropdown -->
            <div class="multi-select-checkboxes">
              ${p.map(o=>{const i=this._getOptionLabel(e,o.value)||o.label,r=a&&(Array.isArray(n)?n.includes(o.value):n===o.value);return H`
                  <label class="checkbox-label multi-option">
                    <input type="checkbox" name=${t} value=${o.value}
                           ?checked=${r} @change=${this._onMultiCheckboxChange}>
                    <span>${i}</span>
                  </label>
                `})}
            </div>
          `:H`
            <select name=${t} ?required=${r}>
              ${r?"":H`<option value="">${ge("flowSelectOption")}</option>`}
              ${p.map(t=>{const o=this._getOptionLabel(e,t.value)||t.label,i=a&&n===t.value;return H`<option value=${t.value} ?selected=${i}>${o}</option>`})}
            </select>
          `}
          ${d?H`<div class="form-error">${d}</div>`:""}
        </div>
      `}if("boolean"===i||"boolean"===u){if("back"===t&&!r)return H`
          <div class="form-field">
            <button type="button" class="btn" @click=${this._cancelFlow}>${ge("flowBack")}</button>
          </div>
        `;return H`
        <div class="form-field">
          <label class="checkbox-label">
            <input type="checkbox" name=${t} ?checked=${!0===n||"true"===n||1===n||"1"===n}>
            <span>${o!==e.name.replace(/_/g," ")?o:c||o}</span>
          </label>
          ${d?H`<div class="form-error">${d}</div>`:""}
        </div>
      `}if("integer"===i||"number"===i||"number"===u||"integer"===u){const s=g.number?.step||("integer"===i?1:"any"),a=g.number?.min??e.valueMin??e.minimum??"",p=g.number?.max??e.valueMax??e.maximum??"";return H`
        <div class="form-field">
          <label>${o}${r?" *":""}</label>
          ${c?H`<div class="field-desc">${c}</div>`:""}
          <input type="number" name=${t} .value=${n}
                 ?required=${r} placeholder=${l}
                 step=${s} min=${a??""} max=${p??""}>
          ${d?H`<div class="form-error">${d}</div>`:""}
        </div>
      `}return p||"text"===u&&g.text?.multiline?H`
        <div class="form-field">
          <label>${o}${r?" *":""}</label>
          ${c?H`<div class="field-desc">${c}</div>`:""}
          <textarea name=${t} .value=${n}
                    ?required=${r} placeholder=${l}></textarea>
          ${d?H`<div class="form-error">${d}</div>`:""}
        </div>
      `:H`
      <div class="form-field">
        <label>${o}${r?" *":""}</label>
        ${c&&c!==l?H`<div class="field-desc">${c}</div>`:""}
        <input type=${h?"password":"text"} name=${t}
               .value=${n} ?required=${r} placeholder=${l}>
        ${d?H`<div class="form-error">${d}</div>`:""}
      </div>
    `}_renderResult(){if(!this._result)return"";const e=this._result;if("create_entry"===e.type)return H`
        <div class="result">
          <svg class="result-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div class="result-title">${ge("flowResultCreated")}</div>
          <div class="result-desc">${e.title||ge("flowResultCreatedDesc")}</div>
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${ge("flowDone")}</button>
          </div>
        </div>
      `;if("abort"===e.type){const t={already_configured:ge("flowAbortAlreadyConfigured"),single_instance_allowed:ge("flowAbortSingleInstance"),no_devices_found:ge("flowAbortNoDevices"),already_in_progress:ge("flowAbortInProgress")};return H`
        <div class="result">
          <svg class="result-icon abort" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div class="result-title">${ge("flowResultAborted")}</div>
          <div class="result-desc">${t[e.reason]||e.reason||ge("flowResultAbortedDesc")}</div>
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${ge("flowGotIt")}</button>
          </div>
        </div>
      `}return"external"===e.type?H`
        <div class="result">
          <svg class="result-icon external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <div class="result-title">${ge("flowResultExternal")}</div>
          <div class="result-desc">${e.message||ge("flowResultExternalDesc")}</div>
          ${e.url?H`<a href=${e.url} target="_blank" class="btn external">${ge("flowOpenAuthPage")}</a>`:""}
          <div class="actions">
            <button class="btn primary" @click=${this._close}>${ge("flowClose")}</button>
          </div>
        </div>
      `:H`
      <div class="result">
        <svg class="result-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <div class="result-title">${ge("flowResultFailed")}</div>
        <div class="result-desc">${e.message||ge("flowResultFailedDesc")}</div>
        <div class="actions">
          <button class="btn primary" @click=${this._close}>${ge("flowClose")}</button>
        </div>
      </div>
    `}}customElements.define("config-flow-dialog",Qt),customElements.define("hacs-vision-panel",Tt)}();
