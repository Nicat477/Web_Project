import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((result) => setUsers(result.data))
      .catch((err) => console.log(err));
  }, []);
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteUser/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  
  return (
    <div className="page-container">
      <h1>Book Management System</h1>
      <div className="content-container">
        <div className="bg-white p-3 rounded w-75">
          <Link to="/create" className="btn btn-success mb-3">
            Create Book
          </Link>
          
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Publisher</th>
                <th>Book Name</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <h2 className="mt-2">No Data Found</h2>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.publisher}</td>
                    <td>{user.book}</td>
                    <td>{new Date(user.date).toISOString().split("T")[0]}</td>
                    <td>
                      <Link
                        to={`/update/${user._id}`}
                        className="btn btn-success button"
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Users;
