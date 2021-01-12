import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { Button, Paper, Snackbar, IconButton, Divider } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PublishCard from "./../PublishCard";
import TimeGenerator from './../../../TimeGenerator';
import defaultLogo from "./../../../headspicture/defaulthead.png";
import "./styles.css";

import { getUserById, addLikeCommentUser, deleteLikeCommentUser, addDislikeCommentUser, deleteDislikeCommentUser } from "./../../../../action/user";
import { deleteCommentById, setLikeCommentById } from "./../../../../action/comment";
import { getRatingById } from "./../../../../action/rate";
import UserContext from "./../../../UserContext";

class UserRespondCard extends React.Component {
  state = {
    objectUser: undefined,
    subjectUser: undefined,
    thisComment: undefined,
    resComment: undefined,
    thumbUp: false,
    thumbDown: false,
    deleted: false,
    loading: true,
    error: false,
    comment: {
      click: false,
      content: ''
    }
  }

  constructor(props) {
    super(props);
  }

  onClickThuUp = (e) => {
    if (!this.props.login || this.props.user.deleted){
      this.props.app.setState(prevState => {return {...prevState, loginNoti: true}})
      return;
    }
    this.props.app.setState(prevState => {return {...prevState, loginNoti: false}})

    const com_like = { like: this.state.thisComment.like };

    if (this.state.thumbUp) {
      com_like.like --;
      this.setState(prevState => {return {...prevState, thumbUp: false} })

      setLikeCommentById(this.state.thisComment._id, com_like).then(result => {
        this.setState(prevState => {return {...prevState, thisComment: result.comment} });
      })
    } else {
      com_like.like ++;
      if (this.state.thumbDown) {
        com_like.like ++;
        this.setState(prevState => {return {...prevState, thumbDown: false} })
      }
      this.setState(prevState => {return {...prevState, thumbUp: true} })

      setLikeCommentById(this.state.thisComment._id, com_like).then(result => {
        this.setState(prevState => {return {...prevState, thisComment: result.comment} });
      })
    }
  }

  onClickThuDown = (e) => {
    if (!this.props.login || this.props.user.deleted){
      this.props.app.setState(prevState => {return {...prevState, loginNoti: true}})
      return;
    }
    this.props.app.setState(prevState => {return {...prevState, loginNoti: false}})

    const com_like = { like: this.state.thisComment.like };

    if (this.state.thumbDown) {
      com_like.like ++;
      this.setState(prevState => {return {...prevState, thumbDown: false} });

      setLikeCommentById(this.state.thisComment._id, com_like).then(result => {
        this.setState(prevState => {return {...prevState, thisComment: result.comment} });
      })
    } else {
      com_like.like --;
      if (this.state.thumbUp) {
        com_like.like --;
        this.setState(prevState => {return {...prevState, thumbUp: false} });
      }
      this.setState(prevState => {return {...prevState, thumbDown: true} });

      setLikeCommentById(this.state.thisComment._id, com_like).then(result => {
        this.setState(prevState => {return {...prevState, thisComment: result.comment} });
      })
    }
  }

  onClickComment = (e) => {
    if (!this.props.login || this.props.user.deleted){
      this.props.app.setState(prevState => {return {...prevState, loginNoti: true}})
      return;
    }

    this.props.app.setState(prevState => {return {...prevState, loginNoti: false}})

    if (this.state.comment.click) {
      this.setState(prevState => {return {...prevState, comment: {...this.state.comment, click: false}} });
    } else {
      this.setState(prevState => {return {...prevState, comment: {...this.state.comment, click: true}} });
    }
  }

  showProfile(user) {
    if (user.profile.image === "") {
      return defaultLogo;
    }
    return user.profile.image;
  }

