import React, { useEffect } from 'react';
import { Form } from 'antd';
import ServiceInput from './ServiceInput';
import { IMicroInfraServices } from '../models/MicroInfraServices';
import { VirtualEnvServicesPayload } from '../common/api/virtualEnv';

interface IProps {
  id: string;
  onFinish: (values: VirtualEnvServicesPayload) => void;
  virtualEnvServices: IMicroInfraServices;
}

function ServicesForm({ id, onFinish, virtualEnvServices }: IProps) {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, virtualEnvServices]);

  // const initialValues = virtualEnvServices?.reduce((acc, item) => {
  //   acc[item.id] = item.def;
  //   return acc;
  // }, {}) ?? {};

  return (
    <Form
      form={form}
      id={id}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        // ...initialValues,
        remember: false,
      }}
      autoComplete="off"
    >
      {virtualEnvServices
        ?.sort((a, b) => (a.name > b.name ? 1 : -1))
        ?.map((service) => (
          <ServiceInput
            key={service.name}
            service_name={service.name}
            id={service.name}
            default_tag={service.default_tag}
          />
        ))}
    </Form>
  );
}

export default ServicesForm;
