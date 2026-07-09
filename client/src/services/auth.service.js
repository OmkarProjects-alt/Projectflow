import api from '../utils/api';
import axios from 'axios';

export const register = async (data) => {
    return api.post('/auth/register', 
        data,
    );
}

export const login = async (data) => {
    return api.post('/auth/login',
         data,
    );
};


export const verifyOtp = async (data) => {
    return api.post('/auth/verify-otp',
        data,
    );
};

export const reSendOtp = async (data) => {
    return api.post('/auth/re-send-otp', 
        data,
    );
};

