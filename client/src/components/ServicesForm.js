import React, { useEffect } from 'react';
import {Form} from "antd";
import ServiceInput from "./ServiceInput";

function ServicesForm({ id, onFinish, virtualEnvServices }) {

    const [form] = Form.useForm();
    useEffect(() => form.resetFields(), [virtualEnvServices]);

    const initialValues = virtualEnvServices?.reduce((acc, item) => {
        acc[item.id] = item.service_github_tag;
        return acc;
    }, {}) ?? {};

    return (
        <Form
            form={form}
            id={id}
            onFinish={onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
                ...initialValues,
                remember: false,
            }}
            autoComplete="off"
        >
            {virtualEnvServices
                ?.sort((a, b) => a.service_name > b.service_name ? 1 : -1)
                ?.map((service) => <ServiceInput key={service?.id} service_name={service.service_name} id={service.service_name} default_tag={service.default_tag} />)}
        </Form>
    )
}

export default ServicesForm;
