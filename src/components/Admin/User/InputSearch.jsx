import React, { useState } from "react";

import { Button, Col, Form, Input, Row, theme, Space } from "antd";
import { values } from "lodash";

const InputSearch = (props) => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        let query = '';
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`
        }
        if (values.email) {
            query += `&email=/${values.email}/i`
        }
        if (values.phone) {
            query += `&phone=/${values.phone}/i`
        }

    }

    return (
        <>
            <Form form={form} name="advanced_search"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`fullName`}
                            label={`Name`}
                        >
                            <Input
                                placeholder="Full Name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`email`}
                            label={`Email`}
                        >
                            <Input
                                placeholder="Email"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`phone`}
                            label={`Số điện thoại`}
                        >
                            <Input
                                placeholder="Phone"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Space
                    wrap
                >
                    <Button type="primary">Search</Button>
                    <Button>Clear</Button>

                </Space>
            </Form >
        </>
    );
};


export default InputSearch;