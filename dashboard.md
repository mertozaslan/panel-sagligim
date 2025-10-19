# 📊 Dashboard İstatistik API Dokümantasyonu

Bu dokümantasyon, admin paneli için oluşturulan kapsamlı dashboard istatistik API'sini açıklar.

## 🎯 Genel Bakış

Dashboard API'si, admin panelinin ana sayfasında kullanılmak üzere tek bir endpoint ile tüm istatistiksel verileri sağlar. Bu API, sadece sayısal veriler değil, populate edilmiş detaylı bilgileri de içerir.

## 🔐 Yetkilendirme

- **Gerekli:** Admin yetkisi
- **Authentication:** JWT Token
- **Endpoint:** `GET /api/admin/dashboard`

## 📋 API Endpoint

### Dashboard İstatistikleri

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_jwt_token>
```

## 📊 Response Yapısı

### Başarılı Yanıt (200)

```json
{
  "success": true,
  "data": {
    "general": {
      "totalUsers": 1250,
      "totalPosts": 3400,
      "totalBlogs": 890,
      "totalEvents": 156,
      "totalComments": 8900,
      "totalDiseases": 45
    },
    "users": {
      "activeUsers": 1200,
      "verifiedUsers": 1100,
      "doctors": 85,
      "patients": 1150,
      "admins": 15
    },
    "recent": {
      "newUsers": 45,
      "newPosts": 120,
      "newBlogs": 25,
      "newEvents": 8,
      "newComments": 340
    },
    "topContent": {
      "topLikedPosts": [
        {
          "_id": "post_id",
          "title": "Diyabet Hakkında Bilmeniz Gerekenler",
          "content": "Diyabet...",
          "category": "diabetes",
          "likes": ["user1", "user2", "user3"],
          "views": 1250,
          "createdAt": "2024-01-15T10:30:00.000Z",
          "author": {
            "_id": "author_id",
            "username": "dr_ahmet",
            "firstName": "Ahmet",
            "lastName": "Yılmaz",
            "role": "doctor"
          }
        }
      ],
      "topViewedPosts": [
        {
          "_id": "post_id",
          "title": "Kalp Sağlığı İpuçları",
          "content": "Kalp sağlığı...",
          "category": "heart-disease",
          "likes": ["user1", "user2"],
          "views": 2100,
          "createdAt": "2024-01-14T09:15:00.000Z",
          "author": {
            "_id": "author_id",
            "username": "hasta_mehmet",
            "firstName": "Mehmet",
            "lastName": "Kaya",
            "role": "patient"
          }
        }
      ],
      "topLikedBlogs": [
        {
          "_id": "blog_id",
          "title": "Sağlıklı Beslenme Rehberi",
          "content": "Sağlıklı beslenme...",
          "category": "nutrition",
          "likes": ["user1", "user2", "user3", "user4"],
          "views": 1800,
          "createdAt": "2024-01-13T14:20:00.000Z",
          "author": {
            "_id": "author_id",
            "username": "dietisyen_ayse",
            "firstName": "Ayşe",
            "lastName": "Demir",
            "role": "doctor"
          }
        }
      ],
      "topViewedBlogs": [
        {
          "_id": "blog_id",
          "title": "Kanser Erken Teşhis Yöntemleri",
          "content": "Kanser erken teşhis...",
          "category": "cancer",
          "likes": ["user1", "user2"],
          "views": 3200,
          "createdAt": "2024-01-12T11:45:00.000Z",
          "author": {
            "_id": "author_id",
            "username": "onkolog_dr",
            "firstName": "Dr. Fatma",
            "lastName": "Özkan",
            "role": "doctor"
          }
        }
      ],
      "topLikedComments": [
        {
          "_id": "comment_id",
          "content": "Çok faydalı bir paylaşım, teşekkürler!",
          "postType": "Post",
          "likes": ["user1", "user2", "user3"],
          "createdAt": "2024-01-15T16:30:00.000Z",
          "author": {
            "_id": "author_id",
            "username": "hasta_ali",
            "firstName": "Ali",
            "lastName": "Veli",
            "role": "patient"
          },
          "postOrBlog": {
            "_id": "post_id",
            "title": "Diyabet Hakkında Bilmeniz Gerekenler"
          }
        }
      ],
      "topEvents": [
        {
          "_id": "event_id",
          "title": "Sağlıklı Yaşam Semineri",
          "description": "Sağlıklı yaşam hakkında...",
          "category": "Beslenme",
          "currentParticipants": 45,
          "maxParticipants": 50,
          "date": "2024-02-15T10:00:00.000Z",
          "location": "İstanbul Tıp Fakültesi",
          "organizer": "İstanbul Üniversitesi",
          "authorId": {
            "_id": "author_id",
            "username": "organizator_uni",
            "firstName": "Prof. Dr. Mehmet",
            "lastName": "Ak",
            "role": "doctor"
          }
        }
      ]
    },
    "topUsers": {
      "topPosters": [
        {
          "userId": "user_id",
          "username": "aktif_hasta",
          "firstName": "Zeynep",
          "lastName": "Kara",
          "role": "patient",
          "profilePicture": "/uploads/profile.jpg",
          "postCount": 25,
          "totalLikes": 180,
          "totalViews": 2500
        }
      ],
      "topBloggers": [
        {
          "userId": "user_id",
          "username": "doktor_blogger",
          "firstName": "Dr. Can",
          "lastName": "Yılmaz",
          "role": "doctor",
          "profilePicture": "/uploads/doctor.jpg",
          "blogCount": 12,
          "totalLikes": 95,
          "totalViews": 1800
        }
      ],
      "topCommenters": [
        {
          "userId": "user_id",
          "username": "yorumcu_ali",
          "firstName": "Ali",
          "lastName": "Şen",
          "role": "patient",
          "profilePicture": "/uploads/ali.jpg",
          "commentCount": 45,
          "totalLikes": 120
        }
      ],
      "topEventParticipants": [
        {
          "userId": "user_id",
          "username": "etkinlik_sever",
          "firstName": "Ayşe",
          "lastName": "Kaya",
          "role": "patient",
          "profilePicture": "/uploads/ayse.jpg",
          "eventCount": 8
        }
      ]
    },
    "recentUsers": [
      {
        "_id": "user_id",
        "username": "yeni_kullanici",
        "firstName": "Yeni",
        "lastName": "Kullanıcı",
        "role": "patient",
        "profilePicture": "/uploads/new_user.jpg",
        "createdAt": "2024-01-15T20:30:00.000Z",
        "isActive": true,
        "isVerified": false
      }
    ],
    "categories": {
      "postCategories": [
        {
          "_id": "diabetes",
          "count": 450,
          "totalLikes": 1200,
          "totalViews": 15000
        },
        {
          "_id": "heart-disease",
          "count": 380,
          "totalLikes": 980,
          "totalViews": 12000
        }
      ],
      "blogCategories": [
        {
          "_id": "medical-advice",
          "count": 120,
          "totalLikes": 450,
          "totalViews": 8000
        },
        {
          "_id": "health-tips",
          "count": 95,
          "totalLikes": 320,
          "totalViews": 6000
        }
      ],
      "eventCategories": [
        {
          "_id": "Beslenme",
          "count": 45,
          "totalParticipants": 320
        },
        {
          "_id": "Yoga",
          "count": 38,
          "totalParticipants": 280
        }
      ]
    },
    "interactions": {
      "totalPostLikes": 15000,
      "totalBlogLikes": 8500,
      "totalCommentLikes": 12000,
      "totalPostViews": 250000,
      "totalBlogViews": 180000
    },
    "recentActivity": {
      "newUsers": 12,
      "newPosts": 35,
      "newBlogs": 8,
      "newEvents": 3,
      "newComments": 95
    }
  }
}
```

### Hata Yanıtı (500)

```json
{
  "success": false,
  "message": "İstatistikler alınırken hata oluştu",
  "error": "Hata detayları"
}
```

## 📊 Veri Açıklamaları

### General (Genel İstatistikler)
- **totalUsers**: Toplam kullanıcı sayısı
- **totalPosts**: Toplam post sayısı
- **totalBlogs**: Toplam blog sayısı
- **totalEvents**: Toplam etkinlik sayısı
- **totalComments**: Toplam yorum sayısı
- **totalDiseases**: Aktif hastalık sayısı

### Users (Kullanıcı İstatistikleri)
- **activeUsers**: Aktif kullanıcı sayısı
- **verifiedUsers**: Doğrulanmış kullanıcı sayısı
- **doctors**: Doktor sayısı
- **patients**: Hasta sayısı
- **admins**: Admin sayısı

### Recent (Son 7 Gün)
- **newUsers**: Son 7 günde kayıt olan kullanıcı sayısı
- **newPosts**: Son 7 günde oluşturulan post sayısı
- **newBlogs**: Son 7 günde oluşturulan blog sayısı
- **newEvents**: Son 7 günde oluşturulan etkinlik sayısı
- **newComments**: Son 7 günde yazılan yorum sayısı

### Top Content (En Popüler İçerikler)
- **topLikedPosts**: En çok beğenilen 5 post (author bilgileri ile)
- **topViewedPosts**: En çok görüntülenen 5 post (author bilgileri ile)
- **topLikedBlogs**: En çok beğenilen 5 blog (author bilgileri ile)
- **topViewedBlogs**: En çok görüntülenen 5 blog (author bilgileri ile)
- **topLikedComments**: En çok beğenilen 5 yorum (author ve post/blog bilgileri ile)
- **topEvents**: En popüler 5 etkinlik (author bilgileri ile)

### Top Users (En Aktif Kullanıcılar)
- **topPosters**: En çok post atan 5 kullanıcı (profil resmi, rol, istatistikler ile)
- **topBloggers**: En çok blog oluşturan 5 kullanıcı (profil resmi, rol, istatistikler ile)
- **topCommenters**: En çok yorum yapan 5 kullanıcı (profil resmi, rol, istatistikler ile)
- **topEventParticipants**: En çok etkinliğe katılan 5 kullanıcı (profil resmi, rol, istatistikler ile)

### Recent Users (Son Kayıt Olan Kullanıcılar)
Son 10 kullanıcı - profil resmi, rol, durum bilgileri ile

### Categories (Kategori İstatistikleri)
- **postCategories**: Post kategorileri (diabetes, heart-disease, cancer, vb.)
- **blogCategories**: Blog kategorileri (medical-advice, health-tips, vb.)
- **eventCategories**: Etkinlik kategorileri (Meditasyon, Yoga, Beslenme, vb.)

### Interactions (Toplam Etkileşimler)
- **totalPostLikes**: Toplam post beğenileri
- **totalBlogLikes**: Toplam blog beğenileri
- **totalCommentLikes**: Toplam yorum beğenileri
- **totalPostViews**: Toplam post görüntülenmeleri
- **totalBlogViews**: Toplam blog görüntülenmeleri

### Recent Activity (Son 24 Saat)
- **newUsers**: Son 24 saatte kayıt olan kullanıcı sayısı
- **newPosts**: Son 24 saatte oluşturulan post sayısı
- **newBlogs**: Son 24 saatte oluşturulan blog sayısı
- **newEvents**: Son 24 saatte oluşturulan etkinlik sayısı
- **newComments**: Son 24 saatte yazılan yorum sayısı

## 🎯 Kullanım Senaryoları

### Admin Panel Dashboard
```javascript
// Dashboard kartları için
const { general, users, recent } = response.data;

