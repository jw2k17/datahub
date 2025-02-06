"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[84294],{15680:(e,t,a)=>{a.d(t,{xA:()=>u,yg:()=>g});var r=a(96540);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),p=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(a),h=n,g=c["".concat(l,".").concat(h)]||c[h]||d[h]||o;return a?r.createElement(g,i(i({ref:t},u),{},{components:a})):r.createElement(g,i({ref:t},u))}));function g(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:n,i[1]=s;for(var p=2;p<o;p++)i[p]=a[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}h.displayName="MDXCreateElement"},56959:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>g,frontMatter:()=>s,metadata:()=>p,toc:()=>c});a(96540);var r=a(15680);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})),e}function i(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}const s={title:"Browse Paths Upgrade (August 2022)",slug:"/advanced/browse-paths-upgrade",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/advanced/browse-paths-upgrade.md"},l="Browse Paths Upgrade (August 2022)",p={unversionedId:"docs/advanced/browse-paths-upgrade",id:"docs/advanced/browse-paths-upgrade",title:"Browse Paths Upgrade (August 2022)",description:"Background",source:"@site/genDocs/docs/advanced/browse-paths-upgrade.md",sourceDirName:"docs/advanced",slug:"/advanced/browse-paths-upgrade",permalink:"/docs/advanced/browse-paths-upgrade",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/advanced/browse-paths-upgrade.md",tags:[],version:"current",frontMatter:{title:"Browse Paths Upgrade (August 2022)",slug:"/advanced/browse-paths-upgrade",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/advanced/browse-paths-upgrade.md"},sidebar:"overviewSidebar",previous:{title:"Adding a custom Dataset Data Platform",permalink:"/docs/how/add-custom-data-platform"},next:{title:"Generating Browse Paths (V2)",permalink:"/docs/browsev2/browse-paths-v2"}},u={},c=[{value:"Background",id:"background",level:2},{value:"What this means for you",id:"what-this-means-for-you",level:2},{value:"1. Migrating default browse paths to the new format",id:"1-migrating-default-browse-paths-to-the-new-format",level:3},{value:"2. Upgrading the <code>datahub</code> CLI to push new browse paths",id:"2-upgrading-the-datahub-cli-to-push-new-browse-paths",level:3},{value:"If you are producing custom Browse Paths",id:"if-you-are-producing-custom-browse-paths",level:3},{value:"Support",id:"support",level:2}],d={toc:c},h="wrapper";function g(e){var{components:t}=e,a=i(e,["components"]);return(0,r.yg)(h,o(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},r=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),r.forEach((function(t){n(e,t,a[t])}))}return e}({},d,a),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"browse-paths-upgrade-august-2022"},"Browse Paths Upgrade (August 2022)"),(0,r.yg)("h2",{id:"background"},"Background"),(0,r.yg)("p",null,'Up to this point, there\'s been a historical constraint on all entity browse paths. Namely, each browse path has been\nrequired to end with a path component that represents "simple name" for an entity. For example, a Browse Path for a\nSnowflake Table called "test_table" may look something like this:'),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"/prod/snowflake/warehouse1/db1/test_table\n")),(0,r.yg)("p",null,"In the UI, we artificially truncate the final path component when you are browsing the Entity hierarchy, so your browse experience\nwould be: "),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"prod")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"snowflake")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"warehouse1"),"> ",(0,r.yg)("inlineCode",{parentName:"p"},"db1")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"Click Entity")),(0,r.yg)("p",null,"As you can see, the final path component ",(0,r.yg)("inlineCode",{parentName:"p"},"test_table")," is effectively ignored. It could have any value, and we would still ignore\nit in the UI. This behavior serves as a workaround to the historical requirement that all browse paths end with a simple name. "),(0,r.yg)("p",null,'This data constraint stands in opposition the original intention of Browse Paths: to provide a simple mechanism for organizing\nassets into a hierarchical folder structure. For this reason, we\'ve changed the semantics of Browse Paths to better align with the original intention.\nGoing forward, you will not be required to provide a final component detailing the "name". Instead, you will be able to provide a simpler path that\nomits this final component:'),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"/prod/snowflake/warehouse1/db1\n")),(0,r.yg)("p",null,"and the browse experience from the UI will continue to work as you would expect: "),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"prod")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"snowflake")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"warehouse1"),"> ",(0,r.yg)("inlineCode",{parentName:"p"},"db1")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"Click Entity"),". "),(0,r.yg)("p",null,"With this change comes a fix to a longstanding bug where multiple browse paths could not be attached to a single URN. Going forward,\nwe will support producing multiple browse paths for the same entity, and allow you to traverse via multiple paths. For example"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-python"},'browse_path = BrowsePathsClass(\n    paths=["/powerbi/my/custom/path", "/my/other/custom/path"]\n)\nreturn MetadataChangeProposalWrapper(\n    entityType="dataset",\n    changeType="UPSERT",\n    entityUrn="urn:li:dataset:(urn:li:dataPlatform:custom,MyFileName,PROD),\n    aspectName="browsePaths",\n    aspect=browse_path,\n)\n')),(0,r.yg)("p",null,(0,r.yg)("em",{parentName:"p"},"Using the Python Emitter SDK to produce multiple Browse Paths for the same entity")),(0,r.yg)("p",null,"We've received multiple bug reports, such as ",(0,r.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/issues/5525"},"this issue"),", and requests to address these issues with Browse, and thus are deciding\nto do it now before more workarounds are created.  "),(0,r.yg)("h2",{id:"what-this-means-for-you"},"What this means for you"),(0,r.yg)("p",null,"Once you upgrade to DataHub ",(0,r.yg)("inlineCode",{parentName:"p"},"v0.8.45")," you will immediately notice that traversing your Browse Path hierarchy will require\none extra click to find the entity. This is because we are correctly displaying the FULL browse path, including the simple name mentioned above."),(0,r.yg)("p",null,"There will be 2 ways to upgrade to the new browse path format. Depending on your ingestion sources, you may want to use one or both:"),(0,r.yg)("ol",null,(0,r.yg)("li",{parentName:"ol"},"Migrate default browse paths to the new format by restarting DataHub"),(0,r.yg)("li",{parentName:"ol"},"Upgrade your version of the ",(0,r.yg)("inlineCode",{parentName:"li"},"datahub")," CLI to push new browse path format (version ",(0,r.yg)("inlineCode",{parentName:"li"},"v0.8.45"),")")),(0,r.yg)("p",null,"Each step will be discussed in detail below. "),(0,r.yg)("h3",{id:"1-migrating-default-browse-paths-to-the-new-format"},"1. Migrating default browse paths to the new format"),(0,r.yg)("p",null,"To migrate those Browse Paths that are generated by DataHub by default (when no path is provided), simply restart the ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub-gms")," container / pod with a single\nadditional environment variable:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"UPGRADE_DEFAULT_BROWSE_PATHS_ENABLED=true\n")),(0,r.yg)("p",null,"And restart the ",(0,r.yg)("inlineCode",{parentName:"p"},"datahub-gms")," instance. This will cause GMS to perform a boot-time migration of all your existing Browse Paths\nto the new format, removing the unnecessarily name component at the very end."),(0,r.yg)("p",null,"If the migration is successful, you'll see the following in your GMS logs: "),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"18:58:17.414 [main] INFO c.l.m.b.s.UpgradeDefaultBrowsePathsStep:60 - Successfully upgraded all browse paths!\n")),(0,r.yg)("p",null,"After this one-time migration is complete, you should be able to navigate the Browse hierarchy exactly as you did previously. "),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Note that certain ingestion sources actively produce their own Browse Paths, which overrides the default path\ncomputed by DataHub. "),(0,r.yg)("p",{parentName:"blockquote"},"In these cases, getting the updated Browse Path will require re-running your ingestion process with the updated\nversion of the connector. This is discussed in more detail in the next section. ")),(0,r.yg)("h3",{id:"2-upgrading-the-datahub-cli-to-push-new-browse-paths"},"2. Upgrading the ",(0,r.yg)("inlineCode",{parentName:"h3"},"datahub")," CLI to push new browse paths"),(0,r.yg)("p",null,"If you are actively ingesting metadata from one or more of following sources"),(0,r.yg)("ol",null,(0,r.yg)("li",{parentName:"ol"},"Sagemaker"),(0,r.yg)("li",{parentName:"ol"},"Looker / LookML"),(0,r.yg)("li",{parentName:"ol"},"Feast"),(0,r.yg)("li",{parentName:"ol"},"Kafka"),(0,r.yg)("li",{parentName:"ol"},"Mode"),(0,r.yg)("li",{parentName:"ol"},"PowerBi"),(0,r.yg)("li",{parentName:"ol"},"Pulsar"),(0,r.yg)("li",{parentName:"ol"},"Tableau"),(0,r.yg)("li",{parentName:"ol"},"Business Glossary")),(0,r.yg)("p",null,"You will need to upgrade the DataHub CLI to >= ",(0,r.yg)("inlineCode",{parentName:"p"},"v0.8.45")," and re-run metadata ingestion. This will generate the new browse path format\nand overwrite the existing paths for entities that were extracted from these sources. "),(0,r.yg)("h3",{id:"if-you-are-producing-custom-browse-paths"},"If you are producing custom Browse Paths"),(0,r.yg)("p",null,"If you've decided to produce your own custom Browse Paths to organize your assets (e.g. via the Python Emitter SDK), you'll want to change the code to produce those paths\nto truncate the final path component. For example, if you were previously emitting a browse path like this:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'"my/custom/browse/path/suffix"\n')),(0,r.yg)("p",null,'You can simply remove the final "suffix" piece:'),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'"my/custom/browse/path"\n')),(0,r.yg)("p",null,"Your users will be able to find the entity by traversing through these folders in the UI:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"my")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"custom")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"browse"),"> ",(0,r.yg)("inlineCode",{parentName:"p"},"path")," > ",(0,r.yg)("inlineCode",{parentName:"p"},"Click Entity"),"."),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Note that if you are using the Browse Path Transformer you ",(0,r.yg)("em",{parentName:"p"},"will")," be impacted in the same way. It is recommended that you revisit the\npaths that you are producing, and update them to the new format. ")),(0,r.yg)("h2",{id:"support"},"Support"),(0,r.yg)("p",null,"The Acryl team will be on standby to assist you in your migration. Please\njoin ",(0,r.yg)("a",{parentName:"p",href:"https://datahubspace.slack.com/archives/C0244FHMHJQ"},"#release-0_8_0")," channel and reach out to us if you find\ntrouble with the upgrade or have feedback on the process. We will work closely to make sure you can continue to operate\nDataHub smoothly."))}g.isMDXComponent=!0}}]);