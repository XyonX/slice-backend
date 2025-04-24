module.exports = {
  apps: [
    {
      name: "slice-backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3002, // This will be used by server.js now
      },
    },
  ],
};
