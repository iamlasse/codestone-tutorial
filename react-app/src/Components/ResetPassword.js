import React from "react";
import logo from "../codestone logo.png";

import { Formik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { relative } from "path";
import Popup from "reactjs-popup";

import "./Login.css";

function ResetPage() {
  return (
    <div className="App">
      <Header />
      <ResetPassword />
    </div>
  );
}

class ResetPassword extends React.Component {
  constructor() {
    super();

    this.state = { users: [], email: "" };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var mailformat = /@/;
    if (!this.state.email.match(mailformat)) {
      alert(`please Make sure that it is a valid email adress `);
    } else {
      const data = { email: this.state.email };

      fetch("/login-user", {
        method: "POST", // or 'PUT'
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
          alert(`Wrong credentials`);
        });
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
          initialValues={{ email: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log("Resetting", values);
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
              )
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
                  <h2>Reset Password</h2>
                  <div className="help">
                    <Popup trigger={<Link> Help?</Link>} className="center">
                      <div>Enter email address .</div>
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

                  <button class="button" type="submit" onClick={this.onSubmit}>
                    Reset
                  </button>
                  <p>
                    <Link to="/Register"> Sign Up </Link>
                  </p>
                  <p>
                    <Link to="/login"> Login </Link>
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

export default ResetPage;
