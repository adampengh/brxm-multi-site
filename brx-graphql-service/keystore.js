var jose = require('node-jose');
keystore = jose.JWK.createKeyStore();
// first argument is the key type (kty)
// second is the key size (in bits) or named curve ('crv') for "EC"
keystore.generate("oct", 256).
then(function(result) {
    // {result} is a jose.JWK.Key
    console.log(result.toJSON(true));
});