  userProfile = () => {
    if (this.state.comment.click) {
      return (
        <Paper className="userrespondcard__newUser" elevation={2}>
          <Link 
            className="newUser__link"
            to={this.props.login? `/user/${this.props.user._id}` : '/login'}
          >
            <img src={this.props.login? this.showProfile(this.props.user) : defaultLogo} className="userImage" />
          </Link>

          <textarea 
            id="userrespondcard"
            className={this.state.error ? "userrespondcard__comment textarea__error" : "userrespondcard__comment"}
            placeholder="write down your response here..."
          >
            
          </textarea>

          <div className="newUser__buttonPos">

            <Button
              className="newUser__button"
              variant="contained"
              color="secondary"
              onClick={this.props.onClickRespond}
            >
              Respond
            </Button>
          </div>
        </Paper>
      );
    }
  }

  componentDidMount() {
    const comment = this.props.comment;
    const respond = this.props.respond;

    getUserById(comment.author).then(result => {
      const objectUser = result.user;
      getUserById(respond.author).then(result => {
        const subjectUser = result.user;
        this.setState(prevState => {return {
          ...prevState, 
          objectUser: objectUser,
          subjectUser: subjectUser,
          thisComment: comment, 
          resComment: respond,
          thumbUp: false, 
          thumbDown: false, 
          deleted: comment.deleted,
          loading: false} 
        })
      })
    })
  }

  deleteComment = (e, r) => {
    if (r === 'clickaway') {
      return;
    }
    const deleted = { deleted: !this.state.thisComment.deleted }
    this.setState(prevState => {return {...prevState, loading: true}});
    deleteCommentById(this.state.thisComment._id, deleted).then(result => {
      this.setState(prevState => {return {...prevState, deleted: deleted.deleted, loading: false}});
    })
  }

  showDelete = () => {
    if (this.props.login && this.props.user.admin) {
      return (
        <div>
        {this.state.loading? <div/> : <div className="user__icon">
          <IconButton 
            className="user__iconButton"
            onClick={this.deleteComment}
          >
            <DeleteForeverIcon 
              className={ this.state.deleted ? "red__color" : "initial__color" }
              fontSize="small"
            />
          </IconButton>
        </div>}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="UserRespondCard">
      <Link 
          className="shrinkLink"
          to={`/user/${this.state.thisComment.author}`}
        >
          <img src={this.showProfile(this.state.objectUser)} className="shrinkUserImage" />
      </Link>

      <div className="shrinkedleftItem">
        <div className="usercommentcard__description">
          <div className="usercommentcard__nameTime">
            <Link
              className="shrinkUsername"
              to={`/user/${this.state.thisComment.author}`}
            >
                {`${this.state.objectUser.name}`}
            </Link>
            
            <span className="shrinkCommentItem"> 
              <span>responds</span>
              <Link to={`/user/${this.state.subjectUser._id}`} className="at__link drakblue__color"> {`@${this.state.subjectUser.name}`}
                <span className="alpha__color">:</span>
              </Link> 
              {this.state.thisComment.content} 
            </span>
          </div>

          

          <div className="button__group">
            <span className="user__time"> {`${TimeGenerator(this.state.thisComment.time)}`} </span>
            <div className="user__icon">
              <IconButton 
                className="user__iconButton"
                onClick={this.onClickComment}
              >
                <ModeCommentOutlinedIcon 
                  className={ this.state.comment.click ? "blue__color" : "initial__color" }
                  fontSize="small"
                />
              </IconButton>
            </div>
            
            <div className="user__icon">
              <IconButton 
                className="user__iconButton"
                onClick={this.onClickThuUp}
              >
                <ThumbUpOutlinedIcon 
                  className={ this.state.thumbUp ? "red__color" : "initial__color" }
                  fontSize="small"
                />
              </IconButton>
            </div>
            <span className="like__num"> {`${this.state.thisComment.like}`} </span>
            <div className="user__icon">
              <IconButton 
                className="user__iconButton"
                onClick={this.onClickThuDown}
              >
                <ThumbDownOutlinedIcon 
                  className={ this.state.thumbDown ? "red__color" : "initial__color" }
                  fontSize="small"
                />
              </IconButton>
            </div>

            {this.showDelete()}
          </div>
        </div>

        {this.userProfile()}
      </div>
    </div>}
      </div>
    );
  }
}

export default UserRespondCard;