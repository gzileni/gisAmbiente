const PROXY_CONFIG = [
    {
        context: [
            "/geoserver"
        ],
        target: "http://openpuglia.org:8080",
        secure: false
    },
    {
        context: [
            "/ambiente",
        ],
        target: "http://api.openpuglia.org:5000/ambiente",
        secure: false
    },
    {
        context: [
            "/copernicus",
        ],
        target: "http://api.openpuglia.org:5000/copernicus",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
