import { useEffect } from "react";
import PlaceListScreen from "../../components/screen/PlaceListScreen";
import ScheduleScreen from "../../components/screen/ScheduleScreen";
import { useModalStore } from "../../stores/modal.store";
import CalendarModal from "../../components/modal/CalendarModal";
import { useDateStore } from "../../stores/date.store";
import MapScreen from "../../components/screen/MapScreen";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomDragLayer from "../../components/CustomDragLayer";
import { useScheduleStore } from "../../stores/schedule.store";

const TravelPlanPage = () => {
  const travelStartDate = useDateStore((state) => state.travelStartDate);
  const travelEndDate = useDateStore((state) => state.travelEndDate);
  const openModal = useModalStore((state) => state.openModal);
  const isEditMode = useScheduleStore((state) => state.isEditMode);

  useEffect(() => {
    if (!isEditMode) useScheduleStore.getState().resetAll();
  }, [isEditMode]);

  useEffect(() => {
    if (!travelStartDate || !travelEndDate) {
      openModal(<CalendarModal />, false);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [travelStartDate, travelEndDate, openModal]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <ScheduleScreen />
        <PlaceListScreen />
        <MapScreen />
        <CustomDragLayer />
      </div>
    </DndProvider>
  );
};

export default TravelPlanPage;
