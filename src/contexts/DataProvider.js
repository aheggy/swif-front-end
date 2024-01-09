import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const API = process.env.REACT_APP_API_URL;

export const DataProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      const response = await axios.get(`${API}/people`);
      setPeople(response.data);
    };
    fetchPeople();
  }, []);

  return (
    <DataContext.Provider value={{ people }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
