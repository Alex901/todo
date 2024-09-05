console.log('config.vite.js is running');

const BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://api.habitforge.se' : 'http://localhost:5000';

export default BASE_URL;