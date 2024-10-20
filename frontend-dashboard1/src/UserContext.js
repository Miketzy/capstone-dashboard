import React, { createContext, useState } from 'react';

// Create a User Context
export const UserContext = createContext();

// Create a UserProvider component to provide the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; // Export the context if needed
