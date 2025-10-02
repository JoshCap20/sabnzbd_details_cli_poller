
import * as cliProgress from 'cli-progress';

export class ThemeHelper {
    public static stringToThemeMap: Record<string, cliProgress.Preset> = {
        'legacy': cliProgress.Presets.legacy,
        'rect': cliProgress.Presets.rect,
        'shades_classic': cliProgress.Presets.shades_classic,
        'shades_grey': cliProgress.Presets.shades_grey,
    }

    public static defaultThemeString: string = 'shades_grey';

    public static mapStringToTheme(theme: string): cliProgress.Preset {
        return ThemeHelper.stringToThemeMap[theme] ?? ThemeHelper.stringToThemeMap[ThemeHelper.defaultThemeString]!;
    }

    public static getAvailableThemeStrings(): string[] {
        return Object.keys(ThemeHelper.stringToThemeMap);
    }
}