import React, { Component } from "react";
import { Card, Form, Alert, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import {
  Button,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Switch,
  Typography,
  MenuItem,
  CardActions,
  Badge,
} from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { MAP_ROLE } from "../Layout/utils";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";

class EmployeeEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      user: {
        id: null,
        fullName: "",
        role: null,
        active: null,
        departmentId: null,
      },
      userPersonalInfo: {
        id: null,
        dateOfBirth: null,
        gender: "",
        maritalStatus: "",
        fatherName: "",
        idNumber: "",
        address: "",
        city: "",
        country: "",
        mobile: "",
        phone: null,
        emailAddress: "",
      },
      userFinancialInfo: {
        id: null,
        bankName: "",
        accountName: "",
        accountNumber: "",
        iban: "",
      },
      department: {
        departmentId: null,
        departmentName: null,
      },
      departments: [],
      job: {
        id: null,
        jobTitle: null,
        startDate: null,
        endDate: null,
      },
      hasError: false,
      errMsg: "",
      completed: false,
      falseRedirect: false,
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      axios({
        method: "get",
        url: "api/users/" + this.props.location.state.selectedUser.id,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          let user = res.data;
          this.setState({ user: user });
          if (user.jobs.length > 0) {
            user.jobs.map((job, index) => {
              if (
                new Date(job.startDate) <= Date.now() &&
                new Date(job.endDate) >= Date.now()
              ) {
                job.startDate = moment(new Date(job.startDate)).toDate();
                job.endDate = moment(new Date(job.endDate)).toDate();
                this.setState({ job: job });
              }
            });
          }
          this.setState({ department: user.department });
          if (user.user_personal_info.dateOfBirth) {
            user.user_personal_info.dateOfBirth = moment(
              new Date(user.user_personal_info.dateOfBirth)
            ).toDate();
          }
          this.setState({ userPersonalInfo: user.user_personal_info });
          this.setState({ userFinancialInfo: user.user_financial_info });
        })
        .catch((err) => {
          console.log(err);
        });

      axios({
        method: "get",
        url: "/api/departments",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ departments: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({ falseRedirect: true });
    }
  }

  handleChangeUser = (event) => {
    const { value, name } = event.target;

    if (name === "active") {
      this.setState((prevState) => ({
        user: {
          ...prevState.user,
          active: !Boolean(this.state.user.active),
        },
      }));

      return;
    }

    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  };

  handleChangeJob = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      job: {
        ...prevState.job,
        [name]: value,
      },
    }));
  };

  handleChangeDepartment = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      department: {
        ...prevState.department,
        [name]: value,
      },
    }));
  };

  handleChangeUserPersonal = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      userPersonalInfo: {
        ...prevState.userPersonalInfo,
        [name]: value,
      },
    }));
  };

  handleChangeUserFinancial = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      userFinancialInfo: {
        ...prevState.userFinancialInfo,
        [name]: value,
      },
    }));
  };

  pushDepartments = () => {
    return this.state.departments.map((dept, index) => (
      <MenuItem key={index} value={dept.id}>
        {dept.departmentName}
      </MenuItem>
    ));
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({ hasError: false, errorMsg: "", completed: false });

    let user = {
      fullName: this.state.user.fullName,
      role: this.state.user.role,
      departmentId: this.state.user.departmentId,
      active: this.state.user.active,
    };

    axios({
      method: "put",
      url: "/api/users/" + this.props.location.state.selectedUser.id,
      data: user,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let user_id = res.data.id;

        let userPersonalData = {
          dateOfBirth: moment(this.state.userPersonalInfo.dateOfBirth).format(
            "YYYY-MM-DD"
          ),
          gender: this.state.userPersonalInfo.gender,
          maritalStatus: this.state.userPersonalInfo.maritalStatus,
          fatherName: this.state.userPersonalInfo.fatherName,
          idNumber: this.state.userPersonalInfo.idNumber,
          address: this.state.userPersonalInfo.address,
          city: this.state.userPersonalInfo.city,
          country: this.state.userPersonalInfo.country,
          mobile: this.state.userPersonalInfo.mobile,
          phone: this.state.userPersonalInfo.phone,
          emailAddress: this.state.userPersonalInfo.emailAddress,
          userId: user_id,
        };

        axios({
          method: "put",
          url: "/api/personalInformations/" + this.state.userPersonalInfo.id,
          data: userPersonalData,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            let userFinancialInfo = {
              bankName: this.state.userFinancialInfo.bankName,
              accountName: this.state.userFinancialInfo.accountName,
              accountNumber: this.state.userFinancialInfo.accountNumber,
              iban: this.state.userFinancialInfo.iban,
              userId: user_id,
            };

            axios({
              method: "put",
              url:
                "api/financialInformations/" + this.state.userFinancialInfo.id,
              data: userFinancialInfo,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((res) => {
                if (this.state.job.id !== null) {
                  let newJob = {
                    jobTitle: this.state.job.jobTitle,
                    startDate: this.state.job.startDate,
                    endDate: this.state.job.endDate,
                  };
                  axios({
                    method: "put",
                    url: "api/jobs/" + this.state.job.id,
                    data: newJob,
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                    .then((res) => {
                      this.setState({ completed: true });
                    })
                    .catch((err) => {
                      toast.error(err.response.data.message, {
                        position: toast.POSITION.TOP_CENTER,
                      });
                      // this.setState({hasError: true, errMsg: err.data.message})
                      window.scrollTo(0, 0);
                    });
                } else {
                  toast.success("Edit Employee Success", {
                    position: toast.POSITION.TOP_CENTER,
                  });
                  this.setState({ completed: true });
                }
              })
              .catch((err) => {
                toast.error(err.data.message, {
                  position: toast.POSITION.TOP_CENTER,
                });
                this.setState({ hasError: true, errMsg: err.data.message });
                window.scrollTo(0, 0);
              });
          })
          .catch((err) => {
            this.setState({ hasError: true, errMsg: err.data.message });
            window.scrollTo(0, 0);
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        // this.setState({hasError: true, errMsg: err.data.message})
        window.scrollTo(0, 0);
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

  render() {
    if (
      this.state.user.id === null ||
      this.state.userPersonalInfo.id === null ||
      this.state.userFinancialInfo.id === null
    ) {
      return <p>Loading...</p>;
    }
    return (
      <Form onSubmit={this.onSubmit} className="container-fluid pt-4">
        <div>
          {this.state.falseRedirect ? <Redirect to="/" /> : null}
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
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
                    <CardMedia
                      style={{
                        borderTopLeftRadius: "2%",
                        borderTopRightRadius: "2%",
                      }}
                      sx={{ height: 300 }}
                      image="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/48014adb-982c-4a5c-ae09-a1afab53f3f3/ddrg6q2-92393626-c353-43db-9c70-85d869dd58d9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ4MDE0YWRiLTk4MmMtNGE1Yy1hZTA5LWExYWZhYjUzZjNmM1wvZGRyZzZxMi05MjM5MzYyNi1jMzUzLTQzZGItOWM3MC04NWQ4NjlkZDU4ZDkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Vn1TEvEpOgKhNWdIPLDTOtLo-feiJ-mh-kYr1VfJFQY"
                      title="green iguana"
                    />
                    <Badge
                      badgeContent={
                        <Button onClick={this.editFile} variant="text">
                          <EditIcon />
                        </Button>
                      }
                      overlap="circular"
                      style={{ transform: "translate(1.5rem, -20px)" }}
                    ></Badge>
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
                          {/* <FormControl controlId="formActive"> */}

                          {/* </FormControl> */}
                          <Switch
                            checked={this.state.user.active}
                            onChange={() =>
                              this.setState((prevState) => ({
                                user: {
                                  ...prevState.user,
                                  active: !Boolean(this.state.user.active),
                                },
                              }))
                            }
                            name="active"
                            required
                          />
                        </Typography>

                        <Chip
                          label={this.props.t(MAP_ROLE[this.state.user.role])}
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
                      <FormControl
                        controlId="formDepartment"
                        className="w-90 mb-3"
                        fullWidth
                      >
                        <InputLabel>Department</InputLabel>
                        <Select
                          size="small"
                          required
                          value={this.state.user.departmentId}
                          label="Department"
                          name="departmentId"
                          onChange={this.handleChangeUser}
                        >
                          {this.pushDepartments()}
                        </Select>
                      </FormControl>
                      {JSON.parse(localStorage.getItem("user")).id !==
                      this.state.user.id ? (
                        <FormControl
                          controlId="formRole"
                          className="w-90 mb-3"
                          fullWidth
                        >
                          <InputLabel>Role</InputLabel>
                          <Select
                            size="small"
                            required
                            value={this.state.user.role || ""}
                            label="Role"
                            name="role"
                            onChange={this.handleChangeUser}
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
                        disabled={this.state.hasError}
                      >
                        Submit
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
                          <Grid item xs={12}>
                            <Form.Group controlId="formFullName">
                              <Form.Label className="text-muted required">
                                Full Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter first Name"
                                name="fullName"
                                value={this.state.user.fullName}
                                onChange={this.handleChangeUser}
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
                                  selected={
                                    this.state.userPersonalInfo.dateOfBirth
                                  }
                                  onChange={(dateOfBirth) =>
                                    this.setState((prevState) => ({
                                      userPersonalInfo: {
                                        ...prevState.userPersonalInfo,
                                        dateOfBirth: dateOfBirth,
                                      },
                                    }))
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
                                value={this.state.userPersonalInfo.gender}
                                onChange={this.handleChangeUserPersonal}
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
                                value={
                                  this.state.userPersonalInfo.maritalStatus
                                }
                                onChange={this.handleChangeUserPersonal}
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
                                ID Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter ID Number"
                                name="idNumber"
                                value={this.state.userPersonalInfo.idNumber}
                                onChange={this.handleChangeUserPersonal}
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
                                name="fatherName"
                                value={this.state.userPersonalInfo.fatherName}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userPersonalInfo.address}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userPersonalInfo.country}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userPersonalInfo.city}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userPersonalInfo.mobile}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userPersonalInfo.phone || ""}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userPersonalInfo.emailAddress}
                                onChange={this.handleChangeUserPersonal}
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
                                value={this.state.userFinancialInfo.bankName}
                                onChange={this.handleChangeUserFinancial}
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
                                value={this.state.userFinancialInfo.accountName}
                                onChange={this.handleChangeUserFinancial}
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
                                value={
                                  this.state.userFinancialInfo.accountNumber
                                }
                                onChange={this.handleChangeUserFinancial}
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
                                value={this.state.userFinancialInfo.iban}
                                onChange={this.handleChangeUserFinancial}
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

export default withTranslation("common")(EmployeeEdit); // instead of "export default App;"
