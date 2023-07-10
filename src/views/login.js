import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import logo from "../resources/logo-tdtu.png";
import { FaGooglePlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../components/useWindowDimensions";
import { GoogleLogin } from "@react-oauth/google";
import { message, Checkbox } from "antd";
import axiosInstance from "../api/service";

const rememberme = JSON.parse(sessionStorage.getItem("rememberuser"));

const LoginView = () => {
  const [user, setUser] = useState(rememberme ? rememberme.username : "");
  const [password, setPassword] = useState(
    rememberme ? rememberme.password : ""
  );
  const [loginBtnState, setLoginBtnState] = useState(false);

  const [checked, setChecked] = useState(rememberme ? true : false);
  const { width } = useWindowDimensions();
  const googleToken = process.env.REACT_APP_GG_TOKEN;

  let history = useHistory();

  function checkHandle() {
    setChecked(!checked);
  }

  const responseSuccessGoogle = async (response) => {
    const tokenId = response?.credential;

    try {
      const { data } = await axiosInstance.post(`/api/googlelogin`, {
        tokenId: tokenId,
      });
      if (data) {
        if (data.code === 0) {
          sessionStorage.setItem("token", data.token);
          history.push("/home");
        } else {
          message.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function submitHandle(e) {
    e.preventDefault();

    if (user.length === 0 && password.length === 0) {
      message.error("Dont let username and password empty!");
      return;
    }

    setLoginBtnState(true);

    axiosInstance
      .post(`/account/login`, {
        user: user,
        password: password,
      })
      .then(async (res) => {
        if (res.data.code === 0) {
          if (checked) {
            let data = { username: user, password: password };
            sessionStorage.setItem("rememberuser", JSON.stringify(data));
          } else {
            sessionStorage.setItem("rememberuser", null);
          }
          sessionStorage.setItem("token", res.data.token);
          history.push("/home");
        } else {
          message.error(res.data.message);
        }
        setLoginBtnState(false);
      })
      .catch((e) => {
        setLoginBtnState(false);
        message.error("Check your username or password!");
      });
  }
  return (
    <div className="col-md-12 containerr" style={{ flex: 1 }}>
      <div className="img-bg d-flex justify-content-center">
        <div
          className={
            width < 768
              ? "form-container col-12 p-4 d-flex justify-content-center align-self-center"
              : "form-container col-5 p-4 d-flex justify-content-center align-self-center"
          }
        >
          <Form className="login-form col-10 m-5" onSubmit={submitHandle}>
            <img className="login-img" src={logo} alt="tdtu-logo" />
            <h3 className="text-primary">Login with TDTSocial</h3>
            <div style={{ color: "gray", margin: "2px", fontSize: "15px" }}>
              Sign in to your admin or faculty account
            </div>
            <Form.Group className="form-group pt-3">
              <Form.Label style={{ fontSize: "16px" }}>Username</Form.Label>
              <Form.Control
                style={{ padding: "22px" }}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                type="text"
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontSize: "16px" }}>Password</Form.Label>
              <Form.Control
                style={{ padding: "22px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </Form.Group>
            <Form.Group>
              <Checkbox defaultChecked={checked} onChange={checkHandle}>
                Remember me
              </Checkbox>
            </Form.Group>
            <Button
              className="btn col-md-12 mt-2"
              type="submit"
              disabled={loginBtnState}
            >
              Login with TDTSocial Account
            </Button>
            <div
              style={{
                textAlign: "center",
                color: "gray",
                margin: "8px",
                fontSize: "15px",
              }}
            >
              Or sign in to student account
            </div>
            {/* <GoogleLogin
              clientId={googleToken}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="btn col-md-12 mt-2"
                  type="button"
                  variant="danger"
                >
                  <FaGooglePlus color="white" size="22px" /> Login with Google
                  Account
                </Button>
              )}
              buttonText="Login"
              onSuccess={responseSuccessGoogle}
              onFailure={() =>
                message.error("Something wrong with google login")
              }
              cookiePolicy={"single_host_origin"}
            /> */}
            <GoogleLogin
              onSuccess={responseSuccessGoogle}
              onError={() => message.error("Something wrong with google login")}
              text="Sign in with Student account"
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
