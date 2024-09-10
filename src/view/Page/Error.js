import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Error() {
  return (
    <div className="container mt-5">
      <h1 className="text-danger">Error!</h1>
      <div className="alert alert-danger" role="alert">
        <h5>You do not have permission to perform this action.</h5>
      </div>
    </div>
  );
}
