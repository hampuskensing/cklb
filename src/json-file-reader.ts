import fs = require('fs');

class JsonFileReader {

  readJsonFile(filePath: string): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      let onFileRead = (error: Error, rawLayout: string) => {
        if (error) {
          reject(error);
        }
        let layout = JSON.parse(rawLayout);
        resolve(layout);
      };
      fs.readFile(filePath, 'utf8', onFileRead);
    });
  }

}

export = JsonFileReader;
