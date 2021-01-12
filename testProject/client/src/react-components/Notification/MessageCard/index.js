import React, { useState, useContext, useEffect } from "react";

import { Paper, ButtonGroup, IconButton, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TimeGenerator from './../../TimeGenerator';
import defaultLogo from "./../../headspicture/defaulthead.png";
import "./styles.css";

import { getUniversityById, addCommentUniversity } from "./../../../action/university";
import { createComment, deleteCommentById, setLikeCommentById, removeCommentById } from "./../../../action/comment";
import { getUserById, addCommentUser, deleteUserById, deleteLikeCommentUser, addDislikeCommentUser, deleteDislikeCommentUser } from "./../../../action/user";
import UserContext from "./../../UserContext";
const log = console.log;

class MessageCard extends React.Component {
  state = {
    objectUser: undefined,
    yourComment: undefined,
    thisComment: undefined,
    thumbUp: false,
    thumbDown: false,
    deleted: false,
    deletedUser: false,
    loading: true,
    comment: {
      click: false,
      content: ''
    }
  }

  constructor(props) {
    super(props);
  }

  onClickThuUp = (e) => {
    if (!this.props.user){
      return;
    }

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
    if (!this.props.user){
      return;
    }

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
    if (!this.props.user){
      return;
    }

    if (this.state.comment.click) {
      this.setState(prevState => {return {...prevState, comment: {...this.state.comment, click: false}} });
    } else {
      this.setState(prevState => {return {...prevState, comment: {...this.state.comment, click: true}} });
    }
  }

  onClickRespond = () => {
    if (!this.props.user) {
      return;
    }

    const nComment = document.getElementById("newusercommentcard__submit").value;

    if (nComment === '') {
      return;
    } else {
      const newComment = {
        author: this.props.user._id,
        university: this.state.thisComment.university,
        respond: this.state.thisComment._id,
        under: this.state.thisComment.under,
        time: new Date(),
        content: nComment
      };

      createComment(newComment).then(com => {
        const comment = com.result;
        addCommentUser(comment._id).then(result => {
          const newUser = result.user;
          addCommentUniversity(newComment.university, comment._id).then( result => {
            this.props.app.setState(prevState => {return {...prevState, user: newUser} });
            this.setState(prevState => {return {...prevState, comment: {...this.state.comment, click: false}} });
          })
        })
      })
    }
  }

  userProfile = () => {
    if (this.state.comment.click) {
      return (
        <Paper className="newUser" elevation={2}>
          <Link 
            className="newUser__link"
            to={this.props.user? `/user/${this.props.user._id}` : '/login'}
          >
            <img src={this.props.user.profile.image !== ""? this.props.user.profile.image : defaultLogo} className="userImage" />
          </Link>

          <textarea 
            id="newusercommentcard__submit"
            className="newUser__comment"
            placeholder="write down your response here..."
          >
            
          </textarea>

          <div className="newUser__buttonPos">

            <Button
              className="newUser__button"
              variant="contained"
              color="secondary"
              onClick={this.onClickRespond}
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

    if (this.props.report) {
      getUserById(comment.author).then(result => {
        const objectUser = result.user;
        this.setState(prevState => {return {
          ...prevState, 
          objectUser: objectUser,
          thisComment: comment, 
          thumbUp: false, 
          thumbDown: false, 
          deleted: comment.deleted,
          deletedUser: objectUser.deleted,
          loading: false} 
        })
      })
    } else {
      getUserById(comment.com.author).then(result => {
        const objectUser = result.user;
        this.setState(prevState => {return {
          ...prevState, 
          objectUser: objectUser,
          yourComment: comment.res, 
          thisComment: comment.com, 
          thumbUp: false, 
          thumbDown: false, 
          deleted: comment.com.deleted,
          loading: false} 
        })
      })
    }
  }

  deleteComment = (e) => {
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

  deleteUser = (e, r) => {
    if (r === 'clickaway') {
      return;
    }

    const deleted = { deleted: !this.state.objectUser.deleted }
    this.setState(prevState => {return {...prevState, loading: true}});
    deleteUserById(this.state.objectUser._id, deleted).then(result => {
      const newUser = result.user;
      removeCommentById(this.state.thisComment._id).then(result => {
        this.setState(prevState => {return {...prevState, deletedUser: deleted.deleted, objectUser: newUser, loading: false}});
        const newReports = this.props.app.state.reports.filter(report => {return report._id === result.comment._id})
        this.props.app.setState(prevState => {return {...prevState, reports: newReports}});
      })
    })
  }


  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="MessageCard">
      <Paper
        className={this.state.comment.click ? "messageCard__paper longHeight" : "messageCard__paper shortHeight" }
        elevation={3}
      >
        <div className="messageCard__content">
          <Link
            className="user__link" 
            to={`/user/${this.state.objectUser._id}`}
          >
            <img src={this.state.objectUser.profile.image === ""? defaultLogo : this.state.objectUser.profile.image} className="userImage" />
          </Link>

          <div className="messageCard__leftItem">
            <div className="user__description">
              <div className="user__nameTime">
                <Link
                  className="user__username"
                  to={`/user/${this.state.objectUser._id}`}
                >
                  {`${this.state.objectUser.name}`}
                </Link>
                
              </div>

              <span className="user__comment"> {this.props.report? "Reports" : "Comments you"} </span>
              <span className="user__commentItem"> {this.state.thisComment.content} </span>

              {this.props.report? <div className="button__group">
                <span className="user__time"> {`${TimeGenerator(this.state.thisComment.time)}`} </span>
              </div> : <div className="button__group">
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
              </div>}
            </div>
          </div>

          <div className="messageCard__divider">

          </div>

          <div className="messageCard__RightItem">
            {this.props.report? <Button variant="contained" color="secondary" onClick={this.deleteUser}>{this.state.deletedUser? "Unblock" : "Block"}</Button> : `${this.state.yourComment.content}`}
          </div>

          {this.userProfile()}
        </div>
      </Paper>
    </div>}
      </div>
    );
  }
}

export default MessageCard;