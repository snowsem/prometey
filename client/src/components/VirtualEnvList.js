import {Component} from "react";
import {Button, PageHeader, Table, Tag, Progress} from "antd";
import {Modal} from "antd/es/modal/Modal";
import {
    ReloadOutlined,
    CheckCircleOutlined,
    FieldTimeOutlined,
    SyncOutlined,
    DeleteOutlined
} from '@ant-design/icons';



const issueStatusComponent = (status) => {
    let result;
    switch (status) {
        case 'pending': result = <Tag  icon={<SyncOutlined spin />} color="default">{status}</Tag>; break;
        case 'wait_pr': result = <Tag  icon={<SyncOutlined spin />} color="default">{status}</Tag>; break;
        case 'ready': result = <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag>; break;
        case 'wait_delete': result = <Tag icon={<DeleteOutlined spin /> } color="warning">{status}</Tag>; break;
        case 2: result = <Progress width={40} type="circle" percent={20} />; break;
        default:
            result = <Progress width={40} type="circle" percent={100} status="exception" />;
    }

    return result;

}


export class VirtualEnvList extends Component{
    render() {
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
                render(text, record) {

                    return {
                        props: {
                            style: {
                                // background: '#fefefe',
                                // borderRightWidth: 2
                            }
                        },
                        children: <div>{issueStatusComponent(record.status)}</div>
                    };
                },
            },
            {
                title: 'Created at',
                dataIndex: 'created_at',
                key: 'created_at',
            },
            {
                title: 'Action',
                key: 'delete',
                dataIndex: 'delete',
                render: (text, record) => (
                    <a type="primary" onClick={(e)=> {
                        e.stopPropagation();
                        this.props.openDeleteModal(record.id);
                        console.log('record')
                    }}>
                        Delete
                    </a>
                ),
            },
        ];

        return (
            <div>
                <PageHeader title={"Virtual Envs"} subTitle={"List"} extra={[
                    <Button onClick={this.props.openModal} type={"primary"} icon={<ReloadOutlined/>} key="1">Create Env</Button>,
                ]}/>
                <Table
                    onRow={(r) => ({
                        onClick: () => this.props.openEditModal(r.id),
                    })}
                    loading={this.props.isLoading}
                    onChange={this.props.handleChange}
                    pagination={{
                        total: this.props.data.total // total count returned from backend
                    }}
                    dataSource={this.props.data.data}
                    showHeader bordered columns={columns}
                />
            </div>

        );
    }
}
