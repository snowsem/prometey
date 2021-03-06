import logo from './logo.svg';
import './App.css';
import {LayoutComponent} from "./components/LayoutComponent";
import {VirtualEnvContainer} from "./containers/VirtualEnvContainer";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Routes,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";


import GoogleLogin from "react-google-login";
import axios, {AxiosResponse} from "axios";
import {Component} from "react";

import env from "react-dotenv";
import {apiClient} from "./apiClient";
import {notification} from "antd";

export const getToken = ()=>{
    const token = localStorage.getItem('auth_token');
    return token;
}

class App extends Component {

    constructor(props) {
        super(props);
        console.log('client', env.GOOGLE_CLIENT_ID)
        this.state = {
            user: null,
            apiToken: null,
            isAuth: false
        }
        console.log('success');

        this.api = new apiClient();
    }

    setAuthHeader = (token)=>{
        this.api.setAuthHeader(token)
    }

    componentDidMount = async ()=> {
        const isAuth = await this.checkAuth()
        console.log('auth:', isAuth)
        this.setState({...this.state, isAuth:isAuth})
    }

    onFailureAuth = async (res) => {
        console.log('error auth', res)
    }

    checkAuth = async ()=>{
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return false

            this.setAuthHeader(token)
            const result = await this.api.getMe()
            console.log('aaa', result)
            this.setState({...this.state, user:result})
            console.log('aaa', result)

            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('e',e)
            return false;
        }
    }

    logout = ()=>{
        localStorage.removeItem('auth_token');
        this.setState({...this.state, isAuth:false})
    }


    onSuccessAuth = async (res) => {
        try {
            const result = await this.api.authGoogle(res?.tokenId);
            console.log('auth onSuccessAuth', result);
            this.setState({...this.state, user:result.data.user, isAuth: true})
            await this.checkAuth()
            this.setAuthHeader(result.data.token)
            localStorage.setItem('auth_token', result.data.token);

        } catch (err) {
            notification.error({
                message: 'Auth error',
                description: err.response.data.message,
            });
            console.log(err.response.data.message);
        }
    };

    render() {
        return (
            <div>
                <div className="App">
                    <Router>
                        <div>
                            <LayoutComponent mainState={this.state} logout={this.logout}>
                                    {!this.state.isAuth && (
                                        <div className={"google"}>
                                            <GoogleLogin

                                                clientId={env.GOOGLE_CLIENT_ID}
                                                onSuccess={this.onSuccessAuth}
                                                onFailure={this.onFailureAuth}
                                            />
                                        </div>
                                    )}

                                    {this.state.isAuth && (
                                        <>
                                            <VirtualEnvContainer api={this.api}/>
                                        </>
                                    )}
                            </LayoutComponent>
                        </div>
                    </Router>

                </div>
            </div>
        );
    }
}

export default App;
