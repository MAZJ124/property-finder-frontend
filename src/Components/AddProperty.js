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
  Alert,
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

import Camden from "./Assets/Boroughs/Camden";
import Greenwich from "./Assets/Boroughs/Greenwich";
import Hackney from "./Assets/Boroughs/Hackney";
import Hammersmith from "./Assets/Boroughs/Hammersmith";
import Islington from "./Assets/Boroughs/Islington";
import Kensington from "./Assets/Boroughs/Kensington";
import Lambeth from "./Assets/Boroughs/Lambeth";
import Lewisham from "./Assets/Boroughs/Lewisham";
import Southwark from "./Assets/Boroughs/Southwark";
import Hamlets from "./Assets/Boroughs/Hamlets";
import Wandsworth from "./Assets/Boroughs/Wandsworth";
import Westminster from "./Assets/Boroughs/Westminster";
import City_of_London from "./Assets/Boroughs/City_of_London";
import Barking from "./Assets/Boroughs/Barking";
import Barnet from "./Assets/Boroughs/Barnet";
import Bexley from "./Assets/Boroughs/Bexley";
import Brent from "./Assets/Boroughs/Brent";
import Bromley from "./Assets/Boroughs/Bromley";
import Croydon from "./Assets/Boroughs/Croydon";
import Ealing from "./Assets/Boroughs/Ealing";
import Enfield from "./Assets/Boroughs/Enfield";
import Haringey from "./Assets/Boroughs/Haringey";
import Harrow from "./Assets/Boroughs/Harrow";
import Havering from "./Assets/Boroughs/Havering";
import Hillingdon from "./Assets/Boroughs/Hillingdon";
import Hounslow from "./Assets/Boroughs/Hounslow";
import Kingston from "./Assets/Boroughs/Kingston";
import Merton from "./Assets/Boroughs/Merton";
import Newham from "./Assets/Boroughs/Newham";
import Redbridge from "./Assets/Boroughs/Redbridge";
import Richmond from "./Assets/Boroughs/Richmond";
import Sutton from "./Assets/Boroughs/Sutton";
import Waltham from "./Assets/Boroughs/Waltham";
import { FamilyRestroomRounded } from "@mui/icons-material";

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

const areaOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Inner London",
    label: "Inner London",
  },
  {
    value: "Outer London",
    label: "Outer London",
  },
];

const innerLondonOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Camden",
    label: "Camden",
  },
  {
    value: "Greenwich",
    label: "Greenwich",
  },
  {
    value: "Hackney",
    label: "Hackney",
  },
  {
    value: "Hammersmith and Fulham",
    label: "Hammersmith and Fulham",
  },
  {
    value: "Islington",
    label: "Islington",
  },
  {
    value: "Kensington and Chelsea",
    label: "Kensington and Chelsea",
  },
  {
    value: "Lambeth",
    label: "Lambeth",
  },
  {
    value: "Lewisham",
    label: "Lewisham",
  },
  {
    value: "Southwark",
    label: "Southwark",
  },
  {
    value: "Tower Hamlets",
    label: "Tower Hamlets",
  },
  {
    value: "Wandsworth",
    label: "Wandsworth",
  },
  {
    value: "Westminster",
    label: "Westminster",
  },
  {
    value: "City of London",
    label: "City of London",
  },
];

const outerLondonOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Barking and Dangenham",
    label: "Barking and Dangenham",
  },
  {
    value: "Barnet",
    label: "Barnet",
  },
  {
    value: "Bexley",
    label: "Bexley",
  },
  {
    value: "Brent",
    label: "Brent",
  },
  {
    value: "Bromley",
    label: "Bromley",
  },
  {
    value: "Croydon",
    label: "Croydon",
  },
  {
    value: "Ealing",
    label: "Ealing",
  },
  {
    value: "Enfield",
    label: "Enfield",
  },
  {
    value: "Haringey",
    label: "Haringey",
  },
  {
    value: "Harrow",
    label: "Harrow",
  },
  {
    value: "Havering",
    label: "Havering",
  },
  {
    value: "Hillingdon",
    label: "Hillingdon",
  },
  {
    value: "Hounslow",
    label: "Hounslow",
  },
  {
    value: "Kingston upon Thames",
    label: "Kingston upon Thames",
  },
  {
    value: "Merton",
    label: "Merton",
  },
  {
    value: "Newham",
    label: "Newham",
  },
  {
    value: "Redbridge",
    label: "Redbridge",
  },
  {
    value: "Richmond upon Thames",
    label: "Richmond upon Thames",
  },
  {
    value: "Sutton",
    label: "Sutton",
  },
  {
    value: "Waltham Forest",
    label: "Waltham Forest",
  },
];

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

