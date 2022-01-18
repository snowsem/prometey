import React from 'react';
import { Form, Input } from 'antd';

interface IProps {
  service_name: string,
  id: string,
  default_tag: string,
}

function ServiceInput({ service_name, id, default_tag }: IProps) {
  return (
    <Form.Item
      label={service_name}
      name={id}
      rules={[{ required: false, message: 'default' }]}
    >
      <Input placeholder={`Default tag ${default_tag}`} />
    </Form.Item>
  );
}

export default React.memo(ServiceInput);
