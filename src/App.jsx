import {
  Carousel,
  Drawer,
  IconButton,
  Rating,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import moviesData from "./data/movies.json";
import logo from "./assets/tmdb.svg";
import MovieAccordion from "./MovieAccordion";
import MovieForm from "./MovieForm";

const backendURL = import.meta.env.VITE_BACK_URL;
const movieKey = import.meta.env.VITE_TMDB_API_KEY;

function RatedIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={`${color ? color : "currentColor"}`}
      className="h-6 w-6"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2l3 5h6l-3 5l3 5h-6l-3 5l-3 -5h-6l3 -5l-3 -5h6z" />
    </svg>
  );
}

function UnratedIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke={`${color ? color : "currentColor"}`}
      className="h-6 w-6"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2l3 5h6l-3 5l3 5h-6l-3 5l-3 -5h-6l3 -5l-3 -5h6z" />
    </svg>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [dataAiResponse, setDataAiResponse] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const onShowDrawer = () => {
    openDrawer();
  };

  useEffect(() => {
    setData(moviesData);
  }, []);

  useEffect(() => {
    if (dataAiResponse.length > 0) openDrawer();
  }, [dataAiResponse]);

  const getRecommendations = async (emotions, type) => {
    setLoading(true);
    let url = "http://localhost:3000/api/openai";
    if (backendURL) url = `${backendURL}/api/openai`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotions, type }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      if (result.recommendationsList.length > 0) {
        const tempMoviesPromises = result.recommendationsList.map(
          async (movieAI) => {
            try {
              const separator = movieAI.includes(" - ") ? "-" : ":";
              const movieParts = movieAI.split(separator);
              const movieName = movieParts[0]
                .split(".")[1]
                .split("(")[0]
                .trim();
              const movieDescription = movieParts[1].trim();
              const movieYear = movieParts[0]
                .split(".")[1]
                .split("(")[1]
                .replace(")", "")
                .trim();
              const results = await searchMovies(movieName, movieYear, type);
              const movieDataResoult = results[0];
              return {
                movieName,
                movieDescription,
                movieYear,
                movieImage: `https://image.tmdb.org/t/p/w500${movieDataResoult.poster_path}`,
              };
            } catch (error) {
              console.log(`Error in movie ${movieAI} was ${error}`);
              return null;
            }
          }
        );
        const tempMovies = await Promise.all(tempMoviesPromises);
        setDataAiResponse(tempMovies);
      } else {
        setError("No se encontraron peliculas :/");
        setDataAiResponse([]);
      }
    } catch (error) {
      setError("");
      console.error("Error fetching recommendations:", error);
      setError("Error fetching recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (movieName, year = "", type) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${movieKey}&query=${encodeURIComponent(
          movieName
        )}${year !== "" && `&year=${year}`}`
      );
      if (!response.ok) {
        throw new Error("Error al buscar la película");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      setError("Error al buscar la película. Por favor, intenta de nuevo.");
      console.log("mamo" + error);
    }
  };

  return (
    <>
      <div className="px-1 md:px-8">
        <div className="w-fit mx-auto rounded-md pt-5 text-center">
          <figcaption className="absolute top-10 md:top-5 left-2/4 flex md:w-fit w-[300px] -translate-x-2/4 justify-center rounded bg-[#302057] px-1 py-2 md:py-4 md:px-6 shadow-lg shadow-black/5 saturate-150 backdrop-blur-sm">
            <div className="flex gap-1 md:gap-3">
              <Typography
                className="text-3xl md:text-5xl font-bold text-white"
              >
                La <span className="text-purple-800">Banca</span> de Películas
              </Typography>
            </div>
          </figcaption>
        </div>
        <div className="mt-16 grid grid-cols-12 md:py-24 md:mt-12 py-12 md:h-[600px]">
          <div className="col-span-full md:col-span-4 md:mx-auto mx-4 flex h-[450px] md:h-full">
            <MovieForm
              getRecommendations={getRecommendations}
              loading={loading}
              recommendations={dataAiResponse}
              onShowDrawer={onShowDrawer}
            />
          </div>
          <div className="col-span-full md:col-span-8 md:mt-0 mt-6">
            <Carousel loop={true} autoplay={true} className="rounded-xl pb-16">
              {data.map((movieElement, index) => {
                return (
                  <figure className="relative w-full" key={index}>
                    <img
                      key={index}
                      src={movieElement.image}
                      className="md:h-[500px] h-[400px] w-[330px] object-contain object-center mx-auto rounded-lg"
                    />
                    <figcaption className="block absolute bottom-0 md:bottom-8 md:left-2/4 md:flex w-full md:w-[calc(100%-4rem)] md:-translate-x-2/4 justify-between rounded-xl bg-white/10 py-4 px-6 shadow-lg shadow-black/5 saturate-150 backdrop-blur-sm">
                      <div className="md:block flex items-center justify-between md:mb-0 mb-3">
                        <Typography
                          color="white"
                          className="text-base md:text-xl font-bold text-center"
                        >
                          {movieElement.name}
                        </Typography>
                        <Typography
                          color="white"
                          className="md:mt-2 font-normal"
                        >
                          {movieElement.seen ? "Vista" : "Por ver"}
                        </Typography>
                      </div>
                      <div className="">
                        <div className="flex justify-between">
                          <Typography
                            className="text-base md:text-xl font-bold"
                            color="white"
                          >
                            Abi
                          </Typography>
                          <Rating
                            unratedColor="gray"
                            ratedColor="gray"
                            ratedIcon={<RatedIcon color="white" />}
                            unratedIcon={<UnratedIcon color="white" />}
                            value={movieElement.a_qualification}
                          />
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                          <Typography
                            className="text-base md:text-xl font-bold"
                            color="white"
                          >
                            Charly
                          </Typography>
                          <Rating
                            unratedColor="gray"
                            ratedColor="gray"
                            ratedIcon={<RatedIcon />}
                            unratedIcon={<UnratedIcon />}
                            value={movieElement.c_qualification}
                          />
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </Carousel>
          </div>
        </div>
        <Drawer open={open} onClose={closeDrawer} className="p-4" size={500}>
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              Aqui tienes tus recomendaciones :D
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <Typography color="gray" className="mb-8 pr-4 font-normal">
            Basado en tus gustos, la banca de peliculas te recomienda ver:
          </Typography>
          {error !== "" && (
            <Typography color="red" className="mb-8 pr-4 font-normal">
              {error}
            </Typography>
          )}
          <MovieAccordion loading={loading} dataAiResponse={dataAiResponse} />
        </Drawer>
      </div>
      <div className="hidden md:block absolute bottom-5 w-[100px] right-16">
        <div className="flex gap-2 w-full">
          <p className="text-black">Using</p>
          <img src={logo} className="" />
        </div>
      </div>
      <div className="absolute md:hidden top-0 w-[70px] right-14">
        <div className="flex gap-2 w-full">
          <p className="text-black">Using</p>
          <img src={logo} className="" />
        </div>
      </div>
    </>
  );
}

export default App;
