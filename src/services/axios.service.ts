import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { config } from '@gateway/config';

export class AxiosService {

    public axios: ReturnType<typeof axios.create>;

    constructor(baseUrl: string, serviceName: string) {
        this.axios = this.axiosCreateInstance(baseUrl, serviceName);
    }

    public axiosCreateInstance(baseUrl: string, serviceName: string): ReturnType<typeof axios.create > {
        let gatewayToken = '';
        if(serviceName) {
            gatewayToken = sign({ id: serviceName}, `${config.JWT_TOKEN}`);
        }

        const instance: ReturnType<typeof axios.create> = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                gatewayToken: gatewayToken
            },
            withCredentials: true
        });
        return instance;
    }
}

const axiosTest: AxiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth');