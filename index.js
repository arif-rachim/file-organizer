const fs = require("fs");
const path = require('path');
const prompt = require("prompt");

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function getInputAndOutputPath() {
    return new Promise(resolve => {
        const properties = [{
            name: 'input',
            description: 'Input path to the pictures folder',
            required: true,
            message: 'Eg : C:\\Users\\aarif\\Pictures'
        }, {
            name: 'output',
            description: 'Input path to the organized pictures folder',
            required: true,
            message: 'Eg : C:\\Users\\aarif\\Pictures-Organized'
        }];
        prompt.start();
        prompt.get(properties, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            const {input, output} = result;
            resolve([input, output]);
        });
    });
}

const pad = (text) => {
    const output = text.toString();
    return output.length < 2 ? '0'+output : output;
}
let totalFiles = 0;
function iterateEachFileAndOrganizedToOuputFolder(input, output) {
    fs.readdir(input, (err, files) => {
        if (err) {
            console.error('Unable to scan ', input);
        }
        files.forEach(file => {
            const fileFullPath = path.join(input, file);
            const stats = fs.statSync(fileFullPath);
            if (stats.isDirectory()) {
                iterateEachFileAndOrganizedToOuputFolder(fileFullPath, output);
            } else {
                totalFiles++;
                const creationDate = stats.mtime < stats.ctime ? stats.mtime : stats.ctime;
                const year = creationDate.getFullYear();
                const date = pad(creationDate.getDate());
                const monthText = months[creationDate.getMonth()];
                const month = pad((creationDate.getMonth() + 1));
                const outputdir = path.join(output, `${year}`,`${month}-${monthText}`);
                fs.mkdirSync(outputdir, {recursive: true});
                const extName = path.extname(file);
                const fileName = `${date}-${monthText}-${year}-${pad(creationDate.getHours())}${pad(creationDate.getMinutes())}${pad(creationDate.getSeconds())}${extName}`;
                const outputFile = path.join(outputdir, fileName);
                try{
                    if(fs.existsSync(outputFile)){
                        console.log(totalFiles,'Skip',outputFile);
                    }else{
                        fs.copyFile(fileFullPath, outputFile , (err) => {
                            if (err) {
                                console.error(totalFiles,err);
                                return;
                            }
                            console.log(totalFiles,`${fileFullPath} > ${outputdir}`);
                        });
                    }
                }catch(err){
                }
            }
        })
    })
}

const start = async () => {
    const [input, output] = await getInputAndOutputPath();
    fs.mkdirSync(output, {recursive: true});
    iterateEachFileAndOrganizedToOuputFolder(input, output);
}

start().then();