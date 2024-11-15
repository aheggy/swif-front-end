import React, { createContext, useState, useEffect } from 'react';

const DataContext = createContext();

const API = process.env.REACT_APP_API_URL;

export const DataProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(`${API}/people`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPeople(data);
      } catch (error) {
        console.error('Error fetching people', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API}/subjects`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };

    fetchPeople();
    fetchSubjects();
  }, []);

  return (
    <DataContext.Provider value={{ people, subjects }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
