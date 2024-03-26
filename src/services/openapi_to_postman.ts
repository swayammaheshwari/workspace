import Converter, { ConvertResult } from 'openapi-to-postmanv2';

export function convertYamlToPostman(yamlData: string): any {
  let resultFormat: any;

  Converter.convert(
    { type: "string", data: yamlData },
    {},
    (
      err: any,
      conversionResult: ConvertResult
    ) => {
      if (err) {
        console.error("Conversion error:", err);
      } else if (!conversionResult.result) {
        console.log("Could not convert", conversionResult.reason);
      } else {
        resultFormat = conversionResult.output[0].data;
      }
    }
  );

  return resultFormat;
}
