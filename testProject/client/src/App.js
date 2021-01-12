import React, { useState } from 'react'

import {Route, Switch, BrowserRouter} from 'react-router-dom'
import logo from "./react-components/logo4.png";
import './App.css';

import Search from './react-components/Search';
import Rank from './react-components/Rank';
import SignIn from './react-components/SignIn';
import SignUp from './react-components/SignUp';
import Rate from './react-components/Rate';
import Notification from './react-components/Notification';
import University from './react-components/University';
import User from './react-components/User';
import Error from './react-components/Error';

import { checkSession } from './action/user';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setState(prevState => {return {...prevState, loading: true}});
    checkSession().then(result => {
      this.setState(prevState => {return {...prevState, currentUser: result.currentUser, adminStatus: result.adminStatus, loading: false}});
    })
  }

  state = {
    currentUser: null,
    adminStatus: null,
    loading: true
  }

  render() {
    const { currentUser } = this.state;

    return (

      <div>
        {this.state.loading? <div/> : <BrowserRouter>
          <Switch>

            <Route 
              exact path={['/', '/search']}
              render={({ history }) => (<Search history={history} app={this}/>)}
            />

            <Route 
              exact path={['/signup']}
              render={({ history }) => (<SignUp history={history} app={this}/>)}
            />

            <Route 
              exact path={['/rank']}
              render={({ history }) => (<Rank history={history} app={this}/>)}
            />

            <Route 
              exact path={['/university/:id']}
              render={({ history }) => (<University history={history} app={this}/>)}
            />

            <Route 
              exact path={['/', '/login', '/notification/:id']}
              render={({ history }) => (
                <div>
                  {!currentUser? <SignIn history={history} app={this}/> : <Notification history={history} app={this}/>}
                </div>
              )}
            />

            <Route 
              exact path={['/', '/login', '/user/:id']}
              render={({ history }) => (
                <div>
                  {!currentUser? <SignIn history={history} app={this}/> : <User history={history} app={this}/>}
                </div>
              )}
            />

            <Route 
              exact path={['/', '/login', '/rate/:id']}
              render={({ history }) => (
                <div>
                  {!currentUser? <SignIn history={history} app={this}/> : <Rate history={history} app={this}/>}
                </div>
              )}
            />

            <Route
              render = {() => <div>404 not found</div>}
            />
          </Switch>
        </BrowserRouter>}
      </div>
    )
  }
}

export default App;
