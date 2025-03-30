export function separateFilesAndModifyObject(obj) {
  const filesArray = [];

  // Loop through the object to identify File fields
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Check if the value is a File object
      if (value instanceof File) {
        // Push the file information to the new array
        filesArray.push({
          file: value,
          name: key,
          url: "", // You can set the URL later or get it if needed
        });

        // Delete the file from the original object
        delete obj[key];
      }
    }
  }

  return {
    modifiedObject: obj,
    filesArray,
  };
}
