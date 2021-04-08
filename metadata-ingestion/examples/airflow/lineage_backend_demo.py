"""Lineage Backend

An example DAG demonstrating the usage of DataHub's Airflow lineage backend.
"""

from datetime import timedelta

from airflow import DAG
from airflow.providers.snowflake.operators.snowflake import SnowflakeOperator
from airflow.utils.dates import days_ago

from datahub.integrations.airflow.entities import Dataset

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "email": ["jdoe@example.com"],
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
    "execution_timeout": timedelta(minutes=120),
}


with DAG(
    "datahub_lineage_backend_demo",
    default_args=default_args,
    description="An example DAG demonstrating the usage of DataHub's Airflow lineage backend.",
    schedule_interval=timedelta(days=1),
    start_date=days_ago(2),
    tags=["datahub-ingest"],
    catchup=False,
) as dag:
    sql = """CREATE OR REPLACE TABLE `mydb.schema.tableC` AS
            WITH some_table AS (
              SELECT * FROM `mydb.schema.tableA`
            ),
            some_other_table AS (
              SELECT id, some_column FROM `mydb.schema.tableB`
            )
            SELECT * FROM some_table
            LEFT JOIN some_other_table ON some_table.unique_id=some_other_table.id"""
    transformation_task = SnowflakeOperator(
        task_id="snowflake_transformation",
        dag=dag,
        snowflake_conn_id="snowflake_default",
        sql=sql,
        inlets={
            "datasets": [
                Dataset("snowflake", "mydb2.schema.tableA"),
                Dataset("snowflake", "mydb2.schema.tableB"),
            ],
        },
        outlets={"datasets": [Dataset("snowflake", "mydb2.schema.tableC")]},
    )
