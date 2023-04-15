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
import "./register.scss";
import { useNavigate, Link } from "react-router-dom";
import { callRegister } from "../../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
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
        <Typography.Title>Tạo mới tài khoản</Typography.Title>
        <Divider></Divider>
        <Form.Item
          label="Họ và tên:"
          name="fullName"
          rules={[
            {
              required: true,
              message: "fullname không được để trống"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email:"
          name="email"
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

        <Form.Item
          label="Phone:"
          name="phone"
          rules={[
            {
              required: true,
              message: "phone không được để trống"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng ký
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        <p className="text text-normal">
          Đã có tài khoản ?
          <span>
            <Link to="/login"> Đăng nhập</Link>
          </span>
        </p>
      </Form>
    </div>
  );
};

export default RegisterPage;
