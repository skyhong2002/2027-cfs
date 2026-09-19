import planData from "../data/plan.json" with { type: "json" };
import itemData from "../data/item.json" with { type: "json" };

/** Catalog facts must be verified for 2027; missing values are unknown, never promises. */
export type ProposalLanguage = "zh-Hant" | "en";
export type ProposalMode = "preview" | "live";
export type ProposalLineStatus = "priced" | "included" | "requires-plan" | "requires-review" | "unpriced" | "unavailable" | "pending";
export interface ProposalSelection {
	tierId: string | null;
	itemIds: string[];
}
export interface ProposalBenefitSource {
	item_id: string;
	item_name: string;
	quantity: string;
}
export interface ProposalPlanSource {
	id: string;
	name_zh: string;
	name_en: string;
	price: string;
	order?: number;
	/** User's proposed partnership direction; not an assertion of confirmed benefits. */
	intent_zh?: string;
	intent_en?: string;
	benefits: ProposalBenefitSource[];
}
export interface ProposalSubItemSource {
	name_zh: string;
	name_en: string;
	price: string;
	remaining?: string;
	image?: string;
	/** Explicit false/unknown prevents a numeric price becoming an available standalone offer. */
	purchasable?: boolean | "pending";
}
export interface ProposalItemSource extends ProposalSubItemSource {
	quantity?: string;
	type?: string;
	global_description_zh?: string;
	global_description_en?: string;
	deadline?: string;
	unit?: string;
	sub?: ProposalSubItemSource[];
}
export interface ProposalSource {
	plans: Record<string, ProposalPlanSource>;
	items: Record<string, ProposalItemSource>;
}
export interface ProposalOptions {
	lang?: ProposalLanguage;
	mode?: ProposalMode;
	now?: Date;
	source?: ProposalSource;
}
export interface ProposalCatalogItem {
	id: string;
	parentId: string;
	title: string;
	name_zh: string;
	type: string;
	description: string;
	global_description: string;
	priceLabel: string;
	amount: number | null;
	isPackageOnly: boolean;
	deadline: string;
	remaining: string;
	unit: string;
	image: string;
	purchasable: boolean | "pending";
}
export interface ProposalBenefit {
	id: string | null;
	title: string;
	quantity: string;
	requiresReview: boolean;
	status: "confirmed" | "pending";
}
export interface ProposalTier {
	id: string;
	title: string;
	intent: string;
	priceLabel: string;
	amount: number | null;
	deadline: string;
	benefits: ProposalBenefit[];
}
export interface ProposalLine {
	id: string;
	title: string;
	priceLabel: string;
	amount: number | null;
	status: ProposalLineStatus;
	includedQuantity?: string;
}
export interface Proposal {
	selection: ProposalSelection;
	tier: ProposalTier | null;
	/** Includes the selected tier followed by selected add-ons. Included rows have amount 0. */
	lines: ProposalLine[];
	/** Only confirmed included rights. tier.benefits also carries pending rows. */
	includedBenefits: ProposalBenefit[];
	pendingBenefits: ProposalBenefit[];
	referenceSubtotal: number;
	hasUnpricedItems: boolean;
	isCompleteEstimate: boolean;
	notices: string[];
}

/** JSON string values are runtime input; only explicit booleans confirm sale eligibility. */
export function normalizePurchasable(value: unknown): boolean | "pending" {
	return typeof value === "boolean" ? value : "pending";
}

const defaultSource: ProposalSource = {
	plans: planData,
	items: Object.fromEntries(
		Object.entries(itemData).map(([id, item]) => [
			id,
			{
				...item,
				purchasable: normalizePurchasable(item.purchasable),
				sub: item.sub.map(sub => ({ ...sub, purchasable: normalizePurchasable(sub.purchasable) }))
			}
		])
	)
};
const quantityState = (quantity: string): "confirmed" | "pending" | "excluded" => {
	const value = quantity.trim();
	if (value === "0") return "excluded";
	return /^(?:[1-9]\d*|[Oo]|logo)$/i.test(value) ? "confirmed" : "pending";
};
const pendingPrice = (value: string) => !value.trim() || /待確認|待定|未定|pending|TBC|TBD/i.test(value);

