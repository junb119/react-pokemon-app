import React, { useRef } from "react";
import DamageRelations from "./DamageRelations";
import useOnClickOutsiede from "../hooks/useOnClickOutsiede";
import { DamageRelations as DamageRelationsProps } from "../types/DamageRelationOfPokemonType";

interface DamageModalProps {
  damages: DamageRelationsProps[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DamageModal = ({ damages, setIsModalOpen }: DamageModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  console.log(ref.current);
  useOnClickOutsiede(ref, () => setIsModalOpen(false));
  return (
    <div className="flex items-center justify-center z-40 fixed left-0 bottom-0 w-full h-full bg-gray-800">
      <div className="modal bg-white rounded-lg w-1/2" ref={ref}>
        <div className="flex flex-col items-start p-4">
          <div className="flex items-center w-full justify-between">
            <div className="text-gray-900 font-medium text-lg">데미지 관계</div>
            <span
              className="text-gray-900 font-medium text-lg cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </span>
            {/* Damage */}
          </div>
          <DamageRelations damages={damages} />
        </div>
      </div>
    </div>
  );
};

export default DamageModal;
