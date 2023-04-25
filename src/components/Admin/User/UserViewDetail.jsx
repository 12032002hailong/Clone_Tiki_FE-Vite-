import React, { useState } from 'react';
import { Badge, Descriptions, Drawer } from 'antd';
import moment from 'moment/moment';

const UserViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null)

    };

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin User"
                    bordered
                    column={2}>
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị ">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Create At" >
                        {moment(dataViewDetail?.createdAt).format("DD-MM-YYY hh:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Update At" >
                        {moment(dataViewDetail?.updatedAt).format("DD-MM-YYY hh:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default UserViewDetail;