import { isEmail } from 'validator';
/* reference @/components/SignUpAcctForm.vue for usage! */
// email addresses
export const isEmailAddress = [
  // there is something in the input field (at least 1 character)
  v => !!v || 'E-mail is required',
  /* implementation of RFC 2822 with omitted syntax.
  It will still match 99.99% of all email addresses in actual use today. */
  v => isEmail(v) || 'E-mail must be valid',
];
// passwords
export const acceptedPW = [
  // there is something in the input field (at least 1 character)
  v => !!v || 'Password is required',
  /*
  This password needs to be a length of
  6 to 20 aplhanumeric characters and
  select special characters. The password
  also can not start with a digit, underscore
  or special character and must contain at
  least one digit.
  */

  v => /(?!^[0-9]*$)(?!^[a-zA-Z!@#$%^&*()_+=<>?]*$)^([a-zA-Z!@#$%^&*()_+=<>?0-9]{6,20})$/.test(v) || 'Password at least 6 characters, and must contain at least 1 number. Special characters allowed.',
];
// names
export const isName = [
  /* must be from 1 to 25 characters in length,
  only allow letters and numbers, ' & / % allowed */
  v => /^([-A-Za-z0-9&%'/,. ]){1,60}$/.test(v) || 'Please enter valid name',
];
export const isAddress = [
  /* must be from 1 to 25 characters in length,
  only allow letters and numbers, no special characters */
  v => /^([-A-Za-z0-9,.# ]){1,60}$/.test(v) || 'Please enter valid address',
];
export const isAddressLineTwo = [
  /* must be from 0 to 25 characters in length,
  only allow letters and numbers, no special characters */
  v => /^([-A-Za-z0-9,.# ]){0,60}$/.test(v) || 'Please enter valid address',
];
export const isCity = [
  /* must be from 1 to 25 characters in length,
  only allow letters and numbers, no special characters */
  v => /^([-A-Za-z ]){1,60}$/.test(v) || 'Please enter valid city name',
];
export const isZipCode = [
  /* This allows USA 5 Zip, 5+4 Zip, separated by either space or dash.
  & CAN Postal separated by either space or dash */
  // eslint-disable-next-line
  v => /(^\d{5}([ \-]\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1}[ \-]\d{1}[A-Z]{1}\d{1}$)/.test(v) || 'Please enter valid postal code',
];
export const statesOfTheUS = [
  'Alabama', 'Alaska', 'Arizona',
  'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia',
  'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
  'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];
