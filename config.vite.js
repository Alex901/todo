console.log('config.vite.js is running');

const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';

export default BASE_URL;