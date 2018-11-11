import jwt from "jsonwebtoken";

const createJWT = (id: number) : string => {
    const token  = jwt.sign({
        id: id
    }, process.env.JWT_TOKEN || "zyeWLY3RPcVTCQ7zJTvCVJQYtbGedHPyE7uwvkS9cTZHc8LS5xw");
    return token;


}

export default createJWT;