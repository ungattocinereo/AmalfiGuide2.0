import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageDir = path.join(root, "public", "images", "social");
const sourceDir = path.join(root, "assets", "social");
const logoPath = path.join(root, "public", "images", "guide-logo.svg");

const cards = [
  {
    source: "amalfi-social-og-art-v2.png",
    output: "amalfi-social-og-v2.png",
    width: 1200,
    height: 630,
    logo: { left: 62, top: 44, width: 142 },
    kicker: { y: 164, size: 14, tracking: 4.5, lineWidth: 34 },
    title: { firstY: 284, secondY: 360, firstSize: 68, secondSize: 55 },
    footer: { y: 552, size: 14, tracking: 2.5 },
  },
  {
    source: "amalfi-social-square-art-v2.png",
    output: "amalfi-social-square-v2.png",
    width: 1080,
    height: 1080,
    logo: { left: 72, top: 66, width: 166 },
    kicker: { y: 226, size: 15, tracking: 4.8, lineWidth: 38 },
    title: { firstY: 352, secondY: 438, firstSize: 72, secondSize: 58 },
  },
  {
    source: "amalfi-social-portrait-art-v2.png",
    output: "amalfi-social-portrait-v2.png",
    width: 1080,
    height: 1350,
    logo: { left: 76, top: 70, width: 172 },
    kicker: { y: 242, size: 15, tracking: 4.8, lineWidth: 38 },
    title: { firstY: 376, secondY: 468, firstSize: 74, secondSize: 61 },
  },
];

function overlaySvg(card) {
  const x = card.logo.left;
  const kickerTextX = x + card.kicker.lineWidth + 18;
  const footer = card.footer
    ? `
      <line x1="${x}" y1="${card.footer.y - 36}" x2="${x + 390}" y2="${card.footer.y - 36}"
        stroke="#FDF6F0" stroke-opacity="0.18" stroke-width="1" />
      <text x="${x}" y="${card.footer.y}" class="footer">WALKS · BEACHES · FOOD · TRAILS</text>`
    : "";

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${card.width}" height="${card.height}" viewBox="0 0 ${card.width} ${card.height}">
      <style>
        .serif { font-family: "Merriweather", Georgia, serif; }
        .kicker, .footer { font-family: Arial, Helvetica, sans-serif; }
        .kicker { fill: #F43600; font-size: ${card.kicker.size}px; font-weight: 700; letter-spacing: ${card.kicker.tracking}px; }
        .first { fill: #F43600; font-size: ${card.title.firstSize}px; font-style: italic; font-weight: 400; letter-spacing: -2px; }
        .second { fill: #FDF6F0; font-size: ${card.title.secondSize}px; font-weight: 700; letter-spacing: -1.5px; }
        .footer { fill: #FDF6F0; fill-opacity: 0.58; font-size: ${card.footer?.size ?? 14}px; font-weight: 700; letter-spacing: ${card.footer?.tracking ?? 2}px; }
      </style>
      <line x1="${x}" y1="${card.kicker.y - 5}" x2="${x + card.kicker.lineWidth}" y2="${card.kicker.y - 5}"
        stroke="#F43600" stroke-width="3" stroke-linecap="round" />
      <text x="${kickerTextX}" y="${card.kicker.y}" class="kicker">CURATED LOCAL GUIDE</text>
      <text x="${x}" y="${card.title.firstY}" class="serif first">Amalfi Coast,</text>
      <text x="${x}" y="${card.title.secondY}" class="serif second">in your pocket</text>
      ${footer}
    </svg>
  `);
}

for (const card of cards) {
  const logo = await sharp(logoPath)
    .resize({ width: card.logo.width })
    .png()
    .toBuffer();

  await sharp(path.join(sourceDir, card.source))
    .resize(card.width, card.height, { fit: "cover", position: "centre" })
    .composite([
      { input: logo, left: card.logo.left, top: card.logo.top },
      { input: overlaySvg(card), left: 0, top: 0 },
    ])
    .flatten({ background: "#1A0A00" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(imageDir, card.output));
}
