import React, { useState, useContext } from "react";

import Header from "./../Header";
import MessageCard from "./MessageCard";
import { withRouter } from 'react-router-dom';
import { Paper } from "@material-ui/core";
import "./styles.css";
import { checkSession, getUserById } from "./../../action/user";
import { getCommentsRespondCom, getReports } from "./../../action/comment";
import UserContext from "./../UserContext";

//get user, get comments, update respond to comments/likes/dislikes
class Notification extends React.Component {

  state = {
    user: undefined,
    comments: [],
    reports: [],
    loading: true
  }

  constructor(props) {
    super(props);
    // const user_id = this.props.match.params.id;
    // this.props.history.push(`/notification/${user_id}`);
    // checkSession(this.props.app)
  }

  componentDidMount = async () => {
    const user_id = this.props.match.params.id;
    getUserById(user_id).then(async (result) => {
      const user = result.user;
      this.setState(prevState => {return {...prevState, user: user, loading: false}});

      user.comments.map(com_id => {
        getCommentsRespondCom(com_id).then(returnComments => {
          const newComments = this.state.comments;
          returnComments.map(com => {
            newComments.push(com);
          })
          const updatedComments = newComments.sort((com1, com2) => { return com2.com.time.date - com1.com.time.date });
          this.setState(prevState => {return {...prevState, comments: updatedComments}});
        })
      })

      if (user.admin) {
        const reports = await getReports();
        this.setState(prevState => {return {...prevState, reports: reports}});
      }
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
        {this.state.loading? <div/> : <div className="Notification">
      <Paper 
        id="header"
        elevation={10}
      >
        <Header 
          history={this.props.history}
          app={this.props.app}
          search={false}
        />
      </Paper>

      <div id="noti__content">
        <div className="noti__centerBox">
          <Paper 
            className="noti__navigation"
            elevation={10}
          >
            <div className="noti__titleBox">
              <span className="noti__title">
                Notification
              </span>
            </div>

            <div className="noti__divider">

            </div>

          </Paper>

          <Paper 
            className="noti_contentTitle"
            elevation={3}
          >

          </Paper>

          <Paper 
            className="noti_messageGroupPaper"
            elevation={10}
          > 
            <div className="noti_messageGroup">

            {this.state.user.deleted? <div/> : this.state.comments.map((comment, i) => {
              return( 
                <div>
                {this.showDeleted(comment.com.deleted)? <div/> : 
                  <MessageCard key={i} comment={comment} user={this.state.user} history={this.props.history} app={this} report={false}/>}
                </div>
              )
            })}

            {this.state.user.admin? this.state.reports.map((report, i) => {
              return (
                <div>
                  <MessageCard key={i} comment={report} user={this.state.user} history={this.props.history} app={this} report={true}/>
                </div>
              )
            }) : <div/>}
            </div>

          </Paper>
        </div>
      </div>
    </div>}
      </div>
    );
  }
}


export default withRouter(Notification);