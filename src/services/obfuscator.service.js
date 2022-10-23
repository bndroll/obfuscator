import { LogService } from './log.service.js';


export class ObfuscatorService {
    constructor() {
        this.logService = new LogService();
    }

    obfuscate(sourceCode, verbose = false) {
        let resultCode = '';

        const reWords = /([a-z0-9]+)/gi;
        const reShebang = /^#!.*(\r|\n|\r\n)/gi;
        const reComments = /(\/\*[\s\S]*?\*\/|\s*\/\/.*(\r|\n|\r\n|$))/gi;
        const reWhiteSpace = /([\n\r])(\s)+/gi;
        const reSemiColonNewLine = /;[\n\r]+/gim;

        sourceCode = sourceCode.replace(reComments, '');
        sourceCode = sourceCode.replace(reShebang, '');
        sourceCode = sourceCode.replace(reWhiteSpace, (a, b, c) => b);
        sourceCode = sourceCode.replace(reSemiColonNewLine, ';');

        const sourceCodeWords = sourceCode.match(reWords);

        const dictionary = [];

        for (let i in sourceCodeWords) {
            const word = sourceCodeWords[i];

            let j = 0;
            while (j < dictionary.length) {
                if (dictionary[j].word === word) {
                    dictionary[j].count++;
                    break;
                }
                j++;
            }

            if (j === dictionary.length) {
                dictionary.push({word: word, count: 1});
            }
        }

        if (verbose) {
            this.logService.printVerboseMessage(`Word dictionary:`);
            console.log(dictionary);
        }

        const sortedDictionary = [];

        for (let i in dictionary) {
            let count = dictionary[i].count + dictionary.length;
            while (sortedDictionary[count] !== undefined) {
                count--;
            }
            sortedDictionary[count] = dictionary[i].word;
        }

        const sortedWordsList = sortedDictionary.filter(item => !!item).reverse();

        if (verbose) {
            this.logService.printVerboseMessage(`Sorted words list is as follows:`);
            console.log(sortedWordsList);
        }

        for (let i in sortedWordsList) {
            sourceCode = sourceCode.replace(
                RegExp('(^|[^a-z0-9])(' + sortedWordsList[i] + ')($|[^a-z0-9])', 'gm'),
                function (a, b, c, d) {
                    return b + 'x' + i + d;
                }
            );
        }

        sourceCode = sourceCode.replace(/\r\n|\r|\n/g, 'xn');
        sourceCode = sourceCode.replace(/"/g, 'xq');
        sourceCode = sourceCode.replace(/'/g, 'xs');
        sourceCode = sourceCode.replace(/\\/g, 'xb');

        resultCode =
            '(function(){let e=eval;let x = "' +
            sourceCode +
            '";let z = "";[["xb","\\\\"],["xn","\\n"],["xq","\\""],["xs","\'"]].map(function(z){x=x.replace(RegExp(z[0],"g"),z[1])});z = "' +
            sortedWordsList.join(' ') +
            '".split(" ");let y = z.length - 1;while(y > -1){x = x.replace(RegExp("x"+y,"g"),z[y]);y--}e(x);}());';

        if (verbose) {
            this.logService.printVerboseMessage(`Output code is as follows:\n${resultCode}`);
        }

        return resultCode;
    }
}