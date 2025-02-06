"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[71834],{15680:(e,t,r)=>{r.d(t,{xA:()=>p,yg:()=>v});var n=r(96540);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},s="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),s=u(r),b=a,v=s["".concat(l,".").concat(b)]||s[b]||g[b]||o;return r?n.createElement(v,i(i({ref:t},p),{},{components:r})):n.createElement(v,i({ref:t},p))}));function v(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=b;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[s]="string"==typeof e?e:a,i[1]=c;for(var u=2;u<o;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},58865:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>v,frontMatter:()=>c,metadata:()=>u,toc:()=>s});r(96540);var n=r(15680);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})),e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}const c={title:"Openlineage Converter",slug:"/metadata-integration/java/openlineage-converter",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-integration/java/openlineage-converter/README.md"},l="Openlineage Converter",u={unversionedId:"metadata-integration/java/openlineage-converter/README",id:"metadata-integration/java/openlineage-converter/README",title:"Openlineage Converter",description:"Overview",source:"@site/genDocs/metadata-integration/java/openlineage-converter/README.md",sourceDirName:"metadata-integration/java/openlineage-converter",slug:"/metadata-integration/java/openlineage-converter",permalink:"/docs/metadata-integration/java/openlineage-converter",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/metadata-integration/java/openlineage-converter/README.md",tags:[],version:"current",frontMatter:{title:"Openlineage Converter",slug:"/metadata-integration/java/openlineage-converter",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-integration/java/openlineage-converter/README.md"}},p={},s=[{value:"Overview",id:"overview",level:2},{value:"Known Issues",id:"known-issues",level:2}],g={toc:s},b="wrapper";function v(e){var{components:t}=e,r=i(e,["components"]);return(0,n.yg)(b,o(function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){a(e,t,r[t])}))}return e}({},g,r),{components:t,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"openlineage-converter"},"Openlineage Converter"),(0,n.yg)("h2",{id:"overview"},"Overview"),(0,n.yg)("p",null,"It converts arbitary Openlineage events to a DataHub Aspects."),(0,n.yg)("h2",{id:"known-issues"},"Known Issues"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Currently, it was tested only with Spark and Airflow events."),(0,n.yg)("li",{parentName:"ul"},"Due to Openlineage's stateless nature, it is possible not all the inputs or outputs captured.")))}v.isMDXComponent=!0}}]);