import React, { Component } from "react";
import { Card, Form, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import {
  Badge,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { MAP_ROLE } from "../Layout/utils";
import { withTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { AvatarEmployee } from "./AvatarEmployee";

class EmployeeAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fistname: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      fathername: "",
      idNumber: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      iBan: "",
      address: "",
      country: "",
      city: "",
      mobile: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      role: "ROLE_EMPLOYEE",
      department: "",
      departmentId: null,
      startDate: "",
      endDate: "",
      departments: [],
      jobTitle: null,
      jobs: [],
      active:1,
      joiningDate: "",
      file: null,
      hasError: true,
      errMsg: "",
      completed: false,
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
        let jobs = [];

        res.data.users.map((user) => {
          user.jobs.map((job, index) => {
            job.startDate = moment(job.startDate).format("YYYY-MM-DD");
            job.endDate = moment(job.endDate).format("YYYY-MM-DD");
            jobs.push(job);
          });
        });

        this.setState({ jobs: jobs });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    console.log(this.state);
    this.setState({
      [name]: value,
    });
    const isError = this.validate({
      ...this.state,
      [name]: value,
    });

    this.setState({ hasError: isError });
  };

  fileSelectedHandler = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  };

  async editFile() {
    const { value: file } = await Swal.fire({
      title: "Select image",
      input: "file",
      showCancelButton: true,
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Your uploaded picture",
          imageUrl: e.target.result,
          imageAlt: "The uploaded picture",
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit = (e) => {
    this.setState({ hasError: false, errorMsg: "", completed: false });

    let user = {
      username: this.state.username,
      password: 1234,
      fullname: this.state.fistname + " " + this.state.lastname,
      role: this.state.role,
      departmentId: this.state.departmentId,
      active: 1,
    };

    e.preventDefault();
    axios({
      method: "post",
      url: "/api/users",
      data: user,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let userId = res.data.id;

        let userPersonalInfo = {
          dateOfBirth: this.state.dateOfBirth,
          gender: this.state.gender,
          maritalStatus: this.state.maritalStatus,
          fatherName: this.state.fathername,
          idNumber: this.state.idNumber,
          address: this.state.address,
          city: this.state.city,
          country: this.state.country,
          mobile: this.state.mobile,
          phone: this.state.phone,
          emailAddress: this.state.email,
          userId: userId,
        };

        axios({
          method: "post",
          url: "/api/personalInformations",
          data: userPersonalInfo,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            let userFinancialInfo = {
              bankName: this.state.bankName,
              accountName: this.state.accountName,
              accountNumber: this.state.accountNumber,
              iban: this.state.iBan,
              userId: userId,
            };

            axios({
              method: "post",
              url: "api/financialInformations",
              data: userFinancialInfo,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => {
                let job = {
                  jobTitle: this.state.jobTitle,
                  startDate: this.state.startDate,
                  endDate: this.state.endDate,
                  userId: userId,
                };
                axios({
                  method: "post",
                  url: "api/jobs/",
                  data: job,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                  .then((res) => {
                    this.setState({ completed: true });
                    toast.success("Create Employee Success", {
                      position: toast.POSITION.TOP_CENTER,
                    });
                    window.scrollTo(0, 0);
                  })
                  .catch((err) => {
                    this.setState({
                      hasError: true,
                      errMsg: err.response.data.message,
                    });
                    toast.error(err.response.data.message, {
                      position: toast.POSITION.TOP_CENTER,
                    });
                    window.scrollTo(0, 0);
                  });
              })
              .catch((err) => {
                toast.error(err.response.data.message, {
                  position: toast.POSITION.TOP_CENTER,
                });
                this.setState({
                  hasError: true,
                  errMsg: err.response.data.message,
                });
                window.scrollTo(0, 0);
              });
          })
          .catch((err) => {
            toast.error(err.response.data.message, {
              position: toast.POSITION.TOP_CENTER,
            });
            this.setState({
              hasError: true,
              errMsg: err.response.data.message,
            });
            window.scrollTo(0, 0);
          });
      })
      .catch((err) => {
        this.setState({ hasError: true, errMsg: err.response.data.message });
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        window.scrollTo(0, 0);
      });
  };

  pushDepartments = () => {
    return this.state.departments.map((dept, index) => (
      <MenuItem key={index} value={dept.id}>
        {dept.departmentName}
      </MenuItem>
    ));
  };

  validate(state) {
    if (
      state.fistname &&
      state.lastname &&
      state.dateOfBirth &&
      state.gender &&
      state.maritalStatus &&
      state.fathername &&
      state.idNumber &&
      state.address &&
      state.country &&
      state.mobile &&
      state.city &&
      state.email &&
      state.username &&
      state.password &&
      state.role &&
      state.departmentId &&
      state.startDate &&
      state.endDate &&
      state.jobTitle
    )
      return false;

    return true;
  }

  showName() {
    if (this.state.fistname === "" && this.state.lastname === "") {
      return "Please Input Name";
    }

    return this.state.fistname + " " + this.state.lastname;
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} className="container-fluid pt-4">
        <div>
          {this.state.hasError ? (
            <></>
          ) : this.state.completed ? (
            <Redirect to="employee-list" />
          ) : (
            <></>
          )}
          <Row>
            <Col sm={12}>
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <Card
                    sx={{ maxWidth: 200 }}
                    className="border-radius-default"
                  >
                    <AvatarEmployee
                      edit={false}
                      view={false}
                      userId={JSON.parse(localStorage.getItem("user")).id}
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
                          {/* <FormControl controlId="formActive"> */}
                          <div className="flex">
                            <InputLabel className="mb-0">
                              Choose active{" "}
                            </InputLabel>
                            {/* </FormControl> */}
                            <Switch
                              checked={this.state.active}
                              onChange={() =>
                                this.setState((prevState) => ({
                                  user: {
                                    ...prevState.user,
                                    active: !Boolean(this.state.active),
                                  },
                                }))
                              }
                              name="active"
                              required
                            />
                          </div>
                        </Typography>
                        <Chip
                          label={this.props.t(MAP_ROLE[this.state.role])}
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
                        value={this.state.username}
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter username"
                        variant="outlined"
                        name="username"
                        size="small"
                        onChange={this.handleChange}
                        required
                      />
                      <TextField
                        className="w-90 mb-3"
                        label="Password"
                        value={this.state.password}
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter password"
                        variant="outlined"
                        name="password"
                        size="small"
                        type="password"
                        onChange={this.handleChange}
                        required
                      />
                      <FormControl
                        controlId="formDepartment"
                        className="w-90 mb-3"
                        fullWidth
                      >
                        <InputLabel>Department</InputLabel>
                        <Select
                          size="small"
                          required
                          value={
                            this.state.departmentId === null
                              ? "Select Department"
                              : this.state.departmentId
                          }
                          label="Department"
                          placeholder="Select Department"
                          name="departmentId"
                          onChange={this.handleChange}
                        >
                          <MenuItem value="Select Department">
                            Select Department
                          </MenuItem>
                          {this.pushDepartments()}
                        </Select>
                      </FormControl>
                      {JSON.parse(localStorage.getItem("user")).id !==
                      this.state.id ? (
                        <FormControl
                          controlId="formRole"
                          className="w-90 mb-3"
                          fullWidth
                        >
                          <InputLabel>Role</InputLabel>
                          <Select
                            size="small"
                            required
                            value={this.state.role || ""}
                            label="Role"
                            name="role"
                            onChange={this.handleChange}
                          >
                            <MenuItem value="ROLE_EMPLOYEE">Employee</MenuItem>
                            <MenuItem value="ROLE_MANAGER">Manager</MenuItem>
                            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          className="w-90 mb-3"
                          label="Employee No"
                          id="filled-size-small"
                          defaultValue={"User IDs"}
                          value={this.props.t(MAP_ROLE[this.state.user.role])}
                          variant="filled"
                          size="small"
                          disabled
                        />
                      )}
                    </div>
                    <CardActions>
                      <Button
                        className="w-100"
                        variant="contained"
                        style={{ fontWeight: "700", margin: "0 auto" }}
                        onClick={this.onSubmit}
                        block
                        // disabled={this.state.hasError}
                      >
                        Create
                      </Button>{" "}
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item md={9}>
                  <Card sx={{ maxWidth: 200 }} className="px-4 py-3">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-2">Personal Details</h4>
                      </Row>
                      <div className="px-3 pt-2">
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={6}>
                            <Form.Group controlId="formFirstName">
                              <Form.Label className="text-muted required">
                                First Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter first Name"
                                name="fistname"
                                value={this.state.fistname}
                                onChange={this.handleChange}
                                required
                              />
                            </Form.Group>
                          </Grid>
                          <Grid item xs={6}>
                            <Form.Group controlId="formLastName">
                              <Form.Label className="text-muted required">
                                Last Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter last Name"
                                name="lastname"
                                value={this.state.lastname}
                                onChange={this.handleChange}
                                required
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={4}>
                            <Form.Group controlId="formDateofBirth">
                              <Form.Label className="text-muted required">
                                Date of Birth
                              </Form.Label>
                              <Form.Row>
                                <DatePicker
                                  selected={this.state.dateOfBirth}
                                  onChange={(dateOfBirth) =>
                                    this.setState({ dateOfBirth })
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  name="dateOfBirth"
                                  dateFormat="yyyy-MM-dd"
                                  className="form-control ml-1 w-100"
                                  placeholderText="Select Date Of Birth"
                                  autoComplete="off"
                                  required
                                />
                              </Form.Row>
                            </Form.Group>
                          </Grid>
                          <Grid item xs={4}>
                            <Form.Group controlId="formGender">
                              <Form.Label className="text-muted required">
                                Gender
                              </Form.Label>
                              <Form.Control
                                as="select"
                                value={this.state.gender}
                                onChange={this.handleChange}
                                name="gender"
                                required
                              >
                                <option value="">Choose...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </Form.Control>
                            </Form.Group>
                          </Grid>
                          <Grid item xs={4}>
                            <Form.Group controlId="formMaritalStatus">
                              <Form.Label className="text-muted required">
                                Marital Status
                              </Form.Label>
                              <Form.Control
                                as="select"
                                value={this.state.maritalStatus}
                                onChange={this.handleChange}
                                name="maritalStatus"
                                required
                              >
                                <option value="">Choose...</option>
                                <option value="Married">Married</option>
                                <option value="Single">Single</option>
                              </Form.Control>
                            </Form.Group>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Form.Group controlId="formId">
                              <Form.Label className="text-muted required">
                                National ID
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter ID Number"
                                name="idNumber"
                                value={this.state.idNumber}
                                onChange={this.handleChange}
                                required
                              />
                            </Form.Group>
                          </Grid>
                          <Grid item xs={6}>
                            <Form.Group controlId="formFatherName">
                              <Form.Label className="text-muted required">
                                Father's name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Father's Name"
                                name="fathername"
                                value={this.state.fathername}
                                onChange={this.handleChange}
                                required
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                  <Card sx={{ maxWidth: 200 }} className=" p-4">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-2">Contract Information</h4>
                      </Row>
                      <div className="px-3 pt-2">
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={12}>
                            <Form.Group controlId="formJobTitle">
                              <Form.Label className="text-muted required">
                                Contract Title
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.jobTitle}
                                onChange={this.handleChange}
                                name="jobTitle"
                                placeholder="Enter Contract Title"
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={6}>
                            <Form.Group controlId="formJobStart">
                              <Form.Label className="text-muted required">
                                Start Date
                              </Form.Label>
                              <Form.Row>
                                <DatePicker
                                  selected={this.state.startDate}
                                  onChange={(startDate) =>
                                    this.setState({ startDate })
                                  }
                                  dropdownMode="select"
                                  timeFormat="HH:mm"
                                  name="startDate"
                                  timeCaption="time"
                                  dateFormat="yyyy-MM-dd"
                                  className="form-control ml-1"
                                  placeholderText="Select Date Of Birth"
                                  autoComplete="off"
                                  required
                                />
                              </Form.Row>
                            </Form.Group>
                          </Grid>
                          <Grid item xs={6}>
                            <Form.Group controlId="formJobEnd">
                              <Form.Label className="text-muted required">
                                End Date
                              </Form.Label>
                              <Form.Row>
                                <DatePicker
                                  selected={this.state.endDate}
                                  onChange={(endDate) =>
                                    this.setState({ endDate })
                                  }
                                  dropdownMode="select"
                                  timeFormat="HH:mm"
                                  name="endDate"
                                  timeCaption="time"
                                  dateFormat="yyyy-MM-dd"
                                  className="form-control ml-1"
                                  placeholderText="Select Date Of Birth"
                                  autoComplete="off"
                                />
                              </Form.Row>
                            </Form.Group>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                  <Card sx={{ maxWidth: 200 }} className=" p-4">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-2">Contact Details</h4>
                      </Row>
                      <div className="px-3 pt-2">
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={12}>
                            <Form.Group controlId="formPhysicalAddress">
                              <Form.Label className="text-muted required">
                                Physical Address
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.address}
                                onChange={this.handleChange}
                                name="address"
                                placeholder="Enter Address"
                                required
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={6}>
                            <Form.Group controlId="formCountry">
                              <Form.Label className="text-muted required">
                                Country
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.country}
                                onChange={this.handleChange}
                                name="country"
                                placeholder="Enter Country"
                                required
                              />
                            </Form.Group>
                          </Grid>
                          <Grid item xs={6}>
                            <Form.Group controlId="formCity">
                              <Form.Label className="text-muted required">
                                City
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.city}
                                onChange={this.handleChange}
                                name="city"
                                placeholder="Enter City"
                                required
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={6}>
                            <Form.Group controlId="formMobile">
                              <Form.Label className="text-muted required">
                                Mobile
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.mobile}
                                onChange={this.handleChange}
                                name="mobile"
                                placeholder="Enter Mobile"
                                required
                              />
                            </Form.Group>
                          </Grid>
                          <Grid item xs={6}>
                            <Form.Group controlId="formPhone">
                              <Form.Label className="text-muted">
                                Phone
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.phone || ""}
                                onChange={this.handleChange}
                                name="phone"
                                placeholder="Enter Phone"
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={6}>
                            <Form.Group controlId="formEmail">
                              <Form.Label className="text-muted required">
                                Email
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.emailAddress}
                                onChange={this.handleChange}
                                name="emailAddress"
                                placeholder="Enter Email"
                                required
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                  <Card sx={{ maxWidth: 200 }} className=" p-4">
                    <div>
                      <Row className="flex-row flex-space-between flex-align-center pr-2">
                        <h4 className="mb-2">Bank Information</h4>
                      </Row>
                      <div className="px-3 pt-2">
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={12}>
                            <Form.Group controlId="formBankName">
                              <Form.Label className="text-muted">
                                Bank Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.bankName}
                                onChange={this.handleChange}
                                name="bankName"
                                placeholder="Enter Bank name"
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={12}>
                            <Form.Group controlId="formAccountName">
                              <Form.Label className="text-muted">
                                Account Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.accountName}
                                onChange={this.handleChange}
                                name="accountName"
                                placeholder="Enter Account name"
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mb-2">
                          <Grid item xs={6}>
                            <Form.Group controlId="formAccountNumber">
                              <Form.Label className="text-muted">
                                Account Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.accountNumber}
                                onChange={this.handleChange}
                                name="accountNumber"
                                placeholder="Enter Account number"
                              />
                            </Form.Group>
                          </Grid>
                          <Grid item xs={6}>
                            <Form.Group controlId="formIban">
                              <Form.Label className="text-muted">
                                IBAN{" "}
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.iban}
                                onChange={this.handleChange}
                                name="iban"
                                placeholder="Enter Iban"
                              />
                            </Form.Group>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </Col>
          </Row>
          {/* Main Card */}
        </div>
      </Form>
    );
  }
}

export default withTranslation("common")(EmployeeAdd); // instead of "export default App;"
