const form = document.querySelector('#contact-form');
const successMessage = document.querySelector('#form-success');
const resetButton = document.querySelector('#reset-button');

const fieldRules = {
  fullName: {
    validate: (value) => value.trim().length >= 3,
    message: 'El nombre completo debe tener al menos 3 caracteres.'
  },
  company: {
    validate: (value) => value.trim().length >= 2,
    message: 'La empresa debe tener al menos 2 caracteres.'
  },
  role: {
    validate: (value) => value.trim().length >= 2,
    message: 'Indica tu cargo dentro de la empresa.'
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Introduce un email corporativo con formato válido.'
  },
  phone: {
    validate: (value) => value.replace(/\D/g, '').length >= 9,
    message: 'El teléfono debe contener al menos 9 dígitos.'
  },
  country: {
    validate: (value) => value.trim() !== '',
    message: 'Selecciona un país.'
  },
  industry: {
    validate: (value) => value.trim() !== '',
    message: 'Selecciona el sector de tu empresa.'
  },
  companySize: {
    validate: (value) => value.trim() !== '',
    message: 'Selecciona el tamaño de la empresa.'
  },
  service: {
    validate: (value) => value.trim() !== '',
    message: 'Selecciona el servicio requerido.'
  },
  headcount: {
    validate: (value) => Number(value) > 0,
    message: 'El número estimado debe ser mayor que 0.'
  },
  startDate: {
    validate: (value) => {
      if (!value) {
        return true;
      }

      const selectedDate = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate >= today;
    },
    message: 'La fecha estimada no puede ser anterior a hoy.'
  },
  message: {
    validate: (value) => value.trim().length >= 20,
    message: 'Describe la necesidad con al menos 20 caracteres.'
  },
  privacy: {
    validate: (_, field) => field.checked,
    message: 'Debes aceptar la política de privacidad para enviar la solicitud.'
  }
};

function getFieldErrorElement(fieldName) {
  return document.querySelector(`#${fieldName}-error`);
}

function setFieldState(field, isValid, message = '') {
  const errorElement = getFieldErrorElement(field.name);

  if (!errorElement) {
    return;
  }

  field.setAttribute('aria-invalid', String(!isValid));
  errorElement.textContent = message;

  field.classList.remove(
    'border-slate-300',
    'border-danger',
    'border-success',
    'ring-danger/10',
    'ring-success/10'
  );

  if (isValid) {
    if (field.type !== 'checkbox') {
      field.classList.add('border-success', 'ring-4', 'ring-success/10');
    }
  } else {
    if (field.type === 'checkbox') {
      field.classList.add('border-danger');
    } else {
      field.classList.add('border-danger', 'ring-4', 'ring-danger/10');
    }
  }

  if (!isValid && field.type !== 'checkbox') {
    field.classList.remove('border-success', 'ring-success/10');
  }
}

function validateField(field) {
  const rule = fieldRules[field.name];

  if (!rule) {
    return true;
  }

  const isValid = rule.validate(field.value, field);
  setFieldState(field, isValid, isValid ? '' : rule.message);
  return isValid;
}

function clearSuccessMessage() {
  successMessage.textContent = '';
  successMessage.classList.add('hidden');
}

function clearFieldState(field) {
  const errorElement = getFieldErrorElement(field.name);

  field.classList.remove(
    'border-danger',
    'border-success',
    'ring-4',
    'ring-danger/10',
    'ring-success/10'
  );

  if (field.type !== 'checkbox') {
    field.classList.add('border-slate-300');
  }

  field.removeAttribute('aria-invalid');

  if (errorElement) {
    errorElement.textContent = '';
  }
}

function validateForm() {
  const fields = Array.from(form.elements).filter((element) => element.name && fieldRules[element.name]);
  let allValid = true;

  fields.forEach((field) => {
    const isValid = validateField(field);
    if (!isValid) {
      allValid = false;
    }
  });

  return allValid;
}

if (form) {
  const fields = Array.from(form.elements).filter((element) => element.name && fieldRules[element.name]);

  fields.forEach((field) => {
    const eventName = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';

    field.addEventListener(eventName, () => {
      clearSuccessMessage();
      validateField(field);
    });

    field.addEventListener('blur', () => {
      clearSuccessMessage();
      validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    clearSuccessMessage();

    if (!validateForm()) {
      event.preventDefault();
      const firstInvalidField = fields.find((field) => field.getAttribute('aria-invalid') === 'true');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    event.preventDefault();
    successMessage.textContent = 'Solicitud enviada correctamente. El equipo de Nexova Solutions revisará tu caso y te contactará con una propuesta de siguiente paso.';
    successMessage.classList.remove('hidden');
    form.reset();
    fields.forEach((field) => clearFieldState(field));
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      clearSuccessMessage();
      fields.forEach((field) => clearFieldState(field));
    }, 0);
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    clearSuccessMessage();
  });
}