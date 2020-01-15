import React from 'react';
import logo from '../codestone logo.png';
import {Link } from 'react-router-dom'
import '../bootstrap.min.css'

import '../bootstrap.min.css'
import '../App.css'

import  Customers  from "../Components/customers";
import  DisplayUsers  from "../Components/DisplayUsers";

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, DropDownButton } from 'reactstrap';

function Home() {
  return (
    
      <div> 
        <Header/>
        <SeveritySelector/>
        <DisplayUsers/>
      
 
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
     <Navigation/>
      
      
     
    </div>
  
    
    
      )
    }
  


    function Navigation (){
      return(
        <div>
          <br/>
          <div class="btn-group">
     <Link to= '/home'><button type="button" class="btn btn-light">Home</button></Link>
     <Link to= '/admin-view-users'><button type="button" class="btn btn-light">View Users(Admin)</button></Link>
    </div>
      </div>
      )
    }



    function SeveritySelector (){ 
      
      const ButtonSeverity = 0;
      return(
       <div className = "Severity-Toolbar">
 
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group mr-2" role="group" aria-label="First group">

     <Link to= '/admin-view-users-severity-high'> <button type="button" class="btn btn-secondary" >Severity High</button></Link>
     <Link to= '/admin-view-users-severity-medium'>  <button type="button" class="btn btn-secondary"   >Severity Medium</button></Link>
     <Link to= '/admin-view-users-severity-completed'><button type="button" class="btn btn-secondary"  >Completed</button></Link>
     <Link to= '/admin-view-users'><button type="button" class="btn btn-secondary"  >View All</button></Link>
  </div>
        </div>
        </div>
        
       








        
      
      
      
     
      )
    }





  export default Home;