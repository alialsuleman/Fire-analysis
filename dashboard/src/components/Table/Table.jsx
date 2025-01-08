
import React from "react";
import "./Table.css";
const Table = ({ data }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>

            <th>Longitude</th>
            <th>Latitude</th>
            <th>Radius</th>
            <th>Severity</th>
            <th>Confidence</th>
            <th>Created At</th>
            <th>number of Like </th>
            <th>number of DisLike</th>
            <th>number of Comment </th>
          </tr>
        </thead>
        <tbody>
          {data.map((position, index) => (
            <tr key={index}>

              <td>{position.position.longitude}</td>
              <td>{position.position.latitude}</td>
              <td>{position.radius}</td>
              <td>{position.severity}</td>
              <td>{position.confidence}</td>
              <td>{position.createdAt}</td>
              <td>{position.numLikes}</td>
              <td>{position.numDisLikes}</td>
              <td>{position.numComments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;