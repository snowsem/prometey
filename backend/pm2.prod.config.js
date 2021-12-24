module.exports = {
  apps: [
    {
      name: 'prometey-backend',
      script: 'dist/index.js',
      restart_delay: 100,
      watch: ['config', 'dist'],
      cwd: "/var/www/prometey-backend",
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
      name: 'prometey-backend',
      script: 'dist/server.js',
      restart_delay: 100,
      watch: ['config', 'dist'],
      cwd: "/var/www/prometey-backend",
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