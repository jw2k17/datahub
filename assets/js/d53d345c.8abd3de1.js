"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[79270],{67909:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>d,contentTitle:()=>g,default:()=>u,frontMatter:()=>p,metadata:()=>y,toc:()=>m});t(96540);var n=t(15680),s=t(53720),l=t(5400);function i(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){return a=null!=a?a:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):function(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})),e}function o(e,a){if(null==e)return{};var t,n,s=function(e,a){if(null==e)return{};var t,n,s={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(s[t]=e[t]);return s}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}const p={sidebar_position:59,title:"Salesforce",slug:"/generated/ingestion/sources/salesforce",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/salesforce.md"},g="Salesforce",y={unversionedId:"docs/generated/ingestion/sources/salesforce",id:"docs/generated/ingestion/sources/salesforce",title:"Salesforce",description:"Incubating",source:"@site/genDocs/docs/generated/ingestion/sources/salesforce.md",sourceDirName:"docs/generated/ingestion/sources",slug:"/generated/ingestion/sources/salesforce",permalink:"/docs/generated/ingestion/sources/salesforce",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/salesforce.md",tags:[],version:"current",sidebarPosition:59,frontMatter:{sidebar_position:59,title:"Salesforce",slug:"/generated/ingestion/sources/salesforce",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/salesforce.md"},sidebar:"overviewSidebar",previous:{title:"SageMaker",permalink:"/docs/generated/ingestion/sources/sagemaker"},next:{title:"SAP Analytics Cloud",permalink:"/docs/generated/ingestion/sources/sac"}},d={},m=[{value:"Important Capabilities",id:"important-capabilities",level:3},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Integration Details",id:"integration-details",level:2},{value:"REST API Resources used in this integration",id:"rest-api-resources-used-in-this-integration",level:3},{value:"Concept Mapping",id:"concept-mapping",level:3},{value:"Caveats",id:"caveats",level:3},{value:"CLI based Ingestion",id:"cli-based-ingestion",level:3},{value:"Starter Recipe",id:"starter-recipe",level:3},{value:"Config Details",id:"config-details",level:3},{value:"Code Coordinates",id:"code-coordinates",level:3}],c={toc:m},f="wrapper";function u(e){var{components:a}=e,t=o(e,["components"]);return(0,n.yg)(f,r(function(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),n.forEach((function(a){i(e,a,t[a])}))}return e}({},c,t),{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"salesforce"},"Salesforce"),(0,n.yg)("p",null,(0,n.yg)("img",{parentName:"p",src:"https://img.shields.io/badge/support%20status-incubating-blue",alt:"Incubating"})),(0,n.yg)("h3",{id:"important-capabilities"},"Important Capabilities"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Capability"),(0,n.yg)("th",{parentName:"tr",align:null},"Status"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/metadata-ingestion/docs/dev_guides/sql_profiles"},"Data Profiling")),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Only table level profiling is supported via ",(0,n.yg)("inlineCode",{parentName:"td"},"profiling.enabled")," config field")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/metadata-ingestion/docs/dev_guides/stateful#stale-entity-removal"},"Detect Deleted Entities")),(0,n.yg)("td",{parentName:"tr",align:null},"\u274c"),(0,n.yg)("td",{parentName:"tr",align:null},"Not supported yet")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/domains"},"Domains")),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Supported via the ",(0,n.yg)("inlineCode",{parentName:"td"},"domain")," config field")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Extract Tags"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Enabled by default")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/platform-instances"},"Platform Instance")),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Can be equivalent to Salesforce organization")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Schema Metadata"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Enabled by default")))),(0,n.yg)("h3",{id:"prerequisites"},"Prerequisites"),(0,n.yg)("p",null,"In order to ingest metadata from Salesforce, you will need one of:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Salesforce username, password, ",(0,n.yg)("a",{parentName:"li",href:"https://developer.Salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm"},"security token")),(0,n.yg)("li",{parentName:"ul"},"Salesforce username, consumer key and private key for ",(0,n.yg)("a",{parentName:"li",href:"https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5"},"JSON web token access")),(0,n.yg)("li",{parentName:"ul"},"Salesforce instance url and access token/session id (suitable for one-shot ingestion only, as access token typically expires after 2 hours of inactivity)")),(0,n.yg)("p",null,"The account used to access Salesforce requires the following permissions for this integration to work:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"View Setup and Configuration"),(0,n.yg)("li",{parentName:"ul"},"View All Data")),(0,n.yg)("h2",{id:"integration-details"},"Integration Details"),(0,n.yg)("p",null,"This plugin extracts Salesforce Standard and Custom Objects and their details (fields, record count, etc) from a Salesforce instance.\nPython library ",(0,n.yg)("a",{parentName:"p",href:"https://pypi.org/project/simple-salesforce/"},"simple-salesforce")," is used for authenticating and calling  ",(0,n.yg)("a",{parentName:"p",href:"https://developer.Salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm"},"Salesforce REST API")," to retrive details from Salesforce instance."),(0,n.yg)("h3",{id:"rest-api-resources-used-in-this-integration"},"REST API Resources used in this integration"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://developer.Salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_versions.htm"},"Versions")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/intro_rest_resources.htm"},"Tooling API Query")," on objects EntityDefinition, EntityParticle, CustomObject, CustomField"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://developer.Salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_record_count.htm"},"Record Count"))),(0,n.yg)("h3",{id:"concept-mapping"},"Concept Mapping"),(0,n.yg)("p",null,"This ingestion source maps the following Source System Concepts to DataHub Concepts:"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Source Concept"),(0,n.yg)("th",{parentName:"tr",align:null},"DataHub Concept"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("inlineCode",{parentName:"td"},"Salesforce")),(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/generated/metamodel/entities/dataplatform"},"Data Platform")),(0,n.yg)("td",{parentName:"tr",align:null})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Standard Object"),(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/generated/metamodel/entities/dataset"},"Dataset")),(0,n.yg)("td",{parentName:"tr",align:null},'subtype "Standard Object"')),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Custom Object"),(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/generated/metamodel/entities/dataset"},"Dataset")),(0,n.yg)("td",{parentName:"tr",align:null},'subtype "Custom Object"')))),(0,n.yg)("h3",{id:"caveats"},"Caveats"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"This connector has only been tested with Salesforce Developer Edition."),(0,n.yg)("li",{parentName:"ul"},"This connector only supports table level profiling (Row and Column counts) as of now. Row counts are approximate as returned by ",(0,n.yg)("a",{parentName:"li",href:"https://developer.Salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_record_count.htm"},"Salesforce RecordCount REST API"),"."),(0,n.yg)("li",{parentName:"ul"},"This integration does not support ingesting Salesforce ",(0,n.yg)("a",{parentName:"li",href:"https://developer.Salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_external_objects.htm"},"External Objects"))),(0,n.yg)("h3",{id:"cli-based-ingestion"},"CLI based Ingestion"),(0,n.yg)("h3",{id:"starter-recipe"},"Starter Recipe"),(0,n.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,n.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'pipeline_name: my_salesforce_pipeline\nsource:\n  type: "salesforce"\n  config:\n    instance_url: "https://mydomain.my.salesforce.com/"\n    username: user@company\n    password: password_for_user\n    security_token: security_token_for_user\n    platform_instance: mydomain-dev-ed\n    domain:\n      sales:\n        allow:\n          - "Opportunity$"\n          - "Lead$"\n\n    object_pattern:\n      allow:\n        - "Account$"\n        - "Opportunity$"\n        - "Lead$"\n\nsink:\n  type: "datahub-rest"\n  config:\n    server: "http://localhost:8080"\n')),(0,n.yg)("h3",{id:"config-details"},"Config Details"),(0,n.yg)(s.A,{mdxType:"Tabs"},(0,n.yg)(l.A,{value:"options",label:"Options",default:!0,mdxType:"TabItem"},(0,n.yg)("p",null,"Note that a ",(0,n.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,n.yg)("div",{className:"config-table"},(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:"left"},"Field"),(0,n.yg)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"access_token"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Access token for instance url")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"api_version"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"If specified, overrides default version used by the Salesforce package. Example value: '59.0'")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"auth"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"Enum"))),(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"default-line "},"Default: ",(0,n.yg)("span",{className:"default-value"},"USERNAME","_","PASSWORD")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"consumer_key"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Consumer key for Salesforce JSON web token access")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"ingest_tags"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Ingest Tags from source. This will override Tags entered from UI ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"instance_url"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Salesforce instance url. e.g. ",(0,n.yg)("a",{parentName:"td",href:"https://MyDomainName.my.salesforce.com"},"https://MyDomainName.my.salesforce.com"))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"is_sandbox"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Connect to Sandbox instance of your Salesforce ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"password"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Password for Salesforce user")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"default-line "},"Default: ",(0,n.yg)("span",{className:"default-value"},"salesforce")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform_instance"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The instance of the platform that all assets produced by this recipe belong to. This should be unique within the platform. See ",(0,n.yg)("a",{parentName:"td",href:"https://datahubproject.io/docs/platform-instances/"},"https://datahubproject.io/docs/platform-instances/")," for more details.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"private_key"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Private key as a string for Salesforce JSON web token access")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"security_token"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Security token for Salesforce username")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"username"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Salesforce username")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"env"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The environment that all assets produced by this connector belong to ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"PROD")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"domain"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"map(str,AllowDenyPattern)"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"A class to store allow deny regexes")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"domain.",(0,n.yg)("inlineCode",{parentName:"td"},"key"),"."),(0,n.yg)("span",{className:"path-main"},"allow"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to include in ingestion ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","'",".","*","'","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"domain.",(0,n.yg)("inlineCode",{parentName:"td"},"key"),".allow."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"domain.",(0,n.yg)("inlineCode",{parentName:"td"},"key"),"."),(0,n.yg)("span",{className:"path-main"},"ignoreCase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ignore case sensitivity during pattern matching. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"domain.",(0,n.yg)("inlineCode",{parentName:"td"},"key"),"."),(0,n.yg)("span",{className:"path-main"},"deny"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to exclude from ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"domain.",(0,n.yg)("inlineCode",{parentName:"td"},"key"),".deny."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"object_pattern"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"AllowDenyPattern"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Regex patterns for Salesforce objects to filter in ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","allow","'",": ","[","'",".","*","'","]",", ","'","deny","'",": ","[","]",", ","'","ignoreCase","'",": True","}")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"object_pattern."),(0,n.yg)("span",{className:"path-main"},"ignoreCase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ignore case sensitivity during pattern matching. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"object_pattern."),(0,n.yg)("span",{className:"path-main"},"allow"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to include in ingestion ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","'",".","*","'","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"object_pattern.allow."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"object_pattern."),(0,n.yg)("span",{className:"path-main"},"deny"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to exclude from ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"object_pattern.deny."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"profile_pattern"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"AllowDenyPattern"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Regex patterns for profiles to filter in ingestion, allowed by the ",(0,n.yg)("inlineCode",{parentName:"td"},"object_pattern"),". ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","allow","'",": ","[","'",".","*","'","]",", ","'","deny","'",": ","[","]",", ","'","ignoreCase","'",": True","}")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profile_pattern."),(0,n.yg)("span",{className:"path-main"},"ignoreCase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ignore case sensitivity during pattern matching. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profile_pattern."),(0,n.yg)("span",{className:"path-main"},"allow"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to include in ingestion ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","'",".","*","'","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profile_pattern.allow."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profile_pattern."),(0,n.yg)("span",{className:"path-main"},"deny"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to exclude from ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profile_pattern.deny."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"profiling"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"SalesforceProfilingConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"default-line "},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","enabled","'",": False, ","'","operation","_","config","'",": ","{","'","lower","_","fre...")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profiling."),(0,n.yg)("span",{className:"path-main"},"enabled"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether profiling should be done. Supports only table-level profiling at this stage ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profiling."),(0,n.yg)("span",{className:"path-main"},"operation_config"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"OperationConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Experimental feature. To specify operation configs.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profiling.operation_config."),(0,n.yg)("span",{className:"path-main"},"lower_freq_profile_enabled"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to do profiling at lower freq or not. This does not do any scheduling just adds additional checks to when not to run profiling. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profiling.operation_config."),(0,n.yg)("span",{className:"path-main"},"profile_date_of_month"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"integer"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Number between 1 to 31 for date of month (both inclusive). If not specified, defaults to Nothing and this field does not take affect.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"profiling.operation_config."),(0,n.yg)("span",{className:"path-main"},"profile_day_of_week"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"integer"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Number between 0 to 6 for day of week (both inclusive). 0 is Monday and 6 is Sunday. If not specified, defaults to Nothing and this field does not take affect.")))))),(0,n.yg)(l.A,{value:"schema",label:"Schema",mdxType:"TabItem"},(0,n.yg)("p",null,"The ",(0,n.yg)("a",{parentName:"p",href:"https://json-schema.org/"},"JSONSchema")," for this configuration is inlined below."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "title": "SalesforceConfig",\n  "description": "Any source that is a primary producer of Dataset metadata should inherit this class",\n  "type": "object",\n  "properties": {\n    "env": {\n      "title": "Env",\n      "description": "The environment that all assets produced by this connector belong to",\n      "default": "PROD",\n      "type": "string"\n    },\n    "platform_instance": {\n      "title": "Platform Instance",\n      "description": "The instance of the platform that all assets produced by this recipe belong to. This should be unique within the platform. See https://datahubproject.io/docs/platform-instances/ for more details.",\n      "type": "string"\n    },\n    "platform": {\n      "title": "Platform",\n      "default": "salesforce",\n      "type": "string"\n    },\n    "auth": {\n      "default": "USERNAME_PASSWORD",\n      "allOf": [\n        {\n          "$ref": "#/definitions/SalesforceAuthType"\n        }\n      ]\n    },\n    "username": {\n      "title": "Username",\n      "description": "Salesforce username",\n      "type": "string"\n    },\n    "password": {\n      "title": "Password",\n      "description": "Password for Salesforce user",\n      "type": "string"\n    },\n    "consumer_key": {\n      "title": "Consumer Key",\n      "description": "Consumer key for Salesforce JSON web token access",\n      "type": "string"\n    },\n    "private_key": {\n      "title": "Private Key",\n      "description": "Private key as a string for Salesforce JSON web token access",\n      "type": "string"\n    },\n    "security_token": {\n      "title": "Security Token",\n      "description": "Security token for Salesforce username",\n      "type": "string"\n    },\n    "instance_url": {\n      "title": "Instance Url",\n      "description": "Salesforce instance url. e.g. https://MyDomainName.my.salesforce.com",\n      "type": "string"\n    },\n    "is_sandbox": {\n      "title": "Is Sandbox",\n      "description": "Connect to Sandbox instance of your Salesforce",\n      "default": false,\n      "type": "boolean"\n    },\n    "access_token": {\n      "title": "Access Token",\n      "description": "Access token for instance url",\n      "type": "string"\n    },\n    "ingest_tags": {\n      "title": "Ingest Tags",\n      "description": "Ingest Tags from source. This will override Tags entered from UI",\n      "default": false,\n      "type": "boolean"\n    },\n    "object_pattern": {\n      "title": "Object Pattern",\n      "description": "Regex patterns for Salesforce objects to filter in ingestion.",\n      "default": {\n        "allow": [\n          ".*"\n        ],\n        "deny": [],\n        "ignoreCase": true\n      },\n      "allOf": [\n        {\n          "$ref": "#/definitions/AllowDenyPattern"\n        }\n      ]\n    },\n    "domain": {\n      "title": "Domain",\n      "description": "Regex patterns for tables/schemas to describe domain_key domain key (domain_key can be any string like \\"sales\\".) There can be multiple domain keys specified.",\n      "default": {},\n      "type": "object",\n      "additionalProperties": {\n        "$ref": "#/definitions/AllowDenyPattern"\n      }\n    },\n    "api_version": {\n      "title": "Api Version",\n      "description": "If specified, overrides default version used by the Salesforce package. Example value: \'59.0\'",\n      "type": "string"\n    },\n    "profiling": {\n      "title": "Profiling",\n      "default": {\n        "enabled": false,\n        "operation_config": {\n          "lower_freq_profile_enabled": false,\n          "profile_day_of_week": null,\n          "profile_date_of_month": null\n        }\n      },\n      "allOf": [\n        {\n          "$ref": "#/definitions/SalesforceProfilingConfig"\n        }\n      ]\n    },\n    "profile_pattern": {\n      "title": "Profile Pattern",\n      "description": "Regex patterns for profiles to filter in ingestion, allowed by the `object_pattern`.",\n      "default": {\n        "allow": [\n          ".*"\n        ],\n        "deny": [],\n        "ignoreCase": true\n      },\n      "allOf": [\n        {\n          "$ref": "#/definitions/AllowDenyPattern"\n        }\n      ]\n    }\n  },\n  "additionalProperties": false,\n  "definitions": {\n    "SalesforceAuthType": {\n      "title": "SalesforceAuthType",\n      "description": "An enumeration.",\n      "enum": [\n        "USERNAME_PASSWORD",\n        "DIRECT_ACCESS_TOKEN",\n        "JSON_WEB_TOKEN"\n      ]\n    },\n    "AllowDenyPattern": {\n      "title": "AllowDenyPattern",\n      "description": "A class to store allow deny regexes",\n      "type": "object",\n      "properties": {\n        "allow": {\n          "title": "Allow",\n          "description": "List of regex patterns to include in ingestion",\n          "default": [\n            ".*"\n          ],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "deny": {\n          "title": "Deny",\n          "description": "List of regex patterns to exclude from ingestion.",\n          "default": [],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "ignoreCase": {\n          "title": "Ignorecase",\n          "description": "Whether to ignore case sensitivity during pattern matching.",\n          "default": true,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    },\n    "OperationConfig": {\n      "title": "OperationConfig",\n      "type": "object",\n      "properties": {\n        "lower_freq_profile_enabled": {\n          "title": "Lower Freq Profile Enabled",\n          "description": "Whether to do profiling at lower freq or not. This does not do any scheduling just adds additional checks to when not to run profiling.",\n          "default": false,\n          "type": "boolean"\n        },\n        "profile_day_of_week": {\n          "title": "Profile Day Of Week",\n          "description": "Number between 0 to 6 for day of week (both inclusive). 0 is Monday and 6 is Sunday. If not specified, defaults to Nothing and this field does not take affect.",\n          "type": "integer"\n        },\n        "profile_date_of_month": {\n          "title": "Profile Date Of Month",\n          "description": "Number between 1 to 31 for date of month (both inclusive). If not specified, defaults to Nothing and this field does not take affect.",\n          "type": "integer"\n        }\n      },\n      "additionalProperties": false\n    },\n    "SalesforceProfilingConfig": {\n      "title": "SalesforceProfilingConfig",\n      "type": "object",\n      "properties": {\n        "enabled": {\n          "title": "Enabled",\n          "description": "Whether profiling should be done. Supports only table-level profiling at this stage",\n          "default": false,\n          "type": "boolean"\n        },\n        "operation_config": {\n          "title": "Operation Config",\n          "description": "Experimental feature. To specify operation configs.",\n          "allOf": [\n            {\n              "$ref": "#/definitions/OperationConfig"\n            }\n          ]\n        }\n      },\n      "additionalProperties": false\n    }\n  }\n}\n')))),(0,n.yg)("h3",{id:"code-coordinates"},"Code Coordinates"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Class Name: ",(0,n.yg)("inlineCode",{parentName:"li"},"datahub.ingestion.source.salesforce.SalesforceSource")),(0,n.yg)("li",{parentName:"ul"},"Browse on ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/salesforce.py"},"GitHub"))),(0,n.yg)("h2",null,"Questions"),(0,n.yg)("p",null,"If you've got any questions on configuring ingestion for Salesforce, feel free to ping us on ",(0,n.yg)("a",{parentName:"p",href:"https://slack.datahubproject.io"},"our Slack"),"."))}u.isMDXComponent=!0}}]);