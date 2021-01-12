import React from "react";
import SentimentVerySatisfiedTwoToneIcon from '@material-ui/icons/SentimentVerySatisfiedTwoTone';
import SentimentVeryDissatisfiedTwoToneIcon from '@material-ui/icons/SentimentVeryDissatisfiedTwoTone';
import SentimentSatisfiedTwoToneIcon from '@material-ui/icons/SentimentSatisfiedTwoTone';
import SentimentSatisfiedAltTwoToneIcon from '@material-ui/icons/SentimentSatisfiedAltTwoTone';
import SentimentDissatisfiedTwoToneIcon from '@material-ui/icons/SentimentDissatisfiedTwoTone';

import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import "./styles.css";

const FaceChanger = (rate, size) => {
  if (rate >= 4.5) {
    return (
      <SentimentVerySatisfiedTwoToneIcon
        className="face__veryHappy"
        fontSize={size}
      />
    );
  } else if (rate >= 3.5) {
    return (
      <SentimentSatisfiedAltTwoToneIcon
        className="face__happy"
        fontSize={size}
      />
    );
  } else if (rate >= 2.5) {
    return (
      <SentimentSatisfiedTwoToneIcon
        className="face__normal"
        fontSize={size}
      />
    );
  } else if (rate >= 1.5) {
    return (
      <SentimentDissatisfiedTwoToneIcon
        className="face__sad"
        fontSize={size}
      />
    );
  } else {
    return (
      <SentimentVeryDissatisfiedTwoToneIcon
        className="face__verySad"
        fontSize={size}
      />
    );
  }
}

export default FaceChanger;