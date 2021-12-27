import {Component} from "react";
import {Button, PageHeader, Table} from "antd";
import {Modal} from "antd/es/modal/Modal";

function ReloadOutlined() {
    return null;
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
                title: 'Created at',
                dataIndex: 'created_at',
                key: 'created_at',
            },
            {
                key: 'delete',
                dataIndex: 'delete',
                render: (text, record) => (
                    <Button type="primary" onClick={(e)=> {
                        console.log('!!!.record', record);
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
