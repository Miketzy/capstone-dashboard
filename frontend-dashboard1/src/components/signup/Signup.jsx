import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//login form
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
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
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

    fetch("https://bioexplorer-backend.onrender.com/register/api-register", {
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
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during registration.");
      });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: "url('/images/durso.jpg')",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Registration Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 h-[40px] p-[10px] block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="firstname"
              >
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                className="mt-1 block  w-full h-[40px] p-[10px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="middlename"
              >
                Middlename
              </label>
              <input
                type="text"
                id="middlename"
                className="mt-1 block h-[40px] p-[10px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your middlename"
                value={formData.middlename}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="lastname"
              >
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                className="mt-1 h-[40px] p-[10px] block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block h-[40px] p-[10px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                id="gender"
                className="mt-1 block h-[40px] p-[10px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="phone_number"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                className="mt-1 block w-full h-[40px] p-[10px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="+63XXXXXXXXX"
                value={formData.phone_number}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith("+63"))
                    value = "+63" + value.replace(/^0/, "");
                  setFormData({ ...formData, phone_number: value });
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="status"
              >
                Account Type
              </label>
              <select
                id="status"
                className="mt-1 block h-[40px] p-[10px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full h-[40px] p-[10px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block h-[40px] p-[10px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
