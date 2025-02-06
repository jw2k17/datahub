"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[25651],{15680:(e,a,t)=>{t.d(a,{xA:()=>g,yg:()=>y});var n=t(96540);function i(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?r(Object(t),!0).forEach((function(a){i(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function o(e,a){if(null==e)return{};var t,n,i=function(e,a){if(null==e)return{};var t,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||(i[t]=e[t]);return i}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=n.createContext({}),u=function(e){var a=n.useContext(p),t=a;return e&&(t="function"==typeof e?e(a):l(l({},a),e)),t},g=function(e){var a=u(e.components);return n.createElement(p.Provider,{value:a},e.children)},s="mdxType",m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},c=n.forwardRef((function(e,a){var t=e.components,i=e.mdxType,r=e.originalType,p=e.parentName,g=o(e,["components","mdxType","originalType","parentName"]),s=u(t),c=i,y=s["".concat(p,".").concat(c)]||s[c]||m[c]||r;return t?n.createElement(y,l(l({ref:a},g),{},{components:t})):n.createElement(y,l({ref:a},g))}));function y(e,a){var t=arguments,i=a&&a.mdxType;if("string"==typeof e||i){var r=t.length,l=new Array(r);l[0]=c;var o={};for(var p in a)hasOwnProperty.call(a,p)&&(o[p]=a[p]);o.originalType=e,o[s]="string"==typeof e?e:i,l[1]=o;for(var u=2;u<r;u++)l[u]=t[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}c.displayName="MDXCreateElement"},56362:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>g,contentTitle:()=>p,default:()=>y,frontMatter:()=>o,metadata:()=>u,toc:()=>s});t(96540);var n=t(15680);function i(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){return a=null!=a?a:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):function(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})),e}function l(e,a){if(null==e)return{};var t,n,i=function(e,a){if(null==e)return{};var t,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||(i[t]=e[t]);return i}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}const o={title:"Plugins Guide",slug:"/plugins",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/plugins.md"},p="Plugins Guide",u={unversionedId:"docs/plugins",id:"docs/plugins",title:"Plugins Guide",description:"Plugins are way to enhance the basic DataHub functionality in a custom manner.",source:"@site/genDocs/docs/plugins.md",sourceDirName:"docs",slug:"/plugins",permalink:"/docs/plugins",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/plugins.md",tags:[],version:"current",frontMatter:{title:"Plugins Guide",slug:"/plugins",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/plugins.md"},sidebar:"overviewSidebar",previous:{title:"Generating Browse Paths (V2)",permalink:"/docs/browsev2/browse-paths-v2"},next:{title:"Bootstrap MetadataChangeProposals (MCPs)",permalink:"/docs/advanced/bootstrap-mcps"}},g={},s=[{value:"Authentication",id:"authentication",level:2},{value:"Implementing an Authentication Plugin",id:"implementing-an-authentication-plugin",level:3},{value:"Enable GMS Authentication",id:"enable-gms-authentication",level:2},{value:"Authorization",id:"authorization",level:2},{value:"Implementing an Authorization Plugin",id:"implementing-an-authorization-plugin",level:3},{value:"Plugin Installation",id:"plugin-installation",level:2},{value:"Docker",id:"docker",level:3},{value:"Kubernetes",id:"kubernetes",level:3},{value:"Config Detail",id:"config-detail",level:2},{value:"Plugin Permissions",id:"plugin-permissions",level:2},{value:"Migration Of Plugins From application.yaml",id:"migration-of-plugins-from-applicationyaml",level:2}],m={toc:s},c="wrapper";function y(e){var{components:a}=e,t=l(e,["components"]);return(0,n.yg)(c,r(function(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})))),n.forEach((function(a){i(e,a,t[a])}))}return e}({},m,t),{components:a,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"plugins-guide"},"Plugins Guide"),(0,n.yg)("p",null,"Plugins are way to enhance the basic DataHub functionality in a custom manner."),(0,n.yg)("p",null,"Currently, DataHub formally supports 2 types of plugins:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"#authentication"},"Authentication")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"#authorization"},"Authorization"))),(0,n.yg)("h2",{id:"authentication"},"Authentication"),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},(0,n.yg)("strong",{parentName:"p"},"Note:")," This is in ",(0,n.yg)("b",null,"BETA")," version")),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},"It is recommend that you do not do this unless you really know what you are doing")),(0,n.yg)("p",null,"Custom authentication plugin makes it possible to authenticate DataHub users against any Identity Management System.\nChoose your Identity Management System and write custom authentication plugin as per detail mentioned in this section."),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},"Currently, custom authenticators cannot be used to authenticate users of DataHub's web UI. This is because the DataHub web app expects the presence of 2 special cookies PLAY_SESSION and actor which are explicitly set by the server when a login action is performed.\nInstead, custom authenticators are useful for authenticating API requests to DataHub's backend (GMS), and can stand in addition to the default Authentication performed by DataHub, which is based on DataHub-minted access tokens.")),(0,n.yg)("p",null,"The sample authenticator implementation can be found at ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/plugin/src/test/sample-test-plugins"},"Authenticator Sample")),(0,n.yg)("h3",{id:"implementing-an-authentication-plugin"},"Implementing an Authentication Plugin"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Add ",(0,n.yg)("em",{parentName:"p"},"datahub-auth-api")," as compileOnly dependency: Maven coordinates of ",(0,n.yg)("em",{parentName:"p"},"datahub-auth-api")," can be found at ",(0,n.yg)("a",{parentName:"p",href:"https://mvnrepository.com/artifact/io.acryl/datahub-auth-api"},"Maven")),(0,n.yg)("p",{parentName:"li"},"Example of gradle dependency is given below."),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-groovy"},' dependencies {\n   \n   def auth_api = \'io.acryl:datahub-auth-api:0.9.3-3rc3\'\n   compileOnly "${auth_api}"\n   testImplementation "${auth_api}"\n\n }\n'))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Implement the Authenticator interface: Refer ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/plugin/src/test/sample-test-plugins"},"Authenticator Sample")),(0,n.yg)("details",null,(0,n.yg)("summary",null,"Sample class which implements the Authenticator interface"),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-java"},"public class GoogleAuthenticator implements Authenticator {\n\n    @Override\n    public void init(@Nonnull Map<String, Object> authenticatorConfig, @Nullable AuthenticatorContext context) {\n      // Plugin initialization code will go here \n      // DataHub will call this method on boot time\n    }\n\n    @Nullable\n    @Override\n    public Authentication authenticate(@Nonnull AuthenticationRequest authenticationRequest)\n        throws AuthenticationException {\n        // DataHub will call this method whenever authentication decisions are need to be taken\n        // Authenticate the request and return Authentication\n    }\n}\n")))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Use ",(0,n.yg)("inlineCode",{parentName:"p"},"getResourceAsStream")," to read files: If your plugin read any configuration file like properties or YAML or JSON or xml then use ",(0,n.yg)("inlineCode",{parentName:"p"},'this.getClass().getClassLoader().getResourceAsStream("<file-name>")')," to read that file from DataHub GMS plugin's class-path. For DataHub GMS resource look-up behavior please refer ",(0,n.yg)("a",{parentName:"p",href:"#plugin-installation"},"Plugin Installation")," section. Sample code of ",(0,n.yg)("inlineCode",{parentName:"p"},"getResourceAsStream")," is available in sample Authenticator plugin ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/plugin/src/test/sample-test-plugins/src/main/java/com/datahub/plugins/test/TestAuthenticator.java"},"TestAuthenticator.java"),"."))),(0,n.yg)("ol",{start:4},(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Bundle your Jar: Use ",(0,n.yg)("inlineCode",{parentName:"p"},"com.gradleup.shadow")," gradle plugin to create an uber jar. "),(0,n.yg)("p",{parentName:"li"},"To see an example of building an uber jar, check out the ",(0,n.yg)("inlineCode",{parentName:"p"},"build.gradle")," file for the apache-ranger-plugin file of ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/acryldata/datahub-ranger-auth-plugin/tree/main/apache-ranger-plugin"},"Apache Ranger Plugin")," for reference. "),(0,n.yg)("p",{parentName:"li"},"Exclude signature files as shown in below ",(0,n.yg)("inlineCode",{parentName:"p"},"shadowJar")," task."),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-groovy"},'  apply plugin: \'com.gradleup.shadow\';\n  shadowJar {\n      // Exclude com.datahub.plugins package and files related to jar signature   \n      exclude "META-INF/*.RSA", "META-INF/*.SF","META-INF/*.DSA"\n  }\n'))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Refer section ",(0,n.yg)("a",{parentName:"p",href:"#plugin-installation"},"Plugin Installation")," for plugin installation in DataHub environment"))),(0,n.yg)("h2",{id:"enable-gms-authentication"},"Enable GMS Authentication"),(0,n.yg)("p",null,"By default, authentication is disabled in DataHub GMS."),(0,n.yg)("p",null,"Follow below steps to enable GMS authentication"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Download docker-compose.quickstart.yml: Download docker compose file ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/docker/quickstart/docker-compose.quickstart.yml"},"docker-compose.quickstart.yml"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Set environment variable: Set ",(0,n.yg)("inlineCode",{parentName:"p"},"METADATA_SERVICE_AUTH_ENABLED")," environment variable to ",(0,n.yg)("inlineCode",{parentName:"p"},"true"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Redeploy DataHub GMS: Below is quickstart command to redeploy DataHub GMS"),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-shell"},"datahub docker quickstart -f docker-compose.quickstart.yml\n")))),(0,n.yg)("h2",{id:"authorization"},"Authorization"),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},(0,n.yg)("strong",{parentName:"p"},"Note:")," This is in ",(0,n.yg)("b",null,"BETA")," version")),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},"It is recommend that you do not do this unless you really know what you are doing")),(0,n.yg)("p",null,"Custom authorization plugin makes it possible to authorize DataHub users against any Access Management System.\nChoose your Access Management System and write custom authorization plugin as per detail mentioned in this section."),(0,n.yg)("p",null,"The sample authorizer implementation can be found at ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/acryldata/datahub-ranger-auth-plugin/tree/main/apache-ranger-plugin"},"Authorizer Sample")),(0,n.yg)("h3",{id:"implementing-an-authorization-plugin"},"Implementing an Authorization Plugin"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Add ",(0,n.yg)("em",{parentName:"p"},"datahub-auth-api")," as compileOnly dependency: Maven coordinates of ",(0,n.yg)("em",{parentName:"p"},"datahub-auth-api")," can be found at ",(0,n.yg)("a",{parentName:"p",href:"https://mvnrepository.com/artifact/io.acryl/datahub-auth-api"},"Maven")),(0,n.yg)("p",{parentName:"li"},"Example of gradle dependency is given below."),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-groovy"},' dependencies {\n   \n   def auth_api = \'io.acryl:datahub-auth-api:0.9.3-3rc3\'\n   compileOnly "${auth_api}"\n   testImplementation "${auth_api}"\n\n }\n'))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Implement the Authorizer interface: ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/acryldata/datahub-ranger-auth-plugin/tree/main/apache-ranger-plugin"},"Authorizer Sample")),(0,n.yg)("details",null,(0,n.yg)("summary",null,"Sample class which implements the Authorization interface "),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-java"}," public class ApacheRangerAuthorizer implements Authorizer {\n     @Override\n     public void init(@Nonnull Map<String, Object> authorizerConfig, @Nonnull AuthorizerContext ctx) {\n       // Plugin initialization code will go here \n       // DataHub will call this method on boot time\n     }\n\n     @Override\n     public AuthorizationResult authorize(@Nonnull AuthorizationRequest request) {\n         // DataHub will call this method whenever authorization decisions are need be taken\n         // Authorize the request and return AuthorizationResult\n     }\n\n     @Override\n     public AuthorizedActors authorizedActors(String privilege, Optional<ResourceSpec> resourceSpec) {\n         // Need to add doc\n     }\n }\n")))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Use ",(0,n.yg)("inlineCode",{parentName:"p"},"getResourceAsStream")," to read files: If your plugin read any configuration file like properties or YAML or JSON or xml then use ",(0,n.yg)("inlineCode",{parentName:"p"},'this.getClass().getClassLoader().getResourceAsStream("<file-name>")')," to read that file from DataHub GMS plugin's class-path. For DataHub GMS resource look-up behavior please refer ",(0,n.yg)("a",{parentName:"p",href:"#plugin-installation"},"Plugin Installation")," section. Sample code of ",(0,n.yg)("inlineCode",{parentName:"p"},"getResourceAsStream")," is available in sample Authenticator plugin ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/plugin/src/test/sample-test-plugins/src/main/java/com/datahub/plugins/test/TestAuthenticator.java"},"TestAuthenticator.java"),".")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Bundle your Jar: Use ",(0,n.yg)("inlineCode",{parentName:"p"},"com.gradleup.shadow")," gradle plugin to create an uber jar. "),(0,n.yg)("p",{parentName:"li"},"To see an example of building an uber jar, check out the ",(0,n.yg)("inlineCode",{parentName:"p"},"build.gradle")," file for the apache-ranger-plugin file of ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/acryldata/datahub-ranger-auth-plugin/tree/main/apache-ranger-plugin"},"Apache Ranger Plugin")," for reference."),(0,n.yg)("p",{parentName:"li"},"Exclude signature files as shown in below ",(0,n.yg)("inlineCode",{parentName:"p"},"shadowJar")," task."),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-groovy"},'  apply plugin: \'com.gradleup.shadow\';\n  shadowJar {\n      // Exclude com.datahub.plugins package and files related to jar signature   \n      exclude "META-INF/*.RSA", "META-INF/*.SF","META-INF/*.DSA"\n  }\n'))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Install the Plugin: Refer to the section (Plugin Installation)","[#plugin_installation]"," for plugin installation in DataHub environment"))),(0,n.yg)("h2",{id:"plugin-installation"},"Plugin Installation"),(0,n.yg)("p",null,"DataHub's GMS Service searches for the plugins in container's local directory at location ",(0,n.yg)("inlineCode",{parentName:"p"},"/etc/datahub/plugins/auth/"),". This location will be referred as ",(0,n.yg)("inlineCode",{parentName:"p"},"plugin-base-directory")," hereafter."),(0,n.yg)("p",null,"For docker, we set docker-compose to mount ",(0,n.yg)("inlineCode",{parentName:"p"},"${HOME}/.datahub")," directory to ",(0,n.yg)("inlineCode",{parentName:"p"},"/etc/datahub")," directory within the GMS containers."),(0,n.yg)("h3",{id:"docker"},"Docker"),(0,n.yg)("p",null,"Follow below steps to install plugins:"),(0,n.yg)("p",null,"Lets consider you have created an uber jar for authorizer plugin and jar name is apache-ranger-authorizer.jar and class com.abc.RangerAuthorizer has implemented the ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-auth/auth-api/src/main/java/com/datahub/plugins/auth/authorization/Authorizer.java"},"Authorizer")," interface."),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Create a plugin configuration file: Create a ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")," file at ",(0,n.yg)("inlineCode",{parentName:"p"},"${HOME}/.datahub/plugins/auth/"),". For more detail on configuration refer ",(0,n.yg)("a",{parentName:"p",href:"#config-detail"},"Config Detail")," section")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Create a plugin directory: Create plugin directory as ",(0,n.yg)("inlineCode",{parentName:"p"},"apache-ranger-authorizer"),", this directory will be referred as ",(0,n.yg)("inlineCode",{parentName:"p"},"plugin-home")," hereafter"),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-shell"}," mkdir -p ${HOME}/.datahub/plugins/auth/apache-ranger-authorizer\n"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Copy plugin jar to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugin-home"),": Copy ",(0,n.yg)("inlineCode",{parentName:"p"},"apache-ranger-authorizer.jar")," to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugin-home")),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-shell"}," copy apache-ranger-authorizer.jar ${HOME}/.datahub/plugins/auth/apache-ranger-authorizer\n"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Update plugin configuration file: Add below entry in ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml"),' file, the plugin can take any arbitrary configuration under the "configs" block. in our example, there is username and password'),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'   plugins:\n     - name: "apache-ranger-authorizer"\n       type: "authorizer"\n       enabled: "true"\n       params:\n         className: "com.abc.RangerAuthorizer"\n         configs:\n            username: "foo"\n            password: "fake"\n\n'))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Restart datahub-gms container: "),(0,n.yg)("p",{parentName:"li"},"On startup DataHub GMS service performs below steps "),(0,n.yg)("ol",{parentName:"li"},(0,n.yg)("li",{parentName:"ol"},"Load ",(0,n.yg)("inlineCode",{parentName:"li"},"config.yml")),(0,n.yg)("li",{parentName:"ol"},"Prepare list of plugin where ",(0,n.yg)("inlineCode",{parentName:"li"},"enabled")," is set to ",(0,n.yg)("inlineCode",{parentName:"li"},"true")),(0,n.yg)("li",{parentName:"ol"},"Look for directory equivalent to plugin ",(0,n.yg)("inlineCode",{parentName:"li"},"name")," in ",(0,n.yg)("inlineCode",{parentName:"li"},"plugin-base-directory"),". In this case it is ",(0,n.yg)("inlineCode",{parentName:"li"},"/etc/datahub/plugins/auth/apache-ranger-authorizer/"),", this directory will become ",(0,n.yg)("inlineCode",{parentName:"li"},"plugin-home")," "),(0,n.yg)("li",{parentName:"ol"},"Look for ",(0,n.yg)("inlineCode",{parentName:"li"},"params.jarFileName")," attribute otherwise look for jar having name as ","<","plugin-name",">",".jar. In this case  it is ",(0,n.yg)("inlineCode",{parentName:"li"},"/etc/datahub/plugins/auth/apache-ranger-authorizer/apache-ranger-authorizer.jar")),(0,n.yg)("li",{parentName:"ol"},"Load class given in plugin ",(0,n.yg)("inlineCode",{parentName:"li"},"params.className")," attribute from the jar, here load class ",(0,n.yg)("inlineCode",{parentName:"li"},"com.abc.RangerAuthorizer")," from ",(0,n.yg)("inlineCode",{parentName:"li"},"apache-ranger-authorizer.jar")),(0,n.yg)("li",{parentName:"ol"},"Call ",(0,n.yg)("inlineCode",{parentName:"li"},"init")," method of plugin")),(0,n.yg)("br",null),"On method call of `getResourceAsStream` DataHub GMS service looks for the resource in below order. 1. Look for the requested resource in plugin-jar file. if found then return the resource as InputStream. 2. Look for the requested resource in `plugin-home` directory. if found then return the resource as InputStream. 3. Look for the requested resource in application class-loader. if found then return the resource as InputStream. 4. Return `null` as requested resource is not found.")),(0,n.yg)("p",null,"By default, authentication is disabled in DataHub GMS, Please follow section ",(0,n.yg)("a",{parentName:"p",href:"#enable-gms-authentication"},"Enable GMS Authentication")," to enable authentication."),(0,n.yg)("h3",{id:"kubernetes"},"Kubernetes"),(0,n.yg)("p",null,"Helm support is coming soon."),(0,n.yg)("h2",{id:"config-detail"},"Config Detail"),(0,n.yg)("p",null,"A sample ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")," can be found at ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/plugin/src/test/resources/valid-base-plugin-dir1/config.yml"},"config.yml"),"."),(0,n.yg)("p",null,(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")," structure:"),(0,n.yg)("table",null,(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Field"),(0,n.yg)("th",{parentName:"tr",align:null},"Required"),(0,n.yg)("th",{parentName:"tr",align:null},"Type"),(0,n.yg)("th",{parentName:"tr",align:null},"Default"),(0,n.yg)("th",{parentName:"tr",align:null},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"plugins[].name"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"string"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"name of the plugin")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"plugins[].type"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"enum","[authenticator, authorizer]"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"type of plugin, possible values are authenticator or authorizer")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"plugins[].enabled"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"boolean"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"whether this plugin is enabled or disabled. DataHub GMS wouldn't process disabled plugin")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"plugins[].params.className"),(0,n.yg)("td",{parentName:"tr",align:null},"\u2705"),(0,n.yg)("td",{parentName:"tr",align:null},"string"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"Authenticator or Authorizer implementation class' fully qualified class name")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"plugins[].params.jarFileName"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"string"),(0,n.yg)("td",{parentName:"tr",align:null},"default to ",(0,n.yg)("inlineCode",{parentName:"td"},"plugins[].name"),".jar"),(0,n.yg)("td",{parentName:"tr",align:null},"jar file name in ",(0,n.yg)("inlineCode",{parentName:"td"},"plugin-home"))),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"plugins[].params.configs"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"map<string,object>"),(0,n.yg)("td",{parentName:"tr",align:null},"default to empty map"),(0,n.yg)("td",{parentName:"tr",align:null},"Runtime configuration required for plugin")))),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},"plugins[] is an array of plugin, where you can define multiple authenticator and authorizer plugins. plugin name should be unique in plugins array.")),(0,n.yg)("h2",{id:"plugin-permissions"},"Plugin Permissions"),(0,n.yg)("p",null,"Adhere to below plugin access control to keep your plugin forward compatible."),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Plugin should read/write file to and from ",(0,n.yg)("inlineCode",{parentName:"li"},"plugin-home")," directory only. Refer ",(0,n.yg)("a",{parentName:"li",href:"#plugin-installation"},"Plugin Installation")," step2 for ",(0,n.yg)("inlineCode",{parentName:"li"},"plugin-home")," definition"),(0,n.yg)("li",{parentName:"ul"},"Plugin should access port 80 or 443 or port higher than 1024")),(0,n.yg)("p",null,"All other access are forbidden for the plugin."),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},"Disclaimer: In BETA version your plugin can access any port and can read/write to any location on file system, however you should implement the plugin as per above access permission to keep your plugin compatible with upcoming release of DataHub.")),(0,n.yg)("h2",{id:"migration-of-plugins-from-applicationyaml"},"Migration Of Plugins From application.yaml"),(0,n.yg)("p",null,"If you have any custom Authentication or Authorization plugin define in ",(0,n.yg)("inlineCode",{parentName:"p"},"authorization")," or ",(0,n.yg)("inlineCode",{parentName:"p"},"authentication")," section of  ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/configuration/src/main/resources/application.yaml"},"application.yaml")," then migrate them as per below steps."),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Implement Plugin: For Authentication Plugin follow steps of ",(0,n.yg)("a",{parentName:"p",href:"#implementing-an-authentication-plugin"},"Implementing an Authentication Plugin")," and for Authorization Plugin follow steps of ",(0,n.yg)("a",{parentName:"p",href:"#implementing-an-authorization-plugin"},"Implementing an Authorization Plugin"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Install Plugin: Install the plugins as per steps mentioned in ",(0,n.yg)("a",{parentName:"p",href:"#plugin-installation"},"Plugin Installation"),". Here you need to map the configuration from ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-service/configuration/src/main/resources/application.yaml"},"application.yaml")," to configuration in ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml"),". This mapping from ",(0,n.yg)("inlineCode",{parentName:"p"},"application.yaml")," to ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")," is described below "),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("strong",{parentName:"p"},"Mapping for Authenticators")),(0,n.yg)("p",{parentName:"li"},"a. In ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")," set ",(0,n.yg)("inlineCode",{parentName:"p"},"plugins[].type")," to ",(0,n.yg)("inlineCode",{parentName:"p"},"authenticator")),(0,n.yg)("p",{parentName:"li"},"b. ",(0,n.yg)("inlineCode",{parentName:"p"},"authentication.authenticators[].type")," is mapped to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugins[].params.className")),(0,n.yg)("p",{parentName:"li"},"c. ",(0,n.yg)("inlineCode",{parentName:"p"},"authentication.authenticators[].configs")," is mapped to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugins[].params.configs")),(0,n.yg)("p",{parentName:"li"},"Example Authenticator Plugin configuration in ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'plugins:\n   - name: "apache-ranger-authenticator"\n      type: "authenticator"\n      enabled: "true"\n      params:\n      className: "com.abc.RangerAuthenticator"\n      configs:\n         username: "foo"\n         password: "fake"\n\n')),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("strong",{parentName:"p"},"Mapping for Authorizer")),(0,n.yg)("p",{parentName:"li"},"a. In ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")," set ",(0,n.yg)("inlineCode",{parentName:"p"},"plugins[].type")," to ",(0,n.yg)("inlineCode",{parentName:"p"},"authorizer")),(0,n.yg)("p",{parentName:"li"},"b. ",(0,n.yg)("inlineCode",{parentName:"p"},"authorization.authorizers[].type")," is mapped to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugins[].params.className")),(0,n.yg)("p",{parentName:"li"},"c. ",(0,n.yg)("inlineCode",{parentName:"p"},"authorization.authorizers[].configs")," is mapped to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugins[].params.configs")),(0,n.yg)("p",{parentName:"li"},"Example Authorizer Plugin configuration in ",(0,n.yg)("inlineCode",{parentName:"p"},"config.yml")),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-yaml"},'plugins:\n   - name: "apache-ranger-authorizer"\n      type: "authorizer"\n      enabled: "true"\n      params:\n      className: "com.abc.RangerAuthorizer"\n      configs:\n         username: "foo"\n         password: "fake"\n\n'))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Move any other configurations files of your plugin to ",(0,n.yg)("inlineCode",{parentName:"p"},"plugin_home")," directory. The detail about ",(0,n.yg)("inlineCode",{parentName:"p"},"plugin_home")," is mentioned in ",(0,n.yg)("a",{parentName:"p",href:"#plugin-installation"},"Plugin Installation")," section."))))}y.isMDXComponent=!0}}]);