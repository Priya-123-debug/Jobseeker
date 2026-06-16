import React from "react";
import JobCarousel from "./Jobcarosel";

const steps = [
  { background: "register.jpg", text: "Register with us", step: "01" },
  { background: "postjob.jpg", text: "Post a Job", step: "02" },
  { background: "interview.jpg", text: "Schedule Interviews", step: "03" },
  { background: "successfulinterview.jpg", text: "Hire the Best Talent", step: "04" },
];

function CategoryCarousel() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            How does it work?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            As a partner employer, you will have access to high-quality candidates
            and strengthen your workplace through inclusive hiring.
          </p>
        </div>

        {/* Scrollable row on mobile, grid on desktop */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible snap-x snap-mandatory sm:snap-none">
          {steps.map((item, index) => (
            <div key={index} className="flex-shrink-0 snap-center w-56 sm:w-auto">
              <JobCarousel
                background={item.background}
                text={item.text}
                step={item.step}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryCarousel;