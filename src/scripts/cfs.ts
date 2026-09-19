import { buildProposal, normalizeSelection, type ProposalSelection, type ProposalLineStatus } from "../utils/proposal.js";

const lang = document.documentElement.lang === "en" ? "en" : "zh-Hant";
const en = lang === "en";
const l = (zh: string, english: string) => (en ? english : zh);
const home = document.body.dataset.home || "/";
const key = "cfs2027-proposal-v1";
const money = (amount: number) => `NT$${amount.toLocaleString("en-US")}`;
let dream = false;
let selection: ProposalSelection = { tierId: null, itemIds: [] };
let storageAvailable = true;
try {
	const stored = JSON.parse(localStorage.getItem(key) || "{}");
	selection = normalizeSelection(stored);
	selection.itemIds = selection.itemIds.filter(id => id !== "18");
	dream = stored?.dream === true;
} catch {
	storageAvailable = false;
}

const statusText = (status: ProposalLineStatus) =>
	({
		priced: l("參考金額，2027 待確認", "Reference price, 2027 pending confirmation"),
		included: l("已包含於所選方案，不重複計價", "Included in your selected tier, no duplicate charge"),
		"requires-plan": l("需搭配適用方案，非免費單品", "Requires an eligible tier; not a free standalone item"),
		"requires-review": l("可能與方案權益重疊，需確認是否另計", "May overlap with tier benefits; additional charges need confirmation"),
		pending: l("2027 價格與適用權益待確認", "2027 pricing and benefits pending confirmation"),
		unpriced: l("價格待確認，不計入小計", "Price pending, excluded from subtotal"),
		unavailable: l("無法提供，請與我們確認", "Unavailable, please discuss with us")
	})[status] || l("待確認", "Pending");
const getProposal = () => buildProposal(selection, { lang, mode: "preview" });
const setText = (selector: string, text: string) => {
	const node = document.querySelector(selector);
	if (node) node.textContent = text;
};

function persist() {
	try {
		localStorage.setItem(key, JSON.stringify({ ...selection, dream }));
		storageAvailable = true;
	} catch {
		storageAvailable = false;
	}
	render();
}
function announce(message: string) {
	setText("#selection-status", message);
}
function remove(id: string) {
	if (id === "dream") dream = false;
	else if (id.startsWith("tier-")) selection.tierId = null;
	else selection.itemIds = selection.itemIds.filter(item => item !== id);
	persist();
	announce(l("已更新合作清單", "Proposal updated"));
}

function proposalText() {
	const proposal = getProposal();
	const lines = [l("SITCON 2027 合作討論清單", "SITCON 2027 partnership proposal"), ""];
	if (!proposal.lines.length && !dream) lines.push(l("尚未選定方案，希望先討論合作目標。", "No plan selected yet; I would like to discuss partnership goals."));
	proposal.lines.forEach(line =>
		lines.push(`${line.title} — ${line.amount === null ? l("待確認", "Pending") : line.status === "included" ? l("方案已含", "Included") : money(line.amount)} (${statusText(line.status)})`)
	);
	if (proposal.tier?.intent) lines.push(`${l("合作方向（供洽談，非權益承諾）", "Partnership direction (for discussion, not a benefit commitment)")}: ${proposal.tier.intent}`);
	if (proposal.includedBenefits.length) {
		lines.push("", l("所選方案的已確認權益：", "Confirmed benefits of the selected tier:"));
		proposal.includedBenefits.forEach(benefit => lines.push(`• ${benefit.title}: ${benefit.quantity}`));
	}
	if (dream)
		lines.push(
			l("開源築夢計畫：希望洽談；支持規模、價格與權益待確認，未計入小計。", "Student support program: interested in discussing; scope, pricing, and benefits pending, excluded from subtotal.")
		);
	lines.push(
		"",
		proposal.lines.some(line => line.status === "priced")
			? `${l("已列價項目參考小計", "Reference subtotal of priced items")}: ${money(proposal.referenceSubtotal)}`
			: l("參考小計：待確認（尚無已確認價格）", "Reference subtotal: pending (no confirmed prices yet)")
	);
	if (proposal.hasUnpricedItems || dream) lines.push(l("另有待確認項目；小計不代表完整合作金額。", "Some selections require confirmation. The subtotal is not the full partnership amount."));
	lines.push(
		l("本清單不是訂單、正式報價或名額保留，最終內容以雙方確認為準。", "This is not an order, formal quotation, or reservation. Final terms require mutual confirmation."),
		home.startsWith("http") ? home : `${location.origin}${home}`
	);
	return lines.join("\n");
}

