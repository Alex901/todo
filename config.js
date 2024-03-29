console.log('config.js is running');

let BASE_URL;

// Check if running in a testing environment (Jest)
if (process.env.NODE_ENV === 'test') {
  BASE_URL = process.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';
  console.log('BASE_URL in config for Jest:', BASE_URL);
} else { // Vite environment
    BASE_URL = import.meta.env.VITE_REACT_APP_PRODUCTION === 'true' ? 'https://todo-backend-gkdo.onrender.com' : 'http://localhost:5000';
    console.log('BASE_URL in config for Vite:', BASE_URL);
  
}

export default BASE_URL;