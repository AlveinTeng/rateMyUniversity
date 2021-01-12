import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { InputBase, Button, Paper, Box, IconButton, Divider, ButtonGroup } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FaceIcon from '@material-ui/icons/Face';
import logo from '../logo4.png';
import "./styles.css";
import { getUserByName, checkSession } from "./../../action/user"
import { getUniversities, searchUniversity } from "./../../action/university"
import { logout } from "./../../action/user";
import UserContext from "./../UserContext";

const log = console.log;

class Header extends React.Component {
  state = {
    user: undefined,
    universities: [],
    loading: true,
    change: false,
    anchor: null,
    filterDisplay: []
  }

  constructor(props) {
    super(props);
  }

  handleOnChange = (newWord) => {
    const oldArr = this.state.universities.map(university => {
      return { name: university.name.toLowerCase(), id: university.id };
    });

    if (newWord !== "") {
      const newArr = [];
      for (let i=0; i<oldArr.length; i++) {
        if (oldArr[i].name.includes(newWord.toLowerCase())) {
          newArr.push(oldArr[i])
        }
      }
      this.setState(prevState => ({...prevState, filterDisplay: newArr}));
    } else {
      this.setState(prevState => ({...prevState, filterDisplay: oldArr}));
    }
  }

  updateSearch = (e) => {
    const universityName = e.target.innerText.toLowerCase();
    let university = undefined;
    let i = 0;
    while (university === undefined) {
      const universityProp = this.state.universities[i]
      if (universityProp.name.toLowerCase() === universityName) {
        university = universityProp;
      }
      i ++;
    }

    document.getElementById("header__search").value = university.name;
    this.setState(prevState => ({...prevState, change: false}));
  }

  onClickUser = () => {
    if (this.props.history) {
      if (this.state.user.name) {
        this.props.history.push(`/user/${this.state.user._id}`);
      } else {
        this.props.history.push(`/Error`);
      }
    }
    this.handleClose();
  }

  onClickNotification = () => {
    if (this.props.history) {
      if (this.state.user.name) {
        this.props.history.push(`/notification/${this.state.user._id}`);
      } else {
        this.props.history.push(`/Error`);
      }
    }
  }

  onClickLogout = () => {
    logout(this.props.app);
    this.setState(prevState => ({...prevState, user: undefined}));
    this.handleClose();
  }

  onClickMenu = (event) => {
    const target = event.currentTarget;
    this.setState(prevState => ({...prevState, anchor: target}));
  }

  handleClose = () => {
    this.setState(prevState => ({...prevState, anchor: null}));
  }

  topRightChange = (login) => {
    if (!login) {
      return (
        <div className="topRight">
          <div className="header__topRight">
            <Link 
              className="header__sign"
              to={'/signup/'} 
            >
              SIGN UP
            </Link>
          </div>

          <div className="header__topRight">
            <Link
              className="header__sign"
              to={'/login/'} 
            >
              LOGIN
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="topRight">
          <div className="header__topRightIcon">
            <IconButton 
              className="user"
              type="submit"
              onClick={this.onClickMenu}
            >
              <FaceIcon 
                className="header__icon"
              />
            </IconButton>
          </div>

          <div className="header__topRightIcon">
            <IconButton
              className="notification"
              type="submit"
              onClick={this.onClickNotification}
            >
              <NotificationsIcon 
                className="header__icon"
              />
            </IconButton>
          </div>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchor}
            keepMounted
            open={Boolean(this.state.anchor)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.onClickUser}>Profile</MenuItem>
            <MenuItem onClick={this.onClickLogout}>Logout</MenuItem>
          </Menu>
        </div>
      );
    }
  }

  searchBar = (search) => {
    if (search) {
      return (
        <div className="header__searchBar">
          <InputBase
            id="header__search"
            className="header__input"
            placeholder="Seach here..."
            onFocus={() => {
              const newWord = document.getElementById('header__search').value
              this.handleOnChange(newWord)
              this.setState(prevState => ({...prevState, change: true}));
            }}
            onChange={() => {
              const newWord = document.getElementById('header__search').value
              this.handleOnChange(newWord)
            }}
          />

          <Button 
            className="header__submit"
            onClick={this.searchUni}
          >
            <SearchIcon/>
          </Button>

          {this.state.change?
            <ButtonGroup
              className="header__test"
              orientation="vertical"
              aria-label="vertical outlined primary button group"
            >

              {this.state.filterDisplay.map(university => {
                return (
                  <Button size="small" onClick={this.updateSearch} >{university.name}</Button>
                )
              })}

            </ButtonGroup> : <div></div>
          }
        </div>
      );
    }
  }

  searchUni = (e) => {
    const search = document.getElementById('header__search').value;
    
    if (search == '') {
      return;
    }
    
    this.props.history.push(searchUniversity(this.state.universities, search));
  }

  componentDidMount = async () =>  {
    getUniversities().then(unis => { 
      this.setState(prevState => ({...prevState, universities: unis.universities})); 
    });
    const name = this.props.app.state.currentUser
    if (name) {
      const newUser = await getUserByName(name);
      this.setState(prevState => ({...prevState, user: newUser})); 
    }
    this.setState(prevState => ({...prevState, loading: false})); 
  }


  render() {
    window.addEventListener('scroll', event => {
      this.setState(prevState => ({...prevState, change: false}));
    })

    return (
      <div>
        {this.state.loading? <div/> : <div className="Header">
          <div className="header__topLeft">
            <Link 
              className="header__title noUnderline smallFontSize" 
              to={'/search?'}
            >
              RateMyUniversity
            </Link>
          </div>
          
          <Link
            className="header__topLeft" 
            to={'/search?'}
          >
            <img src={logo} className="logo"/>
          </Link>
  
          {this.topRightChange(this.props.app.state.currentUser)}
  
          {this.searchBar(this.props.search)}
      </div>}
      </div>
    );
  }
}

export default withRouter(Header);