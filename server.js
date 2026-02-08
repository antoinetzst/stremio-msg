const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// --- 🎛️ TON PANNEAU DE CONTRÔLE ---
const MESSAGE_ACTIF = true;  // Mets 'false' pour désactiver, 'true' pour activer
const MON_TEXTE = "💸L'hébergement coûte 3€/mois 💸\nUne participation est bienvenue \nMais pas obligatoire. \n🍿Bon film ! 🍿 \nAntoine";
// ------------------------------------

const builder = new addonBuilder({
    id: "org.monmessage.addon",
    version: "1.0.1",
    name: "INFO Addon",
    description: "Message informatif",
    resources: ["stream"],
    types: ["movie", "series"],
    catalogs: []
});

builder.defineStreamHandler(args => {
    // Si l'interrupteur est sur FALSE, on ne renvoie rien (le silence complet)
    if (!MESSAGE_ACTIF) {
        return Promise.resolve({ streams: [] });
    }

    // Sinon, on affiche le message
    return Promise.resolve({
        streams: [
            {
                name: "⚠️ INFO",
                title: MON_TEXTE,
                externalUrl: "https://www.paypal.com/paypalme/atagah"
            }
        ]
    });
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: port });
console.log(`L'addon tourne sur le port ${port}`);
