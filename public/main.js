const API_URL = "/api/contacts";

const addContactBtn = document.getElementById("addContactBtn");
const modal = document.getElementById("contactModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("contactForm");

const contactsList = document.getElementById("contactsList");
const contactCount = document.getElementById("contactCount");

const modalTitle = document.getElementById("modalTitle");
const submitBtnText = document.getElementById("submitBtnText");

const nameInput = document.getElementById("name");
const countryCodeInput = document.getElementById("countryCode");
const phoneInput = document.getElementById("phoneNumber");

const searchInput = document.getElementById("searchInput");
const sortFilter = document.getElementById("sortFilter");

let editingId = null;

let allContacts = [];
let filteredContacts = [];

let currentPage = 1;
const limit = 5;

function openModal(contact = null) {
  modal.classList.remove("hidden");

  if (contact) {
    modalTitle.textContent = "Edit Contact";
    submitBtnText.textContent = "Update Contact";

    nameInput.value = contact.name;
    countryCodeInput.value = contact.countryCode;
    phoneInput.value = contact.phoneNumber;

    editingId = contact._id;
  } else {
    modalTitle.textContent = "Add Contact";
    submitBtnText.textContent = "Save Contact";
    form.reset();
    editingId = null;
  }
}

function closeModal() {
  modal.classList.add("hidden");
  form.reset();
  editingId = null;
}

addContactBtn.addEventListener("click", () => openModal());
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value,
    countryCode: countryCodeInput.value,
    phoneNumber: phoneInput.value,
  };

  const url = editingId ? `${API_URL}/${editingId}` : API_URL;
  const method = editingId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  closeModal();
  loadContacts();
});

async function loadContacts() {
  try {
    const res = await fetch(API_URL);
    allContacts = await res.json();

    applyFilters();
  } catch (err) {
    console.error(err);
  }
}

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const sortValue = sortFilter.value;

  filteredContacts = allContacts.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchValue) ||
      c.phoneNumber.includes(searchValue)
    );
  });

  if (sortValue === "newest") {
    filteredContacts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else {
    filteredContacts.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  currentPage = 1;
  renderPage();
}

function renderPage() {
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const pageData = filteredContacts.slice(start, end);

  if (!pageData.length) {
    contactsList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">No contacts found</p>
      </div>
    `;
    contactCount.textContent = "0 contacts";
    return;
  }

  contactsList.innerHTML = pageData
    .map(
      (c) => `
    <div class="contact-card">
      <div>
        <strong>${escapeHtml(c.name)}</strong><br />
        ${escapeHtml(c.countryCode)} ${escapeHtml(c.phoneNumber)}
      </div>
      <div>
        <button onclick="editContact('${c._id}')">✏️</button>
        <button onclick="deleteContact('${c._id}')">🗑️</button>
      </div>
    </div>
  `
    )
    .join("");

  contactCount.textContent = `${filteredContacts.length} contacts`;
}

searchInput.addEventListener("input", applyFilters);
sortFilter.addEventListener("change", applyFilters);

window.editContact = (id) => {
  const contact = allContacts.find((c) => c._id === id);
  if (contact) openModal(contact);
};

window.deleteContact = async (id) => {
  if (!confirm("Delete contact?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadContacts();
};

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


loadContacts();
