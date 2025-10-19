# Blog API Dokümantasyonu

Bu dokümantasyon, Blog API'sinin tüm endpoint'lerini, request/response yapılarını, validasyon kurallarını ve kullanım örneklerini içermektedir.

## İçindekiler

1. [Genel Bilgiler](#genel-bilgiler)
2. [Authentication](#authentication)
3. [Blog Model Yapısı](#blog-model-yapısı)
4. [API Endpoint'leri](#api-endpointleri)
5. [Validasyon Kuralları](#validasyon-kuralları)
6. [Error Handling](#error-handling)
7. [Kullanım Örnekleri](#kullanım-örnekleri)

## Genel Bilgiler

Blog API'si, sağlık odaklı blog yazılarını yönetmek için tasarlanmıştır. Sadece doktor ve admin kullanıcılar blog oluşturabilir, tüm kullanıcılar ise blog'ları görüntüleyebilir.

**Base URL:** `/api/blogs`

## Authentication

Blog API'si JWT token tabanlı authentication kullanır. Bazı endpoint'ler için authentication gerekli, bazıları için opsiyoneldir.

### Token Format
```
Authorization: Bearer <jwt_token>
```

## Blog Model Yapısı

```javascript
{
  _id: ObjectId,
  author: ObjectId, // User referansı
  title: String, // 5-200 karakter, gerekli
  content: String, // 100-10000 karakter, gerekli
  excerpt: String, // 500 karakter max, opsiyonel
  category: String, // Enum değerler, gerekli
  tags: [String], // 15 tag max, her tag 50 karakter max
  images: [String], // 10 resim max
  featuredImage: String, // Opsiyonel
  isPublished: Boolean, // Default: false
  isFeatured: Boolean, // Default: false
  readingTime: Number, // Dakika cinsinden, otomatik hesaplanır
  likes: [ObjectId], // User referansları
  dislikes: [ObjectId], // User referansları
  views: Number, // Default: 0
  commentCount: Number, // Default: 0
  isApproved: Boolean, // Default: true
  isReported: Boolean, // Default: false
  reportCount: Number, // Default: 0
  medicalDisclaimer: String, // 1000 karakter max, default disclaimer
  references: [{
    title: String, // 200 karakter max
    url: String // URL formatında
  }],
  seoTitle: String, // 60 karakter max
  seoDescription: String, // 160 karakter max
  slug: String, // Otomatik oluşturulur
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Kategorileri

```javascript
[
  "medical-advice",     // Tıbbi Tavsiye
  "health-tips",        // Sağlık İpuçları
  "disease-information", // Hastalık Bilgisi
  "treatment-guides",   // Tedavi Rehberleri
  "prevention",         // Korunma
  "nutrition",          // Beslenme
  "mental-health",      // Ruh Sağlığı
  "pediatrics",         // Çocuk Sağlığı
  "geriatrics",         // Yaşlı Sağlığı
  "emergency-care",     // Acil Bakım
  "research",           // Araştırma
  "other"               // Diğer
]
```

## API Endpoint'leri

### 1. Blog Oluştur

**Endpoint:** `POST /api/blogs`

**Authentication:** Gerekli (Doctor veya Admin)

**Request Body:**
```javascript
{
  "title": "string", // 5-200 karakter, gerekli
  "content": "string", // 100-10000 karakter, gerekli
  "excerpt": "string", // 500 karakter max, opsiyonel
  "category": "string", // Enum değerlerden biri, gerekli
  "tags": ["string"], // 15 tag max, her tag 50 karakter max
  "images": ["string"], // 10 resim max, URL veya path formatında
  "featuredImage": "string", // URL veya path formatında, opsiyonel
  "isPublished": boolean, // Default: false
  "isFeatured": boolean, // Default: false
  "medicalDisclaimer": "string", // 1000 karakter max, opsiyonel
  "references": [{
    "title": "string", // 200 karakter max
    "url": "string" // URL formatında
  }],
  "seoTitle": "string", // 60 karakter max, opsiyonel
  "seoDescription": "string" // 160 karakter max, opsiyonel
}
```

**Response (201):**
```javascript
{
  "message": "Blog başarıyla oluşturuldu",
  "blog": {
    // Blog objesi author bilgileri ile populate edilmiş
  }
}
```

**Error Responses:**
- `403`: Yetki hatası (Doctor/Admin değil veya doktor onayı yok)
- `400`: Validation hatası

---

### 2. Tüm Blog'ları Getir

**Endpoint:** `GET /api/blogs`

**Authentication:** Opsiyonel

**Query Parameters:**
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına blog sayısı (default: 10)
- `category`: Kategori filtresi
- `author`: Yazar ID'si filtresi
- `search`: Arama terimi
- `featured`: Öne çıkan blog'lar (true/false)
- `published`: Yayın durumu (admin için, true/false)

**Response (200):**
```javascript
{
  "blogs": [
    {
      // Blog objeleri isLiked ve isDisliked alanları ile
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBlogs": 50,
    "hasNext": true,
    "hasPrev": false
  },
  "trendCategories": [
    {
      "name": "medical-advice",
      "count": 15
    }
  ]
}
```

---

### 3. Blog Detayı (ID ile)

**Endpoint:** `GET /api/blogs/:blogId`

**Authentication:** Opsiyonel

**Response (200):**
```javascript
{
  "blog": {
    // Blog objesi detaylı bilgilerle
  },
  "newBlogs": [
    // En yeni 3 blog
  ],
  "similarBlogs": [
    // Benzer blog'lar (kategori ve tag'e göre)
  ]
}
```

**Error Responses:**
- `404`: Blog bulunamadı
- `403`: Yayınlanmamış blog'a erişim yetkisi yok

---

### 4. Blog Detayı (Slug ile)

**Endpoint:** `GET /api/blogs/slug/:slug`

**Authentication:** Opsiyonel

**Response (200):** Aynı format `getBlogById` ile

---

### 5. Blog Güncelle

**Endpoint:** `PUT /api/blogs/:blogId`

**Authentication:** Gerekli (Yazar veya Admin)

**Request Body:** Aynı format `createBlog` ile (tüm alanlar opsiyonel)

**Response (200):**
```javascript
{
  "message": "Blog başarıyla güncellendi",
  "blog": {
    // Güncellenmiş blog objesi
  }
}
```

**Error Responses:**
- `404`: Blog bulunamadı
- `403`: Güncelleme yetkisi yok

---

### 6. Blog Sil

**Endpoint:** `DELETE /api/blogs/:blogId`

**Authentication:** Gerekli (Yazar veya Admin)

**Response (200):**
```javascript
{
  "message": "Blog başarıyla silindi"
}
```

---

### 7. Blog Beğen/Beğenme

**Endpoint:** `POST /api/blogs/:blogId/like`

**Authentication:** Gerekli

**Response (200):**
```javascript
{
  "message": "Beğeni durumu güncellendi",
  "likes": 15,
  "dislikes": 3
}
```

---

### 8. Blog Beğenme/Beğenmeme

**Endpoint:** `POST /api/blogs/:blogId/dislike`

**Authentication:** Gerekli

**Response (200):** Aynı format `toggleLike` ile

---

### 9. Blog Raporla

**Endpoint:** `POST /api/blogs/:blogId/report`

**Authentication:** Gerekli

**Request Body:**
```javascript
{
  "reason": "string" // Raporlama nedeni
}
```

**Response (200):**
```javascript
{
  "message": "Blog başarıyla raporlandı"
}
```

---

### 10. Kullanıcının Blog'larını Getir

**Endpoint:** `GET /api/blogs/user/:userId`

**Authentication:** Opsiyonel

**Query Parameters:**
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına blog sayısı (default: 10)

**Response (200):**
```javascript
{
  "blogs": [
    // Blog listesi
  ],
  "pagination": {
    // Pagination bilgileri
  }
}
```

---

### 11. Öne Çıkan Blog'ları Getir

**Endpoint:** `GET /api/blogs/featured`

**Authentication:** Gerekli değil

**Query Parameters:**
- `limit`: Blog sayısı (default: 5)

**Response (200):**
```javascript
{
  "blogs": [
    // Öne çıkan blog'lar
  ]
}
```

---

### 12. Blog Kategorilerini Getir

**Endpoint:** `GET /api/blogs/categories`

**Authentication:** Gerekli değil

**Response (200):**
```javascript
{
  "categories": [
    {
      "name": "medical-advice",
      "count": 15
    }
  ]
}
```

## Validasyon Kuralları

### Blog Oluşturma/Güncelleme Validasyonu

```javascript
{
  "title": {
    "required": true,
    "minLength": 5,
    "maxLength": 200,
    "trim": true
  },
  "content": {
    "required": true,
    "minLength": 100,
    "maxLength": 10000,
    "trim": true
  },
  "excerpt": {
    "required": false,
    "maxLength": 500,
    "trim": true
  },
  "category": {
    "required": true,
    "enum": ["medical-advice", "health-tips", ...]
  },
  "tags": {
    "required": false,
    "maxItems": 15,
    "itemMaxLength": 50
  },
  "images": {
    "required": false,
    "maxItems": 10,
    "format": "URL veya /uploads/... path"
  },
  "featuredImage": {
    "required": false,
    "format": "URL veya /uploads/... path"
  },
  "isPublished": {
    "required": false,
    "type": "boolean"
  },
  "isFeatured": {
    "required": false,
    "type": "boolean"
  },
  "medicalDisclaimer": {
    "required": false,
    "maxLength": 1000,
    "trim": true
  },
  "references": {
    "required": false,
    "maxItems": 20,
    "schema": {
      "title": {
        "maxLength": 200
      },
      "url": {
        "format": "URL"
      }
    }
  },
  "seoTitle": {
    "required": false,
    "maxLength": 60,
    "trim": true
  },
  "seoDescription": {
    "required": false,
    "maxLength": 160,
    "trim": true
  }
}
```

## Error Handling

### Hata Kodları

- `400`: Bad Request - Validation hatası
- `401`: Unauthorized - Token gerekli
- `403`: Forbidden - Yetki hatası
- `404`: Not Found - Blog bulunamadı
- `500`: Internal Server Error - Sunucu hatası

### Hata Response Formatı

```javascript
{
  "message": "Hata mesajı",
  "errors": [ // Validation hataları için
    {
      "field": "fieldName",
      "message": "Hata açıklaması"
    }
  ]
}
```

## Kullanım Örnekleri

### Blog Oluşturma

```javascript
const response = await fetch('/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    title: "Diyabet Hakkında Bilmeniz Gerekenler",
    content: "Diyabet, kan şekeri seviyelerinin yüksek olması durumudur...",
    excerpt: "Diyabet hakkında temel bilgiler ve yaşam tarzı önerileri",
    category: "disease-information",
    tags: ["diyabet", "kan şekeri", "beslenme", "egzersiz"],
    isPublished: true,
    medicalDisclaimer: "Bu bilgiler genel bilgilendirme amaçlıdır. Doktor tavsiyesi alın.",
    references: [
      {
        title: "WHO Diyabet Raporu",
        url: "https://example.com/report"
      }
    ]
  })
});

const result = await response.json();
```

### Blog Listesi Getirme

```javascript
const response = await fetch('/api/blogs?page=1&limit=10&category=medical-advice&search=diyabet');
const result = await response.json();

console.log(result.blogs); // Blog listesi
console.log(result.pagination); // Sayfalama bilgileri
console.log(result.trendCategories); // Trend kategoriler
```

### Blog Beğenme

```javascript
const response = await fetch('/api/blogs/60f7b3b3b3b3b3b3b3b3b3b3/like', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
});

const result = await response.json();
console.log(result.likes); // Güncel beğeni sayısı
```

## Önemli Notlar

1. **Yetkilendirme**: Sadece doktor ve admin kullanıcılar blog oluşturabilir
2. **Doktor Onayı**: Doktor kullanıcıların blog oluşturabilmesi için onay almaları gerekir
3. **Yayın Durumu**: Blog'lar varsayılan olarak yayınlanmamış durumda oluşturulur
4. **Slug Oluşturma**: Blog başlığından otomatik slug oluşturulur
5. **Okuma Süresi**: İçerik uzunluğuna göre otomatik hesaplanır
6. **Görüntülenme Sayısı**: Her blog detayı görüntülendiğinde artırılır
7. **Benzer Blog'lar**: Kategori ve tag benzerliğine göre önerilir
8. **SEO Desteği**: SEO title ve description alanları mevcuttur
9. **Tıbbi Uyarı**: Varsayılan tıbbi uyarı metni otomatik eklenir
10. **Raporlama Sistemi**: Kullanıcılar uygunsuz blog'ları raporlayabilir

## Database Indexleri

Blog modeli aşağıdaki alanlar için optimize edilmiştir:

- `author + createdAt` (desc)
- `category + createdAt` (desc)
- `tags`
- `isPublished + isApproved + createdAt` (desc)
- `isFeatured + createdAt` (desc)
- `title + content + excerpt` (text search)
- `slug` (unique)
