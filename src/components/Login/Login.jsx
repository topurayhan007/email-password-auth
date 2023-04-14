import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app);

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef();

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // handle form submission here
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    // validation
    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Please add at least one uppercase.");
      return;
    } else if (!/(?=.*[0-9])/.test(password)) {
      setError("Please add at least one numbers");
      return;
    } else if (!/(?=.*[!@#$&*])/.test(password)) {
      setError("Please add a special character.");
      return;
    } else if (password.length < 8) {
      setError("Password must be 8 characters long.");
      return;
    }

    // use Firebase to login
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // Signed in
        const loggedUser = result.user;
        setError("");
        setSuccess("User login successful.");
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });

    // form.reset();
  };

  const handleResetPassword = (event) => {
    const email = emailRef.current.value;
    if (!email) {
      alert("Please provide your email address!");
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Please check your email");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <div className="w-50 mx-auto">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            ref={emailRef}
            id="email"
            required
            placeholder="Enter email"
            className="mb-3"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            required
            className="mb-3"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mb-3">
          Submit
        </Button>
      </Form>
      <p>
        <small>
          Forgot Password? Please
          <button className="btn btn-link" onClick={handleResetPassword}>
            Reset Password
          </button>
        </small>
      </p>
      <p>
        <small>
          New to our website? Please <Link to="/register">Register</Link>
        </small>
      </p>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Login;
