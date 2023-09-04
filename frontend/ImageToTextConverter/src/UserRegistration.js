import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import "./styles/UserRegistration.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavigationBar from "./NavigationBar";

const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      name: name,
      email: email,
      password: password,
    };

    await axios
      .post(`${backendUrl}users/register`, payLoad)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Registered Successfully please login to continue",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        } else {
          console.log(res);
          alert(res.data);
        }
      })
      .catch((err) => {
        alert("error2");
      });

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <>
      <NavigationBar />
      <div className="register-container">
        <h1>Image To Document Converter</h1>
        <div className="register">
          <h3>Registration</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
              />
            </Form.Group>

            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />

            <Button type="submit">Register</Button>
          </Form>
          <p className="caption">
            Already have an account? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
