import { XMLParser } from 'fast-xml-parser';
import JSZip from 'jszip';

export interface ParsedSlide {
  title: string;
  content: string;
}

const xmlParser = new XMLParser({ ignoreAttributes: false });

const SLIDE_PATH_PATTERN = /^ppt\/slides\/slide(\d+)\.xml$/;

function collectRunTexts(node: unknown, out: string[], key?: string): void {
  if (node === null || node === undefined) {
    return;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    if (key === 'a:t') {
      const text = String(node).trim();
      if (text) {
        out.push(text);
      }
    }
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectRunTexts(item, out, key);
    }
    return;
  }

  if (typeof node === 'object') {
    for (const [childKey, value] of Object.entries(
      node as Record<string, unknown>,
    )) {
      collectRunTexts(value, out, childKey);
    }
  }
}

function extractSlideTexts(slideXml: string): string[] {
  const parsed: unknown = xmlParser.parse(slideXml);
  const texts: string[] = [];
  collectRunTexts(parsed, texts);
  return texts;
}

/**
 * Parses a .pptx file buffer into one entry per slide.
 * The first text run on a slide becomes its title; the rest becomes the content.
 */
export async function parsePptx(buffer: Buffer): Promise<ParsedSlide[]> {
  const zip = await JSZip.loadAsync(buffer);

  const slideFiles = Object.keys(zip.files)
    .map((path) => {
      const match = SLIDE_PATH_PATTERN.exec(path);
      return match ? { path, index: Number(match[1]) } : null;
    })
    .filter((entry): entry is { path: string; index: number } => entry !== null)
    .sort((a, b) => a.index - b.index);

  const slides: ParsedSlide[] = [];

  for (const { path } of slideFiles) {
    const file = zip.files[path];
    if (!file) {
      continue;
    }
    const xml = await file.async('string');
    const texts = extractSlideTexts(xml);
    const [title, ...rest] = texts;
    slides.push({
      title: title ?? '',
      content: rest.join('\n'),
    });
  }

  return slides;
}
