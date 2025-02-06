"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[76033],{15680:(e,t,n)=>{n.d(t,{xA:()=>d,yg:()=>m});var a=n(96540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),c=u(n),g=o,m=c["".concat(l,".").concat(g)]||c[g]||p[g]||r;return n?a.createElement(m,i(i({ref:t},d),{},{components:n})):a.createElement(m,i({ref:t},d))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=g;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:o,i[1]=s;for(var u=2;u<r;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},79428:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>u,toc:()=>c});n(96540);var a=n(15680);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}const s={title:"Adding a Metadata Ingestion Source",slug:"/metadata-ingestion/adding-source",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/adding-source.md"},l="Adding a Metadata Ingestion Source",u={unversionedId:"metadata-ingestion/adding-source",id:"version-0.15.0/metadata-ingestion/adding-source",title:"Adding a Metadata Ingestion Source",description:"There are two ways of adding a metadata ingestion source.",source:"@site/versioned_docs/version-0.15.0/metadata-ingestion/adding-source.md",sourceDirName:"metadata-ingestion",slug:"/metadata-ingestion/adding-source",permalink:"/docs/0.15.0/metadata-ingestion/adding-source",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/adding-source.md",tags:[],version:"0.15.0",frontMatter:{title:"Adding a Metadata Ingestion Source",slug:"/metadata-ingestion/adding-source",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/adding-source.md"},sidebar:"overviewSidebar",previous:{title:"SchemaFieldPath Specification (Version 2)",permalink:"/docs/0.15.0/advanced/field-path-spec-v2"},next:{title:"Using a Custom Ingestion Source",permalink:"/docs/0.15.0/how/add-custom-ingestion-source"}},d={},c=[{value:"1. Set up the configuration model",id:"1-set-up-the-configuration-model",level:3},{value:"Documentation for Configuration Classes",id:"documentation-for-configuration-classes",level:4},{value:"2. Set up the reporter",id:"2-set-up-the-reporter",level:3},{value:"3. Implement the source itself",id:"3-implement-the-source-itself",level:3},{value:"4. Set up the dependencies",id:"4-set-up-the-dependencies",level:3},{value:"5. Enable discoverability",id:"5-enable-discoverability",level:3},{value:"6. Write tests",id:"6-write-tests",level:3},{value:"7. Write docs",id:"7-write-docs",level:3},{value:"7.1 Set up the source class for automatic documentation",id:"71-set-up-the-source-class-for-automatic-documentation",level:4},{value:"7.2 Write custom documentation",id:"72-write-custom-documentation",level:4},{value:"7.3 Viewing the Documentation",id:"73-viewing-the-documentation",level:4},{value:"Step 1: Build the Ingestion docs",id:"step-1-build-the-ingestion-docs",level:5},{value:"Step 2: Build the Entire Documentation",id:"step-2-build-the-entire-documentation",level:4},{value:"8. Add SQL Alchemy mapping (if applicable)",id:"8-add-sql-alchemy-mapping-if-applicable",level:3},{value:"9. Add logo for the platform",id:"9-add-logo-for-the-platform",level:3},{value:"10. Update Frontend for UI-based ingestion",id:"10-update-frontend-for-ui-based-ingestion",level:3},{value:"10.1 Add to sources.json",id:"101-add-to-sourcesjson",level:4},{value:"10.2 Add logo to the React app",id:"102-add-logo-to-the-react-app",level:4},{value:"10.3 Update constants.ts",id:"103-update-constantsts",level:4}],p={toc:c},g="wrapper";function m(e){var{components:t}=e,n=i(e,["components"]);return(0,a.yg)(g,r(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){o(e,t,n[t])}))}return e}({},p,n),{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"adding-a-metadata-ingestion-source"},"Adding a Metadata Ingestion Source"),(0,a.yg)("p",null,"There are two ways of adding a metadata ingestion source."),(0,a.yg)("ol",null,(0,a.yg)("li",{parentName:"ol"},"You are going to contribute the custom source directly to the Datahub project."),(0,a.yg)("li",{parentName:"ol"},"You are writing the custom source for yourself and are not going to contribute back (yet).")),(0,a.yg)("p",null,"If you are going for case (1) just follow the steps 1 to 9 below. In case you are building it for yourself you can skip\nsteps 4-8 (but maybe write tests and docs for yourself as well) and follow the documentation\non ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.15.0/how/add-custom-ingestion-source"},"how to use custom ingestion sources"),"\nwithout forking Datahub."),(0,a.yg)("admonition",{type:"note"},(0,a.yg)("p",{parentName:"admonition"},"This guide assumes that you've already followed the metadata ingestion ",(0,a.yg)("a",{parentName:"p",href:"/docs/0.15.0/metadata-ingestion/developing"},"developing guide")," to set up\nyour local environment.")),(0,a.yg)("h3",{id:"1-set-up-the-configuration-model"},"1. Set up the configuration model"),(0,a.yg)("p",null,"We use ",(0,a.yg)("a",{parentName:"p",href:"https://pydantic-docs.helpmanual.io/"},"pydantic")," for configuration, and all models must inherit\nfrom ",(0,a.yg)("inlineCode",{parentName:"p"},"ConfigModel"),". The ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/file.py"},"file source")," is a good example."),(0,a.yg)("h4",{id:"documentation-for-configuration-classes"},"Documentation for Configuration Classes"),(0,a.yg)("p",null,"We use ",(0,a.yg)("a",{parentName:"p",href:"https://pydantic-docs.helpmanual.io"},"pydantic")," conventions for documenting configuration flags. Use the ",(0,a.yg)("inlineCode",{parentName:"p"},"description")," attribute to write rich documentation for your configuration field."),(0,a.yg)("p",null,"For example, the following code:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-python"},'from pydantic import Field\nfrom datahub.api.configuration.common import ConfigModel\n\nclass LookerAPIConfig(ConfigModel):\n    client_id: str = Field(description="Looker API client id.")\n    client_secret: str = Field(description="Looker API client secret.")\n    base_url: str = Field(\n        description="Url to your Looker instance: `https://company.looker.com:19999` or `https://looker.company.com`, or similar. Used for making API calls to Looker and constructing clickable dashboard and chart urls."\n    )\n    transport_options: Optional[TransportOptionsConfig] = Field(\n        default=None,\n        description="Populates the [TransportOptions](https://github.com/looker-open-source/sdk-codegen/blob/94d6047a0d52912ac082eb91616c1e7c379ab262/python/looker_sdk/rtl/transport.py#L70) struct for looker client",\n    )\n')),(0,a.yg)("p",null,"generates the following documentation:"),(0,a.yg)("p",{align:"center"},(0,a.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/metadata-ingestion/generated_config_docs.png"})),(0,a.yg)("admonition",{type:"note"},(0,a.yg)("p",{parentName:"admonition"},"Inline markdown or code snippets are not yet supported for field level documentation.")),(0,a.yg)("h3",{id:"2-set-up-the-reporter"},"2. Set up the reporter"),(0,a.yg)("p",null,"The reporter interface enables the source to report statistics, warnings, failures, and other information about the run.\nSome sources use the default ",(0,a.yg)("inlineCode",{parentName:"p"},"SourceReport")," class, but others inherit and extend that class."),(0,a.yg)("h3",{id:"3-implement-the-source-itself"},"3. Implement the source itself"),(0,a.yg)("p",null,"The core for the source is the ",(0,a.yg)("inlineCode",{parentName:"p"},"get_workunits_internal")," method, which produces a stream of metadata events (typically MCP objects) wrapped up in a MetadataWorkUnit.\nThe ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/file.py"},"file source")," is a good and simple example."),(0,a.yg)("p",null,"The MetadataChangeEventClass is defined in the metadata models which are generated\nunder ",(0,a.yg)("inlineCode",{parentName:"p"},"metadata-ingestion/src/datahub/metadata/schema_classes.py"),". There are also\nsome ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/emitter/mce_builder.py"},"convenience methods")," for commonly used operations."),(0,a.yg)("h3",{id:"4-set-up-the-dependencies"},"4. Set up the dependencies"),(0,a.yg)("p",null,"Note: Steps 4-8 are only required if you intend to contribute the source back to the Datahub project."),(0,a.yg)("p",null,"Declare the source's pip dependencies in the ",(0,a.yg)("inlineCode",{parentName:"p"},"plugins")," variable of the ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/setup.py"},"setup script"),"."),(0,a.yg)("h3",{id:"5-enable-discoverability"},"5. Enable discoverability"),(0,a.yg)("p",null,"Declare the source under the ",(0,a.yg)("inlineCode",{parentName:"p"},"entry_points")," variable of the ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/setup.py"},"setup script"),". This enables the source to be\nlisted when running ",(0,a.yg)("inlineCode",{parentName:"p"},"datahub check plugins"),", and sets up the source's shortened alias for use in recipes."),(0,a.yg)("h3",{id:"6-write-tests"},"6. Write tests"),(0,a.yg)("p",null,"Tests go in the ",(0,a.yg)("inlineCode",{parentName:"p"},"tests")," directory. We use the ",(0,a.yg)("a",{parentName:"p",href:"https://pytest.org/"},"pytest framework"),"."),(0,a.yg)("h3",{id:"7-write-docs"},"7. Write docs"),(0,a.yg)("h4",{id:"71-set-up-the-source-class-for-automatic-documentation"},"7.1 Set up the source class for automatic documentation"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Indicate the platform name that this source class produces metadata for using the ",(0,a.yg)("inlineCode",{parentName:"li"},"@platform_name")," decorator. We prefer using the human-readable platform name, so e.g. BigQuery (not bigquery)."),(0,a.yg)("li",{parentName:"ul"},"Indicate the config class being used by the source by using the ",(0,a.yg)("inlineCode",{parentName:"li"},"@config_class")," decorator."),(0,a.yg)("li",{parentName:"ul"},"Indicate the support status of the connector by using the ",(0,a.yg)("inlineCode",{parentName:"li"},"@support_status")," decorator."),(0,a.yg)("li",{parentName:"ul"},"Indicate what capabilities the connector supports (and what important capabilities it does NOT support) by using the ",(0,a.yg)("inlineCode",{parentName:"li"},"@capability")," decorator."),(0,a.yg)("li",{parentName:"ul"},"Add rich documentation for the connector by utilizing docstrings on your Python class. Markdown is supported.")),(0,a.yg)("p",null,"See below a simple example of how to do this for any source."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-python"},'\nfrom datahub.ingestion.api.decorators import (\n    SourceCapability,\n    SupportStatus,\n    capability,\n    config_class,\n    platform_name,\n    support_status,\n)\n\n@platform_name("File")\n@support_status(SupportStatus.CERTIFIED)\n@config_class(FileSourceConfig)\n@capability(\n    SourceCapability.PLATFORM_INSTANCE,\n    "File based ingestion does not support platform instances",\n    supported=False,\n)\n@capability(SourceCapability.DOMAINS, "Enabled by default")\n@capability(SourceCapability.DATA_PROFILING, "Optionally enabled via configuration")\n@capability(SourceCapability.DESCRIPTIONS, "Enabled by default")\n@capability(SourceCapability.LINEAGE_COARSE, "Enabled by default")\nclass FileSource(Source):\n   """\n\n   The File Source can be used to produce all kinds of metadata from a generic metadata events file.\n   :::note\n   Events in this file can be in MCE form or MCP form.\n   :::\n\n   """\n\n   ... source code goes here\n\n')),(0,a.yg)("h4",{id:"72-write-custom-documentation"},"7.2 Write custom documentation"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Create a copy of ",(0,a.yg)("a",{parentName:"li",href:"/docs/0.15.0/metadata-ingestion/source-docs-template"},(0,a.yg)("inlineCode",{parentName:"a"},"source-docs-template.md"))," and edit all relevant components."),(0,a.yg)("li",{parentName:"ul"},"Name the document as ",(0,a.yg)("inlineCode",{parentName:"li"},"<plugin.md>")," and move it to ",(0,a.yg)("inlineCode",{parentName:"li"},"metadata-ingestion/docs/sources/<platform>/<plugin>.md"),". For example for the Kafka platform, under the ",(0,a.yg)("inlineCode",{parentName:"li"},"kafka")," plugin, move the document to ",(0,a.yg)("inlineCode",{parentName:"li"},"metadata-ingestion/docs/sources/kafka/kafka.md"),"."),(0,a.yg)("li",{parentName:"ul"},"Add a quickstart recipe corresponding to the plugin under ",(0,a.yg)("inlineCode",{parentName:"li"},"metadata-ingestion/docs/sources/<platform>/<plugin>_recipe.yml"),". For example, for the Kafka platform, under the ",(0,a.yg)("inlineCode",{parentName:"li"},"kafka")," plugin, there is a quickstart recipe located at ",(0,a.yg)("inlineCode",{parentName:"li"},"metadata-ingestion/docs/sources/kafka/kafka_recipe.yml"),"."),(0,a.yg)("li",{parentName:"ul"},"To write platform-specific documentation (that is cross-plugin), write the documentation under ",(0,a.yg)("inlineCode",{parentName:"li"},"metadata-ingestion/docs/sources/<platform>/README.md"),". For example, cross-plugin documentation for the BigQuery platform is located under ",(0,a.yg)("inlineCode",{parentName:"li"},"metadata-ingestion/docs/sources/bigquery/README.md"),".")),(0,a.yg)("h4",{id:"73-viewing-the-documentation"},"7.3 Viewing the Documentation"),(0,a.yg)("p",null,"Documentation for the source can be viewed by running the documentation generator from the ",(0,a.yg)("inlineCode",{parentName:"p"},"docs-website")," module."),(0,a.yg)("h5",{id:"step-1-build-the-ingestion-docs"},"Step 1: Build the Ingestion docs"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-console"},"# From the root of DataHub repo\n./gradlew :metadata-ingestion:docGen\n")),(0,a.yg)("p",null,"If this finishes successfully, you will see output messages like:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-console"},'Ingestion Documentation Generation Complete\n############################################\n{\n  "source_platforms": {\n    "discovered": 40,\n    "generated": 40\n  },\n  "plugins": {\n    "discovered": 47,\n    "generated": 47,\n    "failed": 0\n  }\n}\n############################################\n')),(0,a.yg)("p",null,"You can also find documentation files generated at ",(0,a.yg)("inlineCode",{parentName:"p"},"./docs/generated/ingestion/sources")," relative to the root of the DataHub repo. You should be able to locate your specific source's markdown file here and investigate it to make sure things look as expected."),(0,a.yg)("h4",{id:"step-2-build-the-entire-documentation"},"Step 2: Build the Entire Documentation"),(0,a.yg)("p",null,"To view how this documentation looks in the browser, there is one more step. Just build the entire docusaurus page from the ",(0,a.yg)("inlineCode",{parentName:"p"},"docs-website")," module."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-console"},"# From the root of DataHub repo\n./gradlew :docs-website:build\n")),(0,a.yg)("p",null,"This will generate messages like:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-console"},'...\n> Task :docs-website:yarnGenerate\nyarn run v1.22.0\n$ rm -rf genDocs/* && ts-node -O \'{ "lib": ["es2020"], "target": "es6" }\' generateDocsDir.ts && mv -v docs/* genDocs/\nIncluding untracked files in docs list:\ndocs/graphql -> genDocs/graphql\nDone in 2.47s.\n\n> Task :docs-website:yarnBuild\nyarn run v1.22.0\n$ docusaurus build\n\n\u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e\u2502                                                                              \u2502\u2502                Update available 2.0.0-beta.8 \u2192 2.0.0-beta.18                 \u2502\u2502                                                                              \u2502\u2502       To upgrade Docusaurus packages with the latest version, run the        \u2502\u2502                             following command:                               \u2502\u2502                    yarn upgrade @docusaurus/core@latest                      \u2502\u2502   @docusaurus/plugin-ideal-image@latest @docusaurus/preset-classic@latest    \u2502\u2502                                                                              \u2502\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f\n\n\n[en] Creating an optimized production build...\nInvalid docusaurus-plugin-ideal-image version 2.0.0-beta.7.\nAll official @docusaurus/* packages should have the exact same version as @docusaurus/core (2.0.0-beta.8).\nMaybe you want to check, or regenerate your yarn.lock or package-lock.json file?\nBrowserslist: caniuse-lite is outdated. Please run:\n  npx browserslist@latest --update-db\n  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating\n\u2139 Compiling Client\n\u2139 Compiling Server\n\u2714 Client: Compiled successfully in 1.95s\n\u2714 Server: Compiled successfully in 7.52s\nSuccess! Generated static files in "build".\n\nUse `npm run serve` command to test your build locally.\n\nDone in 11.59s.\n\nDeprecated Gradle features were used in this build, making it incompatible with Gradle 7.0.\nUse \'--warning-mode all\' to show the individual deprecation warnings.\nSee https://docs.gradle.org/6.9.2/userguide/command_line_interface.html#sec:command_line_warnings\n\nBUILD SUCCESSFUL in 35s\n36 actionable tasks: 16 executed, 20 up-to-date\n')),(0,a.yg)("p",null,"After this you need to run the following script from the ",(0,a.yg)("inlineCode",{parentName:"p"},"docs-website")," module."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-console"},"cd docs-website\nnpm run serve\n")),(0,a.yg)("p",null,"Now, browse to http://localhost:3000 or whichever port npm is running on, to browse the docs.\nYour source should show up on the left sidebar under ",(0,a.yg)("inlineCode",{parentName:"p"},"Metadata Ingestion / Sources"),"."),(0,a.yg)("h3",{id:"8-add-sql-alchemy-mapping-if-applicable"},"8. Add SQL Alchemy mapping (if applicable)"),(0,a.yg)("p",null,"Add the source in ",(0,a.yg)("inlineCode",{parentName:"p"},"get_platform_from_sqlalchemy_uri")," function\nin ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/source/sql/sql_common.py"},"sql_common.py")," if the source has an sqlalchemy source"),(0,a.yg)("h3",{id:"9-add-logo-for-the-platform"},"9. Add logo for the platform"),(0,a.yg)("p",null,"Add the logo image in ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/datahub-web-react/src/images"},"images folder")," and add it to be ingested at ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/configuration/src/main/resources/bootstrap_mcps/data-platforms.yaml"},"startup")),(0,a.yg)("h3",{id:"10-update-frontend-for-ui-based-ingestion"},"10. Update Frontend for UI-based ingestion"),(0,a.yg)("p",null,"We are currently transitioning to a more dynamic approach to display available sources for UI-based Managed Ingestion. For the time being, adhere to these next steps to get your source to display in the UI Ingestion tab."),(0,a.yg)("h4",{id:"101-add-to-sourcesjson"},"10.1 Add to sources.json"),(0,a.yg)("p",null,"Add new source to the list in ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/datahub-web-react/src/app/ingest/source/builder/sources.json"},"sources.json")," including a default quickstart recipe. This will render your source in the list of options when creating a new recipe in the UI."),(0,a.yg)("h4",{id:"102-add-logo-to-the-react-app"},"10.2 Add logo to the React app"),(0,a.yg)("p",null,"Add your source logo to the React ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/tree/master/datahub-web-react/src/images"},"images folder")," so your image is available in memory."),(0,a.yg)("h4",{id:"103-update-constantsts"},"10.3 Update constants.ts"),(0,a.yg)("p",null,"Create new constants in ",(0,a.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/datahub-web-react/src/app/ingest/source/builder/constants.ts"},"constants.ts")," for the source urn and source name. Update PLATFORM_URN_TO_LOGO to map your source urn to the newly added logo in the images folder."))}m.isMDXComponent=!0}}]);