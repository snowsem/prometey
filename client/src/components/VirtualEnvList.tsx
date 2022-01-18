import React from 'react';
import {
  Button, PageHeader, Progress, Table, Tag,
} from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import { IVirtualEnv, VirtualEnvStatus } from '../models/VirtualEnv';
import { IVirtualEnvsResponse } from '../common/api/virtualEnv';

interface IProps {
  openEditModal: (id: string) => void;
  openDeleteModal: (id: string) => void;
  openModal: () => void;
  isLoading: boolean;
  handleChange: (pagination: TablePaginationConfig, filters: any, sorter: any) => void;
  virtualEnvsResponse: IVirtualEnvsResponse;
}

const issueStatusComponent = (status: VirtualEnvStatus) => {
  let result;
  switch (status) {
    case 'pending': result = <Tag icon={<SyncOutlined spin />} color="default">{status}</Tag>; break;
    case 'wait_pr': result = <Tag icon={<SyncOutlined spin />} color="default">{status}</Tag>; break;
    case 'ready': result = <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag>; break;
    case 'wait_delete': result = <Tag icon={<DeleteOutlined spin />} color="warning">{status}</Tag>; break;
    default:
      result = <Progress width={40} type="circle" percent={100} status="exception" />;
  }

  return result;
};

export function VirtualEnvList(props: IProps) {
  const {
    openDeleteModal,
    openModal,
    openEditModal,
    isLoading,
    handleChange,
    virtualEnvsResponse,
  } = props;

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render(text: string, record: IVirtualEnv) {
        return {
          props: {
            style: {
              // background: '#fefefe',
              // borderRightWidth: 2
            },
          },
          children: <div>{issueStatusComponent(record.status)}</div>,
        };
      },
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Owner',
      dataIndex: 'user',
      key: 'user',
      render: (text: string, record: IVirtualEnv) => (
        record.user?.email
      ),
    },
    {
      title: 'Action',
      key: 'delete',
      dataIndex: 'delete',
      render: (text: string, record: IVirtualEnv) => (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <a
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal(record.id);
            console.log('record');
          }}
        >
          Delete
        </a>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Virtual Envs"
        subTitle="List"
        extra={[
          <Button onClick={openModal} type="primary" icon={<ReloadOutlined />} key="1">
            Create
            Env
          </Button>,
        ]}
      />
      <Table
        onRow={(r) => ({
          onClick: () => openEditModal(r.id),
        })}
        loading={isLoading}
        onChange={handleChange}
        pagination={{
          total: virtualEnvsResponse.total, // total count returned from backend
        }}
        dataSource={virtualEnvsResponse.data}
        showHeader
        bordered
        columns={columns}
      />
    </div>

  );
}
