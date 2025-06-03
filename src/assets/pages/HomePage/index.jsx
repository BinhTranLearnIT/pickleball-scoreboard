import React from "react";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[100dvh]  w-screen bg-[#242c3b] ">
      <div className="pk-home__background absolute right-[0px] bottom-[-100px] sm:bottom-0 ">
        <svg
          width="390"
          height="701"
          viewBox="0 0 390 701"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M249.5 167.5L329 0L400.5 59.5V720.5L-13 705L249.5 167.5Z"
            fill="url(#paint0_linear_102_567)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_102_567"
              x1="175.5"
              y1="0.500004"
              x2="379.499"
              y2="720.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#37B6E9" />
              <stop offset="1" stop-color="#4B4CED" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className=" max-w-[500px] min-h-[100dvh] relative mx-auto ">
        <div className="pk-home__content h-full flex flex-col pt-[117px] z-10 relative">
          <div
            className="pk-home__header w-full h-[240px] pl-[39px] pt-[24px] relative
          "
          >
            <h1 className="text-white font-bold text-[42px] z-10 relative">
              Pickle Ball
            </h1>

            <div className="pk-home__img w-full mt-[50px] flex justify-center">
              <img
                src="./imgs/pickleball.png"
                className="w-[100px] h-[100px] spin"
                alt=""
              />
            </div>
          </div>

          <div className="pk-home__footer mt-[50px] h-[109px] bg-[#262E3D] rounded-[50px] flex justify-center items-center ">
            <button
              className="py-[10px] px-[39px] pk-bg-linear-blue rounded-[10px]
            text-white text-[20px] font-[600]"
              onClick={() => navigate("/match")}
            >
              Start game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
