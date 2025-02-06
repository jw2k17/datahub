"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[29217],{15680:(e,t,n)=>{n.d(t,{xA:()=>c,yg:()=>y});var a=n(96540);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var u=a.createContext({}),l=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=l(e.components);return a.createElement(u.Provider,{value:t},e.children)},g="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),g=l(n),m=i,y=g["".concat(u,".").concat(m)]||g[m]||p[m]||r;return n?a.createElement(y,o(o({ref:t},c),{},{components:n})):a.createElement(y,o({ref:t},c))}));function y(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=m;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s[g]="string"==typeof e?e:i,o[1]=s;for(var l=2;l<r;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},98180:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>u,default:()=>y,frontMatter:()=>s,metadata:()=>l,toc:()=>g});n(96540);var a=n(15680);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function o(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}const s={title:"Configuration",sidebar_label:"Configuration",slug:"/quick-ingestion-guides/tableau/configuration",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/quick-ingestion-guides/tableau/configuration.md"},u="Configuring Your Tableau Connector to DataHub",l={unversionedId:"docs/quick-ingestion-guides/tableau/configuration",id:"version-0.14.1/docs/quick-ingestion-guides/tableau/configuration",title:"Configuration",description:"Now that you have created a DataHub-specific user with the relevant access in Tableau in the prior step, it's now time to set up a connection via the DataHub UI.",source:"@site/versioned_docs/version-0.14.1/docs/quick-ingestion-guides/tableau/configuration.md",sourceDirName:"docs/quick-ingestion-guides/tableau",slug:"/quick-ingestion-guides/tableau/configuration",permalink:"/docs/0.14.1/quick-ingestion-guides/tableau/configuration",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/quick-ingestion-guides/tableau/configuration.md",tags:[],version:"0.14.1",frontMatter:{title:"Configuration",sidebar_label:"Configuration",slug:"/quick-ingestion-guides/tableau/configuration",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/quick-ingestion-guides/tableau/configuration.md"},sidebar:"overviewSidebar",previous:{title:"Setup",permalink:"/docs/0.14.1/quick-ingestion-guides/tableau/setup"},next:{title:"Overview",permalink:"/docs/0.14.1/quick-ingestion-guides/powerbi/overview"}},c={},g=[{value:"Configure Secrets",id:"configure-secrets",level:2},{value:"Configure Recipe",id:"configure-recipe",level:2},{value:"Schedule Execution",id:"schedule-execution",level:2},{value:"Finish Up",id:"finish-up",level:2},{value:"Validate Ingestion Runs",id:"validate-ingestion-runs",level:2}],p={toc:g},m="wrapper";function y(e){var{components:t}=e,n=o(e,["components"]);return(0,a.yg)(m,r(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){i(e,t,n[t])}))}return e}({},p,n),{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"configuring-your-tableau-connector-to-datahub"},"Configuring Your Tableau Connector to DataHub"),(0,a.yg)("p",null,"Now that you have created a DataHub-specific user with the relevant access in Tableau in ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.14.1/quick-ingestion-guides/tableau/setup"},"the prior step"),", it's now time to set up a connection via the DataHub UI."),(0,a.yg)("h2",{id:"configure-secrets"},"Configure Secrets"),(0,a.yg)("ol",null,(0,a.yg)("li",{parentName:"ol"},"Within DataHub, navigate to the ",(0,a.yg)("strong",{parentName:"li"},"Ingestion")," tab in the top, right corner of your screen")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:'Navigate to the "Ingestion Tab"',src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/common/common_ingestion_ingestion_button.png"})),(0,a.yg)("admonition",{type:"note"},(0,a.yg)("p",{parentName:"admonition"},"If you do not see the Ingestion tab, please contact your DataHub admin to grant you the correct permissions")),(0,a.yg)("ol",{start:2},(0,a.yg)("li",{parentName:"ol"},"Navigate to the ",(0,a.yg)("strong",{parentName:"li"},"Secrets")," tab and click ",(0,a.yg)("strong",{parentName:"li"},"Create new secret"))),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"Secrets Tab",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/common/common_ingestion_secrets_tab.png"})),(0,a.yg)("ol",{start:3},(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},"Create a ",(0,a.yg)("inlineCode",{parentName:"p"},"username")," secret"),(0,a.yg)("p",{parentName:"li"},"This will securely store your Tableau ",(0,a.yg)("inlineCode",{parentName:"p"},"username")," within DataHub"),(0,a.yg)("ul",{parentName:"li"},(0,a.yg)("li",{parentName:"ul"},"Enter a name like ",(0,a.yg)("inlineCode",{parentName:"li"},"TABLEAU_USERNAME")," - we will use this later to refer in recipe"),(0,a.yg)("li",{parentName:"ul"},"Enter the ",(0,a.yg)("inlineCode",{parentName:"li"},"username"),", setup in the ",(0,a.yg)("a",{parentName:"li",href:"/docs/0.14.1/quick-ingestion-guides/tableau/setup"},"setup guide")),(0,a.yg)("li",{parentName:"ul"},"Optionally add a description"),(0,a.yg)("li",{parentName:"ul"},"Click ",(0,a.yg)("strong",{parentName:"li"},"Create"))),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",alt:"Tableau Username Secret",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-username-secret.png"}))),(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},"Create a ",(0,a.yg)("inlineCode",{parentName:"p"},"password")," secret"),(0,a.yg)("p",{parentName:"li"},"This will securely store your Tableau ",(0,a.yg)("inlineCode",{parentName:"p"},"password")," within DataHub"),(0,a.yg)("ul",{parentName:"li"},(0,a.yg)("li",{parentName:"ul"},"Enter a name like ",(0,a.yg)("inlineCode",{parentName:"li"},"TABLEAU_PASSWORD")," - we will use this later to refer in recipe"),(0,a.yg)("li",{parentName:"ul"},"Enter the ",(0,a.yg)("inlineCode",{parentName:"li"},"password")," of the user, setup in the ",(0,a.yg)("a",{parentName:"li",href:"/docs/0.14.1/quick-ingestion-guides/tableau/setup"},"setup guide")),(0,a.yg)("li",{parentName:"ul"},"Optionally add a description"),(0,a.yg)("li",{parentName:"ul"},"Click ",(0,a.yg)("strong",{parentName:"li"},"Create"))),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",alt:"Tableau Password Secret",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-user-password-secret.png"})))),(0,a.yg)("h2",{id:"configure-recipe"},"Configure Recipe"),(0,a.yg)("ol",{start:5},(0,a.yg)("li",{parentName:"ol"},"Navigate to on the ",(0,a.yg)("strong",{parentName:"li"},"Sources")," tab and then ",(0,a.yg)("strong",{parentName:"li"},"Create new source"))),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:'Click "Create new source"',src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/common/common_ingestion_click_create_new_source_button.png"})),(0,a.yg)("ol",{start:6},(0,a.yg)("li",{parentName:"ol"},"Select Tableau")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",alt:"Select Tableau from the options",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-new-ingestion-source.png"})),(0,a.yg)("ol",{start:7},(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},"Fill in the Tableau Recipe form:"),(0,a.yg)("p",{parentName:"li"},"You need to set minimum following fields in the recipe:"),(0,a.yg)("p",{parentName:"li"},"a. ",(0,a.yg)("strong",{parentName:"p"},"Host URL:")," URL of your Tableau instance (e.g., ",(0,a.yg)("a",{parentName:"p",href:"https://15az.online.tableau.com/"},"https://15az.online.tableau.com/"),"). It is available in browser address bar on Tableau Portal."),(0,a.yg)("p",{parentName:"li"},"b. ",(0,a.yg)("strong",{parentName:"p"},"Username:"),' Use the TABLEAU_USERNAME secret (e.g., "${TABLEAU_USERNAME}").'),(0,a.yg)("p",{parentName:"li"},"c. ",(0,a.yg)("strong",{parentName:"p"},"Password:"),' Use the TABLEAU_PASSWORD secret (e.g., "${TABLEAU_PASSWORD}").   '),(0,a.yg)("p",{parentName:"li"},"d. ",(0,a.yg)("strong",{parentName:"p"},"Site"),": Required only if using tableau cloud/ tableau online"))),(0,a.yg)("p",null,"To filter specific project, use ",(0,a.yg)("inlineCode",{parentName:"p"},"project_pattern")," fields."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre"},'config:\n     ...\n     project_pattern:\n        allow:\n          - "SalesProject"\n')),(0,a.yg)("p",null,"Your recipe should look something like this:"),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",alt:"tableau recipe in form format",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-recipe.png"})),(0,a.yg)("p",null,"Click ",(0,a.yg)("strong",{parentName:"p"},"Next")," when you're done."),(0,a.yg)("h2",{id:"schedule-execution"},"Schedule Execution"),(0,a.yg)("p",null,"Now it's time to schedule a recurring ingestion pipeline to regularly extract metadata from your Tableau instance."),(0,a.yg)("ol",{start:8},(0,a.yg)("li",{parentName:"ol"},"Decide how regularly you want this ingestion to run-- day, month, year, hour, minute, etc. Select from the dropdown")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"schedule selector",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/common/common_ingestion_set_execution_schedule.png"})),(0,a.yg)("ol",{start:9},(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},"Ensure you've configured your correct timezone"),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"timezone_selector",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/common/common_ingestion_set_execution_timezone.png"}))),(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},"Click ",(0,a.yg)("strong",{parentName:"p"},"Next")," when you are done"))),(0,a.yg)("h2",{id:"finish-up"},"Finish Up"),(0,a.yg)("ol",{start:11},(0,a.yg)("li",{parentName:"ol"},"Name your ingestion source, then click ",(0,a.yg)("strong",{parentName:"li"},"Save and Run"),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"Name your ingestion",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-ingestion-save-and-run.png"})))),(0,a.yg)("p",null,"You will now find your new ingestion source running"),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"ingestion_running",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-ingestion-running.png"})),(0,a.yg)("h2",{id:"validate-ingestion-runs"},"Validate Ingestion Runs"),(0,a.yg)("ol",{start:12},(0,a.yg)("li",{parentName:"ol"},"View the latest status of ingestion runs on the Ingestion page")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"ingestion succeeded",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-ingestion-succeeded.png"})),(0,a.yg)("ol",{start:13},(0,a.yg)("li",{parentName:"ol"},"Click the plus sign to expand the full list of historical runs and outcomes; click ",(0,a.yg)("strong",{parentName:"li"},"Details")," to see the outcomes of a specific run")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"ingestion_details",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-ingestion-history.png"})),(0,a.yg)("ol",{start:14},(0,a.yg)("li",{parentName:"ol"},"From the Ingestion Run Details page, pick ",(0,a.yg)("strong",{parentName:"li"},"View All")," to see which entities were ingested")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"ingestion_details_view_all",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-ingestion-run-detail.png"})),(0,a.yg)("ol",{start:15},(0,a.yg)("li",{parentName:"ol"},"Pick an entity from the list to manually validate if it contains the detail you expected  ")),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"75%",alt:"ingestion_details_view_all",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/tableau/tableau-ingestion-assets.png"})),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Congratulations!")," You've successfully set up Tableau as an ingestion source for DataHub!"))}y.isMDXComponent=!0}}]);