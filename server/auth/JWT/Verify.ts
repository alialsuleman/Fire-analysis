const base64url = require('base64url');
const crypto = require('crypto')
import fs from 'fs';



const headerObj = {
    "alg": "RS256",
    "typ": "JWT"
}


export const verify1 = (JWT: string) => {
    const verifyFunction = crypto.createVerify('RSA-SHA256');


    const jwtParts = JWT.split('.');
    //console.log(jwtParts) //[HEADER:ALGORITHM & TOKEN TYPE ,PAYLOAD:DATA , VERIFY SIGNATURE]
    const headerInBase64UrlFormat: string = jwtParts[0];
    const payloadInBase64UrlFormat: string = jwtParts[1];
    const signatureInBase64UrlFormat: string = jwtParts[2];
    if (!headerInBase64UrlFormat || !payloadInBase64UrlFormat || !signatureInBase64UrlFormat) return null;
    verifyFunction.write(headerInBase64UrlFormat + '.' + payloadInBase64UrlFormat);
    verifyFunction.end();
    const jwtSignatureBase64 = base64url.toBase64(signatureInBase64UrlFormat);
    const PUB_KEY = fs.readFileSync(__dirname + '/pub_key.pem', 'utf8');
    console.log(PUB_KEY)
    const signatureIsValid = verifyFunction.verify(PUB_KEY, jwtSignatureBase64, 'base64');
    if (signatureIsValid) {
        const decodedPayload = base64url.decode(payloadInBase64UrlFormat);
        let obj = JSON.parse(decodedPayload);
        return obj;
    }
    else return null

}





