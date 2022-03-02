const fs = require('fs');

const deteleFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if(err) {
            throw err;
        }
    });
}

exports.deteleFile = deteleFile;