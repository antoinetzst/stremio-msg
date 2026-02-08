const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const messagesList = require("./messages.json");

// Compteur global pour gérer la "fréquence" (ex: 1 fois sur 10)
let requestCounter = 0;

const builder = new addonBuilder({
    id: "org.monmessage.addon",
    version: "1.0.2",
    name: "INFO Addon Dynamique",
    description: "Messages informatifs dynamiques",
    resources: ["stream"],
    types: ["movie", "series"],
    catalogs: []
});

builder.defineStreamHandler(args => {
    // On incrémente le compteur à chaque demande reçue par le serveur
    requestCounter++;
    
    const now = new Date();
    const streams = [];

    // On parcourt la liste des messages définie dans le fichier JSON
    messagesList.forEach(msg => {
        
        // 1. Vérifier si le message est ACTIF
        if (!msg.active) return;

        // 2. Vérifier les DATES (si définies)
        if (msg.startDate && new Date(msg.startDate) > now) return; // Pas encore commencé
        if (msg.endDate && new Date(msg.endDate) < now) return;     // Déjà fini

        // 3. Vérifier la PROBABILITÉ (Chance d'apparition)
        // Math.random() génère un chiffre entre 0 et 1. 
        // Si msg.probability est 0.3 (30%), et que le chiffre est 0.8, on ne montre pas.
        if (msg.probability < 1 && Math.random() > msg.probability) return;

        // 4. Vérifier la FRÉQUENCE (ex: tous les 10 affichages globaux)
        // Si frequency = 5, on affiche seulement si le compteur est un multiple de 5 (5, 10, 15...)
        if (msg.frequency > 0 && requestCounter % msg.frequency !== 0) return;

        // Si tout est bon, on ajoute le message à la liste des streams
        streams.push({
            name: "⚠️ INFO",
            title: msg.text,
            externalUrl: msg.url || ""
        });
    });

    // On renvoie la liste des messages validés
    return Promise.resolve({ streams: streams });
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: port });
console.log(`L'addon tourne sur le port ${port}`);
