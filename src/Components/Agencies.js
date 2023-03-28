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
  Grid,
  Typography,
  Button,
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
import { DraftsRounded, FlightTakeoffSharp } from "@mui/icons-material";

import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

const useStyles = makeStyles({});

function Agencies() {
  const initialState = {
    dataIsLoading: true,
    agenciesList: [],
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "catchAgencies":
        draft.agenciesList = action.agenciesArray;
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
    async function getAgencies() {
      try {
        const url = `http://localhost:8000/api/profiles/`;
        const response = await Axios.get(url);
        console.log(response);
        dispatch({
          type: "catchAgencies",
          agenciesArray: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (e) {
        console.log(e.response);
      }
    }
    getAgencies();
  }, []);

  return (
    <Grid
      container
      justifyContent="flex-start"
      spacing={2}
      style={{ padding: "10px" }}
    >
      {state.agenciesList.map((agency) => {
        function propertyCountDisplay() {
          var countMessage = "";
          if (agency.seller_listings.length > 1) {
            countMessage = agency.seller_listings.length + " properties";
          }
          if (agency.seller_listings.length === 1) {
            countMessage = agency.seller_listings.length + " propertiy";
          }
          if (agency.seller_listings.length < 1) {
            countMessage = "No properties";
          }
          return (
            <Button
              size="small"
              onClick={() => navigate(`/agencies/${agency.seller}`)}
            >
              {countMessage}
            </Button>
          );
        }
        if (agency.agency_name && agency.phone_number) {
          return (
            <Grid
              item
              style={{
                marginTop: "1rem",
                maxWidth: "20rem",
              }}
            >
              <Card>
                <CardMedia
                  sx={{ height: 140, width: 300 }}
                  image={
                    agency.profile_picture
                      ? agency.profile_picture
                      : defaultProfilePicture
                  }
                  title="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {agency.agency_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agency.bio.substring(0, 30)}
                    {agency.bio.length > 30 ? "..." : ""}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">{propertyCountDisplay()}</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        }
      })}
    </Grid>
  );
}

export default Agencies;
