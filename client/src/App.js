import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { loadImages } from "./actions/recipeActions";

import ScrollToTop from "./components/layout/ScrollToTop";

import Toasts from "./components/layout/Toasts";
import Landing from "./components/layout/Landing";
import Recipes from "./components/recipes/Recipes";
import Recipe from "./components/recipes/Recipe";
import Videos from "./components/recipes/Videos";
import Footer from "./components/layout/Footer";
import About from "./components/layout/About";
import Contact from "./components/layout/Contact";
import NotFound from "./components/layout/NotFound";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Account from "./components/auth/Account";
import AddRecipe from "./components/recipes/AddRecipe";
import EditRecipe from "./components/recipes/EditRecipe";

import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";

// Check for token to keep user logged in
if (localStorage.jwtToken) {

    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);

    // Decode token and get user info and exp
    const decoded = jwt_decode(token);

    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "./login";
  }
}

// Check from server if we should load images from Google Cloud Storage
loadImages()

function App() {
  return (
    <Provider store={store}>
      <Router>
          <ScrollToTop />
          <Navbar />
          <Toasts />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            {/*<Route exact path="/register" component={Register} />*/}
            <Route exact path="/login" component={Login} />
            <Route exact path="/recipes" component={Recipes} />
            <Route exact path="/recipes/category/:category" component={Recipes} />
            <Route exact path="/recipes/:id" component={Recipe} />
            <Route exact path="/videos" component={Videos} />
            <PrivateRoute exact path="/account" component={Account} />
            <PrivateRoute exact path="/add-recipe" component={AddRecipe} />
            <PrivateRoute exact path="/recipes/edit/:id" component={EditRecipe} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
      </Router>
    </Provider>
  );
}

export default App;
