import React, { useState, useContext } from "react";

import { Button, Dialog, DialogContent, IconButton, Paper, Snackbar } from "@material-ui/core";
import { withRouter } from 'react-router-dom';
import { ArrowBack } from "@material-ui/icons";
import CloseIcon from '@material-ui/icons/Close';
import Header from "./../Header";
import Banner from "./../Banner";
import TimeGenerator from './../TimeGenerator';
import Category from "./Category";
import Guide from "./Guide";
import { getUniversityById, addCommentUniversity, rankUniversitiesByCate, updateAllRank } from "./../../action/university";
import { createRating, setRatingById, getRatingById } from "./../../action/rate";
import { createComment, getCommentById, getCommentsRespondUni } from "./../../action/comment";
import { addCommentUser, checkSession, getUserByName } from "./../../action/user";
import UserContext from "./../UserContext";
import "./styles.css";

// get user and university, call post rating API
class Rate extends React.Component {
  
  state = {
    user: undefined,
    university: undefined,
    rateBefore: false,
    loading: true,
    starComplete: false,
    commentComplete: false,
    rateNoti: false,
    w: window.innerWidth,
    open: false
  }

  constructor(props) {
    super(props);

    // const uni_id = this.props.match.params.id;
    // this.props.history.push(`/rate/${uni_id}`)
    this.rating = {
      safety: 0,
      workload: 0, 
      location: 0, 
      facilities: 0, 
      opportunity: 0, 
      clubs: 0,
      general: 0
    }
  }

  onChangeStar = (category, rating) => {
    if (rating === null) {
      rating = 0;
    }

    this.rating = {
      ...this.rating, 
      [category]: rating
    }

    let sum = 0;
    let count = 0;

    for (let cate in this.rating) {
      if (this.rating.hasOwnProperty(cate)) {
        if (this.rating[cate] !== 0) {
          count += 1;
        }
        sum += this.rating[cate];
      }
    }

    if (count === 7) {
      this.setState(prevState => {return {...prevState, starComplete: true}});
    } else {
      this.setState(prevState => {return {...prevState, starComplete: false}});
    }

    if (count !== 0) {

      this.rating= {
        ...this.rating, 
        general: Math.round(((sum / count) + Number.EPSILON) * 10) / 10
      }
    } else {
      this.rating= {
        ...this.state.rating, 
        general: 0
      }
    }

  }

