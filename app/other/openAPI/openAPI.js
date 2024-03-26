import * as fs from 'fs';
// const fs = require("fs")
// const Converter = require("openapi-to-postmanv2")
import Converter from 'openapi-to-postmanv2';
import { writeToFile } from '../_app/functions/readAndWrite.js';

const openapiData = fs.readFileSync('public/openAPI.yaml', { encoding: 'UTF8' });

//   console.log(openapiData.toString())

Converter.convert({ type: 'string', data: openapiData },
  {}, (err, conversionResult) => {
    if (!conversionResult.result) {
      console.log('Could not convert', conversionResult.reason);
    }
    else {
      var dataAsString = JSON.stringify(conversionResult.output[0].data)
      const result = writeToFile(dataAsString, "./app/_app/results/output.txt");
      // console.log(result)
    }
  }
);