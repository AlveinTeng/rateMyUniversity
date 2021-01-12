import React, { useContext } from "react";
import {Paper, Button} from "@material-ui/core";
import { withRouter } from 'react-router-dom';
import "./styles.css";
import RatingUniversityCard from "./RatingUniversityCard"
import { getUniversityById } from"./../../../action/university";
import { getCommentById } from"./../../../action/comment";
import UserContext from "./../../UserContext";

class RatingCard extends React.Component {
  state = {
    universities: [],
    loading: true
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const comments = this.props.user.comments;

    comments.map(com_id => {
      getCommentById(com_id).then(comment => {
        const newComment = comment.comment;
        if (newComment.rating !== "") {
          getUniversityById(newComment.university).then(university => {
            const newUniversities = this.state.universities;
            newUniversities.push(university.university);
            this.setState(prevState => ({...prevState, universities: newUniversities}));
          })
        }
      });
    });

    this.setState(prevState => ({...prevState, loading: false}));
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="user__paper" elevation={10}>
          <div className="cardsContainer">
            {this.state.universities.map((university, i) => {
              return (
                <RatingUniversityCard 
                  key={i}
                  history={this.props.history}
                  user={this.props.user}
                  university={university}
                />
              );
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default withRouter(RatingCard);