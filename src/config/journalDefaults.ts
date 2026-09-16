import { type JournalConfig } from '../types/journalConfig';
import { LINE_HEIGHT_CM } from '../utils/typography';

export const DEFAULT_JOURNAL_CONFIG: JournalConfig = {
  title: {
    text: "To My Dearest Beloved Miss",
    showHeart: true,
    fontFamily: "IceFont Italic",
    fontSize: "0.8cm",
    color: "black",
  },
  body: {
    fontFamily: "IceFont Regular", 
    fontSize: `${LINE_HEIGHT_CM * 0.7}cm`,
    color: "black",
  },
  greeting: {
    fontFamily: "IceFont Italic", 
    fontSize: `${LINE_HEIGHT_CM * 0.7}cm`,
    color: "black",
  },
  kaomoji: {
    enabled: true,
    text: "⊂(≽^•⩊•^≼)つ",
    fontFamily: "IceFont Regular", 
    fontSize: "0.45cm",
    color: "black",
    alignment: "center",
  },
  signature: {
    enabled: false,
    image: "/signature/OI-DigitalSignature-Icee.png",
    opacity: 0.65,
    width: "3cm",
    offsetX: "-0.2cm",
    offsetY: "-1.7cm",
  },
  closing: {
    enabled: true,
    soulfullyYours: "Soulfully Yours,",
    mrDearest: "Mr.Dearest",
    alignment: "right",
    fontFamily: "IceFont Italic",
    fontSize: "inherit", // inherit from the overlay to match original
    color: "black",
  },
  frontCover: {
    type: "color",
    color: "#C9B8E8", // Pastel Violet
    imagePosition: "center",
    imageSize: "cover",
  },
  backCover: {
    type: "color",
    color: "#C9B8E8",
    imagePosition: "center",
    imageSize: "cover",
  },
  customFonts: [],
};
