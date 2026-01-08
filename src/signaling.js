// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default class Signaling {
//   constructor(roomName, onMessage) {
//     this.roomName = roomName;
//     this.onMessage = onMessage; // callback for messages
//     this.ws = null;
//     this.queue = [];
//     this.isOpen = false;
//   }

//   async connect() {
//     const token = await AsyncStorage.getItem("userToken");
//     const SIGNALING_SERVER = "ws://showa.essential.com.ng";
//     const url = `${SIGNALING_SERVER}/ws/livestream/${this.roomName}/?token=${token || ""}`;
//     console.log("🔗 WS URL:", url);

//     this.ws = new WebSocket(url);

//     this.ws.onopen = () => {
//       console.log("🔗 Connected to signaling server");
//       this.isOpen = true;

//       // flush queued messages
//       this.queue.forEach((msg) => this.ws.send(JSON.stringify(msg)));
//       this.queue = [];
//     };

//     this.ws.onmessage = (e) => {
//       try {
//         const msg = JSON.parse(e.data);
//         console.log("📩 Signaling msg:", msg);

//         // handle special messages here
//         switch (msg.type) {
//           case "new-comment":
//             console.log("💬 New comment:", msg.comment, "on stream", msg.streamId);
//             break;
//           case "new-like":
//             console.log("❤️ New like on stream", msg.streamId);
//             break;
//           case "viewer-count":
//             console.log("👥 Viewer count update:", msg.count, "for stream", msg.streamId);
//             break;
//           default:
//             break;
//         }

//         // pass everything back to the UI
//         this.onMessage && this.onMessage(msg);
//         console.log("message sent to UI", this.onMessage);
//       } catch (err) {
//         console.warn("Error parsing signaling msg:", err);
//       }
//     };

//     this.ws.onclose = (e) => {
//       console.log("❌ Signaling connection closed", e?.code, e?.reason);
//       this.isOpen = false;
//     };

//     this.ws.onerror = (err) => {
//       console.warn("WebSocket error", err);
//       this.isOpen = false;
//     };
//   }

//   send(msg) {
//     if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
//       this.ws.send(JSON.stringify(msg));
//     } else {
//         console.log('Quenes message open ');
//       this.queue.push(msg);
//     }
//   }

//   close() {
//     try {
//       this.ws && this.ws.close();
//     } catch {}
//     this.isOpen = false;
//   }
// }

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Signaling {
  constructor(roomName, onMessage) {
    this.roomName = roomName;
    this.onMessage = onMessage;
    this.ws = null;
    this.queue = [];
    this.isOpen = false;
  }

  async connect() {
    const token = await AsyncStorage.getItem("userToken");
    const SIGNALING_SERVER = "ws://showa.essential.com.ng";
    const url = `${SIGNALING_SERVER}/ws/livestream/${this.roomName}/?token=${token || ""}`;
    console.log("🔗 WS URL:", url);

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("🔗 Connected to signaling server");
      this.isOpen = true;
      this.queue.forEach((msg) => this.ws.send(JSON.stringify(msg)));
      this.queue = [];
    };

    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        console.log("📩 Signaling msg:", msg);

        switch (msg.type) {
          case "new-comment":
            console.log("💬 New comment:", msg.comment, "on stream", msg.streamId);
            break;
          case "new-like":
            console.log("❤️ New like on stream", msg.streamId);
            break;
          case "viewer-count":
            console.log("👥 Viewer count update:", msg.count, "for stream", msg.streamId);
            break;
          case "broadcaster-info":
            console.log("📡 Broadcaster info:", msg.broadcaster);
            break;
          default:
            break;
        }

        this.onMessage && this.onMessage(msg);
      } catch (err) {
        console.warn("Error parsing signaling msg:", err);
      }
    };

    this.ws.onclose = (e) => {
      console.log("❌ Signaling connection closed", e?.code, e?.reason);
      this.isOpen = false;
    };

    this.ws.onerror = (err) => {
      console.warn("WebSocket error", err);
      this.isOpen = false;
    };
  }

  send(msg) {
    if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.log("Queuing message");
      this.queue.push(msg);
    }
  }

  close() {
    try {
      this.ws && this.ws.close();
    } catch {}
    this.isOpen = false;
  }
}


