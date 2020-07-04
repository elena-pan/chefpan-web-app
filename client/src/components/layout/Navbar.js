import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import M from "materialize-css";
import { logoutUser } from "../../actions/authActions";
import logo from "../../logo.svg";

class Navbar extends Component {

    state = {
        boxShadow: "none",
        menuBoxShadow: "0 0.1px 3px 0 lightgrey",
        active: "none",
        search: "none",
        searchInput: ""
    }

    componentDidMount = () => {
        const elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, { edge:'right' });
    }

    onActive = () => {
        this.setState({ boxShadow: "inset 0 -2px 0 0 #f57f17" });
        this.setState({ active: "" });
        this.setState({ menuBoxShadow: "none" });
    }

    onLeave = () => {
        this.setState({ boxShadow: "none" });
        this.setState({ active: "none" });
        this.setState({ menuBoxShadow: "0 0.1px 3px 0 lightgrey"});
    }

    onOpenSearch = () => {
        this.setState({ search: "" });
    }

    onCloseSearch = () => {
        this.setState({ search: "none" });
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    loginLogoutLinks = () => {
        if (this.props.auth.isAuthenticated) {
            return (
                <>
                <li>
                <Link to="/account">
                    <i className="material-icons black-text">account_circle</i>
                </Link>
                </li>
                <li>
                    <Link to="#" className="yellow-text text-darken-4" onClick={this.onLogoutClick}>Logout</Link>
                </li>
                </>
            )
        } 
        else {
            return (<div></div>)
        }
    }

    onSearchChange = e => {
        this.setState({ searchInput: e.target.value });
    }
    onSearch = e => {
        e.preventDefault();
        if (!this.state.searchInput.trim()) {
            this.onCloseSearch();
        }
        let urlParams = this.state.searchInput.trim().split(",").reduce((acc, term)  => acc.trim() + "-" + term.trim()) 
        this.setState({ searchInput: "" });
        this.onCloseSearch();
        this.props.history.push(`/recipes/category/${urlParams}`);
    }

    render() {
        return (
            <div>
                <div style={{display:this.state.search, height:"100%", zIndex:"1000", width:"100%", position:"fixed", backgroundColor:"rgba(0,0,0, 0.7)"}}>
                    <div className="container" style={{paddingTop:"10vh"}}>
                        <Link onClick={this.onCloseSearch}><i className="material-icons white-text right">close</i></Link>
                        <form style={{paddingTop:"30vh"}} onSubmit={this.onSearch}>
                            <div className="input-field">
                                <i className="material-icons white-text prefix">search</i>
                                <input type="text" className="white-text" onChange={this.onSearchChange} value={this.state.searchInput} placeholder="Separate search terms with commas (e.g. pastries, chocolate)" />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="navbar-fixed">
                <nav className="z-depth-0">
                    <div className="nav-wrapper white" style={{boxShadow: this.state.menuBoxShadow}}>
                    <div className="container">
                    <Link to="#" className="sidenav-trigger right" data-target="mobile-nav">
                        <i className="material-icons black-text">menu</i>
                    </Link>
                    <Link to="/">
                        <img src={logo} alt="Elemations" style={{height:"60px"}} />
                    </Link>
                    <ul className="right">
                            <li style={{paddingLeft:"1rem", paddingRight:"1rem"}}>
                                <Link to="#" onClick={this.onOpenSearch}><i className="material-icons black-text">search</i></Link>
                            </li>
                    </ul>
                    <ul className="right hide-on-med-and-down">
                            <li onMouseEnter={ this.onActive }  onClick={this.onLeave} id="recipesLink" style={{ boxShadow: this.state.boxShadow }}>
                                <Link to="/recipes" className="black-text">
                                    Recipes
                                </Link>
                            </li>
                            <li>
                                <Link to="/videos" className="black-text">
                                    Videos
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="black-text">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="black-text">
                                    Contact
                                </Link>
                            </li>
                            { this.loginLogoutLinks() }
                        </ul>
                    </div>
                    </div>
                </nav>
                </div>
                <div className="white" onMouseEnter={this.onActive} onMouseLeave={this.onLeave} id="submenu" style={{display:this.state.active, zIndex:"200", width:"100%", position:"fixed",boxShadow:"0 0.1px 15px 0 grey"}}>
                    <div className="wrapper" style={{padding:"1rem 0 0 3rem"}}>
                        <div className="row">
                        <div className="col s4">
                            <ul>
                            <li style={{paddingBottom:"0.5rem",marginRight:"3rem",borderBottom:"2px solid #f57f17",marginBottom:"1rem"}}><h6><b>Course</b></h6></li>
                            <li><Link to="/recipes/category/breakfast-brunch" className="black-text" onClick={this.onLeave}>Breakfast and Brunch</Link></li>
                            <li><Link to="/recipes/category/lunch" className="black-text" onClick={this.onLeave}>Lunch</Link></li>
                            <li><Link to="/recipes/category/dinner" className="black-text" onClick={this.onLeave}>Dinner</Link></li>
                            <li><Link to="/recipes/category/desserts" className="black-text" onClick={this.onLeave}>Desserts</Link></li>
                            </ul>
                        </div>
                        <div className="col s4">
                            <ul>
                            <li style={{paddingBottom:"0.5rem",marginRight:"3rem",borderBottom:"2px solid #f57f17",marginBottom:"1rem"}}><h6><b>Dish Type</b></h6></li>
                            <li><Link to="/recipes/category/soups-stews-braises" className="black-text" onClick={this.onLeave}>Soups, Stews, and Braises</Link></li>
                            <li><Link to="/recipes/category/pasta-noodles" className="black-text" onClick={this.onLeave}>Pasta and Noodles</Link></li>
                            <li><Link to="/recipes/category/sandwiches-toasts" className="black-text" onClick={this.onLeave}>Sandwiches and Toasts</Link></li>
                            <li><Link to="/recipes/category/bread" className="black-text" onClick={this.onLeave}>Bread</Link></li>
                            </ul>
                        </div>
                        <div className="col s4">
                            <ul>
                            <li style={{paddingBottom:"0.5rem",marginRight:"3rem",borderBottom:"2px solid #f57f17",marginBottom:"1rem"}}><h6><b>Cooking Method</b></h6></li>
                            <li><Link to="/recipes/category/baking-roasting" className="black-text" onClick={this.onLeave}>Baking and roasting</Link></li>
                            <li><Link to="/recipes/category/frying" className="black-text" onClick={this.onLeave}>Frying</Link></li>
                            <li><Link to="/recipes/category/pan%20recipes" className="black-text" onClick={this.onLeave}>Pan recipes</Link></li>
                            <li><Link to="/recipes/category/braises-boiling" className="black-text" onClick={this.onLeave}>Braises and boiling</Link></li>
                            <li><Link to="/recipes/category/no%20cook" className="black-text" onClick={this.onLeave}>No cook</Link></li>
                            </ul>
                        </div>
                        <div className="row">
                        <div className="col s4">
                            <ul>
                            <li style={{paddingBottom:"0.5rem",marginRight:"3rem",borderBottom:"2px solid #f57f17",marginBottom:"1rem"}}><h6><b>Cuisine</b></h6></li>
                            <li><Link to="/recipes/category/east%20asian" className="black-text" onClick={this.onLeave}>East Asian</Link></li>
                            <li><Link to="/recipes/category/mexican" className="black-text" onClick={this.onLeave}>Mexican</Link></li>
                            <li><Link to="/recipes/category/indian" className="black-text" onClick={this.onLeave}>Indian</Link></li>
                            <li><Link to="/recipes/category/southern" className="black-text" onClick={this.onLeave}>Southern</Link></li>
                            </ul>
                        </div>
                        <div className="col s4">
                            <ul>
                            <li style={{paddingBottom:"0.5rem",marginRight:"3rem",borderBottom:"2px solid #f57f17",marginBottom:"1rem"}}><h6><b>Desserts</b></h6></li>
                            <li><Link to="/recipes/category/cookies" className="black-text" onClick={this.onLeave}>Cookies</Link></li>
                            <li><Link to="/recipes/category/cheesecakes" className="black-text" onClick={this.onLeave}>Cheesecakes</Link></li>
                            <li><Link to="/recipes/category/cakes-brownies" className="black-text" onClick={this.onLeave}>Cakes and Brownies</Link></li>
                            <li><Link to="/recipes/category/pastries-choux" className="black-text" onClick={this.onLeave}>Pastries and Choux</Link></li>
                            <li><Link to="/recipes/category/fillings-custards-sauces" className="black-text" onClick={this.onLeave}>Fillings, Custards, and Sauces</Link></li>
                            <li><Link to="/recipes/category/ice%20cream" className="black-text" onClick={this.onLeave}>Ice Cream</Link></li>
                            </ul>
                        </div>
                        <div className="col s4">
                            <ul>
                                <li style={{paddingBottom:"0.5rem",marginRight:"2rem",borderBottom:"2px solid #f57f17",marginBottom:"1rem"}}><h6><b>Favourites</b></h6></li>
                                <li><Link to="/recipes/category/basics" className="black-text" onClick={this.onLeave}>Basics</Link></li>
                                <li><Link to="/recipes/category/chicken" className="black-text" onClick={this.onLeave}>Chicken</Link></li>
                                <li><Link to="/recipes/category/pork" className="black-text" onClick={this.onLeave}>Pork</Link></li>
                                <li><Link to="/recipes/category/project%20recipes" className="black-text" onClick={this.onLeave}>Project Recipes</Link></li>
                                <li><Link to="/recipes/category/comfort%20food" className="black-text" onClick={this.onLeave}>Comfort Food</Link></li>
                                <li><Link to="/recipes/category/aesthetic" className="black-text" onClick={this.onLeave}>Aesthetic</Link></li>
                                <li><Link to="/recipes/category/gift%20ideas" className="black-text" onClick={this.onLeave}>Gift Ideas</Link></li>
                            </ul>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
                <ul className="sidenav" id="mobile-nav">
                    <li>
                        <Link to="/recipes" className="black-text">
                            Recipes
                        </Link>
                    </li>
                    <li>
                        <Link to="/videos" className="black-text">
                            Videos
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="black-text">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="black-text">
                            Contact
                        </Link>
                    </li>
                    { this.loginLogoutLinks() }
                </ul>
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(Navbar));