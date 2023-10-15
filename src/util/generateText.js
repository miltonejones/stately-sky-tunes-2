import { streamResponse } from "./streamResponse";

// eslint-disable-next-line
const [_, REACT_APP_CHAT_GPT_API_KEY] =
  process.env.REACT_APP_API_KEY.split(",");

/**
 * Generates text using OpenAI's GPT-3 API
 * @async
 * @function
 * @param {string[]} messages - Array of strings representing the conversation history
 * @param {number} temperature - A number between 0 and 1 representing the creativity of the generated text
 * @returns {Promise<Object>} - A Promise that resolves with an object representing the generated text
 */
export const generateText = async (
  messages,
  temperature,
  max_tokens = 128,
  fn
) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${REACT_APP_CHAT_GPT_API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      temperature,
      model: "gpt-3.5-turbo",
      max_tokens,
      stream: !!fn, // Convert fn to a boolean value
    }),
  };

  /**
   * Sends a POST request to OpenAI's API and returns a Promise that resolves with the response JSON
   * @async
   * @function
   * @param {string} url - The URL to send the request to
   * @param {Object} options - The options to include in the request
   * @returns {Promise<Object>} - A Promise that resolves with the response JSON
   */
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );

  // If the response is not ok, throw an error
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  // If fn is not defined, return the response as JSON
  if (!fn) {
    return await response.json();
  }

  // If fn is defined, stream the response and return it as JSON
  return streamResponse(response, fn);

  // const json = await response.json();
  // return json;
};
