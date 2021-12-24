module.exports = {
  apps: [
    {
      name: 'prometey-backend',
      script: 'dist/server.js',
      restart_delay: 500,
      watch: ['config', 'dist'],
      watch_options: {
        followSymlinks: false,
      },
      node_args: [
        '--preserve-symlinks',
        '--experimental-worker',
        '--tls-min-v1.0',
        '--inspect=0.0.0.0:7007',
      ],
    },
  ],
};