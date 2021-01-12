import React, { useState, useEffect } from "react";

import Header from "./../Header";
import Banner from "./../Banner"

import "./styles.css";
import { withRouter } from 'react-router-dom';
import { Button, TextField, Paper } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { createUser, getUserByName } from "./../../action/user";
import UserContext from "./../UserContext";

const log = console.log;
// need to post new user
const SignUp = props => {
  const [account, setAccount] = useState({ 
    name: '', 
    password: '', 
    re_password: '' 
  });

  const [error, setError] = useState({ 
    user: false, 
    password: false, 
    re_password: false
  });

  const [helper, setHelper] = useState({ 
    user: '', 
    password: '', 
    re_password: ''
  });

  const [tempUser, setTempUser] = useState(null);

  useEffect(() => {
    const updateTempUser = async () => {
      const temp = await getUserByName(account.name);
      setTempUser(temp);
    }

    updateTempUser();
  }, [account.name]);

  const userChangeHandler = (e) => {
    const name = e.target.value;
    let err = false;
    let help = '';
    if (name === '') {
      err = true;
      help = 'empty username';
    } else {
      err = false;
      help = '';
    }

    setAccount({ 
      ...account,
      name: name
    });

    setError({
      ...error,
      user: err
    });

    setHelper({
      ...helper,
      user: help
    });
  }

  const passwordChangeHandler = (e) => {
    const name = e.target.value;
    let err = false;
    let help = '';
    if (name === '') {
      err = true;
      help = 'empty password';
    } else {
      err = false;
      help = '';
    }

    setAccount({ 
      ...account,
      password: name
    });

    setError({
      ...error,
      password: err
    });

    setHelper({
      ...helper,
      password: help
    });
  }

  const rePasswordChangeHandler = (e) => {
    const name = e.target.value;
    let err = false;
    let help = '';
    if (name === '') {
      err = true;
      help = 'empty password';
    } else {
      err = false;
      help = '';
    }

    setAccount({ 
      ...account,
      re_password: name
    });

    setError({
      ...error,
      re_password: err
    });

    setHelper({
      ...helper,
      re_password: help
    });
  }

  const onClickHandler = (e) => {
    
    const user = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const re_password = document.getElementById('re_password').value;

    let userErr = false;
    let userHelper = '';
    let passwordErr = false;
    let passwordHelper = '';
    let rePasswordErr = false;
    let rePasswordHelper = '';

    if (password === '') {
      log('empty password')
      passwordErr = true;
      passwordHelper = 'empty password';
    }

    if (re_password === '') {
      log('empty re_password')
      rePasswordErr = true;
      rePasswordHelper = 'empty password';
    }

    if (user === '') {
      log('empty username')
      userErr = true;
      userHelper = 'empty username';
    }

    if (!userErr && !passwordErr && !rePasswordErr){
      if (password !== re_password) {
        rePasswordErr = true;
        rePasswordHelper = 'password does not match';
      } else {
        setAccount({ 
          name: user,
          password: password,
          re_password: re_password
        });

        if (tempUser) {
          userErr = true;
          userHelper = 'username exist';
        } else {
          if (createUser(account)) {
            if (props.history) {
              props.history.push(`/login/`);
            }
          } else {
            userErr = true;
            userHelper = 'something wrong';
          }
        }
      }

      setError({
        user: userErr,
        password: passwordErr, 
        re_password: rePasswordErr
      });
  
      setHelper({
        user: userHelper,
        password: passwordHelper, 
        re_password: rePasswordHelper
      });

      setTempUser(null);
    }
  }
  return(
    <div className="SignUp">
      <Paper 
        id="header"
        elevation={10}
      >
        <Header 
          history={props.history}
          app={props.app}
          search={false}
        />
      </Paper>

      <div id="banner">
        <Banner
          history={props.history}
          rank= {false}
        />
      </div>

      <div id="signup__content">
        <div className="signup__center">
          <Paper 
            className="signup__paper"
            elevation={10}
          >
            <p className="signup__centerItem">
              <span className="signup__title">
                Sign Up
              </span>
            </p>

            <div className="signup__centerItem">
              <AccountCircle 
                className="icon"
                fontSize="large"
              />
            </div>

            
            <div className="signup__box">
              <TextField
                id="username"
                className="signup"
                error={error.user}
                label="Username"
                type="username"
                helperText={helper.user}
                variant="outlined"
                onChange={userChangeHandler}
              />

            </div>

            <div className="signup__box">
              <TextField
                id="password"
                className="signup"
                error={error.password}
                label="Password"
                type="password"
                helperText={helper.password}
                variant="outlined"
                onChange={passwordChangeHandler}
              />
            </div>

            <div className="signup__box">
              <TextField
                id="re_password"
                className="signup"
                error={error.re_password}
                label="Repeat Password"
                type="password"
                helperText={helper.re_password}
                variant="outlined"
                onChange={rePasswordChangeHandler}
              />
            </div>

            <div className="signup__return">
              <Button 
                className="signup__submit"
                variant="contained"
                onClick={onClickHandler}
              >
                Sign Up
              </Button>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default withRouter(SignUp);