import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polygon,
} from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import {
  CircularProgress,
  Grid,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

import StateContext from "../Contexts/StateContext";
import { act } from "react-dom/test-utils";
import ProfileUpdate from "./ProfileUpdate";
import { FlightTakeoffSharp } from "@mui/icons-material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

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

function AgencyDetail() {
  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerListings: [],
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
  const params = useParams();
  const imagePath = "http://localhost:8000";

  useEffect(() => {
    async function getProfileInfo() {
      try {
        const url = `http://localhost:8000/api/profiles/${params.id}/`;
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
              <span style={{ color: "green", fontWeight: "bolder" }}>
                {state.userProfile.agencyName}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              <IconButton>
                <LocalPhoneIcon></LocalPhoneIcon>
                {state.userProfile.phoneNumber}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        <Grid item style={{ marginTop: "1rem", padding: "5px" }}>
          {state.userProfile.bio}
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="flex-start"
        spacing={2}
        style={{ padding: "10px" }}
      >
        {state.userProfile.sellerListings.map((listing) => {
          return (
            <Grid item style={{ marginTop: "1rem", maxWidth: "20rem" }}>
              <Card>
                <CardMedia
                  sx={{ height: 140, width: 210, cursor: "pointer" }}
                  image={
                    imagePath + `${listing.picture1}`
                      ? imagePath + `${listing.picture1}`
                      : defaultProfilePicture
                  }
                  onClick={() => navigate(`/listings/${listing.id}`)}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.description}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">
                    {listing.property_status === "Sale"
                      ? `${listing.listing_type}: $${listing.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : `${listing.listing_type}: $${listing.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                          listing.rental_frequency
                        }`}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default AgencyDetail;
