import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type Coordinate = [number, number];
type Bounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

type MapLine = {
  name: string;
  kind: "major" | "minor";
  coordinates: Coordinate[];
};

type MapLabel = {
  name: string;
  coordinate: Coordinate;
  kind: "town" | "place" | "road";
};

type RouteFeatureCollection = {
  name?: string;
  features: Array<{
    type: "Feature";
    properties: {
      slug: string;
      title: string;
      osmRelationId?: number;
      source?: string;
      license?: string;
      fallbackUrl?: string;
      distanceKm?: number;
    };
    geometry: {
      type: "LineString";
      coordinates: Coordinate[];
    };
  }>;
};

const ROUTES_DIR = path.join(process.cwd(), "public/routes");
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const PREVIEW_WIDTH = 1200;
const PREVIEW_HEIGHT = 900;

const ROUTE_BOUNDS: Record<string, Bounds> = {
  "path-of-the-gods": { west: 14.472, south: 40.606, east: 14.558, north: 40.641 },
  "the-lemon-path": { west: 14.613, south: 40.638, east: 14.652, north: 40.659 },
  "torre-dello-ziro": { west: 14.592, south: 40.628, east: 14.620, north: 40.652 },
  "valle-delle-ferriere": { west: 14.574, south: 40.629, east: 14.615, north: 40.658 },
};

const COASTLINE: Coordinate[] = [
  [14.472, 40.626],
  [14.484, 40.628],
  [14.496, 40.626],
  [14.510, 40.621],
  [14.524, 40.614],
  [14.538, 40.612],
  [14.553, 40.616],
  [14.572, 40.624],
  [14.590, 40.630],
  [14.603, 40.634],
  [14.609, 40.635],
  [14.622, 40.644],
  [14.633, 40.648],
  [14.645, 40.648],
  [14.654, 40.646],
];

const MAP_LINES: MapLine[] = [
  {
    name: "SS163",
    kind: "major",
    coordinates: [
      [14.482, 40.629],
      [14.498, 40.627],
      [14.522, 40.616],
      [14.548, 40.618],
      [14.574, 40.626],
      [14.603, 40.636],
      [14.610, 40.637],
      [14.626, 40.649],
      [14.642, 40.650],
    ],
  },
  {
    name: "Agerola road",
    kind: "minor",
    coordinates: [
      [14.603, 40.634],
      [14.594, 40.639],
      [14.581, 40.643],
      [14.564, 40.641],
      [14.548, 40.635],
      [14.539, 40.627],
    ],
  },
  {
    name: "Ravello road",
    kind: "minor",
    coordinates: [
      [14.602, 40.635],
      [14.606, 40.642],
      [14.611, 40.648],
      [14.607, 40.655],
    ],
  },
  {
    name: "Scala road",
    kind: "minor",
    coordinates: [
      [14.598, 40.639],
      [14.599, 40.647],
      [14.603, 40.653],
      [14.608, 40.657],
    ],
  },
  {
    name: "Path access",
    kind: "minor",
    coordinates: [
      [14.540, 40.627],
      [14.527, 40.624],
      [14.510, 40.626],
      [14.499, 40.628],
      [14.486, 40.629],
    ],
  },
  {
    name: "Minori-Maiori",
    kind: "minor",
    coordinates: [
      [14.622, 40.650],
      [14.632, 40.652],
      [14.642, 40.650],
    ],
  },
];

const MAP_LABELS: MapLabel[] = [
  { name: "Positano", coordinate: [14.485, 40.628], kind: "town" },
  { name: "Nocelle", coordinate: [14.501, 40.629], kind: "place" },
  { name: "Praiano", coordinate: [14.524, 40.613], kind: "town" },
  { name: "Bomerano", coordinate: [14.540, 40.627], kind: "town" },
  { name: "Agerola", coordinate: [14.548, 40.638], kind: "town" },
  { name: "Amalfi", coordinate: [14.602, 40.634], kind: "town" },
  { name: "Atrani", coordinate: [14.608, 40.636], kind: "town" },
  { name: "Pontone", coordinate: [14.604, 40.646], kind: "place" },
  { name: "Ravello", coordinate: [14.612, 40.649], kind: "town" },
  { name: "Scala", coordinate: [14.607, 40.656], kind: "town" },
  { name: "Minori", coordinate: [14.626, 40.650], kind: "town" },
  { name: "Maiori", coordinate: [14.640, 40.649], kind: "town" },
  { name: "SS163", coordinate: [14.591, 40.632], kind: "road" },
];

const escapeXml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatCoord = ([lon, lat]: Coordinate): string =>
  `${lon.toFixed(7)},${lat.toFixed(7)},0`;

const isWithinBounds = ([lon, lat]: Coordinate, bounds: Bounds): boolean =>
  lon >= bounds.west && lon <= bounds.east && lat >= bounds.south && lat <= bounds.north;

