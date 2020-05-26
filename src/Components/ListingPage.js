import React, { Component } from 'react';
import { Button, CardSubtitle} from 'reactstrap';
import { Card, CardBody,CardTitle } from 'reactstrap';
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './headerComponent';
import {Redirect} from 'react-router-dom';


class ListPage extends Component{

    constructor(props) {
        super(props);

        this.final = "/bookacar";

        this.state = {
            cars:[],
            redirectToBooking: false,
            apiState:'Loading Cars...'
        };
        this.handleDetails = this.handleDetails.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);

        this.carMap = {};
    }

    CarListApiCall(){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        fetch(proxyUrl+'http://18.191.175.227:3000/cars',requestOptions).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1){
                response.json().then(data => {
                    this.setState({
                        cars:data,
                        apiState:'List of All Cars'
                    });
                  });
            }
            else{
                return response.text().then(data => this.setState({
                    apiState:'No Cars Available!'
                }));
            }
        });
        
        
        // response.json()).then(data =>  {
        //     if(data.length === 0){
        //         this.setState({
        //             apiState: 'No Cars Available!'
        //           });
        //           return;
        //     }
        //     this.setState({
        //         cars:data,
        //         apiState:'List of All Cars'
        //     })
        // });
     }

     componentDidMount(){
        this.CarListApiCall();
      }



    handleDetails(car){
        alert("Car Name: " + car["carName"] + "\n" + "Vehicle No: " + car["vehicleNo"] 
        + "\n" + "Model: "+ car["model"] + "\n" + "Seating Capacity: " + car["seatingCap"]
        + "\n" + "Description: " + car["description"] + "\n" + "Price/Per day: " + car["price"]);

    }

    handleRedirect(car){
        this.final = this.carMap[car.vehicleNo];
        this.setState({
            redirectToBooking:true
        })
    }



    render() {
        if(this.state.redirectToBooking){
            return <Redirect to={this.final}/>;
        }

        const carList = this.state.cars.map((car => {
            
            this.final = "/bookacar";
            var params = new URLSearchParams(car).toString();
            this.final += "?";
            this.final += params;
            this.carMap[car.vehicleNo] = this.final;
            return(
                <div  className="col-12 m-1">
                    <Card key={car._id} className="m-1">
                        <CardBody>
                            <CardTitle className="m-1">{car.carName}</CardTitle>
                            <CardSubtitle className="m-1">Rs {car.price}/per day</CardSubtitle>
                            <Button onClick={() => this.handleDetails(car)}  className="btn btn-primary m-2" >Details</Button>
                            <Button onClick={() => this.handleRedirect(car)}  className="btn btn-primary m-2" >Book Car</Button>
                        </CardBody>
                    </Card>
                </div>
            );
        }));
        return (
        <div style={{backgroundColor:'#F2F2F2'}}>
        <Header/>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h3><center>{this.state.apiState}</center></h3>
                </div>
            </div>
            <div className="row">
                {carList}
            </div>
        </div>
        </div>
        );
      }
}

export default ListPage;