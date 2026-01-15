// Hiking trail map embed URLs - these show the full hiking routes
export const hikingMapUrls: Record<string, string> = {
    "valle delle ferriere": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3022.8!2d14.5905091!3d40.6474753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b9584b1db6fcb%3A0xea66729bda2b48d1!2sAmalfi%20Cathedral%2C%20Piazza%20Duomo%2C%20Amalfi%2C%20SA!3m2!1d40.6344504!2d14.6029926!4m5!1s0x133b9591ea123699%3A0xd774b54699b4d8d0!2sValle%20delle%20Ferriere%2C%20Scala%2C%20SA!3m2!1d40.6481158!2d14.5904097!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
    "torre dello ziro": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d6047.5!2d14.6011143!3d40.638841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b95a8e2219069%3A0xb6fe52d5ce1da27e!2sAtrani%2C%20SA!3m2!1d40.6357929!2d14.6086202!4m5!1s0x133b95aed05d7e25%3A0x68bb8e9be7ca9fcd!2sTorre%20dello%20Ziro%2C%20Via%20Valle%20delle%20Ferriere%2C%20Pontone%2C%20SA!3m2!1d40.636001!2d14.6056483!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
    "path of the gods": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d12000!2d14.4952531!3d40.6282869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b96f31ac1ff29%3A0x2585f5135deae698!2sBomerano%20di%20Agerola%2C%20Piazza%20Paolo%20Capasso%2C%20Pianillo!3m2!1d40.6300326!2d14.5403955!4m5!1s0x133b97111597403f%3A0x2609e120cedd79b1!2sNocelle%2C%20SA!3m2!1d40.6293425!2d14.503268!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
    "the lemon path": "https://www.google.com/maps/embed?pb=!1m34!1m12!1m3!1d6000!2d14.6241806!3d40.6508666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m19!3e2!4m5!1s0x133b9544093c35a3%3A0x35b98a06ca815918!2sInsigne%20Collegiata%20Santuario%20Parrocchia%20S.%20Maria%20a%20Mare%2C%20Maiori%20SA!3m2!1d40.6500664!2d14.6412516!4m5!1s0x133b956bebcba8a7%3A0x5aa8b541228b1cfc!2sSentiero%20dei%20Limoni%2C%20Via%20Torre%2C%20Minori%2C%20SA!3m2!1d40.6495665!2d14.6308877!4m5!1s0x133b956c24ec6179%3A0x88e2537289534845!2sVia%20Vescovado%2C%20Minori%20SA!3m2!1d40.6504393!2d14.627709!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
};

// Get hiking map URL if this is a hiking trail
export const getHikingMapUrl = (name: string): string | null => {
    const n = name.toLowerCase();
    for (const [key, url] of Object.entries(hikingMapUrls)) {
        if (n.includes(key) || key.includes(n.replace("sentiero degli dei", "path of the gods").replace("sentiero dei limoni", "the lemon path"))) {
            return url;
        }
    }
    // Additional matching for Italian names
    if (n.includes("sentiero degli dei")) return hikingMapUrls["path of the gods"];
    if (n.includes("sentiero dei limoni")) return hikingMapUrls["the lemon path"];
    return null;
};

// Get image URL for a place based on its name
export const getImageForPlace = (name: string): string => {
    const n = name.toLowerCase();

    // Atrani gems
    if (n.includes("square") && n.includes("atrani")) return "/guide/square_in_atrani.jpg";
    if (n.includes("castiglione")) return "/guide/castiglione.jpg";
    if (n.includes("waterfall") && n.includes("atrani")) return "/guide/waterfall_in_atrani.jpg";
    if (n.includes("bando")) return "/guide/Church-Santa-Maria-del-Bando.jpg";

    // Amalfi
    if (n.includes("duomo") || n.includes("sant'andrea")) return "/guide/Duomo-di-Sant-Andrea.jpg";
    if (n.includes("belvedere") || n.includes("san lorenzo")) return "/guide/elevator-amalfi.jpeg";
    if (n.includes("secret waterfall") || n.includes("valle dei mulini")) return "/guide/waterfall-in-amalfi-new-from-inside.jpg";

    // Restaurants
    if (n.includes("palme")) return "/guide/le-palme.jpg";
    if (n.includes("paranza")) return "/guide/A-Paranza.jpeg";
    if (n.includes("smeraldino")) return "/guide/Lo-Smeraldino.jpg";
    if (n.includes("arcate")) return "/guide/Le-Arcate.jpg";
    if (n.includes("ciccio")) return "/guide/Da-Ciccio-Cielo-Mare-Terra.jpg";

    // Street Food
    if (n.includes("apicella")) return "/guide/apicella-bakery.jpg";
    if (n.includes("rua")) return "/guide/la-rua.jpg";
    if (n.includes("pizza express")) return "/guide/pizza-express-amalfi.jpg";

    // Wider Area
    if ((n.includes("ravello") && n.includes("terrace")) || n.includes("cimbrone")) return "/guide/Ravello-Infinity-Terrace.jpg";
    if (n.includes("minori") || n.includes("sal de riso")) return "/guide/Minori-and-Sal-De-Riso.jpg";
    if (n.includes("valico") || n.includes("chiunzi")) return "/guide/Al-Valico-di-Chiunzi.jpg";
    if (n.includes("marina di praia") || n.includes("praiano")) return "/guide/marina-di-praia.jpg";
    if (n.includes("lido degli artisti")) return "/guide/Lido-degli-Artisti.jpg";

    // Fallback
    return "/images/hero.webp";
};
