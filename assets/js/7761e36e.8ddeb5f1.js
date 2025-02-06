"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[82281],{15680:(e,t,a)=>{a.d(t,{xA:()=>p,yg:()=>y});var n=a(96540);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),g=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=g(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=g(a),c=r,y=u["".concat(l,".").concat(c)]||u[c]||d[c]||o;return a?n.createElement(y,s(s({ref:t},p),{},{components:a})):n.createElement(y,s({ref:t},p))}));function y(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,s=new Array(o);s[0]=c;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:r,s[1]=i;for(var g=2;g<o;g++)s[g]=a[g];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},98092:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>y,frontMatter:()=>i,metadata:()=>g,toc:()=>u});a(96540);var n=a(15680);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})),e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}const i={title:"Dagster Integration",slug:"/lineage/dagster",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/lineage/dagster.md"},l="Dagster Integration",g={unversionedId:"docs/lineage/dagster",id:"docs/lineage/dagster",title:"Dagster Integration",description:"This connector supports extracting:",source:"@site/genDocs/docs/lineage/dagster.md",sourceDirName:"docs/lineage",slug:"/lineage/dagster",permalink:"/docs/lineage/dagster",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/lineage/dagster.md",tags:[],version:"current",frontMatter:{title:"Dagster Integration",slug:"/lineage/dagster",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/lineage/dagster.md"},sidebar:"overviewSidebar",previous:{title:"Airflow Integration",permalink:"/docs/lineage/airflow"},next:{title:"OpenLineage",permalink:"/docs/lineage/openlineage"}},p={},u=[{value:"Supported Versions",id:"supported-versions",level:2},{value:"Using DataHub&#39;s Dagster Sensor",id:"using-datahubs-dagster-sensor",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Setup",id:"setup",level:3},{value:"How to Validate Installation",id:"how-to-validate-installation",level:3},{value:"Capturing Table Lineage",id:"capturing-table-lineage",level:2},{value:"Extracting Lineage from SQL Queries",id:"extracting-lineage-from-sql-queries",level:3},{value:"But First: Extracting Asset Identifiers",id:"but-first-extracting-asset-identifiers",level:4},{value:"Extracting Lineage using SnowflakePandasIOManager",id:"extracting-lineage-using-snowflakepandasiomanager",level:3},{value:"Using Dagster Ins and Out",id:"using-dagster-ins-and-out",level:3},{value:"Using Custom Logic for Extracting Lineage",id:"using-custom-logic-for-extracting-lineage",level:3},{value:"Debugging",id:"debugging",level:2},{value:"Connection Error for DataHub Rest URL",id:"connection-error-for-datahub-rest-url",level:3}],d={toc:u},c="wrapper";function y(e){var{components:t}=e,a=s(e,["components"]);return(0,n.yg)(c,o(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){r(e,t,a[t])}))}return e}({},d,a),{components:t,mdxType:"MDXLayout"}),(0,n.yg)("h1",{id:"dagster-integration"},"Dagster Integration"),(0,n.yg)("p",null,"This connector supports extracting:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Dagster Pipeline and Task Metadata"),(0,n.yg)("li",{parentName:"ul"},"Pipeline Run Status"),(0,n.yg)("li",{parentName:"ul"},"Table Lineage")),(0,n.yg)("p",null,"from Dagster."),(0,n.yg)("h2",{id:"supported-versions"},"Supported Versions"),(0,n.yg)("p",null,"This integration was verified using Dagster 1.7.0+. That does not necessary mean it will not be compatible will older versions. "),(0,n.yg)("h2",{id:"using-datahubs-dagster-sensor"},"Using DataHub's Dagster Sensor"),(0,n.yg)("p",null,"Dagster Sensors allow us to perform actions when important events occur in Dagster. DataHub's Dagster Sensor allows you to emit metadata after every Dagster pipeline run. This sensor can emit Pipelines, Tasks, and run results. For more details about Dagster Sensors, please refer to ",(0,n.yg)("a",{parentName:"p",href:"https://docs.dagster.io/concepts/partitions-schedules-sensors/sensors"},"the documentation"),"."),(0,n.yg)("h3",{id:"prerequisites"},"Prerequisites"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Create a Dagster project. See ",(0,n.yg)("a",{parentName:"li",href:"https://docs.dagster.io/getting-started/create-new-project"},"Create New Project"),"."),(0,n.yg)("li",{parentName:"ol"},"Create a ",(0,n.yg)("a",{parentName:"li",href:"https://docs.dagster.io/_apidocs/definitions#dagster.Definitions"},"Definitions")," class or ",(0,n.yg)("a",{parentName:"li",href:"https://docs.dagster.io/concepts/repositories-workspaces/repositories#repositories"},"Repositories"),"."),(0,n.yg)("li",{parentName:"ol"},"The creation of a new Dagster project via the UI uses the Definition class to define Dagster pipelines.")),(0,n.yg)("h3",{id:"setup"},"Setup"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Install the DataHub Dagster plugin package:"),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-shell"},"pip install acryl_datahub_dagster_plugin\n"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Import the DataHub Dagster Sensor, which is provided in the plugin package, to your Dagster Definition or Repository before starting the Dagster UI:"),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("strong",{parentName:"p"},"Example Definitions Class:")),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre",className:"language-python"},"{{ inline /metadata-ingestion-modules/dagster-plugin/examples/basic_setup.py }}\n"))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"The DataHub Dagster plugin-provided sensor internally uses the following configurations. You can override the default config values using environment variables."),(0,n.yg)("p",{parentName:"li"},(0,n.yg)("strong",{parentName:"p"},"Configuration options:")),(0,n.yg)("table",{parentName:"li"},(0,n.yg)("thead",{parentName:"table"},(0,n.yg)("tr",{parentName:"thead"},(0,n.yg)("th",{parentName:"tr",align:null},"Configuration Option"),(0,n.yg)("th",{parentName:"tr",align:null},"Default Value"),(0,n.yg)("th",{parentName:"tr",align:null},"Description"))),(0,n.yg)("tbody",{parentName:"table"},(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"datahub_client_config"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"The DataHub client config")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"dagster_url"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"The URL to your Dagster Webserver.")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"capture_asset_materialization"),(0,n.yg)("td",{parentName:"tr",align:null},"True"),(0,n.yg)("td",{parentName:"tr",align:null},"Whether to capture asset keys as DataHub Datasets on AssetMaterialization event")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"capture_input_output"),(0,n.yg)("td",{parentName:"tr",align:null},"True"),(0,n.yg)("td",{parentName:"tr",align:null},"Whether to capture and try to parse input and output from HANDLED_OUTPUT, LOADED_INPUT events. (currently only ",(0,n.yg)("a",{parentName:"td",href:"https://github.com/dagster-io/dagster/blob/7e08c05dcecef9fd07f887c7846bd1c9a90e7d84/python_modules/dagster/dagster/_core/definitions/metadata/__init__.py#L655"},"PathMetadataValue")," metadata supported (EXPERIMENTAL)")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"platform_instance"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"The instance of the platform that all assets produced by this recipe belong to. It is optional")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"asset_lineage_extractor"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"You can implement your own logic to capture asset lineage information. See example for details[]")),(0,n.yg)("tr",{parentName:"tbody"},(0,n.yg)("td",{parentName:"tr",align:null},"enable_asset_query_metadata_parsing"),(0,n.yg)("td",{parentName:"tr",align:null}),(0,n.yg)("td",{parentName:"tr",align:null},"Whether to enable parsing query from asset metadata. See below for details[]"))))),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Once the Dagster UI is running, turn on the provided Sensor execution. To turn on the Sensor, click on the ",(0,n.yg)("strong",{parentName:"p"},"Overview")," tab and then on the ",(0,n.yg)("strong",{parentName:"p"},"Sensors")," tab. Simply toggle the DataHub sensor on."))),(0,n.yg)("p",null,"Woohoo! Now, the DataHub Sensor is ready to emit metadata after every pipeline run."),(0,n.yg)("h3",{id:"how-to-validate-installation"},"How to Validate Installation"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Navigate to the Dagster UI.")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Go to ",(0,n.yg)("strong",{parentName:"p"},"Overview")," > ",(0,n.yg)("strong",{parentName:"p"},"Sensors")," and look for ",(0,n.yg)("inlineCode",{parentName:"p"},"datahub_sensor"),".")),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("p",{parentName:"li"},"Start a Dagster Job. In the daemon logs, you should see DataHub-related log messages:"),(0,n.yg)("pre",{parentName:"li"},(0,n.yg)("code",{parentName:"pre"},"datahub_sensor - Emitting metadata...\n")),(0,n.yg)("p",{parentName:"li"},"This means that DataHub's sensor is correctly configured to emit metadata to DataHub."))),(0,n.yg)("h2",{id:"capturing-table-lineage"},"Capturing Table Lineage"),(0,n.yg)("p",null,"There are a few ways to extract lineage, or relationships between tables, from Dagster. We recommend one or more of the following approaches to extract lineage automatically."),(0,n.yg)("h3",{id:"extracting-lineage-from-sql-queries"},"Extracting Lineage from SQL Queries"),(0,n.yg)("h4",{id:"but-first-extracting-asset-identifiers"},"But First: Extracting Asset Identifiers"),(0,n.yg)("p",null,"When naming Dagster Assets, we recommend the following structure:"),(0,n.yg)("p",null,(0,n.yg)("inlineCode",{parentName:"p"},'key_prefix=["env", "platform", "db_name", "schema_name"]')),(0,n.yg)("p",null,"This ensures that we correctly resolve the Asset name to a Dataset URN in DataHub."),(0,n.yg)("p",null,"For example:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'@asset(\n    key_prefix=["prod", "snowflake", "db_name", "schema_name"], # the fqdn asset name to be able to identify platform and make sure the asset is unique\n    deps=[iris_dataset],\n)\n')),(0,n.yg)("p",null,"If you properly name your Dagster Asset, you can establish a connection between the Asset and the dataset it is referring to, which is likely already stored in DataHub. This allows for accurate tracking and lineage information in the next steps."),(0,n.yg)("p",null,"If you follow a different naming convention, you can create your own ",(0,n.yg)("inlineCode",{parentName:"p"},"asset_keys_to_dataset_urn_converter")," logic and set a custom callback function. This can be used to generate a DataHub Dataset URN in any way you please, from metadata or otherwise."),(0,n.yg)("p",null,"Here is an example that can create a DataHub URN from the Asset key naming convention specified above:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'def asset_keys_to_dataset_urn_converter(\n    self, asset_key: Sequence[str]\n) -> Optional[DatasetUrn]:\n    """\n    Convert asset key to dataset urn\n\n    By default, we assume the following asset key structure:\n    key_prefix=["prod", "snowflake", "db_name", "schema_name"]\n    """\n    if len(asset_key) >= 3:\n        return DatasetUrn(\n            platform=asset_key[1],\n            env=asset_key[0],\n            name=".".join(asset_key[2:]),\n        )\n    else:\n        return None\n')),(0,n.yg)("p",null,"DataHub's Dagster integration can automatically detect dataset inputs and outputs for Software Defined Assets by analyzing the SQL queries it executes. To enable this feature, simply add the executed query to the Asset Metadata using the ",(0,n.yg)("inlineCode",{parentName:"p"},"Query")," tag."),(0,n.yg)("p",null,"Here's an example of a Software Defined Asset with an annotated Query:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'@asset(key_prefix=["prod", "snowflake", "db_name", "schema_name"])\ndef my_asset_table_a(snowflake: SnowflakeResource) -> MaterializeResult:\n    query = """\n        create or replace table db_name.schema_name.my_asset_table_a as (\n            SELECT *\n            FROM db_name.schema_name.my_asset_table_b\n        );\n    """\n    with snowflake.get_connection() as connection:\n        with connection.cursor() as cursor:\n            cursor.execute(query)\n    return MaterializeResult(\n        metadata={\n            "Query": MetadataValue.text(query),\n        }\n    )\n')),(0,n.yg)("p",null,"In this example, the plugin will automatically identify and set the upstream lineage as ",(0,n.yg)("inlineCode",{parentName:"p"},"db_name.schema_name.my_asset_table_b"),"."),(0,n.yg)("p",null,"Note: Proper asset naming is crucial, as the query parser determines the query language from the generated URN. In the example above, it will be ",(0,n.yg)("inlineCode",{parentName:"p"},"snowflake"),"."),(0,n.yg)("p",null,"For a complete example job, refer to the ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion-modules/dagster-plugin/examples/iris.py"},"iris.py file")," in the DataHub repository."),(0,n.yg)("h3",{id:"extracting-lineage-using-snowflakepandasiomanager"},"Extracting Lineage using SnowflakePandasIOManager"),(0,n.yg)("p",null,"The plugin offers an extended version of base SnowflakePandasIOManager provided by Dagster called ",(0,n.yg)("inlineCode",{parentName:"p"},"DataHubSnowflakePandasIOManager"),". This version automatically captures Snowflake assets created by the IO manager and adds DataHub URN and links to the assets in Dagster."),(0,n.yg)("p",null,"To use it, simply replace ",(0,n.yg)("inlineCode",{parentName:"p"},"SnowflakePandasIOManager")," with ",(0,n.yg)("inlineCode",{parentName:"p"},"DataHubSnowflakePandasIOManager"),". The enhanced version accepts two additional parameters:"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("inlineCode",{parentName:"li"},"datahub_base_url"),": The base URL of the DataHub UI, used to generate direct links to Snowflake Datasets in DataHub. If not set, no URL will be generated."),(0,n.yg)("li",{parentName:"ol"},(0,n.yg)("inlineCode",{parentName:"li"},"datahub_env"),": The DataHub environment to use when generating URNs. Defaults to ",(0,n.yg)("inlineCode",{parentName:"li"},"PROD")," if not specified.")),(0,n.yg)("p",null,"Example usage:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},'from datahub_dagster_plugin.modules.snowflake_pandas.datahub_snowflake_pandas_io_manager import (\n    DataHubSnowflakePandasIOManager,\n)\n# ...\nresources={\n    "snowflake_io_manager": DataHubSnowflakePandasIOManager(\n        database="MY_DB",\n        account="my_snowflake_account",\n        warehouse="MY_WAREHOUSE",\n        user="my_user",\n        password="my_password",\n        role="my_role",\n        datahub_base_url="http://localhost:9002",\n    ),\n}\n')),(0,n.yg)("h3",{id:"using-dagster-ins-and-out"},"Using Dagster Ins and Out"),(0,n.yg)("p",null,"We can provide inputs and outputs to both Assets and Ops explicitly using a dictionary of ",(0,n.yg)("inlineCode",{parentName:"p"},"Ins")," and ",(0,n.yg)("inlineCode",{parentName:"p"},"Out")," corresponding to the decorated function arguments. While providing inputs and outputs, we can provide additional metadata as well."),(0,n.yg)("p",null,"To create dataset upstream and downstream dependency for the Assets and Ops, you can use an ins and out dictionary with metadata provided. For reference, look at the sample jobs created using assets ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion-modules/dagster-plugin/examples/assets_job.py"},(0,n.yg)("inlineCode",{parentName:"a"},"assets_job.py")),", or ops ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion-modules/dagster-plugin/examples/ops_job.py"},(0,n.yg)("inlineCode",{parentName:"a"},"ops_job.py")),"."),(0,n.yg)("h3",{id:"using-custom-logic-for-extracting-lineage"},"Using Custom Logic for Extracting Lineage"),(0,n.yg)("p",null,"You can define your own logic to capture asset lineage information."),(0,n.yg)("p",null,"The output Tuple contains two dictionaries, one for input assets and the other for output assets. The key of the dictionary is the op key and the value is the set of asset URNs that are upstream or downstream of the op."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-python"},"from datahub_dagster_plugin.client.dagster_generator import DagsterGenerator, DatasetLineage\n\ndef asset_lineage_extractor(\n    context: RunStatusSensorContext,\n    dagster_generator: DagsterGenerator,\n    graph: DataHubGraph,\n) -> Dict[str, DatasetLineage]:\n    dataset_lineage: Dict[str, DatasetLineage] = {}\n\n    # Extracting input and output assets from the context\n    return dataset_lineage\n")),(0,n.yg)("p",null,(0,n.yg)("a",{parentName:"p",href:"https://github.com/datahub-project/datahub/blob/master/metadata-ingestion-modules/dagster-plugin/examples/advanced_ops_jobs.py"},"See an example job here"),"."),(0,n.yg)("h2",{id:"debugging"},"Debugging"),(0,n.yg)("h3",{id:"connection-error-for-datahub-rest-url"},"Connection Error for DataHub Rest URL"),(0,n.yg)("p",null,"If you get ",(0,n.yg)("inlineCode",{parentName:"p"},"ConnectionError: HTTPConnectionPool(host='localhost', port=8080)"),", then in that case your DataHub GMS service is not up."))}y.isMDXComponent=!0}}]);