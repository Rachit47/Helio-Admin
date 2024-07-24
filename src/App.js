import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Stats from "./pages/stats/Stats";
import Productlist from "./pages/productlist/Productlist";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs, orderInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import Singleproduct from "./pages/singleproduct/Singleproduct";
import NewProduct from "./pages/newProduct/NewProduct";
import OrdersList from "./pages/orderslist/OrdersList";
import NewOrder from "./pages/newOrder/NewOrder";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  }; //If no current user or Admin is found logged in i.e currentUser = false, then simply redirect to login page.

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            <Route path="users" className="CustomerClass">
              <Route index element={<List />} />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New Customer" />}
              />
            </Route>
            <Route path="products" className="ProductClass">
              <Route
                index
                element={
                  <RequireAuth>
                    <Productlist />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Singleproduct />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <NewProduct inputs={productInputs} title="Add New Product" />
                }
              />
            </Route>
            <Route path="orders" className="OrderClass">
              <Route
                index
                element={
                  <RequireAuth>
                    <OrdersList />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <NewOrder inputs={orderInputs} title="Add New Order" />
                }
              />
            </Route>
            <Route path="stats" className="StatsClass">
              <Route
                index
                element={
                  <RequireAuth>
                    <Stats />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
