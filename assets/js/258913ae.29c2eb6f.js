"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[66695],{12544:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>m,default:()=>f,frontMatter:()=>u,metadata:()=>p,toc:()=>c});n(96540);var r=n(15680),a=n(53720),o=n(5400);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}const u={title:"Documentation Forms",slug:"/api/tutorials/forms",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/forms.md"},m="Documentation Forms",p={unversionedId:"docs/api/tutorials/forms",id:"version-0.14.1/docs/api/tutorials/forms",title:"Documentation Forms",description:"Why Would You Use Documentation Forms?",source:"@site/versioned_docs/version-0.14.1/docs/api/tutorials/forms.md",sourceDirName:"docs/api/tutorials",slug:"/api/tutorials/forms",permalink:"/docs/0.14.1/api/tutorials/forms",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/forms.md",tags:[],version:"0.14.1",frontMatter:{title:"Documentation Forms",slug:"/api/tutorials/forms",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/forms.md"},sidebar:"overviewSidebar",previous:{title:"Domains",permalink:"/docs/0.14.1/api/tutorials/domains"},next:{title:"Data Lineage",permalink:"/docs/0.14.1/api/tutorials/lineage"}},d={},c=[{value:"Why Would You Use Documentation Forms?",id:"why-would-you-use-documentation-forms",level:2},{value:"Goal Of This Guide",id:"goal-of-this-guide",level:3},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Create a Form",id:"create-a-form",level:2},{value:"Update Form",id:"update-form",level:2},{value:"Read Property Definition",id:"read-property-definition",level:2},{value:"Delete Form",id:"delete-form",level:2},{value:"Assign Form to Entities",id:"assign-form-to-entities",level:2},{value:"Remove Form from Entities",id:"remove-form-from-entities",level:2}],y={toc:c},g="wrapper";function f(e){var{components:t}=e,n=l(e,["components"]);return(0,r.yg)(g,s(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){i(e,t,n[t])}))}return e}({},y,n),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"documentation-forms"},"Documentation Forms"),(0,r.yg)("h2",{id:"why-would-you-use-documentation-forms"},"Why Would You Use Documentation Forms?"),(0,r.yg)("p",null,"Documentation Forms are a way for end-users to fill out all mandatory attributes associated with a data asset. The form will be dynamically generated based on the definitions provided by administrators and stewards and matching rules."),(0,r.yg)("p",null,"Learn more about forms in the ",(0,r.yg)("a",{parentName:"p",href:"/docs/0.14.1/features/feature-guides/documentation-forms"},"Documentation Forms Feature Guide"),"."),(0,r.yg)("h3",{id:"goal-of-this-guide"},"Goal Of This Guide"),(0,r.yg)("p",null,"This guide will show you how to "),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Create, Update, Read, and Delete a form"),(0,r.yg)("li",{parentName:"ul"},"Assign and Remove a form from entities")),(0,r.yg)("h2",{id:"prerequisites"},"Prerequisites"),(0,r.yg)("p",null,"For this tutorial, you need to deploy DataHub Quickstart and ingest sample data.\nFor detailed information, please refer to ",(0,r.yg)("a",{parentName:"p",href:"/docs/0.14.1/quickstart"},"Datahub Quickstart Guide"),"."),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,r.yg)("p",null,"Install the relevant CLI version. Forms are available as of CLI version ",(0,r.yg)("inlineCode",{parentName:"p"},"0.13.1"),". The corresponding DataHub Cloud release version is ",(0,r.yg)("inlineCode",{parentName:"p"},"v0.2.16.5"),"\nConnect to your instance via ",(0,r.yg)("a",{parentName:"p",href:"/docs/cli/#init"},"init"),":"),(0,r.yg)("ol",null,(0,r.yg)("li",{parentName:"ol"},"Run ",(0,r.yg)("inlineCode",{parentName:"li"},"datahub init")," to update the instance you want to load into"),(0,r.yg)("li",{parentName:"ol"},"Set the server to your sandbox instance, ",(0,r.yg)("inlineCode",{parentName:"li"},"https://{your-instance-address}/gms")),(0,r.yg)("li",{parentName:"ol"},"Set the token to your access token")))),(0,r.yg)("h2",{id:"create-a-form"},"Create a Form"),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"graphQL",label:"GraphQL",mdxType:"TabItem"},(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation createForm {\n  createForm(\n    input: {\n      id: "metadataInitiative2024",\n      name: "Metadata Initiative 2024",\n      description: "How we want to ensure the most important data assets in our organization have all of the most important and expected pieces of metadata filled out",\n      type: VERIFICATION,\n      prompts: [\n        {\n          id: "123",\n          title: "retentionTime",\n          description: "Apply Retention Time structured property to form",\n          type: STRUCTURED_PROPERTY,\n          structuredPropertyParams: {\n            urn: "urn:li:structuredProperty:retentionTime"\n          }\n        }\n      ],\n      actors: {\n        users: ["urn:li:corpuser:jane@email.com", "urn:li:corpuser:john@email.com"],\n        groups: ["urn:li:corpGroup:team@email.com"]\n      }\n    }\n  ) {\n    urn\n  }\n}\n'))),(0,r.yg)(o.A,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,r.yg)("p",null,"Create a yaml file representing the forms you\u2019d like to load.\nFor example, below file represents a form ",(0,r.yg)("inlineCode",{parentName:"p"},"123456")," You can see the full example ",(0,r.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/example-yaml-sp/metadata-ingestion/examples/forms/forms.yaml"},"here"),"."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-yaml"},'- id: 123456\n  # urn: "urn:li:form:123456"  # optional if id is provided\n  type: VERIFICATION # Supported Types: DOCUMENTATION, VERIFICATION\n  name: "Metadata Initiative 2023"\n  description: "How we want to ensure the most important data assets in our organization have all of the most important and expected pieces of metadata filled out"\n  prompts:\n    - id: "123"\n      title: "Retention Time"\n      description: "Apply Retention Time structured property to form"\n      type: STRUCTURED_PROPERTY\n      structured_property_id: io.acryl.privacy.retentionTime\n      required: True # optional, will default to True\n  entities: # Either pass a list of urns or a group of filters. This example shows a list of urns\n    urns:\n      - urn:li:dataset:(urn:li:dataPlatform:hdfs,SampleHdfsDataset,PROD)\n  # optionally assign the form to a specific set of users and/or groups\n  # when omitted, form will be assigned to Asset owners\n  actors: \n    users:\n      - urn:li:corpuser:jane@email.com  # note: these should be urns\n      - urn:li:corpuser:john@email.com\n    groups:\n      - urn:li:corpGroup:team@email.com  # note: these should be urns\n')),(0,r.yg)("admonition",{type:"note"},(0,r.yg)("p",{parentName:"admonition"},"Note that the structured properties and related entities should be created before you create the form.\nPlease refer to the ",(0,r.yg)("a",{parentName:"p",href:"/docs/0.14.1/api/tutorials/structured-properties"},"Structured Properties Tutorial")," for more information.")),(0,r.yg)("p",null,"You can apply forms to either a list of entity urns, or a list of filters. For a list of entity urns, use this structure:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"entities:\nurns:\n  - urn:li:dataset:...\n")),(0,r.yg)("p",null,"For a list of filters, use this structure:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"entities:\nfilters:\n  types:\n    - dataset  # you can use entity type name or urn\n  platforms:\n    - snowflake  # you can use platform name or urn\n  domains:\n    - urn:li:domain:finance  # you must use domain urn\n  containers:\n    - urn:li:container:my_container  # you must use container urn\n")),(0,r.yg)("p",null,"Note that you can filter to entity types, platforms, domains, and/or containers."),(0,r.yg)("p",null,"Use the CLI to create your properties:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-commandline"},"datahub forms upsert -f {forms_yaml}\n")),(0,r.yg)("p",null,"If successful, you should see ",(0,r.yg)("inlineCode",{parentName:"p"},"Created form urn:li:form:...")))),(0,r.yg)("h2",{id:"update-form"},"Update Form"),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"graphQL",label:"GraphQL",mdxType:"TabItem"},(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation updateForm {\n  updateForm(\n    input: {\n      urn: "urn:li:form:metadataInitiative2024",\n      name: "Metadata Initiative 2024",\n      description: "How we want to ensure the most important data assets in our organization have all of the most important and expected pieces of metadata filled out",\n      type: VERIFICATION,\n      promptsToAdd: [\n        {\n          id: "456",\n          title: "deprecationDate",\n          description: "Deprecation date for dataset",\n          type: STRUCTURED_PROPERTY,\n          structuredPropertyParams: {\n            urn: "urn:li:structuredProperty:deprecationDate"\n          }\n        }\n      ]\n      promptsToRemove: ["123"]\n    }\n  ) {\n    urn\n  }\n}\n')))),(0,r.yg)("h2",{id:"read-property-definition"},"Read Property Definition"),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,r.yg)("p",null,"You can see the properties you created by running the following command:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-commandline"},"datahub forms get --urn {urn}\n")),(0,r.yg)("p",null,"For example, you can run ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub forms get --urn urn:li:form:123456"),"."),(0,r.yg)("p",null,"If successful, you should see metadata about your form returned like below."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-json"},'{\n  "urn": "urn:li:form:123456",\n  "name": "Metadata Initiative 2023",\n  "description": "How we want to ensure the most important data assets in our organization have all of the most important and expected pieces of metadata filled out",\n  "prompts": [\n    {\n      "id": "123",\n      "title": "Retention Time",\n      "description": "Apply Retention Time structured property to form",\n      "type": "STRUCTURED_PROPERTY",\n      "structured_property_urn": "urn:li:structuredProperty:io.acryl.privacy.retentionTime"\n    }\n  ],\n  "type": "VERIFICATION"\n}\n')))),(0,r.yg)("h2",{id:"delete-form"},"Delete Form"),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"graphQL",label:"GraphQL",mdxType:"TabItem"},(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation deleteForm {\n  deleteForm(\n    input: {\n      urn: "urn:li:form:metadataInitiative2024"\n    }\n  )\n}\n')))),(0,r.yg)("h2",{id:"assign-form-to-entities"},"Assign Form to Entities"),(0,r.yg)("p",null,"For assigning a form to a given list of entities: "),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"graphQL",label:"GraphQL",mdxType:"TabItem"},(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation batchAssignForm {\n  batchAssignForm(\n    input: {\n      formUrn: "urn:li:form:myform",\n      entityUrns: ["urn:li:dataset:mydataset1", "urn:li:dataset:mydataset2"]\n    }\n  )\n}\n')))),(0,r.yg)("h2",{id:"remove-form-from-entities"},"Remove Form from Entities"),(0,r.yg)("p",null,"For removing a form from a given list of entities:"),(0,r.yg)(a.A,{mdxType:"Tabs"},(0,r.yg)(o.A,{value:"graphQL",label:"GraphQL",mdxType:"TabItem"},(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation batchRemoveForm {\n  batchRemoveForm(\n    input: {\n      formUrn: "urn:li:form:myform",\n      entityUrns: ["urn:li:dataset:mydataset1", "urn:li:dataset:mydataset2"]\n    }\n  )\n}\n')))))}f.isMDXComponent=!0}}]);