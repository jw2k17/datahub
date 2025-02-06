"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[39463],{15680:(t,e,a)=>{a.d(e,{xA:()=>c,yg:()=>f});var n=a(96540);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?o(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function s(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},o=Object.keys(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var l=n.createContext({}),u=function(t){var e=n.useContext(l),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},c=function(t){var e=u(t.components);return n.createElement(l.Provider,{value:e},t.children)},m="mdxType",p={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},d=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,o=t.originalType,l=t.parentName,c=s(t,["components","mdxType","originalType","parentName"]),m=u(a),d=r,f=m["".concat(l,".").concat(d)]||m[d]||p[d]||o;return a?n.createElement(f,i(i({ref:e},c),{},{components:a})):n.createElement(f,i({ref:e},c))}));function f(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var o=a.length,i=new Array(o);i[0]=d;var s={};for(var l in e)hasOwnProperty.call(e,l)&&(s[l]=e[l]);s.originalType=t,s[m]="string"==typeof t?t:r,i[1]=s;for(var u=2;u<o;u++)i[u]=a[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},38953:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>c,contentTitle:()=>l,default:()=>f,frontMatter:()=>s,metadata:()=>u,toc:()=>m});a(96540);var n=a(15680);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e){return e=null!=e?e:{},Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):function(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))})),t}function i(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},o=Object.keys(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}const s={title:"Adding a custom Dataset Data Platform",slug:"/how/add-custom-data-platform",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/how/add-custom-data-platform.md"},l="Adding a custom Dataset Data Platform",u={unversionedId:"docs/how/add-custom-data-platform",id:"version-0.14.1/docs/how/add-custom-data-platform",title:"Adding a custom Dataset Data Platform",description:"A Data Platform represents a 3rd party system from which Metadata Entities are ingested from. Each Dataset that is ingested is associated with a single platform, for example MySQL, Snowflake, Redshift, or BigQuery.",source:"@site/versioned_docs/version-0.14.1/docs/how/add-custom-data-platform.md",sourceDirName:"docs/how",slug:"/how/add-custom-data-platform",permalink:"/docs/0.14.1/how/add-custom-data-platform",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/how/add-custom-data-platform.md",tags:[],version:"0.14.1",frontMatter:{title:"Adding a custom Dataset Data Platform",slug:"/how/add-custom-data-platform",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/how/add-custom-data-platform.md"},sidebar:"overviewSidebar",previous:{title:"Using a Custom Ingestion Source",permalink:"/docs/0.14.1/how/add-custom-ingestion-source"},next:{title:"Browse Paths Upgrade (August 2022)",permalink:"/docs/0.14.1/advanced/browse-paths-upgrade"}},c={},m=[{value:"Changing Default Data Platforms",id:"changing-default-data-platforms",level:2},{value:"Ingesting Data Platform at runtime",id:"ingesting-data-platform-at-runtime",level:2},{value:"Using the cli",id:"using-the-cli",level:3},{value:"Using File-Based Ingestion Recipe",id:"using-file-based-ingestion-recipe",level:3},{value:"Using Rest.li API",id:"using-restli-api",level:3}],p={toc:m},d="wrapper";function f(t){var{components:e}=t,a=i(t,["components"]);return(0,n.yg)(d,o(function(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})))),n.forEach((function(e){r(t,e,a[e])}))}return t}({},p,a),{components:e,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"adding-a-custom-dataset-data-platform"},"Adding a custom Dataset Data Platform"),(0,n.yg)("p",null,"A Data Platform represents a 3rd party system from which ",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-modeling/metadata-model/"},"Metadata Entities")," are ingested from. Each Dataset that is ingested is associated with a single platform, for example MySQL, Snowflake, Redshift, or BigQuery."),(0,n.yg)("p",null,"There are some cases in which you may want to add a custom Data Platform identifier for a Dataset. For example,\nyou have an internal data system that is not widely available, or you're using a Data Platform that is not natively supported by DataHub."),(0,n.yg)("p",null,"To do so, you can either change the default Data Platforms that are ingested into DataHub ",(0,n.yg)("em",{parentName:"p"},"prior to deployment time"),", or ingest\na new Data Platform at runtime. You can use the first option if you're able to periodically merge new Data Platforms from the OSS\nrepository into your own. It will cause the custom Data Platform to be re-ingested each time you deploy DataHub, meaning that\nyour custom Data Platform will persist even between full cleans (nukes) of DataHub. "),(0,n.yg)("h2",{id:"changing-default-data-platforms"},"Changing Default Data Platforms"),(0,n.yg)("p",null,"Simply make a change to the ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/war/src/main/resources/boot/data_platforms.json"},"data_platforms.json"),"\nfile to add a custom Data Platform:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre"},'[ \n  .....\n  {\n    "urn": "urn:li:dataPlatform:MyCustomDataPlatform",\n    "aspect": {\n      "name": "My Custom Data Platform",\n      "type": "OTHERS",\n      "logoUrl": "https://<your-logo-url>"\n    }\n  }\n]\n')),(0,n.yg)("h2",{id:"ingesting-data-platform-at-runtime"},"Ingesting Data Platform at runtime"),(0,n.yg)("p",null,"You can also ingest a Data Platform at runtime using either a file-based ingestion source, or using a normal curl to the\n",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-service#restli-api"},"GMS Rest.li APIs"),". "),(0,n.yg)("h3",{id:"using-the-cli"},"Using the cli"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-shell"},'datahub put platform --name MyCustomDataPlatform --display_name "My Custom Data Platform" --logo "https://<your-logo-url>"\n')),(0,n.yg)("h3",{id:"using-file-based-ingestion-recipe"},"Using File-Based Ingestion Recipe"),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"Step 1")," Define a JSON file containing your custom Data Platform"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre"},'// my-custom-data-platform.json \n[\n  {\n    "auditHeader": null,\n    "proposedSnapshot": {\n      "com.linkedin.pegasus2avro.metadata.snapshot.DataPlatformSnapshot": {\n        "urn": "urn:li:dataPlatform:MyCustomDataPlatform",\n        "aspects": [\n          {\n            "com.linkedin.pegasus2avro.dataplatform.DataPlatformInfo": {\n              "datasetNameDelimiter": "/",\n              "name": "My Custom Data Platform",\n              "type": "OTHERS",\n              "logoUrl": "https://<your-logo-url>"\n            }\n          }\n        ]\n      }\n    },\n    "proposedDelta": null\n  }\n]\n')),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"Step 2"),": Define an ",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-ingestion/#recipes"},"ingestion recipe")," "),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre"},'---\n# see https://datahubproject.io/docs/generated/ingestion/sources/file for complete documentation\nsource:\n  type: "file"\n  config:\n    path: "./my-custom-data-platform.json"\n\n# see https://datahubproject.io/docs/metadata-ingestion/sink_docs/datahub for complete documentation\nsink:\n  ... \n')),(0,n.yg)("h3",{id:"using-restli-api"},"Using Rest.li API"),(0,n.yg)("p",null,"You can also issue a normal curl request to the Rest.li ",(0,n.yg)("inlineCode",{parentName:"p"},"/entities")," API to add a custom Data Platform."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre"},'curl \'http://localhost:8080/entities?action=ingest\' -X POST --data \'{\n   "entity":{\n      "value":{\n         "com.linkedin.metadata.snapshot.DataPlatformSnapshot":{\n            "aspects":[\n               {\n                  "com.linkedin.dataplatform.DataPlatformInfo":{\n                      "datasetNameDelimiter": "/",\n                      "name": "My Custom Data Platform",\n                      "type": "OTHERS",\n                      "logoUrl": "https://<your-logo-url>"\n                  }\n               }\n            ],\n            "urn":"urn:li:dataPlatform:MyCustomDataPlatform"\n         }\n      }\n   }\n}\'\n')))}f.isMDXComponent=!0}}]);