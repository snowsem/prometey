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

        this.api = axios.create({
            baseURL: 'http://localhost:8888/',
            timeout: 5000,
            //headers: {'X-Custom-Header': 'foobar'}
        })
    }

    setAuthHeader = (token)=>{
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
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
            const result = await this.api.get('/auth/me')
            this.setState({...this.state, user:result.data.user})
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
        console.log('auth');
        try {
            const result = await this.api.post("/auth/google", {
                token: res?.tokenId,
            });

            this.setState({...this.state, user:result.data.user, isAuth: true})
            await this.checkAuth()
            this.setAuthHeader(result.data.token)
            localStorage.setItem('auth_token', result.data.token);

        } catch (err) {
            console.log(err);
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

                                            <GoogleLogin

                                                clientId={env.GOOGLE_CLIENT_ID}
                                                onSuccess={this.onSuccessAuth}
                                                onFailure={this.onFailureAuth}
                                            />
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
