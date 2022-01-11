import {Component} from "react";
import {VirtualEnvList} from "../components/VirtualEnvList";
import axios from "axios";
import {CreateVirtualEnvModal} from "../components/CreateVirtualEnvModal";
import {EditVirtualEnvModal} from "./EditVirtualEnvModal";
import {ConformModal} from "../components/ConformModal";
import { notification } from 'antd';
import {setWsHeartbeat} from "ws-heartbeat/client";
import io from 'socket.io-client'
//const ws = new WebSocket('ws://localhost:8888')
let socket = io.connect('ws://localhost:8888', {
    reconnect: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 10
})

let countConnected = 0;


// setWsHeartbeat(ws, '{"kind":"ping"}', {
//     pingTimeout: 6000, // in 60 seconds, if no message accepted from server, close the connection.
//     pingInterval: 2000, // every 25 seconds, send a ping message to the server.
// });

export class VirtualEnvContainer extends Component {
    constructor() {
        super();

        //this.io = io.connect('ws://localhost:8888', {reconnect: true})

        this.api = axios.create({
            baseURL: 'http://localhost:8888/',
            timeout: 5000,
            //headers: {'X-Custom-Header': 'foobar'}
        })
        this.state = {
            virtualEnv:{},
            isLoading: true,
            showCreateModal: false,
            showEditModal: false,
            editModalData: null,
            idToDelete: null,
        }
    }

    openCreateModal = ()=>{
        this.setState((state)=>{
            return {showCreateModal:true}
        });
    }

    applyCreateModal = (data) =>{
        if (this.state.virtualEnv?.data === undefined) return;
        this.setState({ virtualEnv: {
            ...this.state.virtualEnv,
            data: [data, ...this.state.virtualEnv.data]
            },
        });
    }

    closeCreateModal = () =>{
        this.setState((state)=>{
            return {showCreateModal:false}
        });
    }

    getAllVirtualEnv = async (offset = 0, limit = 10, params = false)=>{
        const queryParams = new URLSearchParams();
        queryParams.append("offset", offset);
        queryParams.append("limit", limit);

        if(params && params.order) {
            queryParams.append("order", JSON.stringify(params.order));
        }

        this.setState((state)=>{
            return {isLoading:true}
        });
        const response = await this.api.get(`/virtual_env?${queryParams.toString()}`)
        this.setState(()=>{
            return {virtualEnv: response.data, isLoading:false}
        });
    }

    handleChange = async (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter)
        //const offset = pagination.current * pagination.pageSize - pagination.pageSize;
        const offset = pagination.current - 1;
        const limit = pagination.pageSize;
        const params = {};

        if (sorter.hasOwnProperty("column")) {
            params.order = { field: sorter.field, dir: sorter.order };
        }

        await this.getAllVirtualEnv(offset, limit, params);
    };

    handleWsUpdateVirtualEnv(data) {
        console.log(this.state.virtualEnv.data)
        if (this.state.virtualEnv?.data === undefined) return;
        const newState = this.state.virtualEnv.data.map(venv=>{
            if (venv.id === data.id) {
                return data
            } else {
                return venv
            }
        })

        this.setState({ virtualEnv: {
                ...this.state.virtualEnv,
                data: [...newState]
            },
        });
    }


    componentDidMount() {

        socket.on('connect', function (socket) {

            countConnected++;
            if (countConnected>1) {
                notification.info({
                    message: 'WS CLIENT',
                    description: 'Connect restored',
                });
            }
            console.log('Connected!')
        });

        socket.on('broadcast', (msg)=>{
            const message = (msg);
            if (message.type === 'updateVirtualEnv'){
                this.handleWsUpdateVirtualEnv(message.data)
                //console.log(JSON.parse(evt.data))
            }
            console.log('broadcast', message.data)
        })

        socket.on('disconnect', (reason) => {
            console.log("client disconnected");
            if (reason === 'io server disconnect') {
                notification.error({
                    message: 'WS CLIENT',
                    description: 'Disconnected',
                });
                // the disconnection was initiated by the server, you need to reconnect manually
                console.log("server disconnected the client, trying to reconnect");
                socket.connect();
            }else{
                notification.warning({
                    message: 'WS CLIENT',
                    description: 'trying to reconnect again with server',
                });
                console.log("trying to reconnect again with server");
            }
            // else the socket will automatically try to reconnect
        });

        socket.on('error', (error) => {
            console.log(error);
        });

        setTimeout(async ()=>{
            await this.getAllVirtualEnv()
        }, 1000);

    }

    openEditModal = async (id)=>{
        this.setState((state)=>{
            return {isLoading:true}
        });
        const data = await this.api.get(`/virtual_env/${id}`);
        console.log('!!!.data', data);
        this.setState(()=>{
            return {showEditModal: true, editModalData: data.data.data, isLoading:false}
        });
    }

    closeEditModal = async ()=>{
        this.setState(()=>{
            return {showEditModal: false, editModalData: null}
        });
    }

    render() {
        return (
            <div>
                <VirtualEnvList
                    openEditModal={this.openEditModal}
                    openModal={this.openCreateModal}
                    handleChange={this.handleChange}
                    isLoading={this.state.isLoading}
                    data={this.state.virtualEnv}
                    openDeleteModal={(id) => this.setState({ idToDelete: id })}
                />
                <CreateVirtualEnvModal
                    visible={this.state.showCreateModal}
                    closeModal={this.closeCreateModal}
                    applyCreateModal={this.applyCreateModal}
                />
                <ConformModal
                    title="Delete this env?"
                    visible={this.state.idToDelete !== null}
                    onOkHandler={async () => {
                        const id = this.state.idToDelete;
                        const url = `http://localhost:8888/virtual_env/${id}`;
                        try {
                            const resp = await fetch(url, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ title: this.state.name }),
                            });
                            if (resp.status >= 400) {
                                throw Error('Couldn\'t delete item');
                            }
                            this.setState({ virtualEnv: {
                                    ...this.state.virtualEnv,
                                    data: this.state.virtualEnv.data.filter(({ id: _id }) => _id !== id )
                                },
                            });
                        } catch (e) {
                            notification.error({
                                message: 'Oops',
                                description: 'Something went wrong. Try again later',
                            });
                        }
                        this.setState({ idToDelete: null });
                    }}
                    onCloseHandler={() => {
                        this.setState({ idToDelete: null })
                    }}
                />
                <EditVirtualEnvModal
                    data={this.state.editModalData}
                    visible={this.state.showEditModal}
                    openModalHandler={this.openEditModal}
                    closeModalHandler={this.closeEditModal}
                />
            </div>
    );
    }
}
