export type RouteAsset = {
    slug: string;
    title: string;
    matchTerms: string[];
    geoJsonUrl: string;
    previewImageUrl: string;
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
        previewImageUrl: "/routes/valle-delle-ferriere.webp",
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
        previewImageUrl: "/routes/torre-dello-ziro.webp",
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
        previewImageUrl: "/routes/path-of-the-gods.webp",
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
        previewImageUrl: "/routes/the-lemon-path.webp",
        kmlUrl: "/routes/the-lemon-path.kml",
        kmzUrl: "/routes/the-lemon-path.kmz",
        gpxUrl: "/routes/the-lemon-path.gpx",
        fallbackUrl: "https://maps.app.goo.gl/J5qA9CQYrSiF1y5F7",
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
