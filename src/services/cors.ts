import cors from "cors";

const whitelist = [
  "http://localhost:3000",
];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.log("origin ==", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// export default cors(corsOptions);
