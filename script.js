// Inisialisasi Canvas
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

// Mengatur ukuran canvas agar sesuai dengan jendela browser
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array untuk menyimpan semua partikel
let particles = [];
// Array untuk menyimpan titik-titik sudut bintang
const starPoints = [];

// Pengaturan Bintang
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const outerRadius = Math.min(canvas.width, canvas.height) * 0.4;
const innerRadius = outerRadius * 0.4;
const numPoints = 5; // Jumlah sudut pada bintang

// Menghitung posisi setiap titik sudut bintang (luar dan dalam)
for (let i = 0; i < numPoints * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    // Sudut dihitung agar bintang berdiri tegak
    const angle = (Math.PI / numPoints) * i - Math.PI / 2; 
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    starPoints.push({ x, y });
}

// Variabel untuk melacak pergerakan partikel di sepanjang garis bintang
let currentSegment = 0;
let progress = 0;
const speed = 0.01; // Kecepatan pergerakan 'pensil' partikel

// Palet warna gradien biru untuk partikel
const blueColors = ['#FFFFFF', '#87CEFA', '#1E90FF', '#00BFFF'];

// Class untuk merepresentasikan satu partikel
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.5 + 1;
        this.life = 1; // Durasi hidup partikel (1 = 100%)
        // Kecepatan acak untuk efek 'meledak'
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        // Pilih warna acak dari palet
        this.color = blueColors[Math.floor(Math.random() * blueColors.length)];
    }

    // Memperbarui posisi dan durasi hidup partikel
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02; // Partikel akan memudar perlahan
    }

    // Menggambar partikel di canvas
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life); // Gunakan durasi hidup sebagai transparansi
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Fungsi untuk menggambar garis bintang neon utama
function drawNeonStar() {
    ctx.save();
    
    // Membuat gradien linear untuk garis
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00BFFF'); // Deep Sky Blue
    gradient.addColorStop(0.5, '#1E90FF'); // Dodger Blue
    gradient.addColorStop(1, '#87CEFA'); // Light Sky Blue

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    // Efek cahaya (glow)
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(starPoints[0].x, starPoints[0].y);
    for (let i = 1; i < starPoints.length; i++) {
        ctx.lineTo(starPoints[i].x, starPoints[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

// Fungsi utama untuk loop animasi
function animate() {
    // Memberi efek jejak (trail) dengan menggambar kotak semi-transparan setiap frame
    ctx.fillStyle = 'rgba(0, 5, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar garis bintang neon di latar belakang
    drawNeonStar();

    // Tentukan titik awal dan akhir dari segmen garis saat ini
    const startPoint = starPoints[currentSegment];
    const endPoint = starPoints[(currentSegment + 1) % starPoints.length];

    // Hitung posisi 'pensil' partikel saat ini berdasarkan progress
    const currentX = startPoint.x + (endPoint.x - startPoint.x) * progress;
    const currentY = startPoint.y + (endPoint.y - startPoint.y) * progress;

    // Ciptakan beberapa partikel baru di posisi 'pensil'
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(currentX, currentY));
    }

    // Update dan gambar semua partikel yang ada
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        // Hapus partikel jika sudah 'mati' (life <= 0)
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Gerakkan 'pensil' di sepanjang garis
    progress += speed;

    // Jika 'pensil' sudah mencapai akhir segmen garis
    if (progress >= 1) {
        progress = 0; // Reset progress
        currentSegment = (currentSegment + 1) % starPoints.length; // Pindah ke segmen berikutnya
    }
    
    // Meminta browser untuk menjalankan fungsi animate() lagi di frame berikutnya
    requestAnimationFrame(animate);
}

// Menangani jika ukuran jendela browser diubah
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Perlu menghitung ulang posisi bintang jika ukuran berubah (opsional, untuk kesederhanaan kita abaikan)
});

// Mulai animasi!
animate();