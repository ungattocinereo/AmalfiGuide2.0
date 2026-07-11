type Coordinate = [number, number];

type RouteStaticPreview = {
    polyline: string;
    start: Coordinate;
    end: Coordinate;
};

export type RouteAsset = {
    slug: string;
    title: string;
    matchTerms: string[];
    geoJsonUrl: string;
    staticPreview: RouteStaticPreview;
    kmlUrl: string;
    kmzUrl: string;
    gpxUrl: string;
    fallbackUrl: string;
    distanceKm: number;
};

export const routeAssets: RouteAsset[] = [
    {
        slug: "valle-delle-ferriere",
        title: "Valle delle Ferriere",
        matchTerms: [
            "valle delle ferriere",
            "sentiero basso della valle delle ferriere",
            "valle ferriere",
        ],
        geoJsonUrl: "/routes/valle-delle-ferriere.geojson",
        staticPreview: {
            polyline: "mh_wFabcxAG@C?k@BE@KFOHIFEBCBIH_@ZQRCBEDURGDSDM@M?A@E?U?M?W@Q?C???M?A?IASAM?GASAOA{@CY?A?A?E???M@E?SBG?G?EAE?IAIAU?U?OBC@IFKL??Wf@WZMJc@HIBKDGBMJEBQJQJGBEDABIHIHEDGBG@G@QFQHGBIFKF]PIFMFOHIHKHOPGJEHEJEJEPGXET?NAJ?FAHAHOQIM?CAA?G?S?O?EACGPCDCBODMBSLSROTSPC@SJKJMFGDGFOVCBML]REDGPEHIHC@KHADCNALBNBTAHG`@CDCJCFWRWNQb@ADY`@IJEHKZMj@AJEl@GLEJAFADKHUNGFAD@BDRPb@@J?JCL?JEZCJAd@?L?F@NAZCTAHEn@ANOZETCPI`@CNERAJ?HBJ?DDNBH@F?@@PEVKHIHGJOVId@En@CTIn@GPGPMTEFQFWFWJA?EAGDGFILKJORMJGNMLANKJKRO`@IRG\\A@IHONQLQHSJSNIHUJMBQCQGIEQOOIOGUGWGKAUAKCEGKKMKO?KBIDYRWRa@XUTWZEFIVONSLQHM@KGKCODUJKVMNGHGJADAHBLDRDNDHHFFJDXB\\ALSTINKLQLIFCJE@GCIOIGEMGGG@o@NGBMDEFKJYTMPKHEFIFIP?R?^B^FZAh@?\\BPBNBJBPEPKNKLIkHKlBB~@@LP^Dd@Gh@MTa@P]BS@C?E@GNG@I@CFBDBB?HCDGBK?CDE^Cl@Cr@Gd@CFGHIJMPe@XGT@\\?RBXETC^B^AJEBCP?T?`@C^G?E?IJUTUDMLWT@H@JEDCBA@E@E@E?MBOAMNED",
            start: [14.602727, 40.633831],
            end: [14.5819453, 40.6516803],
        },
        kmlUrl: "/routes/valle-delle-ferriere.kml",
        kmzUrl: "/routes/valle-delle-ferriere.kmz",
        gpxUrl: "/routes/valle-delle-ferriere.gpx",
        fallbackUrl: "https://maps.app.goo.gl/8s6k4ok28JP67kiS6",
        distanceKm: 3.52,
    },
    {
        slug: "torre-dello-ziro",
        title: "Torre dello Ziro",
        matchTerms: [
            "torre dello ziro",
        ],
        geoJsonUrl: "/routes/torre-dello-ziro.geojson",
        staticPreview: {
            polyline: "yu`wF{hcxAJD\\LB?D?R@L@HADABGBKBKBIFWB?EP@@FQB?GPB@DOB?ALNCDOHCLCHAFAD@BBNRHJDDDBHBJAHANGRMAZBVTl@FHF??C@SHAHAb@GLEBKBKJAFKBMAaAASBKFCXEFC@KCGGEKKSQ^AV?L@N@PLFBH@N?ZK\\ADEBAKAGAKE_@ISEMCMESKBGR?PCHIFEDG?EA?GBCAAABCJKBGAGM@GBG@E@G@G@EAICBEJ@DA@EWCBIJCJAFCDAHCHCH@LFF@J?F?PHJ@LDLDD@JDF@H?H?PCNAPCNAL?XMNIFCHGJKJIDCD?B?D@J@L@D@D?B?D?LAHAF?AC@B@DBB@@B?BA@A@C@C?GACACCACA?I?EAI?IAE@I?G@EBG@EDEHE",
            start: [14.6038208, 40.6410911],
            end: [14.6062318, 40.6357976],
        },
        kmlUrl: "/routes/torre-dello-ziro.kml",
        kmzUrl: "/routes/torre-dello-ziro.kmz",
        gpxUrl: "/routes/torre-dello-ziro.gpx",
        fallbackUrl: "https://maps.app.goo.gl/PwwKzYG8cirKwDSB9",
        distanceKm: 1.19,
    },
    {
        slug: "path-of-the-gods",
        title: "Path of the Gods",
        matchTerms: [
            "path of the gods",
            "path of gods",
            "sentiero degli dei",
            "sentier des dieux",
            "sendero de los dioses",
            "götterweg",
            "gotterweg",
            "тропа богов",
        ],
        geoJsonUrl: "/routes/path-of-the-gods.geojson",
        staticPreview: {
            polyline: "wk~vFqxvwALFF@l@TZPNLXXNHNRDJB@RBFBFHHp@@HT`@HJFFFJMNCL?HA@CJ@BDDFb@DV\\K^Gh@ARBH@JBZLn@ZPRXZf@b@f@\\`@Xn@n@PVNRLTHVJXDNDPFTHRBJTf@FJDJ?F?NCNAH?Z?F?J@HBL?PCRGNGLGDMFI?Q?IDIDGTCJ@TB^BV?J@PBDT\\NZD\\@FHHDDPDDBB@JHFHHNBH@P?TCd@Ej@C\\Er@Gt@CRAHCFAFBDDDLBXHBBDH@H?HCHCH?L@HAJCHKHWHEBEDELIJc@f@CDCL?LBJBFDJDFBD@F@L@DB@F@BCBCBAFCFAH?H?LCD?D?DAB@FDHJD@F?J?HAJBL@F@DBBDFPDL?J?JBJFLDBJBN@H?FADCNKLEHAJ@PBNBXDNHJFD@L@RBVFh@BT?NCZGFALBJJFJDLDJDDBDF@F@NFXFz@LJ@DBFDJ@HERBNFHHHJP\\[TYXi@^c@VEJ?JBDFFXXHTJTJRBTBTBTDLDLFHFTBRDdAAl@CRGPAJ?h@AJERCNEL?NFLJ|AAf@ANCHGJOLOF_@DIBIFY`@KPINIJGJALBLJZHPNTFFVDLFDFBF@H?LAPATA`@AXEPGNMRKLIDKHGPEXEf@E^CZANAT@XA\\?V@FBLBLANEHILMHMDW\\GHEFCHAFBN@LBT@`@D^BPFXBZ@^APIZEJCFGFMNMHIDKDMBKDIDCJOPQLEBE?MDOAOEQCG?GBMNOXOVKJGDE?SKOK}@MCIGCGCEAE?E?KAE?E?GHI@GCGCO_@KQECKDOXIVYXELC`@ELEFGDEBGFAF?H?PB`@T`AALSl@GlACPGJ]h@Q?s@r@G@c@KKJWFUEKBMFM?YEK?_A@{@?UAU@MDCPBZ?XEd@YfA@TCZAd@ELGJEFs@^m@n@QXIPGPWz@Od@Wz@ELGLIHGBSBKBMAIDCZCTADG?IEMSCEE?I?E?YBKDMBIDSBUBWBOCGGEGACE?ED@HBHFJFJHNHT@HAJCLEFE@C?GFKNE?M?KIEEKGE?GDG@G?G?G?E@AHBFDLBLFDDBDHJHBFAJAJ?DBDHDDBHHFHDJDFDHHFLFR@FCJ?PPLTLHFFJLBJ?HCJGH?J?R?XGPEL?HBJ@NDRB^BRBLDNJHTJPFLBPDRFNFHJFN@R@f@An@Dr@Bp@Ch@EVILCFW`@ATTj@Dd@Ff@HRFZFRCJA^Rv@BZDp@?`@RP",
            start: [14.539765, 40.6292449],
            end: [14.5033404, 40.6287852],
        },
        kmlUrl: "/routes/path-of-the-gods.kml",
        kmzUrl: "/routes/path-of-the-gods.kmz",
        gpxUrl: "/routes/path-of-the-gods.gpx",
        fallbackUrl: "https://maps.app.goo.gl/XpFY4Zz9LtRKzQno8",
        distanceKm: 5.19,
    },
    {
        slug: "the-lemon-path",
        title: "The Lemon Path",
        matchTerms: [
            "the lemon path",
            "path of the lemons",
            "via dei limoni",
            "sentiero dei limoni",
            "sentier des citrons",
            "sendero de los limones",
            "лимонная тропа",
        ],
        geoJsonUrl: "/routes/the-lemon-path.geojson",
        staticPreview: {
            polyline: "}mbwFyrjxAWh@_@j@u@r@[\\GFPbAEHABUh@a@jA@b@AZCj@@TDRCf@A`@Kb@Ej@DXBRZp@BRHPDZCTW`@AREr@Kf@QrD|BvKNGBIFEFENAPETGLE@BVv@Nd@?PADCj@@d@BDVn@JjAFbB@zAG|AWxAa@|A]xA_@hBYzASdA",
            start: [14.6412516, 40.6500664],
            end: [14.627709, 40.6504393],
        },
        kmlUrl: "/routes/the-lemon-path.kml",
        kmzUrl: "/routes/the-lemon-path.kmz",
        gpxUrl: "/routes/the-lemon-path.gpx",
        fallbackUrl: "https://www.google.com/maps/dir/Insigne+Collegiata+Santuario+Parrocchia+S.+Maria+a+Mare,+Piazzale+Mons.+Milo+Nicola+Prevosto,+84010+Maiori+SA/Sentiero+dei+Limoni,+Via+Torre,+Minori,+SA/Via+Vescovado,+84010+Minori+SA/@40.6508666,14.6241806,15z/data=!3m1!4b1!4m20!4m19!1m5!1m1!1s0x133b9544093c35a3:0x35b98a06ca815918!2m2!1d14.6412516!2d40.6500664!1m5!1m1!1s0x133b956bebcba8a7:0x5aa8b541228b1cfc!2m2!1d14.6308877!2d40.6495665!1m5!1m1!1s0x133b956c24ec6179:0x88e2537289534845!2m2!1d14.627709!2d40.6504393!3e2!5m1!1e1?entry=tts&g_ep=EgoyMDI2MDEwNy4wKgosMTAwNzkyMDcxSAFQAw%3D%3D&skid=07007853-918a-4ec0-8afa-25659f00d8ca",
        distanceKm: 2.99,
    },
];

