var ipaddr;

if (process.env.OFFICE) {
  ipaddr = "http://commandify-api.test";
} else {
  ipaddr = "http://commandify-api.test";
}
// ipaddr = "http://192.168.43.1";
ipaddr = "http://commandify-api.test";
// ipaddr = "http://aabdb7b4.ngrok.io";
// ipaddr = "https://54680e68.ngrok.io/auth/login/spotify/callback";

var config = {
  redirectUri: process.env.DEV
    ? "https://commandify.devswebdev.com" //? `${ipaddr}:8080` // "https://commandify.devswebdev.com" //"http://192.168.0.136:8080"
    : "https://54680e68.ngrok.io/auth/login/spotify",
  socketUrl: process.env.DEV
    ? "https://commandify-api-v2.devswebdev.com"
    : "https://commandify-api-v2.devswebdev.com",
  apiUrl: process.env.DEV
    ? // ? // ? //? // ? "http://192.168.43.85:8001"
      // "http://192.168.0.102:8001"
      // "http://192.168.8.105:8001"
      "https://commandify-api-v2.devswebdev.com"
    : // ipaddr
      // ipaddr
      // "http://commandify-api.test"
      // "http://10.0.0.9:8001"
      // "http://10.0.0.4:8001"
      "https://commandify-api-v2.devswebdev.com",
  product: "open",
  devtools: `${ipaddr}:8098`,
  loaded: false,
  images: []
};
export default {
  config: config
};
