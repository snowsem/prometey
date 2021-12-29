import React from "react";
import Modal from "antd/es/modal/Modal";
import {Input, notification, Table, Button} from "antd";
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';

function RowWithCopy({ text, record }) {
    const [hovered, setHovered] = React.useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
                onClick={() => {
                    copy(text);
                    notification.success({
                        message: 'Text copied',
                    });
                }}
            >
                <CopyOutlined/>
            </Button>
        </div>
    )
}

export function EditVirtualEnvModal(props) {
    const { closeModalHandler, data, visible } = props;
    const [githubTagsByServiceId, setGithubTags] = React.useState({});

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
        },
        {
            title: 'Tag',
            dataIndex: 'service_github_tag',
            key: 'service_github_tag',
            render: (text, record) => (
                <Input placeholder={'default tag'} defaultValue={text} onChange={(e) => {
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
            render: (text, record) => (
                <RowWithCopy text={text} record={record} />
            ),
        },
        {
            title: 'Header value',
            dataIndex: 'service_header_value',
            key: 'service_header_value',
            render: (text, record) => (
                <RowWithCopy text={text} record={record} />
            ),
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
