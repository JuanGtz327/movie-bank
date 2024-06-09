import React, { useState } from "react";
import OpenAI from "openai";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey:'sk-proj-cEnZQmeYUWKlcbKs9n5wT3BlbkFJfOSJH7fESS7JnFaPoUg1', dangerouslyAllowBrowser: true });

const fetchRecommendations = async (emotions, moviesData) => {
  const prompt = `Basandote en estas emociones: ${emotions} recomienda 3 peliculas de esta lista ${moviesData}, si no encuentras una dame una recomendacion tuya. Usa el formato pelicula (año) : descripcion`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
};

const MovieRecommendations = ({ moviesDataList, onMovieAIFetched, onShowDrawer }) => {
  const [emotions, setEmotions] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const recommendationsText = await fetchRecommendations(
        emotions,
        moviesDataList
      );
      const recommendationsList = recommendationsText
        .split("\n")
        .filter((movie) => movie);
      setRecommendations(recommendationsList);
      onMovieAIFetched(recommendationsList);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Error fetching recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full md:w-96">
      <CardHeader
        variant="gradient"
        className="mb-4 grid h-48 place-items-center bg-[#5a39a7] text-center"
      >
        <Typography color="white" className="text-2xl md:text-3xl font-bold">
          ¿Cómo te sientes hoy?
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 h-full justify-center">
        <Textarea
          value={emotions}
          name="feelings"
          variant="standard"
          placeholder="Me siento feliz :D"
          color="purple"
          size="lg"
          className="h-fit"
          onChange={(event) => {
            setEmotions(event.target.value);
          }}
        />
      </CardBody>
      <CardFooter className="pt-0 mt-auto md:pb-16">
        {!loading ? (
          <Button
            className="bg-[#5a39a7]"
            fullWidth
            onClick={getRecommendations}
            disabled={loading}
          >
            Recomiendame una película !!!
          </Button>
        ) : (
          <Spinner color="purple" className="h-8 w-8 mx-auto" />
        )}
        {recommendations.length > 0 && (
          <Button
            className="bg-[#15006D] mt-5"
            fullWidth
            onClick={onShowDrawer}
            disabled={loading}
          >
            Detalles de la recomendacion
          </Button>
        )}
        <Button
          className="hidden bg-[#1DB954] text-[#191414] mt-5 justify-center items-center gap-1"
          fullWidth
          onClick={getRecommendations}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#000000"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527" />
            <path d="M9 15c1.5 -1 4 -1 5 .5" />
            <path d="M7 9c2 -1 6 -2 10 .5" />
          </svg>
          <span>Vincular spotify</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieRecommendations;