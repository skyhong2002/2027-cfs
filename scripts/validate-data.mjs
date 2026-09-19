import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EVENT_YEAR = 2027;
const pending = value => typeof value === "string" && /待確認|待補|尚未確認|未定|placeholder|pending|tbc|tbd|to be confirmed/i.test(value);

export function readProvenance(root = process.cwd()) {
	return JSON.parse(fs.readFileSync(path.join(root, "src/data/provenance.json"), "utf8"));
}

/** Reject stale data before either downloaded images or the committed catalog can change. */
export function validateCatalog({ items, plans, provenance }) {
	const errors = [];
	if (!items || !Object.keys(items).length) errors.push("item: catalog must not be empty");
	if (!plans || !Object.keys(plans).length) errors.push("plan: catalog must not be empty");
	if (provenance?.year !== EVENT_YEAR) errors.push(`provenance.year must be ${EVENT_YEAR}`);
	if (!provenance?.sources || !provenance?.claims) errors.push("provenance must define sources and claims objects");

	function requireEvidence(key, value) {
		const claim = provenance?.claims?.[key];
		const source = provenance?.sources?.[claim?.source];
		if (
			claim?.status !== "confirmed" ||
			JSON.stringify(claim.value) !== JSON.stringify(value) ||
			typeof source?.title !== "string" ||
			!source.title.trim() ||
			typeof source?.reference !== "string" ||
			!source.reference.trim()
		) {
			errors.push(`${key}: confirmed exact-value claim and a named source reference required`);
		}
	}

	function visit(value, key) {
		if (Array.isArray(value)) return value.forEach((child, index) => visit(child, `${key}.${index}`));
		if (value && typeof value === "object") {
			if (value.status === "confirmed" || value.confirmed === true) requireEvidence(key, value);
			return Object.entries(value).forEach(([field, child]) => visit(child, `${key}.${field}`));
		}
		if (typeof value !== "string" && typeof value !== "number") return;
		const text = String(value);
		const field = key.split(".").at(-1);
		if (field === "price") {
			if (/\d/.test(text)) requireEvidence(key, value);
			return;
		}
		if (field === "quantity" && key.startsWith("plan.") && text.trim() && !pending(text)) requireEvidence(key, value);
		if (field === "deadline" && text.trim() && !pending(text)) {
			const match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
			if (!match || Number(match[1]) < EVENT_YEAR) errors.push(`${key}: must be a valid date in ${EVENT_YEAR} or later, or an explicit pending placeholder`);
			else {
				const [, year, month, day] = match.map(Number);
				const parsed = new Date(Date.UTC(year, month - 1, day));
				if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) errors.push(`${key}: invalid calendar date`);
			}
		}
		// IDs, quantities, counts and asset names are not event-year claims.
		if (["id", "item_id", "image", "order", "remaining", "quantity", "unit"].includes(field) || typeof value === "number") return;
		for (const match of text.matchAll(/(?<!\d)(?:19\d{2}|20\d{2})(?!\d)/g)) {
			const suffix = text.slice(match.index + match[0].length);
			if (/^\s*(?:條|份|個|人|元|copies\b|people\b|items\b)/i.test(suffix)) continue;
			if (Number(match[0]) < EVENT_YEAR) errors.push(`${key}: contains a year before ${EVENT_YEAR}; replace unverified content with a placeholder`);
		}
	}
	visit(items, "item");
	visit(plans, "plan");
	if (errors.length) throw new Error(`Catalog validation failed:\n${[...new Set(errors)].map(error => `- ${error}`).join("\n")}`);
	return true;
}

export function validateDataFiles(root = process.cwd()) {
	const read = name => JSON.parse(fs.readFileSync(path.join(root, `src/data/${name}.json`), "utf8"));
	return validateCatalog({ items: read("item"), plans: read("plan"), provenance: readProvenance(root) });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		validateDataFiles();
		console.log(`SITCON ${EVENT_YEAR} catalog validation passed.`);
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
