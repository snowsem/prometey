import React, { Component } from 'react';
import { notification } from 'antd';
import io from 'socket.io-client';
import { VirtualEnvList } from '../components/VirtualEnvList';
import { CreateVirtualEnvModal } from '../components/CreateVirtualEnvModal';
import { EditVirtualEnvModal } from './EditVirtualEnvModal';
import { ConformModal } from '../components/ConformModal';
import { getVirtualEnvs, IVirtualEnvsResponse } from '../common/api/virtualEnv';

const socket = io.connect('ws://localhost:8888', {
  reconnect: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
});

let countConnected = 0;

interface IState {
  virtualEnvsResponse: IVirtualEnvsResponse;
  isLoading: boolean;
  showEditModal: boolean;
  showCreateModal: boolean;
  idToDelete: string;
  name: string,
}

interface IProps {
  api: {
    get: (url: string) => Promise<any>
  }
}

export class VirtualEnvContainer extends Component<IProps, IState> {
  state = {
    virtualEnvsResponse: {} as IVirtualEnvsResponse,
    isLoading: true,
    showCreateModal: false,
    showEditModal: false,
    editModalData: null,
    idToDelete: null,
  };

  componentDidMount() {
    socket.on('connect', () => {
      countConnected += 1;
      if (countConnected > 1) {
        notification.info({
          message: 'WS CLIENT',
          description: 'Connect restored',
        });
      }
      console.log('Connected!');
    });

    socket.on('broadcast', (msg) => {
      const message = (msg);
      if (message.type === 'updateVirtualEnv') {
        this.handleWsUpdateVirtualEnv(message.data);
      }
      console.log('broadcast', message.data);
    });

    socket.on('disconnect', (reason) => {
      console.log('client.ts disconnected');
      if (reason === 'io server disconnect') {
        notification.error({
          message: 'WS CLIENT',
          description: 'Disconnected',
        });
        // the disconnection was initiated by the server, you need to reconnect manually
        console.log('server disconnected the client.ts, trying to reconnect');
        socket.connect();
      } else {
        notification.warning({
          message: 'WS CLIENT',
          description: 'trying to reconnect again with server',
        });
        console.log('trying to reconnect again with server');
      }
      // else the socket will automatically try to reconnect
    });

    socket.on('error', (error: unknown) => {
      console.log(error);
    });

    setTimeout(async () => {
      await this.getAllVirtualEnv();
    }, 1000);
  }

  handleChange = async (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    const offset = pagination.current - 1;
    const limit = pagination.pageSize;
    const params = {};

    if (Object.prototype.hasOwnProperty.call(sorter, 'column')) {
      params.order = { field: sorter.field, dir: sorter.order };
    }

    await this.getAllVirtualEnv(offset, limit, params);
  };

  handleWsUpdateVirtualEnv(data) {
    const { virtualEnvsResponse } = this.state;
    console.log(virtualEnvsResponse.data);
    if (virtualEnvsResponse?.data === undefined) return;
    const newState = virtualEnvsResponse.data.map((venv) => {
      if (venv.id === data.id) {
        return data;
      }
      return venv;
    });

    this.setState({
      virtualEnvsResponse: {
        ...virtualEnvsResponse,
        data: [...newState],
      },
    });
  }

  getAllVirtualEnv = async (offset = 0, limit = 10, params: { order: unknown } = null) => {
    const queryParams = new URLSearchParams();
    queryParams.append('offset', offset.toString(10));
    queryParams.append('limit', limit.toString(10));

    if (params && params.order) {
      queryParams.append('order', JSON.stringify(params.order));
    }

    this.setState(() => ({ isLoading: true }));
    const response = await getVirtualEnvs(queryParams.toString());
    this.setState(() => ({ virtualEnvsResponse: response, isLoading: false }));
  };

  closeCreateModal = () => {
    this.setState(() => ({ showCreateModal: false }));
  };

  applyCreateModal = (data) => {
    const { virtualEnvsResponse } = this.state;
    if (virtualEnvsResponse?.data === undefined) return;
    this.setState({
      virtualEnvsResponse: {
        ...virtualEnvsResponse,
        data: [data, ...virtualEnvsResponse.data],
      },
    });
  };

  openCreateModal = () => {
    this.setState(() => ({ showCreateModal: true }));
  };

  openEditModal = async (id) => {
    this.setState(() => ({ isLoading: true }));
    const data = await this.props.api.get(`/virtual_env/${id}`);
    console.log('!!!.data', data);
    this.setState(() => ({ showEditModal: true, editModalData: data.data.data, isLoading: false }));
  };

  closeEditModal = async () => {
    this.setState(() => ({ showEditModal: false, editModalData: null }));
  };

  render() {
    const {
      editModalData,
      showEditModal,
      virtualEnvsResponse,
      idToDelete,
      isLoading,
      showCreateModal,
    } = this.state;

    return (
      <div>
        <VirtualEnvList
          openEditModal={this.openEditModal}
          openModal={this.openCreateModal}
          handleChange={this.handleChange}
          isLoading={isLoading}
          virtualEnvsResponse={virtualEnvsResponse}
          openDeleteModal={(id) => this.setState({ idToDelete: id })}
        />
        <CreateVirtualEnvModal
          visible={showCreateModal}
          closeModal={this.closeCreateModal}
          applyCreateModal={this.applyCreateModal}
        />
        <ConformModal
          title="Delete this env?"
          visible={idToDelete !== null}
          onOkHandler={async () => {
            const id = idToDelete;
            const url = `http://localhost:8888/virtual_env/${id}`;
            try {
              const resp = await fetch(url, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (resp.status >= 400) {
                throw Error('Couldn\'t delete item');
              }
              this.setState({
                virtualEnvsResponse: {
                  ...virtualEnvsResponse,
                  data: virtualEnvsResponse.data.filter(({ id: _id }) => _id !== id),
                },
              });
            } catch (e) {
              notification.error({
                message: 'Oops',
                description: 'Something went wrong. Try again later',
              });
            }
            this.setState({ idToDelete: null });
          }}
          onCloseHandler={() => {
            this.setState({ idToDelete: null });
          }}
        />
        <EditVirtualEnvModal
          data={editModalData}
          visible={showEditModal}
          openModalHandler={this.openEditModal}
          closeModalHandler={this.closeEditModal}
        />
      </div>
    );
  }
}
