import React, { useState, useContext, useEffect } from "react";

import Header from "./../Header";
import Banner from "./../Banner"

import "./styles.css";
import { withRouter } from 'react-router-dom';
import { Button, TextField, Paper } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { login, getUserByName, checkPassword } from "./../../action/user";
import UserContext from "./../UserContext";

const log = console.log;
// need to post user and save as useContext
const SignIn = props => {
  const [account, setAccount] = useState({ 
    name: '', 
    password: '' 
  });

  const [error, setError] = useState({ 
    user: false, 
    password: false
  });

  const [helper, setHelper] = useState({ 
    user: '', 
    password: '' 
  });

  const [success, setSuccess] = useState(false);
  const [allowSetUser, setAllowSetUser] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      const temp = await getUserByName(account.name);
      if (temp !== null) {
        const check = (await checkPassword(temp._id, account)).check;
        setSuccess(check);
      }
    }
    checkLogin();
  }, [account])

  useEffect(() => {
    const setUser = async () => {
      const temp = await getUserByName(account.name);
      setAllowSetUser(temp);
    }
    setUser();
  }, [success])

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

  const onClickHandler = (e) => {
    const user = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let userErr = false;
    let userHelper = '';
    let passwordErr = false;
    let passwordHelper = '';

    if (password === '') {
      log('empty password')
      passwordErr = true;
      passwordHelper = 'empty password';
    }

    if (user === '') {
      log('empty username')
      userErr = true;
      userHelper = 'empty username';
    }

    if (!userErr && !passwordErr) {
      setAccount({ 
        name: user,
        password: password
      });

      if (success) {
        login(account, props.app);
        if (props.history) {
          props.history.push(`/user/${allowSetUser._id}`);
        }
      } else if (allowSetUser !== "") {
        passwordErr = true;
        passwordHelper = 'invalid password';
      } else {
        userErr = true;
        userHelper = 'invalid username';
      }
    }

    setError({
      user: userErr,
      password: passwordErr
    });

    setHelper({
      user: userHelper,
      password: passwordHelper
    });
  }

  return (
    <div className="SignIn">
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

      <div id="signin__content">
        <div className="signin__center">
          <Paper 
            className="signin__paper"
            elevation={10}
          >
            <p className="signin__centerItem">
              <span className="signin__title">
                Sign In
              </span>
            </p>

            <div className="signin__centerItem">
              <AccountCircle 
                className="icon"
                fontSize="large"
              />
            </div>

            <div className="signin__box">
              <TextField
                id="username"
                className="signin"
                error={error.user}
                label="Username"
                type="username"
                helperText={helper.user}
                variant="outlined"
                onChange={userChangeHandler}
              />

            </div>

            <div className="signin__box">
              <TextField
                id="password"
                className="signin"
                error={error.password}
                label="Password"
                type="password"
                helperText={helper.password}
                variant="outlined"
                onChange={passwordChangeHandler}
              />
            </div>

            <div className="signin__return">
              <Button 
                className="signin__submit"
                variant="contained"
                onClick={onClickHandler}
              >
                Login
              </Button>
            </div>
          </Paper>
        </div>

      </div>
    </div>
  );
}

export default withRouter(SignIn);