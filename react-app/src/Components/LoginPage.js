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
      <Login />
    </div>
  );
}

class Login extends React.Component {
  constructor() {
    super();

    this.state = { email: "", password: "" };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.email.length < 8 || this.state.password.length < 8) {
      alert(`please enter the form correctly `);
    } else {
      const data = { username: this.state.email, password: this.state.password };

      fetch("http://localhost:5000/login", {
        method: "POST", // or 'PUT'
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          // authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log(response); 
          return response.json()
        }).then(({ jwt, user, ...rest }) => {
          console.log("Success:", jwt, user);
          window.localStorage.setItem('myToken', jwt)
        })
        .catch(error => {
          console.error("Error:", error);
        });

        const myToken = window.localStorage.getItem('myToken');
        fetch("http://localhost:5000/questions", {
          headers: {
            'Authorization': `Bearer ${myToken}`
          }
        })
          .then(response => response.json())
          .then(json => {
            console.log('Questions', json);
          })
    }
  }
  catch(e) {
    console.log(e);
  }

  render() {
    console.log(this.state.email);
    console.log(this.state.password);
    return (
      <div>
        <Formik
          class="form-signin"
          action="auth"
          method="POST"
          initialValues={{ email: "", password: "" }}
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
              .matches(/(?=.*[0-9])/, "Password must contain a number.")
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
                className="form-signin"
                action="auth"
                method="POST"
              >
                <div className="jumbotron">
                  <h2>Login </h2>
                  <div className="help">
                    <Popup trigger={<Link to="help"> Help?</Link>} className="center">
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

                  <button className="button" type="submit" onClick={this.onSubmit}>
                    Login
                  </button>
                  <p>
                    <Link to="/Register"> Sign Up </Link>
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
    <div className="jumbotron">
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
