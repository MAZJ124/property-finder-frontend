import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import {
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

const useStyles = makeStyles({
  formContainer: {
    width: "50%",
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
});

function Register() {
  const classes = useStyles();
  const navigate = useNavigate();

  const initialState = {
    usernameValue: "",
    emailValue: "",
    passwordValue: "",
    repasswordValue: "",
    openSnack: false,
    disabledBtn: false,
    sendRequest: false,
    usernameError: {
      hasError: false,
      errorMessage: "",
    },
    emailError: {
      hasError: false,
      errorMessage: "",
    },
    passwordError: {
      hasError: false,
      errorMessage: "",
    },
    repasswordHelperText: "",
    serverMessageUsername: "",
    serverMessageEmail: "",
    serverMessagePassword: "",
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "updateUsername":
        draft.usernameValue = action.updatedUsername;
        draft.usernameError.hasError = false;
        draft.usernameError.errorMessage = "";
        draft.serverMessageUsername = "";
        break;

      case "updateEmail":
        draft.emailValue = action.updatedEmail;
        draft.emailError.hasError = false;
        draft.emailError.errorMessage = "";
        draft.serverMessageEmail = "";
        break;

      case "updatePassword":
        draft.passwordValue = action.updatedPassword;
        draft.passwordError.hasError = false;
        draft.passwordError.errorMessage = "";
        draft.serverMessagePassword = "";
        break;

      case "updateRepassword":
        draft.repasswordValue = action.updatedRepassword;
        draft.repasswordHelperText =
          action.updatedRepassword !== draft.passwordValue
            ? "You need to type in the SAME password"
            : "";
        draft.serverMessagePassword = "";
        break;

      case "updateSendRequest":
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

      case "catchUsernameError":
        if (action.usernameChosen.length === 0) {
          draft.usernameError.hasError = true;
          draft.usernameError.errorMessage = "Your username cannot be empty";
        } else if (action.usernameChosen.length < 5) {
          draft.usernameError.hasError = true;
          draft.usernameError.errorMessage =
            "Your username must have at least 5 characters";
        } else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
          draft.usernameError.hasError = true;
          draft.usernameError.errorMessage =
            "Your username should not contain any special characters";
        }
        break;

      case "catchEmailError":
        if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            action.emailChosen
          )
        ) {
          draft.emailError.hasError = true;
          draft.emailError.errorMessage = "Invalid email address";
        }
        break;

      case "catchPasswordError":
        if (action.passwordChosen.length < 8) {
          draft.passwordError.hasError = true;
          draft.passwordError.errorMessage =
            "Your password should have at least 8 characters";
        }
        break;

      case "usernameExists":
        draft.serverMessageUsername = "This username already exists";
        break;

      case "emailExists":
        draft.serverMessageEmail = "This email already exists";
        break;

      case "serverErrorPassword":
        draft.serverMessagePassword = action.serverMessage;
        break;

      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  function submitForm(e) {
    e.preventDefault();
    if (
      !state.usernameError.hasError &&
      !state.emailError.hasError &&
      !state.passwordError.haserror &&
      state.repasswordHelperText === ""
    ) {
      dispatch({ type: "updateSendRequest" });
      console.log("form submitted");
      dispatch({ type: "disabledTheButton" });
    }
  }

  useEffect(() => {
    if (state.sendRequest) {
      // used to process cancelling request befroe request is done (ie. due to lag)
      const source = Axios.CancelToken.source();
      async function SignUp() {
        try {
          const url = "http://localhost:8000/api-auth-djoser/users/";
          const data = {
            username: state.usernameValue,
            email: state.emailValue,
            password: state.passwordValue,
            re_password: state.repasswordValue,
          };
          const response = await Axios.post(url, data, {
            cancelToken: source.token,
          });
          dispatch({ type: "openTheSnack" });
          console.log(response);
        } catch (e) {
          console.log(e.response.data);
          dispatch({ type: "allowedTheButton" });
          if (e.response.data.username) {
            dispatch({ type: "usernameExists" });
          }
          if (e.response.data.email) {
            dispatch({ type: "emailExists" });
          }
          if (e.response.data.password[0]) {
            dispatch({
              type: "serverErrorPassword",
              serverMessage: e.response.data.password[0],
            });
          }
        }
      }
      SignUp();
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

  return (
    <div className={classes.formContainer}>
      <form onSubmit={submitForm}>
        <Grid container justifyContent="center">
          <Typography variant="h4">CREATE AN ACCOUNT</Typography>
        </Grid>

        {state.serverMessageUsername ? (
          <Alert severity="error">{state.serverMessageUsername}</Alert>
        ) : (
          ""
        )}
        {state.serverMessageEmail ? (
          <Alert severity="error">{state.serverMessageEmail}</Alert>
        ) : (
          ""
        )}
        {state.serverMessagePassword ? (
          <Alert severity="error">{state.serverMessagePassword}</Alert>
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
            onBlur={(event) =>
              dispatch({
                type: "catchUsernameError",
                usernameChosen: event.target.value,
              })
            }
            error={state.usernameError.hasError ? true : false}
            helperText={state.usernameError.errorMessage}
          />
        </Grid>
        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={state.emailValue}
            onChange={(event) =>
              dispatch({
                type: "updateEmail",
                updatedEmail: event.target.value,
              })
            }
            onBlur={(event) =>
              dispatch({
                type: "catchEmailError",
                emailChosen: event.target.value,
              })
            }
            error={state.emailError.hasError ? true : false}
            helperText={state.emailError.errorMessage}
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
            type="password"
            onBlur={(event) =>
              dispatch({
                type: "catchPasswordError",
                passwordChosen: event.target.value,
              })
            }
            error={state.passwordError.hasError ? true : false}
            helperText={state.passwordError.errorMessage}
          />
        </Grid>
        <Grid container style={{ marginTop: "1rem" }}>
          <TextField
            id="password2"
            label="Confirm password"
            variant="outlined"
            fullWidth
            value={state.repasswordValue}
            onChange={(event) =>
              dispatch({
                type: "updateRepassword",
                updatedRepassword: event.target.value,
              })
            }
            helperText={state.repasswordHelperText}
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
            className={classes.registerBtn}
          >
            Register
          </Button>
        </Grid>
        <Grid container justifyContent="center" style={{ marginTop: "1rem" }}>
          <Typography variant="small">
            Already have an account?{" "}
            <span
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => navigate("/login")}
            >
              SIGN IN
            </span>{" "}
            here
          </Typography>
        </Grid>
      </form>
      <Snackbar
        open={state.openSnack}
        message="You have successfully signed up"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default Register;
