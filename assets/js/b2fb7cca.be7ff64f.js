"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[10233],{15680:(t,e,a)=>{a.d(e,{xA:()=>u,yg:()=>y});var n=a(96540);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function s(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?o(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function c(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},o=Object.keys(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var i=n.createContext({}),l=function(t){var e=n.useContext(i),a=e;return t&&(a="function"==typeof t?t(e):s(s({},e),t)),a},u=function(t){var e=l(t.components);return n.createElement(i.Provider,{value:e},t.children)},d="mdxType",p={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},g=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,o=t.originalType,i=t.parentName,u=c(t,["components","mdxType","originalType","parentName"]),d=l(a),g=r,y=d["".concat(i,".").concat(g)]||d[g]||p[g]||o;return a?n.createElement(y,s(s({ref:e},u),{},{components:a})):n.createElement(y,s({ref:e},u))}));function y(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var o=a.length,s=new Array(o);s[0]=g;var c={};for(var i in e)hasOwnProperty.call(e,i)&&(c[i]=e[i]);c.originalType=t,c[d]="string"==typeof t?t:r,s[1]=c;for(var l=2;l<o;l++)s[l]=a[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}g.displayName="MDXCreateElement"},5474:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>u,contentTitle:()=>i,default:()=>y,frontMatter:()=>c,metadata:()=>l,toc:()=>d});a(96540);var n=a(15680);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e){return e=null!=e?e:{},Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):function(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}(Object(e)).forEach((function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))})),t}function s(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},o=Object.keys(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}const c={title:"Data Contracts",slug:"/managed-datahub/observe/data-contract",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/managed-datahub/observe/data-contract.md"},i="Data Contracts",l={unversionedId:"docs/managed-datahub/observe/data-contract",id:"version-0.14.1/docs/managed-datahub/observe/data-contract",title:"Data Contracts",description:"What Is a Data Contract",source:"@site/versioned_docs/version-0.14.1/docs/managed-datahub/observe/data-contract.md",sourceDirName:"docs/managed-datahub/observe",slug:"/managed-datahub/observe/data-contract",permalink:"/docs/0.14.1/managed-datahub/observe/data-contract",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/managed-datahub/observe/data-contract.md",tags:[],version:"0.14.1",frontMatter:{title:"Data Contracts",slug:"/managed-datahub/observe/data-contract",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/managed-datahub/observe/data-contract.md"},sidebar:"overviewSidebar",previous:{title:"Business Glossary",permalink:"/docs/0.14.1/glossary/business-glossary"},next:{title:"Data Products",permalink:"/docs/0.14.1/dataproducts"}},u={},d=[{value:"What Is a Data Contract",id:"what-is-a-data-contract",level:2},{value:"Data Contract and Assertions",id:"data-contract-and-assertions",level:2},{value:"How to Create Data Contracts",id:"how-to-create-data-contracts",level:2},{value:"DataHub CLI using YAML",id:"datahub-cli-using-yaml",level:3},{value:"UI",id:"ui",level:3},{value:"API",id:"api",level:3},{value:"How to Run Data Contracts",id:"how-to-run-data-contracts",level:2},{value:"DBT Test",id:"dbt-test",level:3},{value:"Great Expectations",id:"great-expectations",level:3}],p={toc:d},g="wrapper";function y(t){var{components:e}=t,a=s(t,["components"]);return(0,n.yg)(g,o(function(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})))),n.forEach((function(e){r(t,e,a[e])}))}return t}({},p,a),{components:e,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"data-contracts"},"Data Contracts"),(0,n.yg)("h2",{id:"what-is-a-data-contract"},"What Is a Data Contract"),(0,n.yg)("p",null,"A Data Contract is ",(0,n.yg)("strong",{parentName:"p"},"an agreement between a data asset's producer and consumer"),", serving as a promise about the quality of the data.\nIt often includes ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.14.1/managed-datahub/observe/assertions"},"assertions")," about the data\u2019s schema, freshness, and data quality."),(0,n.yg)("p",null,"Some of the key characteristics of a Data Contract are:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"Verifiable")," : based on the actual physical data asset, not its metadata (e.g., schema checks, column-level data checks, and operational SLA-s but not documentation, ownership, and tags)."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"A set of assertions")," : The actual checks against the physical asset to determine a contract\u2019s status (schema, freshness, volume, custom, and column)"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"Producer oriented")," : One contract per physical data asset, owned by the producer.")),(0,n.yg)("details",null,(0,n.yg)("summary",null,"Consumer Oriented Data contracts"),"We\u2019ve gone with producer-oriented contracts to keep the number of contracts manageable and because we expect consumers to desire a lot of overlap in a given physical asset\u2019s contract. Although, we've heard feedback that consumer-oriented data contracts meet certain needs that producer-oriented contracts do not. For example, having one contract per consumer all on the same physical data asset would allow each consumer to get alerts only when the assertions they care about are violated.We welcome feedback on this in slack!"),(0,n.yg)("p",null,"Below is a screenshot of the Data Contracts UI in DataHub."),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/validated-data-contracts-ui.png"})),(0,n.yg)("h2",{id:"data-contract-and-assertions"},"Data Contract and Assertions"),(0,n.yg)("p",null,"Another way to word our vision of data contracts is ",(0,n.yg)("strong",{parentName:"p"},"A bundle of verifiable assertions on physical data assets representing a public producer commitment."),"\nThese can be all the assertions on an asset or only the subset you want publicly promised to consumers. Data Contracts allow you to ",(0,n.yg)("strong",{parentName:"p"},"promote a selected group of your assertions")," as a public promise: if this subset of assertions is not met, the Data Contract is failing."),(0,n.yg)("p",null,"See docs on ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.14.1/managed-datahub/observe/assertions"},"assertions")," for more details on the types of assertions and how to create and run them."),(0,n.yg)("admonition",{title:"Ownership ",type:"note"},(0,n.yg)("p",{parentName:"admonition"},"The owner of the physical data asset is also the owner of the contract and can accept proposed changes and make changes themselves to the contract.")),(0,n.yg)("h2",{id:"how-to-create-data-contracts"},"How to Create Data Contracts"),(0,n.yg)("p",null,"Data Contracts can be created via DataHub CLI (YAML), API, or UI."),(0,n.yg)("h3",{id:"datahub-cli-using-yaml"},"DataHub CLI using YAML"),(0,n.yg)("p",null,"For creation via CLI, it\u2019s a simple CLI upsert command that you can integrate into your CI/CD system to publish your Data Contracts and any change to them."),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Define your data contract.")),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},"# Inlined from /metadata-ingestion/examples/library/create_data_contract.yml\n# id: sample_data_contract # Optional: if not provided, an id will be generated\nentity: urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)\nversion: 1\nfreshness:\n  type: cron\n  cron: \"4 8 * * 1-5\"\ndata_quality:\n  - type: unique\n    column: field_foo\n## here's an example of how you'd define the schema\n# schema:\n#   type: json-schema\n#   json-schema:\n#     type: object\n#     properties:\n#       field_foo:\n#         type: string\n#         native_type: VARCHAR(100)\n#       field_bar:\n#         type: boolean\n#         native_type: boolean\n#       field_documents:\n#         type: array\n#         items:\n#           type: object\n#           properties:\n#             docId:\n#               type: object\n#               properties:\n#                 docPolicy:\n#                   type: object\n#                   properties:\n#                     policyId:\n#                       type: integer\n#                     fileId:\n#                       type: integer\n#     required:\n#       - field_bar\n#       - field_documents\n\n")),(0,n.yg)("ol",{start:2},(0,n.yg)("li",{parentName:"ol"},"Use the CLI to create the contract by running the below command.")),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-shell"},"datahub datacontract upsert -f contract_definition.yml\n")),(0,n.yg)("ol",{start:3},(0,n.yg)("li",{parentName:"ol"},"Now you can see your contract on the UI.")),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/data-contracts-ui.png"})),(0,n.yg)("h3",{id:"ui"},"UI"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Navigate to the Dataset Profile for the dataset you wish to create a contract for"),(0,n.yg)("li",{parentName:"ol"},"Under the ",(0,n.yg)("strong",{parentName:"li"},"Validations")," > ",(0,n.yg)("strong",{parentName:"li"},"Data Contracts")," tab, click ",(0,n.yg)("strong",{parentName:"li"},"Create"),".")),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/create-data-contract-ui.png"})),(0,n.yg)("ol",{start:3},(0,n.yg)("li",{parentName:"ol"},"Select the assertions you wish to be included in the Data Contract.")),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/select-assertions.png"})),(0,n.yg)("admonition",{title:"Create Data Contracts via UI",type:"note"},(0,n.yg)("p",{parentName:"admonition"},"When creating a Data Contract via UI, the Freshness, Schema, and Data Quality assertions must be created first.")),(0,n.yg)("ol",{start:4},(0,n.yg)("li",{parentName:"ol"},"Now you can see it in the UI.")),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/contracts-created.png"})),(0,n.yg)("h3",{id:"api"},"API"),(0,n.yg)("p",null,(0,n.yg)("em",{parentName:"p"},"API guide on creating data contract is coming soon!")),(0,n.yg)("h2",{id:"how-to-run-data-contracts"},"How to Run Data Contracts"),(0,n.yg)("p",null,"Running Data Contracts is dependent on running the contract\u2019s assertions and getting the results on Datahub. Using Acryl Observe (available on SAAS), you can schedule assertions on Datahub itself. Otherwise, you can run your assertions outside of Datahub and have the results published back to Datahub. "),(0,n.yg)("p",null,"Datahub integrates nicely with DBT Test and Great Expectations, as described below. For other 3rd party assertion runners, you\u2019ll need to use our APIs to publish the assertion results back to our platform."),(0,n.yg)("h3",{id:"dbt-test"},"DBT Test"),(0,n.yg)("p",null,"During DBT Ingestion, we pick up the dbt ",(0,n.yg)("inlineCode",{parentName:"p"},"run_results")," file, which contains the dbt test run results, and translate it into assertion runs. ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.14.1/generated/ingestion/sources/dbt#module-dbt"},"See details here.")),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/dbt-test.png"})),(0,n.yg)("h3",{id:"great-expectations"},"Great Expectations"),(0,n.yg)("p",null,"For Great Expectations, you can integrate the ",(0,n.yg)("strong",{parentName:"p"},"DataHubValidationAction")," directly into your Great Expectations Checkpoint in order to have the assertion (aka. expectation) results to Datahub. ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.14.1/metadata-ingestion/integration_docs/great-expectations"},"See the guide here"),"."),(0,n.yg)("p",{align:"center"},(0,n.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/observe/data_contracts/gx-test.png"})))}y.isMDXComponent=!0}}]);