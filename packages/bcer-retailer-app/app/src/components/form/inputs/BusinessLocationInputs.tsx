import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormikHelpers, useFormikContext } from 'formik';
import { Grid, InputAdornment, makeStyles, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { StyledTextField, StyledRadioGroup } from 'vaping-regulation-shared-components';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason } from '@material-ui/lab';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import HelpIcon from '@material-ui/icons/Help';

import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import { useAxiosGet } from '@/hooks/axios';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';

const useStyles = makeStyles({
  groupHeader: {
    display: 'flex',
    fontSize: '17px',
    fontWeight: 600,
    padding: '10px 0px'
  },
  headerDescription:{
    fontSize: '14px',
    fontWeight: 500,
    width: '800px'
  },
  gridItemLeft: {
    padding: '0px 15px 0px 0px'
  },
  gridItemRight: {
    padding: '0px 0px 0px 15px'
  },
  optionalWrapper:{
    display: 'flex',
    alignItems: 'flex-end'
  },
  radioWrapper: {
    padding: '0px 20px 15px 0px'
  },
  autocompleteField: {
    '& .MuiAutocomplete-inputRoot': {
      padding: '0px 12px 0px 0px !important'
    }
  },
  helpIcon: {
    fontSize: '22px',
    color: '#0053A4'
  },
  tooltip: {
    backgroundColor: '#0053A4',
    fontSize: '14px'
  },
  arrow: {
    color: '#0053A4'
  }
})

function BusinessLocationInputs({formikValues, formikHelpers }: {formikValues: IBusinessLocationValues, formikHelpers: FormikHelpers<IBusinessLocationValues>}) {
  const classes = useStyles();
  const { values } = useFormikContext<IBusinessLocationValues>();
  const [ predictions, setPredictions ] = useState<Array<BCGeocoderAutocompleteData>>([]);
  const [ autocompleteOptions, setAutocompleteOptions ] = useState<Array<string>>([]);
  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', { manual: true })
  // const {
  //   placesService,
  //   placePredictions,
  //   getPlacePredictions,
  //   isPlacePredictionsLoading, 
  // } = usePlacesService({
  //   apiKey: process.env.GOOGLE_MAPS_API_KEY
  // })

  useEffect(() => {
    if (data && data.features?.length > 0) {
      console.log(data.features)
      setPredictions(data.features)
      setAutocompleteOptions(data.features.map((e: BCGeocoderAutocompleteData) => e.properties.fullAddress))
    }
  }, [data])

  const handleAutocompleteSelect = ( value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any>) => {
    const fullLocation = predictions.find(e => e.properties.fullAddress === value)
    formikHelpers.setFieldValue('addressLine1', fullLocation ? fullLocation.properties.fullAddress : '')
    formikHelpers.setFieldValue('precision', fullLocation.properties.precisionPoints)
    formikHelpers.setFieldValue('city', fullLocation.properties.localityName)
  }
  
  const getAutocomplete = (e: any) => {
    getSuggestions({url: `https://geocoder.api.gov.bc.ca/addresses.json?minScore=50&maxResults=5&echo=false&autoComplete=true&brief=false&matchPrecision=occupant,unit,site,civic_number,block&addressString=${e.target.value}`})
  }

  const resetFieldsOnChange = () => {
    formikHelpers.setFieldValue('addressLine1', '')
    formikHelpers.setFieldValue('city', '')
    formikHelpers.setFieldValue('postal', '')
    formikHelpers.setFieldValue('precision', '')
  }

  return (
    <>
      <div className={classes.groupHeader}>
        Address of sales premises from which restricted e-substance sold 
        <Tooltip classes={{tooltip: classes.tooltip, arrow: classes.arrow}} title="Type in your address and select the one that matches it the best. If you cannot find your address then please contact the Ministry of Health at vaping.info@gov.bc.ca" arrow>
          <HelpIcon className={classes.helpIcon}/>
        </Tooltip>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} className={classes.gridItemLeft}>
        <Autocomplete             
          classes={{root: classes.autocompleteField}}
          options={autocompleteOptions} 
          freeSolo
          value={values.addressLine1}
          onChange={(e: ChangeEvent<{}>, value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any> ) => handleAutocompleteSelect(value, reason, details)}
          renderInput={(params) => (
            <StyledTextField 
              {...params} 
              label={<RequiredFieldLabel label="Business address line 1"/>}
              InputProps={{ 
                ...params.InputProps,
                endAdornment: <InputAdornment position="end"><SearchIcon/></InputAdornment>,
                type: 'search'
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password'
              }}
              autoComplete='off'
              onChange={(e: any) => {
                resetFieldsOnChange()
                getAutocomplete(e)
              }}
              name="addressLine1"
              fullWidth 
            />
          )}
        />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.groupHeader}>Business Contact Info of sales premises from which restricted e-substance sold</div>
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemLeft}>
          <StyledTextField
            label={<RequiredFieldLabel label="Business Email"/>}
            name="email"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="Business Phone Number"/>}
            name="phone"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="City"/>}
            name="city"
            fullWidth
            disabled={true}
          />
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="Postal Code"/>}
            name="postal"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label="The name this location is doing business as"
            name="doingBusinessAs"
            fullWidth
          />
        </Grid>

      </Grid>

      <div className={classes.groupHeader} >
        Please state if persons under 19 years of age are permitted on the sales premises <span style={{color: 'red'}}>*</span>
        <div className={classes.headerDescription} >
          If your retail location has unique circumstances surrounding age-restriction, please select "other" and describe in the comment box below.
        </div>
      </div>
      
      <div className={classes.optionalWrapper} >
        <div className={classes.radioWrapper}>
          <StyledRadioGroup
            name="underage"
            options={[
              {label: 'Yes', value: 'Yes'},
              {label: 'No', value: 'No'},
              {label: 'Other', value: 'other'}
            ]}
          />
        </div>
        <div >
          {values.underage === 'other' && <StyledTextField name="underage_other" placeholder="Please Specify" fullWidth={false}/>}
        </div>
      </div>

      <div className={classes.groupHeader}>
        Which regional health authority is the sales premises located in? A map of the regional health authorities can be found at the&nbsp;
        <a href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services/land-use/administrative-boundaries/health-boundaries" target="_blank" rel="noopener noreferrer">following link</a>
        <span style={{color: 'red'}}> *</span>
      </div>
      <div className={classes.optionalWrapper} >
        <div className={classes.radioWrapper}>
          <StyledRadioGroup
            name="health_authority"
            options={[
              {label: 'Fraser Health', value: 'fraser'},
              {label: 'Interior Health', value: 'interior'},
              {label: 'Island Health', value: 'island'},
              {label: 'Northern Health', value: 'northern'},
              {label: 'Vancouver Coastal Health', value: 'coastal'},
              {label: 'Other (e.g. Out of Province)', value: 'other'},
            ]}
          />
          </div>
          <div >
            {values.health_authority === 'other' && <StyledTextField name="health_authority_other" placeholder="Please Specify" fullWidth={false}/>}
          </div>
        </div>
      <div className={classes.groupHeader}>
        Do you produce, formulate, package, repackage or prepare restricted e-substances for sale from this sales premises? <span style={{color: 'red'}}>*</span>
      </div>
      <StyledRadioGroup
      defaultValue="none"
        name="manufacturing"
        default
        options={[
          {label: 'Yes', value: 'yes'},
          {label: 'No', value: 'no'},
        ]}
      />
    </>
  );
}

export default BusinessLocationInputs;
