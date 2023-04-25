import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button } from 'antd';
import InputSearch from './InputSearch';
import { current } from '@reduxjs/toolkit';
import { callFetchListUser } from '../../../services/api';
import { ReloadOutlined } from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';



const UserTable = () => {

    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [sortQuery, setSortQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(null);
    const [dataViewDetail, setDataViewDetail] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);



    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total)
        }

        setIsLoading(false)
    }

    const handleSearch = (query) => {
        setFilter(query);

    }


    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>{record._id}</a>

                )
            }

        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true

        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true

        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Button>Delete</Button>
                        <Button type='ghost' onClick={() => fetchUser()}>
                            <ReloadOutlined />
                        </Button>
                    </>

                )
            }
        }
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }

        console.log('params', pagination, filters, sorter, extra);
    };



    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter}
                    />

                </Col>

                <Col span={24} >
                    <Table
                        loading={isLoading}
                        className='def'
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total
                            }

                        }
                    >

                    </Table>

                </Col>
            </Row>
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}

            />
        </>
    )

}

export default UserTable;