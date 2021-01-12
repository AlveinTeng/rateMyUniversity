import React, { useState, useContext } from "react";
import "./styles.css";
import { Button, TextField, Paper, MenuItem } from "@material-ui/core";
import { ExploreOffOutlined, ShopOutlined } from "@material-ui/icons";
import { changeProfile } from"./../../../action/user";
import UserContext from "./../../UserContext";

const log = console.log;

class ProfileCard extends React.Component {
  state = {
    user: undefined,
    loading: true,
    error: {
      school: false, 
      year: false
    },
    helper: {
      school: "", 
      year: ""
    },
    disable: {
      school: true, 
      year: true
    }
  }

  constructor(props) {
    super(props);
  }

  schoolDisable = () =>{
    if (this.state.disable.school === true){
      return (<TextField
        error={this.state.error.school}
        helperText={this.state.helper.school}
        id="schoolname"
        className="signup"
        label={this.state.user.profile.school} 
        type="username"
        variant="outlined"
        disabled
        placeholder = "Enter your school name"
      />);
    }else{
      return (<TextField
        error={this.state.error.school}
        helperText={this.state.helper.school}
        id="schoolname"
        className="signup"
        label={this.state.user.profile.school} 
        type="username"
        variant="outlined"
        placeholder = "Enter your school name"
      />)
    }
  }

  yearDisable = () =>{
    if (this.state.disable.year === true){
      return (<TextField
        error={this.state.error.year}
        id="yearofstudy"
        className="signup"
        helperText={this.state.helper.year}
        label={this.state.user.profile.year}
        type="username"
        variant="outlined"
        disabled
        placeholder = "Integer School year"
      />);
    }else{
      return (<TextField
        error={this.state.error.year}
        helperText={this.state.helper.year}
        id="yearofstudy"
        className="signup"
        label={this.state.user.profile.year}
        type="username"
        variant="outlined"
        placeholder = "Integer School year"
      />)
    }
  }

  onClickHandler = (e, r) =>{
    if (r === 'clickaway') {
      return;
    }

    const school = document.getElementById("schoolname");
    const year = document.getElementById("yearofstudy");
    let isValidYear = false

    if(year.value != ""){
       let isnum = /^\d+$/.test(year.value);
       if  (isnum > 0){
         isValidYear =  true
       }
    }

    if (!school.disabled){
      if (school.value === ""){
        if(isValidYear === false){
          this.setState(prevState => {return {
              ...prevState, 
              error: {school: true, year: true}, 
              helper: {school:"Invalid school name!", year: "Invalid year of study!"} 
            } 
          });
        }else{
          this.setState(prevState => {return {
              ...prevState, 
              error: {school: true, year: true}, 
              helper: {school:"Invalid school name!", year: ""} 
            } 
          });
        }
      }else if(isValidYear === false){
        this.setState(prevState => {return {
            ...prevState, 
            error: {school: false, year: true}, 
            helper: {school:"", year: "Invalid year of study!"} 
          } 
        });
      }else{
        this.setState(prevState => {return {
            ...prevState, 
            error: {school: false, year: false}, 
            helper: {school:"You have successfully updated your school!", year: "You have successfully updated your year of study!"},
            disable: {school: true, year: true}
          } 
        });

        const jsonProfile = {school: school.value, year: year.value};
        changeProfile(jsonProfile).then(result => {
          this.props.app.setState(prevState => {return {
            ...prevState,
            user: result.user
          }})
        })
      }
    }else{
      this.setState(prevState => {return {
          ...prevState, 
          disable: {school: false, year: false}
        } 
      });
      const jsonProfile = {school: "", year: ""};
      changeProfile(jsonProfile).then(result => {
        this.props.app.setState(prevState => {return {
          ...prevState,
          user: result.user
        }})
      })
    }
  }

  componentDidMount() {
    const user = this.props.user;

    this.setState(prevState => {return {
      ...prevState,
      user: user,
      loading: false
    }})
  }

  render() {
    return (
      <div>
        {this.state.loading? <div/> : <div className="user__center">
          <div 
            className="user__paper"
            elevation={10}
          >
            <center><p className="school__name">School Name</p></center>
            <div className="input__box">
              {this.schoolDisable()}

            </div>

            <center><p className="school__year">School Year</p></center>
            <div className="input__box">
              {this.yearDisable()}
            </div>
          
            {this.props.login? <div className="user__return">
              <Button 
                className="user__submit"
                variant="contained"
                onClick = {this.onClickHandler}
                
              >
                Update
              </Button>
            </div> : <div/>}
          </div>
      </div>}
      </div>
    );
  }
}

export default ProfileCard;