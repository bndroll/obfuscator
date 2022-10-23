import chalk from 'chalk';
import dedent from 'dedent-js';
import { VERSION_MESSAGE } from '../constants/constants.js';


export class LogService {
    printError(message) {
        console.log(`${chalk.bgRed(' ERROR ')} ${message}`);
    }

    printSuccess(message) {
        console.log(`${chalk.bgRed(' SUCCESS ')} ${message}`);
    }

    printHelp() {
        console.log(dedent
            `
            ${chalk.bgCyan(' HELP ')}
            ${VERSION_MESSAGE}
            Usage: \t node ./main.js [INPUT_FILE] [...options]
            Arguments:
            \t -h, --help \t Displays this help message
            \t -version \t Displays version message
            \t -o [FILENAME] \t Output file name
            \t -v, --verbose \t Verbose
            `
        );
    }

    printVersion() {
        console.log(`${chalk.bgGray(' VERSION ')} ${VERSION_MESSAGE}`);
    }

    printVerboseMessage(message) {
        console.log(`${chalk.bgBlue(' VERBOSE MESSAGE ')} ${message}`);
    }
}