function render() {
	const proposal = getProposal();
	const container = document.getElementById("proposal-lines");
	if (container) {
		container.replaceChildren();
		const addLine = (id: string, title: string, description: string, amount: string) => {
			const row = document.createElement("div");
			row.className = "proposal-line";
			row.dataset.proposalLine = id;
			const content = document.createElement("div");
			const heading = document.createElement("h3");
			heading.textContent = title;
			const note = document.createElement("p");
			note.textContent = description;
			content.append(heading, note);
			const price = document.createElement("strong");
			price.textContent = amount;
			const button = document.createElement("button");
			button.type = "button";
			button.className = "remove-line";
			button.textContent = "×";
			button.setAttribute("aria-label", `${l("移除", "Remove")} ${title}`);
			button.addEventListener("click", () => remove(id));
			row.append(content, price, button);
			container.append(row);
		};
		proposal.lines.forEach(line =>
			addLine(
				line.id,
				line.title,
				line.id.startsWith("tier-") && proposal.tier?.intent ? `${proposal.tier.intent} · ${statusText(line.status)}` : statusText(line.status),
				line.status === "included" ? l("方案已含", "Included") : line.amount === null ? l("待確認", "Pending") : money(line.amount)
			)
		);
		if (proposal.includedBenefits.length) {
			const details = document.createElement("details");
			details.className = "included-list";
			const summary = document.createElement("summary");
			summary.textContent = l("查看所選方案已確認包含的權益", "View confirmed benefits of your selected tier");
			const list = document.createElement("ul");
			proposal.includedBenefits.forEach(benefit => {
				const item = document.createElement("li");
				item.textContent = `${benefit.title} · ${benefit.quantity}`;
				list.append(item);
			});
			details.append(summary, list);
			container.append(details);
		}
		if (dream)
			addLine(
				"dream",
				l("開源築夢計畫", "Student support program"),
				l("支持規模、價格與曝光權益待確認，未計入小計", "Scope, pricing, and benefits pending; excluded from subtotal"),
				l("洽談需求", "For discussion")
			);
		if (!proposal.lines.length && !dream) {
			const empty = document.createElement("p");
			empty.className = "empty-state";
			empty.textContent = l("還沒有選擇方案或品項。可以先瀏覽，或直接告訴我們你的合作目標。", "No selections yet. Explore the options, or tell us your partnership goals directly.");
			container.append(empty);
		}
	}
	const hasPriced = proposal.lines.some(line => line.status === "priced");
	const count = proposal.lines.length + Number(dream);
	setText("#proposal-total", hasPriced ? money(proposal.referenceSubtotal) : count ? l("待確認", "Pending") : "—");
	setText(
		"#proposal-note",
		count
			? l("價格與權益待確認的項目不計入小計；小計不代表完整合作金額。", "Selections with pending prices or benefits are excluded. The subtotal does not represent the full partnership amount.")
			: l("選擇方案或品項後，會在這裡整理你的需求。", "Your choices will appear here as you explore.")
	);
	if (storageAvailable) setText("#proposal-status", "");
	if (!storageAvailable) setText("#proposal-status", l("此瀏覽器無法儲存清單。離開前請複製或列印，避免遺失。", "This browser cannot save your proposal. Copy or print it before leaving."));
	setText("#dock-count", String(count));
	setText("#dock-total", count ? (hasPriced ? money(proposal.referenceSubtotal) : l("金額待確認", "Pricing pending")) : l("尚未選擇", "Start exploring"));
	document.querySelectorAll<HTMLButtonElement>("[data-tier]").forEach(button => {
		const selected = selection.tierId === button.dataset.tier;
		button.setAttribute("aria-pressed", String(selected));
		button.textContent = selected ? l("已加入 · 點擊移除 ✓", "Added · remove ✓") : l("加入合作清單 ＋", "Add to proposal ＋");
		button.closest("[data-tier-card]")?.classList.toggle("selected", selected);
	});
	document.querySelectorAll<HTMLButtonElement>("[data-option]").forEach(button => {
		const selected = selection.itemIds.includes(button.dataset.option || "");
		button.setAttribute("aria-pressed", String(selected));
		button.textContent = selected ? l("已加入 · 移除 ✓", "Added · remove ✓") : l("加入清單 ＋", "Add to proposal ＋");
	});
	document.querySelectorAll<HTMLElement>("[data-option-status]").forEach(node => {
		const id = node.dataset.optionStatus!;
		const option = buildProposal({ tierId: selection.tierId, itemIds: [id] }, { lang, mode: "preview" }).lines.find(line => line.id === id);
		node.textContent = option ? statusText(option.status) : "";
	});
	const dreamButton = document.getElementById("dream-select");
	if (dreamButton) {
		dreamButton.setAttribute("aria-pressed", String(dream));
		dreamButton.textContent = dream ? l("已加入洽談需求 · 點擊移除 ✓", "Added to inquiry · remove ✓") : l("加入開源築夢洽談需求 ＋", "Add student support to my inquiry ＋");
	}
	// The draft follows the current selection; typed contact details are never stored.
	const result = document.getElementById("inquiry-result");
	if (result && !result.hidden) createDraft(false);
}

