import React, { Component } from 'react';
import './customers.css';



class Customers extends Component {
   constructor() {
      super();
       this.state = {
        customers: []
      };
    }
  
    componentDidMount() {
          fetch('/admin-view-users')
            .then(res => res.json())
            .then(customers => this.setState({customers}, () => console.log('Customers fetched...', customers)));
        }
      
    callBackendAPI = async () => {
      const response = await fetch('/express_backend');
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message) 
      }
      return body;
    };
  
    render() {
      return (
        <div className="App">
         <div>
       <h2>Customers</h2>
         <ul>
         {this.state.customers.map(customer => 
           <li key={customer.id}> <div> {customer.firstName} {customer.lastName}  </div > {customer.email}</li>
         )}
         </ul>
       </div>
          
          <p className="App-intro">{this.state.data}</p>
        </div>
      );
    }
  }

export default Customers;




// class Customers extends Component {
//   constructor() {
//     super();
//     this.state = {
//       customers: []
//     };
//   }

//   componentDidMount() {
//     fetch('/admin-view-users')
//       .then(res => res.json())
//       .then(customers => this.setState({customers}, () => console.log('Customers fetched...', customers)));
//   }

//   render() {
//     return (
//       <div>
//         <h2>Customers</h2>
//         <ul>
//         {this.state.customers.map(customer => 
//           <li key={customer.id}> <div> {customer.firstName} {customer.lastName}  </div > {customer.email}</li>
//         )}
//         </ul>
//       </div>
//     );
//   }
// }


// export default Customers;

































// import React, { Component } from 'react';
// import './customers.css';

// class Customers extends Component {
//   constructor() {
//     super();
//     this.state = {
//       customers: 
//       [{id: 1, firstName: 'John', lastName: 'Doe' , email: 'email.com', number : '0748372635467' , severity: 'high'  },
//       {id: 2, firstName: 'Brad', lastName: 'Traversy', email: 'email.com', number : ' 05782938476',  severity: 'low' },
//       {id: 3, firstName: 'Mary', lastName: 'Swanson', email: 'email.com', number : '0584736347589',  severity: 'mid' }]
//     };
//   }

//   componentDidMount() {
//     fetch('/api/customers')
//       .then(res => res.json())
//       .then(customers => this.setState({customers}, () => console.log('Customers fetched...', customers)));
//   }

//   render() {
//     return (
//       <div>
       
//         <ul>
//         {this.state.customers.map(customer => 
        
//           <li key={customer.id}><div className = "right"><h12>Severity</h12> {customer.severity} </div> <div>{customer.firstName} {customer.lastName} {customer.email}<br/> {customer.number}</div>  </li>
       
      
      
//       )}
//         </ul>
//       </div>
//     );
//   }
// }

// export default Customers;
