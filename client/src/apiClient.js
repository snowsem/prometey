import axios from "axios";
import env from "react-dotenv";

export class apiClient {
    constructor() {
        this.api = axios.create({
            baseURL: env.API_HOST,
            timeout: 5000,
            //headers: {'X-Custom-Header': 'foobar'}
        });
    }

    setAuthHeader = (token)=>{
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    getServices = async ()=>{
        return await this.api.get('virtual-env/get-services')
    }

    getMe = async ()=>{
        return await this.api.get('auth/me')
    }

    authGoogle = async (token)=>{
        return await this.api.post('auth/google', {token})
    }

    getVirtualEnvs = async (limit=null, offset=null)=>{
        return await this.api.get('virtual-env', {
            params:
                {
                    limit,
                    offset
                }
        })
    }

    getVirtualEnv = async (id)=>{
        return await this.api.get(`virtual-env/${id}`)
    }

    createVirtualEnv = async (data)=>{
        return await this.api.post(`virtual-env`)
    }
}
