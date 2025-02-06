"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[63500],{15680:(e,t,a)=>{a.d(t,{xA:()=>c,yg:()=>m});var n=a(96540);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},c=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(a),d=i,m=u["".concat(s,".").concat(d)]||u[d]||g[d]||r;return a?n.createElement(m,o(o({ref:t},c),{},{components:a})):n.createElement(m,o({ref:t},c))}));function m(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,o=new Array(r);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:i,o[1]=l;for(var p=2;p<r;p++)o[p]=a[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},81679:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>p,toc:()=>u});a(96540);var n=a(15680);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})),e}function o(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}const l={title:"Great Expectations",slug:"/metadata-ingestion/integration_docs/great-expectations",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/integration_docs/great-expectations.md"},s="Great Expectations",p={unversionedId:"metadata-ingestion/integration_docs/great-expectations",id:"version-0.15.0/metadata-ingestion/integration_docs/great-expectations",title:"Great Expectations",description:"This guide helps to setup and configure DataHubValidationAction in Great Expectations to send assertions(expectations) and their results to DataHub using DataHub's Python Rest emitter.",source:"@site/versioned_docs/version-0.15.0/metadata-ingestion/integration_docs/great-expectations.md",sourceDirName:"metadata-ingestion/integration_docs",slug:"/metadata-ingestion/integration_docs/great-expectations",permalink:"/docs/0.15.0/metadata-ingestion/integration_docs/great-expectations",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/integration_docs/great-expectations.md",tags:[],version:"0.15.0",frontMatter:{title:"Great Expectations",slug:"/metadata-ingestion/integration_docs/great-expectations",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/integration_docs/great-expectations.md"},sidebar:"overviewSidebar",previous:{title:"Spark",permalink:"/docs/0.15.0/metadata-integration/java/acryl-spark-lineage"},next:{title:"Protobuf Schemas",permalink:"/docs/0.15.0/metadata-integration/java/datahub-protobuf"}},c={},u=[{value:"Capabilities",id:"capabilities",level:2},{value:"Limitations",id:"limitations",level:2},{value:"Setting up",id:"setting-up",level:2},{value:"Debugging",id:"debugging",level:2},{value:"Learn more",id:"learn-more",level:2}],g={toc:u},d="wrapper";function m(e){var{components:t}=e,a=o(e,["components"]);return(0,n.yg)(d,r(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){i(e,t,a[t])}))}return e}({},g,a),{components:t,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"great-expectations"},"Great Expectations"),(0,n.yg)("p",null,"This guide helps to setup and configure ",(0,n.yg)("inlineCode",{parentName:"p"},"DataHubValidationAction")," in Great Expectations to send assertions(expectations) and their results to DataHub using DataHub's Python Rest emitter."),(0,n.yg)("h2",{id:"capabilities"},"Capabilities"),(0,n.yg)("p",null,(0,n.yg)("inlineCode",{parentName:"p"},"DataHubValidationAction")," pushes assertions metadata to DataHub. This includes"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"Assertion Details"),": Details of assertions (i.e. expectation) set on a Dataset (Table). "),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"Assertion Results"),": Evaluation results for an assertion tracked over time. ")),(0,n.yg)("p",null,"This integration supports v3 api datasources using SqlAlchemyExecutionEngine. "),(0,n.yg)("h2",{id:"limitations"},"Limitations"),(0,n.yg)("p",null,"This integration does not support"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"v2 Datasources such as SqlAlchemyDataset"),(0,n.yg)("li",{parentName:"ul"},"v3 Datasources using execution engine other than SqlAlchemyExecutionEngine (Spark, Pandas)"),(0,n.yg)("li",{parentName:"ul"},"Cross-dataset expectations (those involving > 1 table)")),(0,n.yg)("h2",{id:"setting-up"},"Setting up"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Install the required dependency in your Great Expectations environment.  ",(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-shell"},"pip install 'acryl-datahub-gx-plugin'\n")))),(0,n.yg)("ol",{start:2},(0,n.yg)("li",{parentName:"ol"},"To add ",(0,n.yg)("inlineCode",{parentName:"li"},"DataHubValidationAction")," in Great Expectations Checkpoint, add following configuration in action_list for your Great Expectations ",(0,n.yg)("inlineCode",{parentName:"li"},"Checkpoint"),". For more details on setting action_list, see ",(0,n.yg)("a",{parentName:"li",href:"https://docs.greatexpectations.io/docs/reference/checkpoints_and_actions/"},"Checkpoints and Actions")," ",(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"action_list:\n  - name: datahub_action\n    action:\n      module_name: datahub_gx_plugin.action\n      class_name: DataHubValidationAction\n      server_url: http://localhost:8080 #datahub server url\n")),(0,n.yg)("strong",{parentName:"li"},"Configuration options:"),(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"server_url")," (required): URL of DataHub GMS endpoint"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"env"),' (optional, defaults to "PROD"): Environment to use in namespace when constructing dataset URNs.'),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"exclude_dbname")," (optional): Exclude dbname / catalog when constructing dataset URNs. (Highly applicable to Trino / Presto where we want to omit catalog e.g. ",(0,n.yg)("inlineCode",{parentName:"li"},"hive"),")"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"platform_alias")," (optional): Platform alias when constructing dataset URNs. e.g. main data platform is ",(0,n.yg)("inlineCode",{parentName:"li"},"presto-on-hive")," but using ",(0,n.yg)("inlineCode",{parentName:"li"},"trino")," to run the test"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"platform_instance_map")," (optional): Platform instance mapping to use when constructing dataset URNs. Maps the GX 'data source' name to a platform instance on DataHub. e.g. ",(0,n.yg)("inlineCode",{parentName:"li"},'platform_instance_map: { "datasource_name": "warehouse" }')),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"graceful_exceptions")," (defaults to true): If set to true, most runtime errors in the lineage backend will be suppressed and will not cause the overall checkpoint to fail. Note that configuration issues will still throw exceptions."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"token")," (optional): Bearer token used for authentication."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"timeout_sec")," (optional): Per-HTTP request timeout."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"retry_status_codes")," (optional): Retry HTTP request also on these status codes."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"retry_max_times")," (optional): Maximum times to retry if HTTP request fails. The delay between retries is increased exponentially."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"extra_headers")," (optional): Extra headers which will be added to the datahub request."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"parse_table_names_from_sql")," (defaults to false): The integration can use an SQL parser to try to parse the datasets being asserted. This parsing is disabled by default, but can be enabled by setting ",(0,n.yg)("inlineCode",{parentName:"li"},"parse_table_names_from_sql: True"),".  The parser is based on the ",(0,n.yg)("a",{parentName:"li",href:"https://pypi.org/project/sqllineage/"},(0,n.yg)("inlineCode",{parentName:"a"},"sqllineage"))," package."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"convert_urns_to_lowercase")," (optional): Whether to convert dataset urns to lowercase.")))),(0,n.yg)("h2",{id:"debugging"},"Debugging"),(0,n.yg)("p",null,"Set environment variable ",(0,n.yg)("inlineCode",{parentName:"p"},"DATAHUB_DEBUG")," (default ",(0,n.yg)("inlineCode",{parentName:"p"},"false"),") to ",(0,n.yg)("inlineCode",{parentName:"p"},"true")," to enable debug logging for ",(0,n.yg)("inlineCode",{parentName:"p"},"DataHubValidationAction"),"."),(0,n.yg)("h2",{id:"learn-more"},"Learn more"),(0,n.yg)("p",null,"To see the Great Expectations in action, check out ",(0,n.yg)("a",{parentName:"p",href:"https://www.loom.com/share/d781c9f0b270477fb5d6b0c26ef7f22d"},"this demo")," from the Feb 2022 townhall."))}m.isMDXComponent=!0}}]);