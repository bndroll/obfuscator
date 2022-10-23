export class CliParser {
    parseArguments(args) {
        const res = {};
        const [executor, file, ...rest] = args;

        rest.forEach((value, i, arr) => {
            if (value.charAt(0) === '-') {
                if (i === arr.length - 1) {
                    res[value.substring(1)] = true;
                } else if (value.charAt(1) === '-') {
                    res[value.substring(2)] = value.substring(2);
                } else if (arr[i + 1].charAt(0) !== '-') {
                    res[value.substring(1)] = arr[i + 1];
                } else {
                    res[value.substring(1)] = true;
                }
            }
        });
        res['source'] = args[2] ? args[2].charAt(0) !== '-' ? args[2] : null : undefined;

        return res;
    }
}