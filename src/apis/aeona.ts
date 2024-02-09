import { config } from "dotenv";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

config();

interface Options extends AxiosRequestConfig {
  params: {
    text: string;
    userId: string;
  };
}

const options: Options = {
  method: "GET",
  url: "https://aeona3.p.rapidapi.com/",
  params: {
    text: "Hey my name is Julien! How are you?", // Replace with actual text
    userId: "12312312312",
  },
  headers: {
    "X-RapidAPI-Key": process.env.AEONA_API_KEY!,
    "X-RapidAPI-Host": "aeona3.p.rapidapi.com",
  },
};

async function fetchData(): Promise<void> {
  try {
    const response: AxiosResponse = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
