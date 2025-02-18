import React from "react";

export interface Toy {
  id: string;
  name: string;
  icon: string;
}

interface ToySelectProps {
  onToySelect: (toy: Toy) => void;
}

const TOYS: Toy[] = [
  { id: "laser", name: "Laser Pointer", icon: "/meowmemorylane/toys/laser.png" },
  { id: "yarn", name: "Ball of Yarn", icon: "/meowmemorylane/toys/yarn.png" },
  { id: "mouse", name: "Squeaky Mouse", icon: "/meowmemorylane/toys/mouse.png" },
  { id: "tree", name: "Cat Tree", icon: "/meowmemorylane/toys/cat-tree.png" },
  { id: "treats", name: "Cat Treats", icon: "/meowmemorylane/toys/treats.png" },
];

const ToySelect: React.FC<ToySelectProps> = ({ onToySelect }) => {
  return (
    <div className="flex gap-4 justify-center mb-4">
      {TOYS.map((toy) => (
        <button
          key={toy.id}
          onClick={() => onToySelect(toy)}
          className="flex flex-col items-center p-2 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <img src={toy.icon} alt={toy.name} className="w-8 h-8 mb-1 object-contain" />
          <span className="text-sm text-gray-600">{toy.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ToySelect;
