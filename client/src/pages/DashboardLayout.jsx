import React, { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { Navbar, SmallSidebar, BigSidebar } from "../components";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
const DashboardContext = createContext();

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  } catch (error) {
    return redirect("/");
  }
};
const DashboardLayout = () => {
  const { user } = useLoaderData();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const navigate = useNavigate();
  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
    console.log(newDarkTheme);
  };

  const toggleSideBar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };
  return (
    <>
      <DashboardContext.Provider
        value={{
          user,
          showSidebar,
          isDarkTheme,
          logoutUser,
          toggleSideBar,
          toggleDarkTheme,
        }}
      >
        <Wrapper>
          <main className="dashboard">
            <SmallSidebar />
            <BigSidebar />
            <div>
              <Navbar />
              <div className="dashboard-page">
                <Outlet context={{ user }} />
              </div>
            </div>
          </main>
        </Wrapper>
      </DashboardContext.Provider>
    </>
  );
};
export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
