/**
 * Contact form behavior ([data-contact-form], see ContactForm.astro).
 *
 * - Validation: the browser's constraint checks (required, type, min/maxlength)
 *   with our localized messages instead of the browser bubbles.
 * - Submit: `actions.contact(formData)`. Success replaces the form with the
 *   thank-you message; field errors from the server reuse the same messages;
 *   anything else shows the general error (with the email address).
 */
import { actions, isInputError } from 'astro:actions';

function initForm(form: HTMLFormElement) {
  form.noValidate = true; // our messages instead of the browser bubbles

  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = submit.querySelector<HTMLElement>('[data-submit-label]')!;
  const idleLabel = submitLabel.textContent ?? '';
  const generalError = form.querySelector<HTMLElement>('[data-form-error]')!;
  const success = form.parentElement!.querySelector<HTMLElement>('[data-form-success]')!;
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]')].filter(
    (el) => el.type !== 'hidden' && form.querySelector(`[data-field-error="${el.name}"]`),
  );

  // ---------- Errors ----------

  function setFieldError(name: string, invalid: boolean) {
    const field = form.elements.namedItem(name);
    const message = form.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
    if (!(field instanceof HTMLElement) || !message) return;
    message.hidden = !invalid;
    if (invalid) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validate(): boolean {
    let firstInvalid: HTMLElement | undefined;
    for (const field of fields) {
      const valid = field.checkValidity();
      setFieldError(field.name, !valid);
      if (!valid) firstInvalid ??= field;
    }
    firstInvalid?.focus();
    return !firstInvalid;
  }

  // Clear a field's error as soon as it becomes valid.
  form.addEventListener('input', (event) => {
    const field = event.target as HTMLInputElement;
    if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) setFieldError(field.name, false);
  });
  form.addEventListener('change', (event) => {
    const field = event.target as HTMLInputElement;
    if (field.type === 'checkbox' && field.checked) setFieldError(field.name, false);
  });

  // ---------- Submit ----------

  let busy = false;
  function setBusy(value: boolean) {
    busy = value;
    submit.disabled = value;
    submitLabel.textContent = value ? (submit.dataset.busyLabel ?? idleLabel) : idleLabel;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    generalError.hidden = true;
    if (!validate()) return;

    setBusy(true);
    try {
      const { error } = await actions.contact(new FormData(form));
      if (!error) {
        form.hidden = true;
        success.hidden = false;
        success.focus();
        return;
      }
      if (isInputError(error)) {
        for (const name of Object.keys(error.fields)) setFieldError(name, true);
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      } else {
        generalError.hidden = false;
      }
    } catch {
      generalError.hidden = false;
    }
    setBusy(false);
  });
}

for (const form of document.querySelectorAll<HTMLFormElement>('[data-contact-form]')) initForm(form);
