import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsernameFromToken } from "../utilities/tokenUtils";

function RedirectIfAuthenticated() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      console.log("Checking token for redirection", token);
      if (token) {
        const username = getUsernameFromToken(token);
        console.log("Extracted username:", username); 
        if (username) {
          navigate(`/${username}`);
        } else {
          localStorage.removeItem("token")
          navigate(`/`);

        }
      }
    }, [token]);
  
    return null; 
  }

export default RedirectIfAuthenticated;
