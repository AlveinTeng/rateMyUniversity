import React, { useState } from "react";

import Header from "./../Header";

import { withRouter } from 'react-router-dom';
import { Paper } from "@material-ui/core";
import "./styles.css";

const log = console.log;

const Error = props => {
  return (
    <div className="Error">
      <Paper 
        id="header"
        elevation={10}
      >
        <Header 
          login= {props.appState.login}
          history={props.history}
          user={props.users[props.appState.user]}
          universities={props.universities}
          search={true}
        />
      </Paper>
      <div className="error__content">
        <span className="questionMark">
        ¿
        </span>
        <span className="error__message">
          You entered a wrong university name, try typing "University of Toronto - St. George"
        </span>
      </div>

    </div>
  );
}

export default withRouter(Error);