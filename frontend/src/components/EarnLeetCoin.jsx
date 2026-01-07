import React from 'react';
import { Link } from 'react-router-dom';
import {
    CoinsIcon,
    CalendarCheckIcon,
    FlameIcon,
    TrophyIcon,
    CodeIcon,
    UsersIcon,
    MessageSquareIcon,
    BugIcon,
    FlagIcon,
    LinkedinIcon,
    GithubIcon,
    ChromeIcon,
    FacebookIcon,
    ArrowRightIcon,
    SparklesIcon,
    AwardIcon,
    TargetIcon,
    StarIcon
} from 'lucide-react';

const EarnLeetCoin = () => {
    // Mission card component
    const MissionCard = ({ icon: Icon, title, reward, link, linkText = 'Go to mission' }) => (
        <div className="card bg-base-100 border border-base-300 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="card-body p-4 flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <CoinsIcon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <p className="text-amber-500 font-bold text-sm">+{reward}</p>
                </div>
                <Link
                    to={link}
                    className="btn btn-sm btn-outline btn-warning gap-1 flex-shrink-0"
                >
                    {linkText}
                    <ArrowRightIcon className="size-3" />
                </Link>
            </div>
        </div>
    );

    // Mission section component
    const MissionSection = ({ title, children }) => (
        <div className="mb-10">
            <h3 className="text-lg font-semibold text-center text-base-content/70 mb-6">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            {/* Check-in Missions */}
            <MissionSection title="Check-in Missions">
                <MissionCard
                    icon={CalendarCheckIcon}
                    title="Daily Check-in"
                    reward="1"
                    link="/dashboard"
                />
                <MissionCard
                    icon={FlameIcon}
                    title="30-day Streak Check-in"
                    reward="30"
                    link="/dashboard"
                />
                <MissionCard
                    icon={TargetIcon}
                    title="Complete Daily Challenge"
                    reward="10"
                    link="/problems"
                />
                <MissionCard
                    icon={StarIcon}
                    title="Completing Weekly Premium Challenges"
                    reward="35"
                    link="/problems"
                />
            </MissionSection>

            {/* Contest Missions */}
            <MissionSection title="Contest Missions">
                <MissionCard
                    icon={UsersIcon}
                    title="Join a Contest"
                    reward="5"
                    link="/contests"
                />
                <MissionCard
                    icon={TrophyIcon}
                    title="Join Biweekly + Weekly Contests in Same Week"
                    reward="35"
                    link="/contests"
                />
                <MissionCard
                    icon={AwardIcon}
                    title="1st Place in a Contest"
                    reward="5,000"
                    link="/contests"
                />
                <MissionCard
                    icon={AwardIcon}
                    title="2nd Place in a Contest"
                    reward="2,500"
                    link="/contests"
                />
                <MissionCard
                    icon={AwardIcon}
                    title="3rd Place in a Contest"
                    reward="1,000"
                    link="/contests"
                />
                <MissionCard
                    icon={TrophyIcon}
                    title="Top 50 in a Contest"
                    reward="300"
                    link="/contests"
                />
                <MissionCard
                    icon={TrophyIcon}
                    title="Top 100 in a Contest"
                    reward="100"
                    link="/contests"
                />
                <MissionCard
                    icon={TrophyIcon}
                    title="Top 200 in a Contest"
                    reward="50"
                    link="/contests"
                />
                <MissionCard
                    icon={SparklesIcon}
                    title="First Contest Submission"
                    reward="200"
                    link="/contests"
                />
            </MissionSection>

            {/* Contribution Missions */}
            <MissionSection title="Contribution Missions">
                <MissionCard
                    icon={CodeIcon}
                    title="Contribute a Testcase"
                    reward="100"
                    link="/problems"
                />
                <MissionCard
                    icon={MessageSquareIcon}
                    title="Contribute a Question"
                    reward="1000"
                    link="/problems"
                />
                <MissionCard
                    icon={BugIcon}
                    title="File Content Issue to Feedback Repo"
                    reward="100"
                    link="https://github.com"
                    linkText="Go to GitHub"
                />
                <MissionCard
                    icon={FlagIcon}
                    title="Report a Contest Violation"
                    reward="100"
                    link="/contests"
                />
            </MissionSection>

            {/* Complete Profile Missions */}
            <MissionSection title="Complete Profile Missions">
                <MissionCard
                    icon={LinkedinIcon}
                    title="Connect LinkedIn"
                    reward="10"
                    link="/dashboard"
                />
                <MissionCard
                    icon={ChromeIcon}
                    title="Connect Google"
                    reward="10"
                    link="/dashboard"
                />
                <MissionCard
                    icon={GithubIcon}
                    title="Connect Github"
                    reward="10"
                    link="/dashboard"
                />
                <MissionCard
                    icon={FacebookIcon}
                    title="Connect Facebook"
                    reward="10"
                    link="/dashboard"
                />
            </MissionSection>

            {/* Info Box */}
            <div className="bg-base-100 border border-base-300 rounded-xl p-6 text-center">
                <CoinsIcon className="size-8 text-amber-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">How to Earn LeetCoins?</h4>
                <p className="text-base-content/60 text-sm max-w-lg mx-auto">
                    Complete missions, solve problems, participate in contests, and maintain your streak to earn LeetCoins.
                    Redeem them for exclusive merchandise and premium features!
                </p>
            </div>
        </div>
    );
};

export default EarnLeetCoin;
