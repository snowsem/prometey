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

    React.useEffect(async () => {
        if (!visible) return;
        setLoading(true);
        if (!visible) return;
        setLoading(true);

        const availableServices = await props.api.getServices();

        if (availableServices.status < 400) {
            console.log(availableServices)
            setServiceNames(availableServices?.data?.data ?? []);
            setLoading(false)
        }
        setLoading(false)

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

        let arrayServices = [];
        const githubTagByServiceName = Object.entries(values).reduce((acc, [serviceName, tag]) => {
            if (tag) {
                arrayServices.push({
                    service_name: serviceName,
                    service_github_tag: tag
                })
            }
            return acc;
        }, {});

        try {
            const response = await props.api.createVirtualEnv({
                title: name,
                virtualEnvServices: arrayServices,
            })
            applyCreateModal(response.data);
            closeModal();
        } catch (e) {
            if (e.response && e.response.data.statusCode) {
                notification.error({
                    message: 'Oops',
                    description: e.response.data?.message?.[0] ?? 'Something went wrong. Try again later',
                });
            } else {
                console.log(e.response)
                notification.error({
                    message: 'Oops',
                    description: 'Something went wrong. Try again later',
                });
            }
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