const normalize = (value: string): string =>
    value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[’']/g, "")
        .replace(/\s+/g, " ")
        .trim();

export const getRouteForPlace = (name: string): RouteAsset | null => {
    const normalizedName = normalize(name);
    return routeAssets.find((route) => {
        if (normalizedName.includes(normalize(route.title))) return true;
        return route.matchTerms.some((term) => normalizedName.includes(normalize(term)));
    }) ?? null;
};

const formatMapboxCoordinate = ([lon, lat]: Coordinate): string =>
    `${lon.toFixed(5)},${lat.toFixed(5)}`;

type StaticPreviewSize = "compact" | "wide";

const STATIC_PREVIEW_DIMENSIONS: Record<StaticPreviewSize, string> = {
    compact: "600x450",
    wide: "900x675",
};

export const getMapboxStaticPreviewUrl = (
    route: RouteAsset,
    size: StaticPreviewSize = "wide",
): string | null => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return null;

    const encodedPolyline = encodeURIComponent(route.staticPreview.polyline);
    const overlays = [
        `path-10+3f1d0d-0.32(${encodedPolyline})`,
        `path-5+f97316-1(${encodedPolyline})`,
        `pin-s-a+166534(${formatMapboxCoordinate(route.staticPreview.start)})`,
        `pin-s-b+b91c1c(${formatMapboxCoordinate(route.staticPreview.end)})`,
    ].join(",");

    return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${overlays}/auto/${STATIC_PREVIEW_DIMENSIONS[size]}?padding=48&access_token=${encodeURIComponent(token)}`;
};
