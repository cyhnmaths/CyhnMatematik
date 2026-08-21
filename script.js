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
    
    // Kullanıcı adını ekranda gösterme (varsa)
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
  const email = document.getElementById('regEmail').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const btn = document.getElementById('regBtn');

  btn.disabled = true;
  btn.innerText = 'Kaydediliyor...';

  try {
    // 1. Gerçek e-posta ile kayıt
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Kullanıcı adını profile kaydetme
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
    btn.disabled = false;
    btn.innerText = 'Hesap Oluştur';
  }
};

// 7. Giriş Yapma Fonksiyonu (E-posta ve Şifre)
window.handleLogin = async function(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');

  btn.disabled = true;
  btn.innerText = 'Giriş Yapılıyor...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Giriş hatası:", error);
    let msg = "Giriş yapılamadı!";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      msg = 'E-posta adresi veya şifre hatalı!';
    } else if (error.code === 'auth/invalid-email') {
      msg = 'Geçerli bir e-posta adresi giriniz!';
    }
    showAlert('loginAlert', msg, 'error');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Giriş Yap';
  }
};

// 8. Çıkış Yapma
window.logout = function() {
  signOut(auth);
};

// 9. Ders Seçimi ve PDF Gösterimi
window.selectCourse = function(element, courseTitle, driveId) {
  const listItems = document.querySelectorAll('.course-list li, .course-item');
  listItems.forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');

  const titleElem = document.getElementById('current-course-title') || document.getElementById('activeCourseTitle');
  if (titleElem) titleElem.innerText = courseTitle;

  const pdfFrame = document.getElementById('pdf-frame') || document.getElementById('pdfFrame');
  if (pdfFrame) {
    pdfFrame.src = `https://drive.google.com/file/d/${driveId}/preview`;
  }
};
