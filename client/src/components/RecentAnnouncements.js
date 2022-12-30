import * as React from "react";
import axios from "axios";
import { withTranslation } from "react-i18next";

class RecentAnnouncements extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      recentAnnouncements: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    //Fetch Applications Recent
    axios({
      method: "get",
      url: "/api/departmentAnnouncements/recent",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      if (this._isMounted) {
        this.setState({ recentAnnouncements: res.data });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const theme = {
      calendarIcon: {
        textColor: "white", // text color of the header and footer
        primaryColor: "#0da472", // background of the header and footer
        backgroundColor: "#fafafa",
      },
    };

    const days = [
      "Monday",
      "Tuesday",
      "Wendesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="card p-4">
        <strong style={{ fontSize: 18 }}>
          {this.props.t("announcement.recent")}
        </strong>
        <div className="mt-1" style={{ textAlign: "center" }}></div>
        <ul className="pl-0 mt-2">
          {this.state.recentAnnouncements.map((announcement) => (
            <li
              style={{ listStyle: "none" }}
              key={announcement.id}
              className="mb-2 mt-1"
            >
              <div className="float-left mr-2">
                <time datetime="2014-09-20" className="icon p-0">
                  <em>{days[new Date(announcement.createdAt).getDay()]}</em>
                  <strong>
                    {monthNames[new Date(announcement.createdAt).getMonth()]}
                  </strong>
                  <span>{new Date(announcement.createdAt).getDate()}</span>
                </time>
              </div>
              <span>
                <strong>{announcement.announcementTitle}</strong> (
                {announcement.department?.departmentName})
              </span>
              <br className="p-1" />
              <small>{announcement.announcementDescription}</small>
              <hr className=" pt-2 pb-1 mb-0" />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withTranslation("dashboard")(RecentAnnouncements);
