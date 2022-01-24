module.exports = {
  apps: [
    {
      name: 'prometey-backend',
      script: 'dist/main.js',
      restart_delay: 100,
      watch: ['dist'],
      cwd: "/var/www/prometey/current/api-service",
      watch_options: {
        followSymlinks: true,
      },
      node_args: [
        '--preserve-symlinks',
        '--experimental-worker',
        '--tls-min-v1.0',
      ],
    },
  ],
};
