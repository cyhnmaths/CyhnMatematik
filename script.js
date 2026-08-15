<script type="module">
// 1. Firebase Modüllerinin İçe Aktarılması
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase Ayarlarınız (Proje bilgilerinizi buraya ekleyin)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. Modal Açma / Kapama ve Form Değiştirme Fonksiyonları
window.openAuthModal = function(mode) {
  document.getElementById('auth-modal').classList.remove('hidden');
  window.switchAuthMode(mode);
};

window.closeAuthModal = function() {
  document.getElementById('auth-modal').classList.add('hidden');
};

window.switchAuthMode = function(mode) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (mode === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
};

// 3. Hata / Bilgi Mesajı Gösterme Yardımcısı
function showAlert(containerId, message, type) {
  const alertBox = document.getElementById(containerId);
  if (alertBox) {
    alertBox.innerText = message;
    alertBox.className = `alert-box ${type}`;
    alertBox.style.display = 'block';
  }
}

// 4. Gerçek Firebase Oturum Takibi (Sayfa Yenilendiğinde Oturumu Korur)
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.closeAuthModal();
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
  } else {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
  }
});

// 5. Kayıt İşlemi (E-posta, Kullanıcı Adı, Şifre)
window.handleRegister = async function(event) {
  event.preventDefault();
  const email = document.getElementById('regEmail').value;
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  const btn = document.getElementById('regBtn');

  btn.disabled = true;
  btn.innerText = 'Kaydediliyor...';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
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

// 6. Giriş İşlemi (E-posta ve Şifre)
window.handleLogin = async function(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
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

// 7. Şifre Sıfırlama (Mail Gönderme)
window.triggerForgotPassword = async function() {
  const email = prompt("Şifre sıfırlama bağlantısı gönderilecek E-posta adresinizi girin:");
  if (!email) return;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu ve spam klasörünü kontrol edin.");
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    if (error.code === 'auth/user-not-found') {
      alert("Bu e-posta adresine ait bir hesap bulunamadı!");
    } else {
      alert("Mail gönderilirken hata oluştu: " + error.message);
    }
  }
};

// 8. Çıkış İşlemi
window.logout = function() {
  signOut(auth);
};

// 9. Sol Menüden Ders Seçme ve Embed PDF Yükleme
window.selectCourse = function(element, courseTitle, driveId) {
  const listItems = document.querySelectorAll('.course-list li');
  listItems.forEach(item => item.classList.remove('active'));
  element.classList.add('active');

  document.getElementById('current-course-title').innerText = courseTitle;

  const pdfFrame = document.getElementById('pdf-frame');
  pdfFrame.src = `https://drive.google.com/file/d/${driveId}/preview`;
};
</script>
