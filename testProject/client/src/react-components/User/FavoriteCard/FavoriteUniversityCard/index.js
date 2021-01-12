import React, { useContext } from "react";
import {Paper, Button} from "@material-ui/core";
import { withRouter } from 'react-router-dom';
import "./styles.css";

import { getRatingById } from"./../../../../action/rate";

class FavoriteUniversityCard extends React.Component {
  state = {
    university: undefined,
    rating: undefined,
    loading: true
  }

  constructor(props) {
    super(props);
  }

  onClickDirectUni = () => {
    this.props.history.push(`/university/${this.state.university._id}`);
  }

  componentDidMount() {
    const university = this.props.university;

    getRatingById(university.rating).then(rating => {
      this.setState({university: university, rating: rating.rating, loading: false});
    })
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <Paper elevation={2} className="FavoriteUniversityCard">
          <div className="favoriteUniversityCard__content">
              <div className="schoolName" onClick={this.onClickDirectUni}>
                  <span className="schoolName__text">{this.state.university.name}</span>
              </div>
              {this.props.login? <div className="stopFollowing">
                  <Button variant="contained" color="secondary" className="stopFollowing__button" onClick={this.props.onClickUnfollow}>unfollow</Button>
              </div> : <div className="stopFollowing">
                  <Button variant="contained" color="secondary" className="stopFollowing__button" onClick={this.onClickDirectUni}>Check it</Button>
              </div>}
              <div className="vertical"/>
              <div className="generalRating">
                  <span className="title">General Rating</span>
                  <span className="ratingScore">{Math.round((this.state.rating.general.rate + Number.EPSILON) * 10) / 10}★</span>
              </div>
              <div className="vertical"/>
          </div>
      </Paper>}
      </div>
    );
  }
}

export default withRouter(FavoriteUniversityCard);