module.exports = {
  apps: [
    {
      name: 'prometey-backend',
      script: 'dist/server.js',
      restart_delay: 100,
      watch: ['config', 'dist'],
      cwd: "/var/www/prometey/current/backend",
      watch_options: {
        followSymlinks: true,
      },
      node_args: [
        '--preserve-symlinks',
        '--experimental-worker',
        '--tls-min-v1.0',
      ],
    },

    {
      name: 'prometey-cron-job',
      script: 'dist/cron/cron.js',
      restart_delay: 100,
      watch: ['config', 'dist'],
      cwd: "/var/www/prometey/current/backend",
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