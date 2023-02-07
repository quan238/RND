import * as React from "react";
import axios from "axios";
import moment from "moment";
import { stringToColor } from "../../utils";
import { Avatar, Chip } from "@mui/material";

export default class RecentApplications extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      recentApplications: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    let userId = JSON.parse(localStorage.getItem("user")).id;
    //Fetch Applications Recent
    axios({
      method: "get",
      url: "/api/applications/recent/user/" + userId,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      if (this._isMounted) {
        this.setState({ recentApplications: res.data });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="card p-4">
        <div className="mt-1" style={{ textAlign: "center" }}></div>
        <div>
          <strong style={{ fontSize: 20 }}>My Recent Application</strong>
          <ul>
            {this.state.recentApplications.map((app) => (
              <li
                style={{ listStyle: "none", height: "50px" }}
                key={app.id}
                className="mt-1 mb-2 flex w-100 pl-2 hover"
              >
                <Avatar sx={{ bgcolor: stringToColor(app.user.fullName) }}>
                  {app.user.fullName[0]}
                </Avatar>
                <div className="mb-0 ml-3 flex space-between w-100">
                  {/* <div className="float-left mr-1">
                    <img src={process.env.PUBLIC_URL + "/user-40.png"}></img>
                  </div> */}
                  <div className="w-100">
                    <div className="flex w-100">
                      <h5 className="mb-0">{app.user.fullName} </h5>
                    </div>
                    <div>
                      {moment(app.startDate).format("DD/MM/YYYY")} -{" "}
                      <span className="mb-0">{app.type}</span>
                    </div>
                  </div>
                  <div className="float-right mr-3">
                    <Chip
                      style={{
                        color:
                          app.status === "Approved"
                            ? "green"
                            : app.status === "Rejected"
                            ? "red"
                            : "orange",
                      }}
                      variant="outlined"
                      label={app.status}
                    ></Chip>
                  </div>
                  <p></p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
