import { Box, FormControl, IconButton, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { SetStateAction, useEffect, useState } from 'react';
import { StyledButton, StyledSelectField } from 'vaping-regulation-shared-components';
import MapIcon from '@material-ui/icons/Map';
import DragSort from '@/components/dragable';
import LocationView from './LocationView';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MapControl from './MapControl';
import Itinerary from './Itinerary';
import LocationAutoComplete from './LocationAutoComplete';
import SearchLocation from './SearchLocation';
import {
  BCDirectionData,
  BCGeocoderAutocompleteData,
  BusinessLocation,
  RouteOptions,
} from '@/constants/localInterfaces';
import { useHistory } from 'react-router';
import RouteStatics from './RouteStatics';
import { AxiosError } from 'axios';
import OptimizedOrder from './OptimizedOrder';
import { healthAuthorityOptions } from '@/constants/arrays';
import store from 'store';
import { useAxiosGet } from '@/hooks/axios';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px',
    minWidth: '32vw',
  },
  header: {
    color: '#002C71',
    fontWeight: 'bold',
    fontSize: '27px',
  },
  buttonText: {
    size: '13px',
    color: '#234075',
    fontWeight: 500,
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  healthAuthoritySelectWrap: {
    '& label':{
      color: 'black',
    },
    '& .MuiInputBase-root': {
      width: '50%',
      background: '#f5f5f5',
      height: 40,
      padding: 10,
      marginTop: 5,    
    }
  },
}));


interface LeftPanelProps {
  mapInMenu: Boolean,
  locations: BusinessLocation[];
  setLocations: React.Dispatch<SetStateAction<BusinessLocation[]>>;
  startingLocation: BCGeocoderAutocompleteData;
  setStartingLocation: React.Dispatch<
    SetStateAction<BCGeocoderAutocompleteData>
  >;
  addLocationToSelectedHandler: (l: BusinessLocation) => void;
  showOnMapHandler: (l: BusinessLocation) => void;
  removeLocationHandler: (l: BusinessLocation) => void;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  initialRoutingOptions: RouteOptions;
  routeData: BCDirectionData;
  createGoogleLink: () => string;
  setRouteOptions: React.Dispatch<SetStateAction<RouteOptions>>;
  setShowHALayer: React.Dispatch<SetStateAction<boolean>>,
  directionError: AxiosError;
}

function LeftPanel({
  mapInMenu,
  locations,
  setLocations,
  startingLocation,
  setStartingLocation,
  addLocationToSelectedHandler,
  showOnMapHandler,
  removeLocationHandler,
  setDrawerOpen,
  initialRoutingOptions,
  routeData,
  createGoogleLink,
  setRouteOptions,
  setShowHALayer,
  directionError,
}: LeftPanelProps) {
  const classes = useStyles();
  const history = useHistory();  
  const [healthAuthority, setHealthAuthority] = useState(store.get('KEYCLOAK_USER_HA')  || '');
  const [{ data, loading }, getLocationsWithHealthAuthority] =
    useAxiosGet(`data/location?page=1&numPerPage=1000&includes=business,noi,products,manufactures,sales&authority=${healthAuthority}`, { manual: true });

  useEffect(() => {
    if (mapInMenu && healthAuthority)      
      getHealthAuthorityLocations(healthAuthority)
  }, [healthAuthority])

  // useEffect(() => {
  //   //setLocations(healthAuthorityLocations)
  //   setLocations(data?.rows || [])
  //   console.log(data)
  // }, [data])

  const getHealthAuthorityLocations = async (healthAuthority: string) => {
    //get all location with this health authority
    //send the location to setLocations([])
    console.log(healthAuthority);
    await getLocationsWithHealthAuthority();
  }

  return (
    <Box className={classes.container}>
      {!mapInMenu &&
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        borderBottom="1px solid black"
        alignItems="center"        
      >        
        <Box>
          <StyledButton
            variant="small-outlined"
            size="small"
            onClick={() => history.goBack()}
          >
            Back
          </StyledButton>
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Box>
      }
      <Typography className={classes.header}>Route</Typography>
      <Box mt={1} />
      <StyledButton
        variant="small-outlined"
        size="small"
        onClick={() => window.open(createGoogleLink(), '_blank')}
      >
        <MapIcon fontSize="small" />
        <Box ml={1} />
        Show in Google Map
      </StyledButton>
      <Box mt={4} />
      {mapInMenu &&       
        <div className={classes.healthAuthoritySelectWrap}>
          <InputLabel id="health-authority-label">Health Authority</InputLabel>
          <Select
            labelId="health-authority-label"
            value={healthAuthority}
            onChange={(e: any) => {
              setHealthAuthority(e.target.value)
            }}
            displayEmpty
          >
            <MenuItem disabled value="">
              <em>Select </em>
            </MenuItem>
            {healthAuthorityOptions.map(ha => {
              return ha.value !== "all" && <MenuItem key={ha.value} value={ha.value}>{ha.label}</MenuItem>
            })}          
          </Select>
          <Box mt={4} />
        </div>
      }
      <Box mt={2} mb={1}>
        <Typography className={classes.label}>Starting Address</Typography>
      </Box>
      <SearchLocation setSelect={setStartingLocation} />
      <Box mt={2} mb={1}>
        <Typography className={classes.label}>Retail Locations</Typography>
      </Box>
      <DragSort
        setState={setLocations}
        state={locations}
        Component={LocationView}
        componentProps={{ showOnMapHandler, removeLocationHandler }}
      />
      <Box my={2}>
        <LocationAutoComplete
          selectedLocations={locations}
          addLocationToSelectedHandler={addLocationToSelectedHandler}
        />
      </Box>
      <RouteStatics directionData={routeData} directionError={directionError} />
      <Box mt={2} />
      <MapControl
        initialRoutingOptions={initialRoutingOptions}
        setRouteOptions={setRouteOptions}
        setShowHALayer={setShowHALayer}
      />
      {routeData?.visitOrder && locations && (
        <OptimizedOrder
          routeData={routeData}
          selectedLocations={locations}
          startingLocation={startingLocation}
        />
      )}
      {routeData && <Itinerary directionData={routeData} />}
    </Box>
  );
}

export default LeftPanel;
