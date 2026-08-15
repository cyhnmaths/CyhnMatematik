// Modal Açma / Kapama Fonksiyonları
function openAuthModal(mode) {
  document.getElementById('auth-modal').classList.remove('hidden');
  switchAuthMode(mode);
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function switchAuthMode(mode) {
  const loginForm = document.getElementById('login-form-container');
  const registerForm = document.getElementById('register-form-container');

  if (mode === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}

// Giriş İşlemi (Simülasyon)
function handleAuth(event) {
  event.preventDefault(); // Sayfanın yenilenmesini engeller
  
  // Giriş yapıldı -> Landing Page ve Modal kapatılır, Dashboard açılır
  closeAuthModal();
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
}

// Çıkış İşlemi
function logout() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('landing-page').classList.remove('hidden');
}

// Sol Menüden Ders Seçme ve Embed PDF Yükleme
function selectCourse(element, courseTitle, driveId) {
  // Aktif menü sınıfını güncelle
  const listItems = document.querySelectorAll('.course-list li');
  listItems.forEach(item => item.classList.remove('active'));
  element.classList.add('active');

  // Başlığı güncelle
  document.getElementById('current-course-title').innerText = courseTitle;

  // Google Drive Embed URL Yapısı: https://drive.google.com/file/d/DRIVE_ID/preview
  const pdfFrame = document.getElementById('pdf-frame');
  pdfFrame.src = `https://drive.google.com/file/d/${driveId}/preview`;
}
