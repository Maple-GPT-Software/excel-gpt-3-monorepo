module.exports = {
  apps: [
    {
      script: 'dist/index.js',
      watch: '.',
    },
  ],

  deploy: {
    production: {
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
