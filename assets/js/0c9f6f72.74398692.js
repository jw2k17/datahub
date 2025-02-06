"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[9494],{87225:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>m,contentTitle:()=>p,default:()=>u,frontMatter:()=>c,metadata:()=>g,toc:()=>d});t(96540);var n=t(15680),i=t(53720),r=t(5400);function s(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function o(e,a){return a=null!=a?a:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):function(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})),e}function l(e,a){if(null==e)return{};var t,n,i=function(e,a){if(null==e)return{};var t,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||(i[t]=e[t]);return i}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}const c={sidebar_position:32,title:"Kafka Connect",slug:"/generated/ingestion/sources/kafka-connect",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/kafka-connect.md"},p="Kafka Connect",g={unversionedId:"docs/generated/ingestion/sources/kafka-connect",id:"docs/generated/ingestion/sources/kafka-connect",title:"Kafka Connect",description:"Integration Details",source:"@site/genDocs/docs/generated/ingestion/sources/kafka-connect.md",sourceDirName:"docs/generated/ingestion/sources",slug:"/generated/ingestion/sources/kafka-connect",permalink:"/docs/generated/ingestion/sources/kafka-connect",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/kafka-connect.md",tags:[],version:"current",sidebarPosition:32,frontMatter:{sidebar_position:32,title:"Kafka Connect",slug:"/generated/ingestion/sources/kafka-connect",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/kafka-connect.md"},sidebar:"overviewSidebar",previous:{title:"Kafka",permalink:"/docs/generated/ingestion/sources/kafka"},next:{title:"LDAP",permalink:"/docs/generated/ingestion/sources/ldap"}},m={},d=[{value:"Integration Details",id:"integration-details",level:2},{value:"Concept Mapping",id:"concept-mapping",level:3},{value:"Current limitations",id:"current-limitations",level:2},{value:"Important Capabilities",id:"important-capabilities",level:3},{value:"CLI based Ingestion",id:"cli-based-ingestion",level:3},{value:"Starter Recipe",id:"starter-recipe",level:3},{value:"Config Details",id:"config-details",level:3},{value:"Advanced Configurations",id:"advanced-configurations",level:2},{value:"Working with Platform Instances",id:"working-with-platform-instances",level:3},{value:"Example - Multiple MySQL Source Connectors each reading from different mysql instance",id:"example---multiple-mysql-source-connectors-each-reading-from-different-mysql-instance",level:4},{value:"Example - Multiple MySQL Source Connectors each reading from difference mysql instance and writing to different kafka cluster",id:"example---multiple-mysql-source-connectors-each-reading-from-difference-mysql-instance-and-writing-to-different-kafka-cluster",level:4},{value:"Example - Multiple BigQuery Sink Connectors each writing to different kafka cluster",id:"example---multiple-bigquery-sink-connectors-each-writing-to-different-kafka-cluster",level:4},{value:"Provided Configurations from External Sources",id:"provided-configurations-from-external-sources",level:3},{value:"Code Coordinates",id:"code-coordinates",level:3}],y={toc:d},f="wrapper";function u(e){var{components:a}=e,t=l(e,["components"]);return(0,n.yg)(f,o(function(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),n.forEach((function(a){s(e,a,t[a])}))}return e}({},y,t),{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"kafka-connect"},"Kafka Connect"),(0,n.yg)("h2",{id:"integration-details"},"Integration Details"),(0,n.yg)("p",null,"This plugin extracts the following:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Source and Sink Connectors in Kafka Connect as Data Pipelines"),(0,n.yg)("li",{parentName:"ul"},"For Source connectors - Data Jobs to represent lineage information between source dataset to Kafka topic per ",(0,n.yg)("inlineCode",{parentName:"li"},"{connector_name}:{source_dataset}")," combination"),(0,n.yg)("li",{parentName:"ul"},"For Sink connectors - Data Jobs to represent lineage information between Kafka topic to destination dataset per ",(0,n.yg)("inlineCode",{parentName:"li"},"{connector_name}:{topic}")," combination")),(0,n.yg)("h3",{id:"concept-mapping"},"Concept Mapping"),(0,n.yg)("p",null,"This ingestion source maps the following Source System Concepts to DataHub Concepts:"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Source Concept"),(0,n.yg)("th",{parentName:"tr",align:null},"DataHub Concept"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("inlineCode",{parentName:"td"},'"kafka-connect"')),(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/generated/metamodel/entities/dataplatform/"},"Data Platform")),(0,n.yg)("td",{parentName:"tr",align:null})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"https://kafka.apache.org/documentation/#connect_connectorsandtasks"},"Connector")),(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/generated/metamodel/entities/dataflow/"},"DataFlow")),(0,n.yg)("td",{parentName:"tr",align:null})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Kafka Topic"),(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/generated/metamodel/entities/dataset/"},"Dataset")),(0,n.yg)("td",{parentName:"tr",align:null})))),(0,n.yg)("h2",{id:"current-limitations"},"Current limitations"),(0,n.yg)("p",null,"Works only for"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Source connectors: JDBC, Debezium, Mongo and Generic connectors with user-defined lineage graph"),(0,n.yg)("li",{parentName:"ul"},"Sink connectors: BigQuery, Confluent, S3, Snowflake\n",(0,n.yg)("img",{parentName:"li",src:"https://img.shields.io/badge/support%20status-certified-brightgreen",alt:"Certified"}))),(0,n.yg)("h3",{id:"important-capabilities"},"Important Capabilities"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Capability"),(0,n.yg)("th",{parentName:"tr",align:null},"Status"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/metadata-ingestion/docs/dev_guides/stateful#stale-entity-removal"},"Detect Deleted Entities")),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Optionally enabled via ",(0,n.yg)("inlineCode",{parentName:"td"},"stateful_ingestion.remove_stale_metadata"))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/platform-instances"},"Platform Instance")),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Enabled by default")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Schema Metadata"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Enabled by default")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Table-Level Lineage"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Enabled by default")))),(0,n.yg)("h3",{id:"cli-based-ingestion"},"CLI based Ingestion"),(0,n.yg)("h3",{id:"starter-recipe"},"Starter Recipe"),(0,n.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,n.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'source:\n  type: "kafka-connect"\n  config:\n    # Coordinates\n    connect_uri: "http://localhost:8083"\n\n    # Credentials\n    username: admin\n    password: password\n\n    # Optional\n    # Platform instance mapping to use when constructing URNs.\n    # Use if single instance of platform is referred across connectors.\n    platform_instance_map:\n      mysql: mysql_platform_instance\n\nsink:\n  # sink configs\n\n')),(0,n.yg)("h3",{id:"config-details"},"Config Details"),(0,n.yg)(i.A,{mdxType:"Tabs"},(0,n.yg)(r.A,{value:"options",label:"Options",default:!0,mdxType:"TabItem"},(0,n.yg)("p",null,"Note that a ",(0,n.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,n.yg)("div",{className:"config-table"},(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:"left"},"Field"),(0,n.yg)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"cluster_name"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Cluster to ingest from. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"connect-cluster")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"connect_to_platform_map"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"map(str,map)"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"connect_uri"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"URI to connect to. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"http://localhost:8083/")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"convert_lineage_urns_to_lowercase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to convert the urns of ingested lineage dataset to lowercase ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"password"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Kafka Connect password.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform_instance"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The instance of the platform that all assets produced by this recipe belong to. This should be unique within the platform. See ",(0,n.yg)("a",{parentName:"td",href:"https://datahubproject.io/docs/platform-instances/"},"https://datahubproject.io/docs/platform-instances/")," for more details.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"platform_instance_map"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"map(str,string)"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"username"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Kafka Connect username.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"env"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"The environment that all assets produced by this connector belong to ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"PROD")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"connector_patterns"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"AllowDenyPattern"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"regex patterns for connectors to filter for ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"{","'","allow","'",": ","[","'",".","*","'","]",", ","'","deny","'",": ","[","]",", ","'","ignoreCase","'",": True","}")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"connector_patterns."),(0,n.yg)("span",{className:"path-main"},"ignoreCase"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether to ignore case sensitivity during pattern matching. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"connector_patterns."),(0,n.yg)("span",{className:"path-main"},"allow"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to include in ingestion ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","'",".","*","'","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"connector_patterns.allow."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"connector_patterns."),(0,n.yg)("span",{className:"path-main"},"deny"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"List of regex patterns to exclude from ingestion. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"connector_patterns.deny."),(0,n.yg)("span",{className:"path-main"},"string"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"generic_connectors"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Provide lineage graph for sources connectors other than Confluent JDBC Source Connector, Debezium Source Connector, and Mongo Source Connector ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"[","]")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"generic_connectors."),(0,n.yg)("span",{className:"path-main"},"GenericConnectorConfig"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"GenericConnectorConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"generic_connectors.GenericConnectorConfig."),(0,n.yg)("span",{className:"path-main"},"connector_name"),"\xa0",(0,n.yg)("abbr",{title:"Required if GenericConnectorConfig is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"generic_connectors.GenericConnectorConfig."),(0,n.yg)("span",{className:"path-main"},"source_dataset"),"\xa0",(0,n.yg)("abbr",{title:"Required if GenericConnectorConfig is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"generic_connectors.GenericConnectorConfig."),(0,n.yg)("span",{className:"path-main"},"source_platform"),"\xa0",(0,n.yg)("abbr",{title:"Required if GenericConnectorConfig is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"provided_configs"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"array"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Provided Configurations")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"provided_configs."),(0,n.yg)("span",{className:"path-main"},"ProvidedConfig"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"ProvidedConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"provided_configs.ProvidedConfig."),(0,n.yg)("span",{className:"path-main"},"path_key"),"\xa0",(0,n.yg)("abbr",{title:"Required if ProvidedConfig is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"provided_configs.ProvidedConfig."),(0,n.yg)("span",{className:"path-main"},"provider"),"\xa0",(0,n.yg)("abbr",{title:"Required if ProvidedConfig is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"provided_configs.ProvidedConfig."),(0,n.yg)("span",{className:"path-main"},"value"),"\xa0",(0,n.yg)("abbr",{title:"Required if ProvidedConfig is set"},"\u2753"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"})),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"stateful_ingestion"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"StatefulStaleMetadataRemovalConfig"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Base specialized config for Stateful Ingestion with stale metadata removal capability.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"stateful_ingestion."),(0,n.yg)("span",{className:"path-main"},"enabled"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether or not to enable stateful ingest. Default: True if a pipeline_name is set and either a datahub-rest sink or ",(0,n.yg)("inlineCode",{parentName:"td"},"datahub_api")," is specified, otherwise False ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"False")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-prefix"},"stateful_ingestion."),(0,n.yg)("span",{className:"path-main"},"remove_stale_metadata"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Soft-deletes the entities present in the last successful run but missing in the current run with stateful_ingestion enabled. ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))))))),(0,n.yg)(r.A,{value:"schema",label:"Schema",mdxType:"TabItem"},(0,n.yg)("p",null,"The ",(0,n.yg)("a",{parentName:"p",href:"https://json-schema.org/"},"JSONSchema")," for this configuration is inlined below."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "title": "KafkaConnectSourceConfig",\n  "description": "Any source that connects to a platform should inherit this class",\n  "type": "object",\n  "properties": {\n    "stateful_ingestion": {\n      "$ref": "#/definitions/StatefulStaleMetadataRemovalConfig"\n    },\n    "env": {\n      "title": "Env",\n      "description": "The environment that all assets produced by this connector belong to",\n      "default": "PROD",\n      "type": "string"\n    },\n    "platform_instance_map": {\n      "title": "Platform Instance Map",\n      "description": "Platform instance mapping to use when constructing URNs. e.g.`platform_instance_map: { \\"hive\\": \\"warehouse\\" }`",\n      "type": "object",\n      "additionalProperties": {\n        "type": "string"\n      }\n    },\n    "platform_instance": {\n      "title": "Platform Instance",\n      "description": "The instance of the platform that all assets produced by this recipe belong to. This should be unique within the platform. See https://datahubproject.io/docs/platform-instances/ for more details.",\n      "type": "string"\n    },\n    "connect_uri": {\n      "title": "Connect Uri",\n      "description": "URI to connect to.",\n      "default": "http://localhost:8083/",\n      "type": "string"\n    },\n    "username": {\n      "title": "Username",\n      "description": "Kafka Connect username.",\n      "type": "string"\n    },\n    "password": {\n      "title": "Password",\n      "description": "Kafka Connect password.",\n      "type": "string"\n    },\n    "cluster_name": {\n      "title": "Cluster Name",\n      "description": "Cluster to ingest from.",\n      "default": "connect-cluster",\n      "type": "string"\n    },\n    "convert_lineage_urns_to_lowercase": {\n      "title": "Convert Lineage Urns To Lowercase",\n      "description": "Whether to convert the urns of ingested lineage dataset to lowercase",\n      "default": false,\n      "type": "boolean"\n    },\n    "connector_patterns": {\n      "title": "Connector Patterns",\n      "description": "regex patterns for connectors to filter for ingestion.",\n      "default": {\n        "allow": [\n          ".*"\n        ],\n        "deny": [],\n        "ignoreCase": true\n      },\n      "allOf": [\n        {\n          "$ref": "#/definitions/AllowDenyPattern"\n        }\n      ]\n    },\n    "provided_configs": {\n      "title": "Provided Configs",\n      "description": "Provided Configurations",\n      "type": "array",\n      "items": {\n        "$ref": "#/definitions/ProvidedConfig"\n      }\n    },\n    "connect_to_platform_map": {\n      "title": "Connect To Platform Map",\n      "description": "Platform instance mapping when multiple instances for a platform is available. Entry for a platform should be in either `platform_instance_map` or `connect_to_platform_map`. e.g.`connect_to_platform_map: { \\"postgres-connector-finance-db\\": \\"postgres\\": \\"core_finance_instance\\" }`",\n      "type": "object",\n      "additionalProperties": {\n        "type": "object",\n        "additionalProperties": {\n          "type": "string"\n        }\n      }\n    },\n    "generic_connectors": {\n      "title": "Generic Connectors",\n      "description": "Provide lineage graph for sources connectors other than Confluent JDBC Source Connector, Debezium Source Connector, and Mongo Source Connector",\n      "default": [],\n      "type": "array",\n      "items": {\n        "$ref": "#/definitions/GenericConnectorConfig"\n      }\n    }\n  },\n  "additionalProperties": false,\n  "definitions": {\n    "DynamicTypedStateProviderConfig": {\n      "title": "DynamicTypedStateProviderConfig",\n      "type": "object",\n      "properties": {\n        "type": {\n          "title": "Type",\n          "description": "The type of the state provider to use. For DataHub use `datahub`",\n          "type": "string"\n        },\n        "config": {\n          "title": "Config",\n          "description": "The configuration required for initializing the state provider. Default: The datahub_api config if set at pipeline level. Otherwise, the default DatahubClientConfig. See the defaults (https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/graph/client.py#L19).",\n          "default": {},\n          "type": "object"\n        }\n      },\n      "required": [\n        "type"\n      ],\n      "additionalProperties": false\n    },\n    "StatefulStaleMetadataRemovalConfig": {\n      "title": "StatefulStaleMetadataRemovalConfig",\n      "description": "Base specialized config for Stateful Ingestion with stale metadata removal capability.",\n      "type": "object",\n      "properties": {\n        "enabled": {\n          "title": "Enabled",\n          "description": "Whether or not to enable stateful ingest. Default: True if a pipeline_name is set and either a datahub-rest sink or `datahub_api` is specified, otherwise False",\n          "default": false,\n          "type": "boolean"\n        },\n        "remove_stale_metadata": {\n          "title": "Remove Stale Metadata",\n          "description": "Soft-deletes the entities present in the last successful run but missing in the current run with stateful_ingestion enabled.",\n          "default": true,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    },\n    "AllowDenyPattern": {\n      "title": "AllowDenyPattern",\n      "description": "A class to store allow deny regexes",\n      "type": "object",\n      "properties": {\n        "allow": {\n          "title": "Allow",\n          "description": "List of regex patterns to include in ingestion",\n          "default": [\n            ".*"\n          ],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "deny": {\n          "title": "Deny",\n          "description": "List of regex patterns to exclude from ingestion.",\n          "default": [],\n          "type": "array",\n          "items": {\n            "type": "string"\n          }\n        },\n        "ignoreCase": {\n          "title": "Ignorecase",\n          "description": "Whether to ignore case sensitivity during pattern matching.",\n          "default": true,\n          "type": "boolean"\n        }\n      },\n      "additionalProperties": false\n    },\n    "ProvidedConfig": {\n      "title": "ProvidedConfig",\n      "type": "object",\n      "properties": {\n        "provider": {\n          "title": "Provider",\n          "type": "string"\n        },\n        "path_key": {\n          "title": "Path Key",\n          "type": "string"\n        },\n        "value": {\n          "title": "Value",\n          "type": "string"\n        }\n      },\n      "required": [\n        "provider",\n        "path_key",\n        "value"\n      ],\n      "additionalProperties": false\n    },\n    "GenericConnectorConfig": {\n      "title": "GenericConnectorConfig",\n      "type": "object",\n      "properties": {\n        "connector_name": {\n          "title": "Connector Name",\n          "type": "string"\n        },\n        "source_dataset": {\n          "title": "Source Dataset",\n          "type": "string"\n        },\n        "source_platform": {\n          "title": "Source Platform",\n          "type": "string"\n        }\n      },\n      "required": [\n        "connector_name",\n        "source_dataset",\n        "source_platform"\n      ],\n      "additionalProperties": false\n    }\n  }\n}\n')))),(0,n.yg)("h2",{id:"advanced-configurations"},"Advanced Configurations"),(0,n.yg)("h3",{id:"working-with-platform-instances"},"Working with Platform Instances"),(0,n.yg)("p",null,"If you've multiple instances of kafka OR source/sink systems that are referred in your ",(0,n.yg)("inlineCode",{parentName:"p"},"kafka-connect")," setup, you'd need to configure platform instance for these systems in ",(0,n.yg)("inlineCode",{parentName:"p"},"kafka-connect")," recipe to generate correct lineage edges. You must have already set ",(0,n.yg)("inlineCode",{parentName:"p"},"platform_instance")," in recipes of original source/sink systems. Refer the document ",(0,n.yg)("a",{parentName:"p",href:"/docs/platform-instances"},"Working with Platform Instances")," to understand more about this."),(0,n.yg)("p",null,"There are two options available to declare source/sink system's ",(0,n.yg)("inlineCode",{parentName:"p"},"platform_instance")," in ",(0,n.yg)("inlineCode",{parentName:"p"},"kafka-connect")," recipe. If single instance of platform is used across all ",(0,n.yg)("inlineCode",{parentName:"p"},"kafka-connect")," connectors, you can use ",(0,n.yg)("inlineCode",{parentName:"p"},"platform_instance_map")," to specify platform_instance to use for a platform when constructing URNs for lineage."),(0,n.yg)("p",null,"Example:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"    # Map of platform name to platform instance\n    platform_instance_map:\n      snowflake: snowflake_platform_instance\n      mysql: mysql_platform_instance\n\n")),(0,n.yg)("p",null,"If multiple instances of platform are used across ",(0,n.yg)("inlineCode",{parentName:"p"},"kafka-connect")," connectors, you'd need to specify platform_instance to use for platform for every connector."),(0,n.yg)("h4",{id:"example---multiple-mysql-source-connectors-each-reading-from-different-mysql-instance"},"Example - Multiple MySQL Source Connectors each reading from different mysql instance"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"    # Map of platform name to platform instance per connector\n    connect_to_platform_map:\n      mysql_connector1: \n        mysql: mysql_instance1 \n\n      mysql_connector2:\n        mysql: mysql_instance2\n")),(0,n.yg)("p",null,"Here mysql_connector1 and mysql_connector2 are names of MySQL source connectors as defined in ",(0,n.yg)("inlineCode",{parentName:"p"},"kafka-connect")," connector config."),(0,n.yg)("h4",{id:"example---multiple-mysql-source-connectors-each-reading-from-difference-mysql-instance-and-writing-to-different-kafka-cluster"},"Example - Multiple MySQL Source Connectors each reading from difference mysql instance and writing to different kafka cluster"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"    connect_to_platform_map:\n      mysql_connector1:\n        mysql: mysql_instance1\n        kafka: kafka_instance1\n\n      mysql_connector2:\n        mysql: mysql_instance2\n        kafka: kafka_instance2\n")),(0,n.yg)("p",null,"You can also use combination of ",(0,n.yg)("inlineCode",{parentName:"p"},"platform_instance_map")," and ",(0,n.yg)("inlineCode",{parentName:"p"},"connect_to_platform_map")," in your recipe. Note that, the platform_instance specified for the connector in ",(0,n.yg)("inlineCode",{parentName:"p"},"connect_to_platform_map")," will always take higher precedance even if platform_instance for same platform is set in ",(0,n.yg)("inlineCode",{parentName:"p"},"platform_instance_map"),"."),(0,n.yg)("p",null,"If you do not use ",(0,n.yg)("inlineCode",{parentName:"p"},"platform_instance")," in original source/sink recipes, you do not need to specify them in above configurations."),(0,n.yg)("p",null,"Note that, you do not need to specify platform_instance for BigQuery."),(0,n.yg)("h4",{id:"example---multiple-bigquery-sink-connectors-each-writing-to-different-kafka-cluster"},"Example - Multiple BigQuery Sink Connectors each writing to different kafka cluster"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"    connect_to_platform_map:\n      bigquery_connector1:\n        kafka: kafka_instance1\n\n      bigquery_connector2:\n        kafka: kafka_instance2\n")),(0,n.yg)("h3",{id:"provided-configurations-from-external-sources"},"Provided Configurations from External Sources"),(0,n.yg)("p",null,"Kafka Connect supports pluggable configuration providers which can load configuration data from external sources at runtime. These values are not available to DataHub ingestion source through Kafka Connect APIs. If you are using such provided configurations to specify connection url (database, etc) in Kafka Connect connector configuration then you will need also add these in ",(0,n.yg)("inlineCode",{parentName:"p"},"provided_configs")," section in recipe for DataHub to generate correct lineage."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"    # Optional mapping of provider configurations if using\n    provided_configs:\n      - provider: env\n        path_key: MYSQL_CONNECTION_URL\n        value: jdbc:mysql://test_mysql:3306/librarydb\n")),(0,n.yg)("h3",{id:"code-coordinates"},"Code Coordinates"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Class Name: ",(0,n.yg)("inlineCode",{parentName:"li"},"datahub.ingestion.source.kafka_connect.kafka_connect.KafkaConnectSource")),(0,n.yg)("li",{parentName:"ul"},"Browse on ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/kafka_connect/kafka_connect.py"},"GitHub"))),(0,n.yg)("h2",null,"Questions"),(0,n.yg)("p",null,"If you've got any questions on configuring ingestion for Kafka Connect, feel free to ping us on ",(0,n.yg)("a",{parentName:"p",href:"https://slack.datahubproject.io"},"our Slack"),"."))}u.isMDXComponent=!0}}]);