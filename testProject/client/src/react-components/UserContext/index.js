import React, { createContext } from "react";

const log = console.log;

const UserContext = createContext({ name: null });
 
export default UserContext;