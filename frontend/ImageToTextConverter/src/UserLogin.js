import React, { useState } from "react";
import "./styles/UserLogin.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavigationBar from "./NavigationBar";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      email: email,
      password: password,
    };
    try {
      await axios
        .post(`${backendUrl}/dev/users/login`, payLoad)
        .then((res) => {
          if (res.status === 200) {
            Cookies.set("email", res.data.email, { expires: 7 });
            Cookies.set("name", res.data.name, { expires: 7 });

            Swal.fire({
              position: "top",
              icon: "success",
              title: `Welcome ${res.data.name}!`,
              showConfirmButton: false,
              timer: 1000,
            });
            navigate("/FileUploader");
          } else {
            console.log(res);
            alert(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: err.response.data,
          });
        });
    } catch (error) {
      console.error("Error occurred during Sign In:", error);
    }
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <>
      <NavigationBar />
      <div className="login-container">
        <h1>Image To Document Converter</h1>
        <div className="login">
          <h3>Login </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              aria-describedby="passwordHelpBlock"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button type="submit">Login</Button>
            <p className="caption">
              Don't have an account? <a href="/UserRegistration">Register</a>
            </p>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
