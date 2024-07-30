// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai"

// async function WeatherDescript(question, weatherData) {
//   const newPrompt = `Question: ${question}. Weather Data: ${JSON.stringify(
//     weatherData
//   )}`

//   const apiKey = import.meta.env.VITE_GEMINI
//   const genAI = new GoogleGenerativeAI(apiKey)

//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     systemInstruction:
//       "In a conversational professional tone, answer the [Question] based on the [Weather Data].\n\nProvide an opinion about what the weather feels like.\nProvide temperature in either Celsius or Fahrenheit, whichever is more appropriate.\nNever display the temperature in Kelvin.\nProvide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a windbreaker, a warm jacket, etc.).",
//   })

//   const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 64,
//     maxOutputTokens: 8192,
//     responseMimeType: "text/plain",
//   }

//   async function run() {
//     try {
//       const chatSession = await model.startChat({
//         generationConfig,
//         history: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `Question: How should I dress for the weather today?\n\nWeather Data:\n${JSON.stringify(
//                   weatherData,
//                   null,
//                   2
//                 )}`,
//               },
//             ],
//           },
//         ],
//       })

//       const result = await chatSession.sendMessage(newPrompt)
//       const responseText = await result.response.text()

//       console.log("Weather Description:", responseText)
//       return responseText
//     } catch (error) {
//       console.error("Error generating weather description:", error)
//       return null
//     }
//   }

//   return run() // Ensure the run function is called and its result is returned
// }

// export default WeatherDescript
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"

async function WeatherDescript(question, weatherData) {
  const newPrompt = `Question: ${question}. Weather Data: ${JSON.stringify(
    weatherData
  )}`

  const apiKey = import.meta.env.VITE_GEMINI
  const genAI = new GoogleGenerativeAI(apiKey)

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "In a conversational professional tone, answer the [Question] based on the [Weather Data].\n\nProvide an opinion about what the weather feels like.\nProvide temperature in either Celsius or Fahrenheit, whichever is more appropriate.\nNever display the temperature in Kelvin.\nProvide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a windbreaker, a warm jacket, etc.).\nRespond to activity-related questions (e.g. 'Can I play cricket today in Delhi?') with appropriate advice based on the weather conditions.",
  })

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  }

  async function run() {
    try {
      const chatSession = await model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: `Question: ${question}\n\nWeather Data:\n${JSON.stringify(
                  weatherData,
                  null,
                  2
                )}`,
              },
            ],
          },
        ],
      })

      const result = await chatSession.sendMessage(newPrompt)
      const responseText = await result.response.text()

      console.log("Weather Description:", responseText)
      return responseText
    } catch (error) {
      console.error("Error generating weather description:", error)
      return null
    }
  }

  return run() // Ensure the run function is called and its result is returned
}

export default WeatherDescript
