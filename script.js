
const form = document.getElementById("formSiswa");
const daftar = document.getElementById("daftarSiswa");
const totalSiswa = document.getElementById("totalSiswa");
const rataKelas = document.getElementById("rataKelas");
const areaRapor = document.getElementById("areaRapor");
const isiRapor = document.getElementById("isiRapor");

let siswa = [];

try {
  const dataTersimpan = localStorage.getItem("raporkita");
  siswa = dataTersimpan ? JSON.parse(dataTersimpan) : [];

  if (!Array.isArray(siswa)) siswa = [];
} catch {
  siswa = [];
}

function simpanData() {
  localStorage.setItem("raporkita", JSON.stringify(siswa));
}

function buatElemen(tag, teks) {
  const elemen = document.createElement(tag);
  elemen.textContent = teks;
  return elemen;
}

function tampilkanSiswa() {
  daftar.replaceChildren();

  siswa.forEach((item, index) => {
    const baris = document.createElement("tr");

    const data = [
      item.nama,
      item.kelas,
      item.mapel,
      item.rata.toFixed(2)
    ];

    data.forEach(teks => {
      const kolom = document.createElement("td");
      kolom.textContent = teks;
      baris.appendChild(kolom);
    });

    const kolomAksi = document.createElement("td");
    const wadah = document.createElement("div");
    wadah.className = "aksi";

    const tombolLihat = buatElemen("button", "Lihat");
    tombolLihat.type = "button";
    tombolLihat.addEventListener("click", () => {
      tampilkanRapor(index);
    });

    const tombolHapus = buatElemen("button", "Hapus");
    tombolHapus.type = "button";
    tombolHapus.className = "hapus";
    tombolHapus.addEventListener("click", () => {
      if (confirm("Hapus data siswa ini?")) {
        siswa.splice(index, 1);
        simpanData();
        tampilkanSiswa();
        areaRapor.hidden = true;
      }
    });

    wadah.append(tombolLihat, tombolHapus);
    kolomAksi.appendChild(wadah);
    baris.appendChild(kolomAksi);
    daftar.appendChild(baris);
  });

  totalSiswa.textContent = siswa.length;

  const totalNilai = siswa.reduce(
    (jumlah, item) => jumlah + item.rata, 0
  );

  const rata = siswa.length
    ? totalNilai / siswa.length
    : 0;

  rataKelas.textContent = rata.toFixed(2);
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();
  const mapel = document.getElementById("mapel").value.trim();
  const catatan = document.getElementById("catatan").value.trim();

  const nilai1 = Number(document.getElementById("nilai1").value);
  const nilai2 = Number(document.getElementById("nilai2").value);
  const nilai3 = Number(document.getElementById("nilai3").value);

  if (!nama || !kelas || !mapel) {
    alert("Nama, kelas, dan mata pelajaran wajib diisi.");
    return;
  }

  const nilai = [nilai1, nilai2, nilai3];

  if (nilai.some(n => !Number.isFinite(n) || n < 0 || n > 100)) {
    alert("Setiap nilai harus berada di antara 0 dan 100.");
    return;
  }

  const rata = nilai.reduce((jumlah, n) => jumlah + n, 0)
    / nilai.length;

  siswa.push({
    id: crypto.randomUUID(),
    nama,
    kelas,
    mapel,
    nilai,
    rata,
    catatan
  });

  simpanData();
  tampilkanSiswa();
  form.reset();

  alert("Data berhasil disimpan di browser ini.");
});

function tampilkanRapor(index) {
  const item = siswa[index];
  if (!item) return;

  isiRapor.replaceChildren();

  isiRapor.appendChild(
    buatElemen("h2", "Rapor Digital Siswa")
  );

  isiRapor.appendChild(
    buatElemen("p", `Nama: ${item.nama}`)
  );

  isiRapor.appendChild(
    buatElemen("p", `Kelas: ${item.kelas}`)
  );

  isiRapor.appendChild(
    buatElemen("p", `Mata pelajaran: ${item.mapel}`)
  );

  const daftarNilai = document.createElement("ul");

  ["Nilai tugas", "Nilai ujian", "Nilai praktik"].forEach(
    (label, i) => {
      daftarNilai.appendChild(
        buatElemen("li", `${label}: ${item.nilai[i]}`)
      );
    }
  );

  isiRapor.appendChild(daftarNilai);

  isiRapor.appendChild(
    buatElemen("h3", `Rata-rata: ${item.rata.toFixed(2)}`)
  );

  isiRapor.appendChild(
    buatElemen("p", `Catatan guru: ${item.catatan || "-"}`)
  );

  areaRapor.hidden = false;
  areaRapor.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("tombolCetak")
  .addEventListener("click", () => window.print());

tampilkanSiswa();
