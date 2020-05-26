import React, { Component } from 'react';
import Header from './headerComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

class Booking extends Component{

    constructor(props){
        super(props);

        this.state = {
            transactions: [],
            totalLength:0,
            loadingTitle:'Loading Transactions...'
        };
    }

    TransactionListOut(){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        fetch(proxyUrl+'http://18.191.175.227:3000/transactions',requestOptions).then(response => response.json()).then(data =>  {
            const totalContent = data.length;
            if(totalContent === 0){
                this.setState({
                    loadingTitle: 'No Transactions available!'
                });
                return;
            }
            this.setState({
                transactions:data,
                totalLength:totalContent,
                loadingTitle: 'All Transactions'
            })
        });
     }

      componentDidMount(){
        this.TransactionListOut();
      }

      loadTransactionsUI(){

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

        if(this.state.totalLength == 0){
            return(
                <div></div>
            )
        }
        else{
            return(
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
            )
        }
    }

    render(){


        const finalElement = this.loadTransactionsUI();
        return(
            <div>
                <Header/>
                <div className="container" style={{backgroundColor:'#F2F2F2'}}>
                    <div className="row">
                        <div className="col-12">
                            <h3><center>{this.state.loadingTitle}</center></h3>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {finalElement}
                    </div>
                </div>
            </div>
          );
    }
}


export default Booking;  