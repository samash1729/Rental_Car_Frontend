import React, { Component } from 'react';
import Header from './headerComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

class Booking extends Component{

    constructor(props){
        super(props);

        this.state = {
            transactions: []
        };
    }

    TransactionListOut(){
        fetch('http://18.191.175.227:3000/transactions').then(response => response.json()).then(data =>  {
            const totalContent = data.length;
            if(totalContent === 0){
                alert("No Transactions available!");
            }
            this.setState({
                transactions:data
            })
        });
     }

      componentDidMount(){
        this.TransactionListOut();
      }

    render(){

        const TransactionList = this.state.transactions.map((transaction) => {
            return(
                <tr>
                    <td>{transaction.name}</td>
                    <td>{transaction.phoneNo}</td>
                    <td>{transaction.vehicleNo}</td>
                    <td>{(new Date(transaction.issueDate)).toUTCString()}</td>
                    <td>{(new Date(transaction.returnDate)).toUTCString()}</td>
                </tr>
            );
        });
        return(
            <div>
                <Header/>
                <div className="container" style={{backgroundColor:'#F2F2F2'}}>
                    <div className="row">
                        <div className="col-12">
                            <h3><center>All Transactions</center></h3>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div>
                            <table className="table table-condensed table-bordered">
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th> 
                                <th>Vehicle Number</th>
                                <th>Issue Date</th>
                                <th>Return Date</th>
                            </tr>
                                {TransactionList}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
          );
    }
}


export default Booking;  