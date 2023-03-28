import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import {
  CircularProgress,
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Icon } from "leaflet";
import RoomIcon from "@mui/icons-material/Room";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

import houseIconPNG from "./Assets/Mapicons/house.png";
import appartmentIconPNG from "./Assets/Mapicons/apartment.png";
import officeIconPNG from "./Assets/Mapicons/office.png";

import { useImmerReducer } from "use-immer";

const useStyles = makeStyles({
  cardStyle: {
    margin: "0.5rem",
    border: "1px solid black",
    position: "relative",
  },
  imageStyle: {
    paddingRight: "1rem",
    paddingLeft: "1rem",
    height: "20rem",
    width: "30rem",
    cursor: "pointer",
  },
  priceStyle: {
    position: "absolute",
    backgroundColor: "green",
    color: "white",
    zIndex: "1000",
  },
});

function Listings() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(51.505);
  const [longitude, setLongitude] = useState(-0.09);

  const initialState = {
    mapInstance: "",
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "getMap":
        draft.mapInstance = action.mapData;
        break;

      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: "getMap", mapData: map });
    return null;
  }

  const houseIcon = new Icon({
    iconUrl: houseIconPNG,
    iconSize: [40, 40],
  });

  const appartmentIcon = new Icon({
    iconUrl: appartmentIconPNG,
    iconSize: [40, 40],
  });

  const officeIcon = new Icon({
    iconUrl: officeIconPNG,
    iconSize: [40, 40],
  });

  const [allListings, setAllListings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // used to process cancelling request befroe request is done (ie. due to lag)
    const source = Axios.CancelToken.source();
    async function getAllListings() {
      try {
        const url = "http://localhost:8000/api/listings";
        const response = await Axios.get(url, { cancelToken: source.token });
        console.log(response);
        setAllListings(response.data);
        setDataLoading(false);
      } catch (e) {
        console.log(e.response);
      }
    }
    getAllListings();
    return () => {
      source.cancel();
    };
  }, []);

  if (dataLoading === true) {
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
    <Grid container>
      <Grid xs={4} style={{ marginTop: "0.5rem" }}>
        {allListings.map((listing) => {
          return (
            <Card className={classes.cardStyle}>
              <CardHeader
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() =>
                      state.mapInstance.flyTo(
                        [listing.latitude, listing.longitude],
                        15
                      )
                    }
                  >
                    <RoomIcon />
                  </IconButton>
                }
                title={listing.title}
              />
              <CardMedia
                component="img"
                image={listing.picture1}
                alt=""
                className={classes.imageStyle}
                onClick={() => navigate(`/listings/${listing.id}`)}
              />
              <CardContent>
                <Typography variant="body2">
                  {listing.description.substring(0, 150)}
                  {listing.description.length > 150 ? "..." : ""}
                </Typography>
                <Typography variant="body2" className={classes.priceStyle}>
                  {listing.listing_type}: $
                  {listing.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {listing.property_status === "Sale"
                    ? ""
                    : "/" + listing.rental_frequency}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  {listing.seller_agency_name}
                </IconButton>
              </CardActions>
            </Card>
          );
        })}
      </Grid>
      <Grid xs={8} style={{ marginTop: "0.5rem" }}>
        <AppBar position="sticky">
          <div style={{ height: "100vh" }}>
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <TheMapComponent></TheMapComponent>

              {allListings.map((listing) => {
                function iconDisplay() {
                  if (listing.listing_type === "Appartment") {
                    return appartmentIcon;
                  }
                  if (listing.listing_type === "House") {
                    return houseIcon;
                  }
                  if (listing.listing_type === "Office") {
                    return officeIcon;
                  }
                }
                return (
                  <Marker
                    key={listing.id}
                    icon={iconDisplay()}
                    position={[listing.latitude, listing.longitude]}
                  >
                    <Popup>
                      <Typography variant="h5">{listing.title}</Typography>
                      <img
                        src={listing.picture1}
                        alt=""
                        style={{
                          height: "14rem",
                          width: "18rem",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      ></img>
                      <Typography variant="body1">
                        {listing.description.substring(0, 150)}
                        {listing.description.length > 150 ? "..." : ""}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        Details
                      </Button>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Listings;
