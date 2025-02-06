"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[88040],{15680:(e,t,r)=>{r.d(t,{xA:()=>u,yg:()=>f});var a=r(96540);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),l=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},u=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=l(r),m=n,f=p["".concat(s,".").concat(m)]||p[m]||d[m]||o;return r?a.createElement(f,c(c({ref:t},u),{},{components:r})):a.createElement(f,c({ref:t},u))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,c=new Array(o);c[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[p]="string"==typeof e?e:n,c[1]=i;for(var l=2;l<o;l++)c[l]=r[l];return a.createElement.apply(null,c)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},76452:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>f,frontMatter:()=>i,metadata:()=>l,toc:()=>p});r(96540);var a=r(15680);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})),e}function c(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}const i={title:"What is Generalized Metadata Architecture (GMA)?",slug:"/what/gma",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/what/gma.md"},s="What is Generalized Metadata Architecture (GMA)?",l={unversionedId:"docs/what/gma",id:"version-0.14.1/docs/what/gma",title:"What is Generalized Metadata Architecture (GMA)?",description:"GMA is the backend infrastructure for DataHub. Unlike existing architectures, GMA leverages multiple storage technologies to efficiently service the four most commonly used query patterns",source:"@site/versioned_docs/version-0.14.1/docs/what/gma.md",sourceDirName:"docs/what",slug:"/what/gma",permalink:"/docs/0.14.1/what/gma",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/what/gma.md",tags:[],version:"0.14.1",frontMatter:{title:"What is Generalized Metadata Architecture (GMA)?",slug:"/what/gma",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/what/gma.md"}},u={},p=[],d={toc:p},m="wrapper";function f(e){var{components:t}=e,r=c(e,["components"]);return(0,a.yg)(m,o(function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},a=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),a.forEach((function(t){n(e,t,r[t])}))}return e}({},d,r),{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"what-is-generalized-metadata-architecture-gma"},"What is Generalized Metadata Architecture (GMA)?"),(0,a.yg)("p",null,"GMA is the backend infrastructure for DataHub. Unlike existing architectures, GMA leverages multiple storage technologies to efficiently service the four most commonly used query patterns"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Document-oriented CRUD "),(0,a.yg)("li",{parentName:"ul"},"Complex queries (including joining distributed tables)"),(0,a.yg)("li",{parentName:"ul"},"Graph traversal"),(0,a.yg)("li",{parentName:"ul"},"Fulltext search and autocomplete")),(0,a.yg)("p",null,"GMA also embraces a distributed model, where each team owns, develops and operates their own metadata services (known as ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/what/gms"},"GMS"),"), while the metadata are automatically aggregated to populate the central ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/what/graph"},"metadata graph")," and ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/what/search-index"},"search indexes"),". This is made possible by standardizing the metadata models and the access layer. "),(0,a.yg)("p",null,"We strongly believe that GMA can bring tremendous leverage to any team that has a need to store and access metadata.\nMoreover, standardizing metadata modeling promotes a model-first approach to developments, resulting in a more concise, consistent, and highly connected metadata ecosystem that benefits all DataHub users."))}f.isMDXComponent=!0}}]);