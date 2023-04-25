import React, { useState } from "react";

import { Button, Col, Form, Input, Row, theme, } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { values } from "lodash";

const InputSearch = (props) => {
    const { token } = theme.useToken();

    const [form] = Form.useForm();

    const onFinish = (values) => {
        let query = '';
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`;

        }
        if (values.email) {
            query += `&email=/${values.email}/i`

        }
        if (values.phone) {
            query += `&phone=/${values.phone}/i`

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
                            name={`fullName}`}
                            label={`Name`}

                        >
                            <Input placeholder="placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={8} >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`email}`}
                            label={`Email`}

                        >
                            <Input placeholder="placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={8} >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name={`phone}`}
                            label={`Số điện thoại`}

                        >
                            <Input placeholder="placeholder" />
                        </Form.Item>
                    </Col>

                </Row>



                <Button type="primary" htmlType="submit"
                    onClick={(item) => props.handleSearch(item)}
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


export default InputSearch;