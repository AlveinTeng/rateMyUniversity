import React, { useState, useEffect } from "react";

import "./styles.css";
import Header from "./../Header";
import Banner from "./../Banner";
import { withRouter } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RateReviewIcon from '@material-ui/icons/RateReview';
import SettingsIcon from '@material-ui/icons/Settings';
import Grid from '@material-ui/core/Grid';
import logo from "./../logo4.png";
import defaulthead from "./../headspicture/defaulthead.png";
import head1 from "./../headspicture/head1.png";
import head2 from "./../headspicture/head2.png";
import head3 from "./../headspicture/head3.png";
import head4 from "./../headspicture/head4.png";
import head5 from "./../headspicture/head5.png";
import head6 from "./../headspicture/head6.png";
import head7 from "./../headspicture/head7.png";
import head8 from "./../headspicture/head8.png";
import head9 from "./../headspicture/head9.png";
import ProfileCard from "./ProfileCard"
import SettingCard from "./SettingCard"
import RatingCard from "./RatingCard"
import { getReportsUser, createComment } from"./../../action/comment";
import { changeImage, getUserById, deleteUserById } from"./../../action/user";
import UserContext from "./../UserContext";
import "./styles.css";
import { TextField, Paper, Button } from "@material-ui/core";
import FavoriteCard from "./FavoriteCard";
import { checkSession } from "../../action/user";
import { checkCommentUniversity } from "../../action/university";
const log = console.log;

// get user from useContext and post user's updated info
class User extends React.Component {
  state = {
    user: undefined,
    login: undefined,
    loading: true,
    value: "Profile",
    spacing: 2,
    userImageSrc: "",
    change: false
  }

  constructor(props) {
    super(props);
    // const user_id = this.props.match.params.id;
    // this.props.history.push(`/user/${user_id}`);
  }

  onChangeHandlerNavi = (e, newValue) => {
    this.setState(prevState => ({...prevState, value: newValue}));
  }

  showProfileCard = () =>{
    if (this.state.value == "Profile"){
      return(<ProfileCard user={this.state.user} app={this} login={this.state.login}/>);
    }
  }

  showRatingCard = () =>{
    if (this.state.value == "Ratings"){
      return(<RatingCard history={this.props.history} user={this.state.user} app={this}/>
      );
    }
  }

  showFavoriteCard = () =>{
    if (this.state.value == "FavoriteUniversities"){
      return(<FavoriteCard history={this.props.history} user={this.state.user} app={this} login={this.state.login}/>
      );
    }
  }

  showSettingCard = () =>{
    if (this.state.value == "Settings"){
      return(<SettingCard user={this.state.user} app={this}/>);
      }
  }

  headClicked = (e) => {
    const imageSrc = e.currentTarget.children[0].children[0].src.toString();
    this.setState(prevState => ({...prevState, userImageSrc: imageSrc}));
    const image = { image: imageSrc };
    changeImage(image, this);
  }

  cancelClicked = (e) => {
    this.setState(prevState => ({...prevState, change: false}));
  }

  activateClick = (e) => {
    this.setState(prevState => ({...prevState, change: true}));
  }

  componentDidMount() {
    const user_id = this.props.match.params.id;
    getUserById(user_id).then(newUser => {
      const current = this.props.app.state.currentUser !== null ? this.props.app.state.currentUser === newUser.user.name : false;
      this.setState(prevState => ({
        ...prevState, 
        user: newUser.user, 
        userImageSrc: newUser.user.profile.image, 
        deleted: newUser.user.deleted,
        login: current,
        loading: false
      }));
    });
  }

  deleteUser = (e, r) => {
    if (r === 'clickaway') {
      return;
    }

    const deleted = { deleted: !this.state.user.deleted }
    this.setState(prevState => {return {...prevState, loading: true}});
    deleteUserById(this.state.user._id, deleted).then(result => {
      this.setState(prevState => {return {...prevState, deleted: deleted.deleted, user: result.user, loading: false}});
    })
  }

  reportToAdmin = async (e, r) => {
    if (r === 'clickaway') {
      return;
    }

    const getReport = await getReportsUser(this.state.user._id);
    if (getReport) {
      alert("You have sent the report!");
      return;
    }

    const report = document.getElementById("report").value;
    if (report === '') {
      return;
    }

    const newReport = {
      author: this.state.user._id,
      time: new Date(),
      content: report
    };

    createComment(newReport);
  }

  render() {
    window.addEventListener('scroll', event => {
      this.setState(prevState => ({...prevState, change: false}));
    })

    return(
      <div>
      {this.state.loading? <div/> : <div className="User">
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
  
      <div>
        {this.state.user.deleted && !this.props.app.state.adminStatus? <div/> : <div className="user__centerItem">
        <div>
          <img src={this.state.userImageSrc === "" ? defaulthead : this.state.userImageSrc} onClick={this.state.login? this.activateClick : null} className="user__image" />
        </div>
  
        {this.state.change?
        <div className="user__modifyImage">
          <span className="user__changeImageText">Change your image </span>
          <Grid container spacing={this.state.spacing}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={this.state.spacing}>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head1} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head2} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}> 
                  <img src={head3} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head4} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head5} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head6} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head7} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head8} className="user__images" />
                </Button>
                <Button onClick = {(e) => this.headClicked(e)}>
                  <img src={head9} className="user__images" />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={(e) => this.cancelClicked(e)}>Cancel</Button>
        </div>
        : <div></div>}
  
      </div>}
      </div>

      <div>
        {this.state.user.deleted && !this.props.app.state.adminStatus? <div>
          <span className="blocked__massage">you have been blocked</span>
          {this.state.login? <Paper className="newUser" elevation={2}>
          <textarea 
            id="report"
            className="newUser__comment"
            placeholder="report to admin..."
          >
            
          </textarea>

          <div className="newUser__buttonPos">
            <Button
              className="newUser__button"
              variant="contained"
              color="secondary"
              onClick={this.reportToAdmin}
            >
              Submit
            </Button>
          </div>
        </Paper> : <div/>}
        </div> :
          <div id="user__content">
          <p className="user__centerItem">
            <span className="user__title">
              {this.state.user.name}
            </span>
          </p>
  
          {(this.props.app.state.adminStatus && !this.state.login) ? 
            <div className="delete__user__button">
              <Button variant="contained" color="secondary" onClick={this.deleteUser}>{this.state.deleted? "Undelete" : "Delete"}</Button>
            </div>
            : <div/>
          }
          <Paper elevation={10}>
            <div className="NavigationBar" >
              <BottomNavigation
                value={this.state.value}
                onChange={this.onChangeHandlerNavi}
                showLabels
              >
                <BottomNavigationAction label="Profile"  value="Profile" icon={<AccountBoxIcon />} size="large"/>
                <BottomNavigationAction label="Ratings"  value="Ratings" icon={<RateReviewIcon />} size="large"/>
                <BottomNavigationAction label="FavoriteUniversities" value="FavoriteUniversities" icon={<FavoriteIcon />} size="large" />
                {this.state.login?
                <BottomNavigationAction label="Settings" value="Settings" icon={<SettingsIcon />} size="large" /> : <div/>}
              </BottomNavigation>
            </div> 
          </Paper>
    
          <div className="user__center">
            {this.state.login? this.showSettingCard() : null}
            {this.showRatingCard()}
            {this.showFavoriteCard()}
            {this.showProfileCard()}
          </div>
        </div>
        }
      
      </div>
    </div>}
    </div>
    );
  }
}

export default withRouter(User);