"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[63699],{15680:(e,t,n)=>{n.d(t,{xA:()=>u,yg:()=>y});var r=n(96540);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=l(n),d=i,y=p["".concat(c,".").concat(d)]||p[d]||g[d]||o;return n?r.createElement(y,a(a({ref:t},u),{},{components:n})):r.createElement(y,a({ref:t},u))}));function y(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[p]="string"==typeof e?e:i,a[1]=s;for(var l=2;l<o;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},83979:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>c,default:()=>y,frontMatter:()=>s,metadata:()=>l,toc:()=>p});n(96540);var r=n(15680);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}const s={title:"Ingestion Executor",slug:"/actions/actions/executor",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/actions/actions/executor.md"},c="Ingestion Executor",l={unversionedId:"docs/actions/actions/executor",id:"version-0.15.0/docs/actions/actions/executor",title:"Ingestion Executor",description:"Certified",source:"@site/versioned_docs/version-0.15.0/docs/actions/actions/executor.md",sourceDirName:"docs/actions/actions",slug:"/actions/actions/executor",permalink:"/docs/0.15.0/actions/actions/executor",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/actions/actions/executor.md",tags:[],version:"0.15.0",frontMatter:{title:"Ingestion Executor",slug:"/actions/actions/executor",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/actions/actions/executor.md"},sidebar:"overviewSidebar",previous:{title:"Metadata Change Log Event V1",permalink:"/docs/0.15.0/actions/events/metadata-change-log-event"},next:{title:"Hello World",permalink:"/docs/0.15.0/actions/actions/hello_world"}},u={},p=[{value:"Overview",id:"overview",level:2},{value:"Capabilities",id:"capabilities",level:3},{value:"Supported Events",id:"supported-events",level:3},{value:"Action Quickstart",id:"action-quickstart",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"DataHub Privileges",id:"datahub-privileges",level:4},{value:"Connecting to Ingestion Sources",id:"connecting-to-ingestion-sources",level:4},{value:"Install the Plugin(s)",id:"install-the-plugins",level:3},{value:"Configure the Action Config",id:"configure-the-action-config",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Quitting the Actions Framework",id:"quitting-the-actions-framework",level:3}],g={toc:p},d="wrapper";function y(e){var{components:t}=e,n=a(e,["components"]);return(0,r.yg)(d,o(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){i(e,t,n[t])}))}return e}({},g,n),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"ingestion-executor"},"Ingestion Executor"),(0,r.yg)("p",null,(0,r.yg)("img",{parentName:"p",src:"https://img.shields.io/badge/support%20status-certified-brightgreen",alt:"Certified"})),(0,r.yg)("h2",{id:"overview"},"Overview"),(0,r.yg)("p",null,"This Action executes ingestion recipes that are configured via the UI."),(0,r.yg)("h3",{id:"capabilities"},"Capabilities"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Executing ",(0,r.yg)("inlineCode",{parentName:"li"},"datahub ingest")," command in a sub-process when an Execution Request command is received from DataHub. (Scheduled or manual ingestion run)"),(0,r.yg)("li",{parentName:"ul"},"Resolving secrets within an ingestion recipe from DataHub"),(0,r.yg)("li",{parentName:"ul"},"Reporting ingestion execution status to DataHub")),(0,r.yg)("h3",{id:"supported-events"},"Supported Events"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"MetadataChangeLog_v1"))),(0,r.yg)("p",null,"Specifically, changes to the ",(0,r.yg)("inlineCode",{parentName:"p"},"dataHubExecutionRequestInput")," and ",(0,r.yg)("inlineCode",{parentName:"p"},"dataHubExecutionRequestSignal")," aspects of the ",(0,r.yg)("inlineCode",{parentName:"p"},"dataHubExecutionRequest")," entity are required."),(0,r.yg)("h2",{id:"action-quickstart"},"Action Quickstart"),(0,r.yg)("h3",{id:"prerequisites"},"Prerequisites"),(0,r.yg)("h4",{id:"datahub-privileges"},"DataHub Privileges"),(0,r.yg)("p",null,"This action must be executed as a privileged DataHub user (e.g. using Personal Access Tokens). Specifically, the user must have the ",(0,r.yg)("inlineCode",{parentName:"p"},"Manage Secrets")," Platform Privilege, which allows for retrieval\nof decrypted secrets for injection into an ingestion recipe. "),(0,r.yg)("p",null,"An access token generated from a privileged account must be configured in the ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub")," configuration\nblock of the YAML configuration, as shown in the example below. "),(0,r.yg)("h4",{id:"connecting-to-ingestion-sources"},"Connecting to Ingestion Sources"),(0,r.yg)("p",null,"In order for ingestion to run successfully, the process running the Actions must have\nnetwork connectivity to any source systems that are required for ingestion. "),(0,r.yg)("p",null,"For example, if the ingestion recipe is pulling from an internal DBMS, the actions container\nmust be able to resolve & connect to that DBMS system for the ingestion command to run successfully."),(0,r.yg)("h3",{id:"install-the-plugins"},"Install the Plugin(s)"),(0,r.yg)("p",null,"Run the following commands to install the relevant action plugin(s):"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"pip install 'acryl-datahub-actions[executor]'")),(0,r.yg)("h3",{id:"configure-the-action-config"},"Configure the Action Config"),(0,r.yg)("p",null,"Use the following config(s) to get started with this Action. "),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-yml"},'name: "pipeline-name"\nsource:\n  # source configs\naction:\n  type: "executor"\n# Requires DataHub API configurations to report to DataHub\ndatahub:\n  server: "http://${DATAHUB_GMS_HOST:-localhost}:${DATAHUB_GMS_PORT:-8080}"\n  # token: <token> # Must have "Manage Secrets" privilege\n')),(0,r.yg)("details",null,(0,r.yg)("summary",null,"View All Configuration Options"),"| Field | Required | Default | Description | | --- | :-: | :-: | --- | | `executor_id` | \u274c | `default` | An executor ID assigned to the executor. This can be used to manage multiple distinct executors. |"),(0,r.yg)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,r.yg)("h3",{id:"quitting-the-actions-framework"},"Quitting the Actions Framework"),(0,r.yg)("p",null,'Currently, when you quit the Actions framework, any in-flight ingestion processing will continue to execute as a subprocess on your system. This means that there may be "orphaned" processes which\nare never marked as "Succeeded" or "Failed" in the UI, even though they may have completed. '),(0,r.yg)("p",null,'To address this, simply "Cancel" the ingestion source on the UI once you\'ve restarted the Ingestion Executor action.'))}y.isMDXComponent=!0}}]);