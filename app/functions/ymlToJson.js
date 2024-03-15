export const ymlToJson = (yamlText) => {
    try {
      var parser = new window.YAMLParser.Parser();
      var handler = new window.YAMLParser.Handler();
      parser
        .setDocumentStart()
        .setKind("sequence")
        .setSequenceStart(null, {}, true)
        .setFlowStyleFalse()
        .setImplicit(true)
        .endMapping()
        .setTag("!", "tag:yaml.org,2002:seq");
      parser.parse(yamlText, handler);
      parser
        .getDoc()
        .setEnd()
        .setAnchor("&", "anchor")
        .addValue("value")
        .setTag("!", "tag :yaml.org,2002:str")
        .setScalar("This is a scalar value with an anchor & and a tag !");
      parser.close();
  
      return handler.getResult();
    } catch (e) {
      throw e;
    }
  };