import React, { Component } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      checkPassword: "",
      fullname: "",
      passwordShow: false,
      passwordCheckShow: false,
      completed: false,
      hasError: false,
      errorMessage: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  passwordVisibilityHandler = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  passwordVisibilityHandlerCheck = () => {
    var x = document.getElementById("checkPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  onChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({ completed: true, hasError: false });
    toast.success("Email send forgot Successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  render() {
    return (
      <div className="register-box">
        <div className="card">
          <div className="card-body register-card-body">
            {this.state.hasError ? (
              <Alert variant="danger">{this.state.errorMessage}</Alert>
            ) : null}
            {this.state.completed ? (
              <Alert variant="success">
                You email reset password have been send. Please check your
                inbox!!{" "}
              </Alert>
            ) : null}
            <p className="login-box-msg">Reset Password</p>
            <form onSubmit={this.onSubmit}>
              <div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    name="fullname"
                    placeholder="New Password"
                    value={this.state.fullname}
                    onChange={this.onChange}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    name="fullname"
                    placeholder="Confirm Password"
                    value={this.state.fullname}
                    onChange={this.onChange}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8"></div>
                {/* /.col */}
                <div className="col-4"></div>
                {/* /.col */}
              </div>
            </form>

            <button
              className="btn btn-primary btn-block mb-3"
              onClick={this.onSubmit}
            >
              Reset Password
            </button>
            <a href="/login" className="text-center mt-3">
              Back to Login
            </a>
          </div>
          {/* /.form-box */}
        </div>
        {/* /.card */}
      </div>
    );
  }
}
