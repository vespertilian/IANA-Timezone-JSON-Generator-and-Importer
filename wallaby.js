module.exports = function () {
    process.env.NODE_PATH = require('path').join(__dirname, '../node_modules');
    return {
        files: [
            'src/**/*.ts',
            'src/**/*.hbs',
            'templates/**/*',
            'test-helpers/**/*.ts',
            'src/get-iana-tz-data/tzdata.tar.gz',
            'src/extract-tz-data/zone1970-test-file.tab',
            'src/create-json-from-templates-and-zone-data/test-zone1970.tab',
            'src/create-json-from-handlebars-templates/test-template.hbs',
            'src/create-json-from-handlebars-templates/invalid-test-template.hbs',
            { pattern: 'timezones/**/*', load: false},
            { pattern: 'src/**/*.spec.ts', ignore: true }
        ],

        tests: [
            'src/**/*.spec.ts'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'jasmine',

        // as the db needs to be reset in between some tests we cannot test in parallel
        workers: {
            initial: 1,
            regular: 1
        }
    };
};