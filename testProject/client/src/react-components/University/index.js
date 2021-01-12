import React, { useState, useContext } from "react";

import Header from "./../Header";
import Banner from "./../Banner";
import RateCard from "./RateCard";
import CommentCard from "./CommentCard";

import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Button, Paper, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import BarChartIcon from '@material-ui/icons/BarChart';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { getRatingById, setRatingById } from "./../../action/rate";
import { getCommentsRespondUni } from "./../../action/comment";
import { getUniversityById, rankUniversitiesByCate, updateAllRank } from "./../../action/university";
import { checkSession, addFollowUniversity, deleteFollowUniversity, getUserByName } from "./../../action/user";
import UserContext from "./../UserContext";
import "./styles.css";

const log = console.log;

//get university and user, call post comment API, call follow API, call get rank API
class University extends React.Component {

  state = {
    user: undefined,
    university: undefined,
    login: undefined,
    rank: undefined,
    rateBefore: undefined,
    comments: [],
    loadingUser: true,
    rate: undefined,
    loadingUni: true,
    loginNoti: false,
    showComment: false
  }

  constructor(props) {
    super(props);

    // const uni_id = this.props.match.params.id;
    // // this.props.history.push(`/university/${uni_id}`)
  }

  onClickFollow = (e) => {
    if (this.state.login && !this.state.user.deleted) {
      if (this.state.user.followUniversities.includes(this.state.university._id) && !this.state.loadingUser) {
        this.setState(prevState => {return {...prevState, loadingUser: true}});
        deleteFollowUniversity(this.state.university._id).then(result => {
          const newUser = result.user;
          this.setState(prevState => {return {...prevState, user: newUser, loadingUser: false}});
        })
      } else if (!this.state.loadingUser) {
        this.setState(prevState => {return {...prevState, loadingUser: true}});
        addFollowUniversity(this.state.university._id).then(result => {
          const newUser = result.user;
          this.setState(prevState => {return {...prevState, user: newUser, loadingUser: false}});
        });
      }
      this.setState(prevState => {return {...prevState, loginNoti: false}});
    } else {
      this.setState(prevState => {return {...prevState, loginNoti: true}});
    }
  }

  checkFollow = () => {
    if (this.state.login && this.state.user.followUniversities.includes(this.state.university._id)) {
      return (
        <div className="university__follow">
          <FavoriteIcon 
            className="university__followIcon red__color"
            fontSize="large"
          />
          <span className="university__followText">
            Following
          </span> 
        </div>
      );
    } else {
      return (
        <div className="university__follow">
          <FavoriteBorderIcon 
            className="university__followIcon"
            fontSize="large"
          />
          <span className="university__followText">
            Follow
          </span> 
        </div>
      );
    }
  }

  changeIcon = (rank) => {
    if (rank <= 5) {
      return (
        <Link
          className="university__rankLink mheight"
          to={"/Rank/"}
        >
          <WhatshotIcon 
            className="university__onhot red__color"
            fontSize="large"
          />
          <span className="university__test red__color">
            {`No.${rank}`}
          </span>
        </Link>
      );
    } else {
      return (
        <Link
          className="university__rankLink mheight"
          to={"/Rank/"}
        >
          <BarChartIcon 
            className="university__onhot BarChartIcon"
            fontSize="large"
          />
          <span className="university__test BarChartIcon">
            {`No.${rank}`}
          </span>
        </Link>
      );
    }
  }

  onCloseSnackbar = (e, r) => {
    if (r === 'clickaway') {
      return;
    }

    this.setState(prevState => {return {...prevState, loginNoti: false}});
  }

  onClickRate = () => {
    if (!this.state.login || this.state.rateBefore || this.state.user.deleted) {
      this.setState(prevState => {return {...prevState, loginNoti: true}});
      return;
    }

    this.setState(prevState => {return {...prevState, loginNoti: false}});

    if (this.props.history) {
      this.props.history.push(`/rate/${this.state.university._id}`);
    }
  }

  reDirectRank = () => {
    if (this.props.history) {
      this.props.history.push(`/rank/`);
    }
  }

  componentDidMount = async () => {
    const uni_id = this.props.match.params.id;
    const username = this.props.app.state.currentUser;
    
    getUniversityById(uni_id).then(async (result) => {
      const university = result.university;
      if (username !== null) {
        this.setState(prevState => {return {...prevState, login: true, loadingUser: true}});
        const user = await getUserByName(username);
        const updateComs = await getCommentsRespondUni(university._id);
        if (updateComs.find(com => { return (com.author === user._id && com.rating !== "") }) === undefined) {
          this.setState(prevState => {return {...prevState, rateBefore: false, user: user, comments: updateComs, loadingUser: false}});
        } else {
          this.setState(prevState => {return {...prevState, rateBefore: true, user: user, comments: updateComs, loadingUser: false}});
        }
      }
      const universities = await rankUniversitiesByCate("general", 0);
      const rank = universities.findIndex(findUni => { return findUni._id === university._id }) + 1;
      this.setState(prevState => {return {...prevState, university: university, rank: rank, showComment: false, loadingUser: false, loadingUni: false}})
    })
  }

