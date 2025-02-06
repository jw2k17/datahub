"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[37537],{55314:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>p,default:()=>h,frontMatter:()=>u,metadata:()=>d,toc:()=>c});n(96540);var s=n(15680),r=n(53720),a=n(5400);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function l(e,t){if(null==e)return{};var n,s,r=function(e,t){if(null==e)return{};var n,s,r={},a=Object.keys(e);for(s=0;s<a.length;s++)n=a[s],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(s=0;s<a.length;s++)n=a[s],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}const u={title:"Custom Assertions",slug:"/api/tutorials/custom-assertions",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/custom-assertions.md"},p="Custom Assertions",d={unversionedId:"docs/api/tutorials/custom-assertions",id:"docs/api/tutorials/custom-assertions",title:"Custom Assertions",description:"This guide specifically covers how to create and report results for custom assertions in DataHub.",source:"@site/genDocs/docs/api/tutorials/custom-assertions.md",sourceDirName:"docs/api/tutorials",slug:"/api/tutorials/custom-assertions",permalink:"/docs/api/tutorials/custom-assertions",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/custom-assertions.md",tags:[],version:"current",frontMatter:{title:"Custom Assertions",slug:"/api/tutorials/custom-assertions",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/api/tutorials/custom-assertions.md"},sidebar:"overviewSidebar",previous:{title:"Assertions",permalink:"/docs/api/tutorials/assertions"},next:{title:"Incidents",permalink:"/docs/api/tutorials/incidents"}},m={},c=[{value:"Goal Of This Guide",id:"goal-of-this-guide",level:2},{value:"Prerequisites",id:"prerequisites",level:2},{value:"Create And Update Custom Assertions",id:"create-and-update-custom-assertions",level:2},{value:"Report Results For Custom Assertions",id:"report-results-for-custom-assertions",level:2},{value:"Retrieve Results For Custom Assertions",id:"retrieve-results-for-custom-assertions",level:2},{value:"Get Assertions for Dataset",id:"get-assertions-for-dataset",level:3},{value:"Get Assertion Details",id:"get-assertion-details",level:3}],y={toc:c},g="wrapper";function h(e){var{components:t}=e,n=l(e,["components"]);return(0,s.yg)(g,i(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},s=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),s.forEach((function(t){o(e,t,n[t])}))}return e}({},y,n),{components:t,mdxType:"MDXLayout"}),(0,s.yg)("h1",{id:"custom-assertions"},"Custom Assertions"),(0,s.yg)("p",null,"This guide specifically covers how to create and report results for custom assertions in DataHub.\nCustom Assertions are those not natively run or directly modeled by DataHub, and managed by a 3rd party framework or tool."),(0,s.yg)("p",null,"To create ",(0,s.yg)("em",{parentName:"p"},"native")," assertions using the API (e.g. for DataHub to manage), please refer to the ",(0,s.yg)("a",{parentName:"p",href:"/docs/api/tutorials/assertions"},"Assertions API"),"."),(0,s.yg)("p",null,"This guide may be used as reference for partners seeking to integrate their own monitoring tools with DataHub."),(0,s.yg)("h2",{id:"goal-of-this-guide"},"Goal Of This Guide"),(0,s.yg)("p",null,"In this guide, you will learn how to "),(0,s.yg)("ol",null,(0,s.yg)("li",{parentName:"ol"},"Create and update custom assertions via GraphQL and Python APIs"),(0,s.yg)("li",{parentName:"ol"},"Report results for custom assertions via GraphQL and Python APIs"),(0,s.yg)("li",{parentName:"ol"},"Retrieve results for custom assertions via GraphQL and Python APIs"),(0,s.yg)("li",{parentName:"ol"},"Delete custom assertions via GraphQL and Python APIs")),(0,s.yg)("h2",{id:"prerequisites"},"Prerequisites"),(0,s.yg)("p",null,"The actor making API calls must have the ",(0,s.yg)("inlineCode",{parentName:"p"},"Edit Assertions")," and ",(0,s.yg)("inlineCode",{parentName:"p"},"Edit Monitors")," privileges for the Tables being monitored."),(0,s.yg)("h2",{id:"create-and-update-custom-assertions"},"Create And Update Custom Assertions"),(0,s.yg)("p",null,"You may create custom assertions using the following APIs for a Dataset in DataHub. "),(0,s.yg)(r.A,{mdxType:"Tabs"},(0,s.yg)(a.A,{value:"graphql",label:"GraphQL",default:!0,mdxType:"TabItem"},(0,s.yg)("p",null,"To create a new assertion, use the ",(0,s.yg)("inlineCode",{parentName:"p"},"upsertCustomAssertion")," GraphQL Mutation. This mutation both allows you to\ncreate and update a given assertion."),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation upsertCustomAssertion {\n    upsertCustomAssertion(\n        urn: "urn:li:assertion:my-custom-assertion-id", # Optional: if you want to provide a custom id. If not, one will be generated for you.\n        input: {\n            entityUrn: "<urn of entity being monitored>",\n            type: "My Custom Category", # This is how your assertion will appear categorized in DataHub. \n            description: "The description of my external assertion for my dataset",\n            platform: {\n                urn: "urn:li:dataPlatform:great-expectations", # OR you can provide name: "My Custom Platform" if you do not have an URN for the platform. \n            }\n            fieldPath: "field_foo", # Optional: if you want to associated with a specific field,\n            externalUrl: "https://my-monitoring-tool.com/result-for-this-assertion" # Optional: if you want to provide a link to the monitoring tool\n            # Optional: If you want to provide a custom SQL query for the assertion. This will be rendered as a query in the UI. \n            # logic: "SELECT * FROM X WHERE Y"\n      }\n  ) {\n      urn\n    }\n}\n')),(0,s.yg)("p",null,"Note that you can either provide a unique ",(0,s.yg)("inlineCode",{parentName:"p"},"urn")," for the assertion, which will be used to generate the corresponding assertion urn in the following format:"),(0,s.yg)("p",null,(0,s.yg)("inlineCode",{parentName:"p"},"urn:li:assertion:<your-new-assertion-id>")),(0,s.yg)("p",null,"or a random urn will be created and returned for you. This id should be stable over time and unique for each assertion."),(0,s.yg)("p",null,"The upsert API will return the unique identifier (URN) for the the assertion if you were successful:"),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-json"},'{\n  "data": {\n    "upsertExternalAssertion": {\n      "urn": "urn:li:assertion:your-new-assertion-id"\n    }\n  },\n  "extensions": {}\n}\n'))),(0,s.yg)(a.A,{value:"python",label:"Python",mdxType:"TabItem"},(0,s.yg)("p",null,"To upsert an assertion in Python, simply use the ",(0,s.yg)("inlineCode",{parentName:"p"},"upsert_external_assertion")," method on the DataHub Client object. "),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-python"},'# Inlined from /metadata-ingestion/examples/library/upsert_custom_assertion.py\nimport logging\n\nfrom datahub.ingestion.graph.client import DatahubClientConfig, DataHubGraph\n\nlog = logging.getLogger(__name__)\n\ngraph = DataHubGraph(\n    config=DatahubClientConfig(\n        server="http://localhost:8080",\n    )\n)\n\nnew_assertion_urn = "urn:li:assertion:my-unique-assertion-id"\n\n# Upsert the assertion\nres = graph.upsert_custom_assertion(\n    urn=new_assertion_urn,  # If the assertion already exists, provide the URN\n    entity_urn="<urn of entity being monitored>",\n    type="My Custom Category",  # This categorizes your assertion in DataHub\n    description="The description of my external assertion for my dataset",\n    platform_urn="urn:li:dataPlatform:great-expectations",  # OR you can provide \'platformName="My Custom Platform"\'\n    field_path="field_foo",  # Optional: if you want to associate it with a specific field\n    external_url="https://my-monitoring-tool.com/result-for-this-assertion",  # Optional: link to monitoring tool\n    logic="SELECT * FROM X WHERE Y",  # Optional: custom SQL for the assertion, rendered in the UI\n)\n\nif res is not None:\n    log.info(f"Upserted assertion with urn: {new_assertion_urn}")\n\n')))),(0,s.yg)("h2",{id:"report-results-for-custom-assertions"},"Report Results For Custom Assertions"),(0,s.yg)("p",null,"When an assertion is evaluated against a Dataset, or a new result is available, you can report the result to DataHub\nusing the following APIs. "),(0,s.yg)("p",null,"Once reported, these will appear in the evaluation history of the assertion and will be used to determine whether the assertion is\ndisplayed as passing or failing in the DataHub UI."),(0,s.yg)(r.A,{mdxType:"Tabs"},(0,s.yg)(a.A,{value:"graphql",label:"GraphQL",default:!0,mdxType:"TabItem"},(0,s.yg)("p",null,"To report results for a custom, use the ",(0,s.yg)("inlineCode",{parentName:"p"},"reportAssertionResult")," GraphQL Mutation. This mutation both allows you to\ncreate and update a given assertion."),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-graphql"},'mutation reportAssertionResult {\n    reportAssertionResult(\n        urn: "urn:li:assertion:<your-new-assertion-id>"\n        result: {\n            timestampMillis: 1620000000, # Unix timestamp in millis. If not provided, the current time will be used.\n            type: SUCCESS,  # or FAILURE or ERROR or INIT\n            properties: [\n                {\n                    key: "my_custom_key",\n                    value: "my_custom_value"\n                }\n            ],\n            externalUrl: "https://my-great-expectations.com/results/1234", # Optional: URL to the results in the external tool\n            # Optional: If the type is ERROR, you can provide additional context. See full list of error types below. \n            # error: {\n            #    type: UNKNOWN_ERROR,\n            #    message: "The assertion failed due to an unknown error"\n            # }\n      }\n  )\n}\n')),(0,s.yg)("p",null,"The ",(0,s.yg)("inlineCode",{parentName:"p"},"type")," field is used to communicate the latest health status of the assertion."),(0,s.yg)("p",null,"The ",(0,s.yg)("inlineCode",{parentName:"p"},"properties")," field is used to provide additional key-value pair context that will be displayed alongside the result\nin DataHub's UI. "),(0,s.yg)("p",null,"The full list of supported error types include:"),(0,s.yg)("ul",null,(0,s.yg)("li",{parentName:"ul"},"SOURCE_CONNECTION_ERROR"),(0,s.yg)("li",{parentName:"ul"},"SOURCE_QUERY_FAILED"),(0,s.yg)("li",{parentName:"ul"},"INSUFFICIENT_DATA"),(0,s.yg)("li",{parentName:"ul"},"INVALID_PARAMETERS"),(0,s.yg)("li",{parentName:"ul"},"INVALID_SOURCE_TYPE"),(0,s.yg)("li",{parentName:"ul"},"UNSUPPORTED_PLATFORM"),(0,s.yg)("li",{parentName:"ul"},"CUSTOM_SQL_ERROR"),(0,s.yg)("li",{parentName:"ul"},"FIELD_ASSERTION_ERROR"),(0,s.yg)("li",{parentName:"ul"},"UNKNOWN_ERROR")),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-json"},'{\n  "data": {\n    "reportAssertionResult": true\n  },\n  "extensions": {}\n}\n')),(0,s.yg)("p",null,"If the result is ",(0,s.yg)("inlineCode",{parentName:"p"},"true"),", the result was successfully reported.")),(0,s.yg)(a.A,{value:"python",label:"Python",mdxType:"TabItem"},(0,s.yg)("p",null,"To report an assertion result in Python, simply use the ",(0,s.yg)("inlineCode",{parentName:"p"},"report_assertion_result")," method on the DataHub Client object."),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-python"},'# Inlined from /metadata-ingestion/examples/library/report_assertion_result.py\nimport logging\nimport time\n\nfrom datahub.ingestion.graph.client import DatahubClientConfig, DataHubGraph\n\nlog = logging.getLogger(__name__)\n\ngraph = DataHubGraph(\n    config=DatahubClientConfig(\n        server="http://localhost:8080",\n    )\n)\n\nexisting_assertion_urn = "urn:li:assertion:my-unique-assertion-id"\n\n# Report result for assertion\nres = graph.report_assertion_result(\n    urn="urn:li:assertion:<your-new-assertion-id>",  # Replace with your actual assertion URN\n    timestamp_millis=int(time.time() * 1000),  # Current Unix timestamp in milliseconds\n    type="SUCCESS",  # Can be \'SUCCESS\', \'FAILURE\', \'ERROR\', or \'INIT\'\n    properties=[{"key": "my_custom_key", "value": "my_custom_value"}],\n    external_url="https://my-great-expectations.com/results/1234",  # Optional: URL to the results in the external tool\n    # Uncomment the following section and use if type is \'ERROR\'\n    # error_type="UNKNOWN_ERROR",\n    # error_message="The assertion failed due to an unknown error"\n)\n\nif res:\n    log.info("Successfully reported Assertion Result!")\n\n')))),(0,s.yg)("h2",{id:"retrieve-results-for-custom-assertions"},"Retrieve Results For Custom Assertions"),(0,s.yg)("p",null,"After an assertion has been created and run, it will appear in the set of assertions associated with a given dataset urn.\nYou can retrieve the results of these assertions using the following APIs."),(0,s.yg)(r.A,{mdxType:"Tabs"},(0,s.yg)(a.A,{value:"graphql",label:"GraphQL",default:!0,mdxType:"TabItem"},(0,s.yg)("h3",{id:"get-assertions-for-dataset"},"Get Assertions for Dataset"),(0,s.yg)("p",null,"To retrieve all the assertions for a table / dataset, you can use the following GraphQL Query."),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-graphql"},'query dataset {\n    dataset(urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,purchases,PROD)") {\n        assertions(start: 0, count: 1000) {\n            start\n            count\n            total\n            assertions {\n                urn\n                # Fetch the last run of each associated assertion. \n                runEvents(status: COMPLETE, limit: 1) {\n                    total\n                    failed\n                    succeeded\n                    runEvents {\n                        timestampMillis\n                        status\n                        result {\n                            type\n                            nativeResults {\n                                key\n                                value\n                            }\n                        }\n                    }\n                }\n                info {\n                    type # Will be CUSTOM\n                    customType # Will be your custom type. \n                    description\n                    lastUpdated {\n                        time\n                        actor\n                    }\n                    customAssertion {\n                        entityUrn\n                        fieldPath\n                        externalUrl\n                        logic\n                    }\n                    source {\n                        type\n                        created {\n                            time\n                            actor\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n')),(0,s.yg)("h3",{id:"get-assertion-details"},"Get Assertion Details"),(0,s.yg)("p",null,"You can use the following GraphQL query to fetch the details for an assertion along with its evaluation history by URN."),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-graphql"},'query getAssertion {\n    assertion(urn: "urn:li:assertion:my-custom-assertion-id") {\n        urn\n        # Fetch the last 10 runs for the assertion. \n        runEvents(status: COMPLETE, limit: 10) {\n            total\n            failed\n            succeeded\n            runEvents {\n                timestampMillis\n                status\n                result {\n                    type\n                    nativeResults {\n                        key\n                        value\n                    }\n                }\n            }\n        }\n        info {\n            type # Will be CUSTOM\n            customType # Will be your custom type. \n            description\n            lastUpdated {\n                time \n                actor\n            }\n            customAssertion {\n                entityUrn\n                fieldPath\n                externalUrl\n                logic\n            }\n            source {\n                type\n                created {\n                    time\n                    actor\n                }\n            }\n        }\n        # Fetch what entities have the assertion attached to it\n        relationships(input: {\n            types: ["Asserts"]\n            direction: OUTGOING\n        }) {\n            total\n            relationships {\n                entity {\n                    urn\n                }\n            }\n        }\n    }\n}\n')))))}h.isMDXComponent=!0}}]);