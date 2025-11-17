import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Range } from "react-range";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const getRankLabel = (score) => {
  return "";
};

const ResumeList = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreRange, setScoreRange] = useState([1, 10]);
  const [experienceRange, setExperienceRange] = useState([0, 35]);
  const [filterEmail, setFilterEmail] = useState(false);
  const [filterPhone, setFilterPhone] = useState(false);
  const [userKeySkills, setUserKeySkills] = useState([]);
  const [caseId, setCaseId] = useState(null);
  const [storedSkills, setStoredSkills] = useState([]);
  const [storedResumes, setStoredResumes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  // Load stored resumes + skills
  useEffect(() => {
    try {
      const storedSkills = localStorage.getItem("keySkills");
      const parsedSkills = storedSkills ? JSON.parse(storedSkills) : [];
      setUserKeySkills(Array.isArray(parsedSkills) ? parsedSkills : []);

      const storedResumes = localStorage.getItem("resumeResults");
      const parsedResumes = storedResumes ? JSON.parse(storedResumes) : null;

      if (parsedResumes && Array.isArray(parsedResumes.result)) {
        const mapped = parsedResumes.result.map((item, index) => ({
          orgId: parsedResumes.id,
          exeName: parsedResumes.exe_name,
          candidateId: index + 1,
          name: item.name || `Candidate ${index + 1}`,
          Rank: item.score || 0,
          justification: item.justification || "",
          experience:
            typeof item.experience === "number" ? item.experience : 0,
          email:
            item.email === "xxx" || !item.email ? "No email" : item.email,
          phone:
            item.phone === "xxx" || !item.phone ? "No phone" : item.phone,
        }));

        setResumes(mapped);
        setCaseId(parsedResumes.id);
      }
    } catch (err) {
      console.error("Error loading or parsing data:", err);
    }
  }, []);

  // Apply filters
  const filteredResumes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return resumes.filter((resume) => {
      const rank = Number(resume.Rank) || 0;

      const matchesSearch =
        resume.name.toLowerCase().includes(query) ||
        (resume.email && resume.email.toLowerCase().includes(query)) ||
        (resume.justification &&
          resume.justification.toLowerCase().includes(query));

      const inScoreRange = rank >= scoreRange[0] && rank <= scoreRange[1];
      const inExperienceRange =
        resume.experience >= experienceRange[0] &&
        resume.experience <= experienceRange[1];

      const hasEmail = filterEmail
        ? resume.email && resume.email !== "No email"
        : true;
      const hasPhone = filterPhone
        ? resume.phone && resume.phone !== "No phone"
        : true;

      return (
        matchesSearch && inScoreRange && inExperienceRange && hasEmail && hasPhone
      );
    });
  }, [scoreRange, experienceRange, filterEmail, filterPhone, resumes]);


