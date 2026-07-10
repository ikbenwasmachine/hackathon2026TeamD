import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { BadgeDto } from "shared-types";
import { fetchBadges } from "../api/client";
import { useCurrentUser } from "../auth/useCurrentUser";

export function BadgesPage(): ReactElement {
	const { account } = useCurrentUser();
	const [badges, setBadges] = useState<BadgeDto[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!account || account.role !== "STUDENT") {
			return;
		}
		fetchBadges(account.id)
			.then(setBadges)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load badges");
			});
	}, [account]);

	if (!account || account.role !== "STUDENT") {
		return <p>Sign in as a student to see your badges.</p>;
	}

	if (error) {
		return <p role="alert">{error}</p>;
	}

	const earnedCount = badges.filter((badge) => badge.earned).length;

	return (
		<section>
			<h1>Badges</h1>
			<p>
				You&apos;ve earned {earnedCount} / {badges.length} badges.
			</p>
			<ul className="badge-grid">
				{badges.map((badge) => (
					<li key={badge.id} className={badge.earned ? "badge-card" : "badge-card badge-locked"}>
						<span className="badge-icon" aria-hidden="true">
							{badge.icon}
						</span>
						<h3>{badge.name}</h3>
						<p>{badge.description}</p>
						<p className={badge.earned ? "quiz-result-correct" : ""}>{badge.earned ? "Earned" : "Locked"}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
