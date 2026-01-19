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

    // Church of Saint Mary Magdalene (formerly Square in Atrani)
    // Church: church (en), chiesa (it), iglesia (es), église (fr), kirche (de), церковь (ru)
    // Mary Magdalene: mary magdalene (en), maria maddalena (it), maría magdalena (es),
    //                 marie-madeleine (fr), maria magdalena (de), марии магдалины (ru)
    if ((n.includes("church") || n.includes("chiesa") || n.includes("iglesia") ||
         n.includes("église") || n.includes("kirche") || n.includes("церковь")) &&
        (n.includes("mary magdalene") || n.includes("maria maddalena") || n.includes("maría magdalena") ||
         n.includes("marie-madeleine") || n.includes("магдалины"))) return "/guide-webp/square_in_atrani.webp";

    if (n.includes("castiglione")) return "/guide-webp/castiglione.webp";

    // Waterfall: waterfall (en), cascata (it), cascada (es), cascade (fr), wasserfall (de), водопад (ru)
    if ((n.includes("waterfall") || n.includes("cascata") || n.includes("cascada") ||
         n.includes("cascade") || n.includes("wasserfall") || n.includes("водопад")) &&
        n.includes("atrani")) return "/guide-webp/waterfall_in_atrani.webp";

    if (n.includes("bando")) return "/guide-webp/Church-Santa-Maria-del-Bando.webp";

    // Amalfi
    if (n.includes("duomo") || n.includes("sant'andrea")) return "/guide-webp/Duomo-di-Sant-Andrea.webp";
    if (n.includes("belvedere") || n.includes("san lorenzo")) return "/guide-webp/elevator-amalfi.webp";

    // Secret Waterfall: secret (en), segreta (it), secreta (es), secrète (fr), секретный (ru)
    if (((n.includes("secret") || n.includes("segreta") || n.includes("secreta") ||
          n.includes("secrète") || n.includes("секретный")) &&
         (n.includes("waterfall") || n.includes("cascata") || n.includes("cascada") ||
          n.includes("cascade") || n.includes("wasserfall") || n.includes("водопад"))) ||
        n.includes("valle dei mulini")) return "/guide-webp/waterfall-in-amalfi-new-from-inside.webp";

    // Restaurants
    if (n.includes("palme")) return "/guide-webp/le-palme.webp";
    if (n.includes("paranza")) return "/guide-webp/A-Paranza.webp";
    if (n.includes("smeraldino")) return "/guide-webp/Lo-Smeraldino.webp";
    if (n.includes("arcate")) return "/guide-webp/Le-Arcate.webp";
    if (n.includes("ciccio")) return "/guide-webp/Da-Ciccio-Cielo-Mare-Terra.webp";

    // Street Food
    if (n.includes("apicella")) return "/guide-webp/apicella-bakery.webp";
    if (n.includes("rua")) return "/guide-webp/la-rua.webp";
    if (n.includes("pizza express")) return "/guide-webp/pizza-express-amalfi.webp";

    // Shops
    if (n.includes("mimì") || n.includes("mimi") || n.includes("cocò") || n.includes("coco"))
        return "/guide-webp/Mimi-Coco-di-Tutto-Un-Po.webp";
    if (n.includes("grande mela") || n.includes("deco"))
        return "/guide-webp/La-Grande-Mela-Supermarket-Deco.webp";
    if (n.includes("dogi"))
        return "/guide-webp/DOGI-Market.webp";
    if (n.includes("tramontina"))
        return "/guide-webp/La-Tramontina-Amalfi.webp";

    // Wider Area
    if ((n.includes("ravello") && n.includes("terrace")) || n.includes("cimbrone")) return "/guide-webp/Ravello-Infinity-Terrace.webp";
    if (n.includes("minori") || n.includes("sal de riso")) return "/guide-webp/Minori-and-Sal-De-Riso.webp";
    if (n.includes("valico") || n.includes("chiunzi")) return "/guide-webp/Al-Valico-di-Chiunzi.webp";
    if (n.includes("marina di praia") || n.includes("praiano")) return "/guide-webp/marina-di-praia.webp";
    if (n.includes("lido degli artisti")) return "/guide-webp/Lido-degli-Artisti.webp";

    // Fallback
    return "/images/hero.webp";
};