  componentDidUpdate = async (prevprops) => {
    if (prevprops.match.params !== this.props.match.params) {
      this.setState(prevState => {return {...prevState, loadingUni: true, loadingUser: true}});
      const uni_id = this.props.match.params.id;
      const username = this.props.app.state.currentUser;
      
      getUniversityById(uni_id).then(async (result) => {
        const university = result.university;
        if (username !== null) {
          this.setState(prevState => {return {...prevState, login: true, loadingUser: true}});
          const user = await getUserByName(username);
          const updateComs = await getCommentsRespondUni(university._id);
          if (updateComs.find(com => { return (com.author === user._id && com.rating !== "") }) === undefined) {
            this.setState(prevState => {return {...prevState, rateBefore: false, user: user, comments: updateComs, loadingUser: false}});
          } else {
            this.setState(prevState => {return {...prevState, rateBefore: true, user: user, comments: updateComs, loadingUser: false}});
          }
        }
        getRatingById(university.rating).then(rating => {
          const oldUniRate = rating.rating;
          updateAllRank(university).then(ranks => {
            oldUniRate.safety.rank = ranks.safty;
            oldUniRate.workload.rank = ranks.workload;
            oldUniRate.location.rank = ranks.location;
            oldUniRate.facilities.rank = ranks.facilities;
            oldUniRate.opportunity.rank = ranks.opportunity;
            oldUniRate.clubs.rank = ranks.clubs;
            oldUniRate.general.rank = ranks.general;
    
            setRatingById(university.rating, oldUniRate).then(result => {
              this.setState(prevState => {return {...prevState, university: university, rate: result.rating, rank: result.rating.general.rank, showComment: false, loadingUser: false, loadingUni: false}})
            })
          })
        })
      })

    }
  }

  checkBlocked = () => {
    if (this.state.user.deleted) {
      return "You have been blocked :("
    }
    return "You have rated this university!"
  }

  render() {
    return (
      <div>
        {this.state.loadingUni || this.state.loadingUser? 
        <div className="University">
        <Paper 
          id="header"
          elevation={10}
        >
          <Header 
            history={this.props.history}
            app={this.props.app}
            search={true}
          />
        </Paper>

        <div id="banner">
          <Banner
            history={this.props.history}
            rank= {true}
          />
        </div>

        <div id="university__content">
          <Button> university </Button>
          <Button> comments </Button>
          <Paper 
            className="university__descriptionPaper"
            elevation={3}
          >
            <div className="university__description">
            </div>
          </Paper>

          <div className="university__comment">
          </div>
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.loginNoti}
          autoHideDuration={5000}
          onClose={this.onCloseSnackbar}
          message="You need to login first :)"
          action={
            <IconButton size="small" color="inherit" onClick={this.onCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div> : 
        <div className="University">
        <Paper 
          id="header"
          elevation={10}
        >
          <Header 
            history={this.props.history}
            app={this.props.app}
            search={true}
          />
        </Paper>

        <div id="banner">
          <Banner
            history={this.props.history}
            rank= {true}
          />
        </div>

        <div id="university__content">
          <Button variant="contained" color="primary" onClick={() => {this.setState(prevState => {return {...prevState, showComment: false}})}}> university </Button>
          <Button variant="contained" onClick={() => {this.setState(prevState => {return {...prevState, showComment: true}})}}> comments </Button>
          <div>
            {this.state.showComment? <div className="university__comment">
            <CommentCard 
              university={this.state.university}
              user={this.state.user}
              comments={this.state.comments}
              login={this.state.login}
              app={this}
            />
          </div> : <Paper 
            className="university__descriptionPaper"
            elevation={3}
          >
            <div className="university__description">

              <div className="university__leftItem">
                <div className="university__title">
                  <Paper 
                    className="university__paper"
                    elevation={4}
                  >
                    <span className="university">
                      {this.state.university.name}
                    </span>
                    <span className="address">
                      {this.state.university.address}
                    </span>
                  </Paper>
                </div>

                <div className="university__descrip dheight">
                  <Paper 
                      className="university__paper dheight"
                      elevation={4}
                  >
                    <span className="address">
                      {this.state.university.description}
                    </span>
                  </Paper>
                </div>

                <div className="university__buttonGroup">
                
                  <div className="university__buttonGroupItem">
                    <Button 
                      className="university__submit"
                      variant="contained"
                      onClick={this.onClickFollow}
                    >

                      {this.checkFollow()}
                      
                    </Button>
                  </div>

                  <div className="university__buttonGroupItem">
                    <Button 
                      className="university__submit"
                      variant="contained"
                      onClick={this.onClickRate}
                    >
                      <div className="university__rate">
                        Start Rating!
                      </div>
                    </Button>
                  </div>
                </div>

              </div>

              

              <div className="university__middleItem mheight">
                <Paper 
                  className="mheight"
                  elevation={4}
                >
                  {this.changeIcon(this.state.rank)}
                </Paper>
              </div>

              <div className="university__rightItem">
                <RateCard 
                  rating={this.state.university.rating} 
                  reDirectRank={this.reDirectRank.bind(this)}
                  rate={this.state.rate}
                  // uni={this.state.university} 
                  shrink={false}
                  // thisParam={this.state.thisParam}
                  // prevParam={this.state.prevParam}
                />
              </div>

            </div>
          </Paper>}
          </div>

        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.loginNoti}
          autoHideDuration={5000}
          onClose={this.onCloseSnackbar}
          message={this.state.login? this.checkBlocked() : "You need to login first :)"  }
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

export default withRouter(University);