import {Component} from "react";
import Modal from "antd/es/modal/Modal";
import {Input, notification} from "antd";

export class CreateVirtualEnvModal extends Component {

    constructor() {
        super();
        this.state = {
            name: null
        }
    }
    onChangeName = (e)=>{
        this.setState((state)=>{
            return {...state, name: e.target.value}
        });
    }
    componentDidMount() {
        console.log('mount')
        this.setState((state)=>{
            return {...state, name: null}
        });
    }

    onCloseHandler = ()=>{
        this.setState((state)=>{
            return {...state, name: null}
        });
        this.props.closeModal()
    }

    onOkHandler = async () => {
        this.setState((state)=>{
            return {...state, name: null}
        });
        const url = 'http://localhost:8888/virtual_env';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: this.state.name }),
        });
        const json = await response.json();
        if (response.status <= 400) {
            this.props.applyCreateModal(json.data);
        } else {
            notification.error({
                message: 'Oops',
                description: json?.errors?.[0]?.title ?? 'Something went wrong. Try again later',
            });
        }
        this.props.closeModal()
    }

    render() {
        return (
            <div>
                <Modal title="Create Env" visible={this.props.visible} onOk={this.onOkHandler} onCancel={this.onCloseHandler}>
                    <p><Input
                        placeholder="Enter env name"
                        value={this.state.name}
                        onChange={this.onChangeName}
                    /></p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
}
