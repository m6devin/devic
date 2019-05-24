const PROXY_CONFIG = {
    "/api/*": {
        "target": {
            "host": "localhost",
            "protocol": "http:",
            "port": 8000
        },
        "secure": false,
        "changeOrigin": true,
    },
    "/public/*": {
        "target": {
            "host": "localhost",
            "protocol": "http:",
            "port": 8000
        },
        "secure": false,
        "changeOrigin": true,
    },
    "/storage/*": {
        "target": {
            "host": "localhost",
            "protocol": "http:",
            "port": 8000
        },
        "secure": false,
        "changeOrigin": true,
    }
}

module.exports = PROXY_CONFIG;
