import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import Main from './main.js';

class Router extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        {/* <Route
            path="/search/:query"
            render={(routeProps) => (
                <SearchResults {...routeProps} />
            )}
        /> */}
      </Switch>
    );
  }
}

export default Router;