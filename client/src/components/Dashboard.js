import React, { Component } from "react";

import "../App.css";
import Infobox from "./infobox";
import Calendar from "./Calendar";
import ExpenseChartsPage from "./ExpenseChartsPage";
import PaymentChartsPage from "./PaymentChartsPage";
import RecentApplciations from "./RecentApplications";
import RecentAnnouncements from "./RecentAnnouncements";
import axios from "axios";
import { ToastContainer } from "react-toastify";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalEmployees: 0,
      totalExpenses: 0,
      totalPayments: 0,
      recentApplications: [],
    };
  }

  componentDidMount() {
    // Fetch Employees Total
    axios({
      method: "get",
      url: "/api/users/total",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ totalEmployees: parseInt(res.data) });
      })
      .catch((err) => console.log(err));

    //Fetch Expenses Total
    axios({
      method: "get",
      url: "/api/expenses/year/2021",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      let array = res.data;
      if (array.length > 0) {
        let sum = array.reduce((a, b) => ({
          expenses: parseInt(a.expenses) + parseInt(b.expenses),
        }));
        this.setState({ totalExpenses: sum.expenses });
      } else {
      }
    });

    //Fetch Payments Total
    axios({
      method: "get",
      url: "api/payments/year/2021",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      let array = res.data;
      if (array.length > 0) {
        let sum = array.reduce((a, b) => ({
          expenses: parseInt(a.expenses) + parseInt(b.expenses),
        }));
        this.setState({ totalPayments: sum.expenses });
      } else {
      }
    });
  }
  render() {
    return (
      <div>
        {/* First Row with small info-boxes */}
        <div className="row pt-4">
          {/* First info-box */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Infobox
              title="Total Employees"
              description={this.state.totalEmployees}
              color="bg-success"
              icon="fa fa-users"
            />
          </div>
          {/* Second info-box */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Infobox
              title="Total Expenses"
              description={this.state.totalExpenses + " VNĐ"}
              color="bg-warning"
              icon="fa fa-shopping-cart"
            />
          </div>
          {/* Third info-box */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Infobox
              title="Total Payments"
              description={this.state.totalPayments + " VNĐ"}
              color="bg-danger"
              icon="fa fa-money-check"
            />
          </div>
        </div>
        {/* Second Row with Calendar and Expense Report */}
        <div className="row pt-4">
          {/* Calendar */}
          <div className="col-sm-6">
            <Calendar />
            <div className="panel panel-default mt-4">
              <RecentApplciations />
            </div>
          </div>
          {/* Expense Report & Recent Applications */}
          <div className="pl-4 col-md-6">
            <div className="panel panel-default">
              <ExpenseChartsPage />
            </div>
            <div className="panel panel-default">
              <PaymentChartsPage />
            </div>
            <div className="panel panel-default">
              <RecentAnnouncements />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
