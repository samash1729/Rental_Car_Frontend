import React, { Component } from 'react';
import Header from './headerComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Col,  FormFeedback } from 'reactstrap';
import DatePicker from 'react-datepicker';
import addDays from 'date-fns/addDays'
import "react-datepicker/dist/react-datepicker.css";
import './styles.css'
class Book extends Component{

    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            phoneNo:'',
            loadingTitle: 'Book a Car',
            name:'',
            startDate: new Date(),
            endDate: addDays(new Date(),1),
            startDateString: (new Date()).toISOString(),
            endDateString: addDays(new Date(),1).toISOString(),
            totalPrice:'',
            touched:{
                name:false,
                phoneNo:false
            }
        };
        this.result = {};
        this.q = '';
        this.makeTransaction = this.makeTransaction.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.carFixedRate = '';
    }

    handleBlur = (field) => (evt) =>{
        this.setState({
            touched: {...this.state.touched,[field]:true}
        })
    } 

    handleStartDateChange(date){
        this.setState({
            startDate: date,
            startDateString: String(date.toISOString()),
            endDate: addDays(date,1),
            endDateString: addDays(date,1).toISOString(),
            totalPrice:this.carFixedRate
        })
    }

    handleEndDateChange(date){
        this.setState({
            endDate: date,
            endDateString: date.toISOString(),
            totalPrice: String( Math.ceil((date.getTime() - this.state.startDate.getTime())/(3600*24*1000)) * parseFloat(this.carFixedRate))
        })
    }

    validate(name,phoneNo){
        const errors = {
            name:'',
            phoneNo:''
        }

        if(this.state.touched.name && (name.length>20 || name.length<3)){
            errors.name = "Name should have at least three and at most 20 characters";
        }

        const reg = /^\d+$/;

        if(this.state.touched.phoneNo && !reg.test(phoneNo)){
            errors.phoneNo = "All Characters must be digit";
        }

        if(this.state.touched.phoneNo && phoneNo.length !== 10){
            errors.phoneNo = "Phone Numbers must be ten digit long";
        }

        return errors;

    }

    CarInfo(){
        this.q=window.location.href.split('?');
        if(this.q.length>=2){
          this.q[1].split('&').forEach((item)=>{
               try {
                 this.result[item.split('=')[0]]=item.split('=')[1];
               } catch (e) {
                 this.result[item.split('=')[0]]='';
               }
          })
        }
        this.result["carName"] = this.result["carName"].replace(/[+]/g,' ');
        this.carFixedRate = this.result["price"];
        this.setState({
            totalPrice:this.carFixedRate
        })
      }

    makeTransaction(){
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

        query["vehicleNo"] = this.result["vehicleNo"];

        if(this.state.name.length <3 || this.state.name.length>20){
            alert("Name should be between three and twenty characters");
            return;
        }

        const reg = /^\d+$/;

        if(!reg.test(this.state.phoneNo) || this.state.phoneNo.length!==10){
            alert("Only digits allowed in phone field and must be 10 digits");
            return;
        }

        query["name"] = this.state.name.toString();
        query["phoneNo"] = this.state.phoneNo.toString();
        this.setState({
            loadingTitle: "Transaction In Progress..."
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        };
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        fetch(proxyUrl+'http://18.191.175.227:3000/transactions', requestOptions)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1){
                response.json().then(data => {
                    alert("Transaction Successful");
                    this.setState({
                        redirect:true
                    });
                  });
            }
            else{
                return response.text().then(data => alert("Transaction Unsuccessful" + "\n" + "Reason: " + data),
                this.setState({
                    loadingTitle:'Book a Car'
                }));
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    componentDidMount(){
        this.CarInfo();
    }
    

    render(){

        if(this.state.redirect){
            return <Redirect to='/home'/>;
        }
        const errors = this.validate(this.state.name,this.state.phoneNo);

        return(
            <React.Fragment>            
                <Header/>
                <div className="container" style={{backgroundColor:'#F2F2F2'}}>
                    <h3><center>{this.state.loadingTitle}</center></h3>
                    <div className="row mt-5">
                        <div className= "col-12 col-lg-4">
                            <table className="table table-condensed table-bordered">
                                <tr>
                                    <th>
                                        Parameters
                                    </th>
                                    <th>
                                        Values
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        Name
                                    </td>
                                    <td>
                                        {this.result["carName"]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Vehicle No
                                    </td>
                                    <td>
                                        {this.result["vehicleNo"]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Model Name
                                    </td>
                                    <td>
                                        {this.result["model"]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Color
                                    </td>
                                    <td>
                                        {this.result["color"]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Total Price
                                    </td>
                                    <td>
                                        Rs. {this.state.totalPrice}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Seating Capacity
                                    </td>
                                    <td>
                                        {this.result["seatingCap"]}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="col-12 col-lg-8">
                            <Form>
                                    <FormGroup row>
                                        <Label  className="h3" htmlFor="name" lg={3}>Name</Label>
                                        <Col lg={5}>
                                            <Input className="border border-secondary" type="text" id="name" name="name"
                                                placeholder="Full Name"
                                                value={this.state.name}
                                                onChange={this.handleInputChange} 
                                                onBlur={this.handleBlur('name')}
                                                valid={errors.name === ''}
                                                invalid={errors.name !== ''}/>
                                                 <FormFeedback>
                                                    {errors.name}
                                                </FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label  className="h3" htmlFor="phoneNo" lg={3}>Phone Number</Label>
                                        <Col lg={5}>
                                            <Input className="border border-secondary" type="number" id="phoneNo" name="phoneNo"
                                                placeholder="Phone Number"
                                                value={this.state.phoneNo}
                                                onChange={this.handleInputChange} 
                                                onBlur={this.handleBlur('phoneNo')}
                                                valid={errors.phoneNo === ''}
                                                invalid={errors.phoneNo !== ''}/>
                                                <FormFeedback>
                                                   {errors.phoneNo} 
                                                </FormFeedback>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label  className="h3" htmlFor="startDate" lg={8}>Start Date</Label>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col lg={8}>
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
                                    <FormGroup row>
                                        <Label  className="h3" htmlFor="endDate" lg={8}>End Date</Label>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col lg={8}>
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
                        <Button onClick={this.makeTransaction}>
                                MAKE TRANSACTION
                        </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Book;