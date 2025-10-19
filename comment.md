# Comment API Dokümantasyonu

Bu dokümantasyon, Comment API'sinin tüm endpoint'lerini, request/response yapılarını, validasyon kurallarını ve kullanım örneklerini içermektedir.

## İçindekiler

1. [Genel Bilgiler](#genel-bilgiler)
2. [Authentication](#authentication)
3. [Comment Model Yapısı](#comment-model-yapısı)
4. [API Endpoint'leri](#api-endpointleri)
5. [Validasyon Kuralları](#validasyon-kuralları)
6. [Error Handling](#error-handling)
7. [Kullanım Örnekleri](#kullanım-örnekleri)

## Genel Bilgiler

Comment API'si, Post ve Blog içeriklerine yorum yapma, yorumları yönetme ve etkileşim kurma işlevlerini sağlar. Yorumlar hiyerarşik yapıda (ana yorum ve cevaplar) çalışır.

**Base URL:** `/api/comments`

## Authentication

Comment API'si JWT token tabanlı authentication kullanır. Bazı endpoint'ler için authentication gerekli, bazıları için opsiyoneldir.

### Token Format
```
Authorization: Bearer <jwt_token>
```

## Comment Model Yapısı

```javascript
{
  _id: ObjectId,
  postOrBlog: ObjectId, // Post veya Blog referansı
  postType: String, // "Post" veya "Blog", default: "Post"
  author: ObjectId, // User referansı
  content: String, // 1-1000 karakter, gerekli
  isAnonymous: Boolean, // Default: false
  likes: [ObjectId], // User referansları
  dislikes: [ObjectId], // User referansları
  isApproved: Boolean, // Default: true
  isReported: Boolean, // Default: false
  reportCount: Number, // Default: 0
  parentComment: ObjectId, // Üst yorum referansı, null ise ana yorum
  replies: [ObjectId], // Alt yorum referansları
  isHelpful: Boolean, // Default: false
  medicalAdvice: Boolean, // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Virtual Fields

```javascript
{
  likeCount: Number, // Beğeni sayısı
  dislikeCount: Number, // Beğenmeme sayısı
  replyCount: Number // Cevaplama sayısı
}
```

## API Endpoint'leri

### 1. Yorum Oluştur

**Endpoint:** `POST /api/comments/:postId`

**Authentication:** Gerekli

**Request Body:**
```javascript
{
  "content": "string", // 1-1000 karakter, gerekli
  "isAnonymous": boolean, // Default: false
  "parentComment": "ObjectId", // Üst yorum ID'si, opsiyonel
  "postType": "string" // "Post" veya "Blog", default: "Post"
}
```

**Response (201):**
```javascript
{
  "message": "Yorum başarıyla oluşturuldu",
  "comment": {
    // Yorum objesi author bilgileri ile populate edilmiş
  }
}
```

**Error Responses:**
- `400`: Validation hatası veya geçersiz post türü
- `404`: Post/Blog bulunamadı

---

### 2. Post/Blog Yorumlarını Getir

**Endpoint:** `GET /api/comments/:postId`

**Authentication:** Opsiyonel

**Query Parameters:**
- `postType`: "Post" veya "Blog" (default: "Post")
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına yorum sayısı (default: 10)

**Response (200):**
```javascript
{
  "comments": [
    {
      // Ana yorumlar (parentComment: null)
      "_id": "ObjectId",
      "content": "string",
      "author": {
        "_id": "ObjectId",
        "username": "string",
        "firstName": "string",
        "lastName": "string",
        "profilePicture": "string"
      },
      "isAnonymous": boolean,
      "likes": ["ObjectId"],
      "dislikes": ["ObjectId"],
      "replies": [
        {
          // Alt yorumlar
          "_id": "ObjectId",
          "content": "string",
          "author": {...},
          "isAnonymous": boolean,
          "likes": ["ObjectId"],
          "dislikes": ["ObjectId"],
          "createdAt": "Date",
          "updatedAt": "Date"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalComments": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses:**
- `400`: Geçersiz post türü
- `404`: Post/Blog bulunamadı

---

### 3. Yorum Güncelle

**Endpoint:** `PUT /api/comments/:commentId`

**Authentication:** Gerekli (Yazar veya Admin)

**Request Body:**
```javascript
{
  "content": "string", // 1-1000 karakter, opsiyonel
  "isAnonymous": boolean // Opsiyonel
}
```

**Response (200):**
```javascript
{
  "message": "Yorum başarıyla güncellendi",
  "comment": {
    // Güncellenmiş yorum objesi
  }
}
```

**Error Responses:**
- `403`: Güncelleme yetkisi yok
- `404`: Yorum bulunamadı

---

### 4. Yorum Sil

**Endpoint:** `DELETE /api/comments/:commentId`

**Authentication:** Gerekli (Yazar veya Admin)

**Response (200):**
```javascript
{
  "message": "Yorum başarıyla silindi"
}
```

**Not:** Ana yorum silindiğinde tüm alt yorumları da silinir.

**Error Responses:**
- `403`: Silme yetkisi yok
- `404`: Yorum bulunamadı

---

### 5. Yorum Beğen/Beğenme

**Endpoint:** `POST /api/comments/:commentId/like`

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

### 6. Yorum Beğenme/Beğenmeme

**Endpoint:** `POST /api/comments/:commentId/dislike`

**Authentication:** Gerekli

**Response (200):** Aynı format `toggleLike` ile

---

### 7. Yorum Raporla

**Endpoint:** `POST /api/comments/:commentId/report`

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
  "message": "Yorum başarıyla raporlandı"
}
```

## Validasyon Kuralları

### Yorum Oluşturma/Güncelleme Validasyonu

```javascript
{
  "content": {
    "required": true,
    "minLength": 1,
    "maxLength": 1000,
    "trim": true
  },
  "postType": {
    "required": false,
    "enum": ["Post", "Blog"],
    "default": "Post"
  },
  "isAnonymous": {
    "required": false,
    "type": "boolean",
    "default": false
  },
  "parentComment": {
    "required": false,
    "type": "ObjectId",
    "format": "MongoDB ObjectId"
  }
}
```

## Error Handling

### Hata Kodları

- `400`: Bad Request - Validation hatası veya geçersiz post türü
- `401`: Unauthorized - Token gerekli
- `403`: Forbidden - Yetki hatası
- `404`: Not Found - Yorum/Post/Blog bulunamadı
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

### Yorum Oluşturma

```javascript
// Post'a yorum
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    content: "Çok faydalı bir paylaşım, teşekkürler!",
    isAnonymous: false,
    postType: "Post"
  })
});

const result = await response.json();
```

### Blog'a Yorum

```javascript
// Blog'a yorum
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    content: "Bu konuda daha detaylı bilgi alabilir miyim?",
    isAnonymous: false,
    postType: "Blog"
  })
});

const result = await response.json();
```

### Alt Yorum Oluşturma

```javascript
// Ana yoruma cevap
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    content: "Ben de aynı durumu yaşadım, şu şekilde çözmüştüm...",
    parentComment: "60f7b3b3b3b3b3b3b3b3b3b4", // Ana yorum ID'si
    isAnonymous: false,
    postType: "Post"
  })
});

