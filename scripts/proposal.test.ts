import assert from "node:assert/strict";
import { test } from "node:test";
import { buildProposal, getProposalCatalog, normalizeSelection, normalizePurchasable, parseReferencePrice, isProposalDeadlinePassed, type ProposalSource } from "../src/utils/proposal.ts";

// Entirely synthetic fixture. These prices/rights are test inputs, not SITCON offers.
const fixture: ProposalSource = {
	plans: {
		alpha: {
			id: "alpha",
			name_zh: "測試甲",
			name_en: "Test Alpha",
			price: "NT$1,000",
			benefits: [
				{ item_id: "booth", item_name: "測試攤位", quantity: "1" },
				{ item_id: "screen", item_name: "測試螢幕", quantity: "O" },
				{ item_id: "", item_name: "測試貼文", quantity: "2" }
			]
		},
		beta: {
			id: "beta",
			name_zh: "測試乙",
			name_en: "Test Beta",
			price: "NT$500",
			benefits: [
				{ item_id: "booth", item_name: "測試攤位", quantity: "0" },
				{ item_id: "screen", item_name: "測試螢幕", quantity: "0" }
			]
		},
		draft: {
			id: "draft",
			name_zh: "待確認方案",
			name_en: "Draft",
			price: "待確認",
			intent_zh: "希望與學生交流",
			intent_en: "Explore student engagement",
			benefits: [
				{ item_id: "screen", item_name: "測試螢幕", quantity: "" },
				{ item_id: "booth", item_name: "測試攤位", quantity: "待確認" }
			]
		}
	},
	items: {
		booth: { name_zh: "測試攤位", name_en: "Test booth", price: "", quantity: "打包專屬", purchasable: false, deadline: "2030/02/21" },
		screen: { name_zh: "測試螢幕", name_en: "Test screen", price: "$200", purchasable: true },
		pending: { name_zh: "待確認項目", name_en: "Pending item", price: "待確認" },
		unknownSale: { name_zh: "單買資格未定", name_en: "Unknown sale eligibility", price: "$250" },
		social: {
			name_zh: "社群",
			name_en: "Social",
			price: "",
			purchasable: true,
			sub: [
				{ name_zh: "測試貼文", name_en: "Test post", price: "$30" },
				{ name_zh: "額外測試", name_en: "Extra test", price: "$40", remaining: "0" }
			]
		}
	}
};
const build = (selection: unknown) => buildProposal(selection, { source: fixture });

test("untrusted purchase flags must be explicit booleans, not truthy JSON strings", () => {
	assert.equal(normalizePurchasable(true), true);
	assert.equal(normalizePurchasable(false), false);
	for (const value of ["pending", "true", "false", "yes", 1, null, undefined]) assert.equal(normalizePurchasable(value), "pending");
});

test("exact amounts parse; empty, pending, starting prices and per-unit rates do not", () => {
	assert.equal(parseReferencePrice("NT$1,234"), 1234);
	for (const value of ["", "待確認", "NT$100 起", "$10／篇", "NT$10–50", "$4,00", "-100"]) assert.equal(parseReferencePrice(value), null, value);
});

test("confirmed standalone add-ons add to the selected plan", () => {
	const proposal = build({ tierId: "beta", itemIds: ["screen", "social-sub-0"] });
	assert.equal(proposal.referenceSubtotal, 730);
	assert.equal(proposal.isCompleteEstimate, true);
});

test("plan-only selections are not free rights and explicit zero means excluded", () => {
	const proposal = build({ tierId: "beta", itemIds: ["screen", "booth"] });
	assert.equal(proposal.referenceSubtotal, 700);
	assert.equal(proposal.lines.find(line => line.id === "booth")?.status, "requires-plan");
	assert.equal(proposal.hasUnpricedItems, true);
	assert.equal(proposal.isCompleteEstimate, false);
	assert.equal(proposal.includedBenefits.length, 0);
});

test("confirmed included rights are recalculated when changing plans", () => {
	assert.equal(build({ itemIds: ["screen"] }).referenceSubtotal, 200);
	const proposal = build({ tierId: "alpha", itemIds: ["screen", "booth"], price: 1 });
	assert.equal(proposal.referenceSubtotal, 1000);
	assert.equal(proposal.lines.find(line => line.id === "screen")?.status, "included");
	assert.equal(proposal.lines.find(line => line.id === "booth")?.includedQuantity, "1");
});

