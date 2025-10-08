import chalk from 'chalk';

export function colorizeStatus(status: string): string {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('downloading')) {
        return chalk.green(status);
    } else if (lowerStatus.includes('paused')) {
        return chalk.yellow(status);
    } else if (lowerStatus.includes('queued')) {
        return chalk.blue(status);
    } else if (lowerStatus.includes('failed') || lowerStatus.includes('error')) {
        return chalk.red(status);
    } else if (lowerStatus.includes('completed') || lowerStatus.includes('done')) {
        return chalk.greenBright(status);
    } else if (lowerStatus.includes('extracting') || lowerStatus.includes('verifying')) {
        return chalk.cyan(status);
    } else {
        return chalk.gray(status);
    }
}