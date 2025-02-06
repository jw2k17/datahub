"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[74297],{13218:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>c,contentTitle:()=>g,default:()=>f,frontMatter:()=>p,metadata:()=>d,toc:()=>m});t(96540);var n=t(15680),s=t(53720),l=t(5400);function i(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){return a=null!=a?a:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):function(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})),e}function o(e,a){if(null==e)return{};var t,n,s=function(e,a){if(null==e)return{};var t,n,s={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(s[t]=e[t]);return s}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}const p={sidebar_position:13,title:"Delta Lake",slug:"/generated/ingestion/sources/delta-lake",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/delta-lake.md"},g="Delta Lake",d={unversionedId:"docs/generated/ingestion/sources/delta-lake",id:"version-0.14.1/docs/generated/ingestion/sources/delta-lake",title:"Delta Lake",description:"Incubating",source:"@site/versioned_docs/version-0.14.1/docs/generated/ingestion/sources/delta-lake.md",sourceDirName:"docs/generated/ingestion/sources",slug:"/generated/ingestion/sources/delta-lake",permalink:"/docs/0.14.1/generated/ingestion/sources/delta-lake",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/delta-lake.md",tags:[],version:"0.14.1",sidebarPosition:13,frontMatter:{sidebar_position:13,title:"Delta Lake",slug:"/generated/ingestion/sources/delta-lake",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/delta-lake.md"},sidebar:"overviewSidebar",previous:{title:"dbt",permalink:"/docs/0.14.1/generated/ingestion/sources/dbt"},next:{title:"Demo Data",permalink:"/docs/0.14.1/generated/ingestion/sources/demo-data"}},c={},m=[{value:"Important Capabilities",id:"important-capabilities",level:3},{value:"CLI based Ingestion",id:"cli-based-ingestion",level:3},{value:"Install the Plugin",id:"install-the-plugin",level:4},{value:"Starter Recipe",id:"starter-recipe",level:3},{value:"Config Details",id:"config-details",level:3},{value:"Usage Guide",id:"usage-guide",level:2},{value:"Delta Table on Local File System",id:"delta-table-on-local-file-system",level:3},{value:"Step 1",id:"step-1",level:4},{value:"Step 2",id:"step-2",level:4},{value:"Step 3",id:"step-3",level:4},{value:"Delta Table on S3",id:"delta-table-on-s3",level:3},{value:"Step 1",id:"step-1-1",level:4},{value:"Step 3",id:"step-3-1",level:4},{value:"Step 4",id:"step-4",level:4},{value:"Note",id:"note",level:3},{value:"Code Coordinates",id:"code-coordinates",level:3}],y={toc:m},u="wrapper";function f(e){var{components:a}=e,t=o(e,["components"]);return(0,n.yg)(u,r(function(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),n.forEach((function(a){i(e,a,t[a])}))}return e}({},y,t),{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"delta-lake"},"Delta Lake"),(0,n.yg)("p",null,(0,n.yg)("img",{parentName:"p",src:"https://img.shields.io/badge/support%20status-incubating-blue",alt:"Incubating"})),(0,n.yg)("h3",{id:"important-capabilities"},"Important Capabilities"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Capability"),(0,n.yg)("th",{parentName:"tr",align:null},"Status"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Extract Tags"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Can extract S3 object/bucket tags if enabled")))),(0,n.yg)("p",null,"This plugin extracts:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Column types and schema associated with each delta table"),(0,n.yg)("li",{parentName:"ul"},"Custom properties: number_of_files, partition_columns, table_creation_time, location, version etc.")),(0,n.yg)("admonition",{type:"caution"},(0,n.yg)("p",{parentName:"admonition"},"If you are ingesting datasets from AWS S3, we recommend running the ingestion on a server in the same region to avoid high egress costs.")),(0,n.yg)("h3",{id:"cli-based-ingestion"},"CLI based Ingestion"),(0,n.yg)("h4",{id:"install-the-plugin"},"Install the Plugin"),(0,n.yg)("p",null,"The ",(0,n.yg)("inlineCode",{parentName:"p"},"delta-lake")," source works out of the box with ",(0,n.yg)("inlineCode",{parentName:"p"},"acryl-datahub"),"."),(0,n.yg)("h3",{id:"starter-recipe"},"Starter Recipe"),(0,n.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,n.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.14.1/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'source:\n  type: delta-lake\n  config:\n    env: "PROD"\n    platform_instance: "my-delta-lake"\n    base_path: "/path/to/data/folder"\n\nsink:\n  # sink configs\n')),(0,n.yg)("h3",{id:"config-details"},"Config Details"),(0,n.yg)(s.A,{mdxType:"Tabs"},(0,n.yg)(l.A,{value:"options",label:"Options",default:!0,mdxType:"TabItem"},(0,n.yg)("p",null,"Note that a ",(0,n.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,n.yg)("div",{className:"config-table"},(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:"left"},"Field"),(0,n.yg)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"base_path"),"\xa0",(0,n.yg)("abbr",{title:"Required"},"\u2705"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Path to table (s3 or local file system). If path is not a delta table path then all subfolders will be scanned to detect and ingest delta tables.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"Enum"))),(0,n.yg)("td",{parentName:"tr",align:"left"},'One of: "delta-lake" ',(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"delta-lake")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform_instance"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The instance of the platform that all assets produced by this recipe belong to")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"relative_path"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"If set, delta-tables will be searched at location '<base_path>/<relative_path>' and URNs will be created using relative_path only.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"require_files"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether DeltaTable should track files. Consider setting this to ",(0,n.yg)("inlineCode",{parentName:"td"},"False")," for large delta tables, resulting in significant memory reduction for ingestion process.When set to ",(0,n.yg)("inlineCode",{parentName:"td"},"False"),", number_of_files in delta table can not be reported. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"version_history_lookback"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"integer"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Number of previous version histories to be ingested. Defaults to 1. If set to -1 all version history will be ingested. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"1")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"env"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The environment that all assets produced by this connector belong to ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"PROD")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"s3"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"S3"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3."),(0,n.yg)("span",{className:"path-main"},"use_s3_bucket_tags"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether or not to create tags in datahub from the s3 bucket ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3."),(0,n.yg)("span",{className:"path-main"},"use_s3_object_tags"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"# Whether or not to create tags in datahub from the s3 object ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3."),(0,n.yg)("span",{className:"path-main"},"aws_config"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"AwsConnectionConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"AWS configuration")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_access_key_id"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"AWS access key ID. Can be auto-detected, see ",(0,n.yg)("a",{parentName:"td",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html"},"the AWS boto3 docs")," for details.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_advanced_config"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"object"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Advanced AWS configuration options. These are passed directly to ",(0,n.yg)("a",{parentName:"td",href:"https://botocore.amazonaws.com/v1/documentation/api/latest/reference/config.html"},"botocore.config.Config"),".")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_endpoint_url"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The AWS service endpoint. This is normally ",(0,n.yg)("a",{parentName:"td",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html"},"constructed automatically"),", but can be overridden here.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_profile"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Named AWS profile to use. Only used if access key / secret are unset. If not set the default will be used")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_proxy"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"map(str,string)"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_region"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"AWS region code.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_secret_access_key"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"AWS secret access key. Can be auto-detected, see ",(0,n.yg)("a",{parentName:"td",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html"},"the AWS boto3 docs")," for details.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_session_token"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"AWS session token. Can be auto-detected, see ",(0,n.yg)("a",{parentName:"td",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html"},"the AWS boto3 docs")," for details.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"read_timeout"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"number"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The timeout for reading from the connection (in seconds). ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"60")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config."),(0,n.yg)("span",{className:"path-main"},"aws_role"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"One of string, array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"AWS roles to assume. If using the string format, the role ARN can be specified directly. If using the object format, the role can be specified in the RoleArn field and additional available arguments are the same as ",(0,n.yg)("a",{parentName:"td",href:"https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sts.html?highlight=assume_role#STS.Client.assume_role"},"boto3's STS.Client.assume_role"),".")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config.aws_role."),(0,n.yg)("span",{className:"path-main"},"union"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"One of string, AwsAssumeRoleConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config.aws_role.union."),(0,n.yg)("span",{className:"path-main"},"RoleArn"),"\xa0",(0,n.yg)("abbr",{title:"Required if union is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"ARN of the role to assume.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"s3.aws_config.aws_role.union."),(0,n.yg)("span",{className:"path-main"},"ExternalId"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"External ID to use when assuming the role.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"table_pattern"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"AllowDenyPattern"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"regex patterns for tables to filter in ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","allow","'",": ","[","'",".","*","'","]",", ","'","deny","'",": ","[","]",", ","'","ignoreCase","'",": True","}")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"table_pattern."),(0,n.yg)("span",{className:"path-main"},"ignoreCase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ignore case sensitivity during pattern matching. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"table_pattern."),(0,n.yg)("span",{className:"path-main"},"allow"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to include in ingestion ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","'",".","*","'","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"table_pattern.allow."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"table_pattern."),(0,n.yg)("span",{className:"path-main"},"deny"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to exclude from ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"table_pattern.deny."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})))))),(0,n.yg)(l.A,{value:"schema",label:"Schema",mdxType:"TabItem"},(0,n.yg)("p",null,"The ",(0,n.yg)("a",{parentName:"p",href:"https://json-schema.org/"},"JSONSchema")," for this configuration is inlined below."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "title": "DeltaLakeSourceConfig",\n  "description": "Any source that connects to a platform should inherit this class",\n  "type": "object",\n  "properties": {\n    "env": {\n      "title": "Env",\n      "description": "The environment that all assets produced by this connector belong to",\n      "default": "PROD",\n      "type": "string"\n    },\n    "platform_instance": {\n      "title": "Platform Instance",\n      "description": "The instance of the platform that all assets produced by this recipe belong to",\n      "type": "string"\n    },\n    "base_path": {\n      "title": "Base Path",\n      "description": "Path to table (s3 or local file system). If path is not a delta table path then all subfolders will be scanned to detect and ingest delta tables.",\n      "type": "string"\n    },\n    "relative_path": {\n      "title": "Relative Path",\n      "description": "If set, delta-tables will be searched at location \'<base_path>/<relative_path>\' and URNs will be created using relative_path only.",\n      "type": "string"\n    },\n    "platform": {\n      "title": "Platform",\n      "description": "The platform that this source connects to",\n      "default": "delta-lake",\n      "enum": [\n        "delta-lake"\n      ],\n      "type": "string"\n    },\n    "table_pattern": {\n      "title": "Table Pattern",\n      "description": "regex patterns for tables to filter in ingestion.",\n      "default": {\n        "allow": [\n          ".*"\n        ],\n        "deny": [],\n        "ignoreCase": true\n      },\n      "allOf": [\n        {\n          "$ref": "#/definitions/AllowDenyPattern"\n        }\n      ]\n    },\n    "version_history_lookback": {\n      "title": "Version History Lookback",\n      "description": "Number of previous version histories to be ingested. Defaults to 1. If set to -1 all version history will be ingested.",\n      "default": 1,\n      "type": "integer"\n    },\n    "require_files": {\n      "title": "Require Files",\n      "description": "Whether DeltaTable should track files. Consider setting this to `False` for large delta tables, resulting in significant memory reduction for ingestion process.When set to `False`, number_of_files in delta table can not be reported.",\n      "default": true,\n      "type": "boolean"\n    },\n    "s3": {\n      "$ref": "#/definitions/S3"\n    }\n  },\n  "required": [\n    "base_path"\n  ],\n  "additionalProperties": false,\n  "definitions": {\n    "AllowDenyPattern": {\n      "title": "AllowDenyPattern",\n      "description": "A class to store allow deny regexes",\n      "type": "object",\n      "properties": {\n        "allow": {\n          "title": "Allow",\n          "description": "List of regex patterns to include in ingestion",\n          "default": [\n            ".*"\n          ],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "deny": {\n          "title": "Deny",\n          "description": "List of regex patterns to exclude from ingestion.",\n          "default": [],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "ignoreCase": {\n          "title": "Ignorecase",\n          "description": "Whether to ignore case sensitivity during pattern matching.",\n          "default": true,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    },\n    "AwsAssumeRoleConfig": {\n      "title": "AwsAssumeRoleConfig",\n      "type": "object",\n      "properties": {\n        "RoleArn": {\n          "title": "Rolearn",\n          "description": "ARN of the role to assume.",\n          "type": "string"\n        },\n        "ExternalId": {\n          "title": "Externalid",\n          "description": "External ID to use when assuming the role.",\n          "type": "string"\n        }\n      },\n      "required": [\n        "RoleArn"\n      ]\n    },\n    "AwsConnectionConfig": {\n      "title": "AwsConnectionConfig",\n      "description": "Common AWS credentials config.\\n\\nCurrently used by:\\n    - Glue source\\n    - SageMaker source\\n    - dbt source",\n      "type": "object",\n      "properties": {\n        "aws_access_key_id": {\n          "title": "Aws Access Key Id",\n          "description": "AWS access key ID. Can be auto-detected, see [the AWS boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) for details.",\n          "type": "string"\n        },\n        "aws_secret_access_key": {\n          "title": "Aws Secret Access Key",\n          "description": "AWS secret access key. Can be auto-detected, see [the AWS boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) for details.",\n          "type": "string"\n        },\n        "aws_session_token": {\n          "title": "Aws Session Token",\n          "description": "AWS session token. Can be auto-detected, see [the AWS boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) for details.",\n          "type": "string"\n        },\n        "aws_role": {\n          "title": "Aws Role",\n          "description": "AWS roles to assume. If using the string format, the role ARN can be specified directly. If using the object format, the role can be specified in the RoleArn field and additional available arguments are the same as [boto3\'s STS.Client.assume_role](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sts.html?highlight=assume_role#STS.Client.assume_role).",\n          "anyOf": [\n            {\n              "type": "string"\n            },\n            {\n              "type": "array",\n              "items": {\n                "anyOf": [\n                  {\n                    "type": "string"\n                  },\n                  {\n                    "$ref": "#/definitions/AwsAssumeRoleConfig"\n                  }\n                ]\n              }\n            }\n          ]\n        },\n        "aws_profile": {\n          "title": "Aws Profile",\n          "description": "Named AWS profile to use. Only used if access key / secret are unset. If not set the default will be used",\n          "type": "string"\n        },\n        "aws_region": {\n          "title": "Aws Region",\n          "description": "AWS region code.",\n          "type": "string"\n        },\n        "aws_endpoint_url": {\n          "title": "Aws Endpoint Url",\n          "description": "The AWS service endpoint. This is normally [constructed automatically](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html), but can be overridden here.",\n          "type": "string"\n        },\n        "aws_proxy": {\n          "title": "Aws Proxy",\n          "description": "A set of proxy configs to use with AWS. See the [botocore.config](https://botocore.amazonaws.com/v1/documentation/api/latest/reference/config.html) docs for details.",\n          "type": "object",\n          "additionalProperties": {\n            "type": "string"\n          }\n        },\n        "read_timeout": {\n          "title": "Read Timeout",\n          "description": "The timeout for reading from the connection (in seconds).",\n          "default": 60,\n          "type": "number"\n        },\n        "aws_advanced_config": {\n          "title": "Aws Advanced Config",\n          "description": "Advanced AWS configuration options. These are passed directly to [botocore.config.Config](https://botocore.amazonaws.com/v1/documentation/api/latest/reference/config.html).",\n          "type": "object"\n        }\n      },\n      "additionalProperties": false\n    },\n    "S3": {\n      "title": "S3",\n      "type": "object",\n      "properties": {\n        "aws_config": {\n          "title": "Aws Config",\n          "description": "AWS configuration",\n          "allOf": [\n            {\n              "$ref": "#/definitions/AwsConnectionConfig"\n            }\n          ]\n        },\n        "use_s3_bucket_tags": {\n          "title": "Use S3 Bucket Tags",\n          "description": "Whether or not to create tags in datahub from the s3 bucket",\n          "default": false,\n          "type": "boolean"\n        },\n        "use_s3_object_tags": {\n          "title": "Use S3 Object Tags",\n          "description": "# Whether or not to create tags in datahub from the s3 object",\n          "default": false,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    }\n  }\n}\n')))),(0,n.yg)("h2",{id:"usage-guide"},"Usage Guide"),(0,n.yg)("p",null,"If you are new to ",(0,n.yg)("a",{parentName:"p",href:"https://delta.io/"},"Delta Lake")," and want to test out a simple integration with Delta Lake and DataHub, you can follow this guide. "),(0,n.yg)("h3",{id:"delta-table-on-local-file-system"},"Delta Table on Local File System"),(0,n.yg)("h4",{id:"step-1"},"Step 1"),(0,n.yg)("p",null,"Create a delta table using the sample PySpark code below if you don't have a delta table you can point to."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'import uuid\nimport random\nfrom pyspark.sql import SparkSession\nfrom delta.tables import DeltaTable\n\ndef generate_data():\n    return [(y, m, d, str(uuid.uuid4()), str(random.randrange(10000) % 26 + 65) * 3, random.random()*10000)\n    for d in range(1, 29)\n    for m in range(1, 13)\n    for y in range(2000, 2021)]\n\njar_packages = ["org.apache.hadoop:hadoop-aws:3.2.3", "io.delta:delta-core_2.12:1.2.1"]\nspark = SparkSession.builder \\\n    .appName("quickstart") \\\n    .master("local[*]") \\\n    .config("spark.jars.packages", ",".join(jar_packages)) \\\n    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\\n    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\\n    .getOrCreate()\n\ntable_path = "quickstart/my-table"\ncolumns = ["year", "month", "day", "sale_id", "customer", "total_cost"]\nspark.sparkContext.parallelize(generate_data()).toDF(columns).repartition(1).write.format("delta").save(table_path)\n\ndf = spark.read.format("delta").load(table_path)\ndf.show()\n\n')),(0,n.yg)("h4",{id:"step-2"},"Step 2"),(0,n.yg)("p",null,"Create a datahub ingestion yaml file (delta.dhub.yaml) to ingest metadata from the delta table you just created."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'source:\n  type: "delta-lake"\n  config:\n    base_path:  "quickstart/my-table"\n    \nsink:\n  type: "datahub-rest"\n  config:\n    server: "http://localhost:8080"\n')),(0,n.yg)("p",null,"Note: Make sure you run the Spark code as well as recipe from same folder otherwise use absolute paths."),(0,n.yg)("h4",{id:"step-3"},"Step 3"),(0,n.yg)("p",null,"Execute the ingestion recipe:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-shell"},"datahub ingest -c delta.dhub.yaml\n")),(0,n.yg)("h3",{id:"delta-table-on-s3"},"Delta Table on S3"),(0,n.yg)("h4",{id:"step-1-1"},"Step 1"),(0,n.yg)("p",null,"Set up your AWS credentials by creating an AWS credentials config file; typically in '$HOME/.aws/credentials'."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre"},"[my-creds]\naws_access_key_id: ######\naws_secret_access_key: ######\n")),(0,n.yg)("p",null,"Step 2: Create a Delta Table using the PySpark sample code below unless you already have Delta Tables on your S3. "),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'from pyspark.sql import SparkSession\nfrom delta.tables import DeltaTable\nfrom configparser import ConfigParser\nimport uuid\nimport random\ndef generate_data():\n    return [(y, m, d, str(uuid.uuid4()), str(random.randrange(10000) % 26 + 65) * 3, random.random()*10000)\n    for d in range(1, 29)\n    for m in range(1, 13)\n    for y in range(2000, 2021)]\n\njar_packages = ["org.apache.hadoop:hadoop-aws:3.2.3", "io.delta:delta-core_2.12:1.2.1"]\nspark = SparkSession.builder \\\n    .appName("quickstart") \\\n    .master("local[*]") \\\n    .config("spark.jars.packages", ",".join(jar_packages)) \\\n    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\\n    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\\n    .getOrCreate()\n\n\nconfig_object = ConfigParser()\nconfig_object.read("$HOME/.aws/credentials")\nprofile_info = config_object["my-creds"]\naccess_id = profile_info["aws_access_key_id"]\naccess_key = profile_info["aws_secret_access_key"]\n\nhadoop_conf = spark._jsc.hadoopConfiguration()\nhadoop_conf.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")\nhadoop_conf.set("fs.s3a.aws.credentials.provider", "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider")\nhadoop_conf.set("fs.s3a.access.key", access_id)\nhadoop_conf.set("fs.s3a.secret.key", access_key)\n\ntable_path = "s3a://my-bucket/my-folder/sales-table"\ncolumns = ["year", "month", "day", "sale_id", "customer", "total_cost"]\nspark.sparkContext.parallelize(generate_data()).toDF(columns).repartition(1).write.format("delta").save(table_path)\ndf = spark.read.format("delta").load(table_path)\ndf.show()\n\n')),(0,n.yg)("h4",{id:"step-3-1"},"Step 3"),(0,n.yg)("p",null,"Create a datahub ingestion yaml file (delta.s3.dhub.yaml) to ingest metadata from the delta table you just created."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},'source:\n  type: "delta-lake"\n  config:\n    base_path:  "s3://my-bucket/my-folder/sales-table"\n    s3:\n      aws_config:\n        aws_access_key_id: <<Access key>>\n        aws_secret_access_key: <<secret key>>\n    \nsink:\n  type: "datahub-rest"\n  config:\n    server: "http://localhost:8080"\n')),(0,n.yg)("h4",{id:"step-4"},"Step 4"),(0,n.yg)("p",null,"Execute the ingestion recipe:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-shell"},"datahub ingest -c delta.s3.dhub.yaml\n")),(0,n.yg)("h3",{id:"note"},"Note"),(0,n.yg)("p",null,"The above recipes are minimal recipes. Please refer to ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"Config Details")," section for the full configuration."),(0,n.yg)("h3",{id:"code-coordinates"},"Code Coordinates"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Class Name: ",(0,n.yg)("inlineCode",{parentName:"li"},"datahub.ingestion.source.delta_lake.source.DeltaLakeSource")),(0,n.yg)("li",{parentName:"ul"},"Browse on ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/delta_lake/source.py"},"GitHub"))),(0,n.yg)("h2",null,"Questions"),(0,n.yg)("p",null,"If you've got any questions on configuring ingestion for Delta Lake, feel free to ping us on ",(0,n.yg)("a",{parentName:"p",href:"https://slack.datahubproject.io"},"our Slack"),"."))}f.isMDXComponent=!0}}]);