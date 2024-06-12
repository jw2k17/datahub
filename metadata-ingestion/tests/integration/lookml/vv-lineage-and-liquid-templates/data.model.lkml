connection: "my_connection"

include: "activity_logs.view.lkml"
include: "employee_income_source.view.lkml"
include: "employee_total_income.view.lkml"
include: "top_10_employee_income_source.view.lkml"

explore: activity_logs {
}

explore: employee_income_source {
}

explore: employee_total_income {
}

explore: top_10_employee_income_source {
}
