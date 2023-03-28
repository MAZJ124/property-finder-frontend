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
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RoomIcon from "@mui/icons-material/Room";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { makeStyles } from "@mui/styles";

import Axios from "axios";
import ListingUpdate from "./ListingUpdate";

import StateContext from "../Contexts/StateContext";
import { act } from "react-dom/test-utils";
import ProfileUpdate from "./ProfileUpdate";
import { Calculate, FlareSharp, FlightTakeoffSharp } from "@mui/icons-material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import stadiumIconPng from "./Assets/Mapicons/stadium.png";
import hospitalIconPng from "./Assets/Mapicons/hospital.png";
import universityIconPng from "./Assets/Mapicons/university.png";
import { Icon } from "leaflet";

const useStyles = makeStyles({
  sliderContainer: {
    position: "relative",
    marginTop: "1rem",
  },

  leftArrow: {
    position: "absolute",
    cursor: "pointer",
    fontSize: "3rem",
    color: "green",
    top: "50%",
    left: "27.5%",
    "&hover": {
      backgroundColor: "green",
    },
  },

  rightArrow: {
    position: "absolute",
    cursor: "pointer",
    fontSize: "3rem",
    color: "green",
    top: "50%",
    right: "27.5%",
    "&hover": {
      backgroundColor: "green",
    },
  },
});

