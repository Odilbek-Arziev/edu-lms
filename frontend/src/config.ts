import {HOST_API_URL} from "./helpers/url_helper";

interface GoogleConfig {
  API_KEY: string;
  CLIENT_ID: string;
  SECRET: string;
}

interface FacebookConfig {
  APP_ID: string;
}

interface ApiConfig {
  API_URL: string;
}

interface Config {
  google: GoogleConfig;
  facebook: FacebookConfig;
  api: ApiConfig;
}

const config = {
  google: {
    API_KEY: import.meta.env.VITE_APP_GOOGLE_API_KEY ?? "",
    CLIENT_ID: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
  },
  api: {
    API_URL: HOST_API_URL ?? "http://localhost:8000/api/v1/",
  },
};


export default config;