// En popüler içerikler için
const { topContent } = response.data;

// En aktif kullanıcılar için
const { topUsers } = response.data;

// Kategori grafikleri için
const { categories } = response.data;
```

### Grafik ve Chart'lar
- Kullanıcı türleri dağılımı
- Kategori istatistikleri
- Zaman bazlı aktivite grafikleri
- Etkileşim oranları

## ⚠️ Önemli Notlar

1. **Onay Bekleyen İçerikler**: Bu API'de onay bekleyen içerikler dahil edilmemiştir. Sadece onaylanmış ve aktif içerikler gösterilir.

2. **Populate Edilmiş Veriler**: Tüm içerikler ve kullanıcılar populate edilmiş şekilde gelir, sadece sayısal veriler değil tam detaylar vardır.

3. **Performans**: Bu API çok sayıda veritabanı sorgusu yapar, bu nedenle cache mekanizması eklenmesi önerilir.

4. **Güvenlik**: Sadece admin yetkisi olan kullanıcılar bu API'yi kullanabilir.

## 🔧 Geliştirme Önerileri

1. **Cache Mekanizması**: Redis ile cache eklenebilir
2. **Pagination**: Büyük veri setleri için sayfalama
3. **Filtreleme**: Tarih aralığı ve kategori filtreleri
4. **Real-time Updates**: WebSocket ile gerçek zamanlı güncellemeler

## 📈 Performans Metrikleri

- **Response Time**: ~2-5 saniye (veri miktarına bağlı)
- **Memory Usage**: ~50-100MB (populate edilmiş veriler)
- **Database Queries**: ~25-30 sorgu
- **Data Size**: ~500KB-2MB (JSON response)

---

**Son Güncelleme**: 2024-01-15  
**Versiyon**: 1.0.0  
**Geliştirici**: Admin Panel Team
