import React from 'react';
import Modal from 'antd/es/modal/Modal';
import {
  Input, Layout, notification, Spin,
} from 'antd';

import ServicesForm from './ServicesForm';
import {
  getServices,
  postVirtualEnv,
  VirtualEnvServicesPayload,
} from '../common/api/virtualEnv';
import { IMicroInfraServices } from '../models/MicroInfraServices';
import { IVirtualEnv } from '../models/VirtualEnv';

interface IProps {
  closeModal: () => void,
  applyCreateModal: (virtualEnv: IVirtualEnv) => void,
  visible: boolean,
}

export function CreateVirtualEnvModal(props: IProps) {
  const { closeModal, applyCreateModal, visible } = props;

  const [name, setName] = React.useState(null);
  const [isLoading, setLoading] = React.useState(null);
  const [availableServices, setServices] = React.useState<IMicroInfraServices>([]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  React.useEffect(() => {
    if (!visible) return;

    setLoading(true);
    getServices().then((services) => {
      setServices(services);
    });
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      setName(null);
    }
  }, [visible]);

  const onCloseHandler = () => {
    closeModal();
  };

  const onOkHandler = async (values: VirtualEnvServicesPayload) => {
    try {
      const virtualEnv = await postVirtualEnv({
        title: name,
        virtualEnvServices: values,
      });
      applyCreateModal(virtualEnv);
      closeModal();
    } catch (err) {
      notification.error({
        message: 'Oops',
        description: err?.errors?.[0]?.title ?? 'Something went wrong. Try again later',
      });
    }
  };

  return (
    <div>
      <Modal
        okButtonProps={{
          form: 'create-tags-form',
          // key: 'submit',
          htmlType: 'submit',
        }}
        title="Create Env"
        visible={visible}
        onCancel={onCloseHandler}
        confirmLoading={!!isLoading}
      >
        {isLoading ? (<Spin />) : (
          <>
            <p>
              <Input
                placeholder="Enter env name"
                value={name}
                onChange={onChangeName}
              />
            </p>
            <Layout style={{ backgroundColor: '#fff' }}>
              <ServicesForm
                id="create-tags-form"
                virtualEnvServices={availableServices}
                onFinish={onOkHandler}
              />
            </Layout>
          </>
        )}
      </Modal>
    </div>
  );
}