/** Accept one exact amount; ranges, /unit suffixes and 起 do not produce a precise subtotal. */
export function parseReferencePrice(value: string): number | null {
	const match = value.trim().match(/^(?:(?:NT\$|TWD|\$)\s*)?((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?)$/i);
	if (!match) return null;
	const amount = Number(match[1].replaceAll(",", ""));
	return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

/** Published date is inclusive, using Taiwan time regardless of the browser timezone. */
export function isProposalDeadlinePassed(deadline: string, now: Date = new Date()): boolean {
	if (!deadline) return false;
	const match = deadline.match(/^(\d{4})[/-](\d{2})[/-](\d{2})$/);
	if (!match) return true;
	const end = Date.parse(`${match[1]}-${match[2]}-${match[3]}T23:59:59.999+08:00`);
	return !Number.isFinite(end) || now.getTime() > end;
}

function getBenefits(tierId: string | null | undefined, lang: ProposalLanguage, source: ProposalSource): ProposalBenefit[] {
	const plan = Object.values(source.plans).find(plan => plan.id === tierId);
	if (!plan) return [];
	return plan.benefits
		.filter(benefit => quantityState(benefit.quantity) !== "excluded")
		.map(benefit => {
			const direct = source.items[benefit.item_id];
			const nameMatch = Object.values(source.items)
				.flatMap(item => item.sub || [])
				.find(sub => sub.name_zh === benefit.item_name);
			return {
				id: benefit.item_id || null,
				title: lang === "en" ? direct?.name_en || nameMatch?.name_en || benefit.item_name : direct?.name_zh || benefit.item_name,
				quantity: benefit.quantity,
				requiresReview: !benefit.item_id,
				status: quantityState(benefit.quantity) === "confirmed" ? "confirmed" : "pending"
			};
		});
}

export function getIncludedBenefits(tierId: string | null | undefined, lang: ProposalLanguage = "zh-Hant", source: ProposalSource = defaultSource): ProposalBenefit[] {
	return getBenefits(tierId, lang, source).filter(benefit => benefit.status === "confirmed");
}

export function getProposalCatalog(lang: ProposalLanguage = "zh-Hant", source: ProposalSource = defaultSource): { tiers: ProposalTier[]; addons: ProposalCatalogItem[] } {
	const tiers = Object.values(source.plans).map(plan => {
		const deadlines = plan.benefits
			.filter(benefit => quantityState(benefit.quantity) === "confirmed")
			.flatMap(benefit => {
				const deadline = source.items[benefit.item_id]?.deadline;
				return deadline ? [deadline] : [];
			})
			.sort();
		return {
			id: plan.id,
			title: lang === "en" ? plan.name_en : plan.name_zh,
			intent: (lang === "en" ? plan.intent_en : plan.intent_zh) || "",
			priceLabel: plan.price,
			amount: parseReferencePrice(plan.price),
			deadline: deadlines[0] || "",
			benefits: getBenefits(plan.id, lang, source)
		};
	});
	const addons: ProposalCatalogItem[] = Object.entries(source.items).flatMap(([parentId, item]) => {
		const common = {
			parentId,
			type: item.type || "",
			description: (lang === "en" ? item.global_description_en : item.global_description_zh) || "",
			global_description: (lang === "en" ? item.global_description_en : item.global_description_zh) || "",
			isPackageOnly: item.quantity === "打包專屬",
			deadline: item.deadline || "",
			unit: item.unit || ""
		};
		if (item.sub?.length)
			return item.sub.map((sub, index) => ({
				...common,
				id: `${parentId}-sub-${index}`,
				title: lang === "en" ? sub.name_en : sub.name_zh,
				name_zh: sub.name_zh,
				priceLabel: sub.price,
				amount: parseReferencePrice(sub.price),
				remaining: item.remaining === "0" ? "0" : sub.remaining || "",
				image: sub.image || item.image || "",
				purchasable: sub.purchasable ?? item.purchasable ?? "pending"
			}));
		return [
			{
				...common,
				id: parentId,
				title: lang === "en" ? item.name_en : item.name_zh,
				name_zh: item.name_zh,
				priceLabel: item.price,
				amount: parseReferencePrice(item.price),
				remaining: item.remaining || "",
				image: item.image || "",
				purchasable: item.purchasable ?? "pending"
			}
		];
	});
	return { tiers, addons };
}

/** Discard stale/unknown identifiers and never trust saved prices or display strings. */
export function normalizeSelection(input: unknown, source: ProposalSource = defaultSource): ProposalSelection {
	const value = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
	const catalog = getProposalCatalog("zh-Hant", source);
	const tierId = typeof value.tierId === "string" && catalog.tiers.some(tier => tier.id === value.tierId) ? value.tierId : null;
	const allowedIds = new Set(catalog.addons.map(item => item.id));
	const itemIds = Array.isArray(value.itemIds) ? [...new Set(value.itemIds.filter((id): id is string => typeof id === "string" && allowedIds.has(id)))] : [];
	return { tierId, itemIds };
}

export function buildProposal(input: unknown, options: ProposalOptions = {}): Proposal {
	const { lang = "zh-Hant", mode = "preview", now = new Date(), source = defaultSource } = options;
	const selection = normalizeSelection(input, source);
	const catalog = getProposalCatalog(lang, source);
	const tier = catalog.tiers.find(tier => tier.id === selection.tierId) || null;
	const tierAvailable = !tier || mode === "preview" || !isProposalDeadlinePassed(tier.deadline, now);
	const includedBenefits = tierAvailable ? tier?.benefits.filter(benefit => benefit.status === "confirmed") || [] : [];
	const pendingBenefits = tier?.benefits.filter(benefit => benefit.status === "pending") || [];
	const rawPlan = Object.values(source.plans).find(plan => plan.id === selection.tierId);
	const lines: ProposalLine[] = [];
	if (tier)
		lines.push({
			id: `tier-${tier.id}`,
			title: tier.title,
			priceLabel: tier.priceLabel,
			amount: tierAvailable ? tier.amount : null,
			status: !tierAvailable ? "unavailable" : tier.amount !== null ? "priced" : pendingPrice(tier.priceLabel) ? "pending" : "unpriced"
		});
	for (const id of selection.itemIds) {
		const item = catalog.addons.find(item => item.id === id)!;
		const included = includedBenefits.find(benefit => benefit.id === id);
		const matches = (benefit: ProposalBenefitSource) =>
			benefit.item_id === id || (!benefit.item_id && benefit.item_name === item.name_zh) || (id !== item.parentId && benefit.item_id === item.parentId);
		const pendingRelation = tierAvailable && rawPlan?.benefits.some(benefit => quantityState(benefit.quantity) === "pending" && matches(benefit));
		const ambiguous = tierAvailable && rawPlan?.benefits.some(benefit => quantityState(benefit.quantity) === "confirmed" && matches(benefit) && benefit.item_id !== id);
		let status: ProposalLineStatus;
		if (mode === "live" && (item.remaining === "0" || isProposalDeadlinePassed(item.deadline, now))) status = "unavailable";
		else if (included) status = "included";
		else if (pendingRelation) status = "pending";
		else if (ambiguous) status = "requires-review";
		// Editorial grouping is not confirmation of this year's commercial restrictions.
		else if (item.purchasable === false) status = "requires-plan";
		else if (item.purchasable === "pending" || pendingPrice(item.priceLabel)) status = "pending";
		else status = item.amount === null ? "unpriced" : "priced";
		lines.push({
			id,
			title: item.title,
			priceLabel: item.priceLabel,
			amount: status === "included" ? 0 : status === "priced" ? item.amount : null,
			status,
			...(included ? { includedQuantity: included.quantity } : {})
		});
	}
	const hasUnpricedItems = lines.some(line => line.amount === null);
	const notices = [
		lang === "en"
			? "SITCON 2027 prices, availability and benefits await confirmation. This selection records your interests and is not a quotation."
			: "SITCON 2027 價格、名額與權益待確認；此清單記錄合作意向，不是報價。"
	];
	if (lines.some(line => line.status === "requires-plan")) notices.push(lang === "en" ? "Some selections require an eligible sponsorship tier." : "部分項目需搭配包含該權益的方案。");
	if (lines.some(line => line.status === "requires-review"))
		notices.push(lang === "en" ? "Some add-ons may overlap with plan benefits; additional quantities and charges need confirmation." : "部分選配與方案權益重疊，額外數量與費用需確認。");
	if (lines.some(line => line.status === "unavailable")) notices.push(lang === "en" ? "Some selections are expired or unavailable." : "部分選項已截止或無可用名額。");
	return {
		selection,
		tier,
		lines,
		includedBenefits,
		pendingBenefits,
		referenceSubtotal: lines.reduce((sum, line) => sum + (line.amount ?? 0), 0),
		hasUnpricedItems,
		isCompleteEstimate: lines.length > 0 && !hasUnpricedItems && pendingBenefits.length === 0,
		notices
	};
}
