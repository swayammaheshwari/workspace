const regex = /const\s+formInputValuesUpdated\s*=(?=.*titleInput\.value\s*(!==|!=)\s*currentTask\.title)/

assert.match(code, regex)