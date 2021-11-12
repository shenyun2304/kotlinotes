const process = require('process')
const { exec } = require('child_process');
const path = require('path');
const chokidar = require('chokidar');
let files = [];
const dir = process.cwd();
const readme = path.resolve(dir, 'README.md');

const touch = () => {
    exec(`touch ${readme}`);
}

module.exports = {
    // Map of hooks
    hooks: {
        config: function(config) {
            files = config.pluginsConfig.watch.files;
            return config;
        }, 
        init: () => {
            if (process.argv.includes('serve') && !files.length) {
                return;
            } else {
                const watcher = chokidar.watch(files, {
                    cwd: process.cwd(),
                    ignoreInitial: true
                });

                watcher
                .on('add', touch)
                .on('change', touch)
                .on('unlink', touch);

                process.on('exit', (code) => {
                    watcher.close();
                });
            }
        }
    },

    // Map of new blocks
    blocks: {},

    // Map of new filters
    filters: {}
};