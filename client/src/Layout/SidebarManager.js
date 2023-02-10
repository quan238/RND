import React, { Component } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";
import { MAP_ROLE } from "./utils";
import { withTranslation } from "react-i18next";
import { AvatarEmployeeIcon } from "../components/AvatarEmployeeIcon";

class SidebarManager extends Component {
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
          <span className="brand-text font-weight-light ml-1">HRMS Manager</span>
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
          <nav className="mt-0">
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
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/employee-list" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>My Employees</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/job-list" className="nav-link">
                  <i className="nav-icon fas fa-briefcase" />
                  <p>Contract List</p>
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
                    Applications
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/application" className="nav-link">
                      <i className="fa fa-plus nav-icon" />
                      <p>Add Application</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/application-list" className="nav-link">
                      <i className="fas fa-list-ul nav-icon" />
                      <p>Application List</p>
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
                    Expense Management
                    <i className="right fas fa-angle-left" />
                  </p>
                </NavLink>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/expense" className="nav-link">
                      <i className="fas fa-shopping-cart nav-icon" />
                      <p>Make Expense</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/expense-report" className="nav-link">
                      <i className="fas fa-file-invoice nav-icon" />
                      <p>Expense Report</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink exact to="/announcement" className="nav-link">
                  <i className="nav-icon fa fa-bell" />
                  <p>Announcements</p>
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

export default withTranslation("common")(SidebarManager); // instead of "export default App;"