  onClickSumbit = (e) => {
    if (this.state.rateBefore) {
      this.setState(prevState => {return {...prevState, rateNoti: true}});
      return;
    }

    const comment = document.getElementById('rate__comment').value;

    if (comment === '' || !this.state.starComplete) {
      this.setState(prevState => {return {...prevState, commentComplete: false}});
      return;
    } else {
      this.setState(prevState => {return {...prevState, commentComplete: true, loading: true}});

      const newRating = {
        safety: { name: "Safety", rate: this.rating.safety, rank: 0 },
        workload: { name: "Workload", rate: this.rating.workload, rank: 0 }, 
        location: { name: "Location", rate: this.rating.location, rank: 0 }, 
        facilities: { name: "Facilities", rate: this.rating.facilities, rank: 0 }, 
        opportunity: { name: "Opportunity", rate: this.rating.opportunity, rank: 0 }, 
        clubs: { name: "Clubs", rate: this.rating.clubs, rank: 0 },
        general: { name: "General", rate: this.rating.general, rank: 0 }
      };

      createRating().then(rating => {
        const rate_id = rating.result._id;
        setRatingById(rate_id, newRating).then(result => {
          const rating = result.rating;
          const newComment = {
            rating: rating._id,
            author: this.state.user._id,
            university: this.state.university._id,
            time: new Date(),
            content: comment
          };

          createComment(newComment).then(com => {
            const newCom = com.result;
            addCommentUser(newCom._id);
            addCommentUniversity(this.state.university._id, newCom._id).then(result => {
              getRatingById(this.state.university.rating).then(rating => {
                const oldUniRate = rating.rating;
                const newRate = this.rating;

                getCommentsRespondUni(this.state.university._id).then(result => {
                  const ratingNum = result.length;

                  const newUniRating = {
                    safety: { name: "Safety", 
                              rate: (oldUniRate.safety.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1) + newRate.safety) / ratingNum , 
                              rank: 0},
                    workload: { name: "Workload",
                                rate: (oldUniRate.workload.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + newRate.workload) / ratingNum,
                                rank: 0 }, 
                    location: { name: "Location", 
                                rate: (oldUniRate.location.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + newRate.location) / ratingNum, 
                                rank: 0 }, 
                    facilities: { name: "Facilities",
                                  rate: (oldUniRate.facilities.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + newRate.facilities) / ratingNum,
                                  rank: 0 }, 
                    opportunity: { name: "Opportunity",
                                   rate: (oldUniRate.opportunity.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + newRate.opportunity) / ratingNum,
                                   rank: 0 }, 
                    clubs: { name: "Clubs", 
                             rate: (oldUniRate.clubs.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + newRate.clubs) / ratingNum,
                             rank: 0 },
                    general: { name: "General",
                               rate: (oldUniRate.general.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + newRate.general) / ratingNum,
                               rank: 0 }
                  };


                  setRatingById(this.state.university.rating, newUniRating).then(result => {
                    const updatedRate = result.rating;
                    updateAllRank(this.state.university).then(ranks => {
                      updatedRate.safety.rank = ranks.safty;
                      updatedRate.workload.rank = ranks.workload;
                      updatedRate.location.rank = ranks.location;
                      updatedRate.facilities.rank = ranks.facilities;
                      updatedRate.opportunity.rank = ranks.opportunity;
                      updatedRate.clubs.rank = ranks.clubs;
                      updatedRate.general.rank = ranks.general;

                      setRatingById(this.state.university.rating, updatedRate).then(result => {
                        this.setState(prevState => {return {...prevState, loading: false}})
                        document.getElementById('rate__comment').value = '';
                        if (this.props.history) {
                          this.props.history.push(`/University/${this.state.university._id}`);
                        }
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    }
  }

  onCloseSnackbar = (e, r) => {
    if (r === 'clickaway') {
      return;
    }
    this.setState(prevState => {return {...prevState, rateNoti: false}})
  }

  componentDidMount() {
    const uni_id = this.props.match.params.id;
    getUniversityById(uni_id).then(uni => {
      const university = uni.university;
      getUserByName(this.props.app.state.currentUser).then(user => {
        this.setState(prevState => {return {...prevState, user: user, university: university, loading: false}})
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="Rate">
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


        <div id="banner">
          <Banner
            history={this.props.history}
            rank= {false}
          />
        </div>

        <div id="rate__content">
          <div className="rate__contentLeft">
          <Paper 
            className="rate__contentLeftPaper"
            elevation={10}
          >
            <p className="rate__leftItem">
              <span className="rate__title">
                Rate It!
              </span>
            </p>

            <p className="rate__leftItem">
              <span className="university">
                {this.state.university.name}
              </span>
              <span className="address">
                {this.state.university.address}
              </span>
            </p>

            <div className="rate__leftItem">
              <Category
                className="rate__category"
                category="Safety"
                rateLow="UnSafe"
                rateHigh="Secure"
                onChangeStar={this.onChangeStar.bind(this, "safety")}
              />
              <Category
                className="rate__category"
                category="Workload"
                rateLow="Heavy"
                rateHigh="Light"
                onChangeStar={this.onChangeStar.bind(this, "workload")}
              />
              <Category
                className="rate__category"
                category="Facilities"
                rateLow="Few"
                rateHigh="Numerous"
                onChangeStar={this.onChangeStar.bind(this, "facilities")}
              />
              <Category
                className="rate__category"
                category="Opportunity"
                rateLow="Few"
                rateHigh="Numerous"
                onChangeStar={this.onChangeStar.bind(this, "opportunity")}
              />
              <Category
                className="rate__category"
                category="Clubs"
                rateLow="Few"
                rateHigh="Numerous"
                onChangeStar={this.onChangeStar.bind(this, "clubs")}
              />
              <Category
                className="rate__category"
                category="Location"
                rateLow="Bad"
                rateHigh="Perfect"
                onChangeStar={this.onChangeStar.bind(this, "location")}
              />
            </div>
            </Paper>
          </div>

          <Paper 
            className="rate__text"
            elevation={10}
          > 
            <textarea 
              id="rate__comment"
              class="rate__comment"
              placeholder="Write your comments here..."
            >
              
            </textarea>
          </Paper>
          

          <div className="rate__return">
            <Button 
              className="rate__submit"
              variant="contained"
              onClick={this.onClickSumbit}
            >
              Submit Your Evaluation
            </Button>
          </div>

          
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.rateNoti}
          autoHideDuration={5000}
          onClose={this.onCloseSnackbar}
          message="You have rated this university!"
          action={
            <IconButton size="small" color="inherit" onClick={this.onCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>}
      </div>
    );
  }
}

export default withRouter(Rate);