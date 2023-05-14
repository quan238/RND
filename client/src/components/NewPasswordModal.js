import React, { Component } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { Input, TextField } from "@mui/material";
export default class NewPasswordModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordCheck: null,
      showAlert: false,
      completed: false,
      hasError: false,
      errMsg: "",
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.newPassword !== this.state.newPasswordCheck) {
      this.setState({ showAlert: true });
    } else {
      let userId = JSON.parse(localStorage.getItem("user")).id;
      let data = {
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
      };
      axios({
        method: "put",
        url: "api/users/changePassword/" + userId,
        data: data,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          toast.success("Change password successfully", {
            position: toast.POSITION.TOP_CENTER,
          });
          this.setState({ completed: true, showAlert: false, hasError: false });
          this.props.onHide();
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          this.setState({ hasError: true, errMsg: err.response.data.message });
          this.props.onHide();
        });
    }
  };

  render() {
    const { showAlert, completed, hasError, errMsg } = this.state;
    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {completed ? (
            <Alert variant="success" className="m-1">
              Password changed successfully.
            </Alert>
          ) : (
            <></>
          )}
          {showAlert ? (
            <Alert variant="warning" className="m-1">
              Passwords don't match.
            </Alert>
          ) : (
            <></>
          )}
          {hasError ? (
            <Alert variant="danger" className="m-1">
              {errMsg}
            </Alert>
          ) : (
            <></>
          )}
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="formOldPassword">
              <Form.Label className="required">Old Password</Form.Label>
              <TextField
                type="password"
                placeholder="Enter old password"
                name="oldPassword"
                className="col-12"
                value={this.state.oldPassword}
                onChange={this.handleChange}
                required
                fullWidth
                color="info"
                size="small"
              />{" "}
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <TextField
                type="password"
                placeholder="Enter new Password"
                className="col-12"
                name="newPassword"
                value={this.state.newPassword}
                onChange={this.handleChange}
                required
                fullWidth
                color="info"
                size="small"
              />
            </Form.Group>

            <Form.Group controlId="formNewPasswordCheck">
              <Form.Label>New Password Repeat</Form.Label>
              <TextField
                type="password"
                placeholder="Repeat new Password"
                className="col-12"
                name="newPasswordCheck"
                value={this.state.newPasswordCheck}
                onChange={this.handleChange}
                required
                fullWidth
                color="info"
                size="small"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit" onClick={this.onSubmit}>
            Submit
          </Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
