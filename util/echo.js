// // util/echo.js
// import Pusher from "pusher-js";
// import Echo from "laravel-echo";

// let echoInstance = null;

// /**
//  * Initializes the Echo singleton instance (once) with the given token.
//  * If already initialized, returns the existing instance.
//  */
// export const initializeEcho = (authToken) => {
//   if (typeof window === "undefined") {
//     // Echo should only be initialized in the browser (not SSR)
//     return null;
//   }

//   if (!echoInstance) {
//     window.Pusher = Pusher;

//     echoInstance = new Echo({
//       broadcaster: "pusher",
//       key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
//       cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
//       forceTLS: true,
//       authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/broadcasting/auth`,
//       auth: {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       },
//       enabledTransports: ["ws", "wss"],
//     });
//   }

//   return echoInstance;
// };

// /**
//  * Gets the existing Echo singleton instance.
//  * Throws if it hasn’t been initialized yet.
//  */
// export const getEchoInstance = () => {
//   if (!echoInstance) {
//     throw new Error(
//       "Echo instance not initialized. Call initializeEcho(authToken) first."
//     );
//   }
//   return echoInstance;
// };

// /**
//  * Optional: Fully disconnect and reset the singleton.
//  * Call this if you want to fully clear Echo (e.g. on logout).
//  */
// export const destroyEchoInstance = () => {
//   if (echoInstance) {
//     echoInstance.disconnect();
//     echoInstance = null;
//   }
// };
import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo = null;

if (typeof window !== "undefined") {
  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
    },
  });
}

export default echo;




