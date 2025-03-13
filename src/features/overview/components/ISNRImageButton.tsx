import { useState } from "react";

interface IISNRImageButton {
  label: string;
  image: string;
  onImageClicked: (image: string) => void;
}

export const ISNRImageButton = (props: IISNRImageButton) => {
  const [img, setImg] = useState(`images/${props.image}.png`);

  return (
    <button
      onClick={() => props.onImageClicked(props.image)}
      className="w-52 h-48 m-0 p-0 border border-becgray-200 flex flex-col items-center bg-white shadow shadow-becgray-200 outline-none hover:shadow-becblue-200 hover:cursor-pointer active:scale-95 active:shadow-none"
    >
      <img src={img} alt={props.label} className="w-[90%] h-[90%]" />
      <span className="text-becgray-200">{props.label}</span>
    </button>
  );
};
