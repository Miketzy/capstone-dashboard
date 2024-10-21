import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    middlename: "",
    lastname: "",
    phone_number: "+63",
    email: "",
    gender: "",
    status: "",
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

    let formattedPhoneNumber = formData.phone_number;
    if (formattedPhoneNumber.startsWith("+63")) {
      formattedPhoneNumber = "0" + formattedPhoneNumber.slice(3);
    }

    const updatedFormData = { ...formData, phone_number: formattedPhoneNumber };

    fetch("http://localhost:8080/register", {
      method: "POST",
      body: JSON.stringify(updatedFormData),
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
          // Redirect to the login form after successful registration
          navigate("/");
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
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                id="firstname"
                placeholder="Enter your firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="column2">
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
            <div className="input-box">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                placeholder="Enter your last name"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="column2">
            <div className="input-box">
              <label htmlFor="email" className="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="column3">
            <div className="input-box">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => {
                  let inputValue = e.target.value;
                  if (!inputValue.startsWith("+63") && inputValue.length > 0) {
                    inputValue = "+63" + inputValue.replace(/^0/, "");
                  }
                  setFormData({ ...formData, phone_number: inputValue });
                }}
                pattern="\+63[0-9]{10}"
                placeholder="*********"
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="status">Account Type</label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="admin">Admin</option>
                <option value="contributor">Contributor</option>
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
                required
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
                required
              />
            </div>
          </div>

          <button type="submit">Register</button>
          <p>
            Already have an account? Please click
            <a href="/" className="login">
              {" "}
              Login{" "}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
