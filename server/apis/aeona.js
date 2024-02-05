import { config } from "dotenv";
import axios from "axios"; // Import axios library

config();

const options = {
  method: "GET",
  url: "https://aeona3.p.rapidapi.com/",
  params: {
    text: "Hey my name is Julien! How are you?", // Replace with actual text
    userId: "12312312312",
  },
  headers: {
    "X-RapidAPI-Key": process.env.AEONA_API_KEY,
    "X-RapidAPI-Host": "aeona3.p.rapidapi.com",
  },
};

async function fetchData() {
  try {
    const response = await axios.request(options); // Use axios.request method
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