test("name-only included sub-item needs review instead of double charging or auto-inclusion", () => {
	const proposal = build({ tierId: "alpha", itemIds: ["social-sub-0"] });
	assert.equal(proposal.lines[1].status, "requires-review");
	assert.equal(proposal.lines[1].amount, null);
	assert.equal(proposal.isCompleteEstimate, false);
});

test("all-pending 2027 proposal retains uncertainty without claiming zero cost or exclusion", () => {
	const proposal = build({ tierId: "draft", itemIds: ["screen", "booth", "pending"] });
	assert.ok(proposal.lines.every(line => line.status === "pending" && line.amount === null));
	assert.equal(proposal.includedBenefits.length, 0);
	assert.equal(proposal.pendingBenefits.length, 2);
	assert.ok(proposal.tier?.benefits.every(benefit => benefit.status === "pending"));
	assert.equal(proposal.hasUnpricedItems, true);
	assert.equal(proposal.isCompleteEstimate, false);
	assert.equal(proposal.referenceSubtotal, 0); // Known subtotal only; not an offer total.
});

test("a draft tier preserves the user's partnership intent in both languages without confirming benefits", () => {
	const selection = { tierId: "draft", itemIds: [] };
	const zh = buildProposal(selection, { source: fixture, lang: "zh-Hant" });
	const en = buildProposal(selection, { source: fixture, lang: "en" });
	assert.equal(zh.tier?.intent, "希望與學生交流");
	assert.equal(en.tier?.intent, "Explore student engagement");
	assert.equal(zh.lines[0].status, "pending");
	assert.equal(en.lines[0].amount, null);
	assert.equal(zh.includedBenefits.length, 0);
	assert.equal(en.isCompleteEstimate, false);
});

test("a numeric standalone price does not confirm that standalone purchase is available", () => {
	const proposal = build({ itemIds: ["unknownSale"] });
	assert.equal(proposal.lines[0].status, "pending");
	assert.equal(proposal.lines[0].amount, null);
	assert.equal(proposal.isCompleteEstimate, false);
});

test("a draft package-only grouping does not establish a commercial restriction", () => {
	const source = structuredClone(fixture);
	source.items.booth.purchasable = "pending";
	const proposal = buildProposal({ itemIds: ["booth"] }, { source });
	assert.equal(proposal.lines[0].status, "pending");
	assert.equal(proposal.lines[0].amount, null);
});

test("pending rights prevent a complete estimate even when the plan price is confirmed", () => {
	const source = structuredClone(fixture);
	source.plans.draft.price = "$900";
	assert.equal(buildProposal({ tierId: "draft", itemIds: [] }, { source }).isCompleteEstimate, false);
});

test("preview permits draft operation; live rejects expired tiers and sold-out sub-items", () => {
	const selection = { tierId: "alpha", itemIds: ["social-sub-1"] };
	const now = new Date("2030-09-20T00:00:00+08:00");
	assert.ok(buildProposal(selection, { source: fixture, mode: "preview", now }).lines.every(line => line.status === "priced"));
	assert.ok(buildProposal(selection, { source: fixture, mode: "live", now }).lines.every(line => line.status === "unavailable"));
	assert.equal(buildProposal({ itemIds: ["social-sub-1"] }, { source: fixture, mode: "live", now: new Date("2029-01-01") }).lines[0].status, "unavailable");
});

test("cutoff is the end of the published Taiwan calendar date", () => {
	assert.equal(isProposalDeadlinePassed("2030/02/21", new Date("2030-02-21T15:59:59Z")), false);
	assert.equal(isProposalDeadlinePassed("2030/02/21", new Date("2030-02-21T16:00:00Z")), true);
});

test("normalize persisted state using the injected catalog; never take saved prices", () => {
	assert.deepEqual(normalizeSelection({ tierId: "invalid", itemIds: ["screen", "screen", "social", "social-sub-0", "social-sub-99", null] }, fixture), {
		tierId: null,
		itemIds: ["screen", "social-sub-0"]
	});
	assert.deepEqual(normalizeSelection(null, fixture), { tierId: null, itemIds: [] });
	assert.equal(build({}).isCompleteEstimate, false);
	assert.equal(getProposalCatalog("en", fixture).addons.find(item => item.id === "social-sub-0")?.title, "Test post");
});
