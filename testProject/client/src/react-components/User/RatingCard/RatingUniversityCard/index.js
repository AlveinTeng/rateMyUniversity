import React, { useContext } from "react";
import {Paper, Button} from "@material-ui/core";
import "./styles.css";
import { withRouter } from 'react-router-dom';
import { getUniversityById } from"./../../../../action/university";
import { getRatingById } from"./../../../../action/rate";
import { getCommentById } from"./../../../../action/comment";
import UserContext from "./../../../UserContext";
const log = console.log;

class RatingUniversityCard extends React.Component {

  state = {
    university: undefined,
    uniRating: undefined,
    yourRating: undefined,
    loading: true
  }

  constructor(props) {
    super(props);
  }

  onClickDirectUni = () => {
    this.props.history.push(`/university/${this.state.university._id}`);
  }

  componentDidMount() {
    const university = this.props.university;

    getRatingById(university.rating).then(newRating => {
      const comments = this.props.user.comments;
      comments.map(com_id => {
        getCommentById(com_id).then(comment => {
          const newComment = comment.comment;
          if (newComment.rating !== "" && newComment.university === university._id) {
            getRatingById(newComment.rating).then(rating => {
              this.setState({university: university, uniRating: newRating.rating, yourRating: rating.rating, loading: false});
            });
          }
        });
      });
    })
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <Paper elevation={2} className="RatingUniversityCard" onClick={this.onClickDirectUni}>
          <div className="ratingUniversityCard__content">
              <div className="schoolName">
                  <span className="schoolName__text">{this.state.university.name}</span>
              </div>
              <div className="yourRating">
                  <span className="title">Your Rating</span>
                  <span className="ratingScore">{Math.round((this.state.yourRating.general.rate + Number.EPSILON) * 10) / 10}★</span>
              </div>
              <div className="vertical"/>
              <div className="generalRating">
                  <span className="title">General Rating</span>
                  <span className="ratingScore">{Math.round((this.state.uniRating.general.rate + Number.EPSILON) * 10) / 10}★</span>
              </div>
              <div className="vertical"/>
          </div>
      </Paper>}
      </div>
    );
  }
}

export default withRouter(RatingUniversityCard);