import React, { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Typography,
  message,
  notification
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLoginAction(res.data.user));
      message.success("Đăng nhập tài khoản thành công!");
      navigate("/");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        descritption:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5
      });
    }
  };

  return (
    <div className="register-page">
      <Form
        className="loginForm"
        name="basic"
        labelCol={{ span: 6 }}
        style={{ maxWidth: 600, margin: "0 auto" }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Typography.Title>Đăng Nhập</Typography.Title>
        <Divider></Divider>

        <Form.Item
          label="Email:"
          name="username"
          rules={[
            {
              required: true,
              message: "email không được để trống"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password:"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng nhập
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        <p className="text text-normal">
          Chưa có tài khoản ?
          <span>
            <Link to="/register"> Đăng ký</Link>
          </span>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
