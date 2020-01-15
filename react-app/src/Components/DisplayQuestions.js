import React, { Component } from "react";
import "./customers.css";
import { Link } from "react-router-dom";

class DisplayUsers extends React.Component {
  constructor() {
    super();

    this.state = { questions: [], QuestionsAnswer: [], QuestionsSeverity: [] };
    this.onSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.setState({
      questions: this.getItems()
    });
  }

  getItems() {
    fetch("/user-questions")
      .then(recordset => recordset.json())
      .then(results => {
        console.log(results.recordset);
        this.setState({ questions: results.recordset });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = {
      QuestionsAnswer: this.state.QuestionsAnswer,
      QuestionsSeverity: this.state.QuestionsSeverity
    };

    fetch("/Question-Response", {
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
      });
  }

  render() {
    var self = this;
    console.log(this.state.questions);
    return (
      <ul>
        {this.state.questions &&
          this.state.questions.map(function(question, index) {
            return (
              <div className="jumbotron">
                <li> Question ID: {question.QuestionId}</li>
                <li> Question:{question.Question}</li>
                <li>
                  <button onClick={self.onSubmit}>Accepted</button>
                  <button>Declined</button>
                </li>

                <li>
                  <textarea
                    onChange={e =>
                      this.setState({ QuestionsAnswer: e.target.value })
                    }
                    rows="4"
                    cols="160"
                    id="TITLE"
                  ></textarea>
                </li>
              </div>
            );
          })}
      </ul>
    );
  }
}

export default DisplayUsers;
