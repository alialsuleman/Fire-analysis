import Request from 'express';
const request = require('request');
let _EXTERNAL_URL = 'https://test-proj-heroku.herokuapp.com/api/plans';

const callExternalApiUsingRequest = (callback: () => void) => {
    request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
        if (err) {
            return callback(err);
        }
        return callback(body);
    });
}

module.exports.callApi = callExternalApiUsingRequest;