document.querySelectorAll<HTMLButtonElement>("[data-tier]").forEach(button =>
	button.addEventListener("click", () => {
		const id = button.dataset.tier!;
		selection.tierId = selection.tierId === id ? null : id;
		persist();
		announce(l("方案已更新，合作清單可檢視完整需求", "Tier updated. View your proposal for details."));
	})
);
document.querySelectorAll<HTMLButtonElement>("[data-option]").forEach(button =>
	button.addEventListener("click", () => {
		const id = button.dataset.option!;
		if (selection.itemIds.includes(id)) selection.itemIds = selection.itemIds.filter(item => item !== id);
		else selection.itemIds.push(id);
		persist();
		announce(l("品項已更新至合作清單", "Option updated in your proposal"));
	})
);
document.getElementById("dream-select")?.addEventListener("click", () => {
	dream = !dream;
	persist();
	announce(l("開源築夢洽談需求已更新", "Student support inquiry updated"));
});
window.addEventListener("storage", event => {
	if (event.key !== key) return;
	try {
		const stored = JSON.parse(event.newValue || "{}");
		selection = normalizeSelection(stored);
		dream = stored.dream === true;
		render();
	} catch {
		/* Keep current state if another tab writes invalid data. */
	}
});

const menu = document.getElementById("main-nav");
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
menuButton?.addEventListener("click", () => {
	const open = menuButton.getAttribute("aria-expanded") !== "true";
	menuButton.setAttribute("aria-expanded", String(open));
	menu?.classList.toggle("open", open);
});
menu?.querySelectorAll("a").forEach(link =>
	link.addEventListener("click", () => {
		menuButton?.setAttribute("aria-expanded", "false");
		menu.classList.remove("open");
	})
);
document.addEventListener("keydown", event => {
	if (event.key === "Escape") {
		menuButton?.setAttribute("aria-expanded", "false");
		menu?.classList.remove("open");
	}
});

