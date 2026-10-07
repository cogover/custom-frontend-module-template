import { createAsyncThunk } from '@reduxjs/toolkit';
import http, { SuccessResponse, SuccessServiceResponse } from '../apiBase';
import { PublicConfig, ServerConfig, ServerConfigParams, SessionConfigParams } from './config.type';
import { AxiosProgressEvent } from 'axios';
import { createServiceHeader, REQUEST_TYPE } from 'src/utils/apiUtils';
const URI = '/api/v1';

export const serverConfigURI = {
    configServer: `${URI}/config-server`,
    index: `${URI}/config`,
    public: `${URI}/config/public`,
};

export const configApi = {
    checkSession(params: SessionConfigParams) {
        return http.post<SuccessServiceResponse<unknown>>(serverConfigURI.configServer, params, {
            headers: createServiceHeader({ service: 2, type: 2 }),
        });
    },
    getPublicConfig() {
        return http.get<SuccessResponse<PublicConfig>>(serverConfigURI.public);
    },
    getServerConfig(params: ServerConfigParams, onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void) {
        return http.post<SuccessResponse<ServerConfig>>(serverConfigURI.index, params, {
            onDownloadProgress: onDownloadProgress,
        });
    },
    getServerConfigRpc(params: ServerConfigParams, onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void) {
        // Type 9 (`REQUEST_TYPE.TS_PROJECT`) giống end-user: trả nguyên body của backend (`SuccessResponse`),
        // không bọc trong `body`.
        return http.post<SuccessResponse<ServerConfig>>(serverConfigURI.configServer, params, {
            onDownloadProgress: onDownloadProgress,
            headers: createServiceHeader({ service: 3, type: REQUEST_TYPE.TS_PROJECT }),
        });
    },
};

export const publicConfigThunk = createAsyncThunk(
    'commonSettings/publicConfigThunk',
    async (_, { rejectWithValue }) => {
        try {
            const response = await configApi.getPublicConfig();
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const configApiKeys = {
    GET_SERVER_CONFIG: 'GET_SERVER_CONFIG',
};
