import React, { useState } from "react";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";

const Forgot = () => {
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter an email");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
    };

    try {
      await forgotPassword(userData);
      toast.success("Password reset email sent");
      setEmail("");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.margin}>
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2 className={styles.title}>Forgot Password</h2>

          <form onSubmit={forgot} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            <button type="submit" className={styles.button}>
              Get Reset Email
            </button>
            <div className={styles.firstLink}>
              <p>
                <Link to="/" className={styles.link}>
                  Home
                </Link>
              </p>
              <p>
                <Link to="/login" className={styles.link}>
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
