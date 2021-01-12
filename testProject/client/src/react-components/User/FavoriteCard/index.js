import React from "react";
import { withRouter } from 'react-router-dom';
import "./styles.css";
import FavoriteUniversityCard from "./FavoriteUniversityCard";
import { getUniversityById } from"./../../../action/university";
import { deleteFollowUniversity } from"./../../../action/user";

class FavoriteCard extends React.Component {

  state = {
    universities: [],
    loading: true
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const followUniversities = this.props.user.followUniversities;
    followUniversities.map(uni_id => {
      getUniversityById(uni_id).then(university => {
        const newUniversities = this.state.universities;
        newUniversities.push(university.university);
        this.setState(prevState => ({...prevState, universities: newUniversities}));
      });
    });

    this.setState(prevState => ({...prevState, loading: false}));
  }

  onClickUnfollow = (university) => {
    deleteFollowUniversity(university._id).then(result => {
      this.props.app.setState(prevState => ({ ...prevState, user: result.user }));
    });
    const newUniversities = this.state.universities.filter( uni => {return uni._id !== university._id});
    this.setState(prevState => ({...prevState, universities: newUniversities}));
  }

  render() {
    const { app, history } = this.props;

    return (
      <div>
        {this.state.loading? <div/> : <div className="user__paper" elevation={10}>
        <div className="cardsContainer">
          {this.state.universities.map((university, i) => {
            return (
              <FavoriteUniversityCard
                key={i}
                history={history}
                university={university}
                login={this.props.login}
                onClickUnfollow={this.onClickUnfollow.bind(this, university)}
              />
            );
          })}
        </div>
      </div>}
      </div>
    );
  }
}

export default withRouter(FavoriteCard);