# 🏥 Sağlık Hep - Yönetim Paneli

Modern ve kullanıcı dostu sağlık platformu yönetim paneli. Next.js, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

### 📊 Ana Dashboard
- Kullanıcı ve uzman istatistikleri
- Bu hafta ve bu ay metrikleri
- Dikkat gereken durumlar (onay bekleyen uzmanlar, moderasyon bekleyen içerik)
- Son aktiviteler feed'i
- Hızlı işlem menüsü

### 👥 Kullanıcı Yönetimi
- **Normal Kullanıcılar**: Listeleme, filtreleme, engelleme/aktif yapma
- **Uzmanlar**: Uzmanlık alanları, deneyim, puanlama, konsültasyon sayıları
- **Uzman Başvuruları**: Sertifika doğrulama, onay/red işlemleri

### 📝 İçerik Moderasyonu
- **Paylaşımlar**: Kullanıcı makalelerini onaylama/reddetme
- **Sorular**: Uzman ataması, önceliklendirme, süre takibi
- **Yorumlar**: Moderasyon ve spam kontrolü
- **Raporlar**: Kullanıcı şikayetlerini inceleme

### 🎯 Etkinlik Yönetimi
- Online, offline ve hibrit etkinlikler
- Katılımcı yönetimi
- Etkinlik türleri (seminer, atölye, konsültasyon)

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date**: date-fns
- **UI Components**: Custom components

## 📦 Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

3. **Tarayıcınızda açın:**
   ```
   https://api.saglikhep.com
   ```

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── users/             # Kullanıcı yönetimi
│   ├── content/           # İçerik moderasyonu
│   ├── events/            # Etkinlik yönetimi
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard specific
│   ├── users/           # User management
│   └── content/         # Content moderation
├── types/               # TypeScript type definitions
└── globals.css         # Global styles
```

## 📱 Sayfa Yapısı

### 1. Dashboard (`/`)
- Genel istatistikler ve KPI'lar
- Son aktiviteler
- Hızlı işlem menüsü
- Dikkat gereken durumlar

### 2. Kullanıcı Yönetimi
- `/users` - Normal kullanıcılar
- `/users/experts` - Uzmanlar
- `/users/expert-applications` - Uzman başvuruları

### 3. İçerik Moderasyonu
- `/content/posts` - Paylaşımlar
- `/content/questions` - Sorular
- `/content/comments` - Yorumlar
- `/content/reports` - Raporlar

### 4. Etkinlik Yönetimi
- `/events` - Etkinlik listesi ve yönetimi

## 🎨 UI/UX Özellikleri

- **Responsive Design**: Mobil, tablet ve masaüstü uyumlu
- **Dark/Light Mode**: Kullanıcı tercihi (gelecekte eklenecek)
- **Accessibility**: WCAG uyumlu
- **Modern Interface**: Clean ve minimalist tasarım
- **Fast Performance**: Optimized loading times

## 🔧 Özelleştirme

### Renkler
Tailwind config dosyasında özel renkler tanımlı:
- `primary`: Mavi tonları
- `health`: Yeşil tonları

### Bileşenler
Tüm bileşenler modüler ve yeniden kullanılabilir şekilde tasarlanmıştır.

## 📊 Veri Yönetimi

Şu anda mock data kullanılmaktadır. Gerçek projede:
- API entegrasyonu
- Database bağlantısı
- Authentication sistemi
- Real-time notifications

## 🚦 Gelecek Özellikler

- [ ] API entegrasyonu
- [ ] Authentication sistemi
- [ ] Real-time bildirimler
- [ ] Detaylı raporlama
- [ ] E-posta bildirimleri
- [ ] Çoklu dil desteği
- [ ] Dark mode
- [ ] Gelişmiş filtreleme
- [ ] Bulk işlemler

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için [GitHub Issues](https://github.com/your-username/sagligim-panel/issues) kullanabilirsiniz.
