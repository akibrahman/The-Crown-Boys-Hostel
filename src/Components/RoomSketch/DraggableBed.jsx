import Draggable from "react-draggable";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";

const DraggableBed = ({ bed, onPositionChange }) => {
  const bedRef = useRef(null);
  const [defaultPos, setDefaultPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (bedRef.current) {
      const parentRef = bedRef.current.closest(".room-container");
      if (!parentRef) return;

      const parentRect = parentRef.getBoundingClientRect();
      const x = (parseFloat(bed.left) / 100) * parentRect.width;
      const y = (parseFloat(bed.top) / 100) * parentRect.height;
      setDefaultPos({ x, y });
    }
  }, [bed.left, bed.top]);

  const handleStop = (e, data) => {
    if (!bedRef.current) return;

    const parentRef = bedRef.current.closest(".room-container");
    if (!parentRef) return;

    const parentRect = parentRef.getBoundingClientRect();
    const bedRect = bedRef.current.getBoundingClientRect();

    // Convert final pixel positions to percentage
    const topPercentage = ((bedRect.top - parentRect.top) / parentRect.height) * 100;
    const leftPercentage = ((bedRect.left - parentRect.left) / parentRect.width) * 100;

    // Update parent state with new position
    onPositionChange(bed.bedNo, topPercentage.toFixed(2), leftPercentage.toFixed(2));
  };

  return (
    <Draggable nodeRef={bedRef} defaultPosition={defaultPos} onStop={handleStop}>
      <div ref={bedRef} className="absolute cursor-pointer">
        <LuBedSingle className="text-5xl text-green-600" />
        <p className="text-primary text-center text-sm">{bed.bedNo}</p>
      </div>
    </Draggable>
  );
};

export default DraggableBed;
