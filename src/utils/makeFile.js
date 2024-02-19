export const makeFile = (base64String, fileName, fileType) => {
  return new Promise((resolve, reject) => {
    const base64Data = base64String.split(",")[1];
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: fileType });
    const file = new File([blob], fileName, { type: fileType });
    if (file) {
      resolve(file);
    } else {
      reject();
    }
  });
};
