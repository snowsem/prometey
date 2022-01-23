import React from "react";
import Modal from "antd/es/modal/Modal";
import {Input, Layout, notification, Spin} from "antd";
import ServicesForm from "./ServicesForm";
import {getToken} from "../App";

export function CreateVirtualEnvModal(props) {
    const { closeModal, applyCreateModal, visible, api } = props;

    const [name, setName] = React.useState(null);
    const [isLoading, setLoading] = React.useState(null);
    const [availableServiceNames, setServiceNames] = React.useState([]);

    const onChangeName = (e)=>{
        setName(e.target.value);
    };

    React.useEffect(() => {
        if (!visible) return;

        setLoading(true);
            const url = 'http://localhost:8888/api/v1/virtual-env/get-services';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${getToken()}`
                }
            }).then((response) => {
                if (response.status < 400) {
                    response.json().then((json) => {
                        setServiceNames(json?.data ?? []);
                    }).finally(() => setLoading(false))
                }
            });
    }, [visible]);

    React.useEffect(() => {
        if (visible) {
            setName(null);
        }
    }, [visible]);

    const onCloseHandler = ()=>{
        closeModal();
    };

    const onOkHandler = async (values) => {

        const url = 'http://localhost:8888/api/v1/virtual-env';
        const githubTagByServiceName = Object.entries(values).reduce((acc, [serviceName, tag]) => {
            acc[serviceName] = tag;
            return acc;
        }, {});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: name,
                githubTagByServiceName,
            }),
        });
        const json = await response.json();
        if (response.status <= 400) {
            applyCreateModal(json);
            closeModal();
        } else {
            console.log( json)
            notification.error({
                message: 'Oops',
                description: response?.message?.[0]?.title ?? 'Something went wrong. Try again later',
            });
        }
    };

    const virtualEnvServices = React.useMemo(() => {
        return availableServiceNames.map((service) => ({ id: service.name, service_name: service.name, default_tag: service.default_tag }));
    }, [availableServiceNames]);

    return (
        <div>
            <Modal
                okButtonProps={{form:'create-tags-form', key: 'submit', htmlType: 'submit'}}
                title="Create Env"
                visible={visible}
                onCancel={onCloseHandler}
                confirmLoading={!!isLoading}
            >
                {isLoading ? (<Spin/>) : (
                    <>
                        <p>
                            <Input
                                placeholder="Enter env name"
                                value={name}
                                onChange={onChangeName}
                            />
                        </p>
                        <Layout style={{ backgroundColor: "#fff" }}>
                            <ServicesForm
                                id="create-tags-form"
                                virtualEnvServices={virtualEnvServices}
                                onFinish={onOkHandler}
                            />
                        </Layout>
                    </> )}
            </Modal>
        </div>
    );
}
