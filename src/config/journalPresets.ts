export interface JournalFontPreset {
  id: string;
  name: string;
  body: {
    fontFamily: string;
    fontSize: string;
    color: string;
  };
  greeting: {
    fontFamily: string;
    fontSize: string;
    color: string;
  };
  title: {
    fontFamily: string;
    fontSize: string;
    color: string;
  };
  closing: {
    fontFamily: string;
    fontSize: string;
    color: string;
  };
}

export const FONT_PRESETS: JournalFontPreset[] = [
  {
    id: "dearest-default",
    name: "Dearest Default",
    body: { fontFamily: "IceFont Regular", fontSize: "0.406875cm", color: "black" },
    greeting: { fontFamily: "IceFont Italic", fontSize: "0.406875cm", color: "black" },
    title: { fontFamily: "IceFont Italic", fontSize: "0.8cm", color: "black" },
    closing: { fontFamily: "IceFont Italic", fontSize: "inherit", color: "black" },
  },
  {
    id: "classic",
    name: "Classic",
    body: { fontFamily: "IceFont Regular", fontSize: "0.406875cm", color: "black" },
    greeting: { fontFamily: "IceFont Regular", fontSize: "0.406875cm", color: "black" },
    title: { fontFamily: "IceFont Regular", fontSize: "0.8cm", color: "black" },
    closing: { fontFamily: "IceFont Regular", fontSize: "inherit", color: "black" },
  },
  {
    id: "soft-violet",
    name: "Soft Violet",
    body: { fontFamily: "IceFont Regular", fontSize: "0.406875cm", color: "#C9B8E8" },
    greeting: { fontFamily: "IceFont Italic", fontSize: "0.406875cm", color: "#C9B8E8" },
    title: { fontFamily: "IceFont Italic", fontSize: "0.8cm", color: "#C9B8E8" },
    closing: { fontFamily: "IceFont Italic", fontSize: "inherit", color: "#C9B8E8" },
  },
  {
    id: "small-note",
    name: "Small Note",
    body: { fontFamily: "IceFont Regular", fontSize: "0.35cm", color: "#4a4a4a" },
    greeting: { fontFamily: "IceFont Italic", fontSize: "0.35cm", color: "#4a4a4a" },
    title: { fontFamily: "IceFont Italic", fontSize: "0.7cm", color: "#4a4a4a" },
    closing: { fontFamily: "IceFont Italic", fontSize: "0.35cm", color: "#4a4a4a" },
  },
];

export interface CoverColorPreset {
  id: string;
  name: string;
  color: string;
}

export const COVER_PRESETS: CoverColorPreset[] = [
  { id: "pastel-violet", name: "Pastel Violet", color: "#C9B8E8" },
  { id: "soft-lilac", name: "Soft Lilac", color: "#E5D7F2" },
  { id: "lavender", name: "Lavender", color: "#D8C9EF" },
  { id: "dusty-violet", name: "Dusty Violet", color: "#BDAACF" },
  { id: "mauve", name: "Mauve", color: "#D4BFCF" },
  { id: "blush", name: "Blush", color: "#EBCFD6" },
  { id: "powder-blue", name: "Powder Blue", color: "#C8DCEF" },
  { id: "sage", name: "Sage", color: "#C9DCCF" },
  { id: "buttercream", name: "Buttercream", color: "#EFE1B8" },
  { id: "warm-gray", name: "Warm Gray", color: "#D8D6D3" },
];
