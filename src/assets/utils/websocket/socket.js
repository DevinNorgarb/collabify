import openSocket from "socket.io-client";
import store from "../../../store/SpotifyAPI";
import EventBus from "assets/utils/EventBus";
import { LocalStorage } from "quasar";

console.log(store.state.config);

const io = openSocket(`${store.state.config.socketUrl}/connect`);

export const initListeners = accessToken => {
  io.on("initial_state", initial_state => {
    broadcastSocketEvent("initial_state", initial_state);
  });

  io.on("playback_started", playback_started => {
    broadcastSocketEvent("playback_started", playback_started);
  });

  io.on("playback_paused", playback_paused => {
    broadcastSocketEvent("playback_paused", playback_paused);
  });

  io.on("device_change", device_change => {
    broadcastSocketEvent("device_change", device_change);
  });

  io.on("volume_change", volume_change => {
    broadcastSocketEvent("volume_change", volume_change);
  });

  io.on("track_end", track_end => {
    broadcastSocketEvent("track_end", track_end);
  });

  io.on("track_change", track_change => {
    broadcastSocketEvent("track_change", track_change);
  });

  if (accessToken.length > 15) {
    io.emit("initiate", {
      accessToken: accessToken
    });
  }
};

export function broadcastSocketEvent(eventName, payload) {
  EventBus.$emit(`socket-event`, {
    action: eventName,
    payload: payload
  });
}
