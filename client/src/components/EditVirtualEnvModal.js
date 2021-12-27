import {Component} from "react";
import Modal from "antd/es/modal/Modal";
import {Input} from "antd";

export class EditVirtualEnvModal extends Component {

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
        this.props.closeModalHandler()
    }

    render() {
        return (
            <div>
                <Modal title="sdsad" visible={this.props.visible} onOk={this.onCloseHandler} onCancel={this.onCloseHandler}>

                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
}