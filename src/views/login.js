import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import logo from "../resources/logo-tdtu.png";
import { FaGooglePlus } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import useWindowDimensions from "../components/useWindowDimensions";
import { useGoogleLogin } from "@react-oauth/google";
import { message, Checkbox } from "antd";
import axiosInstance from "../api/service";

const rememberme = JSON.parse(localStorage.getItem("rememberuser"));

const LoginView = () => {
  const [user, setUser] = useState(rememberme ? rememberme.username : "");
  const [password, setPassword] = useState(
    rememberme ? rememberme.password : ""
  );
  const [loginBtnState, setLoginBtnState] = useState(false);

  const [checked, setChecked] = useState(rememberme ? true : false);
  const { width } = useWindowDimensions();

  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/home" } };

  function checkHandle() {
    setChecked(!checked);
  }

  const responseSuccess = async (response) => {
    const res = await axiosInstance.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`
    );
    if (res.data) {
      if (res.data.hd !== "student.tdtu.edu.vn") {
        message.error("Tài khoản không phù hợp, vui lòng thử lại");
      } else {
        const { data } = await axiosInstance.post(`/api/googlelogin`, {
          name: res.data.name,
          email: res.data.email,
          picture: res.data.picture,
          verified_email: res.data.verified_email,
        });
        if (data.code === 0) {
          console.log(from);
          console.log(location);
          sessionStorage.setItem("token", data.token);
          history.replace(from);
        }
      }
    }
  }

  const loginWithGG = useGoogleLogin({
    onSuccess: responseSuccess,
    onError: (error) => message.error("Có lỗi xảy ra khi kết nối tới dịch vụ Google!"),
  });

  async function submitHandle(e) {
    e.preventDefault();
    if (user.length === 0 && password.length === 0) {
      message.error("Don't let username and password empty!");
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
            localStorage.setItem("rememberuser", JSON.stringify(data));
          } else {
            localStorage.setItem("rememberuser", null);
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
            <Button
              onClick={loginWithGG}
              className="btn col-md-12 mt-2"
              type="button"
              variant="danger"
            >
              <FaGooglePlus color="white" size="22px" /> Login with Google
              Account
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
