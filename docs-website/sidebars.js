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
      "docs/wip/what-is-datahub",
      "docs/features",
      {
       Architecture: [
        "docs/architecture/architecture",
        "docs/architecture/metadata-ingestion",
        "docs/architecture/metadata-serving",
        {
          "Modules": [
            "datahub-web-react/README",
            "datahub-frontend/README",
            "datahub-graphql-core/README",
            "metadata-service/README",
            "metadata-jobs/mae-consumer-job/README",
            "metadata-jobs/mce-consumer-job/README",
          ],
        },
        "docs/components",
        "docs/what/mxe",
        "docs/advanced/mcp-mcl",
        ],
      },
      "docs/demo",
      "docs/saas",
    ],
    "Get Started": [
      "docs/quickstart",
      "docs/cli",
      "docs/developers",
      "docs/wip/managed-datahub-setup",
      {
        "Deploying DataHub":[
          "docs/docker/development",
          "docs/how/kafka-config",
          "docker/README",
          "docs/deploy/kubernetes",
          "docker/datahub-upgrade/README",
          "docs/deploy/aws",
          "docs/deploy/gcp",
          "docs/deploy/confluent-cloud",
          "docs/deploy/telemetry",
        ]
      },
      "docs/wip/create-policies",
      {
        Authorization: [
          "docs/authorization/README",
          "docs/authorization/policies",
          "docs/authorization/groups",
        ],
      },
      { 
        "Add Users": [
          "docs/authentication/guides/add-users",
          "docs/wip/invite-with-email-link",
          "docs/wip/configure-sso",
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
        ],
      },
      "docs/managed-datahub/saas-slack-setup",
      {
        "DataHub Metadata Model": [
          "docs/modeling/metadata-model",
          "docs/modeling/extending-the-metadata-model",
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
      "docs/debugging",
    ],
    "Ingest Metadata": [
      "metadata-ingestion/README",
      {
        "Prepare for Ingestion": [
          "docs/wip/ingestion-overview",
          "docs/wip/importance-of-shift-left",
          "docs/domains",
          "docs/how/business-glossary-guide",
          "docs/tags",
        ],
      },
      {
        "Managed Ingestion": [
          "docs/ui-ingestion",
          "docs/wip/managed-ingestion-supported-connectors",
        ],
      },
      {
        "Pull-Based Ingestion": [
          "docs/wip/pull-based-ingestion",
          {
            "Pull-Based Sources": [
              {
                type: "autogenerated",
                dirName: "docs/generated/ingestion/sources", // '.' means the current docs folder
              },
            ],
          },
          {
            "Scheduling Ingestion": [
              "metadata-ingestion/schedule_docs/intro",
              "metadata-ingestion/schedule_docs/cron",
              "metadata-ingestion/schedule_docs/airflow",
            ],
          },
        ],
      },
      {
        "Push-Based Integrations": [
          {
            Airflow: [
              "docs/lineage/airflow", 
              "docker/airflow/local_airflow"
            ],
          },
          "metadata-integration/java/spark-lineage/README",
          "metadata-ingestion/integration_docs/great-expectations",
          "metadata-integration/java/datahub-protobuf/README",
          "metadata-ingestion/as-a-library",
          "metadata-integration/java/as-a-library",
        ],
      },

        "docs/wip/remote-ingestion-executor-on-AWS",
      {
        Sinks: list_ids_in_directory("metadata-ingestion/sink_docs"),
      },
      {
        "Ingestion Guides": [
          "metadata-ingestion/developing",
          "metadata-ingestion/adding-source",
          "docs/how/add-custom-ingestion-source",
          //"metadata-ingestion/source-docs-template",
          "docs/platform-instances",
          "docs/how/add-custom-data-platform",
          "docs/how/add-user-data",
          "metadata-ingestion/docs/dev_guides/stateful",
          "metadata-ingestion/docs/dev_guides/sql_profiles",
          "metadata-ingestion/docs/dev_guides/reporting_telemetry",
        ],
      },
    ],

    "Enrich Metadata": [
      "metadata-ingestion/transformers",
      "docs/wip/csv-enrichment",
      "docs/wip/ui-based-ingestion",
      {
        Lineage: [
          "docs/lineage/intro", 
          "docs/lineage/sample_code"
        ],
      },
    ],

    "Act on Metadata": [
      "docs/wip/metadata-tests",
      "docs/wip/metadata-analytics",
      "docs/wip/impact-analysis",
      "docs/wip/events-bridge",
      "docs/wip/datahub-incidents",
      "docs/wip/approval-workflows",
      {
        Actions: [
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
    ],
    "DataHub API & SDK": [
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
                label: "Querying Metadata Entities",
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
        ],
      },
      "docs/wip/rest.li",
    ],
    "Tutorials": [
      "docs/how/search",
      "docs/schema-history",
      "docs/dev-guides/timeline",
      "docs/how/ui-tabs-guide",

      "docs/wip/impact-analysis",
      "docs/wip/ui-ingestion-guide",
      "docs/wip/tags-guide",
      "docs/wip/approval-flows-guide",
      "docs/wip/personal-access-tokens-guide",
      {
        "Advanced Tutorials": [
          "docs/wip/search-ranking",
          "docs/how/updating-datahub",
          "docs/how/backup-datahub",
          "docs/how/restore-indices",
          "docs/advanced/no-code-modeling",
          "docs/advanced/db-retention",
          "docs/how/extract-container-logs",
          "docs/how/delete-metadata",
          "datahub-web-react/src/app/analytics/README",
          "docs/advanced/aspect-versioning",
          "docs/advanced/es-7-upgrade",          
          "docs/advanced/no-code-upgrade",
          "docs/how/migrating-graph-service-implementation",
          "docs/advanced/field-path-spec-v2",
          "docs/advanced/monitoring",
        ],
      },
    ],
    
    "Join the Community": [
      "docs/slack",
      "docs/townhalls",
      "docs/townhall-history",
      "docs/CODE_OF_CONDUCT",
      "docs/CONTRIBUTING",
      "docs/links",
      "docs/rfc",
      {
        RFCs: list_ids_in_directory("docs/rfc/active"),
      },
    ],

    "Release History": [
      "releases",
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
    // ],

  },
};
