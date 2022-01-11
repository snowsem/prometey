import React from 'react';
import { Form, Input } from 'antd';

function ServiceInput({ service_name, id, default_tag }) {
    return (
        <Form.Item
            label={service_name}
            name={id}
            rules={[{ required: false, message: 'default' }]}
        >
            <Input placeholder={`Default tag ${default_tag}`}/>
        </Form.Item>
    )
}

export default React.memo(ServiceInput);
