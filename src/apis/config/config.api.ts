import { createAsyncThunk } from '@reduxjs/toolkit';
import http, { SuccessResponse } from '../apiBase';
import { PublicConfig, ServerConfig, ServerConfigParams } from './config.type';
import { AxiosProgressEvent } from 'axios';
const URI = '/api/v1';

export const serverConfigURI = {
    index: `${URI}/config`,
    public: `${URI}/config/public`,
};

export const configApi = {
    getPublicConfig() {
        return http.get<SuccessResponse<PublicConfig>>(serverConfigURI.public);
    },
    getServerConfig(params: ServerConfigParams, onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void) {
        return http.post<SuccessResponse<ServerConfig>>(serverConfigURI.index, params, {
            onDownloadProgress: onDownloadProgress,
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
