import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useGoogleLogin,
  GoogleLogin,
  hasGrantedAllScopesGoogle,
} from "@react-oauth/google";

const WEBLINK = "http://localhost:8000";

const SignInForm = () => {
  const navigate = useNavigate();

  const [toggle, setToggle] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    if (toggle)
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    else setRegForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    if (!toggle) {
      const res = await axios
        .post(`${WEBLINK}/api/auth/register`, regForm)
        .then((res) => {
          toast.success(`Register Successfully!`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setToggle(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(`Error: ${err.response.data.message}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
    } else {
      const res = await axios
        .post(`${WEBLINK}/api/auth/login`, formData)
        .then((res) => {
          console.log(res);
          toast.success(`Welcome ${formData.email}!`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          toast.error(`Error: ${err.response.data.message}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });

      // setCookie("access_token", res.data.token);
      // dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      // getCart(res.data.details._id, res.data.token);
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      onLoginSuccess(tokenResponse);
    },
  });

  const onLoginSuccess = async (tokenResponse) => {
    console.log(tokenResponse);
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    );
    const decoded = response.data;
    console.log(decoded);
    try {
      const data = await axios.get(
        `${WEBLINK}/api/users/find/${decoded.email}`
      );
      // console.log("data", data);
      if (data.data == null) {
        let username;
        const res = await axios.post(`${WEBLINK}/api/auth/google/register`, {
          username:
            decoded.given_name +
            (decoded.family_name != null ? decoded.family_name : ""),
          email: decoded.email,
        });
        toast.success(`Registered Successfully!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // setCookie("access_token", res.data.token);
        // dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        // getCart(res.data.details._id, res.data.token);
        navigate("/");
      } else {
        const user = data.data;
        const res = await axios.post(`${WEBLINK}/api/auth/google/login`, {
          email: user.email,
        });
        toast.success(`Welcome ${user.username}!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // setCookie("access_token", res.data.token);
        // dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        // getCart(res.data.details._id, res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onLoginFail = (res) => {
    console.log(res);
  };

  return (
    <div className="App">
      <div className="appAside" />
      <div className="appForm">
        <div className="formCenter">
          <div className="pageSwitcher">
            <NavLink
              onClick={() => setToggle(true)}
              activeClassName="pageSwitcherItem-active"
              className={
                toggle == true
                  ? " pageSwitcherItem pageSwitcherItem-active"
                  : "pageSwitcherItem"
              }
            >
              Sign In
            </NavLink>
            <NavLink
              onClick={() => setToggle(false)}
              className={
                toggle == true
                  ? `pageSwitcherItem`
                  : ` pageSwitcherItem pageSwitcherItem-active`
              }
            >
              Sign Up
            </NavLink>
          </div>
          <div className="formTitle">
            <NavLink
              onClick={() => setToggle(true)}
              className={
                toggle == true
                  ? `formTitleLink formTitleLink-active`
                  : ` formTitleLink `
              }
            >
              Sign In
            </NavLink>
            or
            <NavLink
              onClick={() => setToggle(false)}
              activeClassName="formTitleLink-active"
              className={
                toggle == true
                  ? `formTitleLink`
                  : ` formTitleLink formTitleLink-active`
              }
            >
              Sign Up
            </NavLink>
          </div>

          {toggle ? (
            <div className="formFields">
              <div className="formField">
                <label className="formFieldLabel" htmlFor="email">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="formFieldInput"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="formField">
                <label className="formFieldLabel" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="formFieldInput"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="formField">
                <button className="formFieldButton" onClick={handleClick}>
                  Sign In
                </button>
                <div onClick={() => setToggle(false)} className="formFieldLink">
                  Create an account
                </div>
              </div>

              <div className="socialMediaButtons">
                <div>
                  <button
                    type="button"
                    class="login-with-google-btn"
                    onClick={handleGoogle}
                  >
                    Sign in with Google
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="formFields">
              <div className="formField">
                <label className="formFieldLabel" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="username"
                  className="formFieldInput"
                  placeholder="Enter your full name"
                  name="name"
                  value={regForm.username}
                  onChange={handleChange}
                />
              </div>
              <div className="formField">
                <label className="formFieldLabel" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="formFieldInput"
                  placeholder="Enter your password"
                  name="password"
                  value={regForm.password}
                  onChange={handleChange}
                />
              </div>
              <div className="formField">
                <label className="formFieldLabel" htmlFor="email">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="formFieldInput"
                  placeholder="Enter your email"
                  name="email"
                  value={regForm.email}
                  onChange={handleChange}
                />
              </div>

              <div className="formField">
                <button className="formFieldButton" onClick={handleClick}>
                  Sign Up
                </button>
                <div onClick={() => setToggle(true)} className="formFieldLink">
                  I'm already member
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
