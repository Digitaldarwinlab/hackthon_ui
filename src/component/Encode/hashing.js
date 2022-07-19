import { encode, decode } from "js-base64";

export const Encode = (data) => {
    return {payload: encode(JSON.stringify(data))};
}

export const Decode = (data) => {
    return JSON.parse(decode(data.response));
}
