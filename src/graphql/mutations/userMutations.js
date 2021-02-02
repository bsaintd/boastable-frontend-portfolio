/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const REGISTER_USER_MUTATION = gql`
  mutation createUser($user: RegistrationInputs!){
    registration{
      createUser(inputs: $user){
        auth
      }
    }
  }`;
