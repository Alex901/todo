console.log('config.vite.js is running');

const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';
console.log('DEBUG: BASE_URL in config for Vite:', BASE_URL);

export default BASE_URL;