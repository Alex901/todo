module.exports = {
   moduleDirectories: ['node_modules'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|less|scss|sass|jpg|jpeg|png|gif|webp|svg)$": "identity-obj-proxy",
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ["./jest.setup.cjs"]
};