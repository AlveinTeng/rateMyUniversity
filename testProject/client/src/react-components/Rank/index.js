import React, { useState } from "react";

import Header from "./../Header";
import Banner from "./../Banner";
import RankCard from "./RankCard";

import { Paper } from "@material-ui/core";
import { withRouter } from 'react-router-dom';
import "./styles.css";
import { checkSession } from "./../../action/user"
import { rankUniversitiesByCate } from "./../../action/university"

//add sort actions for six categories
const Rank = props => {
  const [generalRankUnis, setGeneralRankUnis] = useState([]);
  const [safetyRankUnis, setSafetyRankUnis] = useState([]);
  const [workloadRankUnis, setWorkloadRankUnis] = useState([]);
  const [locationRankUnis, setLocationRankUnis] = useState([]);
  const [facilitiesRankUnis, setFacilitiesRankUnis] = useState([]);
  const [opportunityRankUnis, setOpportunityRankUnis] = useState([]);
  const [clubsRankUnis, setClubsRankUnis] = useState([]);
  
  if (generalRankUnis.length === 0) {
    rankUniversitiesByCate("general", 5).then(universities => {setGeneralRankUnis(universities)});
    rankUniversitiesByCate("safety", 5).then(universities => {setSafetyRankUnis(universities)});
    rankUniversitiesByCate("workload", 5).then(universities => {setWorkloadRankUnis(universities)});
    rankUniversitiesByCate("location", 5).then(universities => {setLocationRankUnis(universities)});
    rankUniversitiesByCate("facilities", 5).then(universities => {setFacilitiesRankUnis(universities)});
    rankUniversitiesByCate("opportunity", 5).then(universities => {setOpportunityRankUnis(universities)});
    rankUniversitiesByCate("clubs", 5).then(universities => {setClubsRankUnis(universities)});
  }

  return (
    <div className="Rank">
      <Paper 
        id="header"
        elevation={10}
      >
        <Header 
          history={props.history}
          app={props.app}
          search={true}
        />
      </Paper>

      <div id="banner">
        <Banner
          history={props.history}
          rank= {false}
        />
      </div>

      <div id="rank__content">
        <Paper 
          className="rank__paper"
          elevation={10}
        >
          <div className="rank_centerbox">
            <span className="rankTitle">Rank by Catagories</span>
            <div className="rankBody">
              <RankCard
                  category="General"
                  universities={generalRankUnis}
              />
              <RankCard
                  category="Safety"
                  universities={safetyRankUnis}
              />
              <RankCard
                  category="Workload"
                  universities={workloadRankUnis}
              />
              <RankCard
                  category="Location"
                  universities={locationRankUnis}
              />
              <RankCard
                  category="Facilities"
                  universities={facilitiesRankUnis}
              />
              <RankCard
                  category="Opportunity"
                  universities={opportunityRankUnis}
              />
              <RankCard
                  category="Clubs"
                  universities={clubsRankUnis}
              />
            </div>
          </div>

        </Paper>

      </div>
    </div>
  );
}

export default withRouter(Rank);