import React from "react";
import "./UserDetailsByApi.css";

function UserDetailsByApi() {
  return (
    <>
      <div className="user-details-container">
        <table className="user-details-table">
          <thead className="table-heading">
            <tr className="table-tr">
              <th>Ticket Id</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Type</th>
              <th>Client</th>
              <th>Request Data</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-tr">
              <td>2</td>
              <td>Jane Smith</td>
              <td>jane.smith@example.com</td>
              <td>987-654-3210</td>
              <td>987-654-3210</td>
              <td>987-654-3210</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserDetailsByApi;