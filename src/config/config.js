const path = require('path');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8080,
    paths: {
        public: path.join(__dirname, '../../public'),
        views: path.join(__dirname, '../views'),
        layouts: path.join(__dirname, '../views/layouts'),
        partials: path.join(__dirname, '../views/partials')
    }
};