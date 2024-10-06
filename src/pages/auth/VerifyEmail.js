/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { verifyOtp, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const initialState = {
  email: "",
};

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { email } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = { email };
    setIsLoading(true);
    try {
      const data = await verifyOtp(userData);
      if (!data) {
        setIsLoading(false);
        return;
      }
      navigate("/register", { state: { email: email } });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loader />}
      <div className={styles.margin}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2 className={styles.title}>Verify Email</h2>

          <form onSubmit={register} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
              className={styles.input}
            />

            <button type="submit" className={styles.button}>
              Verify Email
            </button>
          </form>

          <div className={styles.firstLink}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
          </div>
          <div className={styles.links}>
            <div className={styles.registerContainer}>
              <p className={styles.text}>
                &nbsp; Already have an account? &nbsp;{" "}
              </p>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