function ListingDetail() {
  const initialState = {
    listingInfo: "",
    dataIsLoading: true,
    sellerProfileInfo: "",
    openSnack: false,
    disabledBtn: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;

      case "catchSellerProfileInfo":
        draft.sellerProfileInfo = action.profileObject;
        break;

      case "openTheSnack":
        draft.openSnack = true;
        break;

      case "disabledTheButton":
        draft.disabledBtn = true;
        break;

      case "allowedTheButton":
        draft.disabledBtn = false;
        break;

      default:
        break;
    }
  }

  const [currentPictureIndex, setCuurentPictureIndex] = useState(0);
  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);
  const globalState = useContext(StateContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const imagePath = "http://localhost:8000";

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const stadiumIcon = new Icon({
    iconUrl: stadiumIconPng,
    iconSize: [40, 40],
  });

  const hopsitalIcon = new Icon({
    iconUrl: hospitalIconPng,
    iconSize: [40, 40],
  });

  const universityIcon = new Icon({
    iconUrl: universityIconPng,
    iconSize: [40, 40],
  });

  useEffect(() => {
    async function getListingInfo() {
      try {
        const url = `http://localhost:8000/api/listings/${params.id}/`;
        const response = await Axios.get(url);
        console.log(response);
        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    getListingInfo();
  }, []);

  useEffect(() => {
    async function getProfileInfo() {
      if (state.listingInfo) {
        try {
          const url = `http://localhost:8000/api/profiles/${state.listingInfo.seller}/`;
          const response = await Axios.get(url);
          console.log(response);
          dispatch({
            type: "catchSellerProfileInfo",
            profileObject: response.data,
          });
          dispatch({ type: "loadingDone" });
        } catch (e) {
          console.log(e.response);
        }
      }
    }
    getProfileInfo();
  }, [state.listingInfo]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  }, [state.openSnack]);

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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  }

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture !== null);

  function PreviousPicture() {
    if (currentPictureIndex === 0) {
      return;
    }
    setCuurentPictureIndex(currentPictureIndex - 1);
  }

  function NextPicture() {
    if (currentPictureIndex === listingPictures.length - 1) {
      return;
    }
    setCuurentPictureIndex(currentPictureIndex + 1);
  }

  async function DeleteHandler() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (confirmDelete) {
      try {
        const url = `http://localhost:8000/api/listings/${params.id}/delete/`;
        const response = await Axios.delete(url);
        console.log(response);
        dispatch({ type: "openTheSnack" });
        dispatch({ type: "disabledTheButton" });
      } catch (e) {
        console.log(e.response);
        dispatch({ type: "allowedTheButton" });
      }
    }
  }

  return (
    <div
      style={{ marginLeft: "1rem", marginRight: "2rem", marginBottom: "2rem" }}
    >
      <Grid item style={{ margin: "1rem" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="/listings"
            style={{ cursor: "pointer" }}
            // onClick={() => navigate("/listings")}
          >
            Listings
          </Link>
          <Typography color="text.primary">
            {state.listingInfo.title}
          </Typography>
        </Breadcrumbs>
      </Grid>

      <Grid
        item
        container
        justifyContent={"center"}
        className={classes.sliderContainer}
      >
        {listingPictures.map((picture, index) => {
          if (index === currentPictureIndex) {
            return (
              <div>
                <img
                  src={picture}
                  alt=""
                  style={{ width: "20rem", height: "20rem" }}
                ></img>
              </div>
            );
          }
        })}
        <ArrowCircleLeftIcon
          onClick={PreviousPicture}
          className={classes.leftArrow}
        ></ArrowCircleLeftIcon>
        <ArrowCircleRightIcon
          onClick={NextPicture}
          className={classes.rightArrow}
        ></ArrowCircleRightIcon>
      </Grid>

      <Grid
        item
        container
        style={{
          padding: "1rem",
          border: "1px solid black",
          marginTop: "1rem",
        }}
      >
        <Grid item container xs={7} direction={"column"} spacing={1}>
          <Grid item>
            <Typography variant="h5">{state.listingInfo.title}</Typography>
          </Grid>
          <Grid item>
            <RoomIcon></RoomIcon>{" "}
            <Typography variant="h6">{state.listingInfo.borough}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              {"Date posted: "}
              {formatDate(state.listingInfo.date_posted)}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={5} alignItems={"center"}>
          <Typography
            variant="h6"
            style={{ fontWeight: "bolder", color: "green" }}
          >
            {state.listingInfo.listing_type} |{" "}
            {state.listingInfo.property_status === "Sale"
              ? `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                  state.listingInfo.rental_frequency
                }`}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        justifyContent={"flex-start"}
        style={{
          padding: "1rem",
          border: "1px solid black",
          marginTop: "1rem",
        }}
      >
        {state.listingInfo.rooms ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <Typography variant="h6">
              {state.listingInfo.rooms} room
              {state.listingInfo.rooms === 1 ? "" : "s"}
            </Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.furnished ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon
              style={{ color: "green", fontSize: "2rem" }}
            ></CheckBoxIcon>{" "}
            <Typography variant="h6">Furnished</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.pool ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon
              style={{ color: "green", fontSize: "2rem" }}
            ></CheckBoxIcon>{" "}
            <Typography variant="h6">Pool</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.elavator ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon
              style={{ color: "green", fontSize: "2rem" }}
            ></CheckBoxIcon>{" "}
            <Typography variant="h6">Elevator</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.cctv ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon
              style={{ color: "green", fontSize: "2rem" }}
            ></CheckBoxIcon>{" "}
            <Typography variant="h6">CCTV</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.parking ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon
              style={{ color: "green", fontSize: "2rem" }}
            ></CheckBoxIcon>{" "}
            <Typography variant="h6">Parking</Typography>
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      {state.listingInfo.description ? (
        <Grid
          item
          style={{
            padding: "1rem",
            border: "1px solid black",
            marginTop: "1rem",
          }}
        >
          <Typography variant="h5">Description</Typography>
          <Typography variant="h6">{state.listingInfo.description}</Typography>
        </Grid>
      ) : (
        ""
      )}

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
              cursor: "pointer",
            }}
            src={
              state.sellerProfileInfo.profile_picture !== null
                ? state.sellerProfileInfo.profile_picture
                : defaultProfilePicture
            }
            alt=""
            onClick={() =>
              navigate(`/agencies/${state.sellerProfileInfo.seller}`)
            }
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
              style={{
                textAlign: "center",
                marginTop: "1rem",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/agencies/${state.sellerProfileInfo.seller}`)
              }
            >
              <span style={{ color: "green", fontWeight: "bolder" }}>
                {state.sellerProfileInfo.agency_name}
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
                {state.sellerProfileInfo.phone_number}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>

        <Grid item style={{ marginTop: "1rem", padding: "5px" }}>
          {state.sellerProfileInfo.bio}
        </Grid>

        {/* 2 of them have different data types  */}
        {parseInt(globalState.userId) === state.listingInfo.seller ? (
          <Grid item container justifyContent={"space-around"}>
            <Button color="success" onClick={handleClickOpen}>
              Update
            </Button>
            <Button color="error" onClick={DeleteHandler}>
              Delete
            </Button>
          </Grid>
        ) : (
          ""
        )}
        <Dialog open={open} onClose={handleClose} fullScreen>
          <ListingUpdate
            listingData={state.listingInfo}
            closeDialog={handleClose}
          ></ListingUpdate>
        </Dialog>
      </Grid>

      <Grid
        item
        container
        style={{ marginTop: "1rem" }}
        spacing={1}
        justifyContent={"space-between"}
      >
        <Grid item xs={3} style={{ overflow: "auto", height: "35rem" }}>
          {" "}
          {state.listingInfo.listing_pois_within_10km.map((poi) => {
            function DegreeToRadian(coordinate) {
              return (coordinate * Math.PI) / 180;
            }

            function CalculateDistance() {
              const latitude1 = DegreeToRadian(state.listingInfo.latitude);
              const longitude1 = DegreeToRadian(state.listingInfo.longitude);
              const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
              const longitude2 = DegreeToRadian(poi.location.coordinates[1]);
              // The formula
              const latDiff = latitude2 - latitude1;
              const lonDiff = longitude2 - longitude1;
              const R = 6371000 / 1000;

              const a =
                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(latitude1) *
                  Math.cos(latitude2) *
                  Math.sin(lonDiff / 2) *
                  Math.sin(lonDiff / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

              const d = R * c;

              const dist =
                Math.acos(
                  Math.sin(latitude1) * Math.sin(latitude2) +
                    Math.cos(latitude1) *
                      Math.cos(latitude2) *
                      Math.cos(lonDiff)
                ) * R;
              return dist.toFixed(2);
            }

            return (
              <div
                style={{
                  marginBottom: "0.5rem",
                  border: "1px solid black",
                }}
              >
                <div style={{ marginLeft: "0.5rem" }}>
                  <Typography variant="h6">{poi.name}</Typography>
                  <Typography variant="subtitle1">
                    {poi.type} | {CalculateDistance()} kilometers away
                  </Typography>
                </div>
              </div>
            );
          })}
        </Grid>
        <Grid item xs={9} style={{ height: "35rem" }}>
          <MapContainer
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                state.listingInfo.latitude,
                state.listingInfo.longitude,
              ]}
            ></Marker>
            {state.listingInfo.listing_pois_within_10km.map((poi) => {
              function poiIcon() {
                switch (poi.type) {
                  case "University":
                    return universityIcon;
                  case "Stadium":
                    return stadiumIcon;
                  case "Hospital":
                    return hopsitalIcon;
                  default:
                    return hopsitalIcon;
                }
              }
              return (
                <Marker
                  icon={poiIcon()}
                  position={[
                    poi.location.coordinates[0],
                    poi.location.coordinates[1],
                  ]}
                ></Marker>
              );
            })}
          </MapContainer>
        </Grid>
      </Grid>
      <Snackbar
        open={state.openSnack}
        message="You have successfully deleted this listing"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default ListingDetail;
