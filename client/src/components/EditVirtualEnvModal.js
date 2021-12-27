import React, {Component} from "react";
import Modal from "antd/es/modal/Modal";
import {Layout, Form, Button, notification} from "antd";
import ServiceInput from "./ServiceInput";

export class EditVirtualEnvModal extends Component {
    constructor() {
        super();
        this.state = {
            name: null
        }
    }

    onFinish = async (values) => {
        const payload = Object.entries(values).map(([id, service_github_tag]) => ({ id, service_github_tag }));
        const url = `http://localhost:8888/virtual_env/${this.props.data?.id}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ virtualEnvServices: payload }),
        });
        if (response.status < 400) {
            notification.success({
                message: 'Tags are saved',
            });
            this.props.closeModalHandler();
        } else {
            notification.error({
                message: 'Oops',
                description: 'Something went wrong. Try again later',
            });
        }
    };
    componentDidMount() {
        this.setState((state)=>{
            return {name: null}
        });
    }

    onCloseHandler = ()=>{
        this.setState((state)=>{
            return {...state, name: null}
        });
        this.props.closeModalHandler()
    };

    render() {
        const initialValues = this.props.data?.virtualEnvServices.reduce((acc, item) => {
           acc[item.id] = item.service_github_tag;
           return acc;
        }, {});
        return (
            <div>
                <Modal
                    okButtonProps={{form:'tag-editor-form', key: 'submit', htmlType: 'submit'}}
                    width={1000}
                    title={this.props.data?.title}
                    visible={this.props.visible}
                    onCancel={this.onCloseHandler}
                >
                    <Layout style={{ "background-color": "#fff" }}>
                        <Form
                            id='tag-editor-form'
                            onFinish={this.onFinish}
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{
                                ...initialValues,
                                remember: false,
                            }}
                            autoComplete="off"
                        >
                         {this.props.data?.virtualEnvServices
                             .sort((a, b) => a.service_name > b.service_name ? 1 : -1)
                             .map((service) => <ServiceInput service={service}/>)}
                        </Form>
                    </Layout>
                </Modal>
            </div>
        );
    }
}
