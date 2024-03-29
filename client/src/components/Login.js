import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Alert, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      checkPassword: "",
      passwordShow: false,
      hasError: false,
      errorMessage: "",
      done: false,
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

  onChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();

    var user = {
      username: this.state.username,
      password: this.state.password,
    };

    axios({
      method: "post",
      url: "/login",
      data: user,
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        this.setState({ done: true });
      })
      .catch((err) => {
        console.log(err.response);

        toast.error("Login Failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.setState({
          hasError: true,
          errorMessage: err.response.data.message,
        });
      });
  };

  render() {
    return (
      <div className="register-box">
        {/* Same as */}

        <div className="register-logo">
          <a href="/">{this.state.done ? <Redirect to="/" /> : <></>}</a>
        </div>
        <div className="card">
          <div
            className="card-body register-card-body"
            style={{ borderRadius: "15px" }}
          >
            {this.state.hasError ? (
              <Alert severity="error" className="mb-2">
                {this.state.errorMessage}
              </Alert>
            ) : null}
            <p className="login-box-msg">Login</p>
            <form onSubmit={this.onSubmit}>
              <div>
                <div className="input-group mb-4">
                  <TextField
                    label="Email"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    className="form-control"
                    name="username"
                    placeholder="Username"
                    value={this.state.username}
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
                  <TextField
                    label="Password"
                    size="small"
                    type="password"
                    InputLabelProps={{ shrink: true }}
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onChange}
                    required
                    endAd
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span
                        className={
                          this.state.passwordShow
                            ? "fas fa-eye"
                            : "fas fa-eye-slash"
                        }
                        onClick={this.passwordVisibilityHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-8"></div>
                {/* /.col */}
                <Button
                  variant="contained"
                  type="submit"
                  className="btn btn-primary btn-block"
                >
                  Login
                </Button>
                {/* /.col */}
              </div>
            </form>

            <hr className="mt-3" />
            <a href="/register" className="text-center mt-1">
              Forgot Password
            </a>
          </div>

          {/* /.form-box */}
        </div>
        {/* /.card */}
      </div>
    );
  }
}
