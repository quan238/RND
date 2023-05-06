import React, { Component } from "react";
import { Card, Button, Form } from "react-bootstrap";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { CustomModal } from "../my-component/Modal";
import { Checkbox } from "@mui/material";
const label = { inputProps: { "aria-label": "Size switch demo" } };

export default class LeaveCategorySetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      data: [{ title: "Casual Leave", days: 10, status: true }],
    };
  }

  render() {
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
                      { title: "Leave Type", field: "title" },
                      {
                        title: "Leave Days",
                        field: "days",
                        filtering: false,
                        render: (value) => `${value.days} days`,
                      },
                      {
                        title: "Active",
                        field: "status",
                        render: (value) => (
                          <div className="w-100">
                            <Checkbox
                              {...label}
                              defaultChecked={value.status}
                            />
                          </div>
                        ),
                      },
                      {
                        title: "Action",
                        render: (rowData) => (
                          <Form className="row">
                            <Button
                              size="sm"
                              variant="info"
                              className="mr-3"
                              onClick={() => this.setState({ visible: true })}
                            >
                              <i className="fas fa-edit"></i>Edit
                            </Button>
                            <Button
                              onClick={() => {}}
                              size="sm"
                              variant="danger"
                            >
                              <i className="fas fa-trash"></i>Delete
                            </Button>
                          </Form>
                        ),
                      },
                    ]}
                    data={this.state.data}
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
                        <h4>Leave Category Settings</h4>
                      )
                    }
                  />
                </ThemeProvider>
              </Card.Body>
            </Card>
          </div>
        </div>
        <CustomModal
          title="Update Leave Category"
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
        >
          <p>123</p>
        </CustomModal>
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
