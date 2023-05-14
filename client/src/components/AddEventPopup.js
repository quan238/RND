import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default class AddEventModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      event: {},
      showAlert: false,
      done: false,
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
    if (this.state.startDate > this.state.endDate) {
      this.setState({ showAlert: true });
    } else {
      let userId = JSON.parse(localStorage.getItem("user")).id;
      this.setState(
        {
          event: {
            eventTitle: this.state.title,
            eventDescription: this.state.description,
            eventStartDate: moment(this.state.startDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            eventEndDate: moment(this.state.endDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            userId: userId,
          },
        },
        () => {
          axios({
            method: "post",
            url: "/api/personalEvents",
            data: this.state.event,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => {
              if (res.status !== 200) {
                alert(res.data);
              } else {
                this.setState({ done: true });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
  };

  render() {
    const { showAlert, done } = this.state;
    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {done ? <Redirect to="/" /> : <></>}
          {showAlert ? (
            <Alert variant="warning" className="m-1">
              End Date should be after Start Date
            </Alert>
          ) : (
            <></>
          )}
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Form.Label className="required">Event name</Form.Label>
              <TextField
                id="outlined-title"
                name="title"
                placeholder="Event"
                size="small"
                variant="outlined"
                type="text"
                className="col-12"
                value={this.state.title}
                required
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup className="mt-4">
              <Form.Label className="">Event description</Form.Label>
              <TextField
                id="outlined-title"
                name="description"
                placeholder="Description"
                size="small"
                variant="outlined"
                type="text"
                // placeholder="Enter a Title"
                className="col-12"
                value={this.state.description}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Form.Group controlId="formStartDate" className="mt-4">
              <Form.Label className="required">Start Date</Form.Label>
              <DatePicker
                selected={this.state.startDate}
                onChange={(newStartDate) =>
                  this.setState({ startDate: newStartDate })
                }
                showTimeSelect
                timeFormat="HH:mm"
                name="startDate"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="form-control ml-1 col-12"
                placeholderText="Select Start Date"
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEndDate" className="mt-4 ">
              <Form.Label className="required">End Date</Form.Label>
              <DatePicker
                selected={this.state.endDate}
                onChange={(newEndDate) =>
                  this.setState({ endDate: newEndDate })
                }
                showTimeSelect
                timeFormat="HH:mm"
                name="endDate"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="form-control col-12"
                placeholderText="Select End Date"
                autoComplete="off"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={this.onSubmit}>
            Submit
          </Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
