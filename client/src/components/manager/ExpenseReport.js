import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

export default class ExpenseReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expenses: [],
      selectedDate: null,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/users",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit = (event) => {
    event.preventDefault();

    let deptId = JSON.parse(localStorage.getItem("user")).departmentId;

    axios({
      method: "get",
      url: "api/expenses/department/" + deptId,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      console.log(res);
      let data = res.data;
      let expenses = [];
      data.map((expense) => {
        if (
          new Date(expense.date).getMonth() ==
            new Date(this.state.selectedDate).getMonth() &&
          new Date(expense.date).getFullYear() ==
            new Date(this.state.selectedDate).getFullYear()
        ) {
          expenses.push(expense);
        }
      });
      this.setState({ expenses: expenses });
    });
  };

  render() {
    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="container-fluid pt-4">
        <div className="row">
          <div className="col-sm-3">
            <Card className="secondary-card">
              <Card.Header>Select Date</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                      <Form.Label>Select Date</Form.Label>
                      <DatePicker
                        selected={this.state.selectedDate}
                        className="form-control ml-1"
                        onChange={(newDate) =>
                          this.setState({ selectedDate: newDate })
                        }
                        showMonthYearPicker
                        dateFormat="MMM yyyy"
                      />
                    </Form.Group>
                    <Button size="sm" type="submit">
                      Search
                    </Button>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-sm-9">
            <Card>
              <Card.Body>
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    columns={[
                      { title: "ID", field: "id" },
                      { title: "Item Name", field: "expenseItemName" },
                      { title: "Purchased From", field: "expenseItemStore" },
                      {
                        title: "Purchase Date",
                        render: (rowData) =>
                          moment(rowData.date).format("DD MMM,YYYY"),
                      },
                      {
                        title: "Department",
                        field: "department.departmentName",
                      },
                      {
                        title: "Amount",
                        render: (rowData) => "€ " + rowData.amount,
                      },
                      { accessor: "cash", footer: "Total:" + 1 },
                    ]}
                    data={this.state.expenses}
                    options={{
                      rowStyle: (rowData, index) => {
                        if (index % 2) {
                          return { backgroundColor: "#f2f2f2" };
                        }
                      },
                      pageSize: 10,
                      pageSizeOptions: [10, 20, 30, 50, 75, 100],
                    }}
                    title={<h4>Expense Report</h4>}
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
