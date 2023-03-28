import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Typography, Button, Grid, AppBar, Toolbar } from "@mui/material";

import city from "./Assets/city.jpg";
import Header from "./Header";

const useStyles = makeStyles({
  cityImg: {
    width: "100%",
    height: "92vh",
  },

  overlayText: {
    position: "absolute",
    zIndex: "100",
    top: "100px",
    left: "20px",
    textAlign: "center",
  },

  homeText: {
    color: "white",
    fontWeight: "bolder",
  },

  homeBtn: {
    fontSize: "3.5rem",
    borderRadius: "13px",
    marginTop: "2rem",
  },
});

function Home() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ position: "relative" }}>
        <img src={city} alt="" className={classes.cityImg}></img>
        <div className={classes.overlayText}>
          <Typography variant="h1" className={classes.homeText}>
            FIND YOUR NEXT HOME HERE :-)
          </Typography>
          <Button
            variant="contained"
            className={classes.homeBtn}
            onClick={() => navigate("/listings")}
          >
            SEE PROPERTIES LISTING
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
