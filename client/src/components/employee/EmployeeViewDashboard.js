import React, { Component } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import {
  Avatar,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WelcomeImage from "./welcome.png";
import RecentAnnouncements from "../RecentAnnouncementsManagerEmp";
export default class EmployeeViewEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    axios({
      method: "get",
      url: "api/users/" + JSON.parse(localStorage.getItem("user")).id,
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
    return (
      <>
        {" "}
        <Card
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "15rem",
          }}
        >
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <CardContent sx={{ flex: "1 0 auto" }} style={{ padding: 35 }}>
              <div style={{ width: "45%" }}>
                <h3 component="div" variant="h5">
                  <strong>Welcome {this.state.user.fullName}</strong>
                </h3>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  // width={"50rem"}
                >
                  Manage all the things from single dashboard HRMS, Payroll,
                  Leave, Attendance, Recruitment, Performance, Training, and
                  much more.
                </Typography>
              </div>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 300 }}
            image={WelcomeImage}
            alt="Live from space album cover"
          />
        </Card>
        <div className="row">
          <div className="col-6">
            <Card sx={{ maxWidth: 200 }} className="border-radius-default">
              <div className="flex-column flex-align-center w-100 pt-3">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/48014adb-982c-4a5c-ae09-a1afab53f3f3/ddrg6q2-92393626-c353-43db-9c70-85d869dd58d9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ4MDE0YWRiLTk4MmMtNGE1Yy1hZTA5LWExYWZhYjUzZjNmM1wvZGRyZzZxMi05MjM5MzYyNi1jMzUzLTQzZGItOWM3MC04NWQ4NjlkZDU4ZDkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Vn1TEvEpOgKhNWdIPLDTOtLo-feiJ-mh-kYr1VfJFQY"
                />
                <CardContent className="w-100">
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
                <div
                  className="flex-column flex-align-center w-100"
                  style={{ fontSize: 16 }}
                >
                  <div className="flex-row flex-space-between w-100 px-5 pb-3">
                    <strong>Employee No</strong>
                    <span>{"No " + this.state.user.id}</span>
                  </div>
                  <div className="flex-row flex-space-between w-100 px-5 pb-3">
                    <strong>Department Name</strong>
                    <span>{this.state.department.departmentName}</span>
                  </div>
                  <div className="flex-row flex-space-between w-100 px-5 pb-3">
                    <strong>Job</strong>
                    <span>{this.state.job.jobTitle || "N/A"}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-6">
            <RecentAnnouncements />
          </div>
        </div>
      </>
    );
  }
}
