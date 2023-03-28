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
  Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

import StateContext from "../Contexts/StateContext";
import { act } from "react-dom/test-utils";

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

function ProfileUpdate(props) {
  const initialState = {
    agencyNameValue: props.userProfile.agencyName,
    phoneNumberValue: props.userProfile.phoneNumber,
    bioValue: props.userProfile.bio,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    disabledBtn: false,
    sendRequest: false,
    sendRequest: 0,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "catchAgencyNameChange":
        draft.agencyNameValue = action.agencyNameChosen;
        break;

      case "catchPhoneNumberChange":
        draft.phoneNumberValue = action.phoneNumberChosen;
        break;

      case "catchBioChange":
        draft.bioValue = action.bioChosen;
        break;

      case "catchUploadedPicture":
        draft.uploadedPicture = action.uploadedPictureChosen;
        break;

      case "catchProfilePictureChange":
        draft.profilePictureValue = action.profilePictureChosen;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
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
  const classes = useStyles();
  const navigate = useNavigate();

  // use effect to update profile pic
  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: "catchProfilePictureChange",
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  function submitForm(e) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disabledTheButton" });
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function updateProfile() {
        const url = `http://localhost:8000/api/profiles/${globalState.userId}/update/`;
        const data = new FormData();
        data.append("agency_name", state.agencyNameValue);
        data.append("phone_number", state.phoneNumberValue);
        data.append("bio", state.bioValue);
        data.append("seller", globalState.userId);
        if (
          typeof state.profilePictureValue !== "string" &&
          state.profilePictureValue !== null
        ) {
          data.append("profile_picture", state.profilePictureValue);
        }
        console.log(data);
        try {
          const response = await Axios.patch(url, data);
          console.log(response);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          console.log(e.response);
          dispatch({ type: "allowedTheButton" });
        }
      }
      updateProfile();
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  }, [state.openSnack]);

  function ProfilePictureDisplay() {
    if (typeof state.profilePictureValue !== "string") {
      return (
        <ul>
          {state.profilePictureValue ? (
            <li>{state.profilePictureValue.name}</li>
          ) : (
            ""
          )}
        </ul>
      );
    } else {
      return (
        <Grid
          item
          style={{
            marginTop: "0.5rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <img
            src={props.userProfile.profilePic}
            alt=""
            style={{ height: "5rem", width: "5rem" }}
          ></img>
        </Grid>
      );
    }
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <Grid container justifyContent="center">
          <Typography variant="h4">MY PROFILE</Typography>
        </Grid>
        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="agencyName"
            label="Agency name"
            variant="outlined"
            fullWidth
            value={state.agencyNameValue}
            onChange={(event) =>
              dispatch({
                type: "catchAgencyNameChange",
                agencyNameChosen: event.target.value,
              })
            }
          />
        </Grid>

        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="phoneNumber"
            label="Phone number"
            variant="outlined"
            fullWidth
            value={state.phoneNumberValue}
            onChange={(event) =>
              dispatch({
                type: "catchPhoneNumberChange",
                phoneNumberChosen: event.target.value,
              })
            }
          />
        </Grid>

        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="bio"
            label="Bio"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={state.bioValue}
            onChange={(event) =>
              dispatch({
                type: "catchBioChange",
                bioChosen: event.target.value,
              })
            }
          />
        </Grid>

        <Grid container>{ProfilePictureDisplay()}</Grid>

        <Grid
          item
          container
          xs={6}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="contained"
            component="label"
            fullWidth
            className={classes.picturesBtn}
          >
            UPLOAD PROFILE PICTURE
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              hidden
              onChange={(event) =>
                dispatch({
                  type: "catchUploadedPicture",
                  uploadedPictureChosen: event.target.files,
                })
              }
            ></input>
          </Button>
        </Grid>

        <Grid
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="contained"
            fullWidth
            type="submit"
            className={classes.loginBtn}
          >
            UPDATE
          </Button>
        </Grid>
      </form>
      <Snackbar
        open={state.openSnack}
        message="You have successfully updated your profile"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default ProfileUpdate;
