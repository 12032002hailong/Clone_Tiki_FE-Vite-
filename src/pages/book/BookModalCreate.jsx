import React, { useEffect, useState } from 'react'
import { callFetchCategory, callUploadBookImg } from '../../services/api'
import { Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const BookModalCreate = (props) => {

    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([]);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");
    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewImage, setPreviewImage] = useState();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState();

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])


    const onFinish = async (values) => {



        return;

        const { fullName, password, email, phone } = values;
        setIsSubmit(true);
        const res = await callCreateAUser(fullName, password, email, phone);

        if (res && res.data) {
            message.success("Tạo mới người dùng thành công");
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchUser();


        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }


    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === `image/jpeg` || file.type === `image/png`;
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M
    }

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            })
        }
    }

    const handleUploadFile = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    }
    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    }

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexof('/') + 1));
        })
    }

    return (
        <>
            <Modal
                title="Thêm mới sách"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCreate(false)

                }}
                okText={"Tạo mới"}
                cancelText={"Huỷ"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name='basic'
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete='off'
                >
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ widh: `100%` }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: "Vui lòng nhập thể loại!" }]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: `100%` }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                                rules={[{ required: true, message: "Vui lòng nhập số lượng đã bán!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    defaultValue={0}
                                    style={{ width: `100%` }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"

                            >
                                <Upload
                                    name='thumbnail'
                                    listType='picture-card'
                                    className='avartar-uploader'
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"

                            >
                                <Upload
                                    multiple
                                    name='slider'
                                    listType='picture-card'
                                    className='avartar-uploader'
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt='example' style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default BookModalCreate
