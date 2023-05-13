import * as React from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { MenuItem, Select } from "@mui/material";
import { withTranslation } from "react-i18next";

class ExpenseChartsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      paymentYear: 2023,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    axios({
      method: "get",
      url: "api/payments/year/" + this.state.paymentYear,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let data = this.transformData(res.data);
        let array = this.makeArrayStructure(data);
        this.setState({ chartData: array });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  transformData = (data) => {
    data.forEach((obj) => {
      obj.expenses = parseInt(obj.expenses);
    });
    return data;
  };

  makeArrayStructure = (data) => {
    let array = {
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: "Payment",
          data: [...data.map((d) => d.expenses)],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
    return array;
  };

  onChange = (event) => {
    this.setState({ paymentYear: event.target.value }, () => {
      this.fetchData();
    });
  };

  render() {
    const options = {
      responsive: true,
      scales: {
        y: {
          ticks: {
            stepSize: (c) =>
              (Math.max(...c.chart.data.datasets[0].data) -
                Math.min(...c.chart.data.datasets[0].data)) /
              2,
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    };

    const labels = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
    ];

    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Dataset 1",
          data: [
            43337032, 25193848, 22896992, 25263770, 3629853, 16615761, 40455754,
          ],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    return (
      <div className="card p-4">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <strong style={{ fontSize: 18 }}>
            {this.props.t("payments.chart")}
          </strong>
          <div className="mt-1" style={{ textAlign: "center" }}>
            <span className="ml-4">Select Year: </span>
            <Select
              defaultValue={"2023"}
              onChange={this.onChange}
              value={this.state.expenseYear}
              size="small"
              style={{ height: 30 }}
            >
              <MenuItem value={"2023"}>2023</MenuItem>
              <MenuItem value={"2022"}>2022</MenuItem>
              <MenuItem value={"2021"}>2021</MenuItem>
              <MenuItem value={"2020"}>2020</MenuItem>
            </Select>
          </div>
        </div>
        <div>
          <Line options={options} data={data} />
          {/* <Bar
            data={this.state.chartData}
            height={300}
            options={{
              maintainAspectRatio: false,
              legend: {
                display: false,
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                      stepSize: 2000,
                    },
                  },
                ],
              },
            }}
            redraw
          /> */}
        </div>
      </div>
    );
  }
}

export default withTranslation("dashboard")(ExpenseChartsPage);
