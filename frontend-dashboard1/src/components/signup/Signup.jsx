import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    birthdate: "",
    address: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(`Unexpected response: ${text}`);
          });
        }
      })
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Registration successful!");
          navigate("/"); // Redirect to another page
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during registration.");
      });
  };

  return (
    <div className="body">
      <div className="container">
        <form className="form signup" onSubmit={handleSubmit}>
          <h2>Registration Form</h2>

          <div className="column">
            <div className="input-box">
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                id="firstname"
                placeholder="Enter your Firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="middlename">Middle Name</label>
              <input
                type="text"
                id="middlename"
                placeholder="Enter your middle name"
                value={formData.middlename}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="column2">
            <div className="input-box">
              <label htmlFor="lastname">Lastname</label>
              <input
                type="text"
                id="lastname"
                placeholder="Enter your lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="birthdate">Birthdate</label>
              <input
                type="date"
                id="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-box">
            <label htmlFor="address" className="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter your Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="column3">
            <div className="input-box">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="column4">
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit">Submit</button>

          <p>
            Already have an account? Please click
            <a href="/" className="login">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
