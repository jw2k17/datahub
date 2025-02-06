"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[33979],{44977:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>u,default:()=>h,frontMatter:()=>l,metadata:()=>d,toc:()=>y});a(96540);var n=a(15680),o=a(53720),r=a(5400);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})),e}function p(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}const l={title:"Operations",slug:"/api/tutorials/operations",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/operations.md"},u="Operations",d={unversionedId:"docs/api/tutorials/operations",id:"version-0.15.0/docs/api/tutorials/operations",title:"Operations",description:"Why Would You Use Operations APIs?",source:"@site/versioned_docs/version-0.15.0/docs/api/tutorials/operations.md",sourceDirName:"docs/api/tutorials",slug:"/api/tutorials/operations",permalink:"/docs/0.15.0/api/tutorials/operations",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/operations.md",tags:[],version:"0.15.0",frontMatter:{title:"Operations",slug:"/api/tutorials/operations",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/operations.md"},sidebar:"overviewSidebar",previous:{title:"Incidents",permalink:"/docs/0.15.0/api/tutorials/incidents"},next:{title:"Data Contracts",permalink:"/docs/0.15.0/api/tutorials/data-contracts"}},c={},y=[{value:"Why Would You Use Operations APIs?",id:"why-would-you-use-operations-apis",level:2},{value:"Goal Of This Guide",id:"goal-of-this-guide",level:3},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Report Operations",id:"report-operations",level:2},{value:"Read Operations",id:"read-operations",level:2},{value:"Expected Outcomes of Reporting Operations",id:"expected-outcomes-of-reporting-operations",level:3}],g={toc:y},m="wrapper";function h(e){var{components:t}=e,a=p(e,["components"]);return(0,n.yg)(m,s(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){i(e,t,a[t])}))}return e}({},g,a),{components:t,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"operations"},"Operations"),(0,n.yg)("h2",{id:"why-would-you-use-operations-apis"},"Why Would You Use Operations APIs?"),(0,n.yg)("p",null,"The Operations APIs allow you to report operational changes that were made to a given Dataset or Table using the 'Operation' concept.\nThese operations may be viewed on the Dataset Profile (e.g. as last modified time), accessed via the DataHub GraphQL API, or\nused as inputs to DataHub Cloud ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.15.0/managed-datahub/observe/freshness-assertions"},"Freshness Assertions"),". "),(0,n.yg)("h3",{id:"goal-of-this-guide"},"Goal Of This Guide"),(0,n.yg)("p",null,"This guide will show you how to report and query Operations for a Dataset. "),(0,n.yg)("h2",{id:"prerequisites"},"Prerequisites"),(0,n.yg)("p",null,"For this tutorial, you need to deploy DataHub Quickstart and ingest sample data.\nFor detailed steps, please refer to ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.15.0/quickstart"},"DataHub Quickstart Guide"),"."),(0,n.yg)("admonition",{type:"note"},(0,n.yg)("p",{parentName:"admonition"},"Before reporting operations for a dataset, you need to ensure the targeted dataset is already present in DataHub.")),(0,n.yg)("h2",{id:"report-operations"},"Report Operations"),(0,n.yg)("p",null,"You can use report dataset operations to DataHub using the following APIs. "),(0,n.yg)(o.A,{mdxType:"Tabs"},(0,n.yg)(r.A,{value:"graphql",label:"GraphQL",default:!0,mdxType:"TabItem"},(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation reportOperation {\n  reportOperation(\n      input: { \n          urn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)", \n          operationType: INSERT,\n          sourceType: DATA_PROCESS\n      }\n  )\n}\n')),(0,n.yg)("p",null,"Where supported operation types include"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"INSERT")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"UPDATE")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"DELETE")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"CREATE")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"ALTER")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"DROP")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"CUSTOM"))),(0,n.yg)("p",null,"If you want to report an operation that happened at a specific time, you can also optionally provide\nthe ",(0,n.yg)("inlineCode",{parentName:"p"},"timestampMillis")," field. If not provided, the current server time will be used as the operation time. "),(0,n.yg)("p",null,"If you see the following response, the operation was successful:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-json"},'{\n  "data": {\n    "reportOperation": true\n  },\n  "extensions": {}\n}\n'))),(0,n.yg)(r.A,{value:"python",label:"Python",mdxType:"TabItem"},(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'# Inlined from /metadata-ingestion/examples/library/dataset_report_operation.py\nfrom datahub.api.graphql import Operation\n\nDATAHUB_HOST = "https//:org.acryl.io/gms"\nDATAHUB_TOKEN = "<your-datahub-access-token"\n\ndataset_urn = "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)"\n\noperation_client = Operation(\n    datahub_host=DATAHUB_HOST,\n    datahub_token=DATAHUB_TOKEN,\n)\n\noperation_type = "INSERT"\nsource_type = "DATA_PROCESS"  # Source of the operation (data platform or DAG task)\n\n# Report a change operation for the Dataset.\noperation_client.report_operation(\n    urn=dataset_urn, operation_type=operation_type, source_type=source_type\n)\n\n')))),(0,n.yg)("h2",{id:"read-operations"},"Read Operations"),(0,n.yg)("p",null,"You can use read dataset operations to DataHub using the following APIs."),(0,n.yg)(o.A,{mdxType:"Tabs"},(0,n.yg)(r.A,{value:"graphql",label:"GraphQL",default:!0,mdxType:"TabItem"},(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-graphql"},'query dataset {\n    dataset(urn: "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)") {\n        operations(\n            limit: 10, filter: [], startTimeMillis: <start-timestamp-ms>, endTimeMillis: <end-timestamp-ms>\n        ) {\n            timestampMillis\n            operationType\n            sourceType\n        }\n    }\n}\n')),(0,n.yg)("p",null,"Where startTimeMillis and endTimeMillis are optional. By default, operations are sorted by time descending. "),(0,n.yg)("p",null,"If you see the following response, the operation was successful:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-json"},'{\n  "data": {\n    "dataset": {\n        "operations": [\n            {\n                "timestampMillis": 1231232332,\n                "operationType": "INSERT",\n                "sourceType": "DATA_PROCESS"\n            }\n        ]\n    }\n  },\n  "extensions": {}\n}\n'))),(0,n.yg)(r.A,{value:"python",label:"Python",mdxType:"TabItem"},(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'# Inlined from /metadata-ingestion/examples/library/dataset_read_operations.py\nfrom datahub.api.graphql import Operation\n\nDATAHUB_HOST = "https//:org.acryl.io/gms"\nDATAHUB_TOKEN = "<your-datahub-access-token"\n\ndataset_urn = "urn:li:dataset:(urn:li:dataPlatform:hive,fct_users_created,PROD)"\n\noperation_client = Operation(\n    datahub_host=DATAHUB_HOST,\n    datahub_token=DATAHUB_TOKEN,\n)\n\n# Query for changes to the Dataset.\noperations = operation_client.query_operations(\n    urn=dataset_urn,\n    # limit=5,\n    # start_time_millis=<timestamp>,\n    # end_time_millis=<timestamo>\n)\n\n')))),(0,n.yg)("h3",{id:"expected-outcomes-of-reporting-operations"},"Expected Outcomes of Reporting Operations"),(0,n.yg)("p",null,"Reported Operations will appear when displaying the Last Updated time for a Dataset on their DataHub Profile.\nThey will also be used when selecting the ",(0,n.yg)("inlineCode",{parentName:"p"},"DataHub Operation")," source type under the ",(0,n.yg)("strong",{parentName:"p"},"Advanced")," settings of a Freshness\nAssertion."))}h.isMDXComponent=!0}}]);