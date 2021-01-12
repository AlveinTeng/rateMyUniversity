import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { Button, Paper, Menu, IconButton, Divider } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import PublishCard from "./../PublishCard";
import ShowComments from "./../ShowComments";
import RateCard from "./../../RateCard"
import FaceChanger from "./../../../FaceChanger";
import UserRespondCard from "./../UserRespondCard";
import TimeGenerator from './../../../TimeGenerator';
import defaultLogo from "./../../../headspicture/defaulthead.png";
import "./styles.css";

import { getUserById } from "./../../../../action/user";
import { updateAllRank } from "./../../../../action/university";
import { deleteCommentById, getCommentsRespondUni, setLikeCommentById } from "./../../../../action/comment";
import { getRatingById, setRatingById } from "./../../../../action/rate";
import UserContext from "./../../../UserContext";

class UserCommentCard extends React.Component {
  state = {
    objectUser: undefined,
    thisComment: undefined,
    thisRating: undefined,
    thumbUp: false,
    thumbDown: false,
    deleted: false,
    loading: true,
    anchorEl: null,
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
        <Paper className="newUser" elevation={2}>
          <Link 
            className="newUser__link"
            to={this.props.login? `/user/${this.props.user._id}` : '/login'}
          >
            <img src={this.props.login? this.showProfile(this.props.user) : defaultLogo} className="userImage" />
          </Link>

          <textarea 
            id="newusercommentcard"
            className="newUser__comment"
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

  onClickFace = (e) => {
    const target = e.currentTarget;
    this.setState(prevState => {return {...prevState, anchorEl: target} });
  }

  onCloseFace = () => {
    this.setState(prevState => {return {...prevState, anchorEl: null} });
  }

  setFace = () => {
    if (this.state.thisRating) {
      return (
        <div className="usercommentcard__rate">
          <IconButton size="small" onClick={this.onClickFace}> 
            {FaceChanger(this.state.thisRating.general.rate, "default")}
          </IconButton>
        </div>
      );
    }
  }

  setMenu = () => {
    if (this.state.thisRating) {
      return (
        <Menu
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.onCloseFace}
        >
          <RateCard rating={this.state.thisRating._id} shrink={true}/>
        </Menu>
      );
    }
  }

