const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "org.monmessage.addon",
    version: "1.0.0",
    name: "Message Addon",
    description: "Affiche un message informatif",
    resources: ["stream"],
    types: ["movie", "series"],
    catalogs: []
});

builder.defineStreamHandler(args => {
    return Promise.resolve({
        streams: [
            {
                name: "INFO",
                title: "⚠️ MESSAGE DE TEST",
                externalUrl: "https://stremio.com"
            }
        ]
    });
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: port });
