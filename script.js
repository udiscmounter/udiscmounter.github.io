// === Konfigurasi JSONBin ===
const BIN_ID = "690204c743b1c97be989c094";
const API_KEY = "$2a$10$/48DV797aHAEJOudN0f60eoAFBHm7uKbaaOY6Fl4toFflMvLj3IQG";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// === Fungsi format angka ribuan ===
function formatNumber(num) {
  return num.toLocaleString('id-ID'); // 2.567.896
}

// === Fungsi animasi angka (smooth counter) ===
function animateCount(element, start, end, duration = 800) {
  const range = end - start;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start + range * progress);
    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// === Fungsi menampilkan jumlah klik ===
async function getClickCount() {
  try {
    const res = await fetch(API_URL, {
      headers: { "X-Master-Key": API_KEY }
    });
    const data = await res.json();
    const count = data.record.linkClicks || 0;
    const countEl = document.getElementById("clickCount");

    const current = parseInt(countEl.textContent.replace(/\./g, "")) || 0;
    animateCount(countEl, current, count);
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

// === Fungsi menambah klik ===
async function incrementClick() {
  try {
    const el = document.getElementById("clickCount");
    const current = parseInt(el.textContent.replace(/\./g, "")) || 0;
    const newCount = current + 1;

    // Animasi ke nilai baru
    animateCount(el, current, newCount);

    // Simpan ke JSONBin
    await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify({ linkClicks: newCount })
    });
  } catch (err) {
    console.error("Gagal memperbarui data:", err);
  }
}

// === Jalankan saat halaman dimuat ===
window.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("myLink");
  if (link) link.addEventListener("click", incrementClick);
  getClickCount();
});
