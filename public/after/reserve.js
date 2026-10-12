// Demo only: validates the reservation form and shows a message. Nothing is sent anywhere.
const form = document.querySelector('#reserve');
const status = document.querySelector('#form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));

  const invalid = [...form.elements].filter((el) => el instanceof HTMLInputElement && !el.checkValidity());
  if (invalid.length) {
    invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    const names = invalid.map((el) => form.querySelector(`label[for="${el.id}"]`)?.textContent.replace(' *', ''));
    status.textContent = `Please check ${invalid.length} field(s): ${names.join(', ')}.`;
    invalid[0].focus();
    return;
  }
  status.textContent = 'Thank you! (Demo only: nothing was sent.)';
  form.reset();
});
