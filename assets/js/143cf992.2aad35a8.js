"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[69044],{15680:(e,n,t)=>{t.d(n,{xA:()=>p,yg:()=>u});var a=t(96540);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function g(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var d=a.createContext({}),o=function(e){var n=a.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=o(e.components);return a.createElement(d.Provider,{value:n},e.children)},m="mdxType",y={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},N=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,d=e.parentName,p=g(e,["components","mdxType","originalType","parentName"]),m=o(t),N=r,u=m["".concat(d,".").concat(N)]||m[N]||y[N]||l;return t?a.createElement(u,i(i({ref:n},p),{},{components:t})):a.createElement(u,i({ref:n},p))}));function u(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,i=new Array(l);i[0]=N;var g={};for(var d in n)hasOwnProperty.call(n,d)&&(g[d]=n[d]);g.originalType=e,g[m]="string"==typeof e?e:r,i[1]=g;for(var o=2;o<l;o++)i[o]=t[o];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}N.displayName="MDXCreateElement"},12870:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>d,default:()=>u,frontMatter:()=>g,metadata:()=>o,toc:()=>m});t(96540);var a=t(15680);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){return n=null!=n?n:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):function(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})),e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}const g={title:"Deployment Environment Variables",sidebar_label:"Deployment Environment Variables",slug:"/deploy/environment-vars",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/deploy/environment-vars.md"},d="Environment Variables",o={unversionedId:"docs/deploy/environment-vars",id:"version-0.15.0/docs/deploy/environment-vars",title:"Deployment Environment Variables",description:"The following is a summary of a few important environment variables which expose various levers which control how",source:"@site/versioned_docs/version-0.15.0/docs/deploy/environment-vars.md",sourceDirName:"docs/deploy",slug:"/deploy/environment-vars",permalink:"/docs/0.15.0/deploy/environment-vars",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/deploy/environment-vars.md",tags:[],version:"0.15.0",frontMatter:{title:"Deployment Environment Variables",sidebar_label:"Deployment Environment Variables",slug:"/deploy/environment-vars",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/deploy/environment-vars.md"},sidebar:"overviewSidebar",previous:{title:"Integrating with Confluent Cloud",permalink:"/docs/0.15.0/deploy/confluent-cloud"},next:{title:"How to Extract Logs from DataHub Containers",permalink:"/docs/0.15.0/how/extract-container-logs"}},p={},m=[{value:"Feature Flags",id:"feature-flags",level:2},{value:"Ingestion",id:"ingestion",level:2},{value:"Caching",id:"caching",level:2},{value:"Search",id:"search",level:2},{value:"Kafka",id:"kafka",level:2},{value:"Frontend",id:"frontend",level:2}],y={toc:m},N="wrapper";function u(e){var{components:n}=e,t=i(e,["components"]);return(0,a.yg)(N,l(function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},a=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),a.forEach((function(n){r(e,n,t[n])}))}return e}({},y,t),{components:n,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"environment-variables"},"Environment Variables"),(0,a.yg)("p",null,"The following is a summary of a few important environment variables which expose various levers which control how\nDataHub works."),(0,a.yg)("h2",{id:"feature-flags"},"Feature Flags"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Variable"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Unit/Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Components"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"UI_INGESTION_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable UI based ingestion.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"DATAHUB_ANALYTICS_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Collect DataHub usage to populate the analytics dashboard.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"BOOTSTRAP_SYSTEM_UPDATE_WAIT_FOR_SYSTEM_UPDATE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Do not wait for the ",(0,a.yg)("inlineCode",{parentName:"td"},"system-update")," to complete before starting. This should typically only be disabled during development.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ER_MODEL_RELATIONSHIP_FEATURE_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable ER Model Relation Feature that shows Relationships Tab within a Dataset UI.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"STRICT_URN_VALIDATION_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable stricter URN validation logic")))),(0,a.yg)("h2",{id:"ingestion"},"Ingestion"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Variable"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Unit/Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Components"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ASYNC_INGEST_DEFAULT")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Asynchronously process ingestProposals by writing the ingestion MCP to Kafka. Typically enabled with standalone consumers.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"MCP_CONSUMER_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"When running in standalone mode, disabled on ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS")," and enabled on separate ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),".")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"MCL_CONSUMER_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"When running in standalone mode, disabled on ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS")," and enabled on separate ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),".")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"PE_CONSUMER_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"When running in standalone mode, disabled on ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS")," and enabled on separate ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),".")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ES_BULK_REQUESTS_LIMIT")),(0,a.yg)("td",{parentName:"tr",align:null},"1000"),(0,a.yg)("td",{parentName:"tr",align:null},"docs"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Number of bulk documents to index. ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer")," if standalone.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ES_BULK_FLUSH_PERIOD")),(0,a.yg)("td",{parentName:"tr",align:null},"1"),(0,a.yg)("td",{parentName:"tr",align:null},"seconds"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"How frequently indexed documents are made available for query.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ALWAYS_EMIT_CHANGE_LOG")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enables always emitting a MCL even when no changes are detected. Used for Time Based Lineage when no changes occur.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"GRAPH_SERVICE_DIFF_MODE_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enables diff mode for graph writes, uses a different code path that produces a diff from previous to next to write relationships instead of wholesale deleting edges and reading.")))),(0,a.yg)("h2",{id:"caching"},"Caching"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Variable"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Unit/Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Components"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"SEARCH_SERVICE_ENABLE_CACHE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable caching of search results.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"SEARCH_SERVICE_CACHE_IMPLEMENTATION")),(0,a.yg)("td",{parentName:"tr",align:null},"caffeine"),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Set to ",(0,a.yg)("inlineCode",{parentName:"td"},"hazelcast")," if the number of GMS replicas > 1 for enabling distributed cache.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"CACHE_TTL_SECONDS")),(0,a.yg)("td",{parentName:"tr",align:null},"600"),(0,a.yg)("td",{parentName:"tr",align:null},"seconds"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Default cache time to live.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"CACHE_MAX_SIZE")),(0,a.yg)("td",{parentName:"tr",align:null},"10000"),(0,a.yg)("td",{parentName:"tr",align:null},"objects"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Maximum number of items to cache.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"LINEAGE_SEARCH_CACHE_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enables in-memory cache for searchAcrossLineage query.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"CACHE_ENTITY_COUNTS_TTL_SECONDS")),(0,a.yg)("td",{parentName:"tr",align:null},"600"),(0,a.yg)("td",{parentName:"tr",align:null},"seconds"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Homepage entity count time to live.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"CACHE_SEARCH_LINEAGE_TTL_SECONDS")),(0,a.yg)("td",{parentName:"tr",align:null},"86400"),(0,a.yg)("td",{parentName:"tr",align:null},"seconds"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Search lineage cache time to live.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"CACHE_SEARCH_LINEAGE_LIGHTNING_THRESHOLD")),(0,a.yg)("td",{parentName:"tr",align:null},"300"),(0,a.yg)("td",{parentName:"tr",align:null},"objects"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Lineage graphs exceeding this limit will use a local cache.")))),(0,a.yg)("h2",{id:"search"},"Search"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Variable"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Unit/Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Components"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"INDEX_PREFIX")),(0,a.yg)("td",{parentName:"tr",align:null},"``"),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"Elasticsearch Setup"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Prefix Elasticsearch indices with the given string.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_NUM_SHARDS_PER_INDEX")),(0,a.yg)("td",{parentName:"tr",align:null},"1"),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Default number of shards per Elasticsearch index.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_NUM_REPLICAS_PER_INDEX")),(0,a.yg)("td",{parentName:"tr",align:null},"1"),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Default number of replica per Elasticsearch index.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_BUILD_INDICES_RETENTION_VALUE")),(0,a.yg)("td",{parentName:"tr",align:null},"60"),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Number of units for the retention of Elasticsearch clone/backup indices.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_BUILD_INDICES_RETENTION_UNIT")),(0,a.yg)("td",{parentName:"tr",align:null},"DAYS"),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Unit for the retention of Elasticsearch clone/backup indices.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_EXACT_MATCH_EXCLUSIVE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Only return exact matches when using quotes.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_EXACT_MATCH_WITH_PREFIX")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Include prefix match in exact match results.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_EXACT_MATCH_FACTOR")),(0,a.yg)("td",{parentName:"tr",align:null},"10.0"),(0,a.yg)("td",{parentName:"tr",align:null},"float"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Multiply by this number on true exact match.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_EXACT_MATCH_PREFIX_FACTOR")),(0,a.yg)("td",{parentName:"tr",align:null},"1.6"),(0,a.yg)("td",{parentName:"tr",align:null},"float"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Multiply by this number when prefix match.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_EXACT_MATCH_CASE_FACTOR")),(0,a.yg)("td",{parentName:"tr",align:null},"0.7"),(0,a.yg)("td",{parentName:"tr",align:null},"float"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Multiply by this number when case insensitive match.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_EXACT_MATCH_ENABLE_STRUCTURED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"When using structured query, also include exact matches.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_PARTIAL_URN_FACTOR")),(0,a.yg)("td",{parentName:"tr",align:null},"0.5"),(0,a.yg)("td",{parentName:"tr",align:null},"float"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Multiply by this number when partial token match on URN)")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_PARTIAL_FACTOR")),(0,a.yg)("td",{parentName:"tr",align:null},"0.4"),(0,a.yg)("td",{parentName:"tr",align:null},"float"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Multiply by this number when partial token match on non-URN field.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_CUSTOM_CONFIG_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable search query and ranking customization configuration.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_QUERY_CUSTOM_CONFIG_FILE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"search_config.yml")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"The location of the search customization configuration.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ELASTICSEARCH_INDEX_BUILDER_MAPPINGS_REINDEX")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable reindexing on Elasticsearch schema changes.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"ENABLE_STRUCTURED_PROPERTIES_SYSTEM_UPDATE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"System Update"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable reindexing to remove hard deleted structured properties.")))),(0,a.yg)("h2",{id:"kafka"},"Kafka"),(0,a.yg)("p",null,"In general, there are ",(0,a.yg)("strong",{parentName:"p"},"lots")," of Kafka configuration environment variables for both the producer and consumers defined in the official Spring Kafka documentation ",(0,a.yg)("a",{parentName:"p",href:"https://docs.spring.io/spring-boot/docs/2.7.10/reference/html/application-properties.html#appendix.application-properties.integration"},"here"),".\nThese environment variables follow the standard Spring representation of properties as environment variables.\nSimply replace the dot, ",(0,a.yg)("inlineCode",{parentName:"p"},"."),", with an underscore, ",(0,a.yg)("inlineCode",{parentName:"p"},"_"),", and convert to uppercase."),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Variable"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Unit/Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Components"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA_LISTENER_CONCURRENCY")),(0,a.yg)("td",{parentName:"tr",align:null},"1"),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Number of Kafka consumer threads. Optimize throughput by matching to topic partitions.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"SPRING_KAFKA_PRODUCER_PROPERTIES_MAX_REQUEST_SIZE")),(0,a.yg)("td",{parentName:"tr",align:null},"1048576"),(0,a.yg)("td",{parentName:"tr",align:null},"bytes"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Max produced message size. Note that the topic configuration is not controlled by this variable.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"SCHEMA_REGISTRY_TYPE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"INTERNAL")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Schema registry implementation. One of ",(0,a.yg)("inlineCode",{parentName:"td"},"INTERNAL")," or ",(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA")," or ",(0,a.yg)("inlineCode",{parentName:"td"},"AWS_GLUE"))),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA_SCHEMAREGISTRY_URL")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"http://localhost:8080/schema-registry/api/")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Schema registry url. Used for ",(0,a.yg)("inlineCode",{parentName:"td"},"INTERNAL")," and ",(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA"),". The default value is for the ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS")," component. The ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer")," and ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer")," should be the ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS")," hostname and port.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"AWS_GLUE_SCHEMA_REGISTRY_REGION")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"us-east-1")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"If using ",(0,a.yg)("inlineCode",{parentName:"td"},"AWS_GLUE")," in the ",(0,a.yg)("inlineCode",{parentName:"td"},"SCHEMA_REGISTRY_TYPE")," variable for the schema registry implementation.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"AWS_GLUE_SCHEMA_REGISTRY_NAME")),(0,a.yg)("td",{parentName:"tr",align:null},"``"),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"If using ",(0,a.yg)("inlineCode",{parentName:"td"},"AWS_GLUE")," in the ",(0,a.yg)("inlineCode",{parentName:"td"},"SCHEMA_REGISTRY_TYPE")," variable for the schema registry.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"USE_CONFLUENT_SCHEMA_REGISTRY")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"true")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"kafka-setup"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable Confluent schema registry configuration.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA_PRODUCER_MAX_REQUEST_SIZE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"5242880")),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Max produced message size. Note that the topic configuration is not controlled by this variable.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"5242880")),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"The maximum amount of data per-partition the server will return. Records are fetched in batches by the consumer. If the first record batch in the first non-empty partition of the fetch is larger than this limit, the batch will still be returned to ensure that the consumer can make progress.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"MAX_MESSAGE_BYTES")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"5242880")),(0,a.yg)("td",{parentName:"tr",align:null},"integer"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"kafka-setup"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Sets the max message size on the kakfa topics.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"KAFKA_PRODUCER_COMPRESSION_TYPE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"snappy")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"GMS"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MCE Consumer"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"MAE Consumer"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"The compression used by the producer.")))),(0,a.yg)("h2",{id:"frontend"},"Frontend"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Variable"),(0,a.yg)("th",{parentName:"tr",align:null},"Default"),(0,a.yg)("th",{parentName:"tr",align:null},"Unit/Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Components"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"AUTH_VERBOSE_LOGGING")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Enable verbose authentication logging. Enabling this will leak sensisitve information in the logs. Disable when finished debugging.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"AUTH_OIDC_GROUPS_CLAIM")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"groups")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Claim to use as the user's group.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"AUTH_OIDC_EXTRACT_GROUPS_ENABLED")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"false")),(0,a.yg)("td",{parentName:"tr",align:null},"boolean"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"Auto-provision the group from the user's group claim.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"AUTH_SESSION_TTL_HOURS")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"24")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"The number of hours a user session is valid. After this many hours the actor cookie will be expired by the browser and the user will be prompted to login again.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"MAX_SESSION_TOKEN_AGE")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"24h")),(0,a.yg)("td",{parentName:"tr",align:null},"string"),(0,a.yg)("td",{parentName:"tr",align:null},"[",(0,a.yg)("inlineCode",{parentName:"td"},"Frontend"),"]"),(0,a.yg)("td",{parentName:"tr",align:null},"The maximum age of the session token. ",(0,a.yg)("a",{parentName:"td",href:"https://www.playframework.com/documentation/2.8.x/SettingsSession#Session-Timeout-/-Expiration"},"User session tokens are stateless and will become invalid after this time")," requiring a user to login again.")))))}u.isMDXComponent=!0}}]);