import { createMuiTheme, ThemeProvider } from "@mui/material";
import MaterialTable from "material-table";
import moment from "moment";
import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import { formatCurrency, formatVNDCurrency } from "../utils";

export default function PaymentHistory() {
  const [payments, setPayments] = React.useState([]);

  const theme = createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {
          padding: "6px 6px 6px 6px",
        },
      },
    },
  });

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

  useEffect(() => {
    axios({
      method: "get",
      url: "api/payments",

      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        setPayments(res.data);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        window.scrollTo(0, 0);
      });
  }, []);

  return (
    <div className="pt-5 pb-5">
      <Card className="main-card">
        <Card.Body>
          <Card.Text>
            <ThemeProvider theme={theme}>
              <MaterialTable
                columns={[
                  { title: "Full Name", field: "user.fullName" },
                  {
                    title: "Payment Month",
                    render: (rowData) =>
                      monthNames[new Date(rowData.paymentMonth).getMonth()] +
                      "-" +
                      new Date(rowData.paymentMonth).getFullYear(),
                  },

                  {
                    title: "Payment Date",
                    render: (rowData) =>
                      moment(rowData.paymentDate).format("DD-MMMM-YY"),
                  },
                  {
                    title: "Gross Salary",
                    field: "user.user_financial_info.salaryGross",
                    render: (rowData) =>
                      formatVNDCurrency(
                        rowData.user.user_financial_info.salaryGross
                      ),
                  },
                  {
                    title: "Department",
                    field: "user.user_financial_info.deductionTotal",
                    render: (rowData) =>
                      formatVNDCurrency(
                        rowData.user.user_financial_info.deductionTotal
                      ),
                  },
                  {
                    title: "Net Salary",
                    field: "user.user_financial_info.salaryNet",
                    render: (rowData) =>
                      formatVNDCurrency(
                        rowData.user.user_financial_info.salaryNet
                      ),
                  },
                  {
                    title: "Fine Deduction",
                    render: (rowData) =>
                      formatVNDCurrency(rowData.paymentFine) || 0,
                  },
                  {
                    title: "Payment Amount",
                    field: "paymentAmount",
                    render: (rowData) =>
                      formatVNDCurrency(rowData.paymentAmount),
                  },
                  {
                    title: "Action",
                    render: (rowData) => (
                      <>
                        <Button size="sm" variant="info" className="mr-2">
                          <i className="fa fa-download"></i> Download PDF
                        </Button>
                      </>
                    ),
                  },
                ]}
                data={payments}
                options={{
                  rowStyle: (rowData, index) => {
                    if (index % 2) {
                      return { backgroundColor: "#f2f2f2" };
                    }
                  },
                  pageSize: 10,
                  pageSizeOptions: [10, 20, 30, 50, 75, 100],
                }}
                title={<h4>Payment History</h4>}
              />
            </ThemeProvider>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}