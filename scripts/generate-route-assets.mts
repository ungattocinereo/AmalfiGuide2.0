import fs from "fs/promises";
import path from "path";

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

    console.log(`Generated route assets for ${title}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
