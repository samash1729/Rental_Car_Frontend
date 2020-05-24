import React from 'react';
import { Component } from 'react';
import ListPage from './Components/ListingPage';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import Booking from './Components/CurrentBooking';
import Book from './Components/BookCar';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      car:{}
    }
  }
  render() {
    const BookingPage = () => {
      return(
          <Booking
          />
      );
    }
    return (
      <BrowserRouter>
      <div>
      <Switch>
              <Route path='/home' component={ListPage} />
              <Route exact path='/menu' component={BookingPage}/>} />
              <Route exact path='/bookacar/' component={Book}/>}>
              <Redirect to="/home" />
      </Switch>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
