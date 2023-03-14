module.exports = {
  apps : [{
    name: "excel-simplify",
    script: 'src/index.ts',
    watch: true,
    instances: 1, // ?
    autorestart: true,
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }],
};
