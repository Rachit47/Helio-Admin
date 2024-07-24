import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const getUserFromSessionStorage = () => {
  try {
    const user = sessionStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

const INITIAL_STATE = {
  currentUser: getUserFromSessionStorage(),
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.currentUser) {
      sessionStorage.setItem("user", JSON.stringify(state.currentUser));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
