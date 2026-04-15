const input = document.getElementById('imageInput');
const panel = document.getElementById('imagePanel');

input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  panel.innerHTML = `<img src="${url}" alt="Blog image" />`;
});
