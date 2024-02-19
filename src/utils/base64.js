export const base64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const base64String = e.target.result;
      resolve(base64String);
    };
    // reader.onload = function (e) {
    //   const imageData = e.target.result;
    //   const base64String = `data:image/png;base64,${btoa(imageData)}`;
    //   resolve(base64String);
    // };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
