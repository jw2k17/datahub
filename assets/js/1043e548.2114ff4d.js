"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[90837],{31165:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>m,contentTitle:()=>g,default:()=>f,frontMatter:()=>p,metadata:()=>d,toc:()=>u});t(96540);var n=t(15680),s=t(53720),i=t(5400);function l(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){return a=null!=a?a:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):function(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})),e}function o(e,a){if(null==e)return{};var t,n,s=function(e,a){if(null==e)return{};var t,n,s={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||(s[t]=e[t]);return s}(e,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}const p={sidebar_position:65,title:"SQL Queries",slug:"/generated/ingestion/sources/sql-queries",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/sql-queries.md"},g="SQL Queries",d={unversionedId:"docs/generated/ingestion/sources/sql-queries",id:"docs/generated/ingestion/sources/sql-queries",title:"SQL Queries",description:"Incubating",source:"@site/genDocs/docs/generated/ingestion/sources/sql-queries.md",sourceDirName:"docs/generated/ingestion/sources",slug:"/generated/ingestion/sources/sql-queries",permalink:"/docs/generated/ingestion/sources/sql-queries",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/sql-queries.md",tags:[],version:"current",sidebarPosition:65,frontMatter:{sidebar_position:65,title:"SQL Queries",slug:"/generated/ingestion/sources/sql-queries",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/sql-queries.md"},sidebar:"overviewSidebar",previous:{title:"Snowflake",permalink:"/docs/generated/ingestion/sources/snowflake"},next:{title:"SQLAlchemy",permalink:"/docs/generated/ingestion/sources/sqlalchemy"}},m={},u=[{value:"Important Capabilities",id:"important-capabilities",level:3},{value:"Query File Format",id:"query-file-format",level:3},{value:"Example Queries File",id:"example-queries-file",level:4},{value:"CLI based Ingestion",id:"cli-based-ingestion",level:3},{value:"Starter Recipe",id:"starter-recipe",level:3},{value:"Config Details",id:"config-details",level:3},{value:"Code Coordinates",id:"code-coordinates",level:3}],y={toc:u},c="wrapper";function f(e){var{components:a}=e,t=o(e,["components"]);return(0,n.yg)(c,r(function(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),n.forEach((function(a){l(e,a,t[a])}))}return e}({},y,t),{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"sql-queries"},"SQL Queries"),(0,n.yg)("p",null,(0,n.yg)("img",{parentName:"p",src:"https://img.shields.io/badge/support%20status-incubating-blue",alt:"Incubating"})),(0,n.yg)("h3",{id:"important-capabilities"},"Important Capabilities"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Capability"),(0,n.yg)("th",{parentName:"tr",align:null},"Status"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Column-level Lineage"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Parsed from SQL queries")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Table-Level Lineage"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Parsed from SQL queries")))),(0,n.yg)("p",null,"This source reads a newline-delimited JSON file containing SQL queries and parses them to generate lineage."),(0,n.yg)("h3",{id:"query-file-format"},"Query File Format"),(0,n.yg)("p",null,"This file should contain one JSON object per line, with the following fields:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"query: string - The SQL query to parse."),(0,n.yg)("li",{parentName:"ul"},"timestamp (optional): number - The timestamp of the query, in seconds since the epoch."),(0,n.yg)("li",{parentName:"ul"},"user (optional): string - The user who ran the query.\nThis user value will be directly converted into a DataHub user urn."),(0,n.yg)("li",{parentName:"ul"},"operation_type (optional): string - Platform-specific operation type, used if the operation type can't be parsed."),(0,n.yg)("li",{parentName:"ul"},"downstream_tables (optional): string[] - Fallback list of tables that the query writes to,\nused if the query can't be parsed."),(0,n.yg)("li",{parentName:"ul"},"upstream_tables (optional): string[] - Fallback list of tables the query reads from,\nused if the query can't be parsed.")),(0,n.yg)("h4",{id:"example-queries-file"},"Example Queries File"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-json"},'{"query": "SELECT x FROM my_table", "timestamp": 1689232738.051, "user": "user_a", "downstream_tables": [], "upstream_tables": ["my_database.my_schema.my_table"]}\n{"query": "INSERT INTO my_table VALUES (1, \'a\')", "timestamp": 1689232737.669, "user": "user_b", "downstream_tables": ["my_database.my_schema.my_table"], "upstream_tables": []}\n')),(0,n.yg)("p",null,"Note that this file does not represent a single JSON object, but instead newline-delimited JSON, in which\neach line is a separate JSON object."),(0,n.yg)("h3",{id:"cli-based-ingestion"},"CLI based Ingestion"),(0,n.yg)("h3",{id:"starter-recipe"},"Starter Recipe"),(0,n.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,n.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'datahub_api:  # Only necessary if using a non-DataHub sink, e.g. the file sink\n  server: http://localhost:8080\n  timeout_sec: 60\nsource:\n  type: sql-queries\n  config:\n    platform: "snowflake"\n    default_db: "SNOWFLAKE"\n    query_file: "./queries.json"\n\n')),(0,n.yg)("h3",{id:"config-details"},"Config Details"),(0,n.yg)(s.A,{mdxType:"Tabs"},(0,n.yg)(i.A,{value:"options",label:"Options",default:!0,mdxType:"TabItem"},(0,n.yg)("p",null,"Note that a ",(0,n.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,n.yg)("div",{className:"config-table"},(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:"left"},"Field"),(0,n.yg)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform"),"\xa0",(0,n.yg)("abbr",{title:"Required"},"\u2705"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The platform for which to generate data, e.g. snowflake")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"query_file"),"\xa0",(0,n.yg)("abbr",{title:"Required"},"\u2705"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Path to file to ingest")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"default_db"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The default database to use for unqualified table names")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"default_dialect"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The SQL dialect to use when parsing queries. Overrides automatic dialect detection.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"default_schema"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The default schema to use for unqualified table names")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform_instance"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The instance of the platform that all assets produced by this recipe belong to. This should be unique within the platform. See ",(0,n.yg)("a",{parentName:"td",href:"https://datahubproject.io/docs/platform-instances/"},"https://datahubproject.io/docs/platform-instances/")," for more details.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"env"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The environment that all assets produced by this connector belong to ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"PROD")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"usage"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"BaseUsageConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The usage config to use when generating usage statistics ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","bucket","_","duration","'",": ","'","DAY","'",", ","'","end","_","time","'",": ","'","2025-02-06...")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"bucket_duration"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"Enum"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Size of the time window to aggregate usage stats. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"DAY")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"end_time"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string(date-time)"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Latest date of lineage/usage to consider. Default: Current time in UTC")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"format_sql_queries"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to format sql queries ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"include_operational_stats"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to display operational stats. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"include_read_operational_stats"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to report read operational stats. Experimental. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"include_top_n_queries"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ingest the top_n_queries. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"start_time"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string(date-time)"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Earliest date of lineage/usage to consider. Default: Last full day in UTC (or hour, depending on ",(0,n.yg)("inlineCode",{parentName:"td"},"bucket_duration"),"). You can also specify relative time with respect to end_time such as '-7 days' Or '-7d'.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"top_n_queries"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"integer"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Number of top queries to save to each table. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"10")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage."),(0,n.yg)("span",{className:"path-main"},"user_email_pattern"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"AllowDenyPattern"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"regex patterns for user emails to filter in usage. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","allow","'",": ","[","'",".","*","'","]",", ","'","deny","'",": ","[","]",", ","'","ignoreCase","'",": True","}")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage.user_email_pattern."),(0,n.yg)("span",{className:"path-main"},"ignoreCase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ignore case sensitivity during pattern matching. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage.user_email_pattern."),(0,n.yg)("span",{className:"path-main"},"allow"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to include in ingestion ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","'",".","*","'","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage.user_email_pattern.allow."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage.user_email_pattern."),(0,n.yg)("span",{className:"path-main"},"deny"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to exclude from ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"usage.user_email_pattern.deny."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})))))),(0,n.yg)(i.A,{value:"schema",label:"Schema",mdxType:"TabItem"},(0,n.yg)("p",null,"The ",(0,n.yg)("a",{parentName:"p",href:"https://json-schema.org/"},"JSONSchema")," for this configuration is inlined below."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "title": "SqlQueriesSourceConfig",\n  "description": "Any source that connects to a platform should inherit this class",\n  "type": "object",\n  "properties": {\n    "env": {\n      "title": "Env",\n      "description": "The environment that all assets produced by this connector belong to",\n      "default": "PROD",\n      "type": "string"\n    },\n    "platform_instance": {\n      "title": "Platform Instance",\n      "description": "The instance of the platform that all assets produced by this recipe belong to. This should be unique within the platform. See https://datahubproject.io/docs/platform-instances/ for more details.",\n      "type": "string"\n    },\n    "query_file": {\n      "title": "Query File",\n      "description": "Path to file to ingest",\n      "type": "string"\n    },\n    "platform": {\n      "title": "Platform",\n      "description": "The platform for which to generate data, e.g. snowflake",\n      "type": "string"\n    },\n    "usage": {\n      "title": "Usage",\n      "description": "The usage config to use when generating usage statistics",\n      "default": {\n        "bucket_duration": "DAY",\n        "end_time": "2025-02-06T22:07:16.533359+00:00",\n        "start_time": "2025-02-05T00:00:00+00:00",\n        "queries_character_limit": 24000,\n        "top_n_queries": 10,\n        "user_email_pattern": {\n          "allow": [\n            ".*"\n          ],\n          "deny": [],\n          "ignoreCase": true\n        },\n        "include_operational_stats": true,\n        "include_read_operational_stats": false,\n        "format_sql_queries": false,\n        "include_top_n_queries": true\n      },\n      "allOf": [\n        {\n          "$ref": "#/definitions/BaseUsageConfig"\n        }\n      ]\n    },\n    "default_db": {\n      "title": "Default Db",\n      "description": "The default database to use for unqualified table names",\n      "type": "string"\n    },\n    "default_schema": {\n      "title": "Default Schema",\n      "description": "The default schema to use for unqualified table names",\n      "type": "string"\n    },\n    "default_dialect": {\n      "title": "Default Dialect",\n      "description": "The SQL dialect to use when parsing queries. Overrides automatic dialect detection.",\n      "type": "string"\n    }\n  },\n  "required": [\n    "query_file",\n    "platform"\n  ],\n  "additionalProperties": false,\n  "definitions": {\n    "BucketDuration": {\n      "title": "BucketDuration",\n      "description": "An enumeration.",\n      "enum": [\n        "DAY",\n        "HOUR"\n      ],\n      "type": "string"\n    },\n    "AllowDenyPattern": {\n      "title": "AllowDenyPattern",\n      "description": "A class to store allow deny regexes",\n      "type": "object",\n      "properties": {\n        "allow": {\n          "title": "Allow",\n          "description": "List of regex patterns to include in ingestion",\n          "default": [\n            ".*"\n          ],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "deny": {\n          "title": "Deny",\n          "description": "List of regex patterns to exclude from ingestion.",\n          "default": [],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "ignoreCase": {\n          "title": "Ignorecase",\n          "description": "Whether to ignore case sensitivity during pattern matching.",\n          "default": true,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    },\n    "BaseUsageConfig": {\n      "title": "BaseUsageConfig",\n      "type": "object",\n      "properties": {\n        "bucket_duration": {\n          "description": "Size of the time window to aggregate usage stats.",\n          "default": "DAY",\n          "allOf": [\n            {\n              "$ref": "#/definitions/BucketDuration"\n            }\n          ]\n        },\n        "end_time": {\n          "title": "End Time",\n          "description": "Latest date of lineage/usage to consider. Default: Current time in UTC",\n          "type": "string",\n          "format": "date-time"\n        },\n        "start_time": {\n          "title": "Start Time",\n          "description": "Earliest date of lineage/usage to consider. Default: Last full day in UTC (or hour, depending on `bucket_duration`). You can also specify relative time with respect to end_time such as \'-7 days\' Or \'-7d\'.",\n          "type": "string",\n          "format": "date-time"\n        },\n        "top_n_queries": {\n          "title": "Top N Queries",\n          "description": "Number of top queries to save to each table.",\n          "default": 10,\n          "exclusiveMinimum": 0,\n          "type": "integer"\n        },\n        "user_email_pattern": {\n          "title": "User Email Pattern",\n          "description": "regex patterns for user emails to filter in usage.",\n          "default": {\n            "allow": [\n              ".*"\n            ],\n            "deny": [],\n            "ignoreCase": true\n          },\n          "allOf": [\n            {\n              "$ref": "#/definitions/AllowDenyPattern"\n            }\n          ]\n        },\n        "include_operational_stats": {\n          "title": "Include Operational Stats",\n          "description": "Whether to display operational stats.",\n          "default": true,\n          "type": "boolean"\n        },\n        "include_read_operational_stats": {\n          "title": "Include Read Operational Stats",\n          "description": "Whether to report read operational stats. Experimental.",\n          "default": false,\n          "type": "boolean"\n        },\n        "format_sql_queries": {\n          "title": "Format Sql Queries",\n          "description": "Whether to format sql queries",\n          "default": false,\n          "type": "boolean"\n        },\n        "include_top_n_queries": {\n          "title": "Include Top N Queries",\n          "description": "Whether to ingest the top_n_queries.",\n          "default": true,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    }\n  }\n}\n')))),(0,n.yg)("h3",{id:"code-coordinates"},"Code Coordinates"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Class Name: ",(0,n.yg)("inlineCode",{parentName:"li"},"datahub.ingestion.source.sql_queries.SqlQueriesSource")),(0,n.yg)("li",{parentName:"ul"},"Browse on ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/sql_queries.py"},"GitHub"))),(0,n.yg)("h2",null,"Questions"),(0,n.yg)("p",null,"If you've got any questions on configuring ingestion for SQL Queries, feel free to ping us on ",(0,n.yg)("a",{parentName:"p",href:"https://slack.datahubproject.io"},"our Slack"),"."))}f.isMDXComponent=!0}}]);