export type Alignment = 'left' | 'center' | 'right';
export type CoverFit = 'cover' | 'contain';
export type CoverPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
export type CoverType = 'color' | 'image';

export interface JournalConfig {
  title: {
    text: string;
    showHeart: boolean;
    fontFamily: string;
    fontSize: string;
    color: string;
  };
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
  kaomoji: {
    enabled: boolean;
    text: string;
    fontFamily: string;
    fontSize: string;
    color: string;
    alignment: Alignment;
  };
  signature: {
    enabled: boolean;
    image: string; // Built-in default path, usually public/signature/OI-DigitalSignature-Icee.png
    opacity: number;
    width: string;
    offsetX: string;
    offsetY: string;
  };
  closing: {
    enabled: boolean;
    soulfullyYours: string;
    mrDearest: string;
    alignment: Alignment;
    fontFamily: string;
    fontSize: string;
    color: string;
  };
  frontCover: {
    type: CoverType;
    color: string;
    image?: string; // base64 string
    imagePosition: CoverPosition;
    imageSize: CoverFit;
  };
  backCover: {
    type: CoverType;
    color: string;
    image?: string; // base64 string
    imagePosition: CoverPosition;
    imageSize: CoverFit;
  };
  customFonts?: {
    name: string;
    base64: string;
  }[];
  showCoverText?: boolean;
}
