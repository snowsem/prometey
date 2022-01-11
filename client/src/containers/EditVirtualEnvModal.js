import React from "react";
import Modal from "antd/es/modal/Modal";
import {Input, notification, Table, Button} from "antd";
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';

function RowWithCopy({ text, hovered }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <span>{text}</span>
            <Button
                style={{
                    opacity: hovered ? 1 : 0,
                }}
                type="link"
            >
                <CopyOutlined/>
            </Button>
        </div>
    )
}

export function EditVirtualEnvModal(props) {
    const { closeModalHandler, data, visible } = props;
    const [githubTagsByServiceId, setGithubTags] = React.useState({});
    const [serviceNameHovered, setServiceNameHovered] = React.useState(null);
    const [serviceValueHovered, setServiceValueHovered] = React.useState(null);

    const onOkHandler = async () => {
        const payload = Object.entries(githubTagsByServiceId).map(([id, service_github_tag]) => ({ id, service_github_tag }));
        const url = `http://localhost:8888/virtual_env/${data?.id}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ virtualEnvServices: payload }),
        });
        if (response.status < 400) {
            notification.success({
                message: 'Tags are saved',
            });
            closeModalHandler();
        } else {
            notification.error({
                message: 'Oops',
                description: 'Something went wrong. Try again later',
            });
        }
    };

    const onCloseHandler = ()=>{
        closeModalHandler()
    };

    const columns = [
        {
            title: 'Service',
            dataIndex: 'service_name',
            key: 'service_name',
            style: {cursor: "pointer"},
        },
        {
            title: 'Tag',
            dataIndex: 'service_github_tag',
            key: 'service_github_tag',
            render: (text, record) => (
                <Input key={record.id} placeholder={'default tag'} defaultValue={text} onChange={(e) => {
                    setGithubTags({
                        ...githubTagsByServiceId,
                        [record.id]: e.target.value,
                    });
                }} />
            ),
        },
        {
            title: 'Header name',
            dataIndex: 'service_header',
            key: 'service_header',
            className: 'pointer',
            render: (text, record) => (
                <RowWithCopy text={text} record={record} hovered={serviceNameHovered === record.id} />
            ),
            onCell: (record) => ({
                onMouseEnter: () => setServiceNameHovered(record.id),
                onMouseLeave: () => setServiceNameHovered(null),
                onClick: () => {
                    copy(record.service_header_value);
                    notification.success({
                        message: 'Header name copied',
                    });
                }
            })
        },
        {
            title: 'Header value',
            dataIndex: 'service_header_value',
            key: 'service_header_value',
            className: 'pointer',
            render: (text, record) => (
                <RowWithCopy text={text} record={record} hovered={serviceValueHovered === record.id} />
            ),
            onCell: (record) => ({
                onMouseEnter: () => setServiceValueHovered(record.id),
                onMouseLeave: () => setServiceValueHovered(null),
                onClick: () => {
                    copy(record.service_header_value);
                    notification.success({
                        message: 'Header value copied',
                    });
                }
            })
        },
    ];


    return (
        <div>
            <Modal
                width={1000}
                title={data?.title}
                visible={visible}
                onCancel={onCloseHandler}
                onOk={onOkHandler}
                destroyOnClose
            >
                <Table
                    dataSource={data?.virtualEnvServices.sort((a, b) => a.service_name > b.service_name ? 1 : -1)}
                    columns={columns}
                    showHeader
                    bordered
                />
            </Modal>
        </div>
    );
}
