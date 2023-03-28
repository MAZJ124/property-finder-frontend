import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import {
  Alert,
  Grid,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";
import { TryRounded } from "@mui/icons-material";

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
});

function Login() {
  const initialState = {
    usernameValue: "",
    passwordValue: "",
    sendRequest: false,
    token: "",
    openSnack: false,
    disabledBtn: false,
    serverError: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "updateUsername":
        draft.usernameValue = action.updatedUsername;
        draft.serverError = false;
        break;
      case "updatePassword":
        draft.passwordValue = action.updatedPassword;
        draft.serverError = false;
        break;
      case "updateSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "getToken":
        draft.token = action.tokenValue;
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

      case "catchServerError":
        draft.serverError = true;
        break;

      default:
        break;
    }
  }

  const classes = useStyles();
  const navigate = useNavigate();
  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);
  const globalDispatch = useContext(DispatchContext);
  const globalState = useContext(StateContext);

  function submitForm(e) {
    e.preventDefault();
    dispatch({ type: "updateSendRequest" });
    console.log("form submitted");
    dispatch({ type: "disabledTheButton" });
  }

  useEffect(() => {
    if (state.sendRequest) {
      // used to process cancelling request befroe request is done (ie. due to lag)
      const source = Axios.CancelToken.source();
      async function SignIn() {
        try {
          const url = "http://localhost:8000/api-auth-djoser/token/login/";
          const data = {
            username: state.usernameValue,
            password: state.passwordValue,
          };
          const response = await Axios.post(url, data, {
            cancelToken: source.token,
          });
          console.log(response);
          dispatch({ type: "getToken", tokenValue: response.data.auth_token });
          globalDispatch({
            type: "getToken",
            tokenValue: response.data.auth_token,
          });
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          console.log(e.response);
          dispatch({ type: "allowedTheButton" });
          dispatch({ type: "catchServerError" });
        }
      }
      SignIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

  useEffect(() => {
    if (state.token !== "") {
      // used to process cancelling request befroe request is done (ie. due to lag)
      const source = Axios.CancelToken.source();
      async function GetUserInfo() {
        try {
          const url = "http://localhost:8000/api-auth-djoser/users/me/";

          const response = await Axios.get(
            url,
            { headers: { Authorization: "Token ".concat(state.token) } },
            { cancelToken: source.token }
          );
          console.log(response);
          globalDispatch({
            type: "userLogsIn",
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            idInfo: response.data.id,
          });
        } catch (e) {
          console.log(e.response);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

  return (
    <div className={classes.formContainer}>
      <form onSubmit={submitForm}>
        <Grid container justifyContent="center">
          <Typography variant="h4">LOG IN</Typography>
        </Grid>

        {state.serverError ? (
          <Alert severity="error">Incorrect username or password!</Alert>
        ) : (
          ""
        )}

        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="username"
            label="User name"
            variant="outlined"
            fullWidth
            value={state.usernameValue}
            onChange={(event) =>
              dispatch({
                type: "updateUsername",
                updatedUsername: event.target.value,
              })
            }
            error={state.serverError ? true : false}
          />
        </Grid>
        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={state.passwordValue}
            onChange={(event) =>
              dispatch({
                type: "updatePassword",
                updatedPassword: event.target.value,
              })
            }
            error={state.serverError ? true : false}
            type="password"
          />
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
            disabled={state.disabledBtn}
          >
            Log in
          </Button>
        </Grid>
        <Grid container justifyContent="center" style={{ marginTop: "1rem" }}>
          <Typography variant="small">
            Don't have an account yet?{" "}
            <span
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => navigate("/register")}
            >
              SIGN UP{" "}
            </span>
            here
          </Typography>
        </Grid>
      </form>
      <Snackbar
        open={state.openSnack}
        message="You have successfully logged in"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default Login;
