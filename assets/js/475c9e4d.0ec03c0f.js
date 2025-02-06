"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[70086],{49168:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>p,default:()=>f,frontMatter:()=>g,metadata:()=>d,toc:()=>m});a(96540);var n=a(15680),i=a(53720),l=a(5400);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})),e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}const g={sidebar_position:19,title:"File Based Lineage",slug:"/generated/ingestion/sources/file-based-lineage",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/file-based-lineage.md"},p="File Based Lineage",d={unversionedId:"docs/generated/ingestion/sources/file-based-lineage",id:"version-0.14.1/docs/generated/ingestion/sources/file-based-lineage",title:"File Based Lineage",description:"Certified",source:"@site/versioned_docs/version-0.14.1/docs/generated/ingestion/sources/file-based-lineage.md",sourceDirName:"docs/generated/ingestion/sources",slug:"/generated/ingestion/sources/file-based-lineage",permalink:"/docs/0.14.1/generated/ingestion/sources/file-based-lineage",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/file-based-lineage.md",tags:[],version:"0.14.1",sidebarPosition:19,frontMatter:{sidebar_position:19,title:"File Based Lineage",slug:"/generated/ingestion/sources/file-based-lineage",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/file-based-lineage.md"},sidebar:"overviewSidebar",previous:{title:"Feast",permalink:"/docs/0.14.1/generated/ingestion/sources/feast"},next:{title:"Fivetran",permalink:"/docs/0.14.1/generated/ingestion/sources/fivetran"}},u={},m=[{value:"Important Capabilities",id:"important-capabilities",level:3},{value:"CLI based Ingestion",id:"cli-based-ingestion",level:3},{value:"Install the Plugin",id:"install-the-plugin",level:4},{value:"Starter Recipe",id:"starter-recipe",level:3},{value:"Config Details",id:"config-details",level:3},{value:"Lineage File Format",id:"lineage-file-format",level:3},{value:"Code Coordinates",id:"code-coordinates",level:3}],y={toc:m},c="wrapper";function f(e){var{components:t}=e,a=s(e,["components"]);return(0,n.yg)(c,o(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){r(e,t,a[t])}))}return e}({},y,a),{components:t,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"file-based-lineage"},"File Based Lineage"),(0,n.yg)("p",null,(0,n.yg)("img",{parentName:"p",src:"https://img.shields.io/badge/support%20status-certified-brightgreen",alt:"Certified"})),(0,n.yg)("h3",{id:"important-capabilities"},"Important Capabilities"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Capability"),(0,n.yg)("th",{parentName:"tr",align:null},"Status"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Column-level Lineage"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Specified in the lineage file.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Table-Level Lineage"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Specified in the lineage file.")))),(0,n.yg)("p",null,"This plugin pulls lineage metadata from a yaml-formatted file. An example of one such file is located in the examples directory ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/bootstrap_data/file_lineage.yml"},"here"),"."),(0,n.yg)("h3",{id:"cli-based-ingestion"},"CLI based Ingestion"),(0,n.yg)("h4",{id:"install-the-plugin"},"Install the Plugin"),(0,n.yg)("p",null,"The ",(0,n.yg)("inlineCode",{parentName:"p"},"datahub-lineage-file")," source works out of the box with ",(0,n.yg)("inlineCode",{parentName:"p"},"acryl-datahub"),"."),(0,n.yg)("h3",{id:"starter-recipe"},"Starter Recipe"),(0,n.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,n.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,n.yg)("a",{parentName:"p",href:"/docs/0.14.1/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},"source:\n  type: datahub-lineage-file\n  config:\n    # Coordinates\n    file: /path/to/file_lineage.yml\n    # Whether we want to query datahub-gms for upstream data\n    preserve_upstream: False\n\nsink:\n# sink configs\n")),(0,n.yg)("h3",{id:"config-details"},"Config Details"),(0,n.yg)(i.A,{mdxType:"Tabs"},(0,n.yg)(l.A,{value:"options",label:"Options",default:!0,mdxType:"TabItem"},(0,n.yg)("p",null,"Note that a ",(0,n.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,n.yg)("div",{className:"config-table"},(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:"left"},"Field"),(0,n.yg)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"file"),"\xa0",(0,n.yg)("abbr",{title:"Required"},"\u2705"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"File path or URL to lineage file to ingest.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"preserve_upstream"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"boolean"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Whether we want to query datahub-gms for upstream data. False means it will hard replace upstream data for a given entity. True means it will query the backend for existing upstreams and include it in the ingestion run ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"True")))))))),(0,n.yg)(l.A,{value:"schema",label:"Schema",mdxType:"TabItem"},(0,n.yg)("p",null,"The ",(0,n.yg)("a",{parentName:"p",href:"https://json-schema.org/"},"JSONSchema")," for this configuration is inlined below."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "title": "LineageFileSourceConfig",\n  "type": "object",\n  "properties": {\n    "file": {\n      "title": "File",\n      "description": "File path or URL to lineage file to ingest.",\n      "type": "string"\n    },\n    "preserve_upstream": {\n      "title": "Preserve Upstream",\n      "description": "Whether we want to query datahub-gms for upstream data. False means it will hard replace upstream data for a given entity. True means it will query the backend for existing upstreams and include it in the ingestion run",\n      "default": true,\n      "type": "boolean"\n    }\n  },\n  "required": [\n    "file"\n  ],\n  "additionalProperties": false\n}\n')))),(0,n.yg)("h3",{id:"lineage-file-format"},"Lineage File Format"),(0,n.yg)("p",null,"The lineage source file should be a ",(0,n.yg)("inlineCode",{parentName:"p"},".yml")," file with the following top-level keys:"),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"version"),": the version of lineage file config the config conforms to. Currently, the only version released\nis ",(0,n.yg)("inlineCode",{parentName:"p"},"1"),"."),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"lineage"),": the top level key of the lineage file containing a list of ",(0,n.yg)("strong",{parentName:"p"},"EntityNodeConfig")," objects"),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"EntityNodeConfig"),":"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"entity"),": ",(0,n.yg)("strong",{parentName:"li"},"EntityConfig")," object"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"upstream"),": (optional) list of child ",(0,n.yg)("strong",{parentName:"li"},"EntityNodeConfig")," objects"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"fineGrainedLineages"),": (optional) list of ",(0,n.yg)("strong",{parentName:"li"},"FineGrainedLineageConfig")," objects")),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"EntityConfig"),":"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"name"),": identifier of the entity. Typically name or guid, as used in constructing entity urn."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"type"),": type of the entity (only ",(0,n.yg)("inlineCode",{parentName:"li"},"dataset")," is supported as of now)"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"env"),": the environment of this entity. Should match the values in the\ntable ",(0,n.yg)("a",{parentName:"li",href:"/docs/graphql/enums/#fabrictype"},"here")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"platform"),": a valid platform like kafka, snowflake, etc.."),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"platform_instance"),": optional string specifying the platform instance of this entity")),(0,n.yg)("p",null,"For example if dataset URN is ",(0,n.yg)("inlineCode",{parentName:"p"},"urn:li:dataset:(urn:li:dataPlatform:redshift,userdb.public.customer_table,DEV)")," then ",(0,n.yg)("strong",{parentName:"p"},"EntityConfig")," will look like:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yml"},"name : userdb.public.customer_table\ntype: dataset\nenv: DEV\nplatform: redshift\n")),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"FineGrainedLineageConfig"),":"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"upstreamType"),': type of upstream entity in a fine-grained lineage; default = "FIELD_SET"'),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"upstreams"),": (optional) list of upstream schema field urns"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"downstreamType"),': type of downstream entity in a fine-grained lineage; default = "FIELD_SET"'),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"downstreams"),": (optional) list of downstream schema field urns"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"transformOperation"),": (optional) transform operation applied to the upstream entities to produce the downstream field(s)"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("strong",{parentName:"li"},"confidenceScore"),": (optional) the confidence in this lineage between 0 (low confidence) and 1 (high confidence); default = 1.0")),(0,n.yg)("p",null,(0,n.yg)("strong",{parentName:"p"},"FineGrainedLineageConfig")," can be used to display fine grained lineage, also referred to as column-level lineage,\nfor custom sources."),(0,n.yg)("p",null,"You can also view an example lineage file checked in ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/bootstrap_data/file_lineage.yml"},"here")),(0,n.yg)("h3",{id:"code-coordinates"},"Code Coordinates"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Class Name: ",(0,n.yg)("inlineCode",{parentName:"li"},"datahub.ingestion.source.metadata.lineage.LineageFileSource")),(0,n.yg)("li",{parentName:"ul"},"Browse on ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/metadata/lineage.py"},"GitHub"))),(0,n.yg)("h2",null,"Questions"),(0,n.yg)("p",null,"If you've got any questions on configuring ingestion for File Based Lineage, feel free to ping us on ",(0,n.yg)("a",{parentName:"p",href:"https://slack.datahubproject.io"},"our Slack"),"."))}f.isMDXComponent=!0}}]);