  deleteComment = (e, r) => {
    if (r === 'clickaway') {
      return;
    }
    const deleted = { deleted: !this.state.thisComment.deleted }
    deleteCommentById(this.state.thisComment._id, deleted).then(result => {
      const deletedComment = result.comment;
      const oldComments = this.props.apps.state.comments;
      const newComments = oldComments.map(com => {
        if (com._id === deletedComment._id) {
          com.deleted = deletedComment.deleted;
         }
        return com;
      })
      this.props.apps.setState(prevState => {return {...prevState, comments: newComments}})
      if (deletedComment.rating !== "") {
        getRatingById(deletedComment.rating).then(result => {
          const deletedRating = result.rating;
          getRatingById(this.props.university.rating).then(result => {
            const uniRating = result.rating;
            getCommentsRespondUni(this.props.university._id).then(updatedComments => {
              const newUpdatedComments = updatedComments.filter(com => {return !com.deleted});
              const ratingNum = newUpdatedComments.length;
              let newUniRating;
              if (deleted.deleted) {
                newUniRating = {
                  safety: { name: "Safety", 
                            rate: (uniRating.safety.rate * (ratingNum + 1) - deletedRating.safety.rate) / ratingNum , 
                            rank: 0},
                  workload: { name: "Workload",
                              rate: (uniRating.workload.rate * (ratingNum + 1)  - deletedRating.workload.rate) / ratingNum,
                              rank: 0 }, 
                  location: { name: "Location", 
                              rate: (uniRating.location.rate * (ratingNum + 1)  - deletedRating.location.rate) / ratingNum, 
                              rank: 0 }, 
                  facilities: { name: "Facilities",
                                rate: (uniRating.facilities.rate * (ratingNum + 1)  - deletedRating.facilities.rate) / ratingNum,
                                rank: 0 }, 
                  opportunity: { name: "Opportunity",
                                rate: (uniRating.opportunity.rate * (ratingNum + 1)  - deletedRating.opportunity.rate) / ratingNum,
                                rank: 0 }, 
                  clubs: { name: "Clubs", 
                          rate: (uniRating.clubs.rate * (ratingNum + 1)  - deletedRating.clubs.rate) / ratingNum,
                          rank: 0 },
                  general: { name: "General",
                            rate: (uniRating.general.rate * (ratingNum + 1)  - deletedRating.general.rate) / ratingNum,
                            rank: 0 }
                }
              } else {
                newUniRating = {
                  safety: { name: "Safety", 
                            rate: (uniRating.safety.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1) + deletedRating.safety.rate) / ratingNum , 
                            rank: 0},
                  workload: { name: "Workload",
                              rate: (uniRating.workload.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + deletedRating.workload.rate) / ratingNum,
                              rank: 0 }, 
                  location: { name: "Location", 
                              rate: (uniRating.location.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + deletedRating.location.rate) / ratingNum, 
                              rank: 0 }, 
                  facilities: { name: "Facilities",
                                rate: (uniRating.facilities.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + deletedRating.facilities.rate) / ratingNum,
                                rank: 0 }, 
                  opportunity: { name: "Opportunity",
                                 rate: (uniRating.opportunity.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + deletedRating.opportunity.rate) / ratingNum,
                                 rank: 0 }, 
                  clubs: { name: "Clubs", 
                           rate: (uniRating.clubs.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + deletedRating.clubs.rate) / ratingNum,
                           rank: 0 },
                  general: { name: "General",
                             rate: (uniRating.general.rate * (ratingNum - 1 === 0? 1 : ratingNum - 1)  + deletedRating.general.rate) / ratingNum,
                             rank: 0 }
                };
              }

              setRatingById(this.props.university.rating, newUniRating).then(result => {
                const updatedRate = result.rating;
                updateAllRank(this.props.university).then(ranks => {
                  console.log(updatedRate)
                  updatedRate.safety.rank = ranks.safty;
                  updatedRate.workload.rank = ranks.workload;
                  updatedRate.location.rank = ranks.location;
                  updatedRate.facilities.rank = ranks.facilities;
                  updatedRate.opportunity.rank = ranks.opportunity;
                  updatedRate.clubs.rank = ranks.clubs;
                  updatedRate.general.rank = ranks.general;
                  setRatingById(this.props.university.rating, updatedRate).then(result => {
                    this.setState(prevState => {return {...prevState, deleted: deleted.deleted, loading: false}});
                  })
                })
              })
            })
          })
        })
      } else {
        this.setState(prevState => {return {...prevState, deleted: deleted.deleted, loading: false}});
      }
    })
  }

  showDelete = () => {
    if (this.props.login && this.props.user.admin) {
      return (
        <div>
        {this.state.loading? <div/> :<div className="delete__comment">
          <Button 
            variant="outlined"
            color="primary"
            onClick={this.deleteComment}
          >
            {this.state.deleted? "Undelete" : "Delete"}
          </Button>
        </div>}
        </div>
      );
    }
  }

  componentDidMount() {
    const comment = this.props.comment;

    if (comment.rating !== "") {
      getRatingById(comment.rating).then(result => {
        const rating = result.rating;
        this.setState(prevState => {return {...prevState, thisRating: rating}});
      })
    }

    getUserById(comment.author).then(result => {
      const objectUser = result.user;
      this.setState(prevState => {return {
        ...prevState, 
        objectUser: objectUser,
        thisComment: comment, 
        thumbUp: false, 
        thumbDown: false, 
        deleted: comment.deleted,
        loading: false} 
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="UserCommentCard">
        <Link 
            className="usercommentcard__link"
            to={`/user/${this.state.thisComment.author}`}
          >
            <img src={this.showProfile(this.state.objectUser)} className="userImage" />
        </Link>

        <div className="usercommentcard__leftItem">
          <div className="usercommentcard__description">
            <div className="usercommentcard__nameTime">
              <div className="usercommentcard__name">
                <Link
                  className="user__username"
                  to={`/user/${this.state.thisComment.author}`}
                >
                  {`${this.state.objectUser.name}`}
                </Link>
              </div>

              {this.setFace()}

            </div>

            <span className="usercommentcard__commentItem"> {this.state.thisComment.content} </span>

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
              
            </div>
          </div>
          {this.userProfile()}
          <Divider className="usercommentcard__divider" orientation="horizontal"/>
        </div>

        {this.showDelete()}

        {this.setMenu()}
      </div>}
      </div>
    );
  }
}

export default UserCommentCard;