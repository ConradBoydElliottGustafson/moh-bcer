import React, { useState } from 'react';
import * as yup from 'yup';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export const useCsvValidator = () => {
  const [errors, setErrors] = useState<Array<{row: string, field: string, message: string}>>()
  const [validatedData, setValidatedData] = useState<Array<any>>()

  //Required to load the API key into the google maps script
  const {} = usePlacesService({
    apiKey: process.env.GOOGLE_MAPS_API_KEY
  })

  return {
    errors,
    validatedData,
    validateCSV: async(validationSchema: yup.ObjectSchema<any>, uploadData: Array<any>) => {
      let errorArray: Array<any> = [];
      let validatedDataArray: Array<any> = [];

      await Promise.all(uploadData.map(async(element, index) => {
        element.error = undefined;
        try {
          const validatedDto = await validationSchema.validateSync(element, { abortEarly: false });
          const result = await geocodeByAddress(`${validatedDto.addressLine1},${validatedDto.city}`)

          if (result[0].geometry.location_type !== 'ROOFTOP') {
            errorArray.push({row: index + 2, field: 'Geocoder Error', message: 'Google was unable to find a match. please edit the location and select the location address'})
            element.error = true;
          } else {
            validatedDto.addressLine1 = result[0].formatted_address
            validatedDto.locationId = result[0].place_id
          }

          validatedDataArray.push(validatedDto);
        } catch (validationError) {
          //@ts-ignore
          // needed to access validationError.inner
          validationError.inner.map((error: any) => errorArray.push({row: index + 2, field: error.path, message: error.message})) as any
          element.error = true;
          validatedDataArray.push(element)
        }
      }))

      setErrors(errorArray)
      setValidatedData(validatedDataArray)
    }
  }
}