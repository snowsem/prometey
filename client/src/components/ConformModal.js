import {Component} from "react";
import Modal from "antd/es/modal/Modal";

export class ConformModal extends Component {


    render() {
        return (
            <div>
                <Modal title="Please confirm" visible={this.props.visible} onOk={this.props.onOkHandler} onCancel={this.props.onCloseHandler}>
                    <p>{this.props.title}</p>
                </Modal>
            </div>
        );
    }
}
