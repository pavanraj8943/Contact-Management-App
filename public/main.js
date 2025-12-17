const addContactBtn = document.getElementById('addContactBtn');
const modal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const contactForm = document.getElementById('contactForm');
const contactsList = document.getElementById('contactsList');
const detailsSection = document.getElementById('detailsSection');
const contactCount = document.getElementById('contactCount');
const modalTitle = document.getElementById('modalTitle');
const submitBtnText = document.getElementById('submitBtnText');
const contactIdInput = document.getElementById('contactId');
const searchInput = document.getElementById('searchInput');

let contacts = [];
let selectedContactId = null;

async function loadContacts() {
  try {
    const res = await fetch('http://localhost:3000/api/contacts');
    contacts = await res.json();
    renderContacts();
  } catch {
    alert('Failed to load contacts');
  }
}

function openModal(contact) {
  if (contact) {
    modalTitle.textContent = 'Edit Contact';
    submitBtnText.textContent = 'Update Contact';
    contactIdInput.value = contact._id;
    contactForm.name.value = contact.name;
    contactForm.countryCode.value = contact.countryCode;
    contactForm.phoneNumber.value = contact.phoneNumber;
  } else {
    modalTitle.textContent = 'Add Contact';
    submitBtnText.textContent = 'Save Contact';
    contactForm.reset();
    contactIdInput.value = '';
  }
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  contactForm.reset();
}

addContactBtn.onclick = () => openModal();
closeModalBtn.onclick = cancelBtn.onclick = closeModal;

contactForm.onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    name: contactForm.name.value,
    countryCode: contactForm.countryCode.value,
    phoneNumber: contactForm.phoneNumber.value
  };

  const id = contactIdInput.value;
  const url = id
    ? `http://localhost:3000/api/contacts/${id}`
    : 'http://localhost:3000/api/contacts';

  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  await res.json();
  closeModal();
  loadContacts();
};

function renderContacts() {
  if (!contacts.length) {
    contactsList.innerHTML = '<p>No contacts</p>';
    contactCount.textContent = '0 contacts';
    return;
  }

  contactsList.innerHTML = contacts.map(c => `
    <div class="contact-card">
      <div>
        <strong>${escapeHtml(c.name)}</strong><br>
        ${escapeHtml(c.countryCode)} ${escapeHtml(c.phoneNumber)}
      </div>
      <div>
        <button onclick="editContact('${c._id}')">✏️</button>
        <button onclick="deleteContact('${c._id}')">🗑️</button>
      </div>
    </div>
  `).join('');

  contactCount.textContent = `${contacts.length} contacts`;
}

window.editContact = (id) => {
  const contact = contacts.find(c => c._id === id);
  if (contact) openModal(contact);
};

window.deleteContact = async (id) => {
  if (!confirm('Delete contact?')) return;
  await fetch(`http://localhost:3000/api/contacts/${id}`, { method: 'DELETE' });
  loadContacts();
};

searchInput.addEventListener('input', async (e) => {
  const q = e.target.value.trim();

  if (!q) {
    loadContacts();
    return;
  }

  const res = await fetch(
    `http://localhost:3000/api/contacts/search?q=${q}`
  );
  contacts = await res.json();
  renderContacts();
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadContacts();
