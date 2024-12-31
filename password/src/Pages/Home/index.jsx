import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./home.scss";

const Home = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const { token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPassword = event.target.elements.password.value;

    const data = new FormData();
    data.append("token", token);
    data.append("password", newPassword);

    try {
      const response = await fetch("https://api.zeemarketing.net/api/v1/user/resetpassword", {
      // const response = await fetch("http://localhost:9000/api/v1/user/resetpassword", {
        method: "PATCH",
        body: data,
      });

      const responseData = await response.json();
      setResponseMessage(responseData.message);
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while updating the password.");
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  name="password"
                  placeholder="Enter New Password"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
            {responseMessage && <p className="pt-2">{responseMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
