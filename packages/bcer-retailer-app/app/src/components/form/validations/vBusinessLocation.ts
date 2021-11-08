import * as yup from 'yup';

export interface IBusinessLocationValues {
  id?: string;
  addressLine1: string;
  addressLine2: string;
  postal: string;
  city: string;
  phone: string;
  email: string;
  underage: string;
  underage_other?: string;
  health_authority: string;
  doingBusinessAs: string;
  manufacturing: string;
  tableData?: {
    id: number
  }
}

export const Initial = {
  addressLine1: '',
  addressLine2: '',
  postal: '',
  city: '',
  phone: '',
  email: '',
  underage: '',
  underage_other: '',
  health_authority: '',
  doingBusinessAs: '',
  manufacturing: '',
};

export const Validation = yup.object({
  addressLine1: yup.string().test('length', 'The address must be less than 100 characters.', val => val?.length <= 100).required('The address of your place of business is required'),
  addressLine2: yup.string().test('length', 'The address must be less than 100 characters.', val => val?.length <= 100),
  postal: yup.string()
    .matches(
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      'Please provide a valid postal code'
    )
    .required('Postal Code is a required field'),
  city: yup.string().test('length', 'The City must be less than 50 characters.', val => val?.length <= 50).required('City is a required field'),
  phone: yup.string()
    .matches(
      /^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
      'Please provide a valid phone number'
    )
    .required('A Phone number is required'),
  email: yup.string().email('Invalid Email').required('Email is a required field'),
  underage: yup.string().required('This is a required field'),
  underage_other: yup.string().when('underage', {
    is: 'other',
    then: yup.string().required('Please provide details')
  }),
  doingBusinessAs: yup.string().test('length', 'The address must be less than 100 characters.', val => val?.length <= 100),
  health_authority: yup.string().required('Please select your Health Authority'),
  manufacturing: yup.string().required('This is a required field'),
});
