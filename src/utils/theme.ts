import { Preset, Presets } from 'cli-progress';

const stringToThemeMap: Record<string, Preset> = {
    'legacy': Presets.legacy,
    'rect': Presets.rect,
    'shades_classic': Presets.shades_classic,
    'shades_grey': Presets.shades_grey,
}

export const defaultThemeString = 'shades_grey';

export function mapStringToTheme(theme: string): Preset {
    return stringToThemeMap[theme] ?? stringToThemeMap[defaultThemeString] ?? Presets.shades_grey;
}

export function getAvailableThemeStrings(): string[] {
    return Object.keys(stringToThemeMap);
}