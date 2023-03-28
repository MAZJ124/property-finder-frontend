import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useImmerReducer } from "use-immer";
import { useEffect } from "react";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Listings from "./Components/Listings";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import Agencies from "./Components/Agencies";
import AgencyDetail from "./Components/AgencyDetail";
import ListingDetail from "./Components/ListingDetail";

import Header from "./Components/Header";
import AddProperty from "./Components/AddProperty";

import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";

function App() {
  const initialState = {
    userUsername: localStorage.getItem("userUsername"),
    userEmail: localStorage.getItem("userEmail"),
    userId: localStorage.getItem("userId"),
    userToken: localStorage.getItem("userToken"),
    userLoggedIn: localStorage.getItem("userUsername") ? true : false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "getToken":
        draft.userToken = action.tokenValue;
        break;
      case "userLogsIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.idInfo;
        draft.userLoggedIn = true;
        break;
      case "userLogsOut":
        draft.userLoggedIn = false;
        break;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);

  useEffect(() => {
    if (state.userLoggedIn) {
      localStorage.setItem("userUsername", state.userUsername);
      localStorage.setItem("userEmail", state.userEmail);
      localStorage.setItem("userId", state.userId);
      localStorage.setItem("userToken", state.userToken);
    } else {
      localStorage.removeItem("userUsername");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userToken");
    }
  }, [state.userLoggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <CssBaseline></CssBaseline>
          <Header></Header>
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/login" element={<Login></Login>} />
            <Route path="/listings" element={<Listings></Listings>} />
            <Route path="/addproperty" element={<AddProperty></AddProperty>} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/profile" element={<Profile></Profile>} />
            <Route path="/agencies" element={<Agencies></Agencies>} />
            <Route
              path="/agencies/:id"
              element={<AgencyDetail></AgencyDetail>}
            />
            <Route
              path="/listings/:id"
              element={<ListingDetail></ListingDetail>}
            />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
