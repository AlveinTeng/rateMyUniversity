import React, { useState, useContext } from "react";
import "./styles.css";
import { Button, TextField, Paper, MenuItem } from "@material-ui/core";
import { changePassword, getUserByName, checkPassword } from"./../../../action/user";
import UserContext from "./../../UserContext";
const log = console.log;

class SettingCard extends React.Component {
  state = {
    user: undefined,
    loading: true,
    error: {
      oldPassword: false,
      password: false, 
      confirm: false
    },
    helper: {
      oldPassword: "",
      password: "", 
      confirm: ""
    },
    disable: {
      oldPassword: false,
      password: true, 
      confirm: true
    },
    oldPass: ""
  }

  constructor(props) {
    super(props);
  }

  oldPasswordDisable = () =>{
    if (this.state.disable.oldPassword === true){
      return (<TextField
        error={this.state.error.oldPassword}
        id="old_password"
        className="signup"
        label="Old password" 
        type="password"
        variant="outlined"
        helperText = {this.state.helper.oldPassword}
        disabled
      />);
    }else{
      return (<TextField
        error={this.state.error.oldPassword}
        id="old_password"
        className="signup"
        label="Old password" 
        type="password"
        variant="outlined"
        helperText = {this.state.helper.oldPassword}
      />);
    }
  }

  passwordDisable = () =>{
    if (this.state.disable.password === true){
      return (<TextField
        error={this.state.error.password}
        id="new_password"
        className="signup"
        label="New password" 
        type="password"
        variant="outlined"
        helperText = {this.state.helper.password}
        disabled
      />);
    }else{
      return (<TextField
        error={this.state.error.password}
        id="new_password"
        className="signup"
        label="New password" 
        type="password"
        variant="outlined"
        helperText = {this.state.helper.password}
      />);
    }
  }

  confirmPasswordDisable = () =>{
    if (this.state.disable.confirm === true){
      return (<TextField
        error={this.state.error.confirm}
        id="confirm_password"
        className="signup"
        label="Confirm your new password"
        type="password"
        variant="outlined"
        helperText={this.state.helper.confirm}
        disabled
      />);
    }else{
      return (<TextField
        error={this.state.error.confirm}
        id="confirm_password"
        className="signup"
        label="Confirm your new password"
        type="password"
        variant="outlined"
        helperText={this.state.helper.confirm}
      />)
    }
  }

  onClickUpdateHandler = (e, r) =>{
    if (r === 'clickaway') {
      return;
    }

    const password = document.getElementById("new_password");
    const confirm = document.getElementById("confirm_password");
    
    if (!this.state.disable.password && !this.state.disable.confirm) {
      let passErr = false;
      let conErr = false;
      if (password.value === "") {
        this.setState(prevState => {return {
            ...prevState, 
            error: {...prevState.error, password: true}, 
            helper: {...prevState.helper, password:"should not be empty!"} 
          } 
        });
        passErr = true;
      }

      if (confirm.value === "") {
        this.setState(prevState => {return {
            ...prevState, 
            error: {...prevState.error, confirm: true}, 
            helper: {...prevState.helper, confirm:"should not be empty!"} 
          } 
        });
        conErr = true
      }

      if (passErr || conErr) {
        return;
      }

      if (password.value !== confirm.value) {
        this.setState(prevState => {return {
            ...prevState, 
            error: {...prevState.error, password: true, confirm: true}, 
            helper: {...prevState.helper, password:"doesn't match!", confirm:"doesn't match!"} 
          } 
        });
        return;
      }

      const changeComp = {
        oldPassword: this.state.oldPass,
        newPassword: password.value
      }

      changePassword(changeComp).then(result => {
        const userName = result.currentUser;
        getUserByName(userName).then(user => {
          this.props.app.setState(prevState => {return {...prevState, user: user} });
          alert("You have changed your password!");
          this.setState(prevState => {return {
              ...prevState, 
              oldPass: "",
              error: {oldPassword: false, password: false, confirm: false},
              helper: {oldPassword: "", password: "", confirm: ""},
              disable: {oldPassword: false, password: true, confirm: true}
            } 
          });
          document.getElementById("old_password").value = "";
          document.getElementById("new_password").value = "";
          document.getElementById("confirm_password").value = "";
        })
      })
    } else {
      console.log("something wrong here");
    }
  }

  onClickChangeHandler = (e, r) =>{
    if (r === 'clickaway') {
      return;
    }

    const oldPassword = document.getElementById("old_password");
    if (!this.state.disable.oldPassword) {
      let oldPassErr = false;
      if (oldPassword.value === "") {
        this.setState(prevState => {return {
            ...prevState, 
            error: {...prevState.error, oldPassword: true}, 
            helper: {...prevState.helper, oldPassword:"should not be empty!"} 
          } 
        });
        oldPassErr = true;
        document.getElementById("old_password").value = "";
      }

      if (!oldPassErr) {
        const jsonPass = {password: oldPassword.value};
        checkPassword(this.state.user._id, jsonPass).then(result => {
          if (!result.check) {
            this.setState(prevState => {return {
                ...prevState, 
                error: {...prevState.error, oldPassword: true}, 
                helper: {...prevState.helper, oldPassword:"password is wrong!"},
                oldPass: ""
              } 
            });
            document.getElementById("old_password").value = "";
          } else {
            this.setState(prevState => {return {
                ...prevState, 
                error: {oldPassword: false, password: false, confirm: false},
                helper: {oldPassword: "", password: "", confirm: ""},
                disable: {oldPassword: true, password: false, confirm: false},
                oldPass: oldPassword.value
              } 
            });
          }
        })
      }
    } else {
      console.log("something wrong here");
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
          <p className="change_password">
            <span className="change_password_title">
              Change password
            </span>
          </p>

          <div className="input__box">
            {this.oldPasswordDisable()}

          </div>
          
          <div className="input__box">
            {this.passwordDisable()}

          </div>

          <div className="input__box">
            
            {this.confirmPasswordDisable()}
          </div>
          
          <div className="user__return">
            {this.state.disable.oldPassword?
              <Button 
                // id="confirm__password"
                // className="user__submit"
                variant="contained"
                onClick = {this.onClickUpdateHandler}
              >
                Update
              </Button> : <Button 
                // id="old__password"
                // className="user__submit"
                variant="contained"
                onClick = {this.onClickChangeHandler}
              >
                Change
              </Button>
            }
          </div>
        </div>
      </div>}
      </div>
    );
  }
}

export default SettingCard;