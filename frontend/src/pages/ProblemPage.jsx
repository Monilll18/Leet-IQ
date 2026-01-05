import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useProfile } from "../hooks/useAuth";
import { usePremium } from "../hooks/usePremium";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../api/executor";
import axiosInstance from "../lib/axios";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useAuth } from "@clerk/clerk-react";
import { useProctoring } from "../hooks/useProctoring";
import ProctoringOverlay from "../components/ProctoringOverlay";
import { useClaimProblemReward } from "../hooks/useRewards";
import ChallengeCompletionModal from "../components/ChallengeCompletionModal";
import SubmissionResult from "../components/SubmissionResult";
import LimitReachedModal from "../components/LimitReachedModal";
import PremiumLock from "../components/PremiumLock";
import { ChevronUpIcon, ChevronDownIcon, CheckCircle2Icon, TerminalIcon, Maximize2Icon } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { data: profile } = useProfile();
  const { isPremium, dailyProblemsRemaining, refetch: refetchPremium } = usePremium();

  const [currentProblemId, setCurrentProblemId] = useState(id || "two-sum");
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [contestData, setContestData] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [newStreak, setNewStreak] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(30);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [allProblems, setAllProblems] = useState([]);
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const claimReward = useClaimProblemReward();

  const contestId = new URLSearchParams(window.location.search).get("contestId");

  // Proctoring
  const { isLocked, strikeCount, unlock } = useProctoring(contestId);

  // Fetch current problem from database
  const fetchCurrentProblem = async (problemId) => {
    setIsLoadingProblem(true);
    setIsPremiumLocked(false); // Reset lock state
    // Clear code immediately when switching problems
    setCode("");

    try {
      const response = await axiosInstance.get(`/problems/${problemId}`);
      const problemData = response.data.problem;

      // Check if premium-only and user is not premium - show overlay instead of redirect
      if (problemData.isPremiumOnly && !isPremium) {
        setIsPremiumLocked(true);
      }

      setCurrentProblem(problemData);
      // Code sync handled by useEffect
    } catch (error) {
      console.error(`Failed to fetch problem ${problemId}:`, error);
      // Fallback to static if exists
      if (PROBLEMS[problemId]) {
        setCurrentProblem(PROBLEMS[problemId]);
      }
    } finally {
      setIsLoadingProblem(false);
    }
  };

  // update problem when URL param changes
  useEffect(() => {
    if (id) {
      setCurrentProblemId(id);
      setOutput(null);
      setSelectedSubmission(null);
      setCode(""); // Clear code when problem changes
      fetchCurrentProblem(id);
      fetchSubmissions(id, selectedLanguage);
    }
  }, [id, contestId]);

  // Handle code loading when problem or language changes
  useEffect(() => {
    // Only set code if we have a valid currentProblem that matches the currentProblemId
    if (currentProblemId && currentProblem && currentProblem.id === currentProblemId) {
      console.log(`[Code Sync] Loading code for problem: ${currentProblemId}, language: ${selectedLanguage}`);

      const savedSubmission = submissions.find(s => s.language === selectedLanguage && s.status === "Accepted");
      if (savedSubmission) {
        console.log(`[Code Sync] Using saved submission`);
        setCode(savedSubmission.code);
      } else {
        const starterCode = currentProblem.starterCode?.[selectedLanguage] || `function solution() {\n  // Your code here\n}`;
        console.log(`[Code Sync] Using starter code for ${currentProblem.title}`);
        setCode(starterCode);
      }
    }
  }, [currentProblemId, currentProblem, selectedLanguage, submissions]);

  // Fetch all problems for practice mode navigation
  const fetchAllProblems = async () => {
    try {
      const response = await axiosInstance.get('/problems');
      const problems = response.data.problems || [];
      setAllProblems(problems.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        category: p.category
      })));
    } catch (error) {
      console.error('Failed to fetch problems list:', error);
      setAllProblems([]);
    }
  };

  useEffect(() => {
    if (contestId) {
      fetchContestData();
    } else {
      // Fetch problems for practice mode
      fetchAllProblems();
      if (!id) {
        fetchCurrentProblem("two-sum");
      }
    }
  }, [contestId]);

  const fetchSubmissions = async (problemId, lang) => {
    setIsLoadingSubmissions(true);
    const targetContestId = contestId || "practice";
    try {
      const token = await getToken();
      const response = await axiosInstance.get(`/contests/${targetContestId}/submissions?problemId=${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allSubs = response.data;
      setSubmissions(allSubs);

      const successfulSubmissions = allSubs.filter(s => s.status === "Accepted");
      setIsSolved(successfulSubmissions.length > 0);

      // NOTE: Code is set by fetchCurrentProblem, not here, to avoid race conditions
    } catch (e) {
      console.error("Failed to fetch submissions:", e);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const fetchContestData = async () => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get(`/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const contest = response.data;

      // Fetch full problem details for each problem in the contest
      const problemsWithDetails = await Promise.all(
        contest.problems.map(async (p) => {
          try {
            const problemResponse = await axiosInstance.get(`/problems/${p.problemId}`);
            const problemData = problemResponse.data.problem;
            return {
              ...p,
              title: problemData.title,
              difficulty: problemData.difficulty,
              category: problemData.category,
            };
          } catch (error) {
            console.error(`Failed to fetch problem ${p.problemId}:`, error);
            return {
              ...p,
              title: p.problemId, // Fallback to ID
              difficulty: "Medium",
            };
          }
        })
      );

      setContestData({
        ...contest,
        problems: problemsWithDetails
      });
    } catch (e) {
      console.error("Failed to fetch contest metadata:", e);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => {
    // Clear code immediately to avoid showing old code
    setCode("");
    setOutput(null);
    setSelectedSubmission(null);
    setCurrentProblem(null); // Clear current problem to trigger loading state

    // Navigate - this will trigger the useEffect which fetches new problem & submissions
    navigate(`/problem/${newProblemId}${contestId ? `?contestId=${contestId}` : ""}`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/'/g, '"') // Normalize single to double quotes
          .replace(/\s+/g, "") // Remove ALL whitespace for strict content matching
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    // Now judge-powered for better precision
    const result = await executeCode(selectedLanguage, code, currentProblemId);

    setOutput(result);
    setIsRunning(false);
    setIsConsoleOpen(true); // Automatically show console when run
    setConsoleHeight(40);  // Give it some room

    if (result.success) {
      toast.success(`Run Success! Output matches expected.`);
      triggerConfetti();
    } else {
      toast.error(result.status === "Runtime Error" ? "Execution Error" : (result.status || "Test failed"));
    }
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const targetContestId = contestId || "practice";
    try {
      // BACKEND JUDGING: Use isSubmit: true
      const judgeResult = await executeCode(selectedLanguage, code, currentProblemId, true);

      // GUARD: If judging failed completely (e.g. problem not found, system error)
      if (!judgeResult || judgeResult.status === "System Error" || !judgeResult.status) {
        toast.error(judgeResult?.error || "Judging failed. Please try again.");
        setIsRunning(false);
        return;
      }

      // If it ran but produced something (Accepted, Wrong Answer, etc)
      // Save it to the DB via our existing contest route
      await axiosInstance.post(`/contests/${targetContestId}/submit`, {
        problemId: currentProblemId,
        code,
        language: selectedLanguage,
        status: judgeResult.status,
        runtime: judgeResult.runtime || 0,
        memory: judgeResult.memory || 0,
        benchmarks: judgeResult.benchmarks // Store for detail view
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      // Refetch history
      await fetchSubmissions(currentProblemId);

      // Show the Detail View automatically
      setSelectedSubmission({
        ...judgeResult,
        language: selectedLanguage,
        code: code
      });

      if (judgeResult.status === "Accepted") {
        toast.success(isSolved ? "Changes saved successfully!" : "Solution Accepted!");
        if (!isSolved) triggerConfetti();

        // Only show modal if it's the FIRST solve of the day
        const isAlreadyCompleted = profile?.lastSolvedDate && new Date(profile.lastSolvedDate).toDateString() === new Date().toDateString();
        const rewardProblemId = id || currentProblemId;

        claimReward.mutate({
          problemId: rewardProblemId,
          difficulty: currentProblem.difficulty
        }, {
          onSuccess: (data) => {
            console.log("[ProblemPage] Reward claimed successfully response:", data);

            if (!isAlreadyCompleted) {
              const streakToDisplay = typeof data.streak === 'number' ? data.streak : 1;
              setNewStreak(streakToDisplay);
              // setShowCompletionModal(true); // User requested to NOT show the modal
              console.log(`[ProblemPage] Streak updated: ${streakToDisplay}`);
            } else {
              console.log("[ProblemPage] Streak already completed today.");
            }
          },
          onError: (err) => {
            console.error("[ProblemPage] Reward claim failed:", err);
            toast.error("Failed to update streak/coins. Please try again.");
          }
        });

        setIsSolved(true);
      } else {
        toast.error("Wrong Answer. Try again.");
      }
    } catch (error) {
      console.error("Submission Error Details:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit code");
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoadingProblem || !currentProblem) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <ProctoringOverlay
          isLocked={isLocked}
          strikeCount={strikeCount}
          onUnlock={unlock}
        />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <ProctoringOverlay
        isLocked={isLocked}
        strikeCount={strikeCount}
        onUnlock={unlock}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <PanelGroup direction="horizontal" className="h-full">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={contestData ? contestData.problems.map(p => ({
                id: p.problemId,
                title: p.title || "Unknown",
                difficulty: p.difficulty || "Medium",
                score: p.score
              })) : allProblems}
              contestId={contestId}
              submissions={submissions}
              isLoadingSubmissions={isLoadingSubmissions}
              selectedSubmission={selectedSubmission}
              setSelectedSubmission={setSelectedSubmission}
              isPremiumLocked={isPremiumLocked}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col bg-base-300">
              <div className="flex-1 min-h-0">
                <PremiumLock
                  isLocked={isPremiumLocked}
                  title="Subscribe to unlock"
                  description="Thanks for using LeetIQ! To view this question you must subscribe to premium."
                  size="lg"
                >
                  <PanelGroup direction="vertical">
                    {/* Top panel - Code editor */}
                    <Panel defaultSize={70} minSize={30}>
                      <CodeEditorPanel
                        key={`editor-${currentProblemId}-${selectedLanguage}`}
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        isSolved={isSolved}
                        contestId={contestId}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={setCode}
                        onRunCode={handleRunCode}
                        onSubmit={handleSubmitCode}
                      />
                    </Panel>

                    {/* Bottom panel - Output Panel*/}
                    {isConsoleOpen && (
                      <>
                        <PanelResizeHandle className="h-1 bg-base-200 hover:bg-primary/50 transition-colors cursor-row-resize" />
                        <Panel
                          defaultSize={consoleHeight}
                          minSize={20}
                          onResize={(size) => setConsoleHeight(size)}
                        >
                          <OutputPanel
                            output={output}
                            problem={currentProblem}
                            selectedLanguage={selectedLanguage}
                          />
                        </Panel>
                      </>
                    )}
                  </PanelGroup>
                </PremiumLock>
              </div>

              {/* Editor Footer with Console Toggle */}
              {/* Editor Footer / Console Tab Bar */}
              <div className="flex-none h-12 bg-base-100 border-t border-base-300 flex items-center px-4 justify-between select-none z-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                    className={`btn btn-sm gap-2 font-semibold transition-all ${isConsoleOpen
                      ? "bg-base-200 text-base-content shadow-inner border-base-300"
                      : "btn-ghost text-base-content/70 hover:bg-base-200"
                      }`}
                  >
                    <TerminalIcon className="size-4" />
                    <span>Console</span>
                    <ChevronUpIcon className={`size-4 transition-transform duration-300 ${isConsoleOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Status Indicator (Optional) */}
                  {output && (
                    <div className={`badge badge-sm gap-1 ${output.success ? 'badge-success/10 text-success' : 'badge-error/10 text-error'}`}>
                      <div className={`size-1.5 rounded-full ${output.success ? 'bg-success' : 'bg-error'}`} />
                      {output.success ? 'Passed' : 'Error'}
                    </div>
                  )}
                </div>

                {isConsoleOpen && (
                  <button
                    onClick={() => setConsoleHeight(30)} // Reset size
                    className="btn btn-xs btn-circle btn-ghost text-base-content/40 hover:text-base-content"
                    title="Reset View"
                  >
                    <ChevronDownIcon className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
      <ChallengeCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        streak={newStreak}
      />
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        type="problem"
        limit={5}
      />
    </div >
  );
}

export default ProblemPage;
