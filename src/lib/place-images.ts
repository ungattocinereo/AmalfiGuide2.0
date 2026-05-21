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
         n.includes("maria magdalena") || n.includes("marie-madeleine") || n.includes("магдалины"))) return "/guide-webp/square_in_atrani.webp";

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
    if (n.includes("birecto")) return "/guide-webp/Il-Birecto.webp";
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
