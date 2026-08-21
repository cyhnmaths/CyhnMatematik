// 1. Firebase Modüllerinin İçe Aktarılması
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Firebase Yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyA0lZFiA-HcJ0CiEgSVvqUaJu0g9xIK7CQ",
  authDomain: "cyhnportal.firebaseapp.com",
  projectId: "cyhnportal",
  storageBucket: "cyhnportal.firebasestorage.app",
  messagingSenderId: "77600127787",
  appId: "1:77600127787:web:a29478c4c5c264b1cbe36e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3. Modal ve Form Arayüz Yönetimi
window.openAuthModal = function(mode) {
  document.getElementById('auth-modal')?.classList.remove('hidden');
  window.switchAuthMode(mode);
};

window.closeAuthModal = function() {
  document.getElementById('auth-modal')?.classList.add('hidden');
  clearAlerts();
};

window.switchAuthMode = function(mode) {
  clearAlerts();
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (mode === 'login') {
    loginForm?.classList.remove('hidden');
    registerForm?.classList.add('hidden');
  } else {
    loginForm?.classList.add('hidden');
    registerForm?.classList.remove('hidden');
  }
};

window.switchForm = window.switchAuthMode;

// 4. Uyarı / Hata Kutusu Bildirimi
function showAlert(containerId, message, type) {
  const alertBox = document.getElementById(containerId);
  if (alertBox) {
    alertBox.innerText = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = 'block';
  }
}

function clearAlerts() {
  const loginAlert = document.getElementById('loginAlert');
  const registerAlert = document.getElementById('registerAlert');
  if (loginAlert) loginAlert.style.display = 'none';
  if (registerAlert) registerAlert.style.display = 'none';
}

// 5. Firebase Oturum Takibi
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.closeAuthModal();
    document.getElementById('landing-page')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');
    
    // Kullanıcı adını ekranda gösterme
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
      userDisplayName.innerText = `@${user.displayName || user.email.split('@')[0]}`;
    }
  } else {
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('landing-page')?.classList.remove('hidden');
  }
});

// 6. Kayıt Olma Fonksiyonu (E-posta, Kullanıcı Adı ve Şifre)
window.handleRegister = async function(event) {
  event.preventDefault();
  const email = document.getElementById('regEmail')?.value.trim();
  const username = document.getElementById('regUsername')?.value.trim();
  const password = document.getElementById('regPassword')?.value;
  const btn = document.getElementById('regBtn');

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Kaydediliyor...';
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    showAlert('registerAlert', 'Kayıt başarılı! Yönlendiriliyorsunuz...', 'success');
  } catch (error) {
    console.error("Kayıt hatası:", error);
    let msg = "Kayıt sırasında bir hata oluştu!";
    if (error.code === 'auth/email-already-in-use') msg = 'Bu e-posta adresi zaten kullanımda!';
    else if (error.code === 'auth/invalid-email') msg = 'Geçersiz bir e-posta adresi girdiniz!';
    else if (error.code === 'auth/weak-password') msg = 'Şifre en az 6 karakter olmalıdır!';
    showAlert('registerAlert', msg, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Hesap Oluştur';
    }
  }
};

// 7. Giriş Yapma Fonksiyonu (E-posta ile Giriş)
window.handleLogin = async function(event) {
  event.preventDefault();
  const loginInput = (document.getElementById('loginEmail') || document.getElementById('loginIdentifier'))?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  const btn = document.getElementById('loginBtn');

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Giriş Yapılıyor...';
  }

  try {
    await signInWithEmailAndPassword(auth, loginInput, password);
  } catch (error) {
    console.error("Giriş hatası:", error);
    let msg = "Giriş yapılamadı!";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      msg = 'Giriş bilgileri veya şifre hatalı!';
    } else if (error.code === 'auth/invalid-email') {
      msg = 'Geçersiz e-posta biçimi!';
    }
    showAlert('loginAlert', msg, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Giriş Yap';
    }
  }
};

// 8. Çıkış Yapma
window.logout = function() {
  signOut(auth);
};

// 9. Arayüz ve Navigasyon Fonksiyonları
window.showWelcomeView = function() {
  document.getElementById('welcomeView')?.classList.remove('hidden');
  document.getElementById('pdfContainer')?.classList.add('hidden');
  document.getElementById('backToHomeBtn')?.classList.add('hidden');
  document.getElementById('fullscreenBtn')?.classList.add('hidden');
  const activeTitle = document.getElementById('activeCourseTitle') || document.getElementById('current-course-title');
  if (activeTitle) activeTitle.innerText = "Ana Panel";
  document.querySelectorAll('.course-item, .course-list li').forEach(el => el.classList.remove('active'));
};

window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('hidden');
};

// 10. Ders Yükleme ve PDF İşlemleri
window.loadCourse = function(element, title, driveId) {
  document.querySelectorAll('.course-item, .course-list li').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');

  document.getElementById('welcomeView')?.classList.add('hidden');
  document.getElementById('pdfContainer')?.classList.remove('hidden');
  document.getElementById('backToHomeBtn')?.classList.remove('hidden');
  document.getElementById('fullscreenBtn')?.classList.remove('hidden');

  const activeTitle = document.getElementById('activeCourseTitle') || document.getElementById('current-course-title');
  if (activeTitle) activeTitle.innerText = title;

  const loader = document.getElementById('pdfLoader');
  if (loader) {
    loader.style.opacity = '1';
    loader.classList.remove('hidden');
  }

  const pdfFrame = document.getElementById('pdfFrame') || document.getElementById('pdf-frame');
  if (pdfFrame) {
    pdfFrame.src = `https://drive.google.com/file/d/${driveId}/preview`;
  }

  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768 && sidebar?.classList.contains('open')) {
    window.toggleSidebar();
  }
};

window.selectCourse = window.loadCourse;

window.selectCourseFromIndex = function(index) {
  const items = document.querySelectorAll('.course-item, #courseList .course-item');
  if (items[index]) {
    items[index].click();
  }
};

window.hideLoader = function() {
  const loader = document.getElementById('pdfLoader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.classList.add('hidden'), 300);
  }
};

window.filterCourses = function() {
  const query = document.getElementById('courseSearch')?.value.toLowerCase() || '';
  const items = document.querySelectorAll('.course-item, #courseList .course-item');

  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(query) ? 'flex' : 'none';
  });
};

window.toggleFullscreen = function() {
  const wrapper = document.getElementById('iframeWrapper') || document.getElementById('pdfContainer');
  if (!document.fullscreenElement) {
    wrapper?.requestFullscreen().catch(() => alert("Tam ekran modu başlatılamadı."));
  } else {
    document.exitFullscreen();
  }
};

// 11. Sayfa Güvenlik Önlemleri
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
  if (
    event.key === 'F12' || 
    (event.ctrlKey && (event.key === 'u' || event.key === 's' || event.key === 'p'))
  ) {
    event.preventDefault();
  }
});
