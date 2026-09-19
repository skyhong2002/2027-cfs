import assert from "node:assert/strict";
import { test } from "node:test";
import { EVENT_YEAR, validateCatalog } from "./validate-data.mjs";

function fixture() {
	return {
		items: { option: { name_zh: "合作項目", price: "待確認", deadline: "待確認", sub: [] } },
		plans: { tier: { price: "待確認", benefits: [{ quantity: "待確認" }] } },
		provenance: { year: EVENT_YEAR, sources: {}, claims: {} }
	};
}

test("explicit pending data is valid without inventing prices or evidence", () => {
	assert.equal(validateCatalog(fixture()), true);
});

test("old dates and event copy are rejected, including inside sub-items", () => {
	for (const change of [data => (data.items.option.deadline = `${EVENT_YEAR - 1}/12/31`), data => data.items.option.sub.push({ name_zh: `SITCON ${EVENT_YEAR - 1}` })]) {
		const data = fixture();
		change(data);
		assert.throws(() => validateCatalog(data), /Catalog validation failed/);
	}
});

test("dates must exist in the calendar while stock quantities are not years", () => {
	const data = fixture();
	data.items.option.deadline = `${EVENT_YEAR}/02/30`;
	assert.throws(() => validateCatalog(data), /invalid calendar date/);
	data.items.option.deadline = `${EVENT_YEAR}/02/28`;
	data.items.option.quantity = "2000";
	data.items.option.global_description_zh = "製作 2000 條吊繩";
	assert.equal(validateCatalog(data), true);
});

test("numeric prices and concrete tier rights require exact-value source evidence", () => {
	const data = fixture();
	data.plans.tier.price = "NT$100,000";
	data.plans.tier.benefits[0].quantity = "2";
	assert.throws(() => validateCatalog(data), /plan.tier.price/);
	data.provenance.sources.approval = { title: "SITCON 2027 approval", reference: "docs/approval.md" };
	data.provenance.claims["plan.tier.price"] = { status: "confirmed", source: "approval", value: "NT$100,000" };
	assert.throws(() => validateCatalog(data), /plan.tier.benefits.0.quantity/);
	data.provenance.claims["plan.tier.benefits.0.quantity"] = { status: "confirmed", source: "approval", value: "2" };
	assert.equal(validateCatalog(data), true);
	data.plans.tier.price = "NT$110,000";
	assert.throws(() => validateCatalog(data), /exact-value claim/);
});

test("a confirmed flag cannot bypass evidence and missing catalogs cannot pass", () => {
	const data = fixture();
	data.items.option.confirmed = true;
	assert.throws(() => validateCatalog(data), /item.option/);
	delete data.items.option.confirmed;
	data.items = {};
	assert.throws(() => validateCatalog(data), /must not be empty/);
});
