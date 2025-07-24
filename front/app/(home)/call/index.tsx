import {
  User,
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import React from "react";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
const userId = "89435b50-e0a2-4955-b0a6-23257c2969b1";
const token = "";
const callId = "my-call-id";
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

const CallScreen = () => {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent />
      </StreamCall>
    </StreamVideo>
  );
};

export default CallScreen;
