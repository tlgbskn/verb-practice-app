# Android Telefona Kurulum Rehberi

Bu uygulama artık **PWA (Progressive Web App)** olarak hazır! Android telefonunuza normal bir uygulama gibi kurabilirsiniz.

## 📱 Android'e Kurulum Adımları

### Yöntem 1: Chrome ile (Önerilen)

1. **Uygulamayı tarayıcıda açın**
   - Chrome tarayıcınızda uygulamanın web adresine gidin
   - Örnek: `https://your-app-url.com`

2. **Kurulum bildirimi**
   - Ekranın alt kısmında "Install App" (Uygulamayı Kur) bildirimi görünecek
   - "Install Now" butonuna tıklayın

3. **Manuel kurulum**
   - Eğer bildirim çıkmazsa, sağ üst köşedeki menüden (⋮)
   - "Ana ekrana ekle" veya "Install app" seçeneğini tıklayın

4. **Kurulum tamamlandı!**
   - Uygulama ana ekranınıza eklenecek
   - Normal bir uygulama gibi açabilirsiniz
   - İnternet olmadan da çalışır (offline destek)

### Yöntem 2: Diğer Tarayıcılar

**Samsung Internet:**
- Menü > "Ana ekrana ekle" seçeneğini kullanın

**Firefox:**
- Menü > "Sayfa" > "Ana ekrana ekle"

**Edge:**
- Menü > "Ana ekrana ekle"

## ✨ PWA Özellikleri

- 🚀 **Hızlı**: Normal uygulamalar kadar hızlı
- 📵 **Offline çalışır**: İnternet olmadan da kullanabilirsiniz
- 💾 **Az yer kaplar**: Sadece birkaç MB
- 🔔 **Ana ekranda**: Normal uygulama gibi
- 🔄 **Otomatik güncelleme**: Her açtığınızda güncel versiyon
- 🎨 **Tam ekran**: Tarayıcı barları olmadan çalışır

## 🎯 Özellikler

1. **Learn Mode (Öğrenme Modu)**
   - Flashcard'lar ile öğrenme
   - Tekrarlı öğrenme sistemi
   - Bildiğim/Bilmiyorum işaretleme

2. **Dashboard (İstatistikler)**
   - İlerlemenizi takip edin
   - Öğrenme istatistikleri
   - Hangi fiiller tekrar edilmeli

3. **Offline Çalışma**
   - İnternet olmadan da kullanın
   - Verileriniz telefonunuzda saklanır
   - Her zaman erişilebilir

## 🔧 Teknik Detaylar

### PWA Gereksinimleri
- Android 5.0 veya üzeri
- Chrome, Edge, Samsung Internet, veya Firefox
- HTTPS bağlantısı (production için)

### Depolama
- Veriler localStorage'da saklanır
- Uygulama cache'i: ~2-5 MB
- Kullanıcı verileri: birkaç KB

## ❓ Sık Sorulan Sorular

**S: Google Play Store'da var mı?**
C: Hayır, bu bir PWA. Tarayıcıdan direkt kurulur, Store'a gerek yok.

**S: Verilerim kaybolur mu?**
C: Hayır, tüm veriler telefonunuzda saklanır. Uygulama silinmedikçe kalır.

**S: Güncelleme nasıl olur?**
C: Otomatik! Uygulamayı her açtığınızda son versiyon kontrol edilir.

**S: Kaldırmak istesem?**
C: Normal uygulama gibi ana ekrandan silebilirsiniz.

**S: İnternet olmadan çalışır mı?**
C: Evet! Bir kez yüklendikten sonra offline da çalışır.

## 📝 Test Etmek İçin

1. Uygulamayı bir hosting servise deploy edin:
   - Vercel (ücretsiz)
   - Netlify (ücretsiz)
   - Firebase Hosting (ücretsiz)
   - GitHub Pages (ücretsiz)

2. HTTPS URL'i alın

3. Android telefonunuzdan bu URL'e gidin

4. "Install App" butonuna tıklayın

## 🚀 Deployment

### Vercel ile Deploy (Önerilen)

```bash
npm install -g vercel
vercel login
vercel
```

### Netlify ile Deploy

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

Her iki serviste de PWA özellikler otomatik çalışacaktır!

## 💡 İpuçları

1. **İlk kurulumda**:
   - Uygulamayı açtıktan sonra biraz bekleyin
   - Service worker aktif olsun
   - Sonra offline test edin

2. **Sorun yaşarsanız**:
   - Tarayıcı cache'ini temizleyin
   - Uygulamayı silin ve yeniden kurun
   - Chrome DevTools > Application > Service Workers kontrol edin

3. **En iyi deneyim için**:
   - Chrome veya Samsung Internet kullanın
   - Android 8.0 veya üzeri
   - Güncelleme için uygulamayı kapatıp açın

---

**Hazır!** Artık uygulamanız Android telefonunuzda çalışıyor! 🎉
