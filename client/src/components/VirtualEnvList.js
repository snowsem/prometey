import {Component} from "react";
import {Button, PageHeader, Table, Tag} from "antd";
import {Modal} from "antd/es/modal/Modal";
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ReloadOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
    UserOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';



const issueStatusComponent = (status) => {
    let result;
    switch (status) {
        case 'pending': result = <Tag  icon={<FieldTimeOutlined />} color="default">{status}</Tag>; break;
        case 'ready': result = <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag>; break;
        case 2: result = <Tag icon={<ClockCircleOutlined />} color="processing">{status}</Tag>; break;
        default:
            result = <Tag icon={<MinusCircleOutlined />} color="default">{status}</Tag>;
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
                key: 'delete',
                dataIndex: 'delete',
                render: (text, record) => (
                    <Button type="primary" onClick={(e)=> {
                        e.stopPropagation();
                        this.props.openDeleteModal(record.id);
                        console.log('record')
                    }}>
                        Delete
                    </Button>
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
