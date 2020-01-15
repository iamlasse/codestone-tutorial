import React from "react";
import logo from "../codestone logo.png";
import { Link } from "react-router-dom";
import "../bootstrap.min.css";
import { Button } from "react";

function Home() {
  return (
    <div>
      <Header />
    </div>
  );
}

function Header() {
  return (
    <div className="jumbotron">
      <div className="User-Menu"></div>
      <img
        className="profile-image"
        alt="icon"
        src={logo}
        width="340"
        height="60"
      />

      <LoginForm />
    </div>
  );
}

function LoginForm() {
  return (
    <div>
      <br />
      <Link to="/user-questions">
        <button type="button" className="btn btn-light">
          Questions
        </button>
      </Link>
      <Link to="/user-history">
        <button type="button" className="btn btn-light">
          History
        </button>
      </Link>

      <Link to="/admin-center">
        <button type="button" className="btn btn-light">
          Admin Center
        </button>
      </Link>
    </div>
  );
}

export default Home;