// Native dialogs provide focus trapping and Escape; history preserves language and scroll position.
let activeDialog: HTMLDialogElement | null = null;
let modalTrigger: HTMLElement | null = null;
let returnUrl = `${home}#items`;
let pushedDialog = false;
const initialId = document.body.dataset.initialItem;
const originalTitle = `SITCON 2027 · ${l("贊助合作提案", "Partner with the next generation")}`;
function openItem(id: string, updateHistory = true, trigger: HTMLElement | null = null) {
	const dialog = document.getElementById(`item-${id}`) as HTMLDialogElement | null;
	if (!dialog) return;
	if (activeDialog) activeDialog.close();
	modalTrigger = trigger;
	if (updateHistory) {
		returnUrl = `${location.pathname}${location.search}${location.hash}`;
		history.pushState({ cfsItem: id }, "", `${home}item/${id}/`);
		pushedDialog = true;
	}
	activeDialog = dialog;
	dialog.showModal();
	const title = dialog.querySelector("h2")?.textContent || "";
	document.title = `${title} · SITCON 2027`;
}
function closeItem(updateHistory = true) {
	if (!activeDialog) return;
	const dialog = activeDialog;
	activeDialog = null;
	dialog.close();
	document.title = originalTitle;
	if (updateHistory) {
		if (pushedDialog) {
			pushedDialog = false;
			history.back();
		} else history.replaceState(null, "", returnUrl);
	}
	modalTrigger?.focus({ preventScroll: true });
}
document.querySelectorAll<HTMLElement>("[data-open-item]").forEach(trigger =>
	trigger.addEventListener("click", event => {
		if (event instanceof MouseEvent && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) return;
		event.preventDefault();
		openItem(trigger.dataset.openItem!, true, trigger);
	})
);
document.querySelectorAll<HTMLDialogElement>("[data-item-dialog]").forEach(dialog => {
	dialog.querySelector(".dialog-close")?.addEventListener("click", () => closeItem());
	dialog.addEventListener("cancel", event => {
		event.preventDefault();
		closeItem();
	});
	dialog.addEventListener("click", event => {
		if (event.target === dialog) {
			const r = dialog.getBoundingClientRect();
			const e = event as MouseEvent;
			if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeItem();
		}
	});
	dialog.querySelector("[data-close-to-proposal]")?.addEventListener("click", event => {
		event.preventDefault();
		closeItem(false);
		pushedDialog = false;
		history.replaceState(null, "", `${home}#proposal`);
		document.getElementById("proposal")?.scrollIntoView({ behavior: "smooth" });
	});
});
window.addEventListener("popstate", () => {
	const match = location.pathname.match(/\/item\/([^/]+)\/?$/);
	if (match) {
		pushedDialog = false;
		openItem(match[1], false);
	} else {
		pushedDialog = false;
		closeItem(false);
	}
});
if (initialId) {
	returnUrl = `${home}#items`;
	openItem(initialId, false);
}

// Goal filters rank relevant items by existing editorial priority; they do not promise efficacy.
let filter = "all";
let expanded = false;
const search = document.querySelector<HTMLInputElement>("#item-search");
const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-catalog-item]"));
const grid = document.querySelector(".catalog-grid");
const expandButton = document.querySelector<HTMLButtonElement>("#catalog-expand");
function filterCatalog() {
	const query = search?.value.trim().toLocaleLowerCase() || "";
	const filtered = cards.filter(
		card =>
			(!query || (card.dataset.search || "").toLocaleLowerCase().includes(query)) &&
			(filter === "included" ? card.dataset.package === "true" : filter === "all" ? true : Number(card.dataset[filter]) > 0)
	);
	if (["talent", "brand", "product"].includes(filter)) filtered.sort((a, b) => Number(a.dataset[filter]) - Number(b.dataset[filter]));
	cards.forEach(card => {
		card.hidden = true;
	});
	filtered.forEach((card, index) => {
		card.hidden = !expanded && !query && index >= 6;
		grid?.append(card);
	});
	setText("#catalog-count", `${l("符合條件", "Matching options")}: ${filtered.length}${!expanded && !query && filtered.length > 6 ? l(" · 先顯示 6 項", " · showing 6") : ""}`);
	const empty = document.getElementById("no-results");
	if (empty) empty.hidden = filtered.length > 0;
	if (expandButton) {
		expandButton.hidden = filtered.length <= 6 || !!query;
		expandButton.textContent = expanded ? l("收起品項 ↑", "Show fewer ↑") : `${l("顯示全部", "Show all")} ${filtered.length} ${l("項", "options")} ↓`;
	}
}
document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(button =>
	button.addEventListener("click", () => {
		filter = button.dataset.filter!;
		expanded = false;
		document.querySelectorAll("[data-filter]").forEach(node => node.setAttribute("aria-pressed", String(node === button)));
		filterCatalog();
	})
);
search?.addEventListener("input", filterCatalog);
expandButton?.addEventListener("click", () => {
	expanded = !expanded;
	filterCatalog();
	if (!expanded) document.getElementById("items")?.scrollIntoView({ behavior: "smooth" });
});

