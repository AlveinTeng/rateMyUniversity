import React, { useState } from "react";

import Rating from '@material-ui/lab/Rating';
import "./styles.css";

const Category = props => {
  const handleRate = (e, rating) => {
    props.onChangeStar(rating);
  }

  return (
    <div className="Category">
      <div className="category__title left">
        <span className="category__name">
          {props.category}
        </span>
      </div>

      <div className="category__rate left">
        <span className="rate_low">
          {props.rateLow}
        </span>
      </div>

      <div className="category__rating left">
        <Rating
          id={props.category}
          className="rating"
          maxRating={5}
          precision={0.5}
          onChange={handleRate}
        />
      </div>

      <div className="category__rate left">
        <span className="rate_high">
          {props.rateHigh}
        </span>
      </div>
    </div>
  );
}

export default Category;