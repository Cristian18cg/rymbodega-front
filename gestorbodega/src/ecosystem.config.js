module.exports = {
    apps: [
      {
        name: "Front gestor bodega",
        script: "serve",
        env: {
          PM2_SERVE_PATH: "./build",
          PM2_SERVE_PORT: 3000,
          PM2_SERVE_SPA: "true",
        },
      },
    ],
  };
  