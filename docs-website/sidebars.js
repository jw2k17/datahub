const fs = require("fs");

function list_ids_in_directory(directory, hardcoded_labels) {
  if (hardcoded_labels === undefined) {
    hardcoded_labels = {};
  }

  const files = fs.readdirSync(`../${directory}`).sort();
  let ids = [];
  for (const name of files) {
    if (fs.lstatSync(`../${directory}/${name}`).isDirectory()) {
      // Recurse into the directory.
      const inner_ids = list_ids_in_directory(`${directory}/${name}`);
      ids = ids.concat(inner_ids);
    } else {
      if (name.endsWith(".md")) {
        const slug = name.replace(/\.md$/, "");
        const id = `${directory}/${slug}`;

        if (id in hardcoded_labels) {
          label = hardcoded_labels[id];
          ids.push({ type: "doc", id, label });
        } else {
          ids.push({ type: "doc", id });
        }
      }
    }
  }
  return ids;
}

// note: to handle errors where you don't want a markdown file in the sidebar, add it as a comment.
// this will fix errors like `Error: File not accounted for in sidebar: ...`
module.exports = {
  // users
  // architects
  // modelers
  // developers
  // operators

  overviewSidebar: {
    "What is DataHub?": [
      // By the end of this section, readers should understand the core use cases that DataHub addresses,
      // target end-users, high-level architecture, & hosting options

      // "docs/wip/what-is-datahub",
      "docs/features",
      {
        Architecture: [
          "docs/architecture/architecture",
          "docs/components",
          "docs/architecture/metadata-ingestion",
          "docs/architecture/metadata-serving",
        ],
      },
      "docs/demo", // rename this to "DataHub Demo"
      "docs/saas",
    ],
    "Get Started": [
      // The goal of this section is to provide the bare-minimum steps required to:
      //   - Get DataHub Running
      //   - Optionally configure SSO
      //   - Add/invite Users
      //   - Create Polices & assign roles
      //   - Ingest at least one source (ie. data warehouse)
      //   - Understand high-level options for enriching metadata
      "docs/get-started-with-datahub",
      {
        "Self-Hosted DataHub": [
          "docs/quickstart",
          // "docs/wip/configure-sso",
          "docs/authentication/guides/add-users",
          // "docs/wip/invite-with-email-link",
          // "docs/wip/create-policies",
          // "docs/wip/guide-ingest-your-first-metadata-source",
          // "docs/wip/guide-enrich-your-metadata", // remove this; add in enrichment detail in ingest-your-first-source
        ],
      },
      {
        "Managed DataHub": [
          // {
          //   type: "doc",
          //   id: "docs/wip/managed-datahub-setup",
          //   className: "saasOnly",
          // },
          // {
          //   type: "doc",
          //   id: "docs/wip/configure-sso",
          //   className: "saasOnly",
          // },
          "docs/authentication/guides/add-users",
          // "docs/wip/invite-with-email-link",
          // "docs/wip/create-policies",
          {
            type: "doc",
            id: "docs/managed-datahub/saas-slack-setup",
            className: "saasOnly",
          },
          {
            type: "doc",
            id: "docs/managed-datahub/approval-workflows",
            className: "saasOnly",
          },
          // "docs/wip/guide-ingest-your-first-metadata-source",
          // "docs/wip/guide-enrich-your-metadata",
        ],
      },
      {
        "Ingestion Quickstart Guides": [
          {
            BigQuery: [
              "docs/quick-ingestion-guides/bigquery/overview",
              "docs/quick-ingestion-guides/bigquery/setup",
              "docs/quick-ingestion-guides/bigquery/configuration",
            ],
          },
          {
            Snowflake: [
              "docs/quick-ingestion-guides/snowflake/overview",
              "docs/quick-ingestion-guides/snowflake/setup",
              "docs/quick-ingestion-guides/snowflake/configuration",
            ],
          },
        ],
      },
    ],
    "Ingest Metadata": [
      // The purpose of this section is to provide a deeper understanding of how ingestion works.
      // Readers should be able to find details for ingesting from all systems, apply transformers, understand sinks,
      // and understand key concepts of the Ingestion Framework (Sources, Sinks, Transformers, and Recipes)
      {
        Overview: [
          "metadata-ingestion/README",
          // "docs/wip/ingestion-overview",
          "docs/ui-ingestion",
        ],
      },

      // {
      //   "Shift Left": [
      //     // "docs/wip/importance-of-shift-left",
      //   ],
      // },
      {
        Sources: [
          // collapse these; add push-based at top
          {
            Airflow: ["docs/lineage/airflow", "docker/airflow/local_airflow"],
          },
          "metadata-integration/java/spark-lineage/README",
          "metadata-ingestion/integration_docs/great-expectations",
          "metadata-integration/java/datahub-protobuf/README",
          //"metadata-ingestion/source-docs-template",
          {
            type: "autogenerated",
            dirName: "docs/generated/ingestion/sources", // '.' means the current docs folder
          },
        ],
      },
      {
        Sinks: list_ids_in_directory("metadata-ingestion/sink_docs"),
      },
      {
        Transformers: [
          "metadata-ingestion/docs/transformer/intro",
          "metadata-ingestion/docs/transformer/dataset_transformer",
        ],
      },
      {
        "Advanced Guides": [
          {
            "Scheduling Ingestion": [
              "metadata-ingestion/schedule_docs/intro",
              "metadata-ingestion/schedule_docs/cron",
              "metadata-ingestion/schedule_docs/airflow",
              "metadata-ingestion/schedule_docs/kubernetes",
            ],
          },
          // {
          //   type: "doc",
          //   id: "docs/wip/remote-ingestion-executor-on-AWS",
          //   className: "saasOnly",
          // },
          "docs/platform-instances",
          "metadata-ingestion/docs/dev_guides/stateful",
          "metadata-ingestion/docs/dev_guides/classification",
          "metadata-ingestion/docs/dev_guides/add_stateful_ingestion_to_source",
          "metadata-ingestion/docs/dev_guides/sql_profiles",
        ],
      },
    ],
    "Enrich Metadata": [
      // The purpose of this section is to provide direction on how to enrich metadata when shift-left isn’t an option
      // "docs/wip/csv-enrichment",
      // "docs/wip/ui-based-enrichment",
      "docs/enrich-metadata",
      "docs/domains",
      "docs/glossary/business-glossary",
      "docs/tags",
      {
        Lineage: ["docs/lineage/intro", "docs/lineage/sample_code"],
      },
    ],

    "Act on Metadata": [
      "docs/act-on-metadata",
      {
        "Actions Framework": [
          "docs/actions/README",
          "docs/actions/quickstart",
          "docs/actions/concepts",
          {
            Sources: [
              {
                type: "autogenerated",
                dirName: "docs/actions/sources",
              },
            ],
          },
          {
            Events: [
              {
                type: "autogenerated",
                dirName: "docs/actions/events",
              },
            ],
          },
          {
            Actions: [
              {
                type: "autogenerated",
                dirName: "docs/actions/actions",
              },
            ],
          },
          {
            Guides: [
              {
                type: "autogenerated",
                dirName: "docs/actions/guides",
              },
            ],
          },
        ],
      },
      {
        type: "doc",
        id: "docs/tests/metadata-tests",
        className: "saasOnly",
      },
      //  "docs/wip/metadata-analytics",
      "docs/act-on-metadata/impact-analysis",
      // {
      //    type: "doc",
      //    id: "docs/wip/events-bridge",
      //    className: "saasOnly",
      //  },
      //  {
      //    type: "doc",
      //    id: "docs/wip/datahub-incidents", // rename this to "Incidents"
      //    className: "saasOnly",
      //  },
      //  {
      //    type: "doc",
      //    id: "docs/wip/approval-workflows",
      //    className: "saasOnly",
      //  },
    ],

    "Deploy DataHub": [
      // The purpose of this section is to provide the minimum steps required to deploy DataHub to the vendor of your choosing
      "docs/deploy/aws",
      "docs/deploy/gcp",
      "docker/README",
      "docs/deploy/kubernetes",
      {
        Authentication: [
          "docs/authentication/README",
          "docs/authentication/concepts",
          {
            "Frontend Authentication": [
              "docs/authentication/guides/jaas",
              {
                "OIDC Authentication": [
                  "docs/authentication/guides/sso/configure-oidc-react",
                  "docs/authentication/guides/sso/configure-oidc-react-google",
                  "docs/authentication/guides/sso/configure-oidc-react-okta",
                  "docs/authentication/guides/sso/configure-oidc-react-azure",
                ],
              },
            ],
          },
          "docs/authentication/introducing-metadata-service-authentication",
          "docs/authentication/personal-access-tokens",
        ],
      },
      {
        Authorization: [
          "docs/authorization/README",
          "docs/authorization/roles",
          "docs/authorization/policies",
          "docs/authorization/groups",
        ],
      },
      {
        "Advanced Guides": [
          "docs/how/delete-metadata",
          "docs/how/configuring-authorization-with-apache-ranger",
          "docs/how/backup-datahub",
          "docs/how/restore-indices",
          "docs/advanced/db-retention",
          "docs/advanced/monitoring",
          "docs/how/extract-container-logs",
          "docs/deploy/telemetry",
          "docs/how/kafka-config",
          "docs/deploy/confluent-cloud",
          "docs/advanced/no-code-upgrade",
        ],
      },
      "docs/how/updating-datahub",
    ],
    "DataHub API":[
       "docs/api/datahub-apis",
        {
          "GraphQL API": [
            {
              label: "Overview",
              type: "doc",
              id: "docs/api/graphql/overview",
            },
            {
              Reference: [
                {
                  type: "doc",
                  label: "Queries",
                  id: "graphql/queries",
                },
                {
                  type: "doc",
                  label: "Mutations",
                  id: "graphql/mutations",
                },
                {
                  type: "doc",
                  label: "Objects",
                  id: "graphql/objects",
                },
                {
                  type: "doc",
                  label: "Inputs",
                  id: "graphql/inputObjects",
                },
                {
                  type: "doc",
                  label: "Interfaces",
                  id: "graphql/interfaces",
                },
                {
                  type: "doc",
                  label: "Unions",
                  id: "graphql/unions",
                },
                {
                  type: "doc",
                  label: "Enums",
                  id: "graphql/enums",
                },
                {
                  type: "doc",
                  label: "Scalars",
                  id: "graphql/scalars",
                },
              ],
            },
            {
              Guides: [
                {
                  type: "doc",
                  label: "Getting Started",
                  id: "docs/api/graphql/getting-started",
                },
                {
                  type: "doc",
                  label: "Working with Metadata Entities",
                  id: "docs/api/graphql/querying-entities",
                },
                {
                  type: "doc",
                  label: "Access Token Management",
                  id: "docs/api/graphql/token-management",
                },
              ],
            },
          ],
      },
      {
        OpenAPI: [
          {
            label: "Usage Guide",
            type: "doc",
            id: "docs/api/openapi/openapi-usage-guide",
          },
          "docs/dev-guides/timeline",
        ],
      }
    ],
    "Tools": [
      "docs/cli",
      "docs/datahub_lite",  
      {
        SDKs: [
          "metadata-ingestion/as-a-library",
          "metadata-integration/java/as-a-library",
        ],
      }, 
    ],
    "Developer Guides": [
      // The purpose of this section is to provide developers & technical users with
      // concrete tutorials for how to work with the DataHub CLI & APIs
      // "docs/wip/developer-guides",
     

      {
        "DataHub Metadata Model": [
          "docs/modeling/metadata-model",
          "docs/modeling/extending-the-metadata-model",
          "docs/what/mxe",
          {
            Entities: [
              {
                type: "autogenerated",
                dirName: "docs/generated/metamodel/entities", // '.' means the current docs folder
              },
            ],
          },
        ],
      },
      {
        "Developing on DataHub": [
          "docs/developers",
          "docs/docker/development",
          "metadata-ingestion/developing",
          {
            Modules: [
              "datahub-web-react/README",
              "datahub-frontend/README",
              "datahub-graphql-core/README",
              "metadata-service/README",
              "metadata-jobs/mae-consumer-job/README",
              "metadata-jobs/mce-consumer-job/README",
            ],
          },
        ],
      },
      "docs/debugging",
      "docs/plugins",

      {
        Advanced: [
          "metadata-ingestion/docs/dev_guides/reporting_telemetry",
          "docs/advanced/mcp-mcl",
          "docker/datahub-upgrade/README",
          "docs/advanced/no-code-modeling",
          "datahub-web-react/src/app/analytics/README",
          "docs/advanced/aspect-versioning",
          "docs/advanced/es-7-upgrade",
          "docs/how/migrating-graph-service-implementation",
          "docs/advanced/field-path-spec-v2",
          "metadata-ingestion/adding-source",
          "docs/how/add-custom-ingestion-source",
          "docs/how/add-custom-data-platform",
          "docs/advanced/browse-paths-upgrade",
        ],
      },
    ],
    "Feature Guides": [
      // "docs/wip/tutorials",
      "docs/how/search",
      "docs/schema-history",
      // "docs/how/ui-tabs-guide",
      "docs/domains",
      "docs/glossary/business-glossary",
      "docs/tags",
      "docs/browse",
      "docs/authorization/access-policies-guide",
      "docs/features/dataset-usage-and-query-history",
      "docs/posts",
      "docs/sync-status",
      "docs/lineage/lineage-feature-guide",
      // "docs/wip/ui-ingestion-guide", -- not needed
      // "docs/wip/personal-access-tokens-guide", -- not needed

      // {
      //   "Advanced Tutorials": [
      //     // "docs/wip/advanced-guides",
      //     // "docs/wip/search-ranking",
      //   ],
      // },
    ],

    "Join the Community": [
      "docs/slack",
      "docs/townhalls",
      "docs/townhall-history",
      "docs/CODE_OF_CONDUCT",
      "docs/CONTRIBUTING",
      "docs/links",
      "docs/rfc",
    ],

    "Release History": ["releases"],
    "Managed DataHub Release History": [
      "docs/managed-datahub/release-notes/v_0_1_72",
      "docs/managed-datahub/release-notes/v_0_1_70",
      "docs/managed-datahub/release-notes/v_0_1_69",
    ],

    // "Candidates for Deprecation": [
    // "README",
    // "docs/roadmap",
    // "docs/advanced/backfilling",
    //"docs/advanced/derived-aspects",
    //"docs/advanced/entity-hierarchy",
    //"docs/advanced/partial-update",
    //"docs/advanced/pdl-best-practices",
    //"docs/introducing-metadata-service-authentication"
    //"metadata-models-custom/README"
    //"metadata-ingestion/examples/transforms/README"
    //"docs/what/graph",
    //"docs/what/search-index",
    //"docs/how/add-new-aspect",
    //"docs/how/build-metadata-service",
    //"docs/how/graph-onboarding",
    //"docs/demo/graph-onboarding",
    //"metadata-ingestion-modules/airflow-plugin/README"
    // "metadata-ingestion/schedule_docs/datahub", // we can delete this
    // TODO: change the titles of these, removing the "What is..." portion from the sidebar"
    // "docs/what/entity",
    // "docs/what/aspect",
    // "docs/what/urn",
    // "docs/what/relationship",
    // "docs/advanced/high-cardinality",
    // "docs/what/search-document",
    // "docs/what/snapshot",
    // "docs/what/delta",
    // - "docker/datahub-frontend/README",
    // - "docker/datahub-gms/README",
    // - "docker/datahub-mae-consumer/README",
    // - "docker/datahub-mce-consumer/README",
    // - "docker/datahub-ingestion/README",
    // - "docker/elasticsearch-setup/README",
    // - "docker/ingestion/README",
    // - "docker/kafka-setup/README",
    // - "docker/mariadb/README",
    // - "docker/mysql/README",
    // - "docker/neo4j/README",
    // - "docker/postgres/README",
    // - "perf-test/README",
    // "metadata-jobs/README",
    // "docs/how/add-user-data",
    // "docs/_feature-guide-template"
    // ],
  },
};
