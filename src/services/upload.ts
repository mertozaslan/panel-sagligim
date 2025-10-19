import api from '@/lib/axios';

export interface UploadResponse {
  message: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface MultipleUploadResponse {
  message: string;
  images: Array<{
    imageUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
}

export const uploadService = {
  // Tek resim yükleme
  uploadSingle: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Çoklu resim yükleme
  uploadMultiple: async (files: File[]): Promise<MultipleUploadResponse> => {
    if (files.length > 10) {
      throw new Error('Maksimum 10 resim yükleyebilirsiniz');
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Resim silme
  deleteImage: async (fileName: string): Promise<{ message: string; fileName: string }> => {
    const response = await api.delete(`/upload/${fileName}`);
    return response.data;
  },

  // Resim URL'ini tam URL'e çevir
  getImageUrl: (imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:3000'}${imageUrl}`;
  },

  // Dosya adını URL'den çıkar
  getFileNameFromUrl: (imageUrl: string): string => {
    if (!imageUrl) return '';
    const parts = imageUrl.split('/');
    return parts[parts.length - 1];
  },

  // Dosya validasyonu
  validateFile: (file: File): { valid: boolean; error?: string } => {
    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Geçersiz dosya tipi. Sadece JPEG, PNG, GIF ve WEBP formatları desteklenir.',
      };
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Dosya boyutu 5MB\'dan büyük olamaz.',
      };
    }

    return { valid: true };
  },
};

