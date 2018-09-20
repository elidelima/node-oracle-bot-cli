
const express = require('express');
const service = require('./service');
const pkg = require('./package.json');

const logger = console;
const app = express();
service(app);

const server = app.listen(3005, () => {
    logger.info(`${pkg.name} service online\n`);
});

module.exports = server;