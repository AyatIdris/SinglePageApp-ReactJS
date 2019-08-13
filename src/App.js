/* @flow */
import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import List from './components/List';
import Summary from './components/Summary';
import Details from './components/Details';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="font-sans font-thin text-sm">
          <div className="flex flex-col bg-blue-lightest">
            <Header />
            <Content />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const Header = () => (
  <div className="p-3">
    <div className="flex p-2">
      <div className="flex mr-2">
        <Link to="/">Home</Link>
      </div>
      <Summary />
    </div>
  </div>
);

const Content = () => (
  <div className="p-3 bg-grey-lightest">
    <Route exact path="/" render={() => <List />} />
    <Route exact path="/:id" render={props => <Details {...props} />} />
  </div>
);

export default App;
