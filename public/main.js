document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api/contacts";
  const PAGE_LIMIT = 5;

  const addContactBtn = document.getElementById("addContactBtn");
  const modal = document.getElementById("contactModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("contactForm");

  const contactsList = document.getElementById("contactsList");
  const contactCount = document.getElementById("contactCount");
  const detailsSection = document.getElementById("detailsSection");

  const modalTitle = document.getElementById("modalTitle");
  const submitBtnText = document.getElementById("submitBtnText");

  const nameInput = document.getElementById("name");
  const countryCodeInput = document.getElementById("countryCode");
  const phoneInput = document.getElementById("phoneNumber");

  const searchInput = document.getElementById("searchInput");
  const sortFilter = document.getElementById("sortFilter");

  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const pageInfo = document.getElementById("pageInfo");

  let editingId = null;
  let allContacts = [];
  let filteredContacts = [];
  let currentPage = 1;

  countryCodeInput.addEventListener("input", () => {
    const digits = countryCodeInput.value.replace(/\D/g, "").slice(0, 3);
    countryCodeInput.value = digits ? `+${digits}` : "+";
  });

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
      countryCodeInput.value = "+";
      editingId = null;
    }
  }

  function closeModal() {
    modal.classList.add("hidden");
    form.reset();
    countryCodeInput.value = "+";
    editingId = null;
  }

  addContactBtn.onclick = () => openModal();
  closeModalBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const nameValue = nameInput.value.trim();
  
    if (nameValue.length < 4) {
      alert("Name must be at least 4 characters");
      return;
    }
  
    if (!/^\+\d{1,3}$/.test(countryCodeInput.value)) {
      alert("Enter country code like +91");
      return;
    }
  
    if (!/^[6-9]\d{9}$/.test(phoneInput.value)) {
      alert("Invalid phone number");
      return;
    }
  
    const nameValues = nameInput.value.trim().toLowerCase();

    const isDuplicate = filteredContacts.some(c =>
      c.name.trim().toLowerCase() === nameValues &&
      c._id !== editingId
    );
    
    if (isDuplicate) {
      alert("Contact name already exists");
      return;
    }
    
  
    const payload = {
      name: nameValue,
      countryCode: countryCodeInput.value,
      phoneNumber: phoneInput.value,
    };
  
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";
  
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      alert("Failed to save contact");
      return;
    }
  
    closeModal();
    loadContacts();
  });
  

  async function loadContacts() {
    const res = await fetch(API_URL);
    allContacts = await res.json();
    currentPage = 1;
    applyFilters();
  }

  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const sort = sortFilter.value;

    filteredContacts = allContacts.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.phoneNumber.includes(search)
    );

    filteredContacts.sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    renderPage();
  }

  searchInput.oninput = applyFilters;
  sortFilter.onchange = applyFilters;

  function renderPage() {
    const start = (currentPage - 1) * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    const pageData = filteredContacts.slice(start, end);

    renderContacts(pageData);

    const totalPages = Math.ceil(filteredContacts.length / PAGE_LIMIT) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevPageBtn.style.display = currentPage === 1 ? "none" : "inline-block";
    nextPageBtn.style.display = currentPage === totalPages ? "none" : "inline-block";
  }

  prevPageBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  };

  nextPageBtn.onclick = () => {
    const totalPages = Math.ceil(filteredContacts.length / PAGE_LIMIT);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
    }
  };

  function renderContacts(data) {
    if (!data.length) {
      contactsList.innerHTML = `<div class="empty-state"><p class="empty-title">No contacts found</p></div>`;
      contactCount.textContent = "0 contacts";
      return;
    }

    contactsList.innerHTML = data
      .map(
        (c) => `
      <div class="contact-card" onclick="showDetails('${c._id}')">
        <div class="contact-info">
          <div class="contact-name">${c.name}</div>
          <div class="contact-phone">${c.countryCode} ${c.phoneNumber}</div>
        </div>
        <div class="contact-actions">
          <button class="icon-btn btn-edit" onclick="event.stopPropagation(); editContact('${c._id}')">Edit</button>
          <button class="icon-btn btn-delete" onclick="event.stopPropagation(); deleteContact('${c._id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join("");

    contactCount.textContent = `${filteredContacts.length} contacts`;
  }

  window.showDetails = (id) => {
    const c = allContacts.find((x) => x._id === id);
    if (!c) return;

    detailsSection.innerHTML = `
      <div class="contact-details">
        <div class="details-header">
          <div class="details-avatar">${c.name.charAt(0).toUpperCase()}</div>
          <div class="details-name">${c.name}</div>
          <div class="details-phone-display">${c.countryCode} ${c.phoneNumber}</div>
        </div>
      </div>
    `;
  };

  window.editContact = (id) => {
    const c = allContacts.find(x => x._id === id);
    if (c) openModal(c);
  };

  window.deleteContact = async (id) => {
    if (!confirm("Delete contact?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadContacts();
  };

  loadContacts();
});
