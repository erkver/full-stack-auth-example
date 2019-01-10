import React, { Component } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./components/Login/Login";
import Private from "./components/Private/Private";
import Signup from "./components/Signup/Signup";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    console.log(this.props);
    return (
      <HashRouter>
        <div>
          <Route component={Login} path="/" exact />
          <Route component={Signup} path="/signup" exact />
          {/* 
          <Route
            render={() =>
              this.props.user.username ? <Private /> : <Redirect to="/" />
            }
            path="/private"
          /> */}
          <Route component={Private} path="/private" exact />
        </div>
      </HashRouter>
    );
  }
}

export default connect(state => state)(App);
