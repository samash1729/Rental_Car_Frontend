import React, { Component } from 'react';
import Header from './headerComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Col,  FormFeedback } from 'reactstrap';

class Book extends Component{

    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            phoneNo:'',
            name:'',
            touched:{
                name:false,
                phoneNo:false
            }
        };
        this.result = {};
        this.q = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.days = '';
        this.makeTransaction = this.makeTransaction.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleBlur = (field) => (evt) =>{
        this.setState({
            touched: {...this.state.touched,[field]:true}
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
        this.result["issueDate"] = this.result["issueDate"].replace(/%3A/g,":");
        this.result["returnDate"] = this.result["returnDate"].replace(/%3A/g,":");
        this.startDate = new Date(this.result["issueDate"]);
        this.endDate = new Date(this.result["returnDate"]);
        this.result["carName"] = this.result["carName"].replace('+',' ');
        this.result["price"] = Math.ceil((this.endDate.getTime() - this.startDate.getTime())/(3600*24*1000)) * parseFloat(this.result["price"]);
      }

    makeTransaction(){
        var query = {};
        query["issueDate"] = this.result["issueDate"];
        query["returnDate"] = this.result["returnDate"];
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
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        };
        fetch('http://18.191.175.227:3000/transactions', requestOptions)
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
                return response.text().then(data => alert(data));
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
    

    render(){

        if(this.state.redirect){
            return <Redirect to='/home'/>;
        }

        this.CarInfo();
        const errors = this.validate(this.state.name,this.state.phoneNo);

        return(
            <React.Fragment>            
                <Header/>
                <div className="container" style={{backgroundColor:'#F2F2F2'}}>
                    <h3><center>Book a Car</center></h3>
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
                                        Rs. {this.result["price"]}
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
                                <tr>
                                    <td>
                                        Start Date
                                    </td>
                                    <td>
                                        {this.startDate.toDateString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        End Date
                                    </td>
                                    <td>
                                        {this.endDate.toDateString()}
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