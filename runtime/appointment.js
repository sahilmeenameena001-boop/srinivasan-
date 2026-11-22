(() => {
  document.querySelectorAll('.chambers-mobile-menu').forEach((menu) => {
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) menu.open = false;
    });
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  });

  const container = document.getElementById('appointment');
  if (!container) return;

  const panel = container.querySelector('.chambers-appointment');
  const form = panel.querySelector('form');
  const dialog = document.querySelector('.chambers-appointment-dialog');
  const close = panel.querySelector('.chambers-appointment-close');
  const status = form.querySelector('[role="status"]');
  let trigger;

  const today = new Date();
  const date = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  form.elements.date.min = date.toISOString().slice(0, 10);

  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-open-appointment]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        trigger = link.closest('details')?.querySelector('summary') || link;
        dialog.append(panel);
        dialog.showModal();
      });
    });

    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      container.append(panel);
      trigger?.focus();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const request = [
      'Appointment request draft',
      'Chambers of Adhitya Srinivasan',
      '',
      'Name: ' + data.get('name'),
      'Mobile: ' + data.get('phone'),
      'Email: ' + data.get('email'),
      'Matter type: ' + data.get('matter'),
      'Preferred date: ' + data.get('date'),
      'Preferred time: ' + data.get('time'),
      'Description: ' + (data.get('description') || ''),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([request], { type: 'text/plain;charset=utf-8' }));
    const download = document.createElement('a');
    download.href = url;
    download.download = 'appointment-request.txt';
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Appointment request draft downloaded. It has not been sent.';
  });
})();
