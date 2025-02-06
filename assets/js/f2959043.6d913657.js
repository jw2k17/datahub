"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[19093],{15680:(e,t,n)=>{n.d(t,{xA:()=>g,yg:()=>c});var r=n(96540);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},g=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,g=l(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,c=d["".concat(p,".").concat(m)]||d[m]||u[m]||i;return n?r.createElement(c,o(o({ref:t},g),{},{components:n})):r.createElement(c,o({ref:t},g))}));function c(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[d]="string"==typeof e?e:a,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},71831:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>g,contentTitle:()=>p,default:()=>c,frontMatter:()=>l,metadata:()=>s,toc:()=>d});n(96540);var r=n(15680);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}const l={title:"Datahub's Reporting Framework for Ingestion Job Telemetry",slug:"/metadata-ingestion/docs/dev_guides/reporting_telemetry",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/docs/dev_guides/reporting_telemetry.md"},p="Datahub's Reporting Framework for Ingestion Job Telemetry",s={unversionedId:"metadata-ingestion/docs/dev_guides/reporting_telemetry",id:"metadata-ingestion/docs/dev_guides/reporting_telemetry",title:"Datahub's Reporting Framework for Ingestion Job Telemetry",description:"The Datahub's reporting framework allows for configuring reporting providers with the ingestion pipelines to send",source:"@site/genDocs/metadata-ingestion/docs/dev_guides/reporting_telemetry.md",sourceDirName:"metadata-ingestion/docs/dev_guides",slug:"/metadata-ingestion/docs/dev_guides/reporting_telemetry",permalink:"/docs/metadata-ingestion/docs/dev_guides/reporting_telemetry",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/docs/dev_guides/reporting_telemetry.md",tags:[],version:"current",frontMatter:{title:"Datahub's Reporting Framework for Ingestion Job Telemetry",slug:"/metadata-ingestion/docs/dev_guides/reporting_telemetry",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/docs/dev_guides/reporting_telemetry.md"},sidebar:"overviewSidebar",previous:{title:"General Debugging Guide",permalink:"/docs/troubleshooting/general"},next:{title:"MetadataChangeProposal & MetadataChangeLog Events",permalink:"/docs/advanced/mcp-mcl"}},g={},d=[{value:"Config details",id:"config-details",level:2},{value:"Supported sources",id:"supported-sources",level:4},{value:"Sample configuration",id:"sample-configuration",level:4},{value:"Reporting Ingestion State Provider (Developer Guide)",id:"reporting-ingestion-state-provider-developer-guide",level:2},{value:"Datahub Reporting Ingestion State Provider",id:"datahub-reporting-ingestion-state-provider",level:3},{value:"Config details",id:"config-details-1",level:4}],u={toc:d},m="wrapper";function c(e){var{components:t}=e,n=o(e,["components"]);return(0,r.yg)(m,i(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){a(e,t,n[t])}))}return e}({},u,n),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"datahubs-reporting-framework-for-ingestion-job-telemetry"},"Datahub's Reporting Framework for Ingestion Job Telemetry"),(0,r.yg)("p",null,"The Datahub's reporting framework allows for configuring reporting providers with the ingestion pipelines to send\ntelemetry about the ingestion job runs to external systems for monitoring purposes. It is powered by the Datahub's\nstateful ingestion framework. The ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub")," reporting provider comes with the standard client installation,\nand allows for reporting ingestion job telemetry to the datahub backend as the destination."),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},(0,r.yg)("em",{parentName:"strong"},"NOTE")),": This feature requires the server to be ",(0,r.yg)("inlineCode",{parentName:"p"},"statefulIngestion")," capable.\nThis is a feature of metadata service with version >= ",(0,r.yg)("inlineCode",{parentName:"p"},"0.8.20"),"."),(0,r.yg)("p",null,"To check if you are running a stateful ingestion capable server:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-console"},'curl http://<datahub-gms-endpoint>/config\n\n{\nmodels: { },\nstatefulIngestionCapable: true, # <-- this should be present and true\nretention: "true",\nnoCode: "true"\n}\n')),(0,r.yg)("h2",{id:"config-details"},"Config details"),(0,r.yg)("p",null,"The ingestion reporting providers are a list of reporting provider configurations under the ",(0,r.yg)("inlineCode",{parentName:"p"},"reporting")," config\nparam of the pipeline, each reporting provider configuration begin a type and config pair object. The telemetry data will\nbe sent to all the reporting providers in this list."),(0,r.yg)("p",null,"Note that a ",(0,r.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields, and ",(0,r.yg)("inlineCode",{parentName:"p"},"[idx]")," is used to denote an element of an array of objects in the YAML recipe."),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Field"),(0,r.yg)("th",{parentName:"tr",align:null},"Required"),(0,r.yg)("th",{parentName:"tr",align:null},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"reporting[idx].type")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"datahub")),(0,r.yg)("td",{parentName:"tr",align:null},"The type of the ingestion reporting provider registered with datahub.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"reporting[idx].config")),(0,r.yg)("td",{parentName:"tr",align:null}),(0,r.yg)("td",{parentName:"tr",align:null},"The ",(0,r.yg)("inlineCode",{parentName:"td"},"datahub_api")," config if set at pipeline level. Otherwise, the default ",(0,r.yg)("inlineCode",{parentName:"td"},"DatahubClientConfig"),". See the ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/graph/client.py#L19"},"defaults")," here."),(0,r.yg)("td",{parentName:"tr",align:null},"The configuration required for initializing the datahub reporting provider.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"pipeline_name")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null}),(0,r.yg)("td",{parentName:"tr",align:null},"The name of the ingestion pipeline. This is used as a part of the identifying key for the telemetry data reported by each job in the ingestion pipeline.")))),(0,r.yg)("h4",{id:"supported-sources"},"Supported sources"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"All sql based sources."),(0,r.yg)("li",{parentName:"ul"},"snowflake_usage.")),(0,r.yg)("h4",{id:"sample-configuration"},"Sample configuration"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-yaml"},'source:\n  type: "snowflake"\n  config:\n    username: <user_name>\n    password: <password>\n    role: <role>\n    host_port: <host_port>\n    warehouse: <ware_house>\n    # Rest of the source specific params ...\n# This is mandatory. Changing it will cause old telemetry correlation to be lost.\npipeline_name: "my_snowflake_pipeline_1"\n\n# Pipeline-level datahub_api configuration.\ndatahub_api: # Optional. But if provided, this config will be used by the "datahub" ingestion state provider.\n    server: "http://localhost:8080"\n    \nsink:\n  type: "datahub-rest"\n  config:\n    server: \'http://localhost:8080\'\n\nreporting:\n  - type: "datahub" # Required\n    config: # Optional. \n      datahub_api: # default value\n        server: "http://localhost:8080"\n')),(0,r.yg)("h2",{id:"reporting-ingestion-state-provider-developer-guide"},"Reporting Ingestion State Provider (Developer Guide)"),(0,r.yg)("p",null,"An ingestion reporting state provider is responsible for saving and retrieving the ingestion telemetry\nassociated with the ingestion runs of various jobs inside the source connector of the ingestion pipeline.\nThe data model used for capturing the telemetry is ",(0,r.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-models/src/main/pegasus/com/linkedin/datajob/datahub/DatahubIngestionRunSummary.pdl"},"DatahubIngestionRunSummary"),".\nA reporting ingestion state provider needs to implement the IngestionReportingProviderBase.\ninterface and register itself with datahub by adding an entry under ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub.ingestion.reporting_provider.plugins"),"\nkey of the entry_points section in ",(0,r.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/setup.py"},"setup.py"),"\nwith its type and implementation class as shown below. "),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-python"},'entry_points = {\n    # <snip other keys>"\n    "datahub.ingestion.reporting_provider.plugins": [\n        "datahub = datahub.ingestion.reporting.datahub_ingestion_run_summary_provider:DatahubIngestionRunSummaryProvider",\n        "file = datahub.ingestion.reporting.file_reporter:FileReporter",\n    ],\n}\n')),(0,r.yg)("h3",{id:"datahub-reporting-ingestion-state-provider"},"Datahub Reporting Ingestion State Provider"),(0,r.yg)("p",null,"This is the reporting state provider implementation that is available out of the box in datahub. Its type is ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub")," and it is implemented on top\nof the ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub_api")," client and the timeseries aspect capabilities of the datahub-backend."),(0,r.yg)("h4",{id:"config-details-1"},"Config details"),(0,r.yg)("p",null,"Note that a ",(0,r.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Field"),(0,r.yg)("th",{parentName:"tr",align:null},"Required"),(0,r.yg)("th",{parentName:"tr",align:null},"Default"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"type")),(0,r.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"datahub")),(0,r.yg)("td",{parentName:"tr",align:null},"The type of the ingestion reporting provider registered with datahub.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"config")),(0,r.yg)("td",{parentName:"tr",align:null}),(0,r.yg)("td",{parentName:"tr",align:null},"The ",(0,r.yg)("inlineCode",{parentName:"td"},"datahub_api")," config if set at pipeline level. Otherwise, the default ",(0,r.yg)("inlineCode",{parentName:"td"},"DatahubClientConfig"),". See the ",(0,r.yg)("a",{parentName:"td",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/graph/client.py#L19"},"defaults")," here."),(0,r.yg)("td",{parentName:"tr",align:null},"The configuration required for initializing the datahub reporting provider.")))))}c.isMDXComponent=!0}}]);