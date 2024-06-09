import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";

const MovieAccordion = ({ loading, dataAiResponse }) => {
  const [accordionOpen, setAccordionOpen] = useState(0);

  const handleOpen = (value) =>
    setAccordionOpen(accordionOpen === value ? 0 : value);

  return (
    <>
      {!loading ?
        dataAiResponse.map(
          (dataAi, index) => {
            if(!dataAi) return 
            const { movieName, movieDescription, movieYear, movieImage } = dataAi
            return (
              <Accordion open={accordionOpen === index} key={movieName}>
                <AccordionHeader
                  onClick={() => handleOpen(index)}
                  className={`border-b transition-colors ${
                    accordionOpen === index
                      ? "text-purple-700 hover:!text-purple-900"
                      : ""
                  }`}
                >
                  {movieName.replaceAll('"', "")} ({movieYear})
                </AccordionHeader>
                <AccordionBody>
                  <div className="flex gap-4">
                    <img
                      src={movieImage}
                      className="md:h-[190px] h-[120px] md:w-[140px] w-[90px] object-cover object-center mx-auto rounded-lg"
                    />
                    <Typography color="gray" className="mb-8 pr-4 font-normal">
                      {movieDescription}
                    </Typography>
                  </div>
                </AccordionBody>
              </Accordion>
            );
          }
        ):(
          <Spinner color="purple" className="mx-auto" />
        )}
    </>
  );
};

export default MovieAccordion;
