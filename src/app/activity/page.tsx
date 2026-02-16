import ActivityPageClient from "./ActivityPageClient";

export const metadata = {
    title: "Activity | Hridey Marwah",
    description: "GitHub contributions and problem solving activity.",
};

export default function ActivityPage() {
    return (
        <ActivityPageClient
            githubUsername="hrideymarwah15"
            leetcodeUsername="hrideymarwah15"
        />
    );
}
