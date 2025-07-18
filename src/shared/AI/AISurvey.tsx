import { useState } from "react";
import SurveyHeader from "./SurveyHeader";
import EssentialQuestions from "./EssentialQuestions";
import OptionalQuestions from "./OptionalQuestions";
import Loading from "./Loading";

const AISurvey = () => {
  const [isClickedEssential, setIsClickedEssential] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="scrollbar-partial-rounded fixed bottom-[40px] right-[85px] z-[1000]">
      <div className="rounded-[10px] bg-white px-[15px] pt-[10px] pb-[20px] [box-shadow:0px_0px_20px_rgba(0,0,0,0.6)] w-[357px] h-[500px] overflow-y-auto scrollbar-custom">
        <SurveyHeader
          isClickedEssential={isClickedEssential}
          setIsClickedEssential={setIsClickedEssential}
          setIsLoading={setIsLoading}
        />
        <section className="mt-[20px] h-full">
          {isLoading ? (
            <Loading />
          ) : isClickedEssential ? (
            <EssentialQuestions />
          ) : (
            <OptionalQuestions />
          )}
        </section>
      </div>
    </div>
  );
};

export default AISurvey;
