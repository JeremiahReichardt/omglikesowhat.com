'use strict';

const del = require('del');

function clean() {
    return del(global.config.build.rootDirectory);
}

module.exports = {
    build: clean
};
