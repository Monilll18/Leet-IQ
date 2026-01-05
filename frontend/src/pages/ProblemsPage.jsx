import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon, LockIcon, BuildingIcon, CrownIcon, SparklesIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getAllProblemsPublic } from "../api/problems";
import { usePremium } from "../hooks/usePremium";

function ProblemsPage() {
  const [solvedIds, setSolvedIds] = useState(new Set());
  const { getToken } = useAuth();
  const { isPremium, dailyProblemsRemaining, features } = usePremium();
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch problems from backend
  const { data: problemsData, isLoading: problemsLoading } = useQuery({
    queryKey: ["problems"],
    queryFn: getAllProblemsPublic,
  });

  const problems = problemsData?.problems || [];

  useEffect(() => {
    const fetchSolvedIds = async () => {
      try {
        const token = await getToken();
        const response = await axiosInstance.get("/contests/submissions/solved", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSolvedIds(new Set(response.data));
      } catch (error) {
        console.error("Failed to fetch solved IDs:", error);
      }
    };
    fetchSolvedIds();
  }, [getToken]);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const solvedEasy = problems.filter(p => p.difficulty === "Easy" && solvedIds.has(p.id)).length;
  const solvedMedium = problems.filter(p => p.difficulty === "Medium" && solvedIds.has(p.id)).length;
  const solvedHard = problems.filter(p => p.difficulty === "Hard" && solvedIds.has(p.id)).length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* Daily Problem Limit Banner - Free Users Only */}
        {!isPremium && (
          <div className="alert mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <SparklesIcon className="size-5 text-primary" />
              <div>
                <span className="font-bold">{dailyProblemsRemaining}</span> problems remaining today
                {dailyProblemsRemaining === 0 && (
                  <span className="text-error ml-2">— Limit reached!</span>
                )}
              </div>
            </div>
            <Link to="/premium" className="btn btn-sm btn-primary gap-2">
              <CrownIcon className="size-4" />
              Upgrade for Unlimited
            </Link>
          </div>
        )}

        {/* Loading State */}
        {problemsLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {/* PROBLEMS LIST */}
            <div className="space-y-4">
              {problems.slice(0, visibleCount).map((problem) => {
                const isLocked = problem.isPremiumOnly && !isPremium;

                return (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    className={`card bg-base-100 hover:scale-[1.01] transition-transform ${isLocked ? 'opacity-75' : ''}`}
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between gap-4">
                        {/* LEFT SIDE */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`size-12 rounded-lg flex items-center justify-center ${isLocked ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                              {isLocked ? (
                                <LockIcon className="size-6 text-amber-500" />
                              ) : (
                                <Code2Icon className="size-6 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h2 className="text-xl font-bold">{problem.title || problem.id}</h2>
                                {solvedIds.has(problem.id) && (
                                  <CheckCircle2Icon className="size-5 text-success" />
                                )}
                                <span className={`badge ${getDifficultyBadgeClass(problem.difficulty || "Easy")}`}>
                                  {problem.difficulty || "Easy"}
                                </span>
                                {problem.isPremiumOnly && (
                                  <span className="badge badge-warning gap-1">
                                    <CrownIcon className="size-3" />
                                    Premium
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm text-base-content/60">{problem.category || "General"}</p>
                                {/* Company Tags - Premium Only */}
                                {features.companyTags && problem.companyTags && problem.companyTags.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <BuildingIcon className="size-3 text-base-content/40" />
                                    {problem.companyTags.slice(0, 3).map((tag, idx) => (
                                      <span key={idx} className="badge badge-ghost badge-xs">{tag}</span>
                                    ))}
                                    {problem.companyTags.length > 3 && (
                                      <span className="text-xs text-base-content/40">+{problem.companyTags.length - 3}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-base-content/80 mb-3">{problem.description?.text || "No description available"}</p>
                        </div>
                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-2 text-primary">
                          {isLocked ? (
                            <>
                              <span className="font-medium text-amber-500">Unlock</span>
                              <CrownIcon className="size-5 text-amber-500" />
                            </>
                          ) : (
                            <>
                              <span className="font-medium">Solve</span>
                              <ChevronRightIcon className="size-5" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* LOAD MORE BUTTON */}
            {visibleCount < problems.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="btn btn-outline btn-primary gap-2"
                >
                  <ChevronRightIcon className="size-4 rotate-90" />
                  Load More Problems
                </button>
              </div>
            )}

            {/* STATS FOOTER */}
            <div className="mt-12 card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="stats stats-vertical lg:stats-horizontal">
                  <div className="stat">
                    <div className="stat-title">Total Problems</div>
                    <div className="stat-value text-primary">{problems.length}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title uppercase font-black text-[10px] opacity-40">Easy</div>
                    <div className="stat-value text-success text-2xl">{solvedEasy}<span className="text-sm opacity-20 font-normal"> / {easyProblemsCount}</span></div>
                    <div className="stat-desc">Solved</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title uppercase font-black text-[10px] opacity-40">Medium</div>
                    <div className="stat-value text-warning text-2xl">{solvedMedium}<span className="text-sm opacity-20 font-normal"> / {mediumProblemsCount}</span></div>
                    <div className="stat-desc">Solved</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title uppercase font-black text-[10px] opacity-40">Hard</div>
                    <div className="stat-value text-error text-2xl">{solvedHard}<span className="text-sm opacity-20 font-normal"> / {hardProblemsCount}</span></div>
                    <div className="stat-desc">Solved</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProblemsPage;
