export const convertCamelCaseToCapitalized = (inputString) => {
  // Split the camelCase string into words
  if (inputString) {
    let words = inputString
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(/(?=[A-Z])/);

    // Capitalize each word
    let capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    // Join the words into a single string
    let resultString = capitalizedWords.join(" ");

    return resultString;
  }
};
