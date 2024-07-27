const jose = require('node-jose');

const jwks = {
  keys: [
    {
      e: "AQAB",
      n: "lPz7A_f7kxFatGRg-fNVd1IBuIhLPeFNe3vOouul9Z9iDfrxBI0D0536XV0ooCFIYD_IP4SeRrbYpDTda82MisZnP5TBCIOFBkwjjRzRegGscpNLmHWago0gS9RbUuMjs1EAcBqzTt2RiUHoqyguvwm2RUbCxkIe0Ts9c6fO_LLw5fR0l2CNvIR3riHef_SYMt5X-94THCamp72Sdbt21qFhcowWbAvprHKq7ZKwEzxdXqRKs6ElBCMOdhuQD3RH4apOJBme4VuSU2osPlFO8pMyDwkcLdA32_aGll4MBHik5YBFHeAg1ufLYpfFY-imVk9hU6DEAz4LyWGalxekXw",
      alg: "RS256",
      kid: "ea:5f:92:57:a0:24:4b:3a:4b:2b:11:65:c5:ff:d5:46",
      kty: "RSA",
      use: "sig"
    }
  ]
};

async function getKey() {
  const keystore = await jose.JWK.asKeyStore(jwks);
  const key = keystore.get({ use: 'sig' });
  const publicKey = key.toPEM(false);
  return publicKey;
}

module.exports = getKey;
