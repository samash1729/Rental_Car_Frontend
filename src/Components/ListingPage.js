import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, CardSubtitle, FormFeedback } from 'reactstrap';
import DatePicker from 'react-datepicker';
import addDays from 'date-fns/addDays'
import "react-datepicker/dist/react-datepicker.css";
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
            seatingCapacity: '',
            startDate: new Date(),
            endDate: addDays(new Date(),1),
            cars:[],
            startDateString: (new Date()).toISOString(),
            endDateString: (new Date().toISOString()),
            redirectToBooking: false,
            touched:{
                seatingCap:false
            }
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.carMap = {};
    }


    handleBlur = (field) => (evt) =>{
        this.setState({
            touched: {...this.state.touched,[field]:true}
        })
    } 

    validate(seatingCap){
        const errors = {
            seatingCap:''
        }

        if(this.state.touched.seatingCap && parseInt(seatingCap)<=0){
            errors.seatingCap = "Seating Capacity must be more than 0";
        }
        else if(this.state.touched.seatingCap && parseInt(seatingCap)>10){
            errors.seatingCap = "Seating Capacity must be less than 11";
        }
        else if(this.state.touched.seatingCap && parseInt(seatingCap)!=parseFloat(seatingCap)){
            errors.seatingCap = "Float Values not allowed";
        }

        return errors;

    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }


    handleStartDateChange(date){
        this.setState({
            startDate: date,
            startDateString: String(date.toISOString()),
            endDate: addDays(date,1),
            endDateString: addDays(date,1).toISOString()
        })
    }

    handleDetails(car){
        alert("Car Name: " + car["carName"] + "\n" + "Vehicle No: " + car["vehicleNo"] 
        + "\n" + "Model: "+ car["model"] + "\n" + "Seating Capacity: " + car["seatingCap"]
        + "\n" + "Description: " + car["description"] + "\n" + "Price/Per day: " + car["price"]);

    }
    handleEndDateChange(date){
        this.setState({
            endDate: date,
            endDateString: date.toISOString()
        })
    }

    handleRedirect(car){
        this.final = this.carMap[car.vehicleNo];
        this.setState({
            redirectToBooking:true
        })
    }


    handleClick(){
        var query = {};
        if(this.state.startDateString < (new Date().toISOString())){
            alert("Start Date and Time Set to past. Please update");
            return;
        }
        if(this.state.startDateString >= this.state.endDateString){
            alert("Start Date must be less than end date");
            return;
        }
        query["issueDate"] = this.state.startDateString;
        query["returnDate"] = this.state.endDateString;
        if(this.state.seatingCapacity != ''){
            if(parseInt(this.state.seatingCapacity) != parseFloat(this.state.seatingCapacity)){
                alert("Seating Capacity must be an integer");
                return;
            }
            if(parseInt(this.state.seatingCapacity)<=0 || parseInt(this.state.seatingCapacity)>10){
                alert("Seating Capacity must be between 1 and 10");
                return;
            }
            query["seatingCap"] = this.state.seatingCapacity;
        }
        var url = new URL('http://localhost:3000/searches')
        url.search = new URLSearchParams(query).toString();
       fetch(url,{
           method:"GET"
       }).then(response => response.json()).then(data =>  {
           const totalContent = data.length;
           if(totalContent == 0){
               alert("No Cars available!");
           }
           this.setState({
               cars:data
           })
       });
    }


    render() {
        if(this.state.redirectToBooking){
            return <Redirect to={this.final}/>;
        }

        const errors = this.validate(this.state.seatingCapacity);
        const carList = this.state.cars.map((car => {
            
            car["issueDate"] = this.state.startDateString;
            car["returnDate"] = this.state.endDateString;
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
                    <h3>Search Car</h3>
                </div>
            </div>
             <div className="row">
                 <div className="col-12">
                    <Form>
                        <FormGroup row className="col-12">
                            <Label  className="h3" htmlFor="seatingCapacity" md={3}>Seating Capacity</Label>
                            <Col md={9}>
                                <Input className="border border-secondary" type="number" id="seatingCapacity" name="seatingCapacity"
                                    placeholder="Seating Capacity"
                                    value={this.state.seatingCapacity}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleBlur('seatingCap')}
                                    valid={errors.seatingCap === ''}
                                    invalid={errors.seatingCap !== ''} />
                                    <FormFeedback>
                                        {errors.seatingCap}
                                    </FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="col-12">
                            <Label  className="h3" htmlFor="startDate" md={3}>Start Date</Label>
                            <Col md={9}>
                                <DatePicker className="border border-secondary"
                                    name="startDate"
                                    selected={ this.state.startDate }
                                    onChange={ this.handleStartDateChange }
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={20}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                    maxDate={addDays(new Date(), 365)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row className="col-12">
                            <Label  className="h3" htmlFor="endDate" md={3}>End Date</Label>
                            <Col md={9}>
                                <DatePicker className="border border-secondary"
                                    name="endDate"
                                    selected={ this.state.endDate }
                                    onChange={ this.handleEndDateChange }
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={20}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={addDays(this.state.startDate,1)}
                                    maxDate={addDays(this.state.startDate, 365)}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                    <Button onClick={this.handleClick} className="btn btn-primary m-2" style={{backgroundColor:"primary"}}>
                       SEARCH
                    </Button>
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