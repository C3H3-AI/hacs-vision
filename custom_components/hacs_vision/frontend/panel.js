!function(){"use strict";
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),a=new WeakMap;let i=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const o=this.t;if(t&&void 0===e){const t=void 0!==o&&1===o.length;t&&(e=a.get(o)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&a.set(o,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,o,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[a+1],e[0]);return new i(a,e,o)},s=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new i("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:h}=Object,u=globalThis,g=u.trustedTypes,m=g?g.emptyScript:"",f=u.reactiveElementPolyfillSupport,v=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},b=(e,t)=>!n(e,t),y={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:b};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),a=this.getPropertyDescriptor(e,o,t);void 0!==a&&l(this.prototype,e,a)}}static getPropertyDescriptor(e,t,o){const{get:a,set:i}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);i?.call(this,t),this.requestUpdate(e,r,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...d(e),...p(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const o=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((o,a)=>{if(t)o.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of a){const a=document.createElement("style"),i=e.litNonce;void 0!==i&&a.setAttribute("nonce",i),a.textContent=t.cssText,o.appendChild(a)}})(o,this.constructor.elementStyles),o}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,o);if(void 0!==a&&!0===o.reflect){const i=(void 0!==o.converter?.toAttribute?o.converter:x).toAttribute(t,o.type);this._$Em=e,null==i?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(e,t){const o=this.constructor,a=o._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=o.getPropertyOptions(a),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=a;const r=i.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,o,a=!1,i){if(void 0!==e){const r=this.constructor;if(!1===a&&(i=this[e]),o??=r.getPropertyOptions(e),!((o.hasChanged??b)(i,t)||o.useDefault&&o.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:a,wrapped:i},r){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==i||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,o,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[v("elementProperties")]=new Map,_[v("finalized")]=new Map,f?.({ReactiveElement:_}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const w=globalThis,$=e=>e,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+z,R=`<${C}>`,T=document,E=()=>T.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,L=Array.isArray,N="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,O=/>/g,U=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...o)=>({_$litType$:e,strings:t,values:o}))(1),j=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,W=T.createTreeWalker(T,129);function q(e,t){if(!L(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Y=(e,t)=>{const o=e.length-1,a=[];let i,r=2===t?"<svg>":3===t?"<math>":"",s=I;for(let t=0;t<o;t++){const o=e[t];let n,l,c=-1,d=0;for(;d<o.length&&(s.lastIndex=d,l=s.exec(o),null!==l);)d=s.lastIndex,s===I?"!--"===l[1]?s=M:void 0!==l[1]?s=O:void 0!==l[2]?(F.test(l[2])&&(i=RegExp("</"+l[2],"g")),s=U):void 0!==l[3]&&(s=U):s===U?">"===l[0]?(s=i??I,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,n=l[1],s=void 0===l[3]?U:'"'===l[3]?B:P):s===B||s===P?s=U:s===M||s===O?s=I:(s=U,i=void 0);const p=s===U&&e[t+1].startsWith("/>")?" ":"";r+=s===I?o+R:c>=0?(a.push(n),o.slice(0,c)+S+o.slice(c)+z+p):o+z+(-2===c?t:p)}return[q(e,r+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class J{constructor({strings:e,_$litType$:t},o){let a;this.parts=[];let i=0,r=0;const s=e.length-1,n=this.parts,[l,c]=Y(e,t);if(this.el=J.createElement(l,o),W.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=W.nextNode())&&n.length<s;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(S)){const t=c[r++],o=a.getAttribute(e).split(z),s=/([.?@])?(.*)/.exec(t);n.push({type:1,index:i,name:s[2],strings:o,ctor:"."===s[1]?ee:"?"===s[1]?te:"@"===s[1]?oe:Q}),a.removeAttribute(e)}else e.startsWith(z)&&(n.push({type:6,index:i}),a.removeAttribute(e));if(F.test(a.tagName)){const e=a.textContent.split(z),t=e.length-1;if(t>0){a.textContent=k?k.emptyScript:"";for(let o=0;o<t;o++)a.append(e[o],E()),W.nextNode(),n.push({type:2,index:++i});a.append(e[t],E())}}}else if(8===a.nodeType)if(a.data===C)n.push({type:2,index:i});else{let e=-1;for(;-1!==(e=a.data.indexOf(z,e+1));)n.push({type:7,index:i}),e+=z.length-1}i++}}static createElement(e,t){const o=T.createElement("template");return o.innerHTML=e,o}}function X(e,t,o=e,a){if(t===j)return t;let i=void 0!==a?o._$Co?.[a]:o._$Cl;const r=D(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),void 0===r?i=void 0:(i=new r(e),i._$AT(e,o,a)),void 0!==a?(o._$Co??=[])[a]=i:o._$Cl=i),void 0!==i&&(t=X(e,i._$AS(e,t.values),i,a)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,a=(e?.creationScope??T).importNode(t,!0);W.currentNode=a;let i=W.nextNode(),r=0,s=0,n=o[0];for(;void 0!==n;){if(r===n.index){let t;2===n.type?t=new Z(i,i.nextSibling,this,e):1===n.type?t=new n.ctor(i,n.name,n.strings,this,e):6===n.type&&(t=new ae(i,this,e)),this._$AV.push(t),n=o[++s]}r!==n?.index&&(i=W.nextNode(),r++)}return W.currentNode=T,a}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,a){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),D(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>L(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,a="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=J.createElement(q(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new K(a,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new J(e)),t}k(e){L(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,a=0;for(const i of e)a===t.length?t.push(o=new Z(this.O(E()),this.O(E()),this,this.options)):o=t[a],o._$AI(i),a++;a<t.length&&(this._$AR(o&&o._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,a,i){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=i,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(e,t=this,o,a){const i=this.strings;let r=!1;if(void 0===i)e=X(this,e,t,0),r=!D(e)||e!==this._$AH&&e!==j,r&&(this._$AH=e);else{const a=e;let s,n;for(e=i[0],s=0;s<i.length-1;s++)n=X(this,a[o+s],t,s),n===j&&(n=this._$AH[s]),r||=!D(n)||n!==this._$AH[s],n===V?e=V:e!==V&&(e+=(n??"")+i[s+1]),this._$AH[s]=n}r&&!a&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class te extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class oe extends Q{constructor(e,t,o,a,i){super(e,t,o,a,i),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??V)===j)return;const o=this._$AH,a=e===V&&o!==V||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==V&&(o===V||a);a&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ie=w.litHtmlPolyfillSupport;ie?.(J,Z),(w.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */let se=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const a=o?.renderBefore??t;let i=a._$litPart$;if(void 0===i){const e=o?.renderBefore??null;a._$litPart$=i=new Z(t.insertBefore(E(),e),e,void 0,o??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}};se._$litElement$=!0,se.finalized=!0,re.litElementHydrateSupport?.({LitElement:se});const ne=re.litElementPolyfillSupport;ne?.({LitElement:se}),(re.litElementVersions??=[]).push("4.2.2");const le="/api/hacs_vision";const ce=new class{constructor(){this._token=null,this._hassRef=null}setHass(e){this._hassRef=e;try{e?.auth?.data?.access_token?this._token=e.auth.data.access_token:e?.authToken?this._token=e.authToken:e?.connection?.accessToken?this._token=e.connection.accessToken:e?.config?.authToken&&(this._token=e.config.authToken)}catch(e){}}_getHeaders(){const e={"Content-Type":"application/json"};if(!this._token)try{this._hassRef?.auth?.data?.access_token&&(this._token=this._hassRef.auth.data.access_token)}catch(e){}if(!this._token)try{const e=window.parent?.document;if(e){const t=e.querySelector("home-assistant"),o=t?.hass;o?.auth?.data?.access_token&&(this._token=o.auth.data.access_token)}}catch(e){}if(!this._token)try{const e=document.querySelector("home-assistant"),t=e?.hass;t?.auth?.data?.access_token&&(this._token=t.auth.data.access_token)}catch(e){}return this._token&&(e.Authorization=`Bearer ${this._token}`),e}async request(e,t,o){const a={method:e,headers:this._getHeaders(),credentials:"include"};o&&(a.body=JSON.stringify(o));try{const e=await fetch(`${le}/${t}`,a);if(!e.ok){const t=new Error(`API error: ${e.status}`);throw t.status=e.status,this._onNetworkStatus&&(429===e.status?this._onNetworkStatus("rate_limited"):e.status>=500&&this._onNetworkStatus("server_error")),t}return this._onNetworkStatus&&this._onNetworkStatus("online"),e.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}get(e){return this.request("GET",e)}post(e,t){return this.request("POST",e,t)}delete(e,t){return this.request("DELETE",e,t)}listRepositories(e={}){const t=new URLSearchParams;return e.search&&t.set("search",e.search),e.category&&t.set("category",e.category),e.sort&&t.set("sort",e.sort),e.sortDir&&t.set("sortDir",e.sortDir),e.status&&t.set("status",e.status),e.page&&t.set("page",String(e.page)),e.limit&&t.set("limit",String(e.limit)),this.get(`repositories?${t}`)}getRepository(e){return this.get(`repositories/${e}`)}getInstalled(){return this.get("installed")}getStats(){return this.get("installed/stats")}getUpdates(){return this.get("updates")}install(e,t){return this.post("install",{repository:e,category:t})}update(e){return this.post("update",{repository_ids:e})}remove(e){return this.post("remove",{repository:e})}getConfig(){return this.get("config")}updateConfig(e){return this.post("config",e)}getCustomRepos(){return this.get("config/custom")}addCustomRepo(e,t){return this.post("config/custom",{repository:e,category:t})}removeCustomRepo(e){return this.delete("config/custom",{repository:e})}removeArchivedRepo(e){return this.post("management/remove_archived",{repository:e})}removeRenamedRepo(e){return this.post("management/remove_renamed",{old_name:e})}replaceRenamedRepo(e,t){return this.post("management/replace_renamed",{old_name:e,new_name:t})}exportBackup(){return this.get("backup/export")}importBackup(e){return this.post("backup/import",e)}checkDependencies(){return this.get("dependencies")}refresh(){return this.post("refresh")}restartHA(){return this.post("restart")}getRepoStatus(e){return this.get(`repos/status/${encodeURIComponent(e)}`)}getFavorites(){return this.get("favorites")}setFavorites(e){return this.post("favorites",{favorites:e})}getRepoReleases(e){return this._fetch(`/repos/releases?id=${encodeURIComponent(e)}`)}installVersion(e,t){return this._post("/repos/install_version",{id:e,version:t})}async _fetch(e){const t={method:"GET",headers:this._getHeaders(),credentials:"include"};try{const o=await fetch(`${le}${e}`,t);if(!o.ok){const e=new Error(`API error: ${o.status}`);throw e.status=o.status,e}return o.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}async _post(e,t){const o={method:"POST",headers:this._getHeaders(),credentials:"include",body:JSON.stringify(t)};try{const t=await fetch(`${le}${e}`,o);if(!t.ok){const e=new Error(`API error: ${t.status}`);throw e.status=t.status,this._onNetworkStatus&&(429===t.status?this._onNetworkStatus("rate_limited"):t.status>=500&&this._onNetworkStatus("server_error")),e}return this._onNetworkStatus&&this._onNetworkStatus("online"),t.json()}catch(e){throw!navigator.onLine&&this._onNetworkStatus&&this._onNetworkStatus("offline"),e}}async getChangelog(e){const t=`hacs_changelog_${e}`;try{const e=localStorage.getItem(t);if(e){const{data:t,timestamp:o}=JSON.parse(e);if(Date.now()-o<36e5)return t}}catch(e){}try{const o=await this.get(`changelog/${e}`);try{localStorage.setItem(t,JSON.stringify({data:o,timestamp:Date.now()}))}catch(e){}return o}catch(e){return console.error("Changelog fetch failed:",e),null}}async getReadme(e){const t=`hacs_readme_${e}`;try{const e=localStorage.getItem(t);if(e){const{html:t,timestamp:o}=JSON.parse(e);if(Date.now()-o<36e5)return t}}catch(e){}try{const o=await fetch(`${le}/readme/${e}`,{headers:this._getHeaders(),credentials:"include"});if(o.ok){const e=await o.text();try{localStorage.setItem(t,JSON.stringify({html:e,timestamp:Date.now()}))}catch(e){}return e}return null}catch(e){return console.error("Failed to fetch README:",e),null}}},de=e=>class extends e{static properties={_themeReady:{type:Boolean,state:!0}};constructor(){super(),this._themeReady=!1}connectedCallback(){super.connectedCallback(),requestAnimationFrame(()=>{this._applyTheme(),this._themeReady=!0}),this._setupThemeObserver()}disconnectedCallback(){super.disconnectedCallback?.(),this._themeObserver&&(this._themeObserver.disconnect(),this._themeObserver=null)}_getHAVar(e,t=""){try{const t=document.querySelector("home-assistant")?.shadowRoot||document.querySelector("ha-app")?.shadowRoot||document.documentElement,o=[this.renderRoot?.host,t,document.documentElement,document.body];for(const t of o)if(t)try{const o=getComputedStyle(t).getPropertyValue(e).trim();if(o)return o}catch(e){}try{if(window.parent&&window.parent!==window){const t=window.parent.document.querySelector("home-assistant")?.shadowRoot||window.parent.document.documentElement;if(t){const o=getComputedStyle(t).getPropertyValue(e).trim();if(o)return o}}}catch(e){}}catch(e){}return t}_applyTheme(){const e=this.renderRoot?.host||this,t=this._isDarkMode(),o={"--primary-background-color":t?"#111111":"#f5f5f5","--secondary-background-color":t?"#1c1c1c":"#e0e0e0","--primary-text-color":t?"#e1e1e1":"#212121","--secondary-text-color":t?"#9e9e9e":"#727272","--card-background-color":t?"#1c1c1c":"#ffffff","--divider-color":t?"#333333":"#e0e0e0","--primary-color":"#03a9f4","--rgb-primary-color":"3, 169, 244","--ha-card-border-radius":"12px"};for(const[t,a]of Object.entries(o)){const o=this._getHAVar(t);if(e.style.setProperty(t,o||a),"--primary-color"===t&&!o){const t=this._hexToRgb(a);t&&e.style.setProperty("--rgb-primary-color",t)}}const a=e.style.getPropertyValue("--primary-color").trim()||o["--primary-color"],i=this._getHAVar("--rgb-primary-color")||this._hexToRgb(a)||"3, 169, 244";e.style.setProperty("--rgb-primary-color",i)}_isDarkMode(){try{const e=this._getHAVar("--primary-background-color");if(e){const t=e.replace("#","").toLowerCase();if(/^[0-3]/.test(t))return!0;const o=e.match(/rgba?\((\d+)/);if(o&&parseInt(o[1])<80)return!0;if(e.includes("#111")||e.includes("#1c1c"))return!0}const t=document.body?.getAttribute("data-theme");if(t&&t.includes("dark"))return!0}catch(e){}try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return!1}}_hexToRgb(e){const t=e.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(t)return`${t[1]}, ${t[2]}, ${t[3]}`;if(3===(e=e.replace(/^#/,"")).length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),6!==e.length)return null;const o=parseInt(e.substring(0,2),16),a=parseInt(e.substring(2,4),16),i=parseInt(e.substring(4,6),16);return isNaN(o+a+i)?null:`${o}, ${a}, ${i}`}_setupThemeObserver(){try{const e=document.querySelector("home-assistant")||document.querySelector("ha-app")||document.documentElement;e&&(this._themeObserver=new MutationObserver(()=>{this._themeObserver?._debounce||(this._themeObserver._debounce=!0,setTimeout(()=>{this._themeObserver&&(this._themeObserver._debounce=!1),this._applyTheme()},200))}),this._themeObserver.observe(e,{attributes:!0,attributeFilter:["class","style"],subtree:!0}))}catch(e){}}},pe=(()=>{try{const e=window.top||window.parent,t=e?.document?.querySelector("home-assistant");if(t?.hass?.language)return 0===t.hass.language.indexOf("zh")?"zh":"en";return 0===(e?.document?.documentElement?.lang||"").indexOf("zh")?"zh":"en"}catch(e){}try{return 0===navigator.language?.indexOf("zh")?"zh":"en"}catch(e){return"en"}})(),he={storeTitle:{zh:"HACS Vision",en:"HACS Vision"},storeSubtitle:{zh:"浏览、管理和更新 HACS 仓库",en:"Browse, manage and update HACS repositories"},statInstalled:{zh:"已安装",en:"Installed"},statUpdates:{zh:"可更新",en:"Updates"},statFavorites:{zh:"收藏",en:"Favorites"},statCustom:{zh:"自定义",en:"Custom"},statRepos:{zh:"仓库数",en:"Repos"},tabBrowse:{zh:"商店",en:"Store"},tabFavorites:{zh:"收藏",en:"Favorites"},tabCustom:{zh:"自定义",en:"Custom"},tabInstalled:{zh:"已安装",en:"Installed"},tabUpdates:{zh:"更新",en:"Updates"},tabConfig:{zh:"配置",en:"Config"},tabBackup:{zh:"备份",en:"Backup"},tabManagement:{zh:"仓库管理",en:"Repository"},searchPlaceholder:{zh:"搜索仓库...",en:"Search repositories..."},searchInstalled:{zh:"搜索已安装...",en:"Search installed..."},searchUpdates:{zh:"搜索可更新的仓库...",en:"Search for updates..."},filterStatus:{zh:"状态",en:"Status"},filterType:{zh:"类型",en:"Type"},statusAll:{zh:"全部",en:"All"},statusInstalled:{zh:"已安装",en:"Installed"},statusNotInstalled:{zh:"未安装",en:"Not Installed"},statusUpdateAvailable:{zh:"可更新",en:"Update Available"},statusFavorites:{zh:"已收藏",en:"Favorited"},statusNew:{zh:"新发现",en:"New"},statusCustom:{zh:"自定义",en:"Custom"},statusPendingRestart:{zh:"待重启",en:"Pending Restart"},statusPendingUpgrade:{zh:"可更新",en:"Update Available"},statusDefault:{zh:"未安装",en:"Available"},typeAll:{zh:"全部",en:"All"},typeIntegration:{zh:"集成",en:"Integration"},typePlugin:{zh:"插件",en:"Plugin"},typeTheme:{zh:"主题",en:"Theme"},typeAppDaemon:{zh:"AppDaemon",en:"AppDaemon"},typeNetDaemon:{zh:"NetDaemon",en:"NetDaemon"},typePython:{zh:"Python",en:"Python"},typeTemplate:{zh:"模板",en:"Template"},sortByStars:{zh:"按星数",en:"By Stars"},sortByUpdated:{zh:"最近更新",en:"Recently Updated"},sortByName:{zh:"按名称",en:"By Name"},catAll:{zh:"全部",en:"All"},catIntegration:{zh:"集成",en:"Integration"},catPlugin:{zh:"插件",en:"Plugin"},catTheme:{zh:"主题",en:"Theme"},catAppDaemon:{zh:"AppDaemon",en:"AppDaemon"},catNetDaemon:{zh:"NetDaemon",en:"NetDaemon"},catPython:{zh:"Python",en:"Python"},catTemplate:{zh:"模板",en:"Template"},catDashboard:{zh:"卡片",en:"Cards"},totalRepos:{zh:"个仓库",en:"repositories"},noMatch:{zh:"没有匹配的仓库",en:"No matching repositories"},noData:{zh:"暂无仓库数据",en:"No repository data"},loading:{zh:"加载中...",en:"Loading..."},prevPage:{zh:"← 上一页",en:"← Previous"},nextPage:{zh:"下一页 →",en:"Next →"},page:{zh:"第",en:"Page"},of:{zh:"/ ",en:" / "},installed:{zh:"已安装",en:"Installed"},install:{zh:"安装",en:"Install"},update:{zh:"更新",en:"Update"},remove:{zh:"卸载",en:"Uninstall"},detail:{zh:"详情",en:"Detail"},noDesc:{zh:"暂无描述",en:"No description"},favOn:{zh:"已收藏",en:"Favorited"},favOff:{zh:"收藏",en:"Favorite"},canUpdate:{zh:"可更新",en:"Updatable"},allTypes:{zh:"全部类型",en:"All Types"},refresh:{zh:"刷新",en:"Refresh"},noInstalled:{zh:"暂无已安装仓库",en:"No installed repositories"},noMatchInstalled:{zh:"没有匹配的已安装仓库",en:"No matching installed repos"},totalInstalled:{zh:"个已安装仓库",en:"installed repositories"},confirmRemove:{zh:"确定要卸载",en:"Are you sure to uninstall"},removed:{zh:"已卸载",en:"Uninstalled"},removeFailed:{zh:"卸载失败",en:"Uninstall failed"},updating:{zh:"更新中...",en:"Updating..."},checkingUpdates:{zh:"检查更新...",en:"Checking updates..."},allUpToDate:{zh:"所有仓库已是最新版本",en:"All repositories are up to date"},totalUpdates:{zh:"个可更新仓库",en:"repositories can be updated"},updateAll:{zh:"全部更新",en:"Update All"},currentVersion:{zh:"当前版本",en:"Current"},latestVersion:{zh:"最新版本",en:"Latest"},updateNow:{zh:"立即更新",en:"Update Now"},confirmUpdateAll:{zh:"确定要更新全部",en:"Update all"},allUpdatesStarted:{zh:"全部更新已开始",en:"All updates started"},updateStarted:{zh:"已开始更新",en:"Update started"},updateFailed:{zh:"更新失败",en:"Update failed"},selectAll:{zh:"全选",en:"Select All"},customRepos:{zh:"自定义仓库",en:"Custom Repositories"},noCustomRepos:{zh:"暂无自定义仓库",en:"No custom repositories"},noCustomReposHint:{zh:"点击下方按钮添加自定义仓库，或从浏览页安装",en:"Click below to add a custom repo, or install from Browse"},customReposDesc:{zh:"管理 HACS 自定义仓库列表。添加后可在商店中搜索到。",en:"Manage custom repository list. Once added, they become searchable in Store."},addRepo:{zh:"添加仓库",en:"Add Repository"},addSuccess:{zh:"添加成功",en:"Added successfully"},invalidRepoUrl:{zh:"无效的仓库地址，请输入 owner/repo 格式或 GitHub URL",en:"Invalid repository URL, use owner/repo format or GitHub URL"},addCustomRepo:{zh:"添加自定义仓库",en:"Add Custom Repository"},repoUrl:{zh:"仓库 URL (如: https://github.com/user/repo)",en:"Repository URL (e.g. https://github.com/user/repo)"},add:{zh:"添加",en:"Add"},cancel:{zh:"取消",en:"Cancel"},addFailed:{zh:"添加失败",en:"Add failed"},removeRepo:{zh:"移除",en:"Remove"},confirmRemoveRepo:{zh:"确定要移除自定义仓库",en:"Remove custom repository"},removeRepoFailed:{zh:"移除失败",en:"Remove failed"},notInstalled:{zh:"未安装",en:"Not installed"},alreadyExists:{zh:"已在列表中",en:"already exists"},customBadge:{zh:"自定义",en:"Custom"},archivedRepos:{zh:"已归档仓库",en:"Archived Repositories"},noArchived:{zh:"暂无归档仓库",en:"No archived repositories"},renamedRepos:{zh:"已重命名仓库",en:"Renamed Repositories"},noRenamed:{zh:"暂无重命名仓库",en:"No renamed repositories"},ignoredRepos:{zh:"已忽略仓库",en:"Ignored Repositories"},noIgnored:{zh:"暂无忽略仓库",en:"No ignored repositories"},removeArchived:{zh:"移除归档",en:"Remove Archived"},removeRenamed:{zh:"移除重命名",en:"Remove Renamed"},replace:{zh:"替换",en:"Replace"},viewDetail:{zh:"查看详情",en:"View Detail"},confirmRemoveArchived:{zh:"将永久清除归档仓库的全部数据记录",en:"Permanently clear all data records for this archived repo"},confirmRemoveRenamed:{zh:"将永久清除重命名记录的全部数据记录",en:"Permanently clear all data records for this renamed repo"},confirmReplaceRenamed:{zh:"将替换仓库",en:"Replace repository"},replaceRenamedWarning:{zh:"（将卸载旧仓库并安装新仓库）",en:" (will uninstall old, install new)"},viewOnGithub:{zh:"在 GitHub 中查看",en:"View on GitHub"},exportBackup:{zh:"导出备份",en:"Export Backup"},exportDesc:{zh:"将 HACS 配置、已安装仓库列表和自定义仓库设置导出为 JSON 文件。导出后可在新环境中导入恢复。",en:"Export HACS config, installed repositories and custom repo settings as JSON. Can be imported in new environments."},exportBtn:{zh:"导出备份",en:"Export Backup"},exporting:{zh:"导出中...",en:"Exporting..."},exportSuccess:{zh:"备份导出成功",en:"Backup exported successfully"},exportFailed:{zh:"导出失败",en:"Export failed"},importBackup:{zh:"导入备份",en:"Import Backup"},importDesc:{zh:"从之前导出的 JSON 备份文件恢复 HACS 配置。注意：导入会覆盖当前配置。",en:"Restore HACS config from a previously exported JSON backup. Note: Import will overwrite current config."},importBtn:{zh:"导入备份",en:"Import Backup"},importing:{zh:"导入中...",en:"Importing..."},importSuccess:{zh:"备份导入成功",en:"Backup imported successfully"},importFailed:{zh:"导入失败",en:"Import failed"},depCheck:{zh:"依赖检查",en:"Dependency Check"},depDesc:{zh:"检查 HACS Vision 的系统依赖是否完整安装。",en:"Check if HACS Vision system dependencies are fully installed."},checkDep:{zh:"检查依赖",en:"Check Dependencies"},depOk:{zh:"所有依赖正常",en:"All dependencies OK"},depMissing:{zh:"部分依赖缺失",en:"Some dependencies missing"},checkFailed:{zh:"检查失败",en:"Check failed"},noFavorites:{zh:"暂无收藏",en:"No favorites yet"},noFavoritesHint:{zh:"在浏览页点击卡片右上角的 ☆ 收藏仓库",en:"Click ☆ on the top-right of cards to favorite repositories"},clearAll:{zh:"清空收藏",en:"Clear All"},confirmClear:{zh:"确定要清空所有收藏吗？",en:"Clear all favorites?"},favoritesCleared:{zh:"已清空收藏",en:"Favorites cleared"},openGithub:{zh:"在 GitHub 中打开",en:"Open in GitHub"},description:{zh:"描述",en:"Description"},version:{zh:"版本",en:"Version"},downloads:{zh:"下载量",en:"Downloads"},stars:{zh:"星数",en:"Stars"},category:{zh:"分类",en:"Category"},close:{zh:"关闭",en:"Close"},unknown:{zh:"未知",en:"unknown"},search:{zh:"搜索",en:"Search"},refreshTitle:{zh:"刷新",en:"Refresh"},totalPrefix:{zh:"共",en:"Total"},connectFailed:{zh:"连接 HACS 失败",en:"Failed to connect to HACS"},waitingHA:{zh:"等待 HA 连接...",en:"Waiting for HA connection..."},confirm:{zh:"确认",en:"Confirm"},confirmDelete:{zh:"确认删除",en:"Confirm Delete"},confirmUpdate:{zh:"确认更新",en:"Confirm Update"},loadingReadme:{zh:"加载 README...",en:"Loading README..."},readmeLoadFailed:{zh:"README 加载失败",en:"README load failed"},readmeTitle:{zh:"说明文档",en:"README"},dblZoomHint:{zh:"双击放大",en:"Double-click to expand"},networkOffline:{zh:"网络连接已断开，请检查网络",en:"Network disconnected — check your connection"},networkRestored:{zh:"网络已恢复",en:"Network restored"},haRestarting:{zh:"Home Assistant 正在重启，请稍候...",en:"Home Assistant is restarting, please wait..."},rateLimited:{zh:"GitHub API 限流，请稍后重试",en:"GitHub API rate limited — try again later"},restartHA:{zh:"重启",en:"Restart"},restartHATitle:{zh:"重启 Home Assistant",en:"Restart Home Assistant"},restartConfirm:{zh:"确定要重启 Home Assistant 吗？面板将暂时不可用。",en:"Restart Home Assistant? The panel will be temporarily unavailable."},restartFailed:{zh:"重启失败",en:"Restart failed"},installing:{zh:"安装中…",en:"Installing…"},installComplete:{zh:"已安装",en:"Installed"},installFailed:{zh:"安装失败",en:"Install failed"},updatingProgress:{zh:"更新中…",en:"Updating…"},updateComplete:{zh:"已更新",en:"Updated"},quickInstall:{zh:"快捷安装",en:"Quick Install"},quickInstallPlaceholder:{zh:"粘贴 GitHub URL 或 owner/repo",en:"Paste GitHub URL or owner/repo"},quickInstallCategory:{zh:"分类",en:"Category"},quickInstallUrl:{zh:"仓库 URL",en:"Repository URL"},installRepo:{zh:"安装仓库",en:"Install Repository"},changelogTitle:{zh:"更新内容",en:"What's New"},viewFullChangelog:{zh:"查看完整更新日志",en:"View full changelog"},noChangelog:{zh:"暂无更新日志",en:"No changelog available"},viewCard:{zh:"卡片",en:"Cards"},viewList:{zh:"列表",en:"List"},list:{zh:"列表",en:"List"},groupBy:{zh:"分组",en:"Group By"},groupNone:{zh:"不分组",en:"No Grouping"},groupStatus:{zh:"按状态",en:"By Status"},groupType:{zh:"按类型",en:"By Type"},selectVersion:{zh:"选择版本",en:"Select Version"},availableVersion:{zh:"可用版本",en:"Available Version"},installVersion:{zh:"安装此版本",en:"Install This Version"},prerelease:{zh:"预发布",en:"Pre-release"},noReleases:{zh:"暂无发布版本",en:"No releases available"},publishedAt:{zh:"发布于",en:"Published"},tools:{zh:"工具",en:"Tools"},toolsDesc:{zh:"导出、导入和依赖检查",en:"Export, import and dependency check"},colName:{zh:"名称",en:"Name"},colDownloads:{zh:"下载",en:"Downloads"},colStars:{zh:"星数",en:"Stars"},colLastUpdated:{zh:"更新",en:"Updated"},colInstalledVer:{zh:"已安装",en:"Installed"},colAvailableVer:{zh:"可用",en:"Available"},colStatus:{zh:"状态",en:"Status"},colInstalledAt:{zh:"安装时间",en:"Installed At"},installedAt:{zh:"安装时间",en:"Installed At"},today:{zh:"今天",en:"Today"},yesterday:{zh:"昨天",en:"Yesterday"}};function ue(e){const t=he[e];return t&&(t[pe]||t.zh||t.en)||e}const ge={integration:"#1565c0",plugin:"#7b1fa2",theme:"#2e7d32",appdaemon:"#e65100",netdaemon:"#00838f",python_script:"#f9a825",template:"#6a1b9a"};function me(e){return ge[e]||"#03a9f4"}
/*! @license DOMPurify 3.4.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.8/LICENSE */function fe(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,a=Array(t);o<t;o++)a[o]=e[o];return a}function ve(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var o=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=o){var a,i,r,s,n=[],l=!0,c=!1;try{if(r=(o=o.call(e)).next,0===t);else for(;!(l=(a=r.call(o)).done)&&(n.push(a.value),n.length!==t);l=!0);}catch(e){c=!0,i=e}finally{try{if(!l&&null!=o.return&&(s=o.return(),Object(s)!==s))return}finally{if(c)throw i}}return n}}(e,t)||function(e,t){if(e){if("string"==typeof e)return fe(e,t);var o={}.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?fe(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const xe=Object.entries,be=Object.setPrototypeOf,ye=Object.isFrozen,_e=Object.getPrototypeOf,we=Object.getOwnPropertyDescriptor;let $e=Object.freeze,ke=Object.seal,Ae=Object.create,Se="undefined"!=typeof Reflect&&Reflect,ze=Se.apply,Ce=Se.construct;$e||($e=function(e){return e}),ke||(ke=function(e){return e}),ze||(ze=function(e,t){for(var o=arguments.length,a=new Array(o>2?o-2:0),i=2;i<o;i++)a[i-2]=arguments[i];return e.apply(t,a)}),Ce||(Ce=function(e){for(var t=arguments.length,o=new Array(t>1?t-1:0),a=1;a<t;a++)o[a-1]=arguments[a];return new e(...o)});const Re=Xe(Array.prototype.forEach),Te=Xe(Array.prototype.lastIndexOf),Ee=Xe(Array.prototype.pop),De=Xe(Array.prototype.push),Le=Xe(Array.prototype.splice),Ne=Array.isArray,Ie=Xe(String.prototype.toLowerCase),Me=Xe(String.prototype.toString),Oe=Xe(String.prototype.match),Ue=Xe(String.prototype.replace),Pe=Xe(String.prototype.indexOf),Be=Xe(String.prototype.trim),Fe=Xe(Number.prototype.toString),He=Xe(Boolean.prototype.toString),je="undefined"==typeof BigInt?null:Xe(BigInt.prototype.toString),Ve="undefined"==typeof Symbol?null:Xe(Symbol.prototype.toString),Ge=Xe(Object.prototype.hasOwnProperty),We=Xe(Object.prototype.toString),qe=Xe(RegExp.prototype.test),Ye=(Je=TypeError,function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return Ce(Je,t)});var Je;function Xe(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var o=arguments.length,a=new Array(o>1?o-1:0),i=1;i<o;i++)a[i-1]=arguments[i];return ze(e,t,a)}}function Ke(e,t){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ie;if(be&&be(e,null),!Ne(t))return e;let a=t.length;for(;a--;){let i=t[a];if("string"==typeof i){const e=o(i);e!==i&&(ye(t)||(t[a]=e),i=e)}e[i]=!0}return e}function Ze(e){for(let t=0;t<e.length;t++){Ge(e,t)||(e[t]=null)}return e}function Qe(e){const t=Ae(null);for(const a of xe(e)){var o=ve(a,2);const i=o[0],r=o[1];Ge(e,i)&&(Ne(r)?t[i]=Ze(r):r&&"object"==typeof r&&r.constructor===Object?t[i]=Qe(r):t[i]=r)}return t}function et(e,t){for(;null!==e;){const o=we(e,t);if(o){if(o.get)return Xe(o.get);if("function"==typeof o.value)return Xe(o.value)}e=_e(e)}return function(){return null}}const tt=$e(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ot=$e(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),at=$e(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),it=$e(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),rt=$e(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),st=$e(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),nt=$e(["#text"]),lt=$e(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),ct=$e(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),dt=$e(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),pt=$e(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ht=ke(/{{[\w\W]*|^[\w\W]*}}/g),ut=ke(/<%[\w\W]*|^[\w\W]*%>/g),gt=ke(/\${[\w\W]*/g),mt=ke(/^data-[\-\w.\u00B7-\uFFFF]+$/),ft=ke(/^aria-[\-\w]+$/),vt=ke(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),xt=ke(/^(?:\w+script|data):/i),bt=ke(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),yt=ke(/^html$/i),_t=ke(/^[a-z][.\w]*(-[.\w]+)+$/i),wt=1,$t=3,kt=7,At=8,St=9,zt=11,Ct=function(){return"undefined"==typeof window?null:window};var Rt=function e(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Ct();const o=t=>e(t);if(o.version="3.4.8",o.removed=[],!t||!t.document||t.document.nodeType!==St||!t.Element)return o.isSupported=!1,o;let a=t.document;const i=a,r=i.currentScript;t.DocumentFragment;const s=t.HTMLTemplateElement,n=t.Node,l=t.Element,c=t.NodeFilter,d=t.NamedNodeMap;void 0===d&&(t.NamedNodeMap||t.MozNamedAttrMap),t.HTMLFormElement;const p=t.DOMParser,h=t.trustedTypes,u=l.prototype,g=et(u,"cloneNode"),m=et(u,"remove"),f=et(u,"nextSibling"),v=et(u,"childNodes"),x=et(u,"parentNode"),b=et(u,"shadowRoot"),y=et(u,"attributes"),_=n&&n.prototype?et(n.prototype,"nodeType"):null,w=n&&n.prototype?et(n.prototype,"nodeName"):null;if("function"==typeof s){const e=a.createElement("template");e.content&&e.content.ownerDocument&&(a=e.content.ownerDocument)}let $,k="",A=0;const S=function(e){if(A>0)throw Ye('The configured TRUSTED_TYPES_POLICY.createHTML must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose createHTML wraps DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');A++;try{return $.createHTML(e)}finally{A--}},z=a,C=z.implementation,R=z.createNodeIterator,T=z.createDocumentFragment,E=z.getElementsByTagName,D=i.importNode;let L={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]};o.isSupported="function"==typeof xe&&"function"==typeof x&&C&&void 0!==C.createHTMLDocument;const N=ht,I=ut,M=gt,O=mt,U=ft,P=xt,B=bt,F=_t;let H=vt,j=null;const V=Ke({},[...tt,...ot,...at,...rt,...nt]);let G=null;const W=Ke({},[...lt,...ct,...dt,...pt]);let q=Object.seal(Ae(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Y=null,J=null;const X=Object.seal(Ae(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let K=!0,Z=!0,Q=!1,ee=!0,te=!1,oe=!0,ae=!1,ie=!1,re=!1,se=!1,ne=!1,le=!1,ce=!0,de=!1;const pe="user-content-";let he=!0,ue=!1,ge={},me=null;const fe=Ke({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let ve=null;const be=Ke({},["audio","video","img","source","image","track"]);let ye=null;const _e=Ke({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),we="http://www.w3.org/1998/Math/MathML",ke="http://www.w3.org/2000/svg",Se="http://www.w3.org/1999/xhtml";let ze=Se,Ce=!1,Je=null;const Xe=Ke({},[we,ke,Se],Me);let Ze=Ke({},["mi","mo","mn","ms","mtext"]),Rt=Ke({},["annotation-xml"]);const Tt=Ke({},["title","style","font","a","script"]);let Et=null;const Dt=["application/xhtml+xml","text/html"];let Lt=null,Nt=null;const It=a.createElement("form"),Mt=function(e){return e instanceof RegExp||e instanceof Function},Ot=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(Nt&&Nt===e)return;e&&"object"==typeof e||(e={}),e=Qe(e),Et=-1===Dt.indexOf(e.PARSER_MEDIA_TYPE)?"text/html":e.PARSER_MEDIA_TYPE,Lt="application/xhtml+xml"===Et?Me:Ie,j=Ge(e,"ALLOWED_TAGS")&&Ne(e.ALLOWED_TAGS)?Ke({},e.ALLOWED_TAGS,Lt):V,G=Ge(e,"ALLOWED_ATTR")&&Ne(e.ALLOWED_ATTR)?Ke({},e.ALLOWED_ATTR,Lt):W,Je=Ge(e,"ALLOWED_NAMESPACES")&&Ne(e.ALLOWED_NAMESPACES)?Ke({},e.ALLOWED_NAMESPACES,Me):Xe,ye=Ge(e,"ADD_URI_SAFE_ATTR")&&Ne(e.ADD_URI_SAFE_ATTR)?Ke(Qe(_e),e.ADD_URI_SAFE_ATTR,Lt):_e,ve=Ge(e,"ADD_DATA_URI_TAGS")&&Ne(e.ADD_DATA_URI_TAGS)?Ke(Qe(be),e.ADD_DATA_URI_TAGS,Lt):be,me=Ge(e,"FORBID_CONTENTS")&&Ne(e.FORBID_CONTENTS)?Ke({},e.FORBID_CONTENTS,Lt):fe,Y=Ge(e,"FORBID_TAGS")&&Ne(e.FORBID_TAGS)?Ke({},e.FORBID_TAGS,Lt):Qe({}),J=Ge(e,"FORBID_ATTR")&&Ne(e.FORBID_ATTR)?Ke({},e.FORBID_ATTR,Lt):Qe({}),ge=!!Ge(e,"USE_PROFILES")&&(e.USE_PROFILES&&"object"==typeof e.USE_PROFILES?Qe(e.USE_PROFILES):e.USE_PROFILES),K=!1!==e.ALLOW_ARIA_ATTR,Z=!1!==e.ALLOW_DATA_ATTR,Q=e.ALLOW_UNKNOWN_PROTOCOLS||!1,ee=!1!==e.ALLOW_SELF_CLOSE_IN_ATTR,te=e.SAFE_FOR_TEMPLATES||!1,oe=!1!==e.SAFE_FOR_XML,ae=e.WHOLE_DOCUMENT||!1,se=e.RETURN_DOM||!1,ne=e.RETURN_DOM_FRAGMENT||!1,le=e.RETURN_TRUSTED_TYPE||!1,re=e.FORCE_BODY||!1,ce=!1!==e.SANITIZE_DOM,de=e.SANITIZE_NAMED_PROPS||!1,he=!1!==e.KEEP_CONTENT,ue=e.IN_PLACE||!1,H=function(e){try{return qe(e,""),!0}catch(e){return!1}}(e.ALLOWED_URI_REGEXP)?e.ALLOWED_URI_REGEXP:vt,ze="string"==typeof e.NAMESPACE?e.NAMESPACE:Se,Ze=Ge(e,"MATHML_TEXT_INTEGRATION_POINTS")&&e.MATHML_TEXT_INTEGRATION_POINTS&&"object"==typeof e.MATHML_TEXT_INTEGRATION_POINTS?Qe(e.MATHML_TEXT_INTEGRATION_POINTS):Ke({},["mi","mo","mn","ms","mtext"]),Rt=Ge(e,"HTML_INTEGRATION_POINTS")&&e.HTML_INTEGRATION_POINTS&&"object"==typeof e.HTML_INTEGRATION_POINTS?Qe(e.HTML_INTEGRATION_POINTS):Ke({},["annotation-xml"]);const t=Ge(e,"CUSTOM_ELEMENT_HANDLING")&&e.CUSTOM_ELEMENT_HANDLING&&"object"==typeof e.CUSTOM_ELEMENT_HANDLING?Qe(e.CUSTOM_ELEMENT_HANDLING):Ae(null);if(q=Ae(null),Ge(t,"tagNameCheck")&&Mt(t.tagNameCheck)&&(q.tagNameCheck=t.tagNameCheck),Ge(t,"attributeNameCheck")&&Mt(t.attributeNameCheck)&&(q.attributeNameCheck=t.attributeNameCheck),Ge(t,"allowCustomizedBuiltInElements")&&"boolean"==typeof t.allowCustomizedBuiltInElements&&(q.allowCustomizedBuiltInElements=t.allowCustomizedBuiltInElements),te&&(Z=!1),ne&&(se=!0),ge&&(j=Ke({},nt),G=Ae(null),!0===ge.html&&(Ke(j,tt),Ke(G,lt)),!0===ge.svg&&(Ke(j,ot),Ke(G,ct),Ke(G,pt)),!0===ge.svgFilters&&(Ke(j,at),Ke(G,ct),Ke(G,pt)),!0===ge.mathMl&&(Ke(j,rt),Ke(G,dt),Ke(G,pt))),X.tagCheck=null,X.attributeCheck=null,Ge(e,"ADD_TAGS")&&("function"==typeof e.ADD_TAGS?X.tagCheck=e.ADD_TAGS:Ne(e.ADD_TAGS)&&(j===V&&(j=Qe(j)),Ke(j,e.ADD_TAGS,Lt))),Ge(e,"ADD_ATTR")&&("function"==typeof e.ADD_ATTR?X.attributeCheck=e.ADD_ATTR:Ne(e.ADD_ATTR)&&(G===W&&(G=Qe(G)),Ke(G,e.ADD_ATTR,Lt))),Ge(e,"ADD_URI_SAFE_ATTR")&&Ne(e.ADD_URI_SAFE_ATTR)&&Ke(ye,e.ADD_URI_SAFE_ATTR,Lt),Ge(e,"FORBID_CONTENTS")&&Ne(e.FORBID_CONTENTS)&&(me===fe&&(me=Qe(me)),Ke(me,e.FORBID_CONTENTS,Lt)),Ge(e,"ADD_FORBID_CONTENTS")&&Ne(e.ADD_FORBID_CONTENTS)&&(me===fe&&(me=Qe(me)),Ke(me,e.ADD_FORBID_CONTENTS,Lt)),he&&(j["#text"]=!0),ae&&Ke(j,["html","head","body"]),j.table&&(Ke(j,["tbody"]),delete Y.tbody),e.TRUSTED_TYPES_POLICY){if("function"!=typeof e.TRUSTED_TYPES_POLICY.createHTML)throw Ye('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof e.TRUSTED_TYPES_POLICY.createScriptURL)throw Ye('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const t=$;$=e.TRUSTED_TYPES_POLICY;try{k=S("")}catch(e){throw $=t,e}}else void 0===$&&null!==e.TRUSTED_TYPES_POLICY&&($=function(e,t){if("object"!=typeof e||"function"!=typeof e.createPolicy)return null;let o=null;const a="data-tt-policy-suffix";t&&t.hasAttribute(a)&&(o=t.getAttribute(a));const i="dompurify"+(o?"#"+o:"");try{return e.createPolicy(i,{createHTML:e=>e,createScriptURL:e=>e})}catch(e){return console.warn("TrustedTypes policy "+i+" could not be created."),null}}(h,r)),$&&"string"==typeof k&&(k=S(""));(L.uponSanitizeElement.length>0||L.uponSanitizeAttribute.length>0)&&j===V&&(j=Qe(j)),L.uponSanitizeAttribute.length>0&&G===W&&(G=Qe(G)),$e&&$e(e),Nt=e},Ut=Ke({},[...ot,...at,...it]),Pt=Ke({},[...rt,...st]),Bt=function(e){De(o.removed,{element:e});try{x(e).removeChild(e)}catch(t){m(e)}},Ft=function(e,t){try{De(o.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){De(o.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e)if(se||ne)try{Bt(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}},Ht=function(e){let t=null,o=null;if(re)e="<remove></remove>"+e;else{const t=Oe(e,/^[\r\n\t ]+/);o=t&&t[0]}"application/xhtml+xml"===Et&&ze===Se&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");const i=$?S(e):e;if(ze===Se)try{t=(new p).parseFromString(i,Et)}catch(e){}if(!t||!t.documentElement){t=C.createDocument(ze,"template",null);try{t.documentElement.innerHTML=Ce?k:i}catch(e){}}const r=t.body||t.documentElement;return e&&o&&r.insertBefore(a.createTextNode(o),r.childNodes[0]||null),ze===Se?E.call(t,ae?"html":"body")[0]:ae?t.documentElement:r},jt=function(e){return R.call(e.ownerDocument||e,e,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},Vt=function(e){var t,o;e.normalize();const a=R.call(e.ownerDocument||e,e,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null);let i=a.nextNode();for(;i;){let e=i.data;Re([N,I,M],t=>{e=Ue(e,t," ")}),i.data=e,i=a.nextNode()}const r=null!==(t=null===(o=e.querySelectorAll)||void 0===o?void 0:o.call(e,"template"))&&void 0!==t?t:[];Re(Array.from(r),e=>{Wt(e.content)&&Vt(e.content)})},Gt=function(e){const t=w?w(e):null;return"string"==typeof t&&("form"===Lt(t)&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||e.attributes!==y(e)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes||e.nodeType!==_(e)||e.childNodes!==v(e)))},Wt=function(e){if(!_||"object"!=typeof e||null===e)return!1;try{return _(e)===zt}catch(e){return!1}},qt=function(e){if(!_||"object"!=typeof e||null===e)return!1;try{return"number"==typeof _(e)}catch(e){return!1}};function Yt(e,t,a){Re(e,e=>{e.call(o,t,a,Nt)})}const Jt=function(e){let t=null;if(Yt(L.beforeSanitizeElements,e,null),Gt(e))return Bt(e),!0;const a=Lt(w?w(e):e.nodeName);if(Yt(L.uponSanitizeElement,e,{tagName:a,allowedTags:j}),oe&&e.hasChildNodes()&&!qt(e.firstElementChild)&&qe(/<[/\w!]/g,e.innerHTML)&&qe(/<[/\w!]/g,e.textContent))return Bt(e),!0;if(oe&&e.namespaceURI===Se&&"style"===a&&qt(e.firstElementChild))return Bt(e),!0;if(e.nodeType===kt)return Bt(e),!0;if(oe&&e.nodeType===At&&qe(/<[/\w]/g,e.data))return Bt(e),!0;if(Y[a]||!(X.tagCheck instanceof Function&&X.tagCheck(a))&&!j[a]){if(!Y[a]&&Zt(a)){if(q.tagNameCheck instanceof RegExp&&qe(q.tagNameCheck,a))return!1;if(q.tagNameCheck instanceof Function&&q.tagNameCheck(a))return!1}if(he&&!me[a]){const t=x(e),o=v(e);if(o&&t){for(let a=o.length-1;a>=0;--a){const i=g(o[a],!0);t.insertBefore(i,f(e))}}}return Bt(e),!0}return((_?_(e):e.nodeType)!==wt||function(e){let t=x(e);t&&t.tagName||(t={namespaceURI:ze,tagName:"template"});const o=Ie(e.tagName),a=Ie(t.tagName);return!!Je[e.namespaceURI]&&(e.namespaceURI===ke?t.namespaceURI===Se?"svg"===o:t.namespaceURI===we?"svg"===o&&("annotation-xml"===a||Ze[a]):Boolean(Ut[o]):e.namespaceURI===we?t.namespaceURI===Se?"math"===o:t.namespaceURI===ke?"math"===o&&Rt[a]:Boolean(Pt[o]):e.namespaceURI===Se?!(t.namespaceURI===ke&&!Rt[a])&&!(t.namespaceURI===we&&!Ze[a])&&!Pt[o]&&(Tt[o]||!Ut[o]):!("application/xhtml+xml"!==Et||!Je[e.namespaceURI]))}(e))&&("noscript"!==a&&"noembed"!==a&&"noframes"!==a||!qe(/<\/no(script|embed|frames)/i,e.innerHTML))?(te&&e.nodeType===$t&&(t=e.textContent,Re([N,I,M],e=>{t=Ue(t,e," ")}),e.textContent!==t&&(De(o.removed,{element:e.cloneNode()}),e.textContent=t)),Yt(L.afterSanitizeElements,e,null),!1):(Bt(e),!0)},Xt=function(e,t,o){if(J[t])return!1;if(ce&&("id"===t||"name"===t)&&(o in a||o in It))return!1;const i=G[t]||X.attributeCheck instanceof Function&&X.attributeCheck(t,e);if(Z&&!J[t]&&qe(O,t));else if(K&&qe(U,t));else if(!i||J[t]){if(!(Zt(e)&&(q.tagNameCheck instanceof RegExp&&qe(q.tagNameCheck,e)||q.tagNameCheck instanceof Function&&q.tagNameCheck(e))&&(q.attributeNameCheck instanceof RegExp&&qe(q.attributeNameCheck,t)||q.attributeNameCheck instanceof Function&&q.attributeNameCheck(t,e))||"is"===t&&q.allowCustomizedBuiltInElements&&(q.tagNameCheck instanceof RegExp&&qe(q.tagNameCheck,o)||q.tagNameCheck instanceof Function&&q.tagNameCheck(o))))return!1}else if(ye[t]);else if(qe(H,Ue(o,B,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==Pe(o,"data:")||!ve[e]){if(Q&&!qe(P,Ue(o,B,"")));else if(o)return!1}else;return!0},Kt=Ke({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Zt=function(e){return!Kt[Ie(e)]&&qe(F,e)},Qt=function(e){Yt(L.beforeSanitizeAttributes,e,null);const t=e.attributes;if(!t||Gt(e))return;const a={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:G,forceKeepAttr:void 0};let i=t.length;for(;i--;){const r=t[i],s=r.name,n=r.namespaceURI,l=r.value,c=Lt(s),d=l;let p="value"===s?d:Be(d);if(a.attrName=c,a.attrValue=p,a.keepAttr=!0,a.forceKeepAttr=void 0,Yt(L.uponSanitizeAttribute,e,a),p=a.attrValue,!de||"id"!==c&&"name"!==c||0===Pe(p,pe)||(Ft(s,e),p=pe+p),oe&&qe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,p)){Ft(s,e);continue}if("attributename"===c&&Oe(p,"href")){Ft(s,e);continue}if(a.forceKeepAttr)continue;if(!a.keepAttr){Ft(s,e);continue}if(!ee&&qe(/\/>/i,p)){Ft(s,e);continue}te&&Re([N,I,M],e=>{p=Ue(p,e," ")});const u=Lt(e.nodeName);if(Xt(u,c,p)){if($&&"object"==typeof h&&"function"==typeof h.getAttributeType)if(n);else switch(h.getAttributeType(u,c)){case"TrustedHTML":p=S(p);break;case"TrustedScriptURL":p=$.createScriptURL(p)}if(p!==d)try{n?e.setAttributeNS(n,s,p):e.setAttribute(s,p),Gt(e)?Bt(e):Ee(o.removed)}catch(t){Ft(s,e)}}else Ft(s,e)}Yt(L.afterSanitizeAttributes,e,null)},eo=function(e){let t=null;const o=jt(e);for(Yt(L.beforeSanitizeShadowDOM,e,null);t=o.nextNode();){Yt(L.uponSanitizeShadowNode,t,null),Jt(t),Qt(t),Wt(t.content)&&eo(t.content);if((_?_(t):t.nodeType)===wt){const e=b?b(t):t.shadowRoot;Wt(e)&&(to(e),eo(e))}}Yt(L.afterSanitizeShadowDOM,e,null)},to=function(e){const t=_?_(e):e.nodeType;if(t===wt){const t=b?b(e):e.shadowRoot;Wt(t)&&(to(t),eo(t))}const o=v?v(e):e.childNodes;if(!o)return;const a=[];Re(o,e=>{De(a,e)});for(const e of a)to(e);if(t===wt){const t=w?w(e):null;if("string"==typeof t&&"template"===Lt(t)){const t=e.content;Wt(t)&&to(t)}}};return o.sanitize=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=null,r=null,s=null,n=null;if(Ce=!e,Ce&&(e="\x3c!--\x3e"),"string"!=typeof e&&!qt(e)&&"string"!=typeof(e=function(e){switch(typeof e){case"string":return e;case"number":return Fe(e);case"boolean":return He(e);case"bigint":return je?je(e):"0";case"symbol":return Ve?Ve(e):"Symbol()";case"undefined":default:return We(e);case"function":case"object":{if(null===e)return We(e);const t=e,o=et(t,"toString");if("function"==typeof o){const e=o(t);return"string"==typeof e?e:We(e)}return We(e)}}}(e)))throw Ye("dirty is not a string, aborting");if(!o.isSupported)return e;if(ie||Ot(t),o.removed=[],"string"==typeof e&&(ue=!1),ue){const t=w?w(e):e.nodeName;if("string"==typeof t){const e=Lt(t);if(!j[e]||Y[e])throw Ye("root node is forbidden and cannot be sanitized in-place")}if(Gt(e))throw Ye("root node is clobbered and cannot be sanitized in-place");to(e)}else if(qt(e))a=Ht("\x3c!----\x3e"),r=a.ownerDocument.importNode(e,!0),r.nodeType===wt&&"BODY"===r.nodeName||"HTML"===r.nodeName?a=r:a.appendChild(r),to(r);else{if(!se&&!te&&!ae&&-1===e.indexOf("<"))return $&&le?S(e):e;if(a=Ht(e),!a)return se?null:le?k:""}a&&re&&Bt(a.firstChild);const l=jt(ue?e:a);for(;s=l.nextNode();)Jt(s),Qt(s),Wt(s.content)&&eo(s.content);if(ue)return te&&Vt(e),e;if(se){if(te&&Vt(a),ne)for(n=T.call(a.ownerDocument);a.firstChild;)n.appendChild(a.firstChild);else n=a;return(G.shadowroot||G.shadowrootmode)&&(n=D.call(i,n,!0)),n}let c=ae?a.outerHTML:a.innerHTML;return ae&&j["!doctype"]&&a.ownerDocument&&a.ownerDocument.doctype&&a.ownerDocument.doctype.name&&qe(yt,a.ownerDocument.doctype.name)&&(c="<!DOCTYPE "+a.ownerDocument.doctype.name+">\n"+c),te&&Re([N,I,M],e=>{c=Ue(c,e," ")}),$&&le?S(c):c},o.setConfig=function(){Ot(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),ie=!0},o.clearConfig=function(){Nt=null,ie=!1},o.isValidAttribute=function(e,t,o){Nt||Ot({});const a=Lt(e),i=Lt(t);return Xt(a,i,o)},o.addHook=function(e,t){"function"==typeof t&&De(L[e],t)},o.removeHook=function(e,t){if(void 0!==t){const o=Te(L[e],t);return-1===o?void 0:Le(L[e],o,1)[0]}return Ee(L[e])},o.removeHooks=function(e){L[e]=[]},o.removeAllHooks=function(){L={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},o}();class Tt extends(de(se)){static properties={currentView:{type:String},stats:{type:Object},hass:{type:Object},narrow:{type:Boolean},_apiReady:{type:Boolean,state:!0},_error:{type:String,state:!0},_detailRepo:{type:Object,state:!0},_showDetail:{type:Boolean,state:!0},_favoriteCount:{type:Number,state:!0},_readmeHtml:{type:String,state:!0},_readmeLoading:{type:Boolean,state:!0},_viewTransition:{type:Boolean,state:!0},_networkStatus:{type:String,state:!0},_detailExpanded:{type:Boolean,state:!0},_showVersionSelector:{type:Boolean,state:!0},_releases:{type:Array,state:!0},_releasesLoading:{type:Boolean,state:!0},_installingVersion:{type:Boolean,state:!0},_changelogData:{type:Object,state:!0},_changelogLoading:{type:Boolean,state:!0},_presetFilter:{type:String,state:!0}};constructor(){super(),this.currentView="browse",this.stats={pendingRestart:0},this.narrow=window.innerWidth<768,this._apiReady=!1,this._error="",this._detailRepo=null,this._showDetail=!1,this._favoriteCount=0,this._readmeHtml=null,this._readmeLoading=!1,this._viewTransition=!1,this._networkStatus="online",this._detailExpanded=!1,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._installingVersion=!1,this._changelogData=null,this._changelogLoading=!1,this._presetFilter="",Et=this,window.addEventListener("resize",()=>{this.narrow=window.innerWidth<768}),window.addEventListener("online",()=>{this._networkStatus="online"}),window.addEventListener("offline",()=>{this._networkStatus="offline"})}async _updateFavoriteCount(){try{const e=await ce.getFavorites(),t=Array.isArray(e)?e:e.favorites||[];this._favoriteCount=t.length}catch{this._favoriteCount=0}}willUpdate(e){e.has("hass")&&this.hass&&(ce.setHass(this.hass),this._apiReady||(this._apiReady=!0,this._loadStats(),ce._onNetworkStatus=e=>{this._networkStatus=e}))}static styles=r`
    :host {
      display: block;
    }

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
      cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap;
      transition: background 0.15s;
    }
    .restart-btn:hover { background: rgba(244,67,54,0.25); }
    .restart-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
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

    /* ===== Loading ===== */
    .loading { text-align: center; padding: 60px 20px; color: var(--secondary-text-color, #727272); }
    .spinner {
      width: 40px; height: 40px; border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4); border-radius: 50%;
      animation: spin 1s linear infinite; margin: 0 auto 16px;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

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
    .toast.success { background: #4caf50; }
    .toast.error { background: #f44336; }

    /* ===== Utility icons ===== */
    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .update-badge { background: var(--warning-color, #ff9800); color: #fff; padding: 1px 6px; border-radius: 8px; font-size: 10px; display: inline-flex; align-items: center; gap: 2px; }

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

    .modal-body { padding: 16px 24px 24px; overflow-y: auto; flex: 1; }

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
      .header-right { gap: 6px; justify-content: flex-end; flex-wrap: nowrap; }
      .stat { text-align: center; min-width: 32px; }
      .stat-num { font-size: 12px; }
      .stat-label { font-size: 8px; }
      .restart-btn { font-size: 10px; padding: 2px 8px; }
      .restart-btn svg { width: 12px; height: 12px; }
      .sticky-header { margin: 0 -10px 8px; padding: 0 10px 8px; }
      .tab { padding: 8px 12px; font-size: 12px; min-height: 44px; display: flex; align-items: center; }

      /* Mobile modal: fullscreen */
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal {
        max-width: 100%; max-height: 92vh; border-radius: 16px 16px 0 0;
        resize: none;
      }
      .modal::after { display: none; }
      .modal-header { padding: 16px 16px 0; }
      .modal-body { padding: 12px 16px 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
      .modal-actions { flex-direction: column; }
      .modal-btn { width: 100%; justify-content: center; min-height: 44px; }
      .version-selector-body { max-height: 200px; }
    }
  `;async connectedCallback(){super.connectedCallback(),this.addEventListener("refresh-stats",()=>this._loadStats()),this.addEventListener("detail",e=>this._openDetail(e.detail.repo)),this.addEventListener("favorite",()=>this._loadStats()),this._keydownHandler=e=>{if("Escape"===e.key&&this._showDetail)return e.preventDefault(),void this._closeDetail();if((e.ctrlKey||e.metaKey)&&"k"===e.key){e.preventDefault();const t=this.renderRoot?.querySelector(".search input");return void(t&&(t.focus(),t.select()))}if(!this._showDetail&&"INPUT"!==document.activeElement?.tagName&&"SELECT"!==document.activeElement?.tagName&&"TEXTAREA"!==document.activeElement?.tagName){const t=["browse","updates","management"],o=parseInt(e.key);o>=1&&o<=t.length&&(e.preventDefault(),this.switchView(t[o-1]))}},window.addEventListener("keydown",this._keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydownHandler)}async _loadStats(){try{this._error="",this.stats=await ce.getStats();const e=await ce.getFavorites(),t=Array.isArray(e)?e:e.favorites||[];this._favoriteCount=t.length}catch(e){console.error("Stats error:",e),this.stats={},this._error=`API: ${e.message}`}}async _restartHA(){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Pt});if(await e.show(this,{message:ue("restartConfirm"),confirmText:ue("restartHA"),danger:!0}))try{await ce.restartHA(),Nt(ue("haRestarting"),"info")}catch(e){Nt(`${ue("restartFailed")}: ${e.message}`,"error")}}switchView(e){this.currentView!==e&&(this._viewTransition=!0,this.currentView=e,this.dispatchEvent(new CustomEvent("view-changed",{detail:{view:e},bubbles:!0,composed:!0})),setTimeout(()=>{this._viewTransition=!1},150))}_openDetail(e){this._detailRepo=e,this._showDetail=!0,this._readmeHtml=null,this._readmeLoading=!0,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1,this._changelogData=null,this._changelogLoading=!0,this._loadReadme(e),this._loadChangelog(e)}async _loadReadme(e){if(e?.full_name){try{const t=await ce.getReadme(e.full_name);this._readmeHtml=t?Rt.sanitize(t):null}catch(e){this._readmeHtml=null}this._readmeLoading=!1}else this._readmeLoading=!1}async _loadChangelog(e){if(e?.full_name){try{const t=await ce.getChangelog(e.full_name);this._changelogData=t?.body?t:null}catch(e){this._changelogData=null}this._changelogLoading=!1}else this._changelogLoading=!1}_applyFilter(e){this._presetFilter=e,this.switchView("browse"),setTimeout(()=>{this._presetFilter=""},100)}_closeDetail(){this._showDetail=!1,this._detailRepo=null,this._readmeHtml=null,this._readmeLoading=!1,this._detailExpanded=!1,this._showVersionSelector=!1,this._releases=[],this._releasesLoading=!1}_toggleDetailExpand(){this._detailExpanded=!this._detailExpanded}async _toggleVersionSelector(){if(this._showVersionSelector=!this._showVersionSelector,this._showVersionSelector&&0===this._releases.length){this._releasesLoading=!0;try{const e=this._detailRepo?.id||this._detailRepo?.full_name;if(e){const t=await ce.getRepoReleases(e);this._releases=Array.isArray(t)?t:t.releases||[]}}catch(e){console.error("Failed to load releases:",e),this._releases=[]}this._releasesLoading=!1}}async _installVersion(e){const t=this._detailRepo?.id||this._detailRepo?.full_name;if(t&&e){this._installingVersion=!0;try{await ce.installVersion(t,e),Nt(`${ue("installComplete")}: ${e}`,"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._closeDetail()}catch(e){Nt(`${ue("installFailed")}: ${e.message}`,"error")}this._installingVersion=!1}}_getCategoryLabel(e){return{integration:ue("catIntegration"),plugin:ue("catPlugin"),theme:ue("catTheme"),appdaemon:ue("catAppDaemon"),netdaemon:ue("catNetDaemon"),python_script:ue("catPython"),template:ue("catTemplate")}[e]||e}async _modalAction(e){const t=this._detailRepo;if(t)try{if("install"===e)await ce.install(t.id||t.full_name,t.category),Nt(ue("installComplete"),"success");else if("update"===e)await ce.update([t.id||t.full_name]),Nt(ue("updateStarted"),"success");else if("uninstall"===e){const{ConfirmDialog:e}=await Promise.resolve().then(function(){return Pt});if(!await e.show(this,{message:`${ue("confirmRemove")} ${t.full_name||t.name}?`,confirmText:ue("remove"),danger:!0}))return;await ce.remove(t.id||t.full_name),Nt(ue("removed"),"success")}else if("github"===e){const e=t.html_url||`https://github.com/${t.full_name}`;return void window.open(e,"_blank")}this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._closeDetail()}catch(e){Nt(`${ue("updateFailed")}: ${e.message}`,"error")}}_checkTabsScrollable(){const e=this.renderRoot?.querySelector(".tabs-wrapper"),t=e?.querySelector(".tabs");e&&t&&e.classList.toggle("scrollable",t.scrollWidth>t.clientWidth)}async updated(e){super.updated(e),e.has("narrow")&&requestAnimationFrame(()=>this._checkTabsScrollable())}firstUpdated(){requestAnimationFrame(()=>this._checkTabsScrollable())}render(){const e=[{view:"browse",label:ue("tabBrowse"),icon:"",count:null},{view:"updates",label:ue("tabUpdates"),icon:"",count:null},{view:"management",label:ue("tabManagement"),icon:"",count:null}],t=this._detailRepo,o=t?.installed||!1,a=o&&(t?.has_update||t?.installed_version&&t?.latest_version&&t.installed_version!==t.latest_version),i=t?me(t.category):"#03a9f4";return H`
      <div class="store">
        ${this._error?H`
          <div class="error-banner error">
            <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${ue("connectFailed")}: <code>${this._error}</code>
          </div>
        `:""}
        ${this._apiReady?"":H`
          <div class="error-banner">
            ${ue("waitingHA")}
          </div>
        `}

        ${"offline"===this._networkStatus?H`
          <div class="network-banner offline">${ue("networkOffline")}</div>
        `:"rate_limited"===this._networkStatus?H`
          <div class="network-banner warning">${ue("rateLimited")}</div>
        `:"server_error"===this._networkStatus?H`
          <div class="network-banner warning">${ue("haRestarting")}</div>
        `:""}

        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <div class="header-icon">H</div>
            <div class="title-group">
              <h1>HACS Vision</h1>
              <p>${ue("storeSubtitle")}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="stat" @click=${()=>this._applyFilter("installed")}>
              <div class="stat-num">${this.stats.total_installed??0}</div>
              <div class="stat-label">${ue("statInstalled")}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("update_available")}>
              <div class="stat-num">${this.stats.available_updates??0}</div>
              <div class="stat-label">${ue("statUpdates")}</div>
            </div>
            ${(this.stats.pending_restart??0)>0?H`
            <div class="stat" style="color:#f44336;" @click=${()=>this._applyFilter("pending_restart")}>
              <div class="stat-num">${this.stats.pending_restart}</div>
              <div class="stat-label">${ue("statusPendingRestart")}</div>
            </div>
            <button class="restart-btn" @click=${()=>this._restartHA()} title="${ue("restartHATitle")}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
              ${ue("restartHA")}
            </button>
            `:""}
            <div class="stat" @click=${()=>this._applyFilter("favorites")}>
              <div class="stat-num">${this._favoriteCount??0}</div>
              <div class="stat-label">${ue("statFavorites")||"收藏"}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("custom")}>
              <div class="stat-num">${this.stats.custom_count??0}</div>
              <div class="stat-label">${ue("statCustom")||"自定义"}</div>
            </div>
            <div class="stat" @click=${()=>this._applyFilter("")}>
              <div class="stat-num">${this.stats.total_repos??0}</div>
              <div class="stat-label">${ue("statRepos")}</div>
            </div>
          </div>
        </div>

        <!-- Sticky Tabs -->
        <div class="sticky-header">
          <div class="tabs-wrapper">
            <div class="tabs">
              ${e.map(e=>H`
                <button class="tab ${this.currentView===e.view?"active":""}"
                        @click=${()=>this.switchView(e.view)}>
                  ${e.icon?H`${e.icon} `:""}${e.label}
                  ${void 0!==e.count&&null!==e.count?H`<span class="badge">${e.count}</span>`:""}
                </button>
              `)}
            </div>
          </div>
        </div>

        <!-- Content with fade transition -->
        <div class="content ${this._viewTransition?"transitioning":""}">
          ${"browse"===this.currentView?H`<browse-view .hass=${this.hass} .presetFilter=${this._presetFilter}></browse-view>`:""}
          ${"updates"===this.currentView?H`<updates-view .hass=${this.hass}></updates-view>`:""}
          ${"management"===this.currentView?H`<management-view .hass=${this.hass}></management-view>`:""}
        </div>
      </div>

      <!-- Detail Modal -->
      ${this._showDetail&&t?H`
        <div class="modal-overlay" @click=${e=>{e.target===e.currentTarget&&this._closeDetail()}}>
          <div class="modal ${this._detailExpanded?"expanded":""}" @dblclick=${this._toggleDetailExpand}>
            ${this._detailExpanded?"":H`<div class="modal-expand-hint">${ue("dblZoomHint")||"双击放大"}</div>`}
            <div class="modal-header">
              <div class="modal-title">${t.manifest_name||t.repository_manifest?.name||t.full_name||t.name||"unknown"}</div>
              <button class="modal-close" @click=${this._closeDetail}>✕</button>
            </div>
            <div class="modal-body">
              <div class="detail-category" style="background: ${i}">
                ${this._getCategoryLabel(t.category||"integration")}
              </div>

              <div class="detail-desc">${t.description||ue("noDesc")}</div>

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
                  <span class="val">${(t.stars||t.stargazers_count||0).toLocaleString()}</span> ${ue("stars")}
                </div>
                ${t.downloads?H`
                  <div class="detail-stat">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                    <span class="val">${t.downloads.toLocaleString()}</span> ${ue("downloads")}
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
                    <span class="detail-version-label">${ue("currentVersion")}</span>
                    <span class="detail-version-value">${t.installed_version||ue("unknown")}</span>
                  </div>
                  ${a?H`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${ue("availableVersion")}</span>
                      <span class="detail-version-value" style="color:var(--success-color, #0f9d58);">${t.latest_version||ue("unknown")}</span>
                    </div>
                  `:""}
                  ${t.installed_at?H`
                    <div class="detail-version-row" style="margin-top:8px;">
                      <span class="detail-version-label">${ue("installedAt")}</span>
                      <span class="detail-version-value">${new Date(t.installed_at).toLocaleString()}</span>
                    </div>
                  `:""}
                </div>
              `:""}

              <!-- Version Selector -->
              <div class="version-selector">
                <div class="version-selector-header" @click=${this._toggleVersionSelector}>
                  ${ue("selectVersion")}
                  <span class="version-selector-arrow ${this._showVersionSelector?"open":""}">▼</span>
                </div>
                ${this._showVersionSelector?H`
                  <div class="version-selector-body">
                    ${this._releasesLoading?H`
                      <div class="releases-loading">
                        <div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto 8px;"></div>
                        ${ue("loading")}
                      </div>
                    `:0===this._releases.length?H`
                      <div class="releases-empty">${ue("noReleases")}</div>
                    `:this._releases.map(e=>H`
                      <div class="release-item">
                        <div class="release-info">
                          <div class="release-tag">
                            ${e.tag_name||e.tag||"?"}
                            ${e.prerelease?H`<span class="prerelease-badge">${ue("prerelease")}</span>`:""}
                          </div>
                          ${e.published_at||e.created_at?H`
                            <div class="release-date">${ue("publishedAt")} ${new Date(e.published_at||e.created_at).toLocaleDateString()}</div>
                          `:""}
                        </div>
                        <button class="release-install-btn"
                                @click=${()=>this._installVersion(e.tag_name||e.tag)}
                                ?disabled=${this._installingVersion}>
                          ${ue("installVersion")}
                        </button>
                      </div>
                    `)}
                  </div>
                `:""}
              </div>

              <!-- Changelog (What's New) — shown when update is available -->
              ${a?H`
                <div class="detail-changelog">
                  <div class="detail-changelog-title">${ue("changelogTitle")||"更新内容"}</div>
                  ${this._changelogLoading?H`
                    <div class="readme-loading">
                      <div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto 8px;"></div>
                      ${ue("loading")||"加载中..."}
                    </div>
                  `:this._changelogData?H`
                    <div class="changelog-body">${this._changelogData.body}</div>
                    ${this._changelogData.tag?H`
                      <div class="changelog-tag">${this._changelogData.tag}</div>
                    `:""}
                    ${this._changelogData.url?H`
                      <a class="changelog-link" href="${this._changelogData.url}" target="_blank" rel="noopener">${ue("viewFullChangelog")||"查看完整更新日志"} →</a>
                    `:""}
                  `:H`
                    <div class="changelog-empty">${ue("noChangelog")||"暂无更新日志"}</div>
                  `}
                </div>
              `:""}

              <div class="modal-actions">
                ${o?H`
                  ${a?H`
                    <button class="modal-btn primary" @click=${()=>this._modalAction("update")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                      ${ue("update")}
                    </button>
                  `:""}
                  <button class="modal-btn danger" @click=${()=>this._modalAction("uninstall")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    ${ue("remove")}
                  </button>
                `:H`
                  <button class="modal-btn primary" @click=${()=>this._modalAction("install")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ${ue("install")}
                  </button>
                `}
                <button class="modal-btn" @click=${()=>this._modalAction("github")}>
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/></svg>
                  ${ue("openGithub")}
                </button>
              </div>

              <!-- README Section — no max-height, single scroll via modal-body -->
              <div class="detail-readme">
                <div class="detail-readme-title">${ue("readmeTitle")}</div>
                ${this._readmeLoading?H`
                  <div class="readme-loading">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;margin:0 auto 8px;"></div>
                    ${ue("loadingReadme")}
                  </div>
                `:this._readmeHtml?H`
                  <div class="readme-content" .innerHTML=${this._readmeHtml}></div>
                `:H`
                  <div class="readme-error">${ue("readmeLoadFailed")}</div>
                `}
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- Toast container (supports queue) -->
      <div class="toast-container" id="toast-container"></div>
    `}}let Et=null;const Dt=[];let Lt=!1;function Nt(e,t="info"){const o=Et||document.querySelector("hacs-vision-panel"),a=o?.shadowRoot?.querySelector("#toast-container");a?(Dt.push({msg:e,type:t}),Lt||It(a)):console.warn("Toast container not found:",e)}function It(e){if(0===Dt.length)return void(Lt=!1);Lt=!0;const{msg:t,type:o}=Dt.shift(),a=document.createElement("div");a.className="toast",o&&a.classList.add(o),a.textContent=t,e.appendChild(a),requestAnimationFrame(()=>{a.classList.add("show")}),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{a.remove(),It(e)},350)},3e3)}class Mt extends se{static properties={repo:{type:Object},_isFavorite:{type:Boolean,state:!0},_installing:{type:Boolean},_favorites:{type:Array,state:!0}};constructor(){super(),this.repo={},this._isFavorite=!1,this._installing=!1,this._favorites=[]}async connectedCallback(){super.connectedCallback(),await this._loadFavorites()}async _loadFavorites(){try{const e=await ce.getFavorites();this._favorites=Array.isArray(e)?e:e.favorites||[]}catch(e){this._favorites=[]}this._updateFavoriteState()}_updateFavoriteState(){this.repo&&(this._isFavorite=this._favorites.includes(this.repo.id||this.repo.full_name))}willUpdate(e){e.has("repo")&&this.repo&&this._updateFavoriteState()}static styles=r`
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
      overflow: hidden;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar .initials { display: flex; }
    .badge {
      position: absolute; top: 10px; left: 10px;
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600; color: #fff;
      text-transform: uppercase;
    }
    .badge.integration { background: #1565c0; }
    .badge.plugin { background: #7b1fa2; }
    .badge.theme { background: #2e7d32; }
    .badge.appdaemon { background: #e65100; }
    .badge.netdaemon { background: #00838f; }
    .badge.python_script { background: #f9a825; color: #333; }
    .badge.template { background: #6a1b9a; }

    .installed-badge {
      position: absolute; bottom: 10px; left: 10px;
      padding: 4px 10px; border-radius: 6px;
      font-size: 10px; font-weight: 600;
      background: rgba(76,175,80,0.15); color: #4caf50;
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
    }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;_getInitials(e){if(!e)return"?";const t=e.split("/");return(t[t.length-1]||e).charAt(0).toUpperCase()}_getIconUrl(e){const t=e.domain;return t&&"integration"===e.category?`https://brands.home-assistant.io/${t}/icon.png`:null}_getCategoryLabel(e){return{integration:ue("catIntegration"),plugin:ue("catPlugin"),theme:ue("catTheme"),appdaemon:ue("catAppDaemon"),netdaemon:ue("catNetDaemon"),python_script:ue("catPython"),template:ue("catTemplate")}[e]||e}_handleAction(e,t){e.stopPropagation(),this.dispatchEvent(new CustomEvent(t,{detail:{repo:this.repo},bubbles:!0,composed:!0}))}async _handleFavorite(e){e.stopPropagation();const t=this.repo.id||this.repo.full_name,o=[...this._favorites],a=o.indexOf(t);a>=0?(o.splice(a,1),this._isFavorite=!1):(o.push(t),this._isFavorite=!0);try{await ce.setFavorites(o),this._favorites=o}catch(e){this._isFavorite=!this._isFavorite}this.dispatchEvent(new CustomEvent("favorite",{detail:{repo:this.repo,isFavorite:this._isFavorite},bubbles:!0,composed:!0}))}_handleCardClick(){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:this.repo},bubbles:!0,composed:!0}))}render(){const e=this.repo,t=e.manifest_name||e.repository_manifest?.name||e.full_name||e.name||"unknown",o=e.description||"",a=e.category||"integration",i=e.stars||e.stargazers_count||0,r=e.downloads||0,s=e.installed||!1,n=s&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version),l=me(a);return H`
      <div class="card${e.is_custom?" custom-repo":""}" @click=${this._handleCardClick}>
        <div class="img-container">
          <div class="avatar" style="background: ${l}">
            ${this._getIconUrl(e)?H`
              <img src="${this._getIconUrl(e)}" @error=${e=>{e.target.style.display="none",e.target.nextElementSibling.style.display="flex"}} alt="">
              <span class="initials" style="display:none">${this._getInitials(t)}</span>
            `:this._getInitials(t)}
          </div>
          <span class="badge ${a}">${this._getCategoryLabel(a)}</span>
          ${s?H`<span class="installed-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${ue("installed")}</span>`:""}
          <button class="fav-btn ${this._isFavorite?"active":""}"
                  @click=${this._handleFavorite}
                  title=${this._isFavorite?ue("favOn"):ue("favOff")}>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        </div>

        <div class="content">
          <div class="name" title=${t}>${t}</div>
          <div class="fullname">${e.full_name||""}</div>
          <div class="desc">${o||ue("noDesc")}</div>
          <div class="meta">
            <div class="tags">
              <span class="tag">${a}</span>
              ${e.is_custom?H`<span class="custom-tag">${ue("customBadge")}</span>`:""}
              ${e.topics&&e.topics.length?e.topics.slice(0,3).map(e=>H`<span class="topic-tag">${e}</span>`):""}
            </div>
            <span class="stars">
              <svg viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg>
              ${"number"==typeof i?i.toLocaleString():i}
            </span>
            ${r?H`
              <span class="stars">
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/></svg>
                ${r.toLocaleString()}
              </span>
            `:""}
          </div>
        </div>

        <div class="actions">
          <button class="action-btn readme-btn" @click=${e=>this._handleAction(e,"readme")} title="README">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          ${s?H`
            ${n?H`
              <button class="action-btn primary" @click=${e=>this._handleAction(e,"update")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                <span class="label">${ue("update")}</span>
              </button>
            `:""}
            <button class="action-btn" @click=${e=>this._handleAction(e,"uninstall")} style="color:#f44336;border-color:#f44336;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span class="label">${ue("remove")}</span>
            </button>
          `:H`
            <button class="action-btn primary ${this._installing?"installing":""}"
                    @click=${e=>this._handleAction(e,"install")} ?disabled=${this._installing}>
              ${this._installing?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ue("installing")}`:H`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span class="label">${ue("install")}</span>`}
            </button>
          `}
        </div>
      </div>
    `}}customElements.define("repo-card",Mt);const Ot=r`
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
    .search input { padding: 7px 10px 7px 34px; font-size: 13px; border-radius: 8px; }
    .search-icon { width: 14px; height: 14px; left: 8px; }
    .btn { min-height: 44px; display: flex; align-items: center; justify-content: center; }
  }

  @media (max-width: 480px) {
    .grid { grid-template-columns: 1fr; gap: 8px; }
    .controls { flex-wrap: wrap; gap: 4px; }
    .info-bar { flex-wrap: wrap; gap: 4px; font-size: 12px; }
  }
`;class Ut extends se{static properties={_message:{type:String,state:!0},_confirmText:{type:String,state:!0},_cancelText:{type:String,state:!0},_danger:{type:Boolean,state:!0},_visible:{type:Boolean,state:!0}};constructor(){super(),this._message="",this._confirmText=ue("confirm"),this._cancelText=ue("cancel"),this._danger=!1,this._visible=!1,this._resolve=null}static styles=r`
    :host { display: contents; }
    .overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px; padding: 24px;
      max-width: 380px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .message {
      font-size: 15px; color: var(--primary-text-color, #212121);
      line-height: 1.6; margin-bottom: 20px;
    }
    .actions { display: flex; gap: 10px; justify-content: flex-end; }
    .btn {
      padding: 10px 20px; border-radius: 10px;
      font-size: 14px; font-weight: 500; cursor: pointer;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      transition: all 0.2s; touch-action: manipulation;
    }
    .btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn.danger {
      background: #f44336; border-color: #f44336; color: #fff;
    }
    .btn.danger:hover { opacity: 0.9; }
    @media (max-width: 768px) {
      .actions { flex-direction: column-reverse; }
      .btn { width: 100%; text-align: center; min-height: 44px; }
    }
  `;static show(e,{message:t,confirmText:o,cancelText:a,danger:i}={}){let r=e.shadowRoot?.querySelector("confirm-dialog");return r||(r=document.createElement("confirm-dialog"),e.shadowRoot.appendChild(r)),new Promise(e=>{r._resolve=e,r._message=t||"Are you sure?",r._confirmText=o||ue("confirm"),r._cancelText=a||ue("cancel"),r._danger=!!i,r._visible=!0})}_onConfirm(){this._visible=!1,this._resolve&&this._resolve(!0)}_onCancel(){this._visible=!1,this._resolve&&this._resolve(!1)}_onOverlayClick(e){e.target===e.currentTarget&&this._onCancel()}render(){return this._visible?H`
      <div class="overlay" @click=${this._onOverlayClick}>
        <div class="dialog">
          <div class="message">${this._message}</div>
          <div class="actions">
            <button class="btn" @click=${this._onCancel}>${this._cancelText}</button>
            <button class="btn ${this._danger?"danger":""}" @click=${this._onConfirm}>${this._confirmText}</button>
          </div>
        </div>
      </div>
    `:H``}}customElements.define("confirm-dialog",Ut);var Pt=Object.freeze({__proto__:null,ConfirmDialog:Ut});const Bt="hacs_vision_browse_state",Ft="hacs_vision_view_mode";class Ht extends se{static properties={repos:{type:Array},total:{type:Number},search:{type:String},category:{type:String},statusFilter:{type:String},sort:{type:String},sortDir:{type:String},page:{type:Number},loading:{type:Boolean},categoryCounts:{type:Object},statusCounts:{type:Object},viewMode:{type:String},groupBy:{type:String},pageSize:{type:Number},_installingIds:{type:Object,state:!0},_searchText:{type:String,state:!0},_showAddRepo:{type:Boolean,state:!0},_newRepoUrl:{type:String,state:!0},_newRepoCategory:{type:String,state:!0},_addRepoInstalling:{type:Boolean,state:!0},_collapsedGroups:{type:Object,state:!0},_filterExpanded:{type:Boolean,state:!0},_favorites:{type:Array,state:!0},presetFilter:{type:String}};constructor(){super();const e=function(){try{return JSON.parse(localStorage.getItem(Bt)||"{}")}catch{return{}}}();this.repos=[],this.total=0,this.search=e.search||"",this.category=e.category||"",this.statusFilter=e.statusFilter||"",this.sort=e.sort||"stars",this.sortDir=e.sortDir||"desc",this.page=e.page||1,this.loading=!1,this.limit=e.pageSize||50,this.pageSize=this.limit,this.categoryCounts={},this.statusCounts={},this._installingIds={},this._searchTimer=void 0,this._searchText=e.search||"",this.viewMode=localStorage.getItem(Ft)||"card",this.groupBy=e.groupBy||"none",this._showAddRepo=!1,this._newRepoUrl="",this._newRepoCategory="integration",this._addRepoInstalling=!1,this._collapsedGroups={},this._filterExpanded=!1,this._favorites=[],this.statusOptions=[{value:"",label:ue("statusAll")},{value:"installed",label:ue("statusInstalled")},{value:"not_installed",label:ue("statusNotInstalled")},{value:"update_available",label:ue("statusPendingUpgrade")},{value:"favorites",label:ue("statusFavorites")},{value:"new",label:ue("statusNew")},{value:"custom",label:ue("statusCustom")},{value:"pending_restart",label:ue("statusPendingRestart")}],this.typeOptions=[{value:"",label:ue("typeAll")},{value:"integration",label:ue("typeIntegration")},{value:"plugin",label:ue("typePlugin")},{value:"theme",label:ue("typeTheme")},{value:"appdaemon",label:ue("typeAppDaemon")},{value:"netdaemon",label:ue("typeNetDaemon")},{value:"python_script",label:ue("typePython")},{value:"template",label:ue("typeTemplate")}],this.groupOptions=[{value:"none",label:ue("groupNone")},{value:"status",label:ue("groupStatus")},{value:"type",label:ue("groupType")}],this.sortColumns=[{key:"name",label:ue("colName")||"名称",sortable:!0},{key:"downloads",label:ue("colDownloads")||"下载",sortable:!0},{key:"stars",label:ue("colStars")||"星数",sortable:!0},{key:"last_updated",label:ue("colLastUpdated")||"更新时间",sortable:!0},{key:"installed_version",label:ue("colInstalledVer")||"已安装",sortable:!0},{key:"latest_version",label:ue("colAvailableVer")||"可用",sortable:!0},{key:"installed_at",label:ue("colInstalledAt")||"安装时间",sortable:!0},{key:"status",label:ue("colStatus")||"状态",sortable:!0}]}static styles=r`
    ${Ot}

    :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

    /* ===== Controls Bar ===== */
    .controls {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }
    .controls-right {
      display: flex; align-items: center; gap: 6px; flex-shrink: 0;
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
      margin-bottom: 10px; padding: 6px 14px;
      background: var(--secondary-background-color, #f0f0f0);
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

    /* ===== Filter Row ===== */
    .filter-row {
      display: flex; gap: 16px; margin-bottom: 10px; align-items: flex-start;
    }
    .filter-row .filter-group { margin-bottom: 0; flex: 1; min-width: 0; }

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
      .search input { padding: 7px 10px 7px 34px; font-size: 13px; border-radius: 8px; }
      .controls-right { flex-wrap: wrap; }
      .sort-bar { padding: 6px 10px; font-size: 12px; gap: 4px; }
      .sort-chip { padding: 4px 8px; font-size: 11px; }
      .filter-toggle { display: flex; }
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
  `;async connectedCallback(){super.connectedCallback(),await this._loadFavorites(),await this._load(),this.addEventListener("install",e=>this._handleInstall(e.detail.repo)),this.addEventListener("update",e=>this._handleUpdate(e.detail.repo)),this.addEventListener("uninstall",e=>this._handleUninstall(e.detail.repo)),this.addEventListener("detail",e=>this._handleDetail(e.detail.repo)),this.addEventListener("readme",e=>this._handleDetail(e.detail.repo)),this.addEventListener("favorite",()=>this._syncFavoriteCount())}willUpdate(e){if(e.has("presetFilter")){const t=this.presetFilter;if(void 0===e.get("presetFilter")&&""===t)return;this.presetFilter="",this.statusFilter=t,this.page=1,this._persistState(),this._load()}}async _loadFavorites(){try{const e=await ce.getFavorites();this._favorites=Array.isArray(e)?e:e.favorites||[]}catch(e){this._favorites=[]}}_syncFavoriteCount(){this.statusCounts={...this.statusCounts,favorites:this._favorites.length},this.requestUpdate()}_persistState(){!function(e){try{localStorage.setItem(Bt,JSON.stringify(e))}catch{}}({search:this.search,category:this.category,statusFilter:this.statusFilter,sort:this.sort,sortDir:this.sortDir,page:this.page,groupBy:this.groupBy,pageSize:this.pageSize})}async _handleInstall(e){const t=e.id||e.full_name;this._installingIds={...this._installingIds,[t]:!0};try{await ce.install(t,e.category),Nt(`${ue("installComplete")}: ${e.full_name||e.name}`,"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){Nt(`${ue("installFailed")}: ${e.message}`,"error")}delete this._installingIds[t],this._installingIds={...this._installingIds}}async _handleUpdate(e){try{await ce.update([e.id||e.full_name]),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){console.error("Update failed",e)}}async _handleUninstall(e){if(await Ut.show(this,{message:`${ue("confirmRemove")} ${e.full_name||e.name}?`,confirmText:ue("remove"),danger:!0}))try{await ce.remove(e.id||e.full_name),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0})),this._load()}catch(e){console.error("Uninstall failed",e)}}_handleDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}async _load(){this.loading=!0;try{const e=await ce.listRepositories({search:this.search,category:this.category,sort:this.sort,sortDir:this.sortDir,page:this.page,limit:this.limit,status:this.statusFilter});this.repos=e.repositories||[],this.total=e.total||0,this.categoryCounts=e.category_counts||{},this.statusCounts=e.status_counts||{},this.statusCounts={...this.statusCounts,favorites:this._favorites.length}}catch(e){console.error("Browse load error",e),this.repos=[],this.total=0}this.loading=!1}_onSearch(e){this._searchText=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.search=this._searchText,this.page=1,this._persistState(),this._load()},300)}_clearSearch(){this._searchText="",this.search="",this.page=1,this._persistState(),this._load()}_onStatusFilter(e){this.statusFilter=e,this.page=1,this._persistState(),this._load()}_onTypeFilter(e){this.category=e,this.page=1,this._persistState(),this._load()}_onSortColumn(e){this.sort===e?this.sortDir="desc"===this.sortDir?"asc":"desc":(this.sort=e,this.sortDir="name"===e?"asc":"desc"),this.page=1,this._persistState(),this._load()}_onGroupChange(e){this.groupBy=e.target.value,this._persistState()}_onViewModeChange(e){this.viewMode=e;try{localStorage.setItem(Ft,e)}catch{}}_toggleGroup(e){this._collapsedGroups={...this._collapsedGroups,[e]:!this._collapsedGroups[e]}}_goPage(e){this.page=e,this._persistState(),this._load()}_onPageSizeChange(e){this.pageSize=parseInt(e.target.value,10),this.limit=this.pageSize,this.page=1,this._persistState(),this._load()}_refresh(){this.page=1,this._persistState(),this._load()}async _addRepo(){const e=this._parseRepoUrl(this._newRepoUrl);if(e){this._addRepoInstalling=!0;try{const t=await ce.addCustomRepo(e,this._newRepoCategory);t.success?(Nt(`${ue("addSuccess")}: ${e}`,"success"),this._newRepoUrl="",this._showAddRepo=!1,this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))):Nt(`${ue("addFailed")}: ${t.error}`,"error")}catch(e){Nt(`${ue("addFailed")}: ${e.message}`,"error")}this._addRepoInstalling=!1}else Nt(ue("invalidRepoUrl"),"error")}_parseRepoUrl(e){const t=e.match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return t?t[1].replace(/\.git$/,""):/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(e)?e:null}_getRepoStatus(e){return e.id||e.full_name,e.pending_restart?"pending_restart":e.installed&&(e.has_update||e.installed_version&&e.latest_version&&e.installed_version!==e.latest_version)?"pending-upgrade":e.installed?"installed":e.new||"new"===e.status?"new":"default"}_getStatusBadge(e){const t={installed:{label:ue("statusInstalled"),cls:"installed"},"pending-upgrade":{label:ue("statusPendingUpgrade"),cls:"pending-upgrade"},"pending-restart":{label:ue("statusPendingRestart"),cls:"pending-restart"},new:{label:ue("statusNew"),cls:"new"},default:{label:ue("statusDefault"),cls:"default"}}[e]||{label:e,cls:"default"};return H`<span class="status-badge ${t.cls}">${t.label}</span>`}_getStatusLabel(e){return{installed:ue("statusInstalled"),not_installed:ue("statusDefault"),update_available:ue("statusPendingUpgrade"),favorites:ue("statusFavorites"),new:ue("statusNew"),custom:ue("statusCustom"),pending_restart:ue("statusPendingRestart")}[e]||e}_applyFilters(e){return"favorites"===this.statusFilter?e.filter(e=>this._favorites.includes(e.id||e.full_name)):e}_groupRepos(e){if("none"===this.groupBy)return null;const t={};for(const o of e){let e;e="status"===this.groupBy?this._getRepoStatus(o):"type"===this.groupBy&&o.category||"other",t[e]||(t[e]=[]),t[e].push(o)}const o=["pending-restart","pending-upgrade","installed","new","default"],a=["integration","plugin","theme","appdaemon","netdaemon","python_script","template","other"],i=Object.keys(t);return"status"===this.groupBy?i.sort((e,t)=>o.indexOf(e)-o.indexOf(t)):"type"===this.groupBy&&i.sort((e,t)=>a.indexOf(e)-a.indexOf(t)),i.map(e=>({key:e,label:"status"===this.groupBy?this._getStatusLabel(e):this._getCategoryLabel(e),repos:t[e]}))}_getCategoryLabel(e){return{integration:ue("catIntegration"),plugin:ue("catPlugin"),theme:ue("catTheme"),appdaemon:ue("catAppDaemon"),netdaemon:ue("catNetDaemon"),python_script:ue("catPython"),template:ue("catTemplate"),other:e}[e]||e}_formatDate(e){if(!e)return"";try{const t=new Date(e),o=new Date-t,a=Math.floor(o/864e5);return 0===a?ue("today")||"今天":1===a?ue("yesterday")||"昨天":a<30?`${a}d`:a<365?`${Math.floor(a/30)}mo`:`${Math.floor(a/365)}y`}catch{return""}}_renderRepoList(e){return"list"===this.viewMode?H`<div class="list-view">${this._renderListTable(e)}</div>`:H`<div class="grid">${e.map(e=>H`<repo-card .repo=${e} ._installing=${!!this._installingIds?.[e.id||e.full_name]}></repo-card>`)}</div>`}_renderListTable(e){const t=e=>this.sort!==e?"":"desc"===this.sortDir?" ▼":" ▲",o=e=>"sortable "+(this.sort===e?"active-sort":"");return H`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th class="${o("name")}" @click=${()=>this._onSortColumn("name")}>${ue("colName")||"名称"}<span class="sort-arrow">${t("name")}</span></th>
            <th class="${o("downloads")} col-downloads" @click=${()=>this._onSortColumn("downloads")}>${ue("colDownloads")||"下载"}<span class="sort-arrow">${t("downloads")}</span></th>
            <th class="${o("stars")} col-stars" @click=${()=>this._onSortColumn("stars")}>${ue("colStars")||"星数"}<span class="sort-arrow">${t("stars")}</span></th>
            <th class="${o("last_updated")} col-last-updated" @click=${()=>this._onSortColumn("last_updated")}>${ue("colLastUpdated")||"更新"}<span class="sort-arrow">${t("last_updated")}</span></th>
            <th class="${o("installed_version")} col-installed-ver" @click=${()=>this._onSortColumn("installed_version")}>${ue("colInstalledVer")||"已安装"}<span class="sort-arrow">${t("installed_version")}</span></th>
            <th class="${o("latest_version")} col-available-ver" @click=${()=>this._onSortColumn("latest_version")}>${ue("colAvailableVer")||"可用"}<span class="sort-arrow">${t("latest_version")}</span></th>
            <th class="${o("installed_at")} col-installed-at" @click=${()=>this._onSortColumn("installed_at")}>${ue("colInstalledAt")||"安装时间"}<span class="sort-arrow">${t("installed_at")}</span></th>
            <th class="col-status">${ue("colStatus")||"状态"}</th>
            <th class="actions-cell"></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>this._renderListRow(e))}
        </tbody>
      </table>
    `}_renderListRow(e){const t=me(e.category||"integration"),o=e.manifest_name||e.repository_manifest?.name||e.full_name||e.name||"?",a=e.stars||e.stargazers_count||0,i=e.downloads||0,r=this._getRepoStatus(e),s=e.installed||!1,n="pending-upgrade"===r,l=e.id||e.full_name,c=!!this._installingIds?.[l];return H`
      <tr @click=${()=>this._handleDetail(e)}>
        <td class="col-icon"><div class="icon-cell" style="background:${t}">
          ${e.domain&&"integration"===e.category?H`
              <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
              <span style="display:none">${o.charAt(0).toUpperCase()}</span>
            `:o.charAt(0).toUpperCase()}
        </div></td>
        <td class="name-cell">${o}<br><span class="desc-cell">${e.description||""}</span>
          ${e.is_custom?H`<span class="custom-tag-list">${ue("customBadge")}</span>`:""}
          ${e.topics&&e.topics.length?H`<br><span class="topic-chips">${e.topics.slice(0,4).map(e=>H`<span class="topic-chip">${e}</span>`)}</span>`:""}
        </td>
        <td class="num-cell col-downloads">${i?i.toLocaleString():"-"}</td>
        <td class="num-cell col-stars"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14" style="vertical-align:middle;"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${"number"==typeof a?a.toLocaleString():a}</td>
        <td class="ver-cell col-last-updated">${this._formatDate(e.last_updated)}</td>
        <td class="ver-cell col-installed-ver">${s&&e.installed_version||"-"}</td>
        <td class="ver-cell col-available-ver">${e.latest_version||"-"}</td>
        <td class="ver-cell col-installed-at">${e.installed_at?this._formatDate(e.installed_at):"-"}</td>
        <td class="status-cell col-status">${this._getStatusBadge(r)}</td>
        <td class="actions-cell">
          ${s?H`
            ${n?H`<button class="action-sm primary" @click=${t=>{t.stopPropagation(),this._handleUpdate(e)}}>${ue("update")}</button>`:""}
          `:H`
            <button class="action-sm primary ${c?"installing":""}" @click=${t=>{t.stopPropagation(),this._handleInstall(e)}} ?disabled=${c}>${c?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:ue("install")}</button>
          `}
        </td>
      </tr>
    `}render(){const e=Math.ceil(this.total/this.limit),t=this._applyFilters(this.repos),o=this._groupRepos(t);return H`
      <!-- Controls: Search + Action Buttons -->
      <div class="controls">
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="${ue("searchPlaceholder")}" .value=${this._searchText} @input=${this._onSearch} />
          ${this.search?H`<button class="search-clear" @click=${this._clearSearch}>✕</button>`:""}
        </div>
        <div class="controls-right">
          <div class="view-toggle">
            <button class="view-toggle-btn ${"card"===this.viewMode?"active":""}" @click=${()=>this._onViewModeChange("card")} title="${ue("viewCard")}">${ue("viewCard")}</button>
            <button class="view-toggle-btn ${"list"===this.viewMode?"active":""}" @click=${()=>this._onViewModeChange("list")} title="${ue("viewList")}">${ue("viewList")}</button>
          </div>
          <select class="group-select" @change=${this._onGroupChange} .value=${this.groupBy}>
            ${this.groupOptions.map(e=>H`<option value=${e.value}>${ue("groupBy")}: ${e.label}</option>`)}
          </select>
          <button class="refresh-btn" @click=${this._refresh} title="${ue("refreshTitle")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>
          <button class="btn primary" style="padding:6px 12px;font-size:12px;min-height:36px;" @click=${()=>{this._showAddRepo=!this._showAddRepo}}>${ue("addCustomRepo")}</button>
        </div>
      </div>

      <!-- Add Custom Repo Form -->
      ${this._showAddRepo?H`
        <div class="add-repo-form">
          <div class="form-row">
            <input class="form-input" type="text" placeholder="${ue("repoUrl")}" .value=${this._newRepoUrl} @input=${e=>{this._newRepoUrl=e.target.value}} @keydown=${e=>{"Enter"===e.key&&this._addRepo()}}>
            <select class="form-select" .value=${this._newRepoCategory} @change=${e=>{this._newRepoCategory=e.target.value}}>
              <option value="integration">${ue("catIntegration")}</option><option value="plugin">${ue("catPlugin")}</option>
              <option value="theme">${ue("catTheme")}</option><option value="appdaemon">${ue("catAppDaemon")}</option>
              <option value="python_script">${ue("catPython")}</option><option value="template">${ue("catTemplate")}</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn primary" @click=${this._addRepo} ?disabled=${this._addRepoInstalling}>${this._addRepoInstalling?ue("installing"):ue("add")}</button>
            <button class="btn" @click=${()=>{this._showAddRepo=!1}}>${ue("cancel")}</button>
          </div>
        </div>
      `:""}

      <!-- Filter Toggle (mobile: tap to expand) -->
      <button class="filter-toggle" @click=${()=>{this._filterExpanded=!this._filterExpanded}}>
        <span>${ue("filterStatus")||"筛选"} / ${ue("filterType")||"类型"}</span>
        <span class="active-filters">
          ${this.statusFilter?H`<span class="active-filter-tag">${this._getStatusLabel(this.statusFilter)}</span>`:""}
          ${this.category?H`<span class="active-filter-tag">${this._getCategoryLabel(this.category)}</span>`:""}
        </span>
        <span class="toggle-arrow ${this._filterExpanded?"expanded":""}">▼</span>
      </button>

      <!-- Filters: Status + Type in one row on desktop -->
      <div class="filter-row ${this._filterExpanded?"expanded":""}">
        <div class="filter-group">
          <div class="filter-label">${ue("filterStatus")}</div>
          <div class="filter-chips">
            ${this.statusOptions.map(e=>H`
              <button class="filter-chip ${this.statusFilter===e.value?"active":""}" @click=${()=>this._onStatusFilter(e.value)}>${e.label}${void 0!==this.statusCounts[e.value]?H`<span class="chip-count">${this.statusCounts[e.value]}</span>`:""}</button>
            `)}
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">${ue("filterType")}</div>
          <div class="filter-chips">
            ${this.typeOptions.map(e=>H`
              <button class="filter-chip ${this.category===e.value?"active":""}" @click=${()=>this._onTypeFilter(e.value)}>
                ${e.label}${void 0!==this.categoryCounts[e.value]?H`<span class="chip-count">${this.categoryCounts[e.value]}</span>`:""}
              </button>
            `)}
          </div>
        </div>
      </div>

      <!-- Sort Bar (always visible, both card and list mode) -->
      <div class="sort-bar">
        <div class="sort-chips">
          ${this.sortColumns.map(e=>H`
            <button class="sort-chip ${this.sort===e.key?"active":""}" @click=${()=>this._onSortColumn(e.key)}>
              ${e.label}${this.sort===e.key?H`<span class="sort-dir">${"desc"===this.sortDir?"▼":"▲"}</span>`:""}
            </button>
          `)}
        </div>
      </div>

      <!-- Content -->
      ${this.loading?H`
        <div class="loading"><div class="spinner"></div><div>${ue("loading")}</div></div>
      `:0===t.length?H`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div>${this.search?ue("noMatch"):ue("noData")}</div>
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
            <button class="page-btn" ?disabled=${this.page<=1} @click=${()=>this._goPage(this.page-1)}>${ue("prevPage")}</button>
            <span class="page-info">${ue("page")} ${this.page} / ${e}</span>
            <button class="page-btn primary" ?disabled=${this.page>=e} @click=${()=>this._goPage(this.page+1)}>${ue("nextPage")}</button>
            <select class="page-size-select" .value=${String(this.pageSize)} @change=${this._onPageSizeChange}>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        `:""}
      `}
    `}}customElements.define("browse-view",Ht);class jt extends se{static properties={updates:{type:Array},loading:{type:Boolean},updating:{type:Boolean},search:{type:String},_installingIds:{type:Object,state:!0},_changelogs:{type:Object,state:!0},_searchText:{type:String,state:!0},_selectedIds:{type:Object,state:!0},_viewMode:{type:String,state:!0}};constructor(){super(),this.updates=[],this.loading=!1,this.updating=!1,this.search="",this._searchTimer=null,this._installingIds={},this._changelogs={},this._searchText="",this._selectedIds={};const e=localStorage.getItem("hacs_vision_view_mode");this._viewMode=e||"card"}static styles=[Ot,r`
      :host { display: block; touch-action: manipulation; background: var(--primary-background-color); }

      .search { min-width: 160px; }

      .card {
        border: 1px solid var(--divider-color); border-radius: 14px;
        background: var(--card-background-color); overflow: hidden;
        padding: 16px; transition: all 0.2s; cursor: pointer;
        display: flex; flex-direction: column; min-height: 220px;
      }
      .card:hover { border-color: var(--primary-color); }

      .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
      .card-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
      .card-name { font-size: 14px; font-weight: 600; color: var(--primary-text-color); word-break: break-all; }
      .card-name .category-badge {
        display: inline-block; font-size: 9px; padding: 2px 7px;
        border-radius: 4px; background: rgba(var(--rgb-primary-color), 0.08);
        color: var(--primary-color); margin-left: 6px; vertical-align: middle;
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
      .select-all {
        display: flex; align-items: center; gap: 6px;
        font-size: 12px; color: var(--secondary-text-color); cursor: pointer;
        touch-action: manipulation; user-select: none;
      }
      .select-all:hover { color: var(--primary-text-color); }

      .btn.primary { width: 100%; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: auto; }
      .btn.primary:hover { opacity: 0.9; }
      /* F3: Progress button pulse */
      .btn.primary.installing {
        opacity: 0.7; cursor: not-allowed;
        animation: btnPulse 1.5s infinite;
      }
      @keyframes btnPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.45; } }

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

      .update-all-bar {
        display: flex; justify-content: flex-end; margin-bottom: 12px;
      }
      .update-all-btn {
        padding: 10px 20px; border-radius: 10px;
        background: var(--primary-color); color: #fff; border: none;
        font-size: 13px; font-weight: 600; cursor: pointer;
        display: flex; align-items: center; gap: 6px; transition: opacity 0.2s;
        touch-action: manipulation;
      }
      .update-all-btn:hover { opacity: 0.9; }
      .update-all-btn:disabled { opacity: 0.5; cursor: not-allowed; }

      @media (max-width: 768px) {
        .search { min-width: 0; }
        .card { padding: 12px; }
        .version-row { gap: 8px; }
        .version-item { padding: 6px; }
        .version-label { font-size: 9px; }
        .version-value { font-size: 12px; }
        .card-desc { font-size: 11px; margin-bottom: 10px; }
        .btn.primary { min-height: 44px; }
        .update-all-bar { justify-content: stretch; }
        .update-all-btn { width: 100%; justify-content: center; min-height: 44px; }
      }
    `];async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){this.loading=!0;try{const e=await ce.getUpdates();this.updates=Array.isArray(e)?e:e.updates||[],this._loadChangelogs()}catch(e){console.error("Failed to load updates",e),this.updates=[]}this.loading=!1}async _loadChangelogs(){const e=this.updates.filter(e=>e.full_name);if(0===e.length)return;const t=await Promise.allSettled(e.map(e=>ce.getChangelog(e.full_name).then(t=>({fullName:e.full_name,data:t})))),o={};for(const e of t)"fulfilled"===e.status&&e.value.data?.body&&(o[e.value.fullName]=e.value.data);Object.keys(o).length>0&&(this._changelogs={...this._changelogs,...o})}async _updateSelected(){const e=Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]);if(0===e.length)return;if(await Ut.show(this,{message:`${ue("confirmUpdateAll")} ${e.length}?`,confirmText:ue("confirmUpdate"),danger:!1})){this.updating=!0;try{await ce.update(e),Nt(`${ue("allUpdatesStarted")} (${e.length})`,"success"),this._selectedIds={},this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Nt(`${ue("updateFailed")}: ${e.message}`,"error")}this.updating=!1}}_toggleSelect(e){this._selectedIds={...this._selectedIds,[e]:!this._selectedIds[e]}}_toggleSelectAll(){const e=this._getFiltered();if(this._isAllSelected())this._selectedIds={};else{const t={};for(const o of e)t[o.id||o.full_name]=!0;this._selectedIds=t}}_isAllSelected(){const e=this._getFiltered();return 0!==e.length&&e.every(e=>this._selectedIds[e.id||e.full_name])}_selectedCount(){return Object.keys(this._selectedIds).filter(e=>this._selectedIds[e]).length}async _updateOne(e){const t=e.id||e.full_name;this._installingIds={...this._installingIds,[t]:!0};try{await ce.update([t]);const o=e.latest_version;let a=0;const i=async()=>{if(a++>30)return this._installingIds={...this._installingIds},delete this._installingIds[t],void Nt(`${ue("installFailed")}: timeout`,"error");try{const a=await ce.getRepoStatus(t);if(a?.installed_version===o||a?.installed&&!a?.has_update)return this._installingIds={...this._installingIds},delete this._installingIds[t],Nt(`${ue("updateComplete")}: ${e.full_name||e.name}`,"success"),this._load(),void this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){}setTimeout(i,2e3)};setTimeout(i,2e3)}catch(e){this._installingIds={...this._installingIds},delete this._installingIds[t],Nt(`${ue("updateFailed")}: ${e.message}`,"error")}}_getFiltered(){if(!this.search)return this.updates;const e=this.search.toLowerCase();return this.updates.filter(t=>(t.full_name||t.name||"").toLowerCase().includes(e))}_clearSearch(){this._searchText="",this.search="",this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_openDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}_setViewMode(e){this._viewMode=e;try{localStorage.setItem("hacs_vision_view_mode",e)}catch{}}_getCategoryColor(e){return{integration:"#1565c0",plugin:"#7b1fa2",theme:"#2e7d32",python_script:"#f9a825",template:"#6a1b9a",appdaemon:"#e65100",netdaemon:"#00838f",dashboard:"#f57f17"}[e]||"#78909c"}_renderListTable(e){return H`
      <table class="list-table">
        <thead>
          <tr>
            <th class="col-icon"></th>
            <th>${ue("colName")||"名称"}</th>
            <th>${ue("currentVersion")}</th>
            <th>${ue("latestVersion")}</th>
            <th>${ue("colStatus")||"状态"}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(e=>this._renderListRow(e))}
        </tbody>
      </table>
    `}_renderListRow(e){const t=e.id||e.full_name,o=!!this._installingIds?.[t],a=!!this._selectedIds[t],i=e.manifest_name||e.name||e.full_name||"?",r=this._getCategoryColor(e.category),s=e.domain;return H`
      <tr @click=${t=>{t.target.closest(".btn")||t.target.closest("a")||t.target.closest(".checkbox")||this._openDetail(e)}}>
        <td class="col-icon">
          <div class="icon-cell" style="background:${r}">
            ${s&&"integration"===e.category?H`
                <img src="https://brands.home-assistant.io/${s}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextElementSibling.style.display="flex"}}>
                <span style="display:none">${i.charAt(0).toUpperCase()}</span>
              `:i.charAt(0).toUpperCase()}
          </div>
        </td>
        <td>
          <div class="name-cell">${i}</div>
          ${e.description?H`<div class="desc-cell">${e.description}</div>`:""}
          ${e.is_custom?H`<span class="custom-tag-list">${ue("customBadge")}</span>`:""}
          ${e.topics&&e.topics.length?H`<div class="topic-chips">${e.topics.slice(0,4).map(e=>H`<span class="topic-chip">${e}</span>`)}</div>`:""}
        </td>
        <td style="font-size:12px;color:var(--warning-color);white-space:nowrap;">${e.installed_version||"?"}</td>
        <td style="font-size:12px;color:var(--success-color);white-space:nowrap;">${e.latest_version||"?"}</td>
        <td><span class="status-badge pending-upgrade">${ue("statusPendingUpgrade")}</span></td>
        <td style="white-space:nowrap;">
          <input type="checkbox" class="checkbox" .checked=${a}
                 @click=${e=>e.stopPropagation()}
                 @change=${()=>this._toggleSelect(t)} style="margin-right:6px;">
          <button class="btn primary ${o?"installing":""}" style="padding:4px 10px;font-size:11px;"
                  @click=${t=>{t.stopPropagation(),this._updateOne(e)}} ?disabled=${o||this.updating}>
            ${o?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${ue("updateNow")}`}
          </button>
        </td>
      </tr>
    `}render(){const e=this._getFiltered();return H`
      <div class="controls">
        <div class="search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="${ue("searchUpdates")}" .value=${this._searchText||""}
                 @input=${e=>{this._searchText=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=setTimeout(()=>{this.search=this._searchText},300)}}>
          ${this.search?H`
            <button class="search-clear" @click=${this._clearSearch}>✕</button>
          `:""}
        </div>
        <div class="view-toggle">
          <button class="view-toggle-btn ${"card"===this._viewMode?"active":""}" @click=${()=>this._setViewMode("card")} title="${ue("viewCard")}">${ue("viewCard")}</button>
          <button class="view-toggle-btn ${"list"===this._viewMode?"active":""}" @click=${()=>this._setViewMode("list")} title="${ue("viewList")}">${ue("viewList")}</button>
        </div>
      </div>

      ${this.loading?H`
        <div class="loading"><div class="spinner"></div><div>${ue("checkingUpdates")}</div></div>
      `:0===this.updates.length?H`
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div>${ue("allUpToDate")}</div>
        </div>
      `:H`
        <div class="info-bar">
          <div style="display:flex;align-items:center;gap:8px;">
            <label class="select-all">
              <input type="checkbox" class="checkbox" .checked=${this._isAllSelected()}
                     @click=${e=>e.stopPropagation()}
                     @change=${this._toggleSelectAll}>
              ${ue("selectAll")||"全选"}
            </label>
            <span>${ue("totalPrefix")} <span class="count">${this.updates.length}</span> ${ue("totalUpdates")}</span>
          </div>
          <button class="btn" @click=${this._load}>
            <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${ue("refresh")}
          </button>
        </div>

        ${this.updates.length>1?H`
          <div class="update-all-bar">
            <button class="update-all-btn" @click=${this._updateSelected} ?disabled=${this.updating||0===this._selectedCount()}>
              <svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${this.updating?ue("updatingProgress"):`${ue("updateAll")} (${this._selectedCount()||0})`}
            </button>
          </div>
        `:""}

        ${"list"===this._viewMode?H`
          <div class="list-view">${this._renderListTable(e)}</div>
        `:H`
          <div class="grid">
            ${e.map(e=>{const t=e.id||e.full_name,o=!!this._installingIds?.[t],a=this._changelogs?.[e.full_name],i=!!this._selectedIds[t];return H`
              <div class="card" @click=${t=>{t.target.closest(".btn")||t.target.closest("a")||t.target.closest(".checkbox")||this._openDetail(e)}}>
                <div class="card-header">
                  <div class="card-left">
                    <input type="checkbox" class="checkbox" .checked=${i}
                           @click=${e=>e.stopPropagation()}
                           @change=${()=>this._toggleSelect(t)}>
                    <div class="card-name">
                      ${e.name||e.full_name}
                      ${e.category?H`<span class="category-badge">${e.category}</span>`:""}
                    </div>
                  </div>
                </div>
                <div class="version-row">
                  <div class="version-item">
                    <div class="version-label">${ue("currentVersion")}</div>
                    <div class="version-value old">${e.installed_version||"?"}</div>
                  </div>
                  <div class="version-item">
                    <div class="version-label">${ue("latestVersion")}</div>
                    <div class="version-value new">${e.latest_version||"?"}</div>
                  </div>
                </div>
                <div class="card-desc">${e.description||""}</div>

                ${a?.body?H`
                  <div class="changelog-preview">
                    <div class="changelog-preview-title">${ue("changelogTitle")} ${a.tag?H`<small>(${a.tag})</small>`:""}</div>
                    <div class="changelog-preview-body">${a.body}</div>
                    <a class="changelog-preview-link" href="${a.url||`https://github.com/${e.full_name}/releases`}" target="_blank" rel="noopener">${ue("viewFullChangelog")} →</a>
                  </div>
                `:""}

                <button class="btn primary ${o?"installing":""}"
                        @click=${()=>this._updateOne(e)} ?disabled=${o||this.updating}>
                  ${o?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ue("updatingProgress")}`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${ue("updateNow")}`}
                </button>
              </div>
            `})}
          </div>
        `}
      `}
    `}}customElements.define("updates-view",jt);
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const Vt=1;class Gt{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}
/**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const Wt=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends Gt{constructor(e){if(super(e),e.type!==Vt||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const a=!!t[e];a===this.st.has(e)||this.nt?.has(e)||(a?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return j}});class qt extends se{static properties={customRepos:{type:Array},archivedRepos:{type:Array},ignoredRepos:{type:Array},renamedEntries:{type:Array},loading:{type:Boolean},_customRepoUrl:{type:String},_customRepoCategory:{type:String},_showAddCustom:{type:Boolean},_addingCustom:{type:Boolean},erLoading:{type:Boolean},iLoading:{type:Boolean},importing:{type:Boolean},exporting:{type:Boolean},_viewMode:{type:String},_collapsed:{type:Object},_renamedRefreshing:{type:Boolean},_depResults:{type:Object},_depLoading:{type:Boolean},_customRepoSearch:{type:String},_customRepoSort:{type:String}};constructor(){super(),this.customRepos=[],this.archivedRepos=[],this.ignoredRepos=[],this.renamedEntries=[],this.loading=!1,this.exporting=!1,this.importing=!1,this._depResults=null,this._depLoading=!1,this._renamedRefreshing=!1,this._showAddCustom=!1,this._customRepoUrl="",this._customRepoCategory="integration",this._addingCustom=!1,this._viewMode="card",this._customRepoSearch="",this._customRepoSort="name",this._collapsed={customRepos:!1,archived:!1,ignored:!1,tools:!1}}static styles=r`
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

    /* ===== Search ===== */
    .search { position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 10px; width: 16px; height: 16px; color: var(--secondary-text-color); pointer-events: none; }
    .search input {
      width: 100%; padding: 8px 12px 8px 34px; border: 1px solid var(--divider-color);
      border-radius: 10px; font-size: 13px; background: var(--card-background-color);
      color: var(--primary-text-color); outline: none; transition: border-color 0.2s;
      box-sizing: border-box; font-family: inherit;
    }
    .search input:focus { border-color: var(--primary-color); }
    .search input::placeholder { color: var(--secondary-text-color); }
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

    /* ===== View Toggle ===== */
    .view-toggle {
      display: flex; gap: 2px;
      background: var(--secondary-background-color, #f0f0f0);
      border-radius: 8px; padding: 2px; flex-shrink: 0;
    }
    .view-toggle button {
      border: none; background: none; padding: 4px 10px; border-radius: 6px;
      cursor: pointer; font-size: 11px; color: var(--secondary-text-color);
      transition: all 0.2s; font-family: inherit;
    }
    .view-toggle button.active {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

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
    .category-badge.integration { background: #e8f5e9; color: #2e7d32; }
    .category-badge.plugin { background: #fff3e0; color: #e65100; }
    .category-badge.theme { background: #f3e5f5; color: #7b1fa2; }
    .category-badge.python_script { background: #e3f2fd; color: #1565c0; }
    .category-badge.template { background: #fce4ec; color: #c62828; }
    .category-badge.appdaemon { background: #e0f2f1; color: #00695c; }
    .category-badge.netdaemon { background: #ede7f6; color: #4527a0; }
    .category-badge.dashboard { background: #fff8e1; color: #f57f17; }

    .renamed-badge {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;
      background: #fff3e0; color: #e65100; letter-spacing: 0.3px;
    }
    .custom-badge-tag { font-size: 10px; padding: 1px 6px; border-radius: 4px; background: #ff6f00; color: #fff; font-weight: 700; display: inline-flex; align-items: center; }
    .section-badge {
      display: inline-flex; align-items: center; padding: 2px 10px;
      border-radius: 10px; font-size: 11px; font-weight: 500;
      background: var(--primary-color); color: #fff;
    }

    /* ===== Card View ===== */
    .repo-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
    .btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }
    .btn.primary:hover { opacity: 0.9; }
    .btn.danger { color: #f44336; border-color: #f44336; }
    .btn.danger:hover { background: #f44336; color: #fff; }
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

    .empty { font-size: 13px; color: var(--secondary-text-color); padding: 8px 0; }

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

    /* ===== Dep Check Results ===== */
    .dep-panel {
      margin-top:12px;padding:12px 14px;border-radius:10px;font-size:13px;
      background:var(--secondary-background-color);
    }
    .dep-summary { display:flex;justify-content:space-between;align-items:center;margin-bottom:8px; }
    .dep-summary .title { font-weight:600;color:var(--primary-text-color); }
    .dep-summary .issues { color:#f44336;font-weight:600; }
    .dep-item {
      margin-top:8px;padding:10px 12px;border-radius:8px;
      background:var(--card-background-color);border:1px solid var(--divider-color);
    }
    .dep-item .repo { font-weight:500;color:var(--primary-text-color);margin-bottom:4px; }
    .dep-item .missing { font-size:11px;color:#f44336; }
    .dep-ok { color:var(--success-color,#0f9d58);font-weight:500; }

    .mini-icon { width: 14px; height: 14px; vertical-align: -2px; display: inline; flex-shrink: 0; }
    .mini-icon.spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* ===== Mobile ===== */
    @media (max-width: 768px) {
      .section { padding: 14px; border-radius: 12px; }
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
    }
  `;async connectedCallback(){super.connectedCallback(),await this._load()}async _load(){this.loading=!0;try{const e=await ce.getConfig()||{};this.archivedRepos=e.archived_repositories||[],this.ignoredRepos=e.ignored_repositories||[],this.renamedEntries=Object.entries(e.renamed_repositories||{});const t=await ce.getCustomRepos();this.customRepos=Array.isArray(t)?t:t.custom_repositories||[]}catch(e){console.error("Config load error",e)}this.loading=!1}async _removeArchivedRepo(e){if(await Ut.show(this,{message:`${ue("confirmRemoveArchived")} ${e}?`,confirmText:ue("removeArchived"),danger:!0}))try{await ce.removeArchivedRepo(e),this._load()}catch(e){Nt(`${ue("removeRepoFailed")}: ${e.message}`,"error")}}async _removeRenamedRepo(e){if(await Ut.show(this,{message:`${ue("confirmRemoveRenamed")} ${e}?`,confirmText:ue("removeRenamed"),danger:!0}))try{await ce.removeRenamedRepo(e),this._load()}catch(e){Nt(`${ue("removeRepoFailed")}: ${e.message}`,"error")}}async _replaceRenamedOneClick(e,t){if(await Ut.show(this,{message:`${ue("confirmReplaceRenamed")}: ${e} → ${t}${ue("replaceRenamedWarning")}?`,confirmText:ue("replace"),danger:!0})){this._renamedRefreshing=!0;try{await ce.replaceRenamedRepo(e,t),Nt(`${ue("replace")}: ${e} → ${t}`,"success"),await ce.refresh(),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Nt(`${ue("updateFailed")}: ${e.message}`,"error")}this._renamedRefreshing=!1}}async _checkDependencies(){this._depLoading=!0;try{const e=await ce.checkDependencies();this._depResults=e,e.all_ok?Nt(ue("depOk"),"success"):Nt(`${ue("depMissing")} (${e.issues_count})`,"error")}catch(e){this._depResults=null,Nt(`${ue("checkFailed")}: ${e.message}`,"error")}this._depLoading=!1}_depMissingCount(){return this._depResults?.dependencies?this._depResults.dependencies.filter(e=>e.has_issues).length:0}async _export(){this.exporting=!0;try{const e=await ce.exportBackup(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),o=URL.createObjectURL(t),a=document.createElement("a");a.href=o,a.download=`hacs-vision-backup-${(new Date).toISOString().slice(0,10)}.json`,a.click(),URL.revokeObjectURL(o),Nt(ue("exportSuccess"),"success")}catch(e){Nt(`${ue("exportFailed")}: ${e.message}`,"error")}this.exporting=!1}async _import(){const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=async()=>{const t=e.files[0];if(t){this.importing=!0;try{const e=await t.text(),o=JSON.parse(e);await ce.importBackup(o),Nt(ue("importSuccess"),"success"),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Nt(`${ue("importFailed")}: ${e.message}`,"error")}this.importing=!1}},e.click()}_toggleAddCustom(){this._showAddCustom=!this._showAddCustom,this._showAddCustom||(this._customRepoUrl="",this._customRepoCategory="integration")}_parseRepoUrl(e){const t=(e=e.trim()).match(/github\.com\/([^/]+\/[^/\s?#]+)/i);return t?t[1].replace(/\.git$/,""):/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(e)?e:null}async _addCustomRepo(){const e=this._parseRepoUrl(this._customRepoUrl);if(!e)return void Nt(ue("invalidRepoUrl"),"error");const t=this.customRepos.some(t=>(t.full_name||t.repository)===e);if(t)Nt(`${e} ${ue("alreadyExists")}`,"error");else{this._addingCustom=!0;try{const t=await ce.addCustomRepo(e,this._customRepoCategory);t.success?(Nt(`${ue("addSuccess")}: ${e}`,"success"),this._customRepoUrl="",this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))):Nt(`${ue("addFailed")}: ${t.error}`,"error")}catch(e){Nt(`${ue("addFailed")}: ${e.message}`,"error")}this._addingCustom=!1}}async _removeCustomRepo(e,t){if(await Ut.show(this,{message:`${ue("confirmRemoveRepo")} ${e}?`,confirmText:ue("removeRepo"),danger:!0}))try{const t=await ce.removeCustomRepo(e);t&&!1===t.success&&Nt(`${ue("removeRepoFailed")}: ${t.error}`,"error"),this._load(),this.dispatchEvent(new CustomEvent("refresh-stats",{bubbles:!0,composed:!0}))}catch(e){Nt(`${ue("removeRepoFailed")}: ${e.message}`,"error")}}_toggleSection(e){this._collapsed={...this._collapsed,[e]:!this._collapsed[e]}}_setViewMode(e){this._viewMode=e}_openCardDetail(e){this.dispatchEvent(new CustomEvent("detail",{detail:{repo:e},bubbles:!0,composed:!0}))}_getFilteredCustomRepos(){let e=[...this.customRepos];const t=(this._customRepoSearch||"").toLowerCase();t&&(e=e.filter(e=>{const o=(e.manifest_name||e.name||e.full_name||"").toLowerCase(),a=(e.description||"").toLowerCase();return o.includes(t)||a.includes(t)}));const o=this._customRepoSort||"name";return"stars"===o?e.sort((e,t)=>(t.stargazers_count||0)-(e.stargazers_count||0)):"updated"===o?e.sort((e,t)=>(t.last_updated||"").localeCompare(e.last_updated||"")):e.sort((e,t)=>(e.manifest_name||e.name||e.full_name||"").localeCompare(t.manifest_name||t.name||t.full_name||"")),e}_getInitials(e){if(!e)return"?";const t=e.split("/");return(t[t.length-1]||e).charAt(0).toUpperCase()}_getCategoryColor(e){return{integration:"#1565c0",plugin:"#7b1fa2",theme:"#2e7d32",python_script:"#f9a825",template:"#6a1b9a",appdaemon:"#e65100",netdaemon:"#00838f",dashboard:"#f57f17"}[e]||"#78909c"}_getCategoryLabel(e){return{integration:ue("catIntegration"),plugin:ue("catPlugin"),theme:ue("catTheme"),appdaemon:ue("catAppDaemon"),netdaemon:ue("catNetDaemon"),python_script:ue("catPython"),template:ue("catTemplate"),dashboard:ue("catDashboard")}[e]||e}_renderCard(e,t){const o=e.full_name||e.repository,a=e.manifest_name||e.name||o,i=t.find(([e,t])=>t===o),r=!!i,s=r?i[0]:null,n=e.installed_version||"",l=e.latest_version||"",c=e.has_update,d=e.stargazers_count||0,p=e.description||"",h=e.installed||!1,u=this._getCategoryColor(e.category);return H`
      <div class="repo-card" @click=${()=>this._openCardDetail(e)}>
        <div class="repo-card-img" style="background:linear-gradient(135deg, ${u}44 0%, ${u}22 100%);">
          <div class="repo-card-avatar" style="background:${u}">
            ${e.domain&&"integration"===e.category?H`
              <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
              <span style="display:none">${this._getInitials(a)}</span>
            `:this._getInitials(a)}
          </div>
          <span class="repo-card-badge-cat" style="background:${u}">
            ${this._getCategoryLabel(e.category)}
          </span>
          ${e.is_custom?H`<span class="repo-card-custom">${ue("customBadge")}</span>`:""}
          ${r?H`<span class="repo-card-renamed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${s}</span>`:""}
          ${h?H`<span class="repo-card-installed"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${ue("installed")}</span>`:""}
          <div class="repo-card-actions-img">
            <button class="btn-icon" @click=${t=>{t.stopPropagation(),this._removeCustomRepo(o,e.category)}} title="${ue("removeRepo")}">
              ✕
            </button>
          </div>
        </div>
        <div class="repo-card-body">
          <div class="name" title=${a}>${a}</div>
          <div class="fullname">${o}</div>
          <div class="desc">${p||ue("noDesc")}</div>
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
            `:H`<span class="repo-not-installed">${ue("notInstalled")}</span>`}
          </div>
        </div>
      </div>
    `}_renderListItem(e,t){const o=e.full_name||e.repository,a=e.manifest_name||e.name||o,i=t.find(([e,t])=>t===o),r=!!i,s=r?i[0]:null,n=e.installed_version||"",l=e.latest_version||"",c=e.has_update,d=e.stargazers_count||0,p=e.description||"";return H`
      <div class="repo-item" @click=${()=>this._openCardDetail(e)}>
        <div class="col-icon">
          <div class="icon-cell" style="background:${this._getCategoryColor(e.category)}">
            ${e.domain&&"integration"===e.category?H`
                <img src="https://brands.home-assistant.io/${e.domain}/icon.png" style="width:100%;height:100%;object-fit:cover;" @error=${e=>{e.target.style.display="none",e.target.nextSibling.style.display="flex"}}>
                <span style="display:none">${a.charAt(0).toUpperCase()}</span>
              `:a.charAt(0).toUpperCase()}
          </div>
        </div>
        <div class="repo-info">
          <div class="repo-top">
            <span class="repo-name">${a}</span>
            <span class="category-badge ${e.category}">${this._getCategoryLabel(e.category)}</span>
            ${e.is_custom?H`<span class="custom-badge-tag">${ue("customBadge")}</span>`:""}
            ${r?H`<span class="renamed-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${s}</span>`:""}
          </div>
          <div class="repo-meta">
            <span class="repo-fullname">${o}</span>
            <span class="stars" style="color:#f9a825;"><svg viewBox="0 0 20 20" fill="#ff9800" width="14" height="14"><path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.71.9 5.26L10 13.27l-4.7 2.46.9-5.26L2.4 6.7l5.2-.86L10 1z"/></svg> ${d>0?"number"==typeof d?d.toLocaleString():d:0}</span>
            ${e.installed?H`
              <span class="repo-version"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${n}</span>
              ${c?H`<span class="update-badge"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> ${l}</span>`:""}
            `:H`<span class="repo-not-installed">${ue("notInstalled")}</span>`}
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
          ${r?H`
            <button class="btn primary sm" @click=${e=>{e.stopPropagation(),this._replaceRenamedOneClick(s,o)}} ?disabled=${this._renamedRefreshing}>
              ${this._renamedRefreshing?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`:ue("replace")}
            </button>
            <button class="btn danger sm" @click=${e=>{e.stopPropagation(),this._removeRenamedRepo(s)}} title=${ue("removeRenamed")}>✕</button>
          `:""}
          <button class="btn danger sm" @click=${t=>{t.stopPropagation(),this._removeCustomRepo(o,e.category)}}>✕</button>
        </div>
      </div>
    `}render(){const{archivedRepos:e,ignoredRepos:t,renamedEntries:o,customRepos:a,loading:i,_viewMode:r,_collapsed:s}=this;return H`
      ${i?H`
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px 16px;color:var(--secondary-text-color);">
          <div class="spinner"></div>
          <div>${ue("loading")}</div>
        </div>
      `:""}

      <!-- Custom Repos -->
      <div class="section">
        <div class="section-header" @click=${()=>this._toggleSection("customRepos")}>
          <svg class="arrow ${s.customRepos?"closed":"open"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            ${ue("customRepos")}
            ${o.length>0?H`<span class="section-badge">${o.length} ${ue("renamedRepos")}</span>`:""}
          </div>
          <div class="view-toggle">
            <button class=${Wt({active:"card"===r})} @click=${e=>{e.stopPropagation(),this._setViewMode("card")}}>
              ${ue("catDashboard")||"卡片"}
            </button>
            <button class=${Wt({active:"list"===r})} @click=${e=>{e.stopPropagation(),this._setViewMode("list")}}>
              ${ue("list")||"列表"}
            </button>
          </div>
          <button class="btn sm" @click=${e=>{e.stopPropagation(),this._load()}} title="${ue("refresh")}" style="flex-shrink:0;"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg></button>
        </div>
        <div class="section-content ${s.customRepos?"collapsed":""}">
          <div class="section-desc">${ue("customReposDesc")}</div>

          <!-- Search & Sort -->
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <div class="search" style="flex:1;min-width:150px;">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="${ue("search")||"搜索..."}" .value=${this._customRepoSearch} @input=${e=>this._customRepoSearch=e.target.value}>
            </div>
            <select class="edit-input" style="width:auto;" .value=${this._customRepoSort} @change=${e=>this._customRepoSort=e.target.value}>
              <option value="name">${ue("sortByName")}</option>
              <option value="stars">${ue("sortByStars")}</option>
              <option value="updated">${ue("sortByUpdated")}</option>
            </select>
          </div>

          ${this._showAddCustom?H`
            <div class="add-form">
              <input class="edit-input" .value=${this._customRepoUrl} @input=${e=>this._customRepoUrl=e.target.value} placeholder="owner/repo 或 GitHub URL" @keydown=${e=>"Enter"===e.key&&this._addCustomRepo()}>
              <div class="add-form-controls">
                <select class="edit-input" .value=${this._customRepoCategory} @change=${e=>this._customRepoCategory=e.target.value}>
                  ${["integration","plugin","theme","dashboard","python_script","template","appdaemon","netdaemon"].map(e=>H`<option value=${e}>${this._getCategoryLabel(e)}</option>`)}
                </select>
                <button class="btn primary sm" @click=${this._addCustomRepo} ?disabled=${this._addingCustom||!this._customRepoUrl.trim()}>
                  ${this._addingCustom?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ue("add")}`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${ue("add")}`}
                </button>
                <button class="btn sm" @click=${this._toggleAddCustom}>${ue("cancel")}</button>
              </div>
              ${this._customRepoUrl.trim()?H`
                <div class="add-preview">${this._parseRepoUrl(this._customRepoUrl)?H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> ${this._parseRepoUrl(this._customRepoUrl)}`:H`<span class="add-error">${ue("invalidRepoUrl")}</span>`}</div>
              `:""}
            </div>
          `:H`
            <button class="btn primary" @click=${this._toggleAddCustom} style="margin-bottom:12px;">+ ${ue("addRepo")}</button>
          `}

          ${a.length>0?"card"===r?H`<div class="repo-cards">${this._getFilteredCustomRepos().map(e=>this._renderCard(e,o))}</div>`:H`<div class="repo-list">${this._getFilteredCustomRepos().map(e=>this._renderListItem(e,o))}</div>`:H`<div class="empty">${ue("noCustomRepos")}</div>`}
        </div>
      </div>

      <!-- Archived -->
      <div class="section">
        <div class="section-header" @click=${()=>this._toggleSection("archived")}>
          <svg class="arrow ${s.archived?"closed":"open"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
            ${ue("archivedRepos")}
          </div>
        </div>
        <div class="section-content ${s.archived?"collapsed":""}">
          ${e.length>0?H`
            <div class="repo-list">
              ${e.map(e=>H`
                <div class="repo-item" style="cursor:default;">
                  <div class="repo-info"><div class="repo-top"><span class="repo-name">${e}</span></div></div>
                  <div class="repo-actions">
                    <a class="btn sm" href="https://github.com/${e}" target="_blank" rel="noopener">${ue("viewOnGithub")}</a>
                    <button class="btn danger sm" @click=${()=>this._removeArchivedRepo(e)}>${ue("removeArchived")}</button>
                  </div>
                </div>
              `)}
            </div>
          `:H`<div class="empty">${ue("noArchived")}</div>`}
        </div>
      </div>

      <!-- Ignored -->
      <div class="section">
        <div class="section-header" @click=${()=>this._toggleSection("ignored")}>
          <svg class="arrow ${s.ignored?"closed":"open"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            ${ue("ignoredRepos")}
          </div>
        </div>
        <div class="section-content ${s.ignored?"collapsed":""}">
          ${t.length>0?H`
            <div class="repo-list">
              ${t.map(e=>H`
                <div class="repo-item" style="cursor:default;"><div class="repo-info"><div class="repo-top"><span class="repo-name">${e}</span></div></div></div>
              `)}
            </div>
          `:H`<div class="empty">${ue("noIgnored")}</div>`}
        </div>
      </div>

      <!-- Tools: Export / Import / Dep Check -->
      <div class="section">
        <div class="section-header" @click=${()=>this._toggleSection("tools")}>
          <svg class="arrow ${s.tools?"closed":"open"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M14.31 8l5.74 5.74-.94 3.71-3.71.94L8 14.31"/><path d="M14.31 8L8 14.31l-2.23.45a1 1 0 0 0-.86 1.16l.6 3.02a1 1 0 0 0 1.16.86l3.02-.6L16 12.69"/></svg>
            ${ue("tools")||"工具"}
          </div>
        </div>
        <div class="section-content ${s.tools?"collapsed":""}">
          <div class="section-desc">${ue("toolsDesc")||"导出、导入和依赖检查"}</div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
            <button class="btn primary" @click=${this._export} ?disabled=${this.exporting}>
              ${this.exporting?ue("exporting"):ue("exportBtn")}
            </button>
            <button class="btn" @click=${this._import} ?disabled=${this.importing}>
              ${this.importing?ue("importing"):ue("importBtn")}
            </button>
            <button class="btn" @click=${this._checkDependencies} ?disabled=${this._depLoading}>
              ${this._depLoading?H`<svg class="mini-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${ue("checkingUpdates")}`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ${ue("checkDep")}`}
            </button>
          </div>

          ${this._depResults?H`
            <div class="dep-panel">
              <div class="dep-summary">
                <span class="title">${this._depResults.all_ok?H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`:H`<svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`} ${ue("totalPrefix")||"共"} ${this._depResults.total_checked} ${ue("totalRepos")}</span>
                ${this._depResults.all_ok?"":H`<span class="issues">${this._depResults.issues_count} ${ue("depMissing")||"缺失"}</span>`}
              </div>
              ${this._depResults.all_ok?H`<div class="dep-ok"><svg class="mini-icon" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> ${ue("depOk")}</div>`:H`
                ${this._depResults.dependencies.filter(e=>e.has_issues).map(e=>H`
                  <div class="dep-item">
                    <div class="repo">${e.repository}</div>
                    <div class="missing">${e.missing.join(", ")}</div>
                  </div>
                `)}
              `}
            </div>
          `:""}
        </div>
      </div>
    `}}customElements.define("management-view",qt),customElements.define("hacs-vision-panel",Tt)}();
