export function formDataToObject(formData) {
  const obj = {};

  formData.forEach((value, key) => {
    try {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          obj[key].push(value);
        } else {
          obj[key] = [obj[key], value];
        }
      } else {
        if (
          (typeof value === "string" &&
            value.trim().startsWith("[") &&
            value.trim().endsWith("]")) ||
          (typeof value === "string" &&
            value.trim().startsWith("{") &&
            value.trim().endsWith("}"))
        ) {
          obj[key] = JSON.parse(value);
        } else {
          obj[key] = value;
        }
      }
    } catch (error) {
      obj[key] = value;
    }
  });

  return obj;
}
