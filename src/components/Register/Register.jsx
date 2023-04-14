import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app);

const Register = () => {
  // const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email);
    console.log(password);

    // Validate
    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Please add at least one uppercase");
      return;
    } else if (!/(?=.*[0-9])/.test(password)) {
      setError("Please add at least one numbers");
      return;
    } else if (!/(?=.*[!@#$&*])/.test(password)) {
      setError("Please add a special character.");
      return;
    } else if (password.length < 8) {
      setError("Please add at least 8 characters");
      return;
    }

    // create user in Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        setError("");

        /* if (!loggedUser.emailVerified) {
          alert("Please provide a valid email address!");
        } */
        event.target.reset();
        setSuccess("User has been created successfully!");
        sendVerificationEmail(loggedUser);
        updateUserData(result.user, name);
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
        setSuccess("");
      });
  };

  const sendVerificationEmail = (user) => {
    sendEmailVerification(user).then((result) => {
      console.log(result);
      alert("Please verify your email address!");
    });
  };

  const handleEmailChange = (event) => {
    console.log(event.target.value);
    // setEmail(event.target.value);
  };

  const handlePasswordBlur = (event) => {
    console.log(event.target.value);
  };

  const updateUserData = (user, name) => {
    updateProfile(user, {
      displayName: name,
    })
      .then(() => {
        console.log("User name updated");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="w-50 mx-auto">
      <h4>Please Register</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="Enter Your Name"
          className="w-50 mb-4 rounded ps-2"
        />
        <br />
        <input
          className="w-50 mb-4 rounded ps-2"
          onChange={handleEmailChange}
          type="email"
          name="email"
          required
          id="email"
          placeholder="Your Email"
        />
        <br />
        <input
          className="w-50 mb-4 rounded ps-2"
          onBlur={handlePasswordBlur}
          type="password"
          name="password"
          required
          id="password"
          placeholder="Your Password"
        />
        <br />
        <input
          className="btn btn-primary mb-3"
          type="submit"
          value="Register"
        />
      </form>
      <p>
        <small>
          Already have an account? Please <Link to="/login">Login</Link>
        </small>
      </p>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Register;
