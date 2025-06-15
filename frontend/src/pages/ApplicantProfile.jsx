import React from "react";
import ApplicantSideBar from "../components/ApplicantSideBar";
import ApplicantDashLogo from "../assets/ApplicantDashLogo.svg";

function ApplicantProfile() {
  const fullName = localStorage.getItem("fullName") || "User";

  const personalInfoLeft = [
  { label: "Name", value: "Kyle Desmond ni Jianna" },
  { label: "Mobile Number", value: "0992 356 7294" },
  { label: "University", value: "Polytechnic University of the Philippines" },
  { label: "Year Graduated", value: "2027" },
];

const personalInfoRight = [
  { label: "Address", value: "#1 Kurt St. Brgy. Mapagmahal Silang, Cavite" },
  { label: "Telephone Number", value: "8153-4137" },
  { label: "Degree", value: "Bachelor of Science in Computer Science" },
  { label: "Field", value: "Software Cybersecurity" },
];


  const experienceData = [
  {
    title: "Senior Graphic Designer",
    company: "Canva Philippines",
    date: "JANUARY 2024 - MAY 2025",
    responsibilities: [
      "Ano kanina pa ako nakababad dito oh? Baka pwede mo namang...huy ano raw?",
      "Ganto pala tong laro na to? naka...ay may hamaliway...",
      "Kyle huwag naman tayong ganito oh...pag-usapan naman natin to pls...",
    ],
  },

  {
    title: "Senior Graphic Designer",
    company: "Canva Philippines",
    date: "JANUARY 2024 - MAY 2025",
    responsibilities: [
      "Ano kanina pa ako nakababad dito oh? Baka pwede mo namang...huy ano raw?",
      "Ganto pala tong laro na to? naka...ay may hamaliway...",
      "Kyle huwag naman tayong ganito oh...pag-usapan naman natin to pls...",
    ],
  },

  {
    title: "Senior Graphic Designer",
    company: "Canva Philippines",
    date: "JANUARY 2024 - MAY 2025",
    responsibilities: [
      "Ano kanina pa ako nakababad dito oh? Baka pwede mo namang...huy ano raw?",
      "Ganto pala tong laro na to? naka...ay may hamaliway...",
      "Kyle huwag naman tayong ganito oh...pag-usapan naman natin to pls...",
    ],
  },
  // You can add more experiences here if needed
];

  return (
    <div className="min-h-screen bg-[#2A4D9B] flex items-start overflow-hidden">
      <ApplicantSideBar />

      {/* Main Content Area */}
      <div className="flex-1 h-screen bg-white rounded-tl-[40px] overflow-y-auto p-6 shadow-md">
        {/* Header */}
        <div className="flex justify-between w-full px-9 mb-0">
          <div className="flex items-center gap-[15px] m-9">
            <img
              src={ApplicantDashLogo}
              alt="Tugma Logo"
              className="max-w-[136px] h-auto"
            />
            <div>
              <div className="font-[Montserrat] text-4xl font-bold text-[#2A4D9B]">
                User Profile
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col space-y-7 justify-center items-center w-full">
          <div className="w-full max-w-[976px] h-[220px] rounded-[20px] shadow-all-around flex items-center gap-8 bg-white p-10">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <div className="w-[150px] h-[150px] rounded-full border border-gray-600 flex items-center justify-center text-4xl text-gray-500">
                <i className="bi bi-person-fill text-7xl"></i>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#2A4D9B] rounded-full flex items-center justify-center text-[#2A4D9B] text-xl">
                <i className="bi bi-plus"></i>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center flex-grow">
              <h2 className="text-2xl font-bold">Kyle Desmond Co</h2>
              <div className="text-gray-600 flex items-center gap-2 mt-1">
                <i className="bi bi-geo-alt"></i> Silang, Cavite
              </div>
              <div className="text-gray-600 flex items-center gap-2 mt-1">
                <i className="bi bi-telephone"></i> 0992 356 7294
              </div>
              <div className="text-gray-600 flex items-center gap-2 mt-1">
                <i className="bi bi-envelope"></i> nasapusokoanglove14@gmail.com
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <i className="bi bi-github"></i> GitHub
                </button>
                <button className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <i className="bi bi-linkedin"></i> LinkedIn
                </button>
                <button className="bg-[#2A4D9B] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <i className="bi bi-globe"></i> Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="w-full max-w-[976px] h-auto rounded-[20px] shadow-all-around flex items-center gap-8 bg-white p-10">
            <div className="flex flex-col justify-center flex-grow space-y-4">
              <div className="text-2xl font-bold text-neutral-700">Resume</div>
              <div className="text-xl font-semibold text-neutral-700">
                Personal Information
              </div>

              {/* Two Columns */}
              <div className="grid grid-cols-2 gap-8">
                {/* First Column */}
                <div className="flex flex-col space-y-4">
                   {personalInfoLeft.map((field, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <div className="text-gray-500 text-base font-semibold">
                      {field.label}
                    </div>
                    <div className="text-black">{field.value}</div>
                  </div>
                ))}
                </div>

                {/* Second Column */}
                <div className="flex flex-col space-y-4">
                   {personalInfoRight.map((field, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <div className="text-gray-500 text-base font-semibold">
                        {field.label}
                      </div>
                      <div className="text-black">{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-t border-gray-300 my-4" />

              <div className="text-xl font-semibold text-neutral-700">
                Experience
              </div>

           {experienceData.map((exp, index) => (
          <div key={index} className="border-l-1 border-[#2A4D9B] pl-6 mb-6">
            <div className="flex flex-row justify-between">
              <div className="text-base text-neutral-700 font-semibold">
                {exp.title}
              </div>
              <div className="text-gray-500 text-sm font-semibold">
                {exp.date}
              </div>
            </div>
            <div className="text-gray-500 text-sm font-semibold">
              {exp.company}
            </div>
            <ul className="text-gray-500 text-xs list-disc pl-6">
              {exp.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <hr className="border-t border-gray-300 my-4" />

          <div className="text-xl font-semibold text-neutral-700">
            Technical Skills
          </div>

        <hr className="border-t border-gray-300 my-4" />

          <div className="text-xl font-semibold text-neutral-700">
           Soft Skills
          </div>
            </div>
          </div>

          <div className="w-full max-w-[976px] h-auto rounded-[20px] shadow-all-around flex items-center gap-8 bg-white p-10">
            <div className="text-2xl font-bold text-neutral-700">Certifications</div>
          </div>


        </div>  
      </div>
    </div>
  );
}

export default ApplicantProfile;