const expandBounds = (bounds: Bounds, factor = 0.07): Bounds => {
  const lonPad = (bounds.east - bounds.west) * factor;
  const latPad = (bounds.north - bounds.south) * factor;
  return {
    west: bounds.west - lonPad,
    south: bounds.south - latPad,
    east: bounds.east + lonPad,
    north: bounds.north + latPad,
  };
};

const buildKml = (route: RouteFeatureCollection): string => {
  const feature = route.features[0];
  if (!feature) throw new Error("Route GeoJSON has no feature");
  const { properties, geometry } = feature;
  const coordinates = geometry.coordinates.map(formatCoord).join(" ");
  const description = [
    properties.source,
    properties.license ? `License: ${properties.license}` : null,
    properties.distanceKm ? `Distance: ${properties.distanceKm} km` : null,
  ].filter(Boolean).join("\n");

  return `${XML_HEADER}
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(properties.title)}</name>
    <Style id="amalfi-route">
      <LineStyle>
        <color>ff0048e5</color>
        <width>5</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>${escapeXml(properties.title)}</name>
      <description>${escapeXml(description)}</description>
      <styleUrl>#amalfi-route</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>${coordinates}</coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>
`;
};

const buildGpx = (route: RouteFeatureCollection): string => {
  const feature = route.features[0];
  if (!feature) throw new Error("Route GeoJSON has no feature");
  const { properties, geometry } = feature;
  const points = geometry.coordinates
    .map(([lon, lat]) => `      <trkpt lat="${lat.toFixed(7)}" lon="${lon.toFixed(7)}" />`)
    .join("\n");

  return `${XML_HEADER}
<gpx version="1.1" creator="Amalfi.Day" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(properties.title)}</name>
    <desc>${escapeXml(properties.source ?? "Amalfi.Day route")}</desc>
  </metadata>
  <trk>
    <name>${escapeXml(properties.title)}</name>
    <trkseg>
${points}
    </trkseg>
  </trk>
</gpx>
`;
};

const crcTable = new Uint32Array(256).map((_, index) => {
  let c = index;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return c >>> 0;
});

