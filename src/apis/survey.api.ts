import axios from "axios";
import { TravelPlanPreferences } from "../types/survey.type";

export const sendSurveyRequest = async (survey: TravelPlanPreferences) => {
  const path = "https://3.34.200.220:8000/plan";

  try {
    const response = await axios.post(path, survey);
    const data = response.data;
    return data; // TODO: 결과 타입 지정하기
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[sendSurveyRequest] Axios 에러: ", error.message);
    } else {
      console.error("[sendSurveyRequest] 일반 에러: ", error);
    }
    throw error;
  }
};
