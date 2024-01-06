import React from "react";
import Navbar  from "../Navbar/Navbar";
import { useSelector } from "react-redux";
const Home = () => {
  const { role } = useSelector((store) => store.auth.loginDetails);
  return (
    <div>
      <center>
        <h1>Welcome to Beyinc !</h1>
      </center>
    </div>
  );
};

export default Home;