const crc32 = (input: Buffer): number => {
  let crc = 0xffffffff;
  for (const byte of input) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const makeKmz = (filename: string, content: string): Buffer => {
  const name = Buffer.from(filename);
  const data = Buffer.from(content, "utf8");
  const crc = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(0, 8);
  local.writeUInt16LE(0, 10);
  local.writeUInt16LE(0, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(0, 10);
  central.writeUInt16LE(0, 12);
  central.writeUInt16LE(0, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(0, 42);

  const localRecord = Buffer.concat([local, name, data]);
  const centralRecord = Buffer.concat([central, name]);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(centralRecord.length, 12);
  end.writeUInt32LE(localRecord.length, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([localRecord, centralRecord, end]);
};

const routePreviewSvg = (route: RouteFeatureCollection): string => {
  const feature = route.features[0];
  if (!feature) throw new Error("Route GeoJSON has no feature");
  const coords = feature.geometry.coordinates;
  const routeBounds = ROUTE_BOUNDS[feature.properties.slug] ?? expandBounds({
    west: Math.min(...coords.map(([lon]) => lon)),
    south: Math.min(...coords.map(([, lat]) => lat)),
    east: Math.max(...coords.map(([lon]) => lon)),
    north: Math.max(...coords.map(([, lat]) => lat)),
  }, 0.35);
  const bounds = expandBounds(routeBounds, 0.02);
  const lonSpan = bounds.east - bounds.west || 1;
  const latSpan = bounds.north - bounds.south || 1;
  const toPoint = ([lon, lat]: Coordinate): [number, number] => [
    ((lon - bounds.west) / lonSpan) * PREVIEW_WIDTH,
    PREVIEW_HEIGHT - ((lat - bounds.south) / latSpan) * PREVIEW_HEIGHT,
  ];
  const routePoints = coords.map(toPoint);
  const routePolyline = routePoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [startX, startY] = routePoints[0];
  const [endX, endY] = routePoints[routePoints.length - 1];
  const clippedCoastline = COASTLINE.filter((coordinate) => isWithinBounds(coordinate, bounds));
  const coastPoints = clippedCoastline.length >= 2 ? clippedCoastline.map(toPoint) : COASTLINE.map(toPoint);
  const coastlinePath = coastPoints.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const landPath = coastPoints.length
    ? [
      `M 0 0`,
      `L ${PREVIEW_WIDTH} 0`,
      `L ${PREVIEW_WIDTH} ${coastPoints[coastPoints.length - 1][1].toFixed(1)}`,
      ...coastPoints.slice().reverse().map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`),
      `L 0 ${coastPoints[0][1].toFixed(1)}`,
      "Z",
    ].join(" ")
    : `M 0 0 L ${PREVIEW_WIDTH} 0 L ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT} L 0 ${PREVIEW_HEIGHT} Z`;
  const lineToPath = (line: MapLine): string =>
    line.coordinates
      .filter((coordinate) => isWithinBounds(coordinate, bounds))
      .map(toPoint)
      .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");
  const visibleLines = MAP_LINES.map((line) => ({ ...line, path: lineToPath(line) })).filter((line) => line.path.includes("L"));
  const visibleLabels = MAP_LABELS.filter((label) => isWithinBounds(label.coordinate, bounds));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}">
  <defs>
    <linearGradient id="sea" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#8fc4d4"/>
      <stop offset="100%" stop-color="#c6e1e5"/>
    </linearGradient>
    <linearGradient id="land" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f5efd8"/>
      <stop offset="58%" stop-color="#e6ecd8"/>
      <stop offset="100%" stop-color="#d4e1c2"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#301509" flood-opacity="0.28"/>
    </filter>
    <filter id="labelShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#ffffff" flood-opacity="0.85"/>
    </filter>
  </defs>
  <rect width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" fill="url(#sea)"/>
  <path d="${landPath}" fill="url(#land)"/>
  <path d="${coastlinePath}" fill="none" stroke="#f6f1df" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <path d="${coastlinePath}" fill="none" stroke="#6a9aa2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.65"/>
  <g opacity="0.32" stroke="#84986d" stroke-width="2" fill="none">
    <path d="M -40 150 C 150 92 260 190 430 124 C 610 56 780 154 955 92 C 1095 42 1190 66 1260 22"/>
    <path d="M -50 278 C 160 215 270 330 455 260 C 640 194 808 286 996 214 C 1118 168 1190 185 1260 146"/>
    <path d="M -35 410 C 172 352 290 468 482 400 C 642 344 820 422 1010 360 C 1135 318 1198 338 1265 302"/>
    <path d="M -55 545 C 146 490 284 596 476 542 C 650 496 826 562 1006 505 C 1132 466 1195 484 1264 448"/>
  </g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${visibleLines.filter((line) => line.kind === "major").map((line) => `<path d="${line.path}" stroke="#f4c66f" stroke-width="18"/><path d="${line.path}" stroke="#ffffff" stroke-width="6" opacity="0.9"/>`).join("\n    ")}
    ${visibleLines.filter((line) => line.kind === "minor").map((line) => `<path d="${line.path}" stroke="#ffffff" stroke-width="10" opacity="0.9"/><path d="${line.path}" stroke="#b9aa8f" stroke-width="3" opacity="0.9"/>`).join("\n    ")}
  </g>
  <polyline points="${routePolyline}" fill="none" stroke="#5b2c17" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity="0.3" filter="url(#shadow)"/>
  <polyline points="${routePolyline}" fill="none" stroke="#f97316" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${routePolyline}" fill="none" stroke="#fff7ed" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>
  <circle cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="21" fill="#166534" stroke="#fff7ed" stroke-width="7"/>
  <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="21" fill="#b91c1c" stroke="#fff7ed" stroke-width="7"/>
  <g font-family="Arial, Helvetica, sans-serif" filter="url(#labelShadow)">
    ${visibleLabels.map((label) => {
      const [x, y] = toPoint(label.coordinate);
      if (label.kind === "road") {
        return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="-39" y="-17" width="78" height="34" rx="17" fill="#fff8dc" stroke="#c99a36" stroke-width="2"/><text y="7" text-anchor="middle" font-size="18" font-weight="800" fill="#7b4b00">${escapeXml(label.name)}</text></g>`;
      }
      const dot = label.kind === "town" ? 8 : 5;
      const weight = label.kind === "town" ? 800 : 700;
      const color = label.kind === "town" ? "#263238" : "#4d5b45";
      const isNearRightEdge = x > PREVIEW_WIDTH - 180;
      const textX = isNearRightEdge ? -13 : 13;
      const textAnchor = isNearRightEdge ? "end" : "start";
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="${dot}" fill="#ffffff" stroke="#53604d" stroke-width="2"/><text x="${textX}" y="-10" text-anchor="${textAnchor}" font-size="27" font-weight="${weight}" fill="${color}">${escapeXml(label.name)}</text></g>`;
    }).join("\n    ")}
  </g>
</svg>`;
};

async function main() {
  const files = (await fs.readdir(ROUTES_DIR))
    .filter((file) => file.endsWith(".geojson"))
    .sort();

  for (const file of files) {
    const routePath = path.join(ROUTES_DIR, file);
    const route = JSON.parse(await fs.readFile(routePath, "utf8")) as RouteFeatureCollection;
    const feature = route.features[0];
    if (!feature) throw new Error(`${file} has no route feature`);
    const { slug, title } = feature.properties;
    const kml = buildKml(route);
    const gpx = buildGpx(route);

    await fs.writeFile(path.join(ROUTES_DIR, `${slug}.kml`), kml);
    await fs.writeFile(path.join(ROUTES_DIR, `${slug}.gpx`), gpx);
    await fs.writeFile(path.join(ROUTES_DIR, `${slug}.kmz`), makeKmz("doc.kml", kml));
    await sharp(Buffer.from(routePreviewSvg(route))).webp({ quality: 86 }).toFile(path.join(ROUTES_DIR, `${slug}.webp`));

    console.log(`Generated route assets for ${title}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
