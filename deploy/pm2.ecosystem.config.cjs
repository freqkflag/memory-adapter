module.exports = {
  apps: [
    {
      name: "pam",
      script: "/home/USER/apps/pam/dist/server/httpServer.js",
      cwd: "/home/USER/apps/pam",
      interpreter: "/usr/bin/node",
      env: {
        PAM_HOST: "127.0.0.1",
        PAM_PORT: "3000",
        PAM_BASE_URL: "https://pam.cultofjoey.com",
        PAM_DATA_DIR: "/home/USER/data/pam/memory",
        PAM_AUTH_TOKEN: "change-me"
      }
    }
  ]
};

