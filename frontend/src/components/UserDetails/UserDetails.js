import React from "react";
import "./UserDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserDetailsByApi from "../UserDetailsByApi/UserDetailsByApi";

function UserDetails() {
  return (
    <>
      <div className="top-nav">
        <div className="top-heading">
          <span className="heading">Ticket</span>
        </div>
        <div className="top-nav-btns">
          <div className="doubt">
            <span>...</span>
          </div>
          <div className="focus-mode">
            <button type="button" className="btn btn">
              Focus Mode
            </button>
          </div>
          <div className="add-ticket">
            <button
              type="button"
              className="btn btn"
              style={{ backgroundColor: " rgb(95, 212, 95)", color: "white" }}
            >
              Add Ticket
            </button>
          </div>
        </div>
      </div>
      <div className="mid-nav">
        <div className="mid-nav-titles">
          <div className="mid-input">
            <input
              type="text"
              className="input"
              placeholder="Enter SomeThing:.."
            />
          </div>
          <div className="mid-input">
            <span>Type</span>
          </div>
          <div className="mid-input">
            <span>Source</span>
          </div>
          <div className="mid-input">
            <span>Priority</span>
          </div>
          <div className="mid-input">
            <span>Data Added</span>
          </div>
          <div className="mid-input">
            <span>Ticket Filters</span>
          </div>
        </div>
      </div>
      <UserDetailsByApi />
    </>
  );
}

export default UserDetails;