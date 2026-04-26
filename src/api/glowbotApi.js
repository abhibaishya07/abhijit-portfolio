import api from './axiosClient';

export const consultGlowBot = (payload) =>
  api.post('/glowbot/consult', payload);
