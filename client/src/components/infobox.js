import React, { Component } from "react";

export default class Content extends Component {
  render() {
    return (
      <div className="info-box" style={{ padding: "2rem 1.5rem" }}>
        <span
          className={"info-box-icon " + this.props.color}
          style={{ borderRadius: "50%" }}
        >
          <i className={this.props.icon} />
        </span>
        <div className="info-box-content" style={{ marginLeft: 8 }}>
          <span className="info-box-text" style={{ fontSize: 16 }}>
            {this.props.title}
          </span>
          <span className="info-box-number" style={{ fontSize: 24 }}>
            {this.props.description}
          </span>
        </div>
      </div>
    );
  }
}
