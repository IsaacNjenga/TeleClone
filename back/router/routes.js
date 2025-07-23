import express from "express";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(api_key, api_secret);

router.post("/authorise-token", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, error: "user_id is required" });
  }

  //   const user_id = "4e09f7bd-de12-449c-bf52-5b0d77758f07";

  try {
    const token = serverClient.createToken(user_id);
    console.log(token);
    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error in token generation", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
