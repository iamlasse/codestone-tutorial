import React, { Component } from 'react';
import './customers.css';

class DisplayUsersHS extends React.Component{
  constructor(){
    super();

    
    this.state= { users: [] } 
  }
  componentDidMount(){
   this.setState({
      users: this.getItems()
   })
  

  }

  getItems(){
fetch('/admin-view-users')
.then(recordset => recordset.json())
.then(results => { console.log(results.recordset); this.setState({'users': results.recordset}); });

  }

  render () {
    
    console.log(this.state.users)
    return (
    <ul>
      {this.state.users && this.state.users.map(function(user, index){
    
if (user.severity ===1 ){


         
          
  return(
    <div className ="jumbotron">
  <li> Severity: {user.severity}</li>
  <li> User Name:{user.name}</li> 
  <li>User Email: {user.email}</li>
  <li>Description of Issue: {user.description}</li>
  <button>See Details</button>
    </div>
    
  )}
   
     
  })

   } 

</ul>   
);    
}
}

export default DisplayUsersHS;