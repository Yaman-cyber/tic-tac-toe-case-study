import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Tabs from "../../components/Tabs";
import Tab from "../../components/Tab";

import navConfig from "./config-navigation";

export default function HomeLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveIndex = () => {
    const path = location.pathname;
    const index = navConfig.findIndex((item) => item.path === path);
    return index !== -1 ? index : 0;
  };

  const handleTabChange = (index) => {
    const path = navConfig[index].path;
    navigate(path);
  };

  return (
    <div className="h-screen bg-gray-50">
      <Tabs activeIndex={getActiveIndex()} onTabChange={handleTabChange}>
        {navConfig.map((item) => (
          <Tab key={item.path} label={item.title}>
            {children}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
