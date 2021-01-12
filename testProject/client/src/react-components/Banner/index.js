import React from "react";

import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Button, IconButton, Typography } from '@material-ui/core';
import InsertPhoto from '@material-ui/icons/InsertChart';

import "./styles.css";

/* The Banner Component */
const Banner = props => {
  const onClickBanner = () => {
    if (props.history) {
      props.history.push('/rank');
    }
  }

  const bannerChange = (rank) => {
    if (rank) {
      return (
        <Button
          variant="contained"
          className="banner__button"
          color="secondary"
          onClick={onClickBanner}
        >
          <Typography
            className="banner__rank"
          >
            Rank
          </Typography>
          <InsertPhoto className="banner_icon"/>
        </Button>

      );
    } else {
      return (
        <div></div>
      );
    }
  }

  return (
    <div className="Banner">
      {bannerChange(props.rank)}
    </div>
  )
}

export default withRouter(Banner);