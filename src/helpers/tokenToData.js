import jwt from "jsonwebtoken";

export const tokenToData = (req) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return;
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded) {
    } else {
    }
    return decoded.id;
  } catch (error) {
    console.log(error);
    if (error.message == "jwt expired") {
      return;
    }
    throw new Error(error.message);
  }
};
