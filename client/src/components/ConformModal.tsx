import React from 'react';
import Modal from 'antd/es/modal/Modal';

interface IProps {
  title: string,
  visible: boolean,
  onOkHandler: () => void,
  onCloseHandler: () => void,
}

function ConformModal({
  title,
  visible,
  onOkHandler,
  onCloseHandler,
}: IProps) {
  return (
    <div>
      <Modal title="Please confirm" visible={visible} onOk={onOkHandler} onCancel={onCloseHandler}>
        <p>{title}</p>
      </Modal>
    </div>
  );
}

export {
  ConformModal,
};
