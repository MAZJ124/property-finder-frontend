import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polygon,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import {
  CircularProgress,
  Grid,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

import StateContext from "../Contexts/StateContext";
import { act } from "react-dom/test-utils";
import ProfileUpdate from "./ProfileUpdate";
import { FlightTakeoffSharp } from "@mui/icons-material";

import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

const useStyles = makeStyles({
  formContainer: {
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "3rem",
    border: "5px solid black",
    padding: "3rem",
  },
  loginBtn: {
    backgroundColor: "green",
    color: "error",
    fontSize: "1.1rem",
  },
  picturesBtn: {
    backgroundColor: "blue",
    color: "success",
    fontSize: "0.8rem",
    border: "1px solid black",
  },
});

function Profile() {
  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerListings: [],
      sellerId: "",
    },
    dataIsLoading: true,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        draft.userProfile.sellerId = action.profileObject.seller;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;

      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);
  const globalState = useContext(StateContext);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfileInfo() {
      try {
        const url = `http://localhost:8000/api/profiles/${globalState.userId}/`;
        const response = await Axios.get(url);
        console.log(response);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (e) {
        console.log(e.response);
      }
    }
    getProfileInfo();
  }, []);

  function propertyCountDisplay() {
    var countMessage = "";
    if (state.userProfile.sellerListings.length > 1) {
      countMessage = state.userProfile.sellerListings.length + " properties";
    }
    if (state.userProfile.sellerListings.length === 1) {
      countMessage = state.userProfile.sellerListings.length + " propertiy";
    }
    if (state.userProfile.sellerListings.length < 1) {
      countMessage = "No properties";
    }
    return (
      <Button
        size="small"
        onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
      >
        {countMessage}
      </Button>
    );
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ""
    ) {
      return (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          Welcome{" "}
          <span style={{ color: "green", fontWeight: "bolder" }}>
            {globalState.userUsername}
          </span>
          , you can update your profile here!
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            border: "5px solid black",
            marginTop: "1rem",
            padding: "5px",
          }}
        >
          <Grid item>
            <img
              style={{
                height: "10rem",
                width: "10rem",
              }}
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
              alt=""
            ></img>
          </Grid>

          <Grid
            item
            container
            style={{ paddingLeft: "5rem" }}
            direction={"column"}
            justifyContent={"center"}
            xs={6}
          >
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                Welcome{" "}
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  {globalState.userUsername}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                You have {propertyCountDisplay()} listed here!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        style={{ height: "100vh" }}
      >
        <CircularProgress></CircularProgress>
      </Grid>
    );
  }

  return (
    <div>
      {WelcomeDisplay()}
      <ProfileUpdate userProfile={state.userProfile}></ProfileUpdate>
    </div>
  );
}

export default Profile;
