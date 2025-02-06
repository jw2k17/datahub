"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[52663],{1767:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>g,default:()=>h,frontMatter:()=>d,metadata:()=>p,toc:()=>u});a(96540);var n=a(15680),r=a(53720),i=a(5400);function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})),e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}const d={sidebar_position:9,title:"CSV Enricher",slug:"/generated/ingestion/sources/csv-enricher",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/csv-enricher.md"},g="CSV Enricher",p={unversionedId:"docs/generated/ingestion/sources/csv-enricher",id:"docs/generated/ingestion/sources/csv-enricher",title:"CSV Enricher",description:"Incubating",source:"@site/genDocs/docs/generated/ingestion/sources/csv-enricher.md",sourceDirName:"docs/generated/ingestion/sources",slug:"/generated/ingestion/sources/csv-enricher",permalink:"/docs/generated/ingestion/sources/csv-enricher",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/csv-enricher.md",tags:[],version:"current",sidebarPosition:9,frontMatter:{sidebar_position:9,title:"CSV Enricher",slug:"/generated/ingestion/sources/csv-enricher",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/ingestion/sources/csv-enricher.md"},sidebar:"overviewSidebar",previous:{title:"CockroachDB",permalink:"/docs/generated/ingestion/sources/cockroachdb"},next:{title:"Databricks",permalink:"/docs/generated/ingestion/sources/databricks"}},c={},u=[{value:"Important Capabilities",id:"important-capabilities",level:3},{value:"CLI based Ingestion",id:"cli-based-ingestion",level:3},{value:"Starter Recipe",id:"starter-recipe",level:3},{value:"Config Details",id:"config-details",level:3},{value:"Code Coordinates",id:"code-coordinates",level:3}],y={toc:u},m="wrapper";function h(e){var{components:t}=e,a=l(e,["components"]);return(0,n.yg)(m,o(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){s(e,t,a[t])}))}return e}({},y,a),{components:t,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"csv-enricher"},"CSV Enricher"),(0,n.yg)("p",null,(0,n.yg)("img",{parentName:"p",src:"https://img.shields.io/badge/support%20status-incubating-blue",alt:"Incubating"})),(0,n.yg)("h3",{id:"important-capabilities"},"Important Capabilities"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Capability"),(0,n.yg)("th",{parentName:"tr",align:null},"Status"),(0,n.yg)("th",{parentName:"tr",align:null},"Notes"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Descriptions"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Supported by default")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},(0,n.yg)("a",{parentName:"td",href:"/docs/domains"},"Domains")),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Supported by default")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Extract Ownership"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Supported by default")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"Extract Tags"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"Supported by default")))),(0,n.yg)("admonition",{title:"Looking to ingest a CSV data file into DataHub, as an asset?",type:"tip"},(0,n.yg)("p",{parentName:"admonition"},"Use the ",(0,n.yg)("a",{parentName:"p",href:"/docs/generated/ingestion/sources/s3"},"Local File")," ingestion source.\nThe CSV enricher is used for enriching entities already ingested into DataHub.")),(0,n.yg)("p",null,"This plugin is used to bulk upload metadata to Datahub.\nIt will apply glossary terms, tags, description, owners and domain at the entity level. It can also be used to apply tags,\nglossary terms, and documentation at the column level. These values are read from a CSV file. You have the option to either overwrite\nor append existing values."),(0,n.yg)("p",null,"The format of the CSV is demonstrated below. The header is required and URNs should be surrounded by quotes when they contains commas (most URNs contains commas)."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre"},'resource,subresource,glossary_terms,tags,owners,ownership_type,description,domain,ownership_type_urn\n"urn:li:dataset:(urn:li:dataPlatform:snowflake,datahub.growth.users,PROD)",,[urn:li:glossaryTerm:Users],[urn:li:tag:HighQuality],[urn:li:corpuser:lfoe|urn:li:corpuser:jdoe],CUSTOM,"description for users table",urn:li:domain:Engineering,urn:li:ownershipType:a0e9176c-d8cf-4b11-963b-f7a1bc2333c9\n"urn:li:dataset:(urn:li:dataPlatform:hive,datahub.growth.users,PROD)",first_name,[urn:li:glossaryTerm:FirstName],,,,"first_name description",\n"urn:li:dataset:(urn:li:dataPlatform:hive,datahub.growth.users,PROD)",last_name,[urn:li:glossaryTerm:LastName],,,,"last_name description",\n')),(0,n.yg)("p",null,"Note that the first row does not have a subresource populated. That means any glossary terms, tags, and owners will\nbe applied at the entity field. If a subresource is populated (as it is for the second and third rows), glossary\nterms and tags will be applied on the column. Every row MUST have a resource. Also note that owners can only\nbe applied at the resource level."),(0,n.yg)("p",null,"If ownership_type_urn is set then ownership_type must be set to CUSTOM."),(0,n.yg)("p",null,"Note that you have the option in your recipe config to write as a PATCH or as an OVERRIDE. This choice will apply to\nall metadata for the entity, not just a single aspect. So OVERRIDE will override all metadata, including performing\ndeletes if a metadata field is empty. The default is PATCH."),(0,n.yg)("admonition",{type:"note"},(0,n.yg)("p",{parentName:"admonition"},"This source will not work on very large csv files that do not fit in memory.")),(0,n.yg)("h3",{id:"cli-based-ingestion"},"CLI based Ingestion"),(0,n.yg)("h3",{id:"starter-recipe"},"Starter Recipe"),(0,n.yg)("p",null,"Check out the following recipe to get started with ingestion! See ",(0,n.yg)("a",{parentName:"p",href:"#config-details"},"below")," for full configuration options."),(0,n.yg)("p",null,"For general pointers on writing and running a recipe, see our ",(0,n.yg)("a",{parentName:"p",href:"/docs/metadata-ingestion#recipes"},"main recipe guide"),"."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},"source:\n  type: csv-enricher \n  config:\n    # relative path to your csv file to ingest\n    filename: ./path/to/your/file.csv\n\n# Default sink is datahub-rest and doesn't need to be configured\n# See https://datahubproject.io/docs/metadata-ingestion/sink_docs/datahub for customization options\n\n")),(0,n.yg)("h3",{id:"config-details"},"Config Details"),(0,n.yg)(r.A,{mdxType:"Tabs"},(0,n.yg)(i.A,{value:"options",label:"Options",default:!0,mdxType:"TabItem"},(0,n.yg)("p",null,"Note that a ",(0,n.yg)("inlineCode",{parentName:"p"},".")," is used to denote nested fields in the YAML recipe."),(0,n.yg)("div",{className:"config-table"},(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:"left"},"Field"),(0,n.yg)("th",{parentName:"tr",align:"left"},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"filename"),"\xa0",(0,n.yg)("abbr",{title:"Required"},"\u2705"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"File path or URL of CSV file to ingest.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"array_delimiter"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Delimiter to use when parsing array fields (tags, terms and owners) ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"|")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"delimiter"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},"Delimiter to use when parsing CSV ",(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},",")))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:"left"},(0,n.yg)("div",{className:"path-line"},(0,n.yg)("span",{className:"path-main"},"write_semantics"))," ",(0,n.yg)("div",{className:"type-name-line"},(0,n.yg)("span",{className:"type-name"},"string"))),(0,n.yg)("td",{parentName:"tr",align:"left"},'Whether the new tags, terms and owners to be added will override the existing ones added only by this source or not. Value for this config can be "PATCH" or "OVERRIDE". NOTE: this will apply to all metadata for the entity, not just a single aspect. ',(0,n.yg)("div",{className:"default-line default-line-with-docs"},"Default: ",(0,n.yg)("span",{className:"default-value"},"PATCH")))))))),(0,n.yg)(i.A,{value:"schema",label:"Schema",mdxType:"TabItem"},(0,n.yg)("p",null,"The ",(0,n.yg)("a",{parentName:"p",href:"https://json-schema.org/"},"JSONSchema")," for this configuration is inlined below."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "title": "CSVEnricherConfig",\n  "type": "object",\n  "properties": {\n    "filename": {\n      "title": "Filename",\n      "description": "File path or URL of CSV file to ingest.",\n      "type": "string"\n    },\n    "write_semantics": {\n      "title": "Write Semantics",\n      "description": "Whether the new tags, terms and owners to be added will override the existing ones added only by this source or not. Value for this config can be \\"PATCH\\" or \\"OVERRIDE\\". NOTE: this will apply to all metadata for the entity, not just a single aspect.",\n      "default": "PATCH",\n      "type": "string"\n    },\n    "delimiter": {\n      "title": "Delimiter",\n      "description": "Delimiter to use when parsing CSV",\n      "default": ",",\n      "type": "string"\n    },\n    "array_delimiter": {\n      "title": "Array Delimiter",\n      "description": "Delimiter to use when parsing array fields (tags, terms and owners)",\n      "default": "|",\n      "type": "string"\n    }\n  },\n  "required": [\n    "filename"\n  ],\n  "additionalProperties": false\n}\n')))),(0,n.yg)("h3",{id:"code-coordinates"},"Code Coordinates"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Class Name: ",(0,n.yg)("inlineCode",{parentName:"li"},"datahub.ingestion.source.csv_enricher.CSVEnricherSource")),(0,n.yg)("li",{parentName:"ul"},"Browse on ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/csv_enricher.py"},"GitHub"))),(0,n.yg)("h2",null,"Questions"),(0,n.yg)("p",null,"If you've got any questions on configuring ingestion for CSV Enricher, feel free to ping us on ",(0,n.yg)("a",{parentName:"p",href:"https://slack.datahubproject.io"},"our Slack"),"."))}h.isMDXComponent=!0}}]);