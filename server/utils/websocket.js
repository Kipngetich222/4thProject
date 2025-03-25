// // utils/websocket.js
// import { WebSocketServer } from "ws";
// import WebSocket from "ws";
// import axios from "axios";

// let wssInstance;
// const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL;
// const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
// let connectionCount = 0;
// let heartbeatInterval;

// export function initializeWebSocket(server) {
//   wssInstance = new WebSocketServer({ server });
  
//   // Heartbeat setup
//   heartbeatInterval = setInterval(() => {
//     wssInstance.clients.forEach((ws) => {
//       if (!ws.isAlive) {
//         console.log('Terminating inactive connection');
//         return ws.terminate();
//       }
//       ws.isAlive = false;
//       ws.ping();
//     });
//   }, 30000);

//   wssInstance.on("connection", (ws) => {
//     // Connection tracking
//     connectionCount++;
//     console.log(`New client connected (${connectionCount} total connections)`);
    
//     ws.isAlive = true;
//     ws.send(JSON.stringify({ 
//       type: "message", 
//       content: "Welcome to the WebSocket server!" 
//     }));

//     ws.on("message", (message) => {
//       try {
//         const parsed = JSON.parse(message);
//         if (parsed.type === "subscribe") {
//           ws.userType = parsed.data.userType;
//           ws.userId = parsed.data.userId;
//           console.log(`Client subscribed as ${parsed.data.userType}`);
//         }
//       } catch (err) {
//         console.error("Error parsing message:", err);
//       }
//     });

//     ws.on("pong", () => {
//       ws.isAlive = true;
//     });

//     ws.on("close", () => {
//       connectionCount--;
//       console.log(`Client disconnected (${connectionCount} remaining connections)`);
//     });

//     ws.on("error", (error) => {
//       console.error("WebSocket error:", error);
//     });
//   });

//   wssInstance.on("close", () => {
//     clearInterval(heartbeatInterval);
//     console.log("WebSocket server closed");
//   });
// }

// export function getConnectionCount() {
//   return connectionCount;
// }

// export async function broadcastEvent(event) {
//   if (!wssInstance) {
//     console.error("WebSocket server not initialized");
//     return;
//   }

//   const eventMessage = {
//     type: "newEvent",
//     event: {
//       _id: event._id,
//       title: event.title,
//       description: event.description,
//       start: event.start,
//       end: event.end,
//       aiSummary: event.aiSummary || `${event.title}: ${event.description || "No description"}`.slice(0, 100)
//     },
//     timestamp: new Date().toISOString()
//   };

//   const shouldCheckRelevance = event.title.length > 3 && 
//                              (event.description || '').length > 10;

//   try {
//     let isRelevant = true;
    
//     if (shouldCheckRelevance) {
//       const relevanceCheck = await axios.post(
//         DEEPSEEK_API_URL,
//         {
//           model: "openai/gpt-3.5-turbo",
//           messages: [{
//             role: "system",
//             content: `Determine if this school event is relevant to parents (respond only "yes" or "no"):
//             Title: ${event.title}
//             Description: ${event.description || "No description provided"}
//             Consider relevance based on:
//             - Academic importance
//             - Student participation
//             - Parent involvement potential
//             - General school interest`
//           }],
//           temperature: 0.2,
//           max_tokens: 10
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
//             "Content-Type": "application/json",
//             "HTTP-Referer": "http://localhost:5000"
//           },
//           timeout: 5000
//         }
//       );

//       isRelevant = relevanceCheck.data.choices[0].message.content
//         .trim()
//         .toLowerCase()
//         .startsWith("yes");
//     }

//     const parents = Array.from(wssInstance.clients).filter(
//       client => client.readyState === WebSocket.OPEN && 
//                client.userType === "parent"
//     );

//     if (parents.length > 0 && isRelevant) {
//       console.log(`Broadcasting event to ${parents.length} parents`);
//       parents.forEach(client => {
//         client.send(JSON.stringify(eventMessage));
//       });
//     }
//   } catch (err) {
//     console.error("AI relevance check failed, broadcasting to all parents:", err);
//     Array.from(wssInstance.clients)
//       .filter(client => client.readyState === WebSocket.OPEN && 
//                       client.userType === "parent")
//       .forEach(client => {
//         client.send(JSON.stringify(eventMessage));
//       });
//   }
// }

