"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[45408],{15680:(e,n,t)=>{t.d(n,{xA:()=>c,yg:()=>u});var r=t(96540);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),p=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(s.Provider,{value:n},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},y=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(t),y=a,u=d["".concat(s,".").concat(y)]||d[y]||m[y]||i;return t?r.createElement(u,o(o({ref:n},c),{},{components:t})):r.createElement(u,o({ref:n},c))}));function u(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=y;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l[d]="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=t[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}y.displayName="MDXCreateElement"},98767:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>u,frontMatter:()=>l,metadata:()=>p,toc:()=>d});t(96540);var r=t(15680);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){return n=null!=n?n:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):function(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})),e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}const l={sidebar_position:34,title:"OwnershipType",slug:"/generated/metamodel/entities/ownershiptype",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/metamodel/entities/ownershipType.md"},s="OwnershipType",p={unversionedId:"docs/generated/metamodel/entities/ownershipType",id:"docs/generated/metamodel/entities/ownershipType",title:"OwnershipType",description:"Ownership Type represents a user-created ownership category for a person or group who is responsible for an asset.",source:"@site/genDocs/docs/generated/metamodel/entities/ownershipType.md",sourceDirName:"docs/generated/metamodel/entities",slug:"/generated/metamodel/entities/ownershiptype",permalink:"/docs/generated/metamodel/entities/ownershiptype",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/generated/metamodel/entities/ownershipType.md",tags:[],version:"current",sidebarPosition:34,frontMatter:{sidebar_position:34,title:"OwnershipType",slug:"/generated/metamodel/entities/ownershiptype",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/generated/metamodel/entities/ownershipType.md"},sidebar:"overviewSidebar",previous:{title:"DataProduct",permalink:"/docs/generated/metamodel/entities/dataproduct"},next:{title:"BusinessAttribute",permalink:"/docs/generated/metamodel/entities/businessattribute"}},c={},d=[{value:"Aspects",id:"aspects",level:2},{value:"ownershipTypeInfo",id:"ownershiptypeinfo",level:3},{value:"status",id:"status",level:3},{value:"Relationships",id:"relationships",level:2},{value:"Incoming",id:"incoming",level:3},{value:"Global Metadata Model",id:"global-metadata-model",level:2}],m={toc:d},y="wrapper";function u(e){var{components:n}=e,t=o(e,["components"]);return(0,r.yg)(y,i(function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},r=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),r.forEach((function(n){a(e,n,t[n])}))}return e}({},m,t),{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"ownershiptype"},"OwnershipType"),(0,r.yg)("p",null,"Ownership Type represents a user-created ownership category for a person or group who is responsible for an asset."),(0,r.yg)("h2",{id:"aspects"},"Aspects"),(0,r.yg)("h3",{id:"ownershiptypeinfo"},"ownershipTypeInfo"),(0,r.yg)("p",null,"Information about an ownership type"),(0,r.yg)("details",null,(0,r.yg)("summary",null,"Schema"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "type": "record",\n  "Aspect": {\n    "name": "ownershipTypeInfo"\n  },\n  "name": "OwnershipTypeInfo",\n  "namespace": "com.linkedin.ownership",\n  "fields": [\n    {\n      "Searchable": {\n        "boostScore": 10.0,\n        "enableAutocomplete": true,\n        "fieldType": "WORD_GRAM"\n      },\n      "type": "string",\n      "name": "name",\n      "doc": "Display name of the Ownership Type"\n    },\n    {\n      "type": [\n        "null",\n        "string"\n      ],\n      "name": "description",\n      "default": null,\n      "doc": "Description of the Ownership Type"\n    },\n    {\n      "Searchable": {\n        "/actor": {\n          "fieldName": "createdBy",\n          "fieldType": "URN"\n        },\n        "/time": {\n          "fieldName": "createdAt",\n          "fieldType": "DATETIME"\n        }\n      },\n      "type": {\n        "type": "record",\n        "name": "AuditStamp",\n        "namespace": "com.linkedin.common",\n        "fields": [\n          {\n            "type": "long",\n            "name": "time",\n            "doc": "When did the resource/association/sub-resource move into the specific lifecycle stage represented by this AuditEvent."\n          },\n          {\n            "java": {\n              "class": "com.linkedin.common.urn.Urn"\n            },\n            "type": "string",\n            "name": "actor",\n            "doc": "The entity (e.g. a member URN) which will be credited for moving the resource/association/sub-resource into the specific lifecycle stage. It is also the one used to authorize the change."\n          },\n          {\n            "java": {\n              "class": "com.linkedin.common.urn.Urn"\n            },\n            "type": [\n              "null",\n              "string"\n            ],\n            "name": "impersonator",\n            "default": null,\n            "doc": "The entity (e.g. a service URN) which performs the change on behalf of the Actor and must be authorized to act as the Actor."\n          },\n          {\n            "type": [\n              "null",\n              "string"\n            ],\n            "name": "message",\n            "default": null,\n            "doc": "Additional context around how DataHub was informed of the particular change. For example: was the change created by an automated process, or manually."\n          }\n        ],\n        "doc": "Data captured on a resource/association/sub-resource level giving insight into when that resource/association/sub-resource moved into a particular lifecycle stage, and who acted to move it into that specific lifecycle stage."\n      },\n      "name": "created",\n      "doc": "Audit stamp capturing the time and actor who created the Ownership Type."\n    },\n    {\n      "Searchable": {\n        "/actor": {\n          "fieldName": "lastModifiedBy",\n          "fieldType": "URN"\n        },\n        "/time": {\n          "fieldName": "lastModifiedAt",\n          "fieldType": "DATETIME"\n        }\n      },\n      "type": "com.linkedin.common.AuditStamp",\n      "name": "lastModified",\n      "doc": "Audit stamp capturing the time and actor who last modified the Ownership Type."\n    }\n  ],\n  "doc": "Information about an ownership type"\n}\n'))),(0,r.yg)("h3",{id:"status"},"status"),(0,r.yg)("p",null,"The lifecycle status metadata of an entity, e.g. dataset, metric, feature, etc.\nThis aspect is used to represent soft deletes conventionally."),(0,r.yg)("details",null,(0,r.yg)("summary",null,"Schema"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-javascript"},'{\n  "type": "record",\n  "Aspect": {\n    "name": "status"\n  },\n  "name": "Status",\n  "namespace": "com.linkedin.common",\n  "fields": [\n    {\n      "Searchable": {\n        "fieldType": "BOOLEAN"\n      },\n      "type": "boolean",\n      "name": "removed",\n      "default": false,\n      "doc": "Whether the entity has been removed (soft-deleted)."\n    }\n  ],\n  "doc": "The lifecycle status metadata of an entity, e.g. dataset, metric, feature, etc.\\nThis aspect is used to represent soft deletes conventionally."\n}\n'))),(0,r.yg)("h2",{id:"relationships"},"Relationships"),(0,r.yg)("h3",{id:"incoming"},"Incoming"),(0,r.yg)("p",null,"These are the relationships stored in other entity's aspects"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("p",{parentName:"li"},"ownershipType"),(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Dataset via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"DataJob via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"DataFlow via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"DataProcess via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"Chart via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"Dashboard via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"Notebook via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"CorpGroup via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"Domain via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"Container via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"Tag via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"GlossaryTerm via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"GlossaryNode via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"DataPlatformInstance via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"MlModel via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"MlModelGroup via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"MlModelDeployment via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"MlFeatureTable via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"MlFeature via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"MlPrimaryKey via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"ErModelRelationship via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn")),(0,r.yg)("li",{parentName:"ul"},"DataProduct via ",(0,r.yg)("inlineCode",{parentName:"li"},"ownership.owners.typeUrn"))))),(0,r.yg)("h2",{id:"global-metadata-model"},(0,r.yg)("a",{parentName:"h2",href:"https://github.com/datahub-project/static-assets/raw/main/imgs/datahub-metadata-model.png"},"Global Metadata Model")),(0,r.yg)("p",null,(0,r.yg)("img",{parentName:"p",src:"https://github.com/datahub-project/static-assets/raw/main/imgs/datahub-metadata-model.png",alt:"Global Graph"})))}u.isMDXComponent=!0}}]);