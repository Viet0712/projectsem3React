import axios from "axios";

const urlApi = "http://localhost:5102/api/";
export const APILink = () => {
  return "http://localhost:5102/api/";
};
const apiRequestForm = async (method, uri, data = null) => {
  try {
    const config = {
      method: method,
      url: urlApi + uri,

      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export const apiRequest = async (method, uri, data = null) => {
  console.log(data);
  try {
    const config = {
      method: method,
      url: urlApi + uri,
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export const apiRequestGet = async (uri, data = null) => {
  console.log(data);
  try {
    const config = {
      method: "Get",
      url: urlApi + uri,
    };

    if (data) {
      config.url = urlApi + uri + "/" + data;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export default apiRequestForm;
