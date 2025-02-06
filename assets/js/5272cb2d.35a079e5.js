"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[12488],{15680:(e,t,n)=>{n.d(t,{xA:()=>u,yg:()=>y});var r=n(96540);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=l(n),m=a,y=p["".concat(c,".").concat(m)]||p[m]||g[m]||o;return n?r.createElement(y,i(i({ref:t},u),{},{components:n})):r.createElement(y,i({ref:t},u))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[p]="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},54171:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>c,default:()=>y,frontMatter:()=>s,metadata:()=>l,toc:()=>p});n(96540);var r=n(15680);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}const s={title:"Concepts",slug:"/actions/concepts",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/actions/concepts.md"},c="DataHub Actions Concepts",l={unversionedId:"docs/actions/concepts",id:"version-0.14.1/docs/actions/concepts",title:"Concepts",description:"The Actions framework includes pluggable components for filtering, transforming, and reacting to important DataHub, such as",source:"@site/versioned_docs/version-0.14.1/docs/actions/concepts.md",sourceDirName:"docs/actions",slug:"/actions/concepts",permalink:"/docs/0.14.1/actions/concepts",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/actions/concepts.md",tags:[],version:"0.14.1",frontMatter:{title:"Concepts",slug:"/actions/concepts",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/actions/concepts.md"},sidebar:"overviewSidebar",previous:{title:"Quickstart",permalink:"/docs/0.14.1/actions/quickstart"},next:{title:"Kafka Event Source",permalink:"/docs/0.14.1/actions/sources/kafka-event-source"}},u={},p=[{value:"Use Cases",id:"use-cases",level:3},{value:"Concepts",id:"concepts",level:2},{value:"Pipelines",id:"pipelines",level:3},{value:"Events",id:"events",level:3},{value:"Event Types",id:"event-types",level:4},{value:"Event Sources",id:"event-sources",level:3},{value:"Transformers",id:"transformers",level:3},{value:"Action",id:"action",level:3}],g={toc:p},m="wrapper";function y(e){var{components:t}=e,n=i(e,["components"]);return(0,r.yg)(m,o(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){a(e,t,n[t])}))}return e}({},g,n),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"datahub-actions-concepts"},"DataHub Actions Concepts"),(0,r.yg)("p",null,"The Actions framework includes pluggable components for filtering, transforming, and reacting to important DataHub, such as  "),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Tag Additions / Removals"),(0,r.yg)("li",{parentName:"ul"},"Glossary Term Additions / Removals"),(0,r.yg)("li",{parentName:"ul"},"Schema Field Additions / Removals"),(0,r.yg)("li",{parentName:"ul"},"Owner Additions / Removals")),(0,r.yg)("p",null,"& more, in real time."),(0,r.yg)("p",null,"DataHub Actions comes with open library of freely available Transformers, Actions, Events, and more."),(0,r.yg)("p",null,"Finally, the framework is highly configurable & scalable. Notable highlights include:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Distributed Actions"),": Ability to scale-out processing for a single action. Support for running the same Action configuration across multiple nodes to load balance the traffic from the event stream."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"At-least Once Delivery"),": Native support for independent processing state for each Action via post-processing acking to achieve at-least once semantics."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Robust Error Handling"),": Configurable failure policies featuring event-retry, dead letter queue, and failed-event continuation policy to achieve the guarantees required by your organization.")),(0,r.yg)("h3",{id:"use-cases"},"Use Cases"),(0,r.yg)("p",null,"Real-time use cases broadly fall into the following categories:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Notifications"),': Generate organization-specific notifications when a change is made on DataHub. For example, send an email to the governance team when a "PII" tag is added to any data asset.'),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Workflow Integration"),": Integrate DataHub into your organization's internal workflows. For example, create a Jira ticket when specific Tags or Terms are proposed on a Dataset."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Synchronization"),": Syncing changes made in DataHub into a 3rd party system. For example, reflecting Tag additions in DataHub into Snowflake."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Auditing"),": Audit who is making what changes on DataHub through time. ")),(0,r.yg)("p",null,"and more! "),(0,r.yg)("h2",{id:"concepts"},"Concepts"),(0,r.yg)("p",null,"The Actions Framework consists of a few core concepts--"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Pipelines")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Events")," and ",(0,r.yg)("strong",{parentName:"li"},"Event Sources")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Transformers")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("strong",{parentName:"li"},"Actions"))),(0,r.yg)("p",null,"Each of these will be described in detail below."),(0,r.yg)("p",{align:"center"},(0,r.yg)("img",{width:"70%",src:"https://raw.githubusercontent.com/datahub-project/static-assets/main/imgs/actions.png"})),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"In the Actions Framework, Events flow continuously from left-to-right.")," "),(0,r.yg)("h3",{id:"pipelines"},"Pipelines"),(0,r.yg)("p",null,"A ",(0,r.yg)("strong",{parentName:"p"},"Pipeline")," is a continuously running process which performs the following functions:"),(0,r.yg)("ol",null,(0,r.yg)("li",{parentName:"ol"},"Polls events from a configured Event Source (described below)"),(0,r.yg)("li",{parentName:"ol"},"Applies configured Transformation + Filtering to the Event "),(0,r.yg)("li",{parentName:"ol"},"Executes the configured Action on the resulting Event")),(0,r.yg)("p",null,"in addition to handling initialization, errors, retries, logging, and more. "),(0,r.yg)("p",null,"Each Action Configuration file corresponds to a unique Pipeline. In practice,\neach Pipeline has its very own Event Source, Transforms, and Actions. This makes it easy to maintain state for mission-critical Actions independently. "),(0,r.yg)("p",null,"Importantly, each Action must have a unique name. This serves as a stable identifier across Pipeline run which can be useful in saving the Pipeline's consumer state (ie. resiliency + reliability). For example, the Kafka Event Source (default) uses the pipeline name as the Kafka Consumer Group id. This enables you to easily scale-out your Actions by running multiple processes with the same exact configuration file. Each will simply become different consumers in the same consumer group, sharing traffic of the DataHub Events stream."),(0,r.yg)("h3",{id:"events"},"Events"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Events")," are data objects representing changes that have occurred on DataHub. Strictly speaking, the only requirement that the Actions framework imposes is that these objects must be "),(0,r.yg)("p",null,"a. Convertible to JSON\nb. Convertible from JSON"),(0,r.yg)("p",null,"So that in the event of processing failures, events can be written and read from a failed events file. "),(0,r.yg)("h4",{id:"event-types"},"Event Types"),(0,r.yg)("p",null,"Each Event instance inside the framework corresponds to a single ",(0,r.yg)("strong",{parentName:"p"},"Event Type"),', which is common name (e.g. "EntityChangeEvent_v1") which can be used to understand the shape of the Event. This can be thought of as a "topic" or "stream" name. That being said, Events associated with a single type are not expected to change in backwards-breaking ways across versons.'),(0,r.yg)("h3",{id:"event-sources"},"Event Sources"),(0,r.yg)("p",null,"Events are produced to the framework by ",(0,r.yg)("strong",{parentName:"p"},"Event Sources"),". Event Sources may include their own guarantees, configurations, behaviors, and semantics. They usually produce a fixed set of Event Types. "),(0,r.yg)("p",null,"In addition to sourcing events, Event Sources are also responsible for acking the succesful processing of an event by implementing the ",(0,r.yg)("inlineCode",{parentName:"p"},"ack")," method. This is invoked by the framework once the Event is guaranteed to have reached the configured Action successfully. "),(0,r.yg)("h3",{id:"transformers"},"Transformers"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Transformers")," are pluggable components which take an Event as input, and produce an Event (or nothing) as output. This can be used to enrich the information of an Event prior to sending it to an Action. "),(0,r.yg)("p",null,"Multiple Transformers can be configured to run in sequence, filtering and transforming an event in multiple steps."),(0,r.yg)("p",null,"Transformers can also be used to generate a completely new type of Event (i.e. registered at runtime via the Event Registry) which can subsequently serve as input to an Action. "),(0,r.yg)("p",null,"Transformers can be easily customized and plugged in to meet an organization's unqique requirements. For more information on developing a Transformer, check out ",(0,r.yg)("a",{parentName:"p",href:"/docs/0.14.1/actions/guides/developing-a-transformer"},"Developing a Transformer")),(0,r.yg)("h3",{id:"action"},"Action"),(0,r.yg)("p",null,(0,r.yg)("strong",{parentName:"p"},"Actions")," are pluggable components which take an Event as input and perform some business logic. Examples may be sending a Slack notification, logging to a file,\nor creating a Jira ticket, etc. "),(0,r.yg)("p",null,"Each Pipeline can be configured to have a single Action which runs after the filtering and transformations have occurred. "),(0,r.yg)("p",null,"Actions can be easily customized and plugged in to meet an organization's unqique requirements. For more information on developing a Action, check out ",(0,r.yg)("a",{parentName:"p",href:"/docs/0.14.1/actions/guides/developing-an-action"},"Developing a Action")))}y.isMDXComponent=!0}}]);