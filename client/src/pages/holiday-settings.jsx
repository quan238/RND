import React, { Component } from "react";
import { Card, Button, Form } from "react-bootstrap";
import JobAddModal from "../components/JobAddModal";
import JobEditModal from "../components/JobEditModal";
import JobDeleteModal from "../components/JobDeleteModal";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

import { Checkbox } from "@mui/material";
const label = { inputProps: { "aria-label": "Size switch demo" } };

export default class HolidayListSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      showAddModel: false,
      showModel: false,
      selectedEvent: {},
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({ user: JSON.parse(localStorage.getItem("user")) }, () => {
        axios({
          method: "get",
          url: `api/personalEvents/user/${this.state.user.id}`,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => {
          let newEvents = res.data.map((x) => ({
            title: x.eventTitle,
            description: x.eventDescription,
            start: x.eventStartDate,
            end: x.eventEndDate,
            id: x.id,
            color: "#007bff",
            textColor: "white",
          }));

          for (var i in newEvents) {
            newEvents[i].start = moment(newEvents[i].start).format(
              "YYYY-MM-DD"
            );
            newEvents[i].end = moment(newEvents[i].end).format("YYYY-MM-DD");
          }

          this.setState({ events: [...newEvents] });
        });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (event) => {
    this.setState({ selectedDepartment: event.target.value }, () => {
      if (this.state.selectedDepartment === "all") {
        this.fetchDataAll();
      } else {
        this.fetchData();
      }
    });
  };

  onEdit(job) {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedJob: job, showEditModel: true });
    };
  }

  addJob = () => {
    this.setState({ showAddModel: true });
  };

  onDelete(job) {
    return (event) => {
      event.preventDefault();
      this.setState({ selectedJob: job }, () => {
        this.setState({ showDeleteModel: true });
      });

      // if(department.users.length > 0) {
      //     this.setState({showAlertModel: true})
      // } else {
      //     axios({
      //         method: 'delete',
      //         url: '/api/departments/'  + department.id,
      //         headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      //     })
      //     .then(res => {
      //         this.setState({completed: true})
      //     })
      //     .catch(err => {
      //         this.setState({hasError: true, errorMsg: err.response.data.message})
      //     })
      // }
    };
  }

  render() {
    let closeEditModel = () => this.setState({ showEditModel: false });
    let closeAddModel = () => this.setState({ showAddModel: false });
    let closeDeleteModel = () => this.setState({ showDeleteModel: false });

    const theme = createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-5">
        <div className="row">
          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Body>
                <ThemeProvider theme={theme}>
                  <MaterialTable
                    columns={[
                      { title: "Event Title", field: "title" },
                      { title: "Event Description", field: "description" },
                      { title: "Start Date", field: "start" },
                      { title: "End Date", field: "end" },
                      {
                        title: "Active",
                        field: "endDate",
                        render: (job) => (
                          <div className="w-100">
                            {" "}
                            <Checkbox {...label} defaultChecked />
                          </div>
                        ),
                      },
                      {
                        title: "Action",
                        render: (rowData) => (
                          <Form className="row">
                            <div className="col">
                              <Button
                                size="sm"
                                variant="info"
                                onClick={this.onEdit(rowData)}
                              >
                                <i className="fas fa-edit"></i>Edit
                              </Button>
                            </div>
                            <div className="col">
                              <Button
                                onClick={this.onDelete(rowData)}
                                size="sm"
                                variant="danger"
                              >
                                <i className="fas fa-trash"></i>Delete
                              </Button>
                            </div>
                          </Form>
                        ),
                      },
                    ]}
                    data={this.state.events}
                    options={{
                      rowStyle: (rowData, index) => {
                        if (index % 2) {
                          return { backgroundColor: "#f2f2f2" };
                        }
                      },
                      pageSize: 8,
                      pageSizeOptions: [5, 10, 20, 30, 50, 75, 100],
                      exportButton: true,
                      filtering: true,
                    }}
                    title={
                      this.selectedUser ? (
                        this.selectedUser.fullName
                      ) : (
                        <h4>Holiday List</h4>
                      )
                    }
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>
            {this.state.showEditModel ? (
              <JobEditModal
                show={true}
                onHide={closeEditModel}
                data={this.state.selectedJob}
              />
            ) : this.state.showAddModel ? (
              <JobAddModal show={true} onHide={closeAddModel} />
            ) : this.state.showDeleteModel ? (
              <JobDeleteModal
                show={true}
                onHide={closeDeleteModel}
                data={this.state.selectedJob}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Redirect to="/departments" />
          ) : (<></>)} */}
      </div>
    );
  }
}
