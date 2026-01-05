import { Code2Icon, LoaderIcon, PlusIcon, LockIcon, GlobeIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  ...roomConfig,
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* PRIVATE/PUBLIC TOGGLE */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Session Type</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`btn flex-1 gap-2 ${!roomConfig.isPrivate ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRoomConfig({ ...roomConfig, isPrivate: false })}
              >
                <GlobeIcon className="size-4" />
                Public
              </button>
              <button
                type="button"
                className={`btn flex-1 gap-2 ${roomConfig.isPrivate ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRoomConfig({ ...roomConfig, isPrivate: true })}
              >
                <LockIcon className="size-4" />
                Private
              </button>
            </div>
            <p className="text-xs opacity-60 mt-1">
              {roomConfig.isPrivate
                ? "Private: Others must enter invite code to join"
                : "Public: Anyone can join from Live Sessions"}
            </p>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Type: <span className="font-medium">{roomConfig.isPrivate ? "Private (Invite Only)" : "Public"}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
