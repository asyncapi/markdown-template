const fs = require('fs');

module.exports = {
    'generate:after': generator => {
        if(generator.templateParams.outFilename !== 'asyncapi.md') {
            fs.rename(`${generator.targetDir}/asyncapi.md`,
                `${generator.targetDir}/${generator.templateParams.outFilename}`, () => {});
        }
    }
}
