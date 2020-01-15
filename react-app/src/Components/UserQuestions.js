import React from 'react';
import logo from '../codestone logo.png';
import {Link } from 'react-router-dom'
import '../bootstrap.min.css'
import {Button} from 'react'
import  DisplayQuestions  from "./DisplayQuestions";

function Home() {
  return (
    
      <div> 
        <Header/>  
        <DisplayQuestions/>

  </div>
    
  );
}



function Header(){
  return (

    <div class="jumbotron">
      <div className = "User-Menu">
    <Link>User details  </Link>
    </div>
    <img className='profile-image' alt='icon' src={logo} width="340" height="60"/>

    
    <LoginForm/>
  </div>

  
  
    )
  }




  function QuestionForm(){
    return (
      
          <div className = "QuestionContainer">

            <div className = "Questions-Header">
            <p>This is a test question will be eventually manuaslly filled via props </p> 
            </div>


        <div className = "Questions-User-Descion-yes">
          <label>
            <input
              type="radio"
              name="react-tips"
              value="option1"
              checked={true}
              className="form-check-input"
            />
            Yes
          </label>
        

          <div >
          <label>
            <input
              type="radio"
              name="react-tips"
              value="option2"
              className="form-check-input"
            />
            No
          </label>
          </div>
</div>

        <div className= "Questions-User-Answer">
        <textarea rows="4" cols="70" id="TITLE">
</textarea>
         </div>
          

        </div>
      

      )
    }

    

function LoginForm (){
  return(
    <div>
      <br/>


 <Link to= '/home'><button type="button" class="btn btn-light">Home</button></Link>
  </div>
  )
}
  
  export default Home;