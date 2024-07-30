import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import LocationToCoordinates from "./LocationToCoordinates"
import WeatherData from "./WeatherData"
import PromptToLocationGemini from "./PromtToLocationGemini"
import WeatherDescript from "./WeatherDescript"

const useApiRequests = (prompt) => {
  const [error, setError] = useState(null)
  const [locationData, setLocationData] = useState([])
  const [weatherData, setWeatherData] = useState({})
  const [weatherDescription, setWeatherDescription] = useState("")
  const [promptData, setPromptData] = useState({})

  // Fetch location and weather data from API.
  useEffect(() => {
    const fetchData = async () => {
      if (!prompt) return // return if prompt is null or undefined

      try {
        const promptData = await PromptToLocationGemini(prompt)
        setPromptData(promptData)

        const locationDataRes = await LocationToCoordinates(promptData.city)
        setLocationData(locationDataRes)

        // Now based on the coordinates, below comp return the temp, wind, etc
        const weatherDataRes = await WeatherData(locationDataRes)
        setWeatherData(weatherDataRes)

        const weatherSuggestions = await WeatherDescript(prompt, weatherDataRes)
        setWeatherDescription(weatherSuggestions)

        //
      } catch (error) {
        setError(error)
        console.error("Error:", "Location Not Found, Enter the Main City!")
      }
    }

    fetchData()
  }, [prompt]) // run effect when `prompt` changes

  return { error, locationData, weatherData, promptData, weatherDescription }
}

useApiRequests.propTypes = {
  prompt: PropTypes.string.isRequired,
}

export default useApiRequests
