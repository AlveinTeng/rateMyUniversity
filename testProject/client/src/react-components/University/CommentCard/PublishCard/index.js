import React, { useState, useContext } from "react";


import { Link } from "react-router-dom";
import { Button, Paper, Snackbar, IconButton, Divider } from "@material-ui/core";
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import defaultLogo from "./../../../headspicture/defaulthead.png";
import TimeGenerator from './../../../TimeGenerator';
import "./styles.css"

import UserContext from "./../../../UserContext";

const log = console.log;

class PublishCard extends React.Component {
  state = {
    user: undefined,
    login: undefined,
    loading: true,
    error: false
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const user = this.props.user;
    const login = this.props.login;

    this.setState(prevState => {return {...prevState, user: user, login: login, loading: false}});
  }

  showProfile() {
    if (this.state.user.profile.image === "") {
      return defaultLogo;
    }
    return this.state.user.profile.image;
  }

  render() {

    return (
      <div>
        {this.state.loading? <div/> : <div className="commentcard__publishArea">
      <div className="commentcard__userArea">
        <div
          className="commentcard__userLink"
        >
          <Link 
            to={this.state.login ? `/user/${this.state.user._id}` : '/login'}
          >
            <img src={this.state.login ? this.showProfile() : defaultLogo} className="userImage"/>
          </Link>
        </div>

        <textarea 
          id="post__comment"
          className={this.state.error ? "commentcard__comment textarea__error" : "commentcard__comment"}
          placeholder="write down your comment here..."
        >
        </textarea>

        <div className="commentcard__button">
          <Button 
            className="commentcard__submit"
            variant="contained"
            color="secondary"
            onClick={this.props.onClickPost}
          >
            Post!
          </Button>
        </div>
      </div>
    </div>}
      </div>
    );
  }
}

export default withRouter(PublishCard);