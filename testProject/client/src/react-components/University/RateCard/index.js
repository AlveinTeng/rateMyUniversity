import React from "react";

import RateCateBar from "./RateCateBar";
import { Button, Paper } from "@material-ui/core";
import FaceChanger from "./../../FaceChanger";
import { getRatingById, setRatingById } from "./../../../action/rate";
import { updateAllRank } from "./../../../action/university";
import "./styles.css";

class RateCard extends React.Component {

  state = {
    rating: undefined,
    loading: true
  }

  constructor(props) {
    super(props);
  }
  
  changeTitle = (shrink) => {
    if (shrink) {
      return "Overall Rating"
    } else {
      return "Overall Quality Rating"
    }
  }

  componentDidMount() {
    if (this.props.rate) {
      this.setState(prevState => {return {...prevState, rating: this.props.rate, loading: false}})
    } else {
      const rate_id = this.props.rating;
      getRatingById(rate_id).then(rating => {
        const oldUniRate = rating.rating;
        this.setState(prevState => {return {...prevState, rating: oldUniRate, loading: false}})
      })
    }

    // if (this.props.shrink) {
    //   getRatingById(rate_id).then(rating => {
    //     const oldUniRate = rating.rating;
    //     this.setState(prevState => {return {...prevState, rating: oldUniRate, loading: false}})
    //   })
    // } else {
    //   const university = this.props.uni;
    //   getRatingById(rate_id).then(rating => {
    //     const oldUniRate = rating.rating;
    //     updateAllRank(university).then(ranks => {
    //       oldUniRate.safety.rank = ranks.safty;
    //       oldUniRate.workload.rank = ranks.workload;
    //       oldUniRate.location.rank = ranks.location;
    //       oldUniRate.facilities.rank = ranks.facilities;
    //       oldUniRate.opportunity.rank = ranks.opportunity;
    //       oldUniRate.clubs.rank = ranks.clubs;
    //       oldUniRate.general.rank = ranks.general;
  
    //       setRatingById(rate_id, oldUniRate).then(result => {
    //         this.setState(prevState => {return {...prevState, rating: result.rating, loading: false}})
    //       })
    //     })
    //   })
    // }
  }

  // componentDidUpdate() {
  //   if (this.props.prevState && this.props.prevState !== this.props.thisState) {
  //     const rate_id = this.props.rating;
  //     const university = this.props.uni;
  //     getRatingById(rate_id).then(rating => {
  //       const oldUniRate = rating.rating;
  //       updateAllRank(university).then(ranks => {
  //         oldUniRate.safety.rank = ranks.safty;
  //         oldUniRate.workload.rank = ranks.workload;
  //         oldUniRate.location.rank = ranks.location;
  //         oldUniRate.facilities.rank = ranks.facilities;
  //         oldUniRate.opportunity.rank = ranks.opportunity;
  //         oldUniRate.clubs.rank = ranks.clubs;
  //         oldUniRate.general.rank = ranks.general;
  
  //         setRatingById(rate_id, oldUniRate).then(result => {
  //           this.setState(prevState => {return {...prevState, rating: result.rating, loading: false}})
  //         })
  //       })
  //     })
  //   }
  // }

  render() {
    const shrink = this.props.shrink;

    return (
      <div>
        {this.state.loading? <div/> : <Paper
        className={shrink ? "rateCrad short__width" : "rateCrad regular__width" }
        elevation={4}
      >
        <div className={shrink ? "ratecard__content content__shortWidth" : "ratecard__content content__regularWidth" }>
          <div className="ratecard__overall">
            <span className="ratecard__allratingtext">
              {this.changeTitle(shrink)}
            </span>

            <div className="ratecard__allbuttonspace">
              <Button
                className="ratecard__allbutton"
                onClick={this.props.reDirectRank}
              >
                {FaceChanger(this.state.rating.general.rate, "large")}
                <div className="ratecard__space">
                  {Math.round((this.state.rating.general.rate + Number.EPSILON) * 10) / 10}
                </div>
              </Button>
            </div>
          </div>

          <div className="ratecard__group">
            <RateCateBar rating={this.state.rating.safety} shrink={shrink}/>
            <RateCateBar rating={this.state.rating.workload} shrink={shrink}/>
            <RateCateBar rating={this.state.rating.facilities} shrink={shrink}/>
            <RateCateBar rating={this.state.rating.opportunity} shrink={shrink}/>
            <RateCateBar rating={this.state.rating.clubs} shrink={shrink}/>
            <RateCateBar rating={this.state.rating.location} shrink={shrink}/>
          </div>
        </div>

      </Paper>}
      </div>
    );
  }
}

export default RateCard;