import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";

const MovieForm = ({
  getRecommendations,
  recommendations,
  loading,
  onShowDrawer,
}) => {
  const [emotions, setEmotions] = useState("");
  const [checkedValue, setCheckedValue] = useState("movie");

  const onNewTypeOfContent = (value) => {
    if (value === "movie") {
      setCheckedValue("movie");
    } else {
      setCheckedValue("tv");
    }
  };

  return (
    <Card className="w-full md:w-96">
      <CardHeader
        variant="gradient"
        className="mb-4 grid h-48 place-items-center bg-[#302057] text-center"
      >
        <Typography color="white" className="text-2xl md:text-3xl font-bold">
          ¿Qué te apetece ver?
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 h-full justify-center">
        <Textarea
          value={emotions}
          name="feelings"
          variant="standard"
          placeholder="Quiero algo de terror canibal extremo 🤠"
          color="purple"
          size="lg"
          className="h-fit"
          onChange={(event) => {
            setEmotions(event.target.value);
          }}
        />
      </CardBody>
      <CardFooter className="pt-0 mt-auto">
        <div className="flex justify-center gap-4 mb-2">
          <Checkbox
            color="blue-gray"
            checked={checkedValue === "movie"}
            label="Pelicula"
            value={"movie"}
            onChange={(e) => {
              onNewTypeOfContent(e.target.value);
            }}
          />
          <Checkbox
            color="deep-purple"
            checked={checkedValue === "tv"}
            label="Serie"
            value={"tv"}
            onChange={(e) => {
              onNewTypeOfContent(e.target.value);
            }}
          />
        </div>
        {!loading ? (
          <Button
            className="bg-[#302057]"
            fullWidth
            onClick={() => {
              getRecommendations(emotions,checkedValue);
            }}
            disabled={loading}
          >
            Quiero mi recomendación !!!
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
          className="flex py-1.5 bg-[#46af38] text-[#191414] mt-5 justify-center items-center gap-1"
          fullWidth
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

export default MovieForm;
