// -- Requires --
require('dotenv').config();
const Factory = require('./src/factory');

// -- Configuration --
// GitHub API token
const token = process.env.TOKEN;
// Quantity of pages as objective (5 at time)
const pages = 10;

// New factory to mine
const factory = new Factory(token, pages);

// Start to mine
factory.start();
