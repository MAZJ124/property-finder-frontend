import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

import StateContext from "../Contexts/StateContext";

const listingTypeOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "House",
    label: "House",
  },
  {
    value: "Appartment",
    label: "Appartment",
  },
  {
    value: "Office",
    label: "Office",
  },
];

const propertyStatusOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Rent",
    label: "Rent",
  },
  {
    value: "Sale",
    label: "Sale",
  },
];

const rentalFrequencyOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Month",
    label: "Month",
  },
  {
    value: "Week",
    label: "Week",
  },
  {
    value: "Day",
    label: "Day",
  },
];

const useStyles = makeStyles({
  formContainer: {
    width: "75%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "3rem",
    border: "5px solid black",
    padding: "3rem",
  },
  registerBtn: {
    backgroundColor: "green",
    color: "error",
    fontSize: "1.1rem",
  },
  picturesBtn: {
    backgroundColor: "blue",
    color: "error",
    fontSize: "0.8rem",
    border: "1px solid black",
  },
});

function ListingUpdate(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const initialState = {
    titleValue: props.listingData.title,
    listingTypeValue: props.listingData.listing_type,
    descriptionValue: props.listingData.description,
    propertyStatusValue: props.listingData.property_status,
    priceValue: props.listingData.price,
    rentalFrequencyValue: props.listingData.rental_frequency,
    roomsValue: props.listingData.rooms,
    furnishedValue: props.listingData.furnished,
    poolValue: props.listingData.pool,
    elavatorValue: props.listingData.elavator,
    cctvValue: props.listingData.cctv,
    parkingValue: props.listingData.parking,
    openSnack: false,
    disabledBtn: false,
    sendRequest: 0,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.titleChosen;
        break;

      case "catchListingTypeChange":
        draft.listingTypeValue = action.listingTypeChosen;
        break;

      case "catchDescriptionChange":
        draft.descriptionValue = action.descriptionChosen;
        break;

      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.propertyStatusChosen;
        break;

      case "catchPriceChange":
        draft.priceValue = action.priceChosen;
        break;

      case "catchRentalFrequencyChange":
        draft.rentalFrequencyValue = action.rentalFrequencyChosen;
        break;

      case "catchRoomsChange":
        draft.roomsValue = action.roomsChosen;
        break;

      case "catchFurnishedChange":
        draft.furnishedValue = action.furnishedChosen;
        break;

      case "catchPoolChange":
        draft.poolValue = action.poolChosen;
        break;

      case "catchElevatorChange":
        draft.elavatorValue = action.elevatorChosen;
        break;

      case "catchCctvChange":
        draft.cctvValue = action.cctvChosen;
        break;

      case "catchParkingChange":
        draft.parkingValue = action.parkingChosen;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;

      case "catchUserProfileInfo":
        // draft.userProfile = action.profileObject;
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
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

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);
  const globalState = useContext(StateContext);

  function submitForm(e) {
    e.preventDefault();
    console.log(state.sendRequest);
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disabledTheButton" });
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function updateProperty() {
        const url = `http://localhost:8000/api/listings/${props.listingData.id}/update/`;
        const data = new FormData();
        data.append("title", state.titleValue);
        data.append("description", state.descriptionValue);
        data.append("listing_type", state.listingTypeValue);
        data.append("property_status", state.propertyStatusValue);
        data.append("price", state.priceValue);
        data.append("rental_frequency", state.rentalFrequencyValue);
        data.append("furnished", state.furnishedValue);
        data.append("pool", state.poolValue);
        data.append("elavator", state.elavatorValue);
        data.append("cctv", state.cctvValue);
        data.append("parking", state.parkingValue);
        data.append("seller", globalState.userId);
        data.append(
          "rooms",
          state.listingTypeValue === "Office" ? 0 : state.roomsValue
        );
        try {
          const response = await Axios.patch(url, data);
          console.log(response);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          dispatch({ type: "allowedTheButton" });
        }
      }
      updateProperty();
      console.log("form submitted");
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

  // Display price in input label
  function priceDisplay() {
    if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue !== ""
    ) {
      return "Price per " + state.rentalFrequencyValue;
    }
    return "Price";
  }

  return (
    <div className={classes.formContainer}>
      <form onSubmit={submitForm}>
        <Grid container justifyContent="center">
          <Typography variant="h4">UPLOAD A PROPERTY</Typography>
        </Grid>

        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            fullWidth
            value={state.titleValue}
            onChange={(event) =>
              dispatch({
                type: "catchTitleChange",
                titleChosen: event.target.value,
              })
            }
          />
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="listingType"
              label="Listing Type"
              variant="outlined"
              fullWidth
              value={state.listingTypeValue}
              onChange={(event) =>
                dispatch({
                  type: "catchListingTypeChange",
                  listingTypeChosen: event.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
            >
              {listingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="propertyStatus"
              label="Property Status"
              variant="outlined"
              fullWidth
              value={state.propertyStatusValue}
              onChange={(event) =>
                dispatch({
                  type: "catchPropertyStatusChange",
                  propertyStatusChosen: event.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
            >
              {propertyStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="price"
              label={priceDisplay()}
              type="number"
              variant="outlined"
              fullWidth
              value={state.priceValue}
              onChange={(event) =>
                dispatch({
                  type: "catchPriceChange",
                  priceChosen: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="rentalFrequency"
              label="Rental Frequency"
              variant="outlined"
              fullWidth
              value={state.rentalFrequencyValue}
              disabled={state.propertyStatusValue === "Sale" ? true : false}
              onChange={(event) =>
                dispatch({
                  type: "catchRentalFrequencyChange",
                  rentalFrequencyChosen: event.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
            >
              {rentalFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            value={state.descriptionValue}
            onChange={(event) =>
              dispatch({
                type: "catchDescriptionChange",
                descriptionChosen: event.target.value,
              })
            }
          />
        </Grid>

        {state.listingTypeValue === "Office" ? (
          ""
        ) : (
          <Grid item xs={3} container style={{ marginTop: "1rem" }}>
            <TextField
              id="rooms"
              label="Rooms"
              type="number"
              variant="outlined"
              fullWidth
              value={state.roomsValue}
              onChange={(event) =>
                dispatch({
                  type: "catchRoomsChange",
                  roomsChosen: event.target.value,
                })
              }
            />
          </Grid>
        )}

        <Grid item container justifyContent="space-between">
          <Grid item xs={2} sx={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.furnishedValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchFurnishedChange",
                      furnishedChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Furnished"
            />
          </Grid>

          <Grid item xs={2} sx={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.poolValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchPoolChange",
                      poolChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Pool"
            />
          </Grid>

          <Grid item xs={2} sx={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.elavatorValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchElavatorChange",
                      elavatorChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Elevator"
            />
          </Grid>

          <Grid item xs={2} sx={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.cctvValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchCctvChange",
                      cctvChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Cctv"
            />
          </Grid>

          <Grid item xs={2} sx={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.parkingValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchParkingChange",
                      parkingChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Parking"
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          className={classes.registerBtn}
        >
          UPDATE
        </Button>
      </form>
      <Button
        style={{ marginTop: "2rem" }}
        variant="contained"
        onClick={props.closeDialog}
        color="error"
      >
        CANCEL
      </Button>
      <Snackbar
        open={state.openSnack}
        message="You have successfully updated this listing"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default ListingUpdate;
