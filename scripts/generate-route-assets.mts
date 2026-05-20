import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type Coordinate = [number, number];

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

const escapeXml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatCoord = ([lon, lat]: Coordinate): string =>
  `${lon.toFixed(7)},${lat.toFixed(7)},0`;

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
  const lons = coords.map(([lon]) => lon);
  const lats = coords.map(([, lat]) => lat);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const width = 1200;
  const height = 900;
  const pad = 110;
  const lonSpan = maxLon - minLon || 1;
  const latSpan = maxLat - minLat || 1;
  const scale = Math.min((width - pad * 2) / lonSpan, (height - pad * 2) / latSpan);
  const offsetX = (width - lonSpan * scale) / 2;
  const offsetY = (height - latSpan * scale) / 2;
  const toPoint = ([lon, lat]: Coordinate): [number, number] => [
    offsetX + (lon - minLon) * scale,
    height - (offsetY + (lat - minLat) * scale),
  ];
  const points = coords.map(toPoint);
  const polyline = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [startX, startY] = points[0];
  const [endX, endY] = points[points.length - 1];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="land" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f8f0df"/>
      <stop offset="100%" stop-color="#dfe7d5"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#4a2a16" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#land)"/>
  <path d="M0 710 C200 650 310 730 470 680 C650 625 760 700 930 630 C1040 585 1130 615 1200 580 L1200 900 L0 900 Z" fill="#9fcad2" opacity="0.52"/>
  <g opacity="0.18" stroke="#6f8f6a" stroke-width="2" fill="none">
    <path d="M-50 130 C170 70 260 210 440 145 C620 80 780 170 960 115 C1090 75 1160 90 1250 50"/>
    <path d="M-60 245 C160 185 275 315 455 250 C630 190 810 270 990 205 C1115 160 1180 180 1260 140"/>
    <path d="M-40 365 C160 305 280 430 470 365 C640 305 820 390 1010 320 C1130 280 1190 300 1260 260"/>
    <path d="M-60 500 C145 450 285 555 475 505 C645 460 825 520 1005 465 C1130 430 1190 450 1260 415"/>
  </g>
  <polyline points="${polyline}" fill="none" stroke="#5b2c17" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" opacity="0.28" filter="url(#shadow)"/>
  <polyline points="${polyline}" fill="none" stroke="#f97316" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${polyline}" fill="none" stroke="#fff7ed" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
  <circle cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="21" fill="#166534" stroke="#fff7ed" stroke-width="7"/>
  <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="21" fill="#b91c1c" stroke="#fff7ed" stroke-width="7"/>
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
