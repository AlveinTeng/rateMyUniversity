import React, { useState } from "react";

import { Button } from "@material-ui/core";
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

import FaceChanger from "./../../../FaceChanger";
import "./styles.css";

class RateCateBar extends React.Component {

  hideRank = (shrink) => {
    if (!shrink) {
      return (
        <div>
          <span className="ratecatebar__rank">
            Rank:
          </span>
          <div className="ratecatebar__rankspace">
            {this.props.rating.rank}
          </div>
        </div>
      );
    }
  }

  render() {
    const rating = this.props.rating;
    const shrink = this.props.shrink;
    return(
      <div className="RateCateBar">
        <div className="ratecatebar__face">
          {FaceChanger(rating.rate, "large")}
        </div>


        <span className="ratecatebar__name">
          {rating.name}
        </span>

        <span className="ratecatebar__rate">
          Rate:
        </span>

        <div className="ratecatebar__rankspace">
          {Math.round((rating.rate + Number.EPSILON) * 10) / 10}
        </div>

        {this.hideRank(shrink)}

      </div>
    );
  }
}

export default RateCateBar;