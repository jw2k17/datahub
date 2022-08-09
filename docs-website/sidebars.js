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
      "README",
      {
        Introduction: ["README",],
        Features: ["docs/features",],
        Architecture: [
          "docs/architecture/architecture",
          "docs/architecture/metadata-ingestion",
          "docs/architecture/metadata-serving",
          "docs/components",
          "docs/what/mxe",
          ],
        "See DataHub in Action": ["docs/demo",],
      }
    ],
    "Get Started": [
      {
        "Quickstart": ["docs/quickstart",],
        "Managed DataHub Setup": ["README",],
        "Deploying DataHub": ["README",],
        "Create Policies": ["README",],
        "Add Users": ["README",],
        "Add Users Invite with Email Link": ["README",],
        "Add Users SSO": ["README",],
        "Set up Slack Integration": ["README",],
        "Core Concepts": ["README",],
      }
    ],
    "Ingest Metadata": [
      {
        "Prepare for Ingestion": [
          "README",
          {
            "Importance of Shift Left": ["README",],
            "Define Domains": ["README",],
            "Create Business Glossary": ["README",],
            "Create Tags": ["README",],
          }
        ],
        "Managed Ingestion": [
          "README",
          {
            "Supported Connectors": ["README",],
          }
        ],
        "Pull-Based Ingestion": [
          "README",
          {
            "Schedule with Airflow": ["README",],
          }
        ],
        "Push-Based Ingestion": ["README",],
        "Remote Ingestion Executor on AWS": ["README",],
        "Ingestion Sources": ["README",],
      }
    ],

    "Enrich Metadata": [
      {
        "Transformers": ["docs/quickstart",],
        "CSV Enrichment": ["README",],
        "UI-Based Enrichment": ["README",],
        "Lineage": ["README",],
      }
    ],

    "Act on Metadata": [
      {
        "Metadata Tests": ["README",],
        "Metadata Analytics": ["README",],
        "DataHub Actions": ["README",],
        "Impact Analysis": ["README",],
        "Events Bridge": ["README",],
        "DataHub Incidents": ["README",],
        "Approval Workflows": ["README",],
      }
    ],

    "DataHub API & SDK": [
      {
        "GraphQL": ["README",],
        "Rest.li": ["README",],
        "OpenAPI": ["README",],
      }
    ],
    "Tutorials": [
      {
        "Impact Analysis": ["README",],
        "Schema History Guide": ["README",],
        "Domains Guide": ["README",],
        "UI Ingestion Guide": ["README",],
        "Tags Guide": ["README",],
        "Search Guide": ["README",],
        "UI Tabs Guide": ["README",],
        "Business Glossary Guide": ["README",],
        "Approval Flows Guide": ["README",],
        "Personal Access Tokens Guide": ["README",],
      }
    ],
    "Advanced Guides": [
      {
        "DataHub Deployment Guides": ["README",],
        "Updating DataHub": ["README",],
        "Extending the Metadata Model": ["README",],
        "Taking Backup of DataHub": ["README",],
        "Restoring Search and Graph Indices": ["README",],
        "Developing on Metadata Ingestion": ["README",],
        "No Code Metadata": ["README",],
        "Configuring Database Retention": ["README",],
        "Aspect Versioning": ["README",],
        "Search Ranking": ["README",],
        "Advanced Ingestion Guides": [
        {
          "Adding a Custom Metadata Ingestion Source": ["README",],
          "Using a Custom Ingestion Source": ["README",],
          "Working with Platform Instances": ["README",],
          "Stateful Ingestion": ["README",],
          "SQL Profiling": ["README",],
        }
      ],
      }
    ],
    "Join the Community": [
      {
        "Slack Community": ["README",],
        "Town Halls": ["README",],
        "Code of Conduct": ["README",],
        "Contribution Guidelines": ["README",],
        "RFCs": ["README",],
      }
    ],
    "Legacy Docs -- DataHub": [
      "README",
      // "docs/faq", // hide from sidebar: out of date
      "docs/features",
      {
        Architecture: [
          "docs/architecture/architecture",
          "docs/components",
          "docs/architecture/metadata-ingestion",
          "docs/architecture/metadata-serving",
          "docs/what/mxe",
          // "docs/what/gma",
          // "docs/what/gms",
        ],
      },
      "docs/roadmap",
      "docs/CONTRIBUTING",
      "docs/demo",
      "docs/saas",
      "releases",
    ],
    "Getting Started": ["docs/quickstart", "docs/debugging"],
    Authentication: [
      {
        type: "doc",
        id: "docs/authentication/README",
        label: "Overview",
      },
      {
        type: "doc",
        id: "docs/authentication/concepts",
        label: "Concepts",
      },
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
          "docs/authentication/guides/add-users",
        ],
      },
      {
        type: "doc",
        id: "docs/authentication/introducing-metadata-service-authentication",
        label: "Metadata Service Authentication",
      },
      {
        type: "doc",
        id: "docs/authentication/personal-access-tokens",
        label: "Personal Access Tokens",
      },
    ],
    Authorization: [
      {
        type: "doc",
        id: "docs/authorization/README",
        label: "Overview",
      },
      {
        type: "doc",
        id: "docs/authorization/policies",
        label: "Access Policies",
      },
      {
        type: "doc",
        id: "docs/authorization/groups",
        label: "Authorization for Groups",
      },
    ],
    Ingestion: [
      // add a custom label since the default is 'Metadata Ingestion'
      // note that we also have to add the path to this file in sidebarsjs_hardcoded_titles in generateDocsDir.ts
      {
        type: "doc",
        label: "Introduction",
        id: "metadata-ingestion/README",
      },
      {
        Sources: [
          {
            type: "autogenerated",
            dirName: "docs/generated/ingestion/sources", // '.' means the current docs folder
          },
        ],
      },
      "metadata-ingestion/transformers",
      {
        Sinks: list_ids_in_directory("metadata-ingestion/sink_docs"),
      },
      {
        Scheduling: [
          "metadata-ingestion/schedule_docs/intro",
          "metadata-ingestion/schedule_docs/cron",
          "metadata-ingestion/schedule_docs/airflow",
          "metadata-ingestion/schedule_docs/datahub",
        ],
      },
      {
        "Push-Based Integrations": [
          {
            Airflow: ["docs/lineage/airflow", "docker/airflow/local_airflow"],
          },
          "metadata-integration/java/spark-lineage/README",
          "metadata-ingestion/integration_docs/great-expectations",
          "metadata-integration/java/datahub-protobuf/README",
          "metadata-ingestion/as-a-library",
          "metadata-integration/java/as-a-library",
          //"metadata-ingestion-modules/airflow-plugin/README"
        ],
      },
      {
        Lineage: ["docs/lineage/intro", "docs/lineage/sample_code"],
      },
      {
        Guides: [
          "metadata-ingestion/adding-source",
          //"metadata-ingestion/source-docs-template",
          "docs/how/add-custom-ingestion-source",
          "docs/how/add-custom-data-platform",
          "docs/platform-instances",
          "docs/how/add-user-data",
          "metadata-ingestion/docs/dev_guides/stateful",
          "metadata-ingestion/docs/dev_guides/reporting_telemetry",
          "metadata-ingestion/docs/dev_guides/sql_profiles",
        ],
      },
    ],
    Modeling: [
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
      // TODO: change the titles of these, removing the "What is..." portion from the sidebar"
      // "docs/what/entity",
      // "docs/what/aspect",
      // "docs/what/urn",
      // "docs/what/relationship",
      // "docs/what/search-document",
      // "docs/what/snapshot",
      // "docs/what/delta",
      // "docs/what/mxe",
    ],
    CLI: [
      {
        label: "Overview",
        type: "doc",
        id: "docs/cli",
      },
    ],
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
    OpenAPI: [
      {
        label: "Usage Guide",
        type: "doc",
        id: "docs/api/openapi/openapi-usage-guide",
      },
    ],
    Actions: [
      {
        type: "doc",
        id: "docs/actions/README",
        label: "Introduction",
      },
      {
        label: "Quickstart",
        type: "doc",
        id: "docs/actions/quickstart",
      },
      {
        label: "Concepts",
        type: "doc",
        id: "docs/actions/concepts",
      },
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
    "Usage Guides": [
      "docs/domains",
      "docs/ui-ingestion",
      "docs/tags",
      "docs/schema-history",
      "docs/how/search",
      "docs/how/ui-tabs-guide",
      "docs/how/business-glossary-guide",
    ],
    "Developer Guides": [
      // TODO: the titles of these should not be in question form in the sidebar
      "docs/developers",
      "docs/docker/development",
      "docs/how/backup-datahub",
      "docs/how/updating-datahub",
      //"metadata-ingestion/examples/transforms/README"
      //"docs/what/graph",
      //"docs/what/search-index",
      //"docs/how/add-new-aspect",
      //"docs/how/build-metadata-service",
      //"docs/how/graph-onboarding",
      //"docs/demo/graph-onboarding",
      "docs/what/mxe",
      "docs/how/restore-indices",
      "docs/dev-guides/timeline",
      "docs/how/extract-container-logs",
      "docs/how/delete-metadata",
      "datahub-web-react/src/app/analytics/README",
      "metadata-ingestion/developing",
      {
        "Module READMEs": [
          "datahub-web-react/README",
          "datahub-frontend/README",
          "datahub-graphql-core/README",
          "metadata-service/README",
          // "metadata-jobs/README",
          "metadata-jobs/mae-consumer-job/README",
          "metadata-jobs/mce-consumer-job/README",
        ],
      },
      {
        Advanced: [
          "docs/advanced/no-code-modeling",
          "docs/advanced/db-retention",
          "docs/advanced/aspect-versioning",
          "docs/advanced/es-7-upgrade",
          "docs/advanced/high-cardinality",
          "docs/advanced/no-code-upgrade",
          "docs/how/migrating-graph-service-implementation",
          "docs/advanced/mcp-mcl",
          "docs/advanced/field-path-spec-v2",
          "docs/advanced/monitoring",
          // WIP "docs/advanced/backfilling",
          // WIP "docs/advanced/derived-aspects",
          // WIP "docs/advanced/entity-hierarchy",
          // WIP "docs/advanced/partial-update",
          // WIP "docs/advanced/pdl-best-practices",
          // WIP "docs/introducing-metadata-service-authentication"
          // WIP "metadata-models-custom/README"
        ],
      },
    ],
    "Deployment Guides": [
      "docs/how/kafka-config",
      "docker/README",
      "docs/deploy/kubernetes",
      "docker/datahub-upgrade/README",
      "docs/deploy/aws",
      "docs/deploy/gcp",
      "docs/deploy/confluent-cloud",
      "docs/deploy/telemetry",
      // Purposely not including the following:
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
    ],
    Community: [
      "docs/slack",
      "docs/links",
      "docs/townhalls",
      "docs/townhall-history",
      "docs/CODE_OF_CONDUCT",
      "docs/rfc",
      {
        RFCs: list_ids_in_directory("docs/rfc/active"),
      },
    ],
  },
};
