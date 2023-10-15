const frameLooper = (analyser, fn) => {
  const repeater = () => frameLooper(analyser, fn);
  window.RequestAnimationFrame =
    window.requestAnimationFrame(repeater) ||
    window.msRequestAnimationFrame(repeater) ||
    window.mozRequestAnimationFrame(repeater) ||
    window.webkitRequestAnimationFrame(repeater);

  const fbc_array = new Uint8Array(analyser.frequencyBinCount);
  const bar_count = 32;

  analyser.getByteFrequencyData(fbc_array);

  const coords = [];

  for (var i = 0; i < bar_count; i++) {
    const bar_pos = i * 4;
    const bar_width = 2;
    const bar_height = -(fbc_array[i] / 2);
    coords.push({ bar_pos, bar_width, bar_height });
  }
  fn && fn(coords);
  return coords;
};

class AudioConnector {
  connect(audio) {
    console.log({ "AudioConnector.connect": audio });
    if (this.connected) {
      console.log("Connector is already connected");
      return false;
    }
    audio.crossOrigin = "anonymous";
    try {
      this.context = new AudioContext();
      this.analyser = this.context.createAnalyser();
      this.source = this.context.createMediaElementSource(audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.connected = true;
    } catch (ex) {
      alert(ex.message);
      console.log(ex.message);
      return false;
    }

    console.log({ eq: this });

    return {
      analyser: this.analyser,
      audioContext: this.context,
    };
  }
}

export { AudioConnector, frameLooper };
