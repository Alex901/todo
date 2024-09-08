require('dotenv').config();

console.log('config.js is running');

const BASE_URL = process.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://api.habitforge.se' : 'http://localhost:5000';
console.log('DEBUG: BASE_URL in config for Jest:', BASE_URL);

export default BASE_URL;