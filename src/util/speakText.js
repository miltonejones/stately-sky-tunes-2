/**
 * Uses browsers speech synthesis API to speak a given message using a random voice
 * @param {string} message - the message to be spoken
 * @param {boolean} useRandomVoice - whether or not to use a random voice
 * @param {function} onTextChange - optional callback function to be called when text is spoken
 */

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

export const speakText = (
  message,
  useRandomVoice = true,
  lang = "en-US",
  voice,
  onTextChange = null
) => {
  const voices = synth.getVoices();
  const [language] = lang.split("-");

  // Filter available voices to only include those with local service and set to en-US
  const availableVoices = voices?.filter(
    (voice) => !!voice.localService && voice.lang.indexOf(language) > -1
  );

  // Generate random voice if useRandomVoice = true
  const randomVoiceIndex = Math.floor(Math.random() * availableVoices?.length);
  const randomVoice = !availableVoices?.length
    ? null
    : availableVoices[randomVoiceIndex];
  const selectedVoice = !voice
    ? null
    : availableVoices?.find((f) => f.name === voice);

  utterance.volume = 1;
  utterance.lang = lang;
  utterance.text = message;
  utterance.rate = 1.1;

  utterance.onstart = () => {
    onTextChange && onTextChange(message);
  };

  utterance.onend = () => {
    onTextChange && onTextChange(null);
  };

  // Set voice to random voice if available and useRandomVoice is true
  if (randomVoice && useRandomVoice) {
    console.log("random");
    utterance.voice = randomVoice;
  } else if (selectedVoice) {
    console.log("selected");
    utterance.voice = selectedVoice;
  }

  console.log({
    selectedVoice,
    message,
    randomVoice,
  });

  // Speak the message using the browser's speech synthesis API
  synth.speak(utterance);
};
