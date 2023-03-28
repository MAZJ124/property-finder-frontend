import React from "react";
import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";
import { makeStyles } from "@mui/styles";
import Axios from "axios";

const useStyles = makeStyles({
  logInBtn: {
    backgroundColor: "red",
    color: "white",
    width: "15rem",
    fontSize: "1.1rem",
    marginLeft: "1rem",
  },
  addPropertyBtn: {
    backgroundColor: "white",
    color: "black",
    width: "15rem",
    fontSize: "1.1rem",
    marginRight: "1rem",
  },
  profileBtn: {
    color: "black",
    backgroundColor: "green",
    width: "15rem",
    fontWeight: "bolder",
    borderRadius: "15px",
  },
  logoutBtn: {
    color: "black",
    backgroundColor: "red",
    width: "15rem",
    fontWeight: "bolder",
    borderRadius: "15px",
  },
});

function Header() {
  const navigate = useNavigate();
  const classes = useStyles();
  const globalState = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);

  const [openSnack, setOpenSnack] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function HandleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        const url = "http://localhost:8000/api-auth-djoser/token/logout/";
        const response = await Axios.post(url, globalState.userToken, {
          headers: { Authorization: "Token ".concat(globalState.userToken) },
        });
        console.log(response);
        globalDispatch({ type: "userLogsOut" });
        setOpenSnack(true);
        setDisabledBtn(true);
      } catch (e) {
        console.log(e.response);
        setDisabledBtn(false);
      }
    }
  }

  useEffect(() => {
    if (openSnack) {
      setTimeout(() => {
        navigate("/");
        setOpenSnack(false);
      }, 1500);
    }
  }, [openSnack]);

  function HandleProfile() {
    setAnchorEl(null);
    navigate("/profile");
  }

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "black" }}>
        <Toolbar>
          <div style={{ marginRight: "auto" }}>
            <Button color="inherit" onClick={() => navigate("/")}>
              <Typography variant="h4">Property Finder</Typography>
            </Button>
          </div>
          <div>
            <Button color="inherit" onClick={() => navigate("/listings")}>
              <Typography>Listings</Typography>
            </Button>
            <Button color="inherit" onClick={() => navigate("/agencies")}>
              <Typography>Agencies</Typography>
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              style={{
                backgroundColor: "white",
                color: "black",
                width: "15rem",
                fontSize: "1.1rem",
                marginRight: "1rem",
              }}
              onClick={() => navigate("/addproperty")}
            >
              <Typography>Add property</Typography>
            </Button>
            {!globalState.userLoggedIn ? (
              <Button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  width: "15rem",
                  fontSize: "1.1rem",
                  marginLeft: "1rem",
                }}
              >
                <Typography>Log in</Typography>
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  width: "15rem",
                  fontSize: "1.1rem",
                  marginRight: "1rem",
                }}
                onClick={handleClick}
              >
                <Typography>{globalState.userUsername}</Typography>
              </Button>
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem className={classes.profileBtn} onClick={HandleProfile}>
                Profile
              </MenuItem>
              <MenuItem className={classes.logoutBtn} onClick={HandleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={openSnack}
        message="You have successfully logged out"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default Header;
