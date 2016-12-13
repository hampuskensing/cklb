import fs = require('fs');

class LayoutFileReader {

  readLayoutFile(filePath: string) {
    let onFileRead = (error: Error, rawLayout: string) => {
      if (error) {
        throw error;
      }
      let layout = JSON.parse(rawLayout);
      console.dir(layout);
    };
    fs.readFile(filePath, 'utf8', onFileRead);
  }

}

export = LayoutFileReader;
