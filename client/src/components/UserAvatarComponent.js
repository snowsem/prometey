import React from "react";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";

export class UserAvatarComponent extends React.Component {
    render() {
        if (this.props.children && this.props.children.avatar) {
            return (
                <div><Avatar size={25} src={this.props.children.avatar} /> {this.props.children.email} </div>
            );
        }

        return (<div> <Avatar size={25} icon={<UserOutlined />} />empty</div>);

    }
}

