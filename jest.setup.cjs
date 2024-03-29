require('@testing-library/jest-dom');

global.import = {
    meta: {
      env: {
        VITE_REACT_APP_PRODUCTION: process.env.VITE_REACT_APP_PRODUCTION,
      },
    },
  };