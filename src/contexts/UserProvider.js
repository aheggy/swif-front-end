// UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [recipientUser, setRecipientUser] = useState(null);

  return (
    <UserContext.Provider value={{ recipientUser, setRecipientUser }}>
      {children}
    </UserContext.Provider>
  );
};
