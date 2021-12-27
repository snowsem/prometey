import {Component} from "react";
import Modal from "antd/es/modal/Modal";
import {Input} from "antd";

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

    render() {
        return (
            <div>
                <Modal title="Create Env" visible={this.props.visible} onOk={this.onCloseHandler} onCancel={this.onCloseHandler}>
                    <p><Input
                        placeholder="Basic usage"
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