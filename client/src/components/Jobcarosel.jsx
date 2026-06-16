import React from "react";

function JobCarousel({ background, text, step }) {
  return (
    <div
      className="relative w-full h-52 sm:h-60 rounded-2xl bg-cover bg-center cursor-pointer overflow-hidden group"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 group-hover:bg-black/40 transition-colors duration-300 rounded-2xl" />

      {/* Step badge */}
      {step && (
        <div className="absolute top-3 left-3 w-8 h-8 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {step}
        </div>
      )}

      {/* Text */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:scale-105 transition-transform duration-300">
          {text}
        </h2>
      </div>
    </div>
  );
}

export default JobCarousel;