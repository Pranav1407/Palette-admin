import { 
    HoardingStats, 
    FetchHoardingRequest, 
    FetchHoardings, 
    LoginCredentials, 
    LoginResponse, 
    RequestActionParams, 
    RequestActionResponse, 
    SubmitQueryResponse, 
    AddAdminProps,
    AddAdminResponse, 
    GetDBDataResponse,
    DBUpdateResponse,
    DBUpdateRequest,
    NewHoardingRow,
    DeleteHoardingRequest
} from '@/types/Types';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': 'Bearer qwerty123@123',
      'Content-Type': 'application/json'
    }
  });

export const fetchHoardings = async (status: string): Promise<FetchHoardings> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/list/hoardings/admin?filter=${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching hoardings:', error);
        throw error;
    }
};

export const fetchRequest = async (id: number | null): Promise<FetchHoardingRequest> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/details/request/full?request_id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching request:', error)
        throw error
    }
}

export const fetchStats = async (): Promise<HoardingStats> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/hoarding_statistics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/user/login`, credentials);
        return response.data;
    }
    catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const requestAction = async (actionParams: RequestActionParams): Promise<RequestActionResponse> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/request/action?action=${actionParams.action}&request_id=${actionParams.request_id}&user_id=${actionParams.user_id}&comment=${actionParams.comment}&start_date=${actionParams.start_date}&end_date=${actionParams.end_date}`);
        return response.data;
    } catch (error) {
        console.error('Error requesting action:', error);
        throw error;
    }
};

export const submitQuery = async (query: string): Promise<SubmitQueryResponse> => {

    const data = new URLSearchParams();
    data.append('question', query);
    
    try {
        const response = await axiosInstance.post(`${API_URL}/submit`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting query:', error);
        throw error;
    }
};

export const downloadFile = async (downloadData: any): Promise<Blob> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/download`, downloadData, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

export const addAdmin = async (adminData: AddAdminProps): Promise<AddAdminResponse> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/user/signup`, adminData);
        return response.data;
    } catch (error) {
        console.error('Error adding admin:', error);
        throw error;
    }
}

export const backupData = async (): Promise<any> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/backup`);
        return response.data;
    } catch (error) {
        console.error('Error backing up data:', error);
        throw error;
    }
}

export const getDBData = async (): Promise<GetDBDataResponse> => {
    try {
        const response = await axiosInstance.post(`${API_URL}/database/db_get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching DB data:', error);
        throw error;
    }
};


export const updateDBData = async (changes: DBUpdateRequest[]): Promise<DBUpdateResponse> => {
    try {
        const response = await axiosInstance.put(`${API_URL}/database/db_update`, changes);
        return response.data;
    } catch (error) {
        console.error('Error backing up data:', error);
        throw error;
    }
}

export const addDBData = async (data: NewHoardingRow) => {
    try {
        const response = await axiosInstance.post('/database/db_add', data);
        return response.data;
    } catch (error) {
        console.error('Error adding data', error);
        throw error
    }
}

export const deleteDBData = async (data: DeleteHoardingRequest) => {
    try {
        const response = await axiosInstance.delete('/database/db_delete', { data });
        return response.data;
    } catch (error) {
        console.error('Error adding data', error);
        throw error
    }
}