console.log("storedSkills:", storedSkills);


  const renderThumb = ({ index, props }) => (
    <div
      {...props}
      key={index}
      className="h-5 w-5 rounded-full bg-orange-400 shadow-md cursor-pointer"
    />
  );

  return (
    <div className="min-h-screen w-full bg-white p-4">
      <div className="shadow-lg rounded-xl w-full p-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-700 rounded-xl p-4 sm:p-6 shadow-md flex flex-col flex-shrink-0">
          <h3 className="font-bold mb-5 text-xl text-white">🔍 Filter Options</h3>

                    {/* Key Skills */}
          <div>
            <h3 className="font-bold mt-8 mb-3 text-xl text-white">🛠️ Key Skills</h3>
            <div className="flex flex-wrap gap-2 bg-white border border-gray-300 rounded-md p-3 shadow-inner min-h-[40px]">
              {userKeySkills.length > 0 ? (
                userKeySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No key skills available</span>
              )}
            </div>
          </div>

          {/* Score Range */}
          <label className="font-semibold mb-3 block text-lg text-white">
            Score Range
          </label>
          <div className="flex justify-between mb-3 font-semibold text-sm text-white">
            <span>{scoreRange[0]}</span>
            <span>{scoreRange[1]}</span>
          </div>
          <Range
            step={1}
            min={1}
            max={10}
            values={scoreRange}
            onChange={setScoreRange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{ ...props.style, height: "6px", backgroundColor: "#555" }}
              >
                <div
                  style={{
                    height: "6px",
                    backgroundColor: "#fb923c",
                    marginLeft: `${((scoreRange[0] - 1) / 9) * 100}%`,
                    width: `${((scoreRange[1] - scoreRange[0]) / 9) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={renderThumb}
          />

          {/* Experience */}
          <label className="font-semibold mt-6 mb-3 block text-lg text-white">
            Experience (years)
          </label>
          <div className="flex justify-between mb-3 font-semibold text-sm text-white">
            <span>{experienceRange[0]}</span>
            <span>{experienceRange[1]}</span>
          </div>
          <Range
            step={1}
            min={0}
            max={35}
            values={experienceRange}
            onChange={setExperienceRange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{ ...props.style, height: "6px", background: "#555" }}
              >
                <div
                  style={{
                    height: "6px",
                    width: `${((experienceRange[1] - experienceRange[0]) / 35) * 100}%`,
                    backgroundColor: "#fb923c",
                    marginLeft: `${(experienceRange[0] / 35) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={renderThumb}
          />

          {/* Email & Phone Filters */}
          <div className="mt-6 flex flex-row gap-x-6">
            <label className="inline-flex items-center gap-2 text-white font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={filterEmail}
                onChange={() => setFilterEmail(!filterEmail)}
                className="rounded border-gray-400 text-[#FF5A52] focus:ring-[#FF5A52]"
              />
              Email
            </label>
            <label className="inline-flex items-center gap-2 text-white font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={filterPhone}
                onChange={() => setFilterPhone(!filterPhone)}
                className="rounded border-gray-400 text-[#FF5A52] focus:ring-[#FF5A52]"
              />
              Phone
            </label>
          </div>
        </div>

        {/* Resume Results */}
        <motion.div layout className="flex-1 space-y-6 overflow-auto max-h-[80vh]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-3xl font-semibold text-[#333333]">📄 Talent Sift</h2>

            {/* Home Button */}
            <div className="flex item-start gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-orange-400 hover:bg-[#E14A42] text-white font-bold rounded"
              >
                Home
              </button>
            </div>

            {/* Case ID */}
            <div className="flex flex-col items-end space-y-2">
              {caseId && (
                <div className="bg-orange-400 text-white px-4 py-2 rounded-lg shadow-md text-sm">
                  Case ID: {caseId}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-orange-600 font-medium mb-4">
              Showing <span className="font-bold">{filteredResumes.length}</span> of{" "}
              <span className="font-bold">{resumes.length}</span> resumes
            </p>
            <p className="text-[#333333] font-medium">Score Range 1 - 10</p>
          </div>

          {/* Resume List */}
          <ul className="space-y-4">
            {filteredResumes.length === 0 ? (
              <li className="text-[#333333] italic font-medium">No resumes found.</li>
            ) : (
              filteredResumes.map((resume) => (
                <motion.li
                  layout
                  key={resume.candidateId} // ✅ FIXED
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-blue-200"
                >
                  <div className="text-[#333333] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                    <div className="text-2xl font-bold text-[#333333]">{resume.name}</div>
                    <div className="text-[#333333] font-semibold">
                      Score: {resume.Rank} {getRankLabel(resume.Rank)}
                    </div>
                    <div className="text-[#333333] font-semibold">
                      Experience:{" "}
                      {resume.experience ? `${resume.experience} yrs` : "null"}
                    </div>
                    <div className="text-[#333333] font-semibold">
                      {resume.phone || "No phone"}
                    </div>
                    <div className="text-[#333333] font-semibold">
                      {resume.email || "No email"}
                    </div>
                  </div>

                  <div className="text-gray-800 mt-2 text-sm whitespace-pre-line">
                    {resume.justification}
                  </div>
                </motion.li>
              ))
            )}
          </ul>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-8 ml-1 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default ResumeList;
