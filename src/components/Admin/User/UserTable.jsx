import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd';
import InputSearch from './InputSearch';
import { current } from '@reduxjs/toolkit';
import { callDeleteUser, callFetchListUser } from '../../../services/api';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';
import UserModalCreate from './UserModalCreate';
import UserImport from './data/UserImport';
import * as XLSX from 'xlsx';
import UserModalUpdate from './UserModalUpdate';


const UserTable = () => {

    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [sortQuery, setSortQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState();
    const [dataViewDetail, setDataViewDetail] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false)
    const [dataUpdate, setDataUpdate] = useState();

    const [openModalImport, setOpenModalImport] = useState(false);

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
        setFilter(query)
    }

    const handleExportData = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    }

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Xoá người dùng thành công');
            fetchUser();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type='primary'
                        onClick={() => handleExportData()}
                    >Export
                    </Button>
                    <Button
                        icon={<CloudUploadOutlined />}
                        type='primary'
                        onClick={() => setOpenModalImport(true)}
                    >Import
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type='primary'
                        onClick={() => setOpenModalCreate(true)}
                    >Add new
                    </Button>
                    <Button type='ghost' onClick={() => {
                        setFilter("");
                        setSortQuery("");
                        fetchUser();
                    }}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
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
                        <Popconfirm
                            placement='left-top'
                            title={"Xác nhận xoá User"}
                            description={"Bạn có chắc chắn xoá User này chứ ?"}
                            onConfirm={() => handleDeleteUser(record._id)}
                            onText="Xác nhận"
                            cancelText="Huỷ"
                        >
                            <span style={{ cursor: "pointer", margin: "0 20px" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>

                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModalUpdate(true)
                                setDataUpdate(record)
                            }}
                        />
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
                        title={renderHeader}
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
                                total: total,
                                showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} rows</div>) }
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
            <UserModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
            />
            <UserModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

            <UserImport
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
            />
        </>
    )

}

export default UserTable;