const result = await response.json();
```

### Yorum Listesi Getirme

```javascript
// Post yorumlarını getir
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3?page=1&limit=10&postType=Post');
const result = await response.json();

console.log(result.comments); // Yorum listesi (ana yorumlar ve cevapları)
console.log(result.pagination); // Sayfalama bilgileri
```

### Blog Yorumlarını Getirme

```javascript
// Blog yorumlarını getir
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3?postType=Blog');
const result = await response.json();
```

### Yorum Beğenme

```javascript
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3/like', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
});

const result = await response.json();
console.log(result.likes); // Güncel beğeni sayısı
```

### Yorum Güncelleme

```javascript
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    content: "Güncellenmiş yorum içeriği",
    isAnonymous: false
  })
});

const result = await response.json();
```

### Yorum Raporlama

```javascript
const response = await fetch('/api/comments/60f7b3b3b3b3b3b3b3b3b3b3/report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    reason: "Uygunsuz içerik"
  })
});

const result = await response.json();
```

## Önemli Notlar

1. **Hiyerarşik Yapı**: Yorumlar ana yorum ve cevaplar şeklinde hiyerarşik yapıda çalışır
2. **Post/Blog Desteği**: Hem Post hem de Blog içeriklerine yorum yapılabilir
3. **Anonim Yorumlar**: Kullanıcılar anonim yorum yapabilir
4. **Beğeni Sistemi**: Like/Dislike sistemi mevcuttur
5. **Raporlama**: Uygunsuz yorumlar raporlanabilir
6. **Yetkilendirme**: Sadece yazar veya admin yorumları düzenleyebilir/silebilir
7. **Otomatik Silme**: Ana yorum silindiğinde tüm alt yorumları da silinir
8. **Populate**: Yorumlar author bilgileri ile birlikte döner
9. **Pagination**: Yorum listesi sayfalama ile döner
10. **Virtual Fields**: likeCount, dislikeCount, replyCount otomatik hesaplanır

## Database Indexleri

Comment modeli aşağıdaki alanlar için optimize edilmiştir:

- `postOrBlog + postType + createdAt` (desc)
- `author + createdAt` (desc)
- `parentComment`
- `isApproved`
- `postType`

## Yorum Yapısı Örneği

```javascript
{
  "comments": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "content": "Ana yorum içeriği",
      "author": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b1",
        "username": "doktor_ahmet",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "profilePicture": "/uploads/profile1.jpg"
      },
      "isAnonymous": false,
      "likes": ["60f7b3b3b3b3b3b3b3b3b3b2"],
      "dislikes": [],
      "replies": [
        {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
          "content": "Cevap yorum içeriği",
          "author": {
            "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
            "username": "hasta_mehmet",
            "firstName": "Mehmet",
            "lastName": "Kaya",
            "profilePicture": "/uploads/profile2.jpg"
          },
          "isAnonymous": false,
          "likes": [],
          "dislikes": [],
          "createdAt": "2023-07-20T10:30:00.000Z",
          "updatedAt": "2023-07-20T10:30:00.000Z"
        }
      ],
      "createdAt": "2023-07-20T10:00:00.000Z",
      "updatedAt": "2023-07-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalComments": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```
