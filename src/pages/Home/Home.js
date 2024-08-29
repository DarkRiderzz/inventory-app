/* eslint-disable no-unused-vars */
import React from "react";
import { RiProductHuntLine, RiStore2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Home.scss";
import heroImg from "../../assets/inv-img-3.jpg";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div className="home">
      <nav className="container --flex-between ">
        <div className="logo">
          {/* <RiStore2Line size={35} /> */}
          <h2 className="logo-text">StyleAsh</h2>
        </div>

        <ul className="home-links">
          <div className="show-logout">
            <ShowOnLogout>
              <li>
                <button className="--btn --btn-primary home-btn display-none ">
                  <Link className="cbutton" to="/verify-email">
                    Register
                  </Link>
                </button>
              </li>
            </ShowOnLogout>
            <ShowOnLogout>
              <li>
                <button className="--btn --btn-primary home-btn">
                  <Link className="cbutton" to="/login">
                    Login
                  </Link>
                </button>
              </li>
            </ShowOnLogout>
          </div>
          <ShowOnLogin>
            <li>
              <button className="--btn --btn-primary home-btn">
                <Link to="/dashboard">Dashboard</Link>
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>
      {/* HERO SECTION */}
      <section className="container hero">
        <div className="hero-text">
          <h2>StyleAsh Inventory {"&"} Stock Management </h2>
          <p>
            Inventory system to control and manage proucts in the warehouse in
            real time and integrated to make it easier to develop your business.
          </p>
          <div className="--flex-home">
            <div className="hero-buttons">
              <button className="--btn --btn-primary home-btn btn">
                <Link className="cbutton" to="/verify-email">
                  Create Account
                </Link>
              </button>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Inventory" width={545} />
        </div>
      </section>
    </div>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className="--mr">
      <h3 className="--color-white">{num}</h3>
      <p className="--color-white">{text}</p>
    </div>
  );
};

export default Home;
