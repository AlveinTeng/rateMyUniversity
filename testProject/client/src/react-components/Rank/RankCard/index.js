import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Paper } from "@material-ui/core";
import "./styles.css";

const RankCard = props => {
  return (
    <div className="RankCard">
      <Paper 
        className="rankcard__paper"
        elevation={5}
      >
        <div class="rankBlock">
            <span class="catagory">{props.category}</span>
            {props.universities.map((university, i) => {
              const index = i+1;
              return (<div>
                <span class={`rank${index}`}>TOP {index}:</span>
                <Link class="uniName" to={`/university/${university._id}`}>{university.name}</Link>
              </div>)
            })}
        </div>
      </Paper>

    </div>
  );
}

export default RankCard;