import { useDrop } from "react-dnd";
import { useCallback, useEffect } from "react";
import TimeInfo from "./TimeInfo";
import Timeline from "./Timeline";
import ScheduleCard from "../card/ScheduleCard";
import { MiniSchedule } from "../../types/travelPlan.type";
import { Notify } from "notiflix";
import { getEulReul } from "../../utils/getEulReul";
import { useScheduleStore } from "../../stores/schedule.store";

interface ScheduleUnitProps {
  dayNum: number;
  time: string;
  numOfCard: number;
  onDropPlace?: (
    time: string,
    placeName: string,
    purpose: string,
    placeId: string,
    address: string,
    latitude: number,
    longitude: number
  ) => void;
  isHighlighted: boolean;
  highlightedTime: string | null;
  setHighlightedTime: (time: string | null) => void;
  schedule: MiniSchedule;
  isNeededDeleteButton?: boolean;
}

const ScheduleUnit = ({
  dayNum,
  time,
  numOfCard,
  onDropPlace,
  isHighlighted,
  highlightedTime,
  setHighlightedTime,
  schedule,
  isNeededDeleteButton,
}: ScheduleUnitProps) => {
  const moveScheduleCard = useScheduleStore((state) => state.moveScheduleCard);
  const reorderScheduleCard = useScheduleStore(
    (state) => state.reorderScheduleCard
  );

  // 드래그&드롭 처리
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["PLACE_CARD", "SCHEDULE_CARD"],
      drop: (item: any, _) => {
        // 1. 장소 카드 드롭 (새로 추가)
        if (item.type === "PLACE_CARD" || !item.fromTime) {
          onDropPlace?.(
            time,
            item.placeName,
            item.placeType,
            item.placeId,
            item.address,
            item.latitude,
            item.longitude
          );

          // 장소명 길이에 비례해 픽셀 수 계산
          const baseWidth = 300; // 최소 너비(px)
          const charUnit = 6; // 글자당 픽셀(대략) - 폰트·패딩 맞춰 조절
          const calcWidth = baseWidth + item.placeName.length * charUnit;

          Notify.success(
            `<b>${item.placeName}</b>${getEulReul(
              item.placeName
            )} <b>${time}</b>에 추가했습니다!`,
            {
              position: "left-top",
              fontFamily: "SUIT-Regular",
              plainText: false,
              fontSize: "15px",
              width: `${calcWidth}px`,
              zindex: 9999,
              clickToClose: true,
            }
          );

          return;
        }

        // 2. 일정 카드 드롭 (이동/순서변경)
        if (item.type === "SCHEDULE_CARD") {
          const fromTime = item.fromTime;
          const fromIndex = item.fromIndex;
          const toTime = time;

          // toIndex: 맨 마지막에 추가 (더 정교하게 하려면 hover에서 계산)
          const toIndex = schedule[toTime]?.length || 0;

          // 같은 시간대 내에서 같은 위치로 드롭하면 아무것도 하지 않음 (복제 방지)
          if (fromTime === toTime && fromIndex === toIndex - 1) {
            return;
          }

          // 시간대가 다르면 move, period 자동 변경
          if (fromTime !== toTime) {
            const startHour = time.split(" : ")[0].padStart(2, "0");
            const newPeriod = `${startHour}:00 ~ ${(parseInt(startHour, 10) + 1)
              .toString()
              .padStart(2, "0")}:00`;
            moveScheduleCard(
              dayNum,
              fromTime,
              toTime,
              fromIndex,
              toIndex,
              newPeriod
            );
          } else {
            // 같은 시간대 내에서 순서 변경 (fromIndex === toIndex면 아무것도 안 함)
            if (fromIndex === toIndex) return;
            reorderScheduleCard(dayNum, toTime, fromIndex, toIndex);
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }),
    [onDropPlace, time, dayNum, schedule, moveScheduleCard, reorderScheduleCard]
  );

  useEffect(() => {
    if (isOver) {
      setHighlightedTime(time);
    } else if (highlightedTime === time) {
      setHighlightedTime(null);
    }
  }, [isOver, time, setHighlightedTime, highlightedTime]);

  const setDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) drop(node);
    },
    [drop]
  );

  return (
    <div ref={setDropRef}>
      <TimeInfo dayNum={dayNum} time={time} isHighlighted={isHighlighted} />
      <div className="flex gap-[10px]">
        <Timeline dayNum={dayNum} numOfCard={numOfCard} />
        <div className="flex flex-col gap-[10px]">
          {schedule[time] &&
            schedule[time].map((item, idx) => (
              <ScheduleCard
                key={`${item.placeName}_${item.placeType}`}
                isFirstSchedule={idx === 0}
                placeName={item.placeName}
                placeType={item.placeType}
                period={item.period}
                isNeededDeleteButton={isNeededDeleteButton ?? false}
                daySeq={dayNum}
                time={time}
                index={idx}
                latitude={item.latitude ?? 0}
                longitude={item.longitude ?? 0}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleUnit;
