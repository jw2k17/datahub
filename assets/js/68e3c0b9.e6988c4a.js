"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[45383],{66593:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>g,contentTitle:()=>u,default:()=>f,frontMatter:()=>p,metadata:()=>c,toc:()=>d});n(96540);var a=n(15680),i=n(53720),o=n(5400);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}const p={title:"Recipes",slug:"/metadata-ingestion/recipe_overview",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/recipe_overview.md"},u="Recipes",c={unversionedId:"metadata-ingestion/recipe_overview",id:"version-0.15.0/metadata-ingestion/recipe_overview",title:"Recipes",description:"A recipe is the main configuration file for metadata ingestion. It tells our ingestion scripts where to pull data from (source) and where to put it (sink).",source:"@site/versioned_docs/version-0.15.0/metadata-ingestion/recipe_overview.md",sourceDirName:"metadata-ingestion",slug:"/metadata-ingestion/recipe_overview",permalink:"/docs/0.15.0/metadata-ingestion/recipe_overview",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/recipe_overview.md",tags:[],version:"0.15.0",frontMatter:{title:"Recipes",slug:"/metadata-ingestion/recipe_overview",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/recipe_overview.md"},sidebar:"overviewSidebar",previous:{title:"Introduction to Metadata Ingestion",permalink:"/docs/0.15.0/metadata-ingestion"},next:{title:"Sinks",permalink:"/docs/0.15.0/metadata-ingestion/sink_overview"}},g={},d=[{value:"Configuring Recipe",id:"configuring-recipe",level:2},{value:"Running a Recipe",id:"running-a-recipe",level:2},{value:"Advanced Configuration",id:"advanced-configuration",level:2},{value:"Handling Sensitive Information in Recipes",id:"handling-sensitive-information-in-recipes",level:3},{value:"Loading Sensitive Data as Files in Recipes",id:"loading-sensitive-data-as-files-in-recipes",level:3},{value:"Transformations",id:"transformations",level:3},{value:"Autocomplete and Syntax Validation",id:"autocomplete-and-syntax-validation",level:3}],m={toc:d},y="wrapper";function f(e){var{components:t}=e,n=l(e,["components"]);return(0,a.yg)(y,s(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){r(e,t,n[t])}))}return e}({},m,n),{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"recipes"},"Recipes"),(0,a.yg)("p",null,"A recipe is the main configuration file for metadata ingestion. It tells our ingestion scripts where to pull data from (source) and where to put it (sink)."),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/sources-sinks.png"})),(0,a.yg)("h2",{id:"configuring-recipe"},"Configuring Recipe"),(0,a.yg)("p",null,"The basic form of the recipe file consists of:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("inlineCode",{parentName:"li"},"source"),", which contains the configuration of the data source. (See ",(0,a.yg)("a",{parentName:"li",href:"/docs/0.15.0/metadata-ingestion/source_overview"},"Sources"),")"),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("inlineCode",{parentName:"li"},"sink"),", which defines the destination of the metadata (See ",(0,a.yg)("a",{parentName:"li",href:"/docs/0.15.0/metadata-ingestion/sink_overview"},"Sinks"),")")),(0,a.yg)("p",null,"Here's a simple recipe that pulls metadata from MSSQL (source) and puts it into the default sink (datahub rest)."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yaml"},'# The simplest recipe that pulls metadata from MSSQL and puts it into DataHub\n# using the Rest API.\nsource:\n  type: mssql\n  config:\n    username: sa\n    password: ${MSSQL_PASSWORD}\n    database: DemoData\n# sink section omitted as we want to use the default datahub-rest sink\nsink:\n  type: "datahub-rest"\n  config:\n    server: "http://localhost:8080"\n')),(0,a.yg)("p",null,"A number of recipes are included in the ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/examples/recipes"},"examples/recipes")," directory. For full info and context on each source and sink, see the pages described in the ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.15.0/cli#installing-plugins"},"table of plugins"),"."),(0,a.yg)("admonition",{title:"One Source/Sink for One Recipe!",type:"note"},(0,a.yg)("p",{parentName:"admonition"},"Note that one recipe file can only have 1 source and 1 sink. If you want multiple sources then you will need multiple recipe files.")),(0,a.yg)("h2",{id:"running-a-recipe"},"Running a Recipe"),(0,a.yg)("p",null,"DataHub supports running recipes via the CLI or UI."),(0,a.yg)(i.A,{mdxType:"Tabs"},(0,a.yg)(o.A,{value:"cli",label:"CLI",default:!0,mdxType:"TabItem"},(0,a.yg)("p",null,"Install CLI and the plugin for the ingestion."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-shell"},"python3 -m pip install --upgrade acryl-datahub\npip install 'acryl-datahub[datahub-rest]'\n")),(0,a.yg)("p",null,"Running this recipe is as simple as:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-shell"},"datahub ingest -c recipe.dhub.yaml\n")),(0,a.yg)("p",null,"For a detailed guide on running recipes via CLI, please refer to ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.15.0/metadata-ingestion/cli-ingestion"},"CLI Ingestion Guide"),".")),(0,a.yg)(o.A,{value:"ui",label:"UI",mdxType:"TabItem"},(0,a.yg)("p",null,"You can configure and run the recipe in ",(0,a.yg)("strong",{parentName:"p"},"Ingestion")," tab in DataHub. "),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/ingestion-tab.png"})),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Make sure you have the ",(0,a.yg)("strong",{parentName:"li"},"Manage Metadata Ingestion & Manage Secret")," privileges."),(0,a.yg)("li",{parentName:"ul"},"Navigate to ",(0,a.yg)("strong",{parentName:"li"},"Ingestion")," tab in DataHub."),(0,a.yg)("li",{parentName:"ul"},"Create an ingestion source & configure the recipe via UI."),(0,a.yg)("li",{parentName:"ul"},"Hit ",(0,a.yg)("strong",{parentName:"li"},"Execute"),".")),(0,a.yg)("p",null,"For a detailed guide on running recipes via UI, please refer to ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.15.0/ui-ingestion"},"UI Ingestion Guide"),"."))),(0,a.yg)("h2",{id:"advanced-configuration"},"Advanced Configuration"),(0,a.yg)("h3",{id:"handling-sensitive-information-in-recipes"},"Handling Sensitive Information in Recipes"),(0,a.yg)("p",null,"We automatically expand environment variables in the config (e.g. ",(0,a.yg)("inlineCode",{parentName:"p"},"${MSSQL_PASSWORD}"),"),\nsimilar to variable substitution in GNU bash or in docker-compose files.\nFor details, see ",(0,a.yg)("a",{parentName:"p",href:"https://docs.docker.com/compose/compose-file/compose-file-v2/#variable-substitution"},"variable-substitution"),".\nThis environment variable substitution should be used to mask sensitive information in recipe files. As long as you can get env variables securely to the ingestion process there would not be any need to store sensitive information in recipes."),(0,a.yg)("h3",{id:"loading-sensitive-data-as-files-in-recipes"},"Loading Sensitive Data as Files in Recipes"),(0,a.yg)("p",null,"Some sources (e.g. kafka, bigquery, mysql) require paths to files on a local file system. This doesn't work for UI ingestion, where the recipe needs to be totally self-sufficient. To add files to ingestion processes as part of the necessary configuration, DataHub offers a directive ",(0,a.yg)("inlineCode",{parentName:"p"},"__DATAHUB_TO_FILE_")," which allows recipes to set the contents of files."),(0,a.yg)("p",null,"The syntax for this directive is: ",(0,a.yg)("inlineCode",{parentName:"p"},"__DATAHUB_TO_FILE_<property>: <value>")," which will get turned into ",(0,a.yg)("inlineCode",{parentName:"p"},"<property>: <path to file containing value>"),". Note that value can be specified inline or using an env var/secret."),(0,a.yg)("p",null,"I.e:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yaml"},"source:\n  type: mysql\n  config:\n    # Coordinates\n    host_port: localhost:3306\n    database: dbname\n\n    # Credentials\n    username: root\n    password: example\n    # If you need to use SSL with MySQL:\n    options:\n      connect_args:\n        __DATAHUB_TO_FILE_ssl_key: '${secret}' # use this for secrets that you need to mount to a file\n        # this will get converted into\n        # ssl_key: /tmp/path/to/file # where file contains the contents of ${secret}\n   ...\n")),(0,a.yg)("h3",{id:"transformations"},"Transformations"),(0,a.yg)("p",null,"If you'd like to modify data before it reaches the ingestion sinks \u2013 for instance, adding additional owners or tags \u2013 you can use a transformer to write your own module and integrate it with DataHub. Transformers require extending the recipe with a new section to describe the transformers that you want to run."),(0,a.yg)("p",null,'For example, a pipeline that ingests metadata from MSSQL and applies a default "important" tag to all datasets is described below:'),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yaml"},'# A recipe to ingest metadata from MSSQL and apply default tags to all tables\nsource:\n  type: mssql\n  config:\n    username: sa\n    password: ${MSSQL_PASSWORD}\n    database: DemoData\n\ntransformers: # an array of transformers applied sequentially\n  - type: simple_add_dataset_tags\n    config:\n      tag_urns:\n        - "urn:li:tag:Important"\n# default sink, no config needed\n')),(0,a.yg)("p",null,"Check out the ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.15.0/metadata-ingestion/docs/transformer/intro"},"transformers guide")," to learn more about how you can create really flexible pipelines for processing metadata using Transformers!"),(0,a.yg)("h3",{id:"autocomplete-and-syntax-validation"},"Autocomplete and Syntax Validation"),(0,a.yg)("p",null,"Name your recipe with ",(0,a.yg)("strong",{parentName:"p"},".dhub.yaml")," extension like ",(0,a.yg)("inlineCode",{parentName:"p"},"myrecipe.dhub.yaml_")," to use vscode or intellij as a recipe editor with autocomplete\nand syntax validation. Make sure yaml plugin is installed for your editor:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"For vscode install ",(0,a.yg)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml"},"Redhat's yaml plugin")),(0,a.yg)("li",{parentName:"ul"},"For intellij install ",(0,a.yg)("a",{parentName:"li",href:"https://plugins.jetbrains.com/plugin/13126-yaml"},"official yaml plugin"))))}f.isMDXComponent=!0}}]);