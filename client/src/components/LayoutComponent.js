import {Component} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;


export class LayoutComponent extends Component {
    render() {
        return (
            <div>
                <Layout className="layout" style={{minHeight:"100vh"}}>
                    <Header>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">VirtualEnv</Menu.Item>
                            { this.props.mainState.isAuth && <Menu.Item onClick={this.props.logout} key="2">Logout</Menu.Item> }

                        </Menu>
                    </Header>
                    <Content style={{padding: '0 50px'}}>
                        <div className="site-layout-content" >
                        {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>©2022 Created by Semen</Footer>
                </Layout>
            </div>
        );
    }
}