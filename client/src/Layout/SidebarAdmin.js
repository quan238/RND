import React, { Component } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";
import { MAP_ROLE } from "./utils";
import { withTranslation } from "react-i18next";
import { Avatar } from "@mui/material";
import { AvatarEmployeeIcon } from "../components/AvatarEmployeeIcon";

class SidebarAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("user"));
    this.setState({ user: userData });
    loadTree();
  }

  render() {
    return (
      <aside className="main-sidebar sidebar-light-primary elevation-4">
        {/* Brand Logo */}
        {/* <a href="/" className="brand-link">
          <span className="brand-text font-weight-light ml-1">HRMS Admin</span>
        </a> */}
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <AvatarEmployeeIcon
                userId={JSON.parse(localStorage.getItem("user")).id}
              />
            </div>
            <div className="info">
              <strong href="#" className="d-block">
                {this.state.user.fullname}
              </strong>
              <span>{this.props.t(MAP_ROLE[this.state.user.role])}</span>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>{this.props.t("sidebar.dashboard")}</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/departments" className="nav-link">
                  <i className="nav-icon fa fa-building" />
                  <p>{this.props.t("sidebar.departments")}</p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/employee-list"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fa fa-user" />
                  <p>
                    {this.props.t("sidebar.employee.main")}
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/employee-add" className="nav-link">
                      <i className="fa fa-user-plus nav-icon" />
                      <p>{this.props.t("sidebar.employee.add")}</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/employee-list" className="nav-link">
                      <i className="fas fa-users nav-icon" />
                      <p>{this.props.t("sidebar.employee.list")}</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink to="/job-list" className="nav-link">
                  <i className="nav-icon fas fa-briefcase" />
                  <p>{this.props.t("sidebar.job.list")}</p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/application-list"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fa fa-rocket" />
                  <p>
                    {this.props.t("sidebar.application.main")}
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/application" className="nav-link">
                      <i className="fa fa-plus nav-icon" />
                      <p>{this.props.t("sidebar.application.add")}</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/application-list" className="nav-link">
                      <i className="fas fa-list-ul nav-icon" />
                      <p>{this.props.t("sidebar.application.list")}</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/salary-list"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-euro-sign" />
                  <p>
                    {this.props.t("sidebar.payroll.main")}
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/salary-details" className="nav-link">
                      <i className="fas fa-euro-sign nav-icon" />
                      <p>{this.props.t("sidebar.payroll.salary")}</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/salary-list" className="nav-link">
                      <i className="fas fa-users nav-icon" />
                      <p>{this.props.t("sidebar.payroll.employee-salary")}</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/payment" className="nav-link">
                      <i className="fas fa-money-check nav-icon" />
                      <p>{this.props.t("sidebar.payroll.payment")}</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/payment-history" className="nav-link">
                      <i className="fas  fa-money-bill-wave-alt nav-icon" />
                      <p>{this.props.t("sidebar.payroll.history")}</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/expense-report"
                  className="nav-link"
                  activeClassName="nav-link"
                >
                  <i className="nav-icon fas fa-money-bill" />
                  <p>
                    {this.props.t("sidebar.expense.main")}
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/expense" className="nav-link">
                      <i className="fas fa-shopping-cart nav-icon" />
                      <p>{this.props.t("sidebar.expense.make")}</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/expense-report" className="nav-link">
                      <i className="fas fa-file-invoice nav-icon" />
                      <p>{this.props.t("sidebar.expense.report")}</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/announcement" className="nav-link">
                  <i className="nav-icon fa fa-bell" />
                  <p>{this.props.t("sidebar.announcements")}</p>
                </NavLink>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    );
  }
}

export default withTranslation("common")(SidebarAdmin); // instead of "export default App;"
