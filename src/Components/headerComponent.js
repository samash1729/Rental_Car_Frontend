import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavItem,  Nav, Jumbotron, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            isNavOpen:false
        }
        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav(){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        })
    }
    render() {
        return (
            <React.Fragment>
                <Navbar dark color="primary" expand="md">
                    <NavbarToggler onClick={this.toggleNav}/>
                    <NavbarBrand className="mr-auto" href="/">
                    <   img src='logo192.png' height="30" width="41" alt='Ristorante Con Fusion' />
                    </NavbarBrand>
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link"  to='/home'>Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/menu'>All Transactions</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                <Jumbotron>
                    <div className="container" >
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1>Bangalore Car Rental Service</h1>
                                <p>We provide the world's best car rental experience to our customers with door-to-door delivery of vehicles with excellent maintenance at the lowest prices.</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
            </React.Fragment>
        );
      }
}

export default Header;