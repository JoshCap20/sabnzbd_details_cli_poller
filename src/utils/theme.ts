import * as cliProgress from 'cli-progress';

const stringToThemeMap: Record<string, cliProgress.Preset> = {
    'legacy': cliProgress.Presets.legacy,
    'rect': cliProgress.Presets.rect,
    'shades_classic': cliProgress.Presets.shades_classic,
    'shades_grey': cliProgress.Presets.shades_grey,
}

export const defaultThemeString = 'shades_grey';

export function mapStringToTheme(theme: string): cliProgress.Preset {
    return stringToThemeMap[theme] ?? stringToThemeMap[defaultThemeString] ?? cliProgress.Presets.shades_grey;
}

export function getAvailableThemeStrings(): string[] {
    return Object.keys(stringToThemeMap);
}