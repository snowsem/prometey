import React from 'react';
import { Form, Input } from 'antd';

function ServiceInput({ service }) {
    return (
        <Form.Item
            label={service.service_name}
            name={service.id}
            rules={[{ required: false, message: 'default' }]}
        >
            <Input placeholder="default tag" />
        </Form.Item>
    )
}

export default ServiceInput;
