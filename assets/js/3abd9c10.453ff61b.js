"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[59430],{15680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>d});var a=n(96540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),f=r,d=u["".concat(l,".").concat(f)]||u[f]||m[f]||o;return n?a.createElement(d,i(i({ref:t},p),{},{components:n})):a.createElement(d,i({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=f;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},40520:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>d,frontMatter:()=>s,metadata:()=>c,toc:()=>u});n(96540);var a=n(15680);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}const s={title:"Working With Platform Instances",slug:"/platform-instances",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/platform-instances.md"},l="Working With Platform Instances",c={unversionedId:"docs/platform-instances",id:"version-0.14.1/docs/platform-instances",title:"Working With Platform Instances",description:"DataHub's metadata model for Datasets supports a three-part key currently:",source:"@site/versioned_docs/version-0.14.1/docs/platform-instances.md",sourceDirName:"docs",slug:"/platform-instances",permalink:"/docs/0.14.1/platform-instances",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/platform-instances.md",tags:[],version:"0.14.1",frontMatter:{title:"Working With Platform Instances",slug:"/platform-instances",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/platform-instances.md"},sidebar:"overviewSidebar",previous:{title:"Using Kubernetes",permalink:"/docs/0.14.1/metadata-ingestion/schedule_docs/kubernetes"},next:{title:"Stateful Ingestion",permalink:"/docs/0.14.1/metadata-ingestion/docs/dev_guides/stateful"}},p={},u=[{value:"Naming Platform Instances",id:"naming-platform-instances",level:2},{value:"Enabling Platform Instances",id:"enabling-platform-instances",level:2}],m={toc:u},f="wrapper";function d(e){var{components:t}=e,n=i(e,["components"]);return(0,a.yg)(f,o(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){r(e,t,n[t])}))}return e}({},m,n),{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"working-with-platform-instances"},"Working With Platform Instances"),(0,a.yg)("p",null,"DataHub's metadata model for Datasets supports a three-part key currently: "),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Data Platform (e.g. urn:li:dataPlatform:mysql)"),(0,a.yg)("li",{parentName:"ul"},"Name (e.g. db.schema.name)"),(0,a.yg)("li",{parentName:"ul"},"Env or Fabric (e.g. DEV, PROD, etc.)")),(0,a.yg)("p",null,"This naming scheme unfortunately does not allow for easy representation of the multiplicity of platforms (or technologies) that might be deployed at an organization within the same environment or fabric. For example, an organization might have multiple Redshift instances in Production and would want to see all the data assets located in those instances inside the DataHub metadata repository. "),(0,a.yg)("p",null,"As part of the ",(0,a.yg)("inlineCode",{parentName:"p"},"v0.8.24+")," releases, we are unlocking the first phase of supporting Platform Instances in the metadata model. This is done via two main additions:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"The ",(0,a.yg)("inlineCode",{parentName:"li"},"dataPlatformInstance")," aspect that has been added to Datasets which allows datasets to be associated to an instance of a platform"),(0,a.yg)("li",{parentName:"ul"},"Enhancements to all ingestion sources that allow them to attach a platform instance to the recipe that changes the generated urns to go from ",(0,a.yg)("inlineCode",{parentName:"li"},"urn:li:dataset:(urn:li:dataPlatform:<platform>,<name>,ENV)")," format to ",(0,a.yg)("inlineCode",{parentName:"li"},"urn:li:dataset:(urn:li:dataPlatform:<platform>,<instance.name>,ENV)")," format. Sources that produce lineage to datasets in other platforms (e.g. Looker, Superset etc) also have specific configuration additions that allow the recipe author to specify the mapping between a platform and the instance name that it should be mapped to. ")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/platform-instances-for-ingestion.png"})),(0,a.yg)("h2",{id:"naming-platform-instances"},"Naming Platform Instances"),(0,a.yg)("p",null,"When configuring a platform instance, choose an instance name that is understandable and will be stable for the foreseeable future. e.g. ",(0,a.yg)("inlineCode",{parentName:"p"},"core_warehouse")," or ",(0,a.yg)("inlineCode",{parentName:"p"},"finance_redshift")," are allowed names, as are pure guids like ",(0,a.yg)("inlineCode",{parentName:"p"},"a37dc708-c512-4fe4-9829-401cd60ed789"),". Remember that whatever instance name you choose, you will need to specify it in more than one recipe to ensure that the identifiers produced by different sources will line up."),(0,a.yg)("h2",{id:"enabling-platform-instances"},"Enabling Platform Instances"),(0,a.yg)("p",null,"Read the Ingestion source specific guides for how to enable platform instances in each of them.\nThe general pattern is to add an additional optional configuration parameter called ",(0,a.yg)("inlineCode",{parentName:"p"},"platform_instance"),". "),(0,a.yg)("p",null,"e.g. here is how you would configure a recipe to ingest a mysql instance that you want to call ",(0,a.yg)("inlineCode",{parentName:"p"},"core_finance")),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yaml"},"source:\n  type: mysql\n  config:\n    # Coordinates\n    host_port: localhost:3306\n    platform_instance: core_finance\n    database: dbname\n    \n    # Credentials\n    username: root\n    password: example\n\nsink:\n  # sink configs\n")),(0,a.yg)("h2",{id:""}))}d.isMDXComponent=!0}}]);