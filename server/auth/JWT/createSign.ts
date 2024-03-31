const base64url = require('base64url');
import crypto from 'crypto'
const fs = require('fs');


export interface PayloadObj {
    id: string,
    username: string
}




export const createSign = (payloadObj: PayloadObj) => {
    const signatureFunction = crypto.createSign('RSA-SHA256');

    const headerObj = {
        "alg": "RS256",
        "typ": "JWT"
    }
    const headerObjString = JSON.stringify(headerObj);
    const payloadObjString = JSON.stringify(payloadObj);
    const base64urlHeader = base64url(headerObjString);
    const base64urlPayload = base64url(payloadObjString);
    signatureFunction.write(base64urlHeader + '.' + base64urlPayload);
    signatureFunction.end();
    const PRIV_KEY = fs.readFileSync(__dirname + '/priv_key.pem', 'utf8');
    const signatureBase64 = signatureFunction.sign(PRIV_KEY, 'base64');
    const signatureBase64Url = base64url.fromBase64(signatureBase64);
    return base64urlHeader + '.' + base64urlPayload + '.' + signatureBase64Url;
}