// // Cleanup function for graceful shutdown
// export function cleanupWebSocket() {
//   if (heartbeatInterval) {
//     clearInterval(heartbeatInterval);
//   }
//   if (wssInstance) {
//     wssInstance.clients.forEach(client => {
//       client.terminate();
//     });
//     wssInstance.close();
//   }
// }

// utils/websocket.js
import { WebSocketServer } from "ws";
import WebSocket from "ws";

let wssInstance;
let connectionCount = 0;
let heartbeatInterval;

// Initialize without AI by default
let useAI = false;
let aiConfig = {};

export function configureAI(apiUrl, apiKey) {
  if (apiUrl && apiKey) {
    useAI = true;
    aiConfig = {
      url: apiUrl,
      key: apiKey
    };
  }
}

export function initializeWebSocket(server) {
  wssInstance = new WebSocketServer({ server });
  
  // Heartbeat setup
  heartbeatInterval = setInterval(() => {
    wssInstance.clients.forEach((ws) => {
      if (!ws.isAlive) {
        console.log('Terminating inactive connection');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wssInstance.on("connection", (ws) => {
    connectionCount++;
    ws.isAlive = true;
    console.log(`New client connected (${connectionCount} total connections)`);
    
    ws.send(JSON.stringify({ 
      type: "message", 
      content: "Welcome to the WebSocket server!" 
    }));

    ws.on("message", (message) => {
      try {
        const parsed = JSON.parse(message);
        if (parsed.type === "subscribe") {
          ws.userType = parsed.data.userType;
          ws.userId = parsed.data.userId;
          console.log(`Client subscribed as ${parsed.data.userType}`);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    });

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("close", () => {
      connectionCount--;
      console.log(`Client disconnected (${connectionCount} remaining connections)`);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  wssInstance.on("close", () => {
    clearInterval(heartbeatInterval);
    console.log("WebSocket server closed");
  });
}

export async function broadcastEvent(event) {
  if (!wssInstance) {
    console.error("WebSocket server not initialized");
    return;
  }

  const eventMessage = {
    type: "newEvent",
    event: {
      _id: event._id,
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      aiSummary: event.aiSummary || `${event.title}: ${event.description || "No description"}`.slice(0, 100)
    },
    timestamp: new Date().toISOString()
  };

  // Skip AI check if not configured
  if (!useAI) {
    sendToParents(eventMessage);
    return;
  }

  const shouldCheckRelevance = event.title.length > 3 && 
                             (event.description || '').length > 10;

  if (shouldCheckRelevance) {
    try {
      const isRelevant = await checkAIRelevance(event);
      if (isRelevant) {
        sendToParents(eventMessage);
      } else {
        console.log("Event deemed not relevant to parents");
      }
    } catch (err) {
      console.error("AI relevance check failed, broadcasting to all parents:", err.message);
      sendToParents(eventMessage);
    }
  } else {
    sendToParents(eventMessage);
  }
}

function sendToParents(message) {
  const parents = Array.from(wssInstance.clients).filter(
    client => client.readyState === WebSocket.OPEN && 
             client.userType === "parent"
  );

  if (parents.length > 0) {
    console.log(`Broadcasting to ${parents.length} parents`);
    parents.forEach(client => {
      client.send(JSON.stringify(message));
    });
  }
}

async function checkAIRelevance(event) {
  try {
    const response = await fetch(aiConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiConfig.key}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Determine if this school event is relevant to parents (respond only "yes" or "no"):
          Title: ${event.title}
          Description: ${event.description || "No description provided"}`
        }],
        temperature: 0.2,
        max_tokens: 10
      }),
      timeout: 5000
    });

    if (!response.ok) throw new Error(`AI API responded with ${response.status}`);
    
    const data = await response.json();
    return data.choices[0].message.content.trim().toLowerCase().startsWith("yes");
  } catch (err) {
    console.error("AI check failed:", err.message);
    throw err;
  }
}

export function getConnectionCount() {
  return connectionCount;
}

export function cleanupWebSocket() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (wssInstance) {
    wssInstance.clients.forEach(client => client.terminate());
    wssInstance.close();
  }
}