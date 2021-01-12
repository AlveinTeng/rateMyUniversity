import React, { useState } from "react";

import PublishCard from "./PublishCard";
import UserCommentCard from "./UserCommentCard";
import UserRespondCard from "./UserRespondCard";
import MessageCard from "./../../Notification/MessageCard";
import ShowComments from "./ShowComments";

import { Link } from "react-router-dom";
import { Button, Paper, Snackbar, IconButton, Divider } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import logo from "./../../logo4.png";
import TimeGenerator from './../../TimeGenerator';
import "./styles.css";

import { createComment, getCommentsUnderCom, getCommentsRespondUni } from "./../../../action/comment";
import { addCommentUser } from "./../../../action/user";
import { addCommentUniversity } from "./../../../action/university";
import UserContext from "./../../UserContext";

const log = console.log;

class CommentCard extends React.Component {

  state = {
    user: undefined,
    university: undefined,
    login: undefined,
    comments: [],
    loading: true
  }

  constructor(props) {
    super(props);
  }

  onClickPostUser = () => {

    if (!this.state.login || this.state.user.deleted) {
      this.props.app.setState(prevState => {return {...prevState, loginNoti: true}})
      return;
    }
    this.props.app.setState(prevState => {return {...prevState, loginNoti: false}})

    const comment = document.getElementById("post__comment").value;
    if (comment === '') {
      return;
    } else {
      const newComment = {
        author: this.state.user._id,
        university: this.state.university._id,
        time: new Date(),
        content: comment
      };

      this.setState(prevState => {return {...prevState, loading: true} })
      createComment(newComment).then(com => {
        const comment = com.result;
        const newComments = this.state.comments;
        const postComment = {origin: comment, branch: []};
        newComments.push(postComment);
        this.setState(prevState => {return {...prevState, comments: newComments, loading: false} });
        const oldComments = this.props.comments;
        oldComments.push(comment);
        this.props.app.setState(prevState => {return {...prevState, comments: oldComments} })
        addCommentUser(comment._id);
        addCommentUniversity(newComment.university, comment._id);
      })
    }
  }

  onClickRespond = (comment, respond, under) => {
    if (!this.state.login || this.state.user.deleted) {
      this.props.app.setState(prevState => {return {...prevState, loginNoti: true}})
      return;
    }
    this.props.app.setState(prevState => {return {...prevState, loginNoti: false}})

    let nComment;
    if (respond) {
      nComment = document.getElementById("userrespondcard").value;
    } else {
      nComment = document.getElementById("newusercommentcard").value;
    }

    if (nComment === '') {
      return;
    } else {
      const newComment = {
        author: this.state.user._id,
        university: this.state.university._id,
        respond: comment._id,
        under: under._id,
        time: new Date(),
        content: nComment
      };

      this.setState(prevState => {return {...prevState, loading: true} })
      createComment(newComment).then(com => {
        const newcomment = com.result;
        const newCommentOri = this.state.comments.find(com => {return com.origin._id === under._id});
        newCommentOri.branch.push({com: newcomment, res: comment});
        this.setState(prevState => {return {...prevState, loading: false} });
        const oldComments = this.props.comments;
        oldComments.push(comment);
        this.props.app.setState(prevState => {return {...prevState, comments: oldComments} })
        addCommentUser(newcomment._id);
        addCommentUniversity(newComment.university, newcomment._id);
      })
    }
  }

  componentDidMount = async () => {
    const user = this.props.user;
    const university = this.props.university;
    const login = this.props.login;
    const oldComments = this.props.comments;

    Promise.all(oldComments.map(async (com) => {
      const returnCommments = await getCommentsUnderCom(com._id)
      const newComForm = {origin: com, branch: returnCommments};
      return newComForm;
    })).then(newComForms => {
      this.setState(prevState => {return {...prevState, user: user, university: university, login: login, comments: newComForms, loading: false}});
    })
  }

  showDeleted = (deleted) => {
    if (!this.state.login) {
      return false;
    }

    if (this.state.user.admin) {
      return false;
    }

    return deleted;
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="commentcard">
        <PublishCard 
          user={this.state.user}
          login={this.state.login}
          onClickPost={this.onClickPostUser.bind(this)}
        />
        <Divider
          orientation="horizontal"
        />
        <div className="commentcard__commentArea" >
          {this.state.comments.map((com) => {
            return (
              <div>
              {this.showDeleted(com.origin.deleted) ? 
                <div></div> : 
                <div>
                  <UserCommentCard
                    comment={com.origin}
                    app={this.props.app}
                    apps={this}
                    university={this.state.university}
                    user={this.state.user}
                    login={this.state.login}
                    onClickRespond={this.onClickRespond.bind(this, com.origin, false, com.origin)}
                  />

                  {com.branch.map((res) => {
                    return (
                      <div>
                      {this.showDeleted(res.com.deleted) ?
                        <div></div> : 
                          <UserRespondCard
                          comment={res.com}
                          respond={res.res}
                          app={this.props.app}
                          user={this.state.user}
                          login={this.state.login}
                          onClickRespond={this.onClickRespond.bind(this, res.com, true, com.origin)}
                        />
                      }
                      </div>
                    );
                  })}
                </div>
              }
            </div>
            );
          })}
        </div>
      </div>}
      </div>
    );
  }
}

export default CommentCard;