async function copyText(text: string, status: string) {
	try {
		if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
		else {
			const area = document.createElement("textarea");
			area.value = text;
			area.style.position = "fixed";
			area.style.top = "-9999px";
			document.body.append(area);
			area.select();
			const copied = document.execCommand("copy");
			area.remove();
			if (!copied) throw new Error("Clipboard unavailable");
		}
		setText(status, l("已複製，可貼到郵件或內部討論文件。", "Copied. Paste into an email or your team’s discussion."));
	} catch {
		setText(status, l("無法自動複製，請選取內容手動複製，或使用列印。", "Automatic copy is unavailable. Select and copy the text, or print it."));
	}
}
document.getElementById("copy-proposal")?.addEventListener("click", () => copyText(proposalText(), "#proposal-status"));
document.getElementById("print-proposal")?.addEventListener("click", () => window.print());

const inquiryForm = document.querySelector<HTMLFormElement>("#inquiry-form");
function createDraft(scroll = true) {
	if (!inquiryForm) return;
	const form = new FormData(inquiryForm);
	const organization = String(form.get("organization") || "").trim();
	const name = String(form.get("name") || "").trim();
	const email = String(form.get("email") || "").trim();
	const message = String(form.get("message") || "").trim();
	const subject = `${l("SITCON 2027 合作洽詢", "SITCON 2027 partnership inquiry")} — ${organization}`;
	const body = [
		l("SITCON 團隊您好，", "Hello SITCON team,"),
		"",
		`${l("單位", "Organization")}: ${organization}`,
		`${l("聯絡人", "Contact")}: ${name}`,
		`Email: ${email}`,
		"",
		message,
		"",
		proposalText()
	].join("\n");
	const draft = document.querySelector<HTMLTextAreaElement>("#inquiry-draft");
	if (draft) draft.value = `${l("主旨", "Subject")}: ${subject}\n\n${body}`;
	const open = document.querySelector<HTMLAnchorElement>("#open-email");
	if (open) open.href = `mailto:contact@sitcon.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	const result = document.getElementById("inquiry-result");
	if (result) {
		result.hidden = false;
		if (scroll) result.scrollIntoView({ behavior: "smooth", block: "center" });
	}
	if (scroll) setText("#inquiry-status", l("草稿已準備，尚未寄出。請確認內容後開啟郵件程式。", "Draft prepared, not sent. Review it and open your email app."));
}
inquiryForm?.addEventListener("submit", event => {
	event.preventDefault();
	if (inquiryForm.reportValidity()) createDraft();
});
inquiryForm?.addEventListener("input", () => {
	const result = document.getElementById("inquiry-result");
	if (result && !result.hidden) createDraft(false);
});
document.getElementById("copy-email")?.addEventListener("click", () => copyText(document.querySelector<HTMLTextAreaElement>("#inquiry-draft")?.value || "", "#inquiry-status"));
render();
filterCatalog();
