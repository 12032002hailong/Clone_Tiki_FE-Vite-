import React, { useState } from "react";

import { Button, Col, Form, Input, Row, theme, } from "antd";


const InputSearchBook = (props) => {
    const { token } = theme.useToken();

    const [form] = Form.useForm();

    const onFinish = (values) => {
        let query = "";

        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`;
        }
        if (values.author) {
            query += `&author=/${values.author}/i`;
        }
        if (values.category) {
            query += `&category=/${values.category}/i`;
        }
        if (query) {
            props.handleSearch(query);
        }

    }

    return (
        <>
            <Form
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={8} >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`mainText`}
                            label={`Name`}

                        >
                            <Input placeholder="placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={8} >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`author`}
                            label={`author`}

                        >
                            <Input placeholder="placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={8} >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`category`}
                            label={`Số điện thoại`}

                        >
                            <Input placeholder="placeholder" />
                        </Form.Item>
                    </Col>

                </Row>

                <Button type="primary" htmlType="submit"
                >
                    Search
                </Button>
                <Button
                    style={{
                        margin: '0 8px',
                    }}
                    onClick={() => {
                        form.resetFields();
                        props.setFilter("");
                    }}
                >
                    Clear
                </Button>
            </Form>
        </>
    );
};


export default InputSearchBook;