import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer className="main-footer" style={{ height: '5vh', display: 'flex',alignItems:'center',flexDirection:'row-reverse'}}>
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 0.5.4
        </div>
      </footer>
    );
  }
}
