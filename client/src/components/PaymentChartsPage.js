import * as React from "react";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { faker } from "@faker-js/faker";

export default class ExpenseChartsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      paymentYear: 2021,
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
          data: [...data.map((d) => d.expenses)],
          backgroundColor: "#007fad",
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
      labels,
      datasets: [
        {
          label: "Dataset 1",
          data: labels.map(() =>
            faker.datatype.number({ min: 0, max: 50000000 })
          ),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    return (
      <div className="card p-4">
        <strong style={{ fontSize: 18 }}>Payment Report Chart</strong>
        <div className="mt-1" style={{ textAlign: "center" }}>
          <span className="ml-4">Select Year: </span>
          <select onChange={this.onChange} value={this.state.paymentYear}>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
          </select>
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
