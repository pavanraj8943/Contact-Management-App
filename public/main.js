const addContactBtn = document.getElementById('addContactBtn');
const modal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const contactForm = document.getElementById('contactForm');
const contactsList = document.getElementById('contactsList');

function openModal() {
    modal.classList.remove('hidden');
    document.getElementById('name').focus();
}

function closeModal() {
    modal.classList.add('hidden');
    contactForm.reset();
}

addContactBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const countryCode = contactForm.countryCode.value.trim();
    const phoneNumber = contactForm.phoneNumber.value.trim();

    if (!name || !countryCode || !phoneNumber) {
        return;
    }

    addContact({ name, countryCode, phoneNumber });
    closeModal();
});

function addContact({ name, countryCode, phoneNumber }) {

    if (contactsList.classList.contains('empty-state')) {
        contactsList.classList.remove('empty-state');
        contactsList.innerHTML = '';
    }

    const card = document.createElement('div');
    card.className = 'contact-card';

    card.innerHTML = `
      <div class="contact-main">
        <div class="contact-name">${name}</div>
        <div class="contact-phone">${countryCode} ${phoneNumber}</div>
      </div>
    `;

    contactsList.appendChild(card);
}
