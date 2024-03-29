import React, { Component } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { AvatarEmployee } from "../AvatarEmployee";

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default class SalaryViewEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentJobTitle: null,
      tab: 0,
      user: {},
      department: {
        departmentName: null,
      },
      job: {
        jobTitle: null,
      },
      userPersonalInfo: {
        dateOfBirth: null,
        gender: null,
        maritalStatus: null,
        fatherName: null,
        country: null,
        address: null,
        mobile: null,
        emailAddress: null,
      },
      userFinancialInfo: {
        bankName: null,
        accountName: null,
        accountNumber: null,
        iban: null,
      },
      falseRedirect: false,
      editRedirect: false,
    };
  }

  componentDidMount() {
    let id = JSON.parse(localStorage.getItem("user")).id;
    axios({
      method: "get",
      url: "api/users/" + id,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let user = res.data;
        this.setState({ user: user }, () => {
          if (user.jobs) {
            let jobs = user.jobs;
            jobs.map((job) => {
              if (
                new Date(job.startDate) <= Date.now() &&
                new Date(job.endDate) >= Date.now()
              ) {
                this.setState({ job: job });
              }
            });
          }
          if (user.department) {
            this.setState({ department: user.department });
          }
          if (user.user_personal_info) {
            if (user.user_personal_info.dateOfBirth) {
              user.user_personal_info.dateOfBirth = moment(
                user.user_personal_info.dateOfBirth
              ).format("D MMM YYYY");
            }
            this.setState({ userPersonalInfo: user.user_personal_info });
          }
          if (user.user_financial_info) {
            this.setState({ userFinancialInfo: user.user_financial_info });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    console.log(this.state);
    return (
      <div className="container-fluid pt-3">
        {this.state.falseRedirect ? <Redirect to="/" /> : <></>}
        {this.state.editRedirect ? (
          <Redirect
            to={{
              pathname: "/employee-edit",
              state: { selectedUser: this.state.user },
            }}
          />
        ) : null}
        <Row>
          <Col sm={12}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Card sx={{ maxWidth: 200 }} className="border-radius-default">
                  <AvatarEmployee
                    userId={JSON.parse(localStorage.getItem("user")).id}
                    edit={false}
                    view={true}
                  />
                  <CardContent>
                    <div className="flex-column flex-align-center">
                      <Typography
                        gutterBottom
                        variant="h5"
                        style={{ fontWeight: 500 }}
                        component="div"
                        className="text-center"
                      >
                        {this.state.user.fullName}
                      </Typography>
                      <Chip
                        label="Employee"
                        color="primary"
                        variant="outlined"
                        className="text-center"
                      />
                    </div>
                  </CardContent>
                  <div className="flex-column flex-align-center">
                    <TextField
                      className="w-90 mb-3"
                      label="Employee No"
                      id="filled-size-small"
                      defaultValue={"User IDs"}
                      value={"No " + this.state.user.id}
                      variant="filled"
                      size="small"
                      disabled
                    />
                    <TextField
                      className="w-90 mb-3"
                      label="Department Name"
                      id="filled-size-small"
                      defaultValue={"User ID"}
                      value={this.state.department.departmentName}
                      variant="filled"
                      size="small"
                      disabled
                    />
                    <TextField
                      className="w-90 mb-3"
                      label="Job Title"
                      id="filled-size-small"
                      defaultValue={"User ID"}
                      value={this.state.job.jobTitle}
                      variant="filled"
                      size="small"
                      disabled
                    />
                  </div>
                </Card>
              </Grid>
              <Grid item md={9}>
                <Tabs
                  className="px-4"
                  value={this.state.tab}
                  onChange={this.handleChangeTab}
                  aria-label="basic tabs example"
                >
                  <Tab label="Personal and contact" {...a11yProps(0)} />
                  <Tab label="Salary" {...a11yProps(1)} />
                  <Tab label="Documents" {...a11yProps(2)} />
                  <Tab label="Additional Data" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={this.state.tab} index={0} className="pt-0">
                  <Card sx={{ maxWidth: 200 }} className="px-4 py-3">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-0">Personal Details</h4>
                        <Button type="text" variant="" onClick={this.onEdit}>
                          <EditIcon />
                        </Button>
                      </Row>
                      <div className="px-3 pt-2">
                        <TextField
                          className="w-100 mb-3"
                          label="Full Name"
                          id="filled-size-small"
                          defaultValue={"User IDs"}
                          value={this.state.user.fullName}
                          variant="filled"
                          size="small"
                          disabled
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Date of Birth"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.dateOfBirth}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Gender"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.gender}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Marital Status"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.maritalStatus}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Father's Name"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.fatherName}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                  <Card sx={{ maxWidth: 200 }} className=" p-4">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-0">Contact Details</h4>
                        <Button type="text" variant="" onClick={this.onEdit}>
                          <EditIcon />
                        </Button>
                      </Row>
                      <div className="px-3 pt-2">
                        <TextField
                          className="w-100 mb-3"
                          label="Location"
                          id="filled-size-small"
                          defaultValue={"User IDs"}
                          value={
                            this.state.userPersonalInfo.country +
                            " " +
                            this.state.userPersonalInfo.city
                          }
                          variant="filled"
                          size="small"
                          disabled
                        />
                        <TextField
                          className="w-100 mb-3"
                          label="Address"
                          id="filled-size-small"
                          defaultValue={"User IDs"}
                          value={this.state.userPersonalInfo.address}
                          variant="filled"
                          size="small"
                          disabled
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Mobile"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.mobile}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Phone"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.phone}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Email Address"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userPersonalInfo.emailAddress}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                  <Card sx={{ maxWidth: 200 }} className=" p-4">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-0">Bank Information</h4>
                        <Button type="text" variant="" onClick={this.onEdit}>
                          <EditIcon />
                        </Button>
                      </Row>
                      <div className="px-3 pt-2">
                        <TextField
                          className="w-100 mb-3"
                          label=" Bank Name"
                          id="filled-size-small"
                          defaultValue={"User IDs"}
                          value={this.state.userFinancialInfo.bankName}
                          variant="filled"
                          size="small"
                          disabled
                        />
                        <TextField
                          className="w-100 mb-3"
                          label="Account Name"
                          id="filled-size-small"
                          defaultValue={"User IDs"}
                          value={this.state.userFinancialInfo.accountName}
                          variant="filled"
                          size="small"
                          disabled
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Account Number"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userFinancialInfo.accountNumber}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              className="w-100 mb-3"
                              label="Iban"
                              id="filled-size-small"
                              defaultValue={"User IDs"}
                              value={this.state.userFinancialInfo.iban}
                              variant="filled"
                              size="small"
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                </TabPanel>
                <TabPanel value={this.state.tab} index={1}>
                  {/* <PaymentEmployeeHistory
                    id={this.props.location.state.selectedUser.id}
                  /> */}
                </TabPanel>
                <TabPanel value={this.state.tab} index={2}>
                  Item Three
                </TabPanel>
              </Grid>
            </Grid>
          </Col>
        </Row>
      </div>
    );
  }
}
