import React from "react";

import "../bootstrap.min.css";
import logo from "../codestone logo.png";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import ResetPassword from "./ResetPassword";
import LoginPage from "./LoginPage";
import { Link } from "react-router-dom";
import { withAlert } from "react-alert";

import Popup from "reactjs-popup";

import { Formik } from "formik";
import * as Yup from "yup";

function Register() {
  return (
    <div className="App">
      <Header />
      <AddUsers />
    </div>
  );
}

class AddUsers extends React.Component {
  constructor() {
    super();

    this.state = { users: [], email: "", password: "", passwordConfirm: "" };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (
      this.state.email.length < 8 ||
      this.state.password.length < 8 ||
      !(this.state.password === this.state.passwordConfirm)
    ) {
      alert(`please enter the form correctly `);
    } else {
      const data = { email: this.state.email, password: this.state.password };

      fetch("/admin-Add-Users", {
        method: "POST", // or 'PUT'
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      // .then(response => response.json())
      // .then(data => {
      //   console.log("Success:", data);
      // })
      // .catch(error => {
      //   console.error("Error:", error);
      // });
      alert(`Congradulations you have signed up`);
    }
  }
  catch(e) {
    console.log(e);
  }

  render() {
    console.log(this.state.users);
    return (
      <div>
        <Formik
          class="form-signin"
          action="auth"
          method="POST"
          initialValues={{ email: "", password: "", passwordConfirm: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log("Logging in", values);
              setSubmitting(false);
            }, 500);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required("Required")
              .matches(
                /(?=.*codestone)/,
                "This is not a Codestone email address."
              ),

            password: Yup.string()
              .required("No password provided.")
              .min(8, "Password is too short - should be 8 chars minimum.")
              .matches(/(?=.*[0-9])/, "Password must contain a number."),

            passwordConfirm: Yup.string()
              .oneOf([Yup.ref("password"), "passwords must match"])
              .required("Password confirm is required")
              .min(8, "Password is too short - should be 8 chars minimum.")
          })}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            } = props;

            return (
              <form
                onSubmit={handleSubmit}
                class="form-signin"
                action="auth"
                method="POST"
              >
                <div className="jumbotron">
                  <h2>Sign Up </h2>
                  <div className="help">
                    <Popup trigger={<Link> Help?</Link>} className="center">
                      <div>
                        Enter Codestone Email address and Password connected to
                        the account.
                      </div>
                    </Popup>
                  </div>

                  <label htmlFor="email">Email</label>

                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value1={values.email}
                    value={this.state.email}
                    onInput={handleChange}
                    onChange={e => this.setState({ email: e.target.value })}
                    onBlur={handleBlur}
                    className={errors.email && touched.email && "error"}
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                  <label htmlFor="email">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value2={values.password}
                    value={this.state.password}
                    onInput={handleChange}
                    onChange={e => this.setState({ password: e.target.value })}
                    onBlur={handleBlur}
                    className={errors.password && touched.password && "error"}
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password} </div>
                  )}
                  <label htmlFor="email">Password Confirm </label>
                  <input
                    name="passwordConfirm"
                    type="password"
                    placeholder="Enter your password"
                    value2={values.passwordConfirm}
                    value={this.state.passwordConfirm}
                    onInput={handleChange}
                    onChange={e =>
                      this.setState({ passwordConfirm: e.target.value })
                    }
                    onBlur={handleBlur}
                    className={
                      errors.passwordConfirm &&
                      touched.passwordConfirm &&
                      "error"
                    }
                  />
                  {errors.passwordConfirm && touched.passwordConfirm && (
                    <div className="input-feedback">
                      {errors.passwordConfirm}{" "}
                    </div>
                  )}

                  <button class="button" type="submit" onClick={this.onSubmit}>
                    Sign Up
                  </button>
                  <p>
                    <Link to="/login"> Login Page </Link>
                  </p>
                  <p>
                    <Link to="/reset"> Reset Password </Link>
                  </p>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

function Header() {
  return (
    <div class="jumbotron">
      <img
        className="profile-image"
        alt="icon"
        src={logo}
        width="450"
        height="80"
      />
    </div>
  );
}
export default Register;
