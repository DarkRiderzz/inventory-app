import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation(); // Access location

  const initialState = {
    name: "",
    email: location.state?.email || "", // Pre-fill email if available
    password: "",
    password2: "",
    otp: "",
  };
  const [formData, setformData] = useState(initialState);
  const { name, email, password, password2, otp } = formData;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !otp) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      name,
      email,
      password,
      otp,
    };
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
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
          <h2 className={styles.title}>Register</h2>

          <form onSubmit={register} className={styles.form}>
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={name}
              onChange={handleInputChange}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
              readOnly
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="OTP"
              required
              name="otp"
              value={otp}
              onChange={handleInputChange}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Register
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
                &nbsp; Already have an account? &nbsp;
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

export default Register;
