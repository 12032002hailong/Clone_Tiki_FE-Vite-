import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, message, notification } from 'antd';
import InputSearchBook from './InputSearchBook';
import { current } from '@reduxjs/toolkit';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import moment from 'moment/moment';
import { callFetchListBook } from '../../services/api';
import BookViewDetail from './BookViewDetail';


const BookPage = () => {

  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [sortQuery, setSortQuery] = useState("");
  const [filter, setFilter] = useState("");

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState();


  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);


  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total)
    }

    setIsLoading(false)
  }

  const handleSearch = (query) => {
    setFilter(query)
  }




  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Table List Book</span>
        <span style={{ display: 'flex', gap: 15 }}>
          <ReloadOutlined />
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
      },
      sorter: true

    },
    {
      title: 'Tên sách',
      dataIndex: 'mainText',
      sorter: true

    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      sorter: true

    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      sorter: true
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      sorter: true
    },
    {
      title: 'Action',
      width: 150,
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
    } BookPage

    console.log('params', pagination, filters, sorter, extra);
  };



  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearchBook
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
            dataSource={listBook}
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
      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}

      />
    </>
  )

}

export default BookPage;