module.exports = {
  apps: [
    {
      name: 'hackerblog-frontend',
      script: 'npx',
      args: 'vite --host 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp/frontend',
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
