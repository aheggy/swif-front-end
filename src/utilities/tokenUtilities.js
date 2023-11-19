// src/utilities/tokenUtils.js
import {jwtDecode} from 'jwt-decode';

export  const getUsernameFromToken = (token) => {

  if( token !== null){
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.username; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};
