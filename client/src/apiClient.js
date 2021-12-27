import axios from "axios";

export class apiClient {
    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:8888/',
            timeout: 5000,
            //headers: {'X-Custom-Header': 'foobar'}
        });
    }
}