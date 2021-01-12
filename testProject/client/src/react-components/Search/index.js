import React, { useState, useEffect} from "react";

import { withRouter } from 'react-router-dom';
import { Paper, InputBase, IconButton, Divider, Box, Button} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Header from "./../Header";
import Banner from "./../Banner"
import { checkSession } from "./../../action/user"
import { getUniversities, searchUniversity } from "./../../action/university"

import "./styles.css";

//need to get all universities
const Search = props => {
  const [universities, setUniversities] = useState([]);
  if (universities.length === 0) {
    getUniversities().then(unis => { setUniversities(unis.universities) });
  }
  const [change, setChange] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState([]);

  const searchUni = (e) => {
    const search = document.getElementById('search__search').value;
    
    if (search == '') {
      return;
    }

    props.history.push(searchUniversity(universities, search));
  }

  const handleOnChange = (newWord) => {
    const oldArr = universities.map(university => {
      return { name: university.name.toLowerCase(), id: university.id };
    });

    if (newWord !== "") {
      const newArr = [];

      for (let i=0; i<oldArr.length; i++) {
        if (oldArr[i].name.includes(newWord.toLowerCase())) {
          newArr.push(oldArr[i])
        }
      }
      setFilterDisplay(newArr);
    } else {
      setFilterDisplay(oldArr);
    }
  }

  const updateSearch = (e) => {
    const universityName = e.target.innerText.toLowerCase();
    let university = undefined;
    let i = 0;
    while (university === undefined) {
      const universityProp = universities[i]
      if (universityProp.name.toLowerCase() === universityName) {
        university = universityProp;
      }
      i ++;
    }

    document.getElementById("search__search").value = university.name;
    setChange(false);
  }

  window.addEventListener('scroll', event => {
    setChange(false);
  })

  return (
    <div className="Search">
      <Paper 
        id="header"
        elevation={10}
      >
        <Header 
          history={props.history}
          app={props.app}
          search={false}
        />
      </Paper>


      <div id="banner">
        <Banner
          history={props.history}
          rank= {true}
        />
      </div>


      <div id="search__content">
        <p className="search__title textCenter largeFontSize">
          RateMyUniversity
        </p>

        <p className="search__description textCenter">
          The world's "largest" University rating platform.
        </p>

        <Paper 
          className="search__searchBar"
          component="form"
        >


          <InputBase
            id="search__search"
            className="search__input"
            placeholder="Seach here..."
            onFocus={() => {
                const newWord = document.getElementById('search__search').value
                handleOnChange(newWord)
                setChange(true)
              }}
            onChange={() => {
              const newWord = document.getElementById('search__search').value
              handleOnChange(newWord)
            }}
          />

          <Divider
            className="search__divider"
            orientation="vertical"
          />

          <IconButton 
            className="search__submit"
            onClick={searchUni}
          >
            <SearchIcon/>
          </IconButton>

        </Paper>
        
        {change? 
          <div>
            <Box className="search__dropdown" p={2}>

              {filterDisplay.map(university => {
                return (
                  <div className="dropdown__buttons" key={university.id}>
                    <Button variant="contained" size="small" onClick={(e) => updateSearch(e)}>
                      {university.name}
                    </Button>
                  </div>
                )
              })}
            </Box>
          </div> : <div></div>}

      </div>
    </div>
  );
}

export default withRouter(Search);