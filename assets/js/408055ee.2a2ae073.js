"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[55471],{15680:(e,t,r)=>{r.d(t,{xA:()=>g,yg:()=>m});var o=r(96540);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=o.createContext({}),p=function(e){var t=o.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},g=function(e){var t=p(e.components);return o.createElement(l.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},y=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,g=s(e,["components","mdxType","originalType","parentName"]),u=p(r),y=n,m=u["".concat(l,".").concat(y)]||u[y]||c[y]||i;return r?o.createElement(m,a(a({ref:t},g),{},{components:r})):o.createElement(m,a({ref:t},g))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,a=new Array(i);a[0]=y;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:n,a[1]=s;for(var p=2;p<i;p++)a[p]=r[p];return o.createElement.apply(null,a)}return o.createElement.apply(null,r)}y.displayName="MDXCreateElement"},26549:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>g,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>p,toc:()=>u});r(96540);var o=r(15680);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})),e}function a(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}const s={title:"Setup",sidebar_label:"Setup",slug:"/quick-ingestion-guides/looker/setup",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/quick-ingestion-guides/looker/setup.md"},l="Looker & LookML Ingestion Guide: Setup",p={unversionedId:"docs/quick-ingestion-guides/looker/setup",id:"version-0.15.0/docs/quick-ingestion-guides/looker/setup",title:"Setup",description:"Looker Prerequisites",source:"@site/versioned_docs/version-0.15.0/docs/quick-ingestion-guides/looker/setup.md",sourceDirName:"docs/quick-ingestion-guides/looker",slug:"/quick-ingestion-guides/looker/setup",permalink:"/docs/0.15.0/quick-ingestion-guides/looker/setup",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/quick-ingestion-guides/looker/setup.md",tags:[],version:"0.15.0",frontMatter:{title:"Setup",sidebar_label:"Setup",slug:"/quick-ingestion-guides/looker/setup",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/quick-ingestion-guides/looker/setup.md"},sidebar:"overviewSidebar",previous:{title:"Overview",permalink:"/docs/0.15.0/quick-ingestion-guides/looker/overview"},next:{title:"Configuration",permalink:"/docs/0.15.0/quick-ingestion-guides/looker/configuration"}},g={},u=[{value:"Looker Prerequisites",id:"looker-prerequisites",level:2},{value:"Login To Looker Instance",id:"login-to-looker-instance",level:3},{value:"Create A New Permission Set",id:"create-a-new-permission-set",level:3},{value:"Create A Role",id:"create-a-role",level:3},{value:"Create A New User",id:"create-a-new-user",level:3},{value:"Create An API Key",id:"create-an-api-key",level:3},{value:"LookML Prerequisites",id:"lookml-prerequisites",level:2},{value:"Generate a private-public SSH key pair",id:"generate-a-private-public-ssh-key-pair",level:3},{value:"Add Deploy Key to GitHub Repository",id:"add-deploy-key-to-github-repository",level:3},{value:"Next Steps",id:"next-steps",level:2}],c={toc:u},y="wrapper";function m(e){var{components:t}=e,r=a(e,["components"]);return(0,o.yg)(y,i(function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},o=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),o.forEach((function(t){n(e,t,r[t])}))}return e}({},c,r),{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"looker--lookml-ingestion-guide-setup"},"Looker & LookML Ingestion Guide: Setup"),(0,o.yg)("h2",{id:"looker-prerequisites"},"Looker Prerequisites"),(0,o.yg)("p",null,"To configure ingestion from Looker, you'll first have to ensure you have an API key to access the Looker resources."),(0,o.yg)("h3",{id:"login-to-looker-instance"},"Login To Looker Instance"),(0,o.yg)("p",null,"Login to your Looker instance(e.g. ",(0,o.yg)("inlineCode",{parentName:"p"},"https://<your-looker-instance-name>.cloud.looker.com"),")."),(0,o.yg)("p",null,"Navigate to ",(0,o.yg)("strong",{parentName:"p"},"Admin Panel")," & click ",(0,o.yg)("strong",{parentName:"p"},"Roles")," to open Roles Panel."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker home page",src:"http://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-home-page.png"})),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"30%",alt:"Looker roles search",src:"http://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-roles-search.png"})),(0,o.yg)("h3",{id:"create-a-new-permission-set"},"Create A New Permission Set"),(0,o.yg)("p",null,"On ",(0,o.yg)("strong",{parentName:"p"},"Roles Panel"),", click ",(0,o.yg)("strong",{parentName:"p"},"New Permission Set"),"."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker new permission set",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-new-permission-set-button.png"})),(0,o.yg)("p",null,"Set a name for the new permission set (e.g., ",(0,o.yg)("em",{parentName:"p"},"DataHub Connector Permission Set"),") and select the following permissions."),(0,o.yg)("details",null,(0,o.yg)("summary",null,"Permission List"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"access_data"),(0,o.yg)("li",{parentName:"ul"},"see_lookml_dashboards"),(0,o.yg)("li",{parentName:"ul"},"see_looks"),(0,o.yg)("li",{parentName:"ul"},"see_user_dashboards"),(0,o.yg)("li",{parentName:"ul"},"explore"),(0,o.yg)("li",{parentName:"ul"},"see_sql"),(0,o.yg)("li",{parentName:"ul"},"see_lookml"),(0,o.yg)("li",{parentName:"ul"},"clear_cache_refresh"),(0,o.yg)("li",{parentName:"ul"},"manage_models"),(0,o.yg)("li",{parentName:"ul"},"see_datagroups"),(0,o.yg)("li",{parentName:"ul"},"see_pdts"),(0,o.yg)("li",{parentName:"ul"},"see_queries"),(0,o.yg)("li",{parentName:"ul"},"see_schedules"),(0,o.yg)("li",{parentName:"ul"},"see_system_activity"),(0,o.yg)("li",{parentName:"ul"},"see_users"))),(0,o.yg)("p",null,"After selecting all permissions mentioned above, click ",(0,o.yg)("strong",{parentName:"p"},"New Permission Set")," at the bottom of the page."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker permission set window",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-permission-set-window.png"})),(0,o.yg)("h3",{id:"create-a-role"},"Create A Role"),(0,o.yg)("p",null,"On the ",(0,o.yg)("strong",{parentName:"p"},"Roles")," Panel, click ",(0,o.yg)("strong",{parentName:"p"},"New Role"),"."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker new role button",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-new-role-button.png"})),(0,o.yg)("p",null,"Set the name for the new role (e.g., ",(0,o.yg)("em",{parentName:"p"},"DataHub Extractor"),") and set the following fields on this window. "),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"Set ",(0,o.yg)("strong",{parentName:"li"},"Permission Set")," to permission set created in previous step (i.e ",(0,o.yg)("em",{parentName:"li"},"DataHub Connector Permission Set"),")"),(0,o.yg)("li",{parentName:"ul"},"Set ",(0,o.yg)("strong",{parentName:"li"},"Model Set")," to ",(0,o.yg)("inlineCode",{parentName:"li"},"All"))),(0,o.yg)("p",null,"Finally, click ",(0,o.yg)("strong",{parentName:"p"},"New Role")," at the bottom of the page. "),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker new role window",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-new-role-window.png"})),(0,o.yg)("h3",{id:"create-a-new-user"},"Create A New User"),(0,o.yg)("p",null,"On the ",(0,o.yg)("strong",{parentName:"p"},"Admin")," Panel, click ",(0,o.yg)("strong",{parentName:"p"},"Users")," to open the users panel."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker user search",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-user-search.png"})),(0,o.yg)("p",null,"Click ",(0,o.yg)("strong",{parentName:"p"},"Add Users"),". "),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker add user",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-add-user-button.png"})),(0,o.yg)("p",null,"On ",(0,o.yg)("strong",{parentName:"p"},"Adding a new user"),", set details in the following fields. "),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"Add user's ",(0,o.yg)("strong",{parentName:"li"},"Email Addresses"),"."),(0,o.yg)("li",{parentName:"ul"},"Set ",(0,o.yg)("strong",{parentName:"li"},"Roles")," to the role created in previous step (e.g. ",(0,o.yg)("em",{parentName:"li"},"DataHub Extractor"),") ")),(0,o.yg)("p",null,"Finally, click ",(0,o.yg)("strong",{parentName:"p"},"Save"),"."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker new user window",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-add-new-user.png"})),(0,o.yg)("h3",{id:"create-an-api-key"},"Create An API Key"),(0,o.yg)("p",null,"On the ",(0,o.yg)("strong",{parentName:"p"},"User")," Panel, click on the newly created user. "),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker user panel",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-user-panel.png"})),(0,o.yg)("p",null,"Click ",(0,o.yg)("strong",{parentName:"p"},"Edit Keys")," to open the ",(0,o.yg)("strong",{parentName:"p"},"API Key")," Panel. "),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker user view",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-user-view.png"})),(0,o.yg)("p",null,"On the ",(0,o.yg)("strong",{parentName:"p"},"API Key")," Panel, click ",(0,o.yg)("strong",{parentName:"p"},"New API Key")," to generate a new ",(0,o.yg)("strong",{parentName:"p"},"Client ID")," and ",(0,o.yg)("strong",{parentName:"p"},"Client Secret"),"."),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker new api key",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/looker-api-key.png"})),(0,o.yg)("h2",{id:"lookml-prerequisites"},"LookML Prerequisites"),(0,o.yg)("p",null,"Follow the below steps to create the GitHub Deploy Key."),(0,o.yg)("h3",{id:"generate-a-private-public-ssh-key-pair"},"Generate a private-public SSH key pair"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-bash"},"ssh-keygen -t rsa -f looker_datahub_deploy_key\n# If prompted, don't add a passphrase to the key\n")),(0,o.yg)("p",null,"This will typically generate two files like the one below."),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("inlineCode",{parentName:"li"},"looker_datahub_deploy_key")," (private key)"),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("inlineCode",{parentName:"li"},"looker_datahub_deploy_key.pub")," (public key)")),(0,o.yg)("h3",{id:"add-deploy-key-to-github-repository"},"Add Deploy Key to GitHub Repository"),(0,o.yg)("p",null,"First, log in to ",(0,o.yg)("a",{parentName:"p",href:"https://github.com"},"GitHub"),". "),(0,o.yg)("p",null,"Navigate to ",(0,o.yg)("strong",{parentName:"p"},"GitHub Repository")," -> ",(0,o.yg)("strong",{parentName:"p"},"Settings")," -> ",(0,o.yg)("strong",{parentName:"p"},"Deploy Keys")," and add a public key (e.g. ",(0,o.yg)("inlineCode",{parentName:"p"},"looker_datahub_deploy_key.pub"),") as deploy key with read access. "),(0,o.yg)("p",{align:"center"},(0,o.yg)("img",{width:"75%",alt:"Looker home page",src:"http://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/guides/looker/lookml-deploy-key.png"})),(0,o.yg)("p",null,"Make a note of the private key file. You must paste the file's contents into the GitHub Deploy Key field later while ",(0,o.yg)("a",{parentName:"p",href:"/docs/0.15.0/quick-ingestion-guides/looker/configuration"},"configuring")," ingestion on the DataHub Portal."),(0,o.yg)("h2",{id:"next-steps"},"Next Steps"),(0,o.yg)("p",null,"Once you've done all the above steps, it's time to move on to ",(0,o.yg)("a",{parentName:"p",href:"/docs/0.15.0/quick-ingestion-guides/looker/configuration"},"configuring the actual ingestion source")," within DataHub."))}m.isMDXComponent=!0}}]);