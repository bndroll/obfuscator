import * as fs from 'fs';
import { CliParser } from './helpers/cli-parser.js';
import { LogService } from './services/log.service.js';
import { ObfuscatorService } from './services/obfuscator.service.js';
import {
    CANNOT_WRITE_TO_FILE,
    DEFAULT_OUTFILE_NAME,
    FILE_CANNOT_TO_READ,
    FILE_NOT_FOUND
} from './constants/constants.js';


export class App {
    constructor() {
        this.cliParser = new CliParser();
        this.logService = new LogService();
        this.obfuscatorService = new ObfuscatorService();
        this.outputFile = DEFAULT_OUTFILE_NAME;
    }

    executeArguments(args) {
        if (args.h || args.help) {
            this.logService.printHelp();
        }

        if (args.version) {
            this.logService.printVersion();
        }

        if (args.o) {
            this.outputFile = args.o;
        }

        return {source: args.source, verbose: args.v || args.verbose};
    }

    checkSourceFile(filePath) {
        if (!fs.existsSync(filePath)) {
            this.logService.printError(`${FILE_NOT_FOUND}`);
            return false;
        }

        return true;
    }

    async init() {
        const args = this.cliParser.parseArguments(process.argv);
        const {source, verbose} = this.executeArguments(args);

        if (source === null) {
            return;
        }

        if (this.checkSourceFile(source)) {
            await fs.readFile(source, (err, sourceCode) => {
                if (err) {
                    this.logService.printError(`${FILE_CANNOT_TO_READ}`);
                } else {
                    const resultCode = this.obfuscatorService.obfuscate(sourceCode.toString(), verbose);

                    fs.writeFile(this.outputFile, resultCode, (err) => {
                        if (err) {
                            this.logService.printError(`${CANNOT_WRITE_TO_FILE}`);
                        }
                    });
                }
            });
        }
    }
}