function AddProperty() {
  const classes = useStyles();
  const navigate = useNavigate();

  const initialState = {
    titleValue: "",
    listingTypeValue: "",
    descriptionValue: "",
    areaValue: "",
    boroughValue: "",
    latitudeValue: "",
    longitudeValue: "",
    propertyStatusValue: "",
    priceValue: "",
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    cctvValue: false,
    parkingValue: false,
    elavatorValue: false,
    picture1Value: "",
    picture2Value: "",
    picture3Value: "",
    picture4Value: "",
    picture5Value: "",
    mapInstance: null,
    markerPosition: {
      lat: "51.505",
      lng: "-0.09",
    },
    uploadedPictures: [],
    sendRequest: 0,
    userProfile: {
      agencyName: "",
      phoneNumber: "",
    },
    openSnack: false,
    disabledBtn: false,
    titleError: {
      hasError: false,
      errorMessage: "",
    },
    listingTypeError: {
      hasError: false,
      errorMessage: "",
    },
    propertyStatusError: {
      hasError: false,
      errorMessage: "",
    },
    priceError: {
      hasError: false,
      errorMessage: "",
    },
    areaError: {
      hasError: false,
      errorMessage: "",
    },
    boroughError: {
      hasError: false,
      errorMessage: "",
    },
    missingRequiredFieldWhenSubmit: false,
  };

  function reducerFunction(draft, action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.titleChosen;
        draft.titleError.hasError = false;
        draft.titleError.errorMessage = "";
        draft.missingRequiredFieldWhenSubmit = false;
        break;

      case "catchListingTypeChange":
        draft.listingTypeValue = action.listingTypeChosen;
        draft.listingTypeError.hasError = false;
        draft.listingTypeError.errorMessage = "";
        draft.missingRequiredFieldWhenSubmit = false;
        break;

      case "catchDescriptionChange":
        draft.descriptionValue = action.descriptionChosen;
        break;

      case "catchAreaChange":
        draft.areaValue = action.areaChosen;
        draft.areaError.hasError = false;
        draft.areaError.errorMessage = "";
        draft.missingRequiredFieldWhenSubmit = false;
        break;

      case "catchBoroughChange":
        draft.boroughValue = action.boroughChosen;
        draft.boroughError.hasError = false;
        draft.boroughError.errorMessage = "";
        draft.missingRequiredFieldWhenSubmit = false;
        break;

      case "catchLatitudeChange":
        draft.latitudeValue = action.latitudeChosen;
        break;

      case "catchLongitudeChange":
        draft.longitudeValue = action.longitudeChosen;
        break;

      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.propertyStatusChosen;
        draft.propertyStatusError.hasError = false;
        draft.propertyStatusError.errorMessage = "";
        draft.missingRequiredFieldWhenSubmit = false;
        break;

      case "catchPriceChange":
        draft.priceValue = action.priceChosen;
        draft.priceError.hasError = false;
        draft.priceError.errorMessage = "";
        draft.missingRequiredFieldWhenSubmit = false;
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

      case "catchElavatorChange":
        draft.elavatorValue = action.elavatorChosen;
        break;

      case "catchCctvChange":
        draft.cctvValue = action.cctvChosen;
        break;

      case "catchParkingChange":
        draft.parkingValue = action.parkingChosen;
        break;

      case "catchPicture1Change":
        draft.picture1Value = action.picture1Chosen;
        break;

      case "catchPicture2Change":
        draft.picture2Value = action.picture2Chosen;
        break;

      case "catchPicture3Change":
        draft.picture3Value = action.picture3Chosen;
        break;

      case "catchPicture4Change":
        draft.picture4Value = action.picture4Chosen;
        break;

      case "catchPicture5Change":
        draft.picture5Value = action.picture5Chosen;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;

      case "getMap":
        draft.mapInstance = action.mapData;
        break;

      // Used when changing map view to another borough
      case "changeMarkerPosition":
        draft.mapInstance.setView(
          [action.changeLatitude, action.changeLongitude],
          12
        );
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = "";
        draft.longitudeValue = "";
        break;

      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
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

      case "catchTitleError":
        if (action.titleChosen.length === 0) {
          draft.titleError.hasError = true;
          draft.titleError.errorMessage = "This field must not be empty";
        }
        break;

      case "catchListingTypeError":
        if (action.listingTypeChosen.length === 0) {
          draft.listingTypeError.hasError = true;
          draft.listingTypeError.errorMessage = "This field must not be empty";
        }
        break;

      case "catchPropertyStatusError":
        if (action.propertyStatusChosen.length === 0) {
          draft.propertyStatusError.hasError = true;
          draft.propertyStatusError.errorMessage =
            "This field must not be empty";
        }
        break;

      case "catchPriceError":
        if (action.priceChosen.length === 0) {
          draft.priceError.hasError = true;
          draft.priceError.errorMessage = "This field must not be empty";
        }
        break;

      case "catchAreaError":
        if (action.areaChosen.length === 0) {
          draft.areaError.hasError = true;
          draft.areaError.errorMessage = "This field must not be empty";
        }
        break;

      case "catchBoroughError":
        if (action.boroughChosen.length === 0) {
          draft.boroughError.hasError = true;
          draft.boroughError.errorMessage = "This field must not be empty";
        }
        break;

      case "submitWithMissingFields":
        draft.missingRequiredFieldWhenSubmit = true;
        break;

      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducerFunction, initialState);
  const globalState = useContext(StateContext);

  useEffect(() => {
    if (state.boroughValue === "Camden") {
      state.mapInstance.setView([51.54103467179952, -0.14870897037846917], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.54103467179952,
        changeLongitude: -0.14870897037846917,
      });
    } else if (state.boroughValue === "Greenwich") {
      state.mapInstance.setView([51.486316313935134, 0.005925763550159742], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.486316313935134,
        changeLongitude: 0.005925763550159742,
      });
    } else if (state.boroughValue === "Hackney") {
      state.mapInstance.setView([51.55421119118178, -0.061054618357071246], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.55421119118178,
        changeLongitude: -0.061054618357071246,
      });
    } else if (state.boroughValue === "Hammersmith and Fulham") {
      state.mapInstance.setView([51.496961673854216, -0.22495912738555046], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.496961673854216,
        changeLongitude: -0.22495912738555046,
      });
    } else if (state.boroughValue === "Islington") {
      state.mapInstance.setView([51.54974373783584, -0.10746608414711818], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.54974373783584,
        changeLongitude: -0.10746608414711818,
      });
    } else if (state.boroughValue === "Kensington and Chelsea") {
      state.mapInstance.setView([51.49779579272461, -0.1908227388030137], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.49779579272461,
        changeLongitude: -0.1908227388030137,
      });
    } else if (state.boroughValue === "Lambeth") {
      state.mapInstance.setView([51.457598293463874, -0.12030697867735651], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.457598293463874,
        changeLongitude: -0.12030697867735651,
      });
    } else if (state.boroughValue === "Lewisham") {
      state.mapInstance.setView([51.45263474786279, -0.017657579903930083], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.45263474786279,
        changeLongitude: -0.017657579903930083,
      });
    } else if (state.boroughValue === "Southwark") {
      state.mapInstance.setView([51.47281414549159, -0.07657080658293915], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.47281414549159,
        changeLongitude: -0.07657080658293915,
      });
    } else if (state.boroughValue === "Tower Hamlets") {
      state.mapInstance.setView([51.52222760075287, -0.03427379217816716], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.52222760075287,
        changeLongitude: -0.03427379217816716,
      });
    } else if (state.boroughValue === "Wandsworth") {
      state.mapInstance.setView([51.45221859319854, -0.1910578642162312], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.45221859319854,
        changeLongitude: -0.1910578642162312,
      });
    } else if (state.boroughValue === "Westminster") {
      state.mapInstance.setView([51.51424692365236, -0.1557886924596714], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.51424692365236,
        changeLongitude: -0.1557886924596714,
      });
    } else if (state.boroughValue === "City of London") {
      state.mapInstance.setView([51.51464652712437, -0.09207257068971077], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.51464652712437,
        changeLongitude: -0.09207257068971077,
      });
    } else if (state.boroughValue === "Barking and Dangenham") {
      state.mapInstance.setView([51.54475354441844, 0.13730036835406337], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.54475354441844,
        changeLongitude: 0.13730036835406337,
      });
    } else if (state.boroughValue === "Barnet") {
      state.mapInstance.setView([51.61505810569654, -0.20104146847921367], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.61505810569654,
        changeLongitude: -0.20104146847921367,
      });
    } else if (state.boroughValue === "Bexley") {
      state.mapInstance.setView([51.45784336604241, 0.1386755093498764], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.45784336604241,
        changeLongitude: 0.1386755093498764,
      });
    } else if (state.boroughValue === "Brent") {
      state.mapInstance.setView([51.55847917911348, -0.2623697479848262], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.55847917911348,
        changeLongitude: -0.2623697479848262,
      });
    } else if (state.boroughValue === "Bromley") {
      state.mapInstance.setView([51.37998089785619, 0.056091833685512606], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.37998089785619,
        changeLongitude: 0.056091833685512606,
      });
    } else if (state.boroughValue === "Croydon") {
      state.mapInstance.setView([51.36613815034951, -0.08597242883896719], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.36613815034951,
        changeLongitude: -0.08597242883896719,
      });
    } else if (state.boroughValue === "Ealing") {
      state.mapInstance.setView([51.52350664933499, -0.33384540332179463], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.52350664933499,
        changeLongitude: -0.33384540332179463,
      });
    } else if (state.boroughValue === "Enfield") {
      state.mapInstance.setView([51.650718869158275, -0.07999628038008409], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.650718869158275,
        changeLongitude: -0.07999628038008409,
      });
    } else if (state.boroughValue === "Haringey") {
      state.mapInstance.setView([51.591214467057085, -0.10319530898095737], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.591214467057085,
        changeLongitude: -0.10319530898095737,
      });
    } else if (state.boroughValue === "Harrow") {
      state.mapInstance.setView([51.60218606442213, -0.33540294600548437], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.60218606442213,
        changeLongitude: -0.33540294600548437,
      });
    } else if (state.boroughValue === "Havering") {
      state.mapInstance.setView([51.57230623503768, 0.2256095005492423], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.57230623503768,
        changeLongitude: 0.2256095005492423,
      });
    } else if (state.boroughValue === "Hillingdon") {
      state.mapInstance.setView([51.5430033964411, -0.4435905982156584], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.5430033964411,
        changeLongitude: -0.4435905982156584,
      });
    } else if (state.boroughValue === "Hounslow") {
      state.mapInstance.setView([51.475988836438525, -0.3660060903075389], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.475988836438525,
        changeLongitude: -0.3660060903075389,
      });
    } else if (state.boroughValue === "Kingston upon Thames") {
      state.mapInstance.setView([51.39401320084246, -0.2841003136670212], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.39401320084246,
        changeLongitude: -0.2841003136670212,
      });
    } else if (state.boroughValue === "Merton") {
      state.mapInstance.setView([51.41148120353897, -0.18805584151013174], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.41148120353897,
        changeLongitude: -0.18805584151013174,
      });
    } else if (state.boroughValue === "Newham") {
      state.mapInstance.setView([51.533282275935306, 0.031692014878610064], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.533282275935306,
        changeLongitude: 0.031692014878610064,
      });
    } else if (state.boroughValue === "Redbridge") {
      state.mapInstance.setView([51.585885574074965, 0.07764760021283491], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.585885574074965,
        changeLongitude: 0.07764760021283491,
      });
    } else if (state.boroughValue === "Richmond upon Thames") {
      state.mapInstance.setView([51.450368976651696, -0.30801386088548505], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.450368976651696,
        changeLongitude: -0.30801386088548505,
      });
    } else if (state.boroughValue === "Sutton") {
      state.mapInstance.setView([51.363672040828504, -0.1702200806863363], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.363672040828504,
        changeLongitude: -0.1702200806863363,
      });
    } else if (state.boroughValue === "Waltham Forest") {
      state.mapInstance.setView([51.59466635701797, -0.012215840493378892], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.59466635701797,
        changeLongitude: -0.012215840493378892,
      });
    }
  }, [state.boroughValue]);

  // Display borough in polygon
  function BoroughDisplay() {
    if (state.boroughValue === "Camden") {
      return <Polygon positions={Camden} />;
    } else if (state.boroughValue === "Greenwich") {
      return <Polygon positions={Greenwich} />;
    } else if (state.boroughValue === "Hackney") {
      return <Polygon positions={Hackney} />;
    } else if (state.boroughValue === "Hammersmith and Fulham") {
      return <Polygon positions={Hammersmith} />;
    } else if (state.boroughValue === "Islington") {
      return <Polygon positions={Islington} />;
    } else if (state.boroughValue === "Kensington and Chelsea") {
      return <Polygon positions={Kensington} />;
    } else if (state.boroughValue === "Lambeth") {
      return <Polygon positions={Lambeth} />;
    } else if (state.boroughValue === "Lewisham") {
      return <Polygon positions={Lewisham} />;
    } else if (state.boroughValue === "Southwark") {
      return <Polygon positions={Southwark} />;
    } else if (state.boroughValue === "Tower Hamlets") {
      return <Polygon positions={Hamlets} />;
    } else if (state.boroughValue === "Wandsworth") {
      return <Polygon positions={Wandsworth} />;
    } else if (state.boroughValue === "Westminster") {
      return <Polygon positions={Westminster} />;
    } else if (state.boroughValue === "City of London") {
      return <Polygon positions={City_of_London} />;
    } else if (state.boroughValue === "Barking and Dangenham") {
      return <Polygon positions={Barking} />;
    } else if (state.boroughValue === "Barnet") {
      return <Polygon positions={Barnet} />;
    } else if (state.boroughValue === "Bexley") {
      return <Polygon positions={Bexley} />;
    } else if (state.boroughValue === "Brent") {
      return <Polygon positions={Brent} />;
    } else if (state.boroughValue === "Bromley") {
      return <Polygon positions={Bromley} />;
    } else if (state.boroughValue === "Croydon") {
      return <Polygon positions={Croydon} />;
    } else if (state.boroughValue === "Ealing") {
      return <Polygon positions={Ealing} />;
    } else if (state.boroughValue === "Enfield") {
      return <Polygon positions={Enfield} />;
    } else if (state.boroughValue === "Haringey") {
      return <Polygon positions={Haringey} />;
    } else if (state.boroughValue === "Harrow") {
      return <Polygon positions={Harrow} />;
    } else if (state.boroughValue === "Havering") {
      return <Polygon positions={Havering} />;
    } else if (state.boroughValue === "Hillingdon") {
      return <Polygon positions={Hillingdon} />;
    } else if (state.boroughValue === "Hounslow") {
      return <Polygon positions={Hounslow} />;
    } else if (state.boroughValue === "Kingston upon Thames") {
      return <Polygon positions={Kingston} />;
    } else if (state.boroughValue === "Merton") {
      return <Polygon positions={Merton} />;
    } else if (state.boroughValue === "Newham") {
      return <Polygon positions={Newham} />;
    } else if (state.boroughValue === "Redbridge") {
      return <Polygon positions={Redbridge} />;
    } else if (state.boroughValue === "Richmond upon Thames") {
      return <Polygon positions={Richmond} />;
    } else if (state.boroughValue === "Sutton") {
      return <Polygon positions={Sutton} />;
    } else if (state.boroughValue === "Waltham Forest") {
      return <Polygon positions={Waltham} />;
    }
  }

  // Allocate images from array to individual picture fields
  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: "catchPicture1Change",
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: "catchPicture2Change",
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: "catchPicture3Change",
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: "catchPicture4Change",
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: "catchPicture5Change",
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

  // Check whether creating user has a profile
  useEffect(() => {
    async function getProfileInfo() {
      try {
        const url = `http://localhost:8000/api/profiles/${globalState.userId}/`;
        const response = await Axios.get(url);
        console.log(response);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    getProfileInfo();
  }, []);

  function submitForm(e) {
    e.preventDefault();

    if (
      !state.titleError.hasError &&
      !state.listingTypeError.hasError &&
      !state.propertyStatusError.hasError &&
      !state.priceError.hasError &&
      !state.areaError.hasError &&
      !state.boroughError.hasError
    ) {
      dispatch({ type: "changeSendRequest" });
      // Hot fix: add useEffect code into submitForm since dispatch does not change value of sendRequest
      async function addProperty() {
        const url = "http://localhost:8000/api/listings/create/";
        const data = new FormData();
        data.append("title", state.titleValue);
        data.append("description", state.descriptionValue);
        data.append("area", state.areaValue);
        data.append("borough", state.boroughValue);
        data.append("listing_type", state.listingTypeValue);
        data.append("property_status", state.propertyStatusValue);
        data.append("price", state.priceValue);
        data.append("rental_frequency", state.rentalFrequencyValue);
        data.append("rooms", state.roomsValue);
        data.append("furnished", state.furnishedValue);
        data.append("pool", state.poolValue);
        data.append("elavator", state.elavatorValue);
        data.append("cctv", state.cctvValue);
        data.append("parking", state.parkingValue);
        data.append("latitude", state.latitudeValue);
        data.append("longitude", state.longitudeValue);
        data.append("picture1", state.picture1Value);
        data.append("picture2", state.picture2Value);
        data.append("picture3", state.picture3Value);
        data.append("picture4", state.picture4Value);
        data.append("picture5", state.picture5Value);
        data.append("seller", globalState.userId);
        console.log(data);
        try {
          const response = await Axios.post(url, data);
          console.log(response);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          console.log(e.response);
          dispatch({ type: "allowedTheButton" });
        }
      }
      addProperty();
      console.log("form submitted");
      dispatch({ type: "disabledTheButton" });
    }
    if (
      state.titleValue === "" ||
      state.listingTypeValue === "" ||
      state.propertyStatusValue === "" ||
      state.priceValue === "" ||
      state.areaValue === "" ||
      state.boroughValue === ""
    ) {
      dispatch({ type: "submitWithMissingFields" });
    }
  }

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

  useEffect(() => {
    if (state.sendRequest) {
      async function addProperty() {
        const url = "http://localhost:8000/api/listings/create/";
        const data = new FormData();
        data.append("title", state.titleValue);
        data.append("description", state.descriptionValue);
        data.append("area", state.areaValue);
        data.append("borough", state.boroughValue);
        data.append("listing_type", state.listingTypeValue);
        data.append("property_status", state.propertyStatusValue);
        data.append("price", state.priceValue);
        data.append("rental_frequency", state.rentalFrequencyValue);
        data.append("rooms", state.roomsValue);
        data.append("furnished", state.furnishedValue);
        data.append("pool", state.poolValue);
        data.append("elavator", state.elavatorValue);
        data.append("cctv", state.cctvValue);
        data.append("parking", state.parkingValue);
        data.append("latitude", state.latitudeValue);
        data.append("longitude", state.longitudeValue);
        data.append("picture1", state.picture1Value);
        data.append("picture2", state.picture2Value);
        data.append("picture3", state.picture3Value);
        data.append("picture4", state.picture4Value);
        data.append("picture5", state.picture5Value);
        data.append("seller", globalState.userId);
        console.log(data);
        try {
          const response = await Axios.post(url, data);
          console.log(response);
        } catch (e) {
          console.log(e.response);
        }
      }
      addProperty();
    }
  }, [state.sendRequest]);

  // useEffect(() => {
  //   console.log(state.sendRequest);
  // });

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: "getMap", mapData: map });
    return null;
  }

  // Draggable marker for user to input position
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: "catchLatitudeChange",
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: "catchLongitudeChange",
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

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

  function submitButtonDisplay() {
    if (
      globalState.userLoggedIn &&
      state.userProfile.agencyName !== null &&
      state.userProfile.agencyName !== "" &&
      state.userProfile.phoneNumber !== null &&
      state.userProfile.phoneNumber !== ""
    ) {
      return (
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
            SUBMIT
          </Button>
        </Grid>
      );
    } else if (
      globalState.userLoggedIn &&
      (state.userProfile.agencyName === null ||
        state.userProfile.agencyName === "" ||
        state.userProfile.phoneNumber === null ||
        state.userProfile.phoneNumber === "")
    ) {
      return (
        <Grid
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="outlined"
            fullWidth
            type="submit"
            className={classes.registerBtn}
          >
            COMPLETE PROFILE TO SUBMIT PROPERTY
          </Button>
        </Grid>
      );
    } else if (!globalState.userLoggedIn) {
      return (
        <Grid
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="outlined"
            fullWidth
            type="submit"
            onClick={() => navigate("/login")}
            className={classes.registerBtn}
          >
            LOG IN TO ADD PROPERTY
          </Button>
        </Grid>
      );
    }
  }

  return (
    <div className={classes.formContainer}>
      <form onSubmit={submitForm}>
        <Grid container justifyContent="center">
          <Typography variant="h4">UPLOAD A PROPERTY</Typography>
        </Grid>

        {state.missingRequiredFieldWhenSubmit ? (
          <Alert severity="error">
            You have not filled up all required fields yet!
          </Alert>
        ) : (
          ""
        )}

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
            onBlur={(event) =>
              dispatch({
                type: "catchTitleError",
                titleChosen: event.target.value,
              })
            }
            error={state.titleError.hasError ? true : false}
            helperText={state.titleError.errorMessage}
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
              onBlur={(event) =>
                dispatch({
                  type: "catchListingTypeError",
                  listingTypeChosen: event.target.value,
                })
              }
              error={state.listingTypeError.hasError ? true : false}
              helperText={state.listingTypeError.errorMessage}
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
              onBlur={(event) =>
                dispatch({
                  type: "catchPropertyStatusError",
                  propertyStatusChosen: event.target.value,
                })
              }
              error={state.propertyStatusError.hasError ? true : false}
              helperText={state.propertyStatusError.errorMessage}
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
              onBlur={(event) =>
                dispatch({
                  type: "catchPriceError",
                  priceChosen: event.target.value,
                })
              }
              error={state.priceError.hasError ? true : false}
              helperText={state.priceError.errorMessage}
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

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="area"
              label="Area"
              variant="standard"
              fullWidth
              value={state.areaValue}
              onChange={(event) =>
                dispatch({
                  type: "catchAreaChange",
                  areaChosen: event.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
              onBlur={(event) =>
                dispatch({
                  type: "catchAreaError",
                  areaChosen: event.target.value,
                })
              }
              error={state.areaError.hasError ? true : false}
              helperText={state.areaError.errorMessage}
            >
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="borough"
              label="Borough"
              variant="standard"
              fullWidth
              value={state.boroughValue}
              onChange={(event) =>
                dispatch({
                  type: "catchBoroughChange",
                  boroughChosen: event.target.value,
                })
              }
              select
              SelectProps={{ native: true }}
              onBlur={(event) =>
                dispatch({
                  type: "catchBoroughError",
                  boroughChosen: event.target.value,
                })
              }
              error={state.boroughError.hasError ? true : false}
              helperText={state.boroughError.errorMessage}
            >
              {state.areaValue === "Inner London"
                ? innerLondonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : ""}
              {state.areaValue === "Outer London"
                ? outerLondonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : ""}
            </TextField>
          </Grid>
        </Grid>

        <Grid item style={{ marginTop: "1rem" }}>
          {state.latitudeValue && state.longitudeValue ? (
            <Alert severity="success">
              Location selected: ({state.latitudeValue}, {state.longitudeValue})
            </Alert>
          ) : (
            <Alert severity="warning">Select a location on the map</Alert>
          )}
        </Grid>

        <Grid item container style={{ height: "35rem", marginTop: "1rem" }}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <TheMapComponent></TheMapComponent>
            {BoroughDisplay()}
            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={state.markerPosition}
              ref={markerRef}
            ></Marker>
          </MapContainer>
        </Grid>

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
            UPLOAD IMAGE (MAXIMUM 5 IMAGES)
            <input
              type="file"
              multiple
              accept="image/png, image/gif, image/jpeg"
              hidden
              onChange={(event) =>
                dispatch({
                  type: "catchUploadedPictures",
                  picturesChosen: event.target.files,
                })
              }
            ></input>
          </Button>
        </Grid>

        <Grid container>
          <ul>
            {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
            {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
            {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
            {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
            {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
          </ul>
        </Grid>

        {submitButtonDisplay()}
        {/* <Grid
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
            SUBMIT
          </Button>
        </Grid> */}
      </form>
      <Snackbar
        open={state.openSnack}
        message="You have successfully added a property listing"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}

export default AddProperty;
