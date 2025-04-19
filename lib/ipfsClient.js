import { create } from "ipfs-http-client";

const ipfs = create({
  url: "http://13.48.194.167:5001", // Replace with your EC2 instance's public IP
});

export default ipfs;
