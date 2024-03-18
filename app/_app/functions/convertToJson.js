export const convertToJson = (data) => {
    try {
      let parsedData = JSON.parse(data);
      if (typeof parsedData === "object" && parsedData !== null) {
        return parsedData;
      } else {
        throw new Error("Not a valid JSON");
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return false;
    }
  };
  