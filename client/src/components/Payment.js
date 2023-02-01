import React, { Component } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";

import { createMuiTheme } from "@material-ui/core/styles";
import {
  calculateIncomeTax,
  calculateMedicalInsurance,
  calculateSocialInsurance,
  calculateTradeUnionFee,
  calculateUnemploymentInsurance,
  formatVNDCurrency,
} from "../utils";

export default class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      users: [],
      selectedDepartment: null,
      selectedUser: null,
      selectedDate: null,
      salaryGross: null,
      salaryNet: null,
      deductionTotal: null,
      paymentFine: 0,
      paymentAmount: 0,
      paymentType: "",
      comments: "",
      payments: [],
      hasError: false,
      errMsg: "",
      completed: false,
      showHistory: false,
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ departments: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchData = () => {
    axios({
      method: "get",
      url: "api/departments/" + this.state.selectedDepartment,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let department = res.data;
        let users = [];

        department.users.map((user) => {
          users.push(user);
        });

        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchDataAll = () => {
    axios({
      method: "get",
      url: "api/departments/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let departments = res.data;
        let users = [];

        departments.map((dept) => {
          dept.users.map((user) => {
            users.push(user);
          });
        });

        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  pushDepartments = () => {
    let items = [];
    items.push(
      <option key={584390} value="all">
        All departments
      </option>
    );
    this.state.departments.map((dept, index) => {
      if (this.state.selectedDepartment == dept.id) {
        items.push(
          <option key={index} value={dept.id} defaultValue>
            {dept.departmentName}
          </option>
        );
      } else {
        items.push(
          <option key={index} value={dept.id}>
            {dept.departmentName}
          </option>
        );
      }
    });
    return items;
  };

  pushUsers = () => {
    let items = [];

    this.state.users.map((user, index) => {
      items.push(
        <option key={index} value={user.id}>
          {user.fullName}
        </option>
      );
    });

    return items;
  };

  handleDepartmentChange = (event) => {
    this.setState({ selectedDepartment: event.target.value }, () => {
      if (this.state.selectedDepartment === "all") {
        this.fetchDataAll();
      } else {
        this.fetchData();
      }
    });
  };

  handleUserChange = (event) => {
    this.state.users.map((user) => {
      if (user.id == event.target.value) {
        this.setState({ selectedUser: event.target.value });
      }
    });
  };

  findPayments = (event) => {
    if (event) {
      event.preventDefault();
    }

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

    axios({
      method: "get",
      url: "api/financialInformations/user/" + this.state.selectedUser,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      this.setState((prevState) => ({
        ...prevState,
        ...res.data[0],
      }));
      this.setState({ showHistory: true });
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    const formatValue = [
      "paymentAmount",
      "salaryGross",
      "salaryNet",
      "paymentFine",
    ];

    if (formatValue.includes(name)) {
      this.setState({
        [name]: value.replace(/[^0-9]/g, ""),
      });
      return;
    }

    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    let currentJobId = null;

    this.state.users.map((user) => {
      if (user.id === this.state.selectedUser) {
        if (user.jobs) {
          user.jobs.map((job) => {
            if (
              new Date(job.startDate).setHours(0) < new Date() &&
              new Date(job.endDate).setHours(24) > new Date()
            ) {
              currentJobId = job.id;
            }
          });
        }
      }
    });

    let newPayment = {
      paymentType: this.state.paymentType,
      paymentMonth: moment(this.state.selectedDate).format("YYYY-MM"),
      paymentDate: moment(new Date()).format("YYYY-MM-DD"),
      paymentFine: this.state.paymentFine,
      paymentAmount: this.state.salaryNet - this.state.paymentFine,
      comments: this.state.comments,
      userId: this.state.selectedUser,
    };

    console.log(newPayment);

    axios({
      method: "post",
      url: "api/payments/",
      data: newPayment,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.findPayments();
        this.setState({ completed: true });
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        this.setState({ hasError: true, errMsg: err });
        window.scrollTo(0, 0);
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
      <div className="container-fluid pt-2">
        <div className="row">
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Alert variant="success" className="m-3" block>
              Payment has been inserted.
            </Alert>
          ) : (
            <></>
          )}

          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Body>
                <h4 className="mb-4">Manage Salary Details</h4>
                <Card.Text>
                  <Form onSubmit={this.findPayments}>
                    <Form.Group>
                      <Form.Label>Select Department: </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-css"
                        value={this.state.selectedDepartment}
                        onChange={this.handleDepartmentChange}
                        required
                      >
                        <option key={34432432} value="">
                          Choose one...
                        </option>
                        {this.pushDepartments()}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Select User: </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-css"
                        value={this.state.selectedUser || ""}
                        onChange={this.handleUserChange}
                        required
                      >
                        <option value="">Choose one...</option>
                        {this.pushUsers()}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Select Month: </Form.Label>
                      <Form.Row>
                        <DatePicker
                          className="form-control ml-1"
                          placeholderText="Pick Month"
                          selected={this.state.selectedDate}
                          onChange={(newDate) =>
                            this.setState({ selectedDate: newDate })
                          }
                          dateFormat="MM/yyy"
                          showMonthYearPicker
                          required
                          maxDate={moment().add(0, "months").toDate()}
                        />
                      </Form.Row>
                    </Form.Group>
                    <Button type="submit" className="mt-2" size="sm">
                      Search
                    </Button>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
        {this.state.showHistory ? (
          <div className="row">
            <div className="col-sm-6">
              <Card className="secondary-card">
                <Card.Header>
                  Payment for{" "}
                  {monthNames[new Date(this.state.selectedDate).getMonth()]},
                  {new Date(this.state.selectedDate).getFullYear()}
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <Form onSubmit={this.onSubmit}>
                      <Form.Group>
                        <Form.Label className="required">
                          Gross Salary{" "}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.salaryGross}
                          onChange={this.handleChange}
                          name="salaryGross"
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="required">Net Salary</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.salaryNet}
                          onChange={this.handleChange}
                          name="salaryNet"
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Fine Deduction</Form.Label>
                        <Form.Control
                          type="number"
                          value={this.state.paymentFine}
                          onChange={this.handleChange}
                          name="paymentFine"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Payment Amount</Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(
                            this.state.salaryNet - this.state.paymentFine
                          )}
                          onChange={this.handleChange}
                          name="paymentAmount"
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="required">
                          Payment Type{" "}
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={this.state.paymentType}
                          onChange={this.handleChange}
                          name="paymentType"
                          required
                        >
                          <option value="">Choose one...</option>
                          <option value="Cash">Cash</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Comments</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.comments}
                          onChange={this.handleChange}
                          name="comments"
                        />
                      </Form.Group>
                      <Button type="submit" className="mt-1">
                        Save
                      </Button>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-sm-6">
              <Card className="secondary-card">
                <Card.Body>
                  <h4 className="mb-4">Details Payment</h4>
                  <Card.Text>
                    <Form>
                      <Form.Group>
                        <Form.Label>Social Insurance</Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(
                            calculateSocialInsurance(this.state.salaryBasic)
                          )}
                          // onChange={this.handleChange}
                          // name="deductionTax"
                          disabled
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Medical Insurance</Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(
                            calculateMedicalInsurance(this.state.salaryBasic)
                          )}
                          // onChange={this.handleChange}
                          // name="deductionOther"
                          disabled
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Unemployment Insurance</Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(
                            calculateUnemploymentInsurance(
                              this.state.salaryBasic
                            )
                          )}
                          // onChange={this.handleChange}
                          // name="deductionOther"
                          disabled
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Trade Union 1%</Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(
                            calculateTradeUnionFee(this.state.salaryBasic)
                          )}
                          // onChange={this.handleChange}
                          // name="deductionOther"
                          disabled
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Personal Income Tax</Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(
                            calculateIncomeTax(this.state.salaryBasic)
                          )}
                          // onChange={this.handleChange}
                          // name="deductionTax"
                          disabled
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label className="required">
                          Total Deduction
                        </Form.Label>
                        <Form.Control
                          type="string"
                          value={formatVNDCurrency(this.state.deductionTotal)}
                          onChange={this.handleChange}
                          name="deductionTotal"
                          readOnly
                        />
                      </Form.Group>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            {/* <div className="col-sm-9">
              <Card className="main-card">
                <Card.Body>
                  <Card.Text>
                    <ThemeProvider theme={theme}>
                      <MaterialTable
                        columns={[
                          {
                            title: "Payment Month",
                            render: (rowData) =>
                              monthNames[
                                new Date(rowData.paymentMonth).getMonth()
                              ] +
                              "-" +
                              new Date(rowData.paymentMonth).getFullYear(),
                          },
                          {
                            title: "Payment Date",
                            render: (rowData) =>
                              moment(rowData.paymentDate).format("DD-MMM-YY"),
                          },
                          {
                            title: "Gross Salary",
                            field: "job.user.user_financial_info.salaryGross",
                          },
                          {
                            title: "Department",
                            field:
                              "job.user.user_financial_info.deductionTotal",
                          },
                          {
                            title: "Net Salary",
                            field: "job.user.user_financial_info.salaryNet",
                          },
                          {
                            title: "Fine Deduction",
                            render: (rowData) => rowData.paymentFine || 0,
                          },
                          { title: "Payment Amount", field: "paymentAmount" },
                        ]}
                        data={this.state.payments}
                        options={{
                          rowStyle: (rowData, index) => {
                            if (index % 2) {
                              return { backgroundColor: "#f2f2f2" };
                            }
                          },
                          pageSize: 10,
                          pageSizeOptions: [10, 20, 30, 50, 75, 100],
                        }}
                        title="History"
                      />
                    </ThemeProvider>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div> */}
          </div>
        ) : null}
      </div>
    );
  }
}
