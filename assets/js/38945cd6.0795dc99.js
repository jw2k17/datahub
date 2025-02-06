"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[51227],{15680:(e,t,n)=>{n.d(t,{xA:()=>u,yg:()=>f});var a=n(96540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(n),g=r,f=p["".concat(s,".").concat(g)]||p[g]||d[g]||i;return n?a.createElement(f,o(o({ref:t},u),{},{components:n})):a.createElement(f,o({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=g;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:r,o[1]=l;for(var c=2;c<i;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},3119:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>f,frontMatter:()=>l,metadata:()=>c,toc:()=>p});n(96540);var a=n(15680);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}const l={title:"Metadata File",slug:"/metadata-ingestion/sink_docs/metadata-file",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/sink_docs/metadata-file.md"},s="Metadata File",c={unversionedId:"metadata-ingestion/sink_docs/metadata-file",id:"version-0.14.1/metadata-ingestion/sink_docs/metadata-file",title:"Metadata File",description:"For context on getting started with ingestion, check out our metadata ingestion guide.",source:"@site/versioned_docs/version-0.14.1/metadata-ingestion/sink_docs/metadata-file.md",sourceDirName:"metadata-ingestion/sink_docs",slug:"/metadata-ingestion/sink_docs/metadata-file",permalink:"/docs/0.14.1/metadata-ingestion/sink_docs/metadata-file",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/sink_docs/metadata-file.md",tags:[],version:"0.14.1",frontMatter:{title:"Metadata File",slug:"/metadata-ingestion/sink_docs/metadata-file",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/sink_docs/metadata-file.md"},sidebar:"overviewSidebar",previous:{title:"DataHub",permalink:"/docs/0.14.1/metadata-ingestion/sink_docs/datahub"},next:{title:"Introduction",permalink:"/docs/0.14.1/metadata-ingestion/docs/transformer/intro"}},u={},p=[{value:"Setup",id:"setup",level:2},{value:"Capabilities",id:"capabilities",level:2},{value:"Quickstart recipe",id:"quickstart-recipe",level:2},{value:"Config details",id:"config-details",level:2}],d={toc:p},g="wrapper";function f(e){var{components:t}=e,n=o(e,["components"]);return(0,a.yg)(g,i(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){r(e,t,n[t])}))}return e}({},d,n),{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"metadata-file"},"Metadata File"),(0,a.yg)("p",null,"For context on getting started with ingestion, check out our ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/metadata-ingestion"},"metadata ingestion guide"),"."),(0,a.yg)("h2",{id:"setup"},"Setup"),(0,a.yg)("p",null,"Works with ",(0,a.yg)("inlineCode",{parentName:"p"},"acryl-datahub")," out of the box."),(0,a.yg)("h2",{id:"capabilities"},"Capabilities"),(0,a.yg)("p",null,"Outputs metadata to a file. This can be used to decouple metadata sourcing from the\nprocess of pushing it into DataHub, and is particularly useful for debugging purposes.\nNote that the ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/generated/ingestion/sources/metadata-file"},"file source")," can read files generated by this sink."),(0,a.yg)("h2",{id:"quickstart-recipe"},"Quickstart recipe"),(0,a.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,a.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,a.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yml"},"source:\n  # source configs\n\nsink:\n  type: file\n  config:\n    filename: ./path/to/mce/file.json\n")),(0,a.yg)("h2",{id:"config-details"},"Config details"),(0,a.yg)("p",null,"Note that a ",(0,a.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Field"),(0,a.yg)("th",{parentName:"tr",align:null},"Required"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},"filename"),(0,a.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,a.yg)("td",{parentName:"tr",align:null}),(0,a.yg)("td",{parentName:"tr",align:null},"Path to file to write to.")))))}f.isMDXComponent=!0}}]);