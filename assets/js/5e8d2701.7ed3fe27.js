"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[52397],{15680:(a,t,e)=>{e.d(t,{xA:()=>o,yg:()=>y});var r=e(96540);function n(a,t,e){return t in a?Object.defineProperty(a,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):a[t]=e,a}function l(a,t){var e=Object.keys(a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(a);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable}))),e.push.apply(e,r)}return e}function d(a){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?l(Object(e),!0).forEach((function(t){n(a,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(e)):l(Object(e)).forEach((function(t){Object.defineProperty(a,t,Object.getOwnPropertyDescriptor(e,t))}))}return a}function i(a,t){if(null==a)return{};var e,r,n=function(a,t){if(null==a)return{};var e,r,n={},l=Object.keys(a);for(r=0;r<l.length;r++)e=l[r],t.indexOf(e)>=0||(n[e]=a[e]);return n}(a,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(a);for(r=0;r<l.length;r++)e=l[r],t.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(a,e)&&(n[e]=a[e])}return n}var g=r.createContext({}),p=function(a){var t=r.useContext(g),e=t;return a&&(e="function"==typeof a?a(t):d(d({},t),a)),e},o=function(a){var t=p(a.components);return r.createElement(g.Provider,{value:t},a.children)},m="mdxType",u={inlineCode:"code",wrapper:function(a){var t=a.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(a,t){var e=a.components,n=a.mdxType,l=a.originalType,g=a.parentName,o=i(a,["components","mdxType","originalType","parentName"]),m=p(e),s=n,y=m["".concat(g,".").concat(s)]||m[s]||u[s]||l;return e?r.createElement(y,d(d({ref:t},o),{},{components:e})):r.createElement(y,d({ref:t},o))}));function y(a,t){var e=arguments,n=t&&t.mdxType;if("string"==typeof a||n){var l=e.length,d=new Array(l);d[0]=s;var i={};for(var g in t)hasOwnProperty.call(t,g)&&(i[g]=t[g]);i.originalType=a,i[m]="string"==typeof a?a:n,d[1]=i;for(var p=2;p<l;p++)d[p]=e[p];return r.createElement.apply(null,d)}return r.createElement.apply(null,e)}s.displayName="MDXCreateElement"},5976:(a,t,e)=>{e.r(t),e.d(t,{assets:()=>o,contentTitle:()=>g,default:()=>y,frontMatter:()=>i,metadata:()=>p,toc:()=>m});e(96540);var r=e(15680);function n(a,t,e){return t in a?Object.defineProperty(a,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):a[t]=e,a}function l(a,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):function(a,t){var e=Object.keys(a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(a);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable}))),e.push.apply(e,r)}return e}(Object(t)).forEach((function(e){Object.defineProperty(a,e,Object.getOwnPropertyDescriptor(t,e))})),a}function d(a,t){if(null==a)return{};var e,r,n=function(a,t){if(null==a)return{};var e,r,n={},l=Object.keys(a);for(r=0;r<l.length;r++)e=l[r],t.indexOf(e)>=0||(n[e]=a[e]);return n}(a,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(a);for(r=0;r<l.length;r++)e=l[r],t.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(a,e)&&(n[e]=a[e])}return n}const i={title:"DataHub APIs",sidebar_label:"APIs",slug:"/api/datahub-apis",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/datahub-apis.md"},g="DataHub APIs",p={unversionedId:"docs/api/datahub-apis",id:"version-0.15.0/docs/api/datahub-apis",title:"DataHub APIs",description:"DataHub has several APIs to manipulate metadata on the platform. Here's the list of APIs and their pros and cons to help you choose the right one for your use case.",source:"@site/versioned_docs/version-0.15.0/docs/api/datahub-apis.md",sourceDirName:"docs/api",slug:"/api/datahub-apis",permalink:"/docs/0.15.0/api/datahub-apis",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/api/datahub-apis.md",tags:[],version:"0.15.0",frontMatter:{title:"DataHub APIs",sidebar_label:"APIs",slug:"/api/datahub-apis",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/datahub-apis.md"},sidebar:"overviewSidebar",previous:{title:"Bootstrap MetadataChangeProposals (MCPs)",permalink:"/docs/0.15.0/advanced/bootstrap-mcps"},next:{title:"DataHub GraphQL API",permalink:"/docs/0.15.0/api/graphql/overview"}},o={},m=[{value:"Python and Java SDK",id:"python-and-java-sdk",level:2},{value:"GraphQL API",id:"graphql-api",level:2},{value:"DataHub API Comparison",id:"datahub-api-comparison",level:2}],u={toc:m},s="wrapper";function y(a){var{components:t}=a,e=d(a,["components"]);return(0,r.yg)(s,l(function(a){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{},r=Object.keys(e);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(e).filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})))),r.forEach((function(t){n(a,t,e[t])}))}return a}({},u,e),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"datahub-apis"},"DataHub APIs"),(0,r.yg)("p",null,"DataHub has several APIs to manipulate metadata on the platform. Here's the list of APIs and their pros and cons to help you choose the right one for your use case."),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"API"),(0,r.yg)("th",{parentName:"tr",align:null},"Definition"),(0,r.yg)("th",{parentName:"tr",align:null},"Pros"),(0,r.yg)("th",{parentName:"tr",align:null},"Cons"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("strong",{parentName:"td"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/metadata-ingestion/as-a-library"},"Python SDK"))),(0,r.yg)("td",{parentName:"tr",align:null},"SDK"),(0,r.yg)("td",{parentName:"tr",align:null},"Highly flexible, Good for bulk execution"),(0,r.yg)("td",{parentName:"tr",align:null},"Requires an understanding of the metadata change event")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("strong",{parentName:"td"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/metadata-integration/java/as-a-library"},"Java SDK"))),(0,r.yg)("td",{parentName:"tr",align:null},"SDK"),(0,r.yg)("td",{parentName:"tr",align:null},"Highly flexible, Good for bulk execution"),(0,r.yg)("td",{parentName:"tr",align:null},"Requires an understanding of the metadata change event")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("strong",{parentName:"td"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/api/graphql/getting-started"},"GraphQL API"))),(0,r.yg)("td",{parentName:"tr",align:null},"GraphQL interface"),(0,r.yg)("td",{parentName:"tr",align:null},"Intuitive; mirrors UI capabilities"),(0,r.yg)("td",{parentName:"tr",align:null},"Less flexible than SDKs; requires knowledge of GraphQL syntax")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("strong",{parentName:"td"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/api/openapi/openapi-usage-guide"},"OpenAPI"))),(0,r.yg)("td",{parentName:"tr",align:null},"Lower-level API for advanced users"),(0,r.yg)("td",{parentName:"tr",align:null},"Most powerful and flexible"),(0,r.yg)("td",{parentName:"tr",align:null},"Can be hard to use for straightforward use cases; no corresponding SDKs")))),(0,r.yg)("p",null,"In general, ",(0,r.yg)("strong",{parentName:"p"},"Python and Java SDKs")," are our most recommended tools for extending and customizing the behavior of your DataHub instance.\nWe don't recommend using the ",(0,r.yg)("strong",{parentName:"p"},"OpenAPI")," directly, as it's more complex and less user-friendly than the other APIs."),(0,r.yg)("h2",{id:"python-and-java-sdk"},"Python and Java SDK"),(0,r.yg)("p",null,"We offer an SDK for both Python and Java that provide full functionality when it comes to CRUD operations and any complex functionality you may want to build into DataHub. We recommend using the SDKs for most use cases. Here are the examples of how to use the SDKs:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Define a lineage between data entities"),(0,r.yg)("li",{parentName:"ul"},"Executing bulk operations - e.g. adding tags to multiple datasets"),(0,r.yg)("li",{parentName:"ul"},"Creating custom metadata entities")),(0,r.yg)("p",null,"Learn more about the SDKs:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/metadata-ingestion/as-a-library"},"Python SDK \u2192"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/metadata-integration/java/as-a-library"},"Java SDK \u2192")))),(0,r.yg)("h2",{id:"graphql-api"},"GraphQL API"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"graphql")," API serves as the primary public API for the platform. It can be used to fetch and update metadata programatically in the language of your choice. Intended as a higher-level API that simplifies the most common operations."),(0,r.yg)("p",null,"We recommend using the GraphQL API if you're getting started with DataHub since it's more user-friendly and straighfowrad. Here are some examples of how to use the GraphQL API:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Search for datasets with conditions"),(0,r.yg)("li",{parentName:"ul"},"Update a certain field of a dataset")),(0,r.yg)("p",null,"Learn more about the GraphQL API:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},(0,r.yg)("a",{parentName:"strong",href:"/docs/0.15.0/api/graphql/getting-started"},"GraphQL API \u2192")))),(0,r.yg)("h2",{id:"datahub-api-comparison"},"DataHub API Comparison"),(0,r.yg)("p",null,"DataHub supports several APIs, each with its own unique usage and format.\nHere's an overview of what each API can do."),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Last Updated : Feb 16 2024")),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Feature"),(0,r.yg)("th",{parentName:"tr",align:null},"GraphQL"),(0,r.yg)("th",{parentName:"tr",align:null},"Python SDK"),(0,r.yg)("th",{parentName:"tr",align:null},"OpenAPI"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/datasets"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Delete a Dataset (Soft Delete)"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/datasets#delete-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/datasets#delete-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Delete a Dataset (Hard Delete)"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/datasets#delete-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Search a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/how/search#graphql"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read a Dataset Deprecation"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read Dataset Entities (V2)"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create a Tag"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#create-tags"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#create-tags"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read a Tag"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#read-tags"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#read-tags"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Tags to a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#add-tags-to-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#add-tags-to-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Tags to a Column of a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#add-tags-to-a-column-of-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#add-tags-to-a-column-of-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Remove Tags from a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#remove-tags"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/tags#add-tags#remove-tags"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Glossary Terms"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#create-terms"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#create-terms"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read Terms from a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#read-terms"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#read-terms"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Terms to a Column of a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#add-terms-to-a-column-of-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#add-terms-to-a-column-of-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Terms to a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#add-terms-to-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/terms#add-terms-to-a-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Domains"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#create-domain"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#create-domain"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read Domains"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#read-domains"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#read-domains"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Domains to a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#add-domains"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#add-domains"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Remove Domains from a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#remove-domains"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/domains#remove-domains"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create / Upsert Users"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#upsert-users"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#upsert-users"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create / Upsert Group"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#upsert-group"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#upsert-group"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read Owners of a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#read-owners"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#read-owners"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Owner to a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#add-owners"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#add-owners#remove-owners"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Remove Owner from a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners#remove-owners"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/owners"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Lineage"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/lineage"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/lineage#add-lineage"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Column Level (Fine Grained) Lineage"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/lineage#add-column-level-lineage"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Documentation (Description) to a Column of a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/descriptions#add-description-on-column"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/descriptions#add-description-on-column"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add Documentation (Description) to a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/descriptions#add-description-on-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/descriptions#add-description-on-dataset"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add / Remove / Replace Custom Properties on a Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/custom-properties"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add ML Feature to ML Feature Table"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#add-mlfeature-to-mlfeaturetable"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add ML Feature to MLModel"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#add-mlfeature-to-mlmodel"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Add ML Group to MLFeatureTable"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#add-mlgroup-to-mlfeaturetable"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create MLFeature"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#create-mlfeature"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create MLFeatureTable"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#create-mlfeaturetable"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create MLModel"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#create-mlmodel"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create MLModelGroup"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#create-mlmodelgroup"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create MLPrimaryKey"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#create-mlprimarykey"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create MLFeatureTable"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#create-mlfeaturetable"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read MLFeature"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlfeature"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlfeature"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read MLFeatureTable"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlfeaturetable"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlfeaturetable"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read MLModel"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlmodel"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlmodel"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read MLModelGroup"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlmodelgroup"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlmodelgroup"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Read MLPrimaryKey"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlprimarykey"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"/docs/0.15.0/api/tutorials/ml#read-mlprimarykey"},"[Guide]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Data Product"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/create_dataproduct.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Lineage Between Chart and Dashboard"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_chart_dashboard.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Lineage Between Dataset and Chart"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_dataset_chart.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Lineage Between Dataset and DataJob"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_dataset_job_dataset.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Finegrained Lineage as DataJob for Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_datajob_finegrained.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Finegrained Lineage for Dataset"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_dataset_finegrained.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Dataset Lineage with Kafka"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_kafka.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Dataset Lineage with MCPW & Rest Emitter"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_mcpw_rest.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Dataset Lineage with Rest Emitter"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_emitter_rest.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create DataJob with Dataflow"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_job_dataflow.py"},"[Code]")," ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_job_dataflow_new_api_simple.py"},"[Simple]")," ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/lineage_job_dataflow_new_api_verbose.py"},"[Verbose]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"Create Programmatic Pipeline"),(0,r.yg)("td",{parentName:"tr",align:null},"\ud83d\udeab"),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705 ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/library/programatic_pipeline.py"},"[Code]")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705")))))}y.isMDXComponent=!0}}]);