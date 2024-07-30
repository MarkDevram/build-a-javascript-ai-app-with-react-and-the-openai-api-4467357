import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"

function PromptToLocationGemini(prompt) {
  const apiKey = `${import.meta.env.VITE_GEMINI}`
  const genAI = new GoogleGenerativeAI(apiKey)

  // Define the function declaration for location queries
  const locationFunctionDeclaration = {
    name: "getLocation",
    parameters: {
      type: "OBJECT",
      properties: {
        city: {
          type: "STRING",
          description: "The name of the city",
        },
        stateCode: {
          type: "STRING",
          description: "Two-letter state code",
        },
        countryCode: {
          type: "STRING",
          description: "Two-letter country code",
        },
        unit: {
          type: "STRING",
          description:
            "Temperature unit, either 'C' for Celsius or 'F' for Fahrenheit, based on the country's common usage",
        },
      },
      required: ["city", "stateCode", "countryCode", "unit"],
    },
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    tools: {
      functionDeclarations: [locationFunctionDeclaration],
    },
  })

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  }

  async function run() {
    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "What's the weather like in Madakasira" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "To answer this question about the weather in Madakasira, I'll provide the location information in the specified format, including the appropriate temperature unit.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: "getLocation",
                args: {
                  city: "Madakasira",
                  stateCode: "AP",
                  countryCode: "IN",
                  unit: "c",
                },
              },
            },
          ],
        },
      ],
    })

    const result = await chat.sendMessage(prompt)
    const functionCall = result.response.functionCalls()[0]
    if (functionCall && functionCall.name === "getLocation") {
      const { city, stateCode, countryCode, unit } = functionCall.args

      const locationObj = {
        city: city,
        stateCode: stateCode,
        countryCode: countryCode,
        unit: unit,
      }
      return locationObj
    } else {
      console.log(null)
      return null
    }
  }

  return run()
}

export default PromptToLocationGemini
