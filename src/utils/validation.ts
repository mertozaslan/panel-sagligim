// Event form validation utilities
export interface ValidationError {
  field: string;
  message: string;
}

export interface EventFormData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructorTitle?: string;
  date: string;
  endDate: string;
  location: string;
  locationAddress?: string;
  maxParticipants: number;
  price: number;
  isOnline: boolean;
  organizer: string;
  organizerType: string;
  tags: string[];
  requirements?: string;
  image?: string;
}

export const validateEventForm = (formData: EventFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!formData.title || formData.title.trim().length < 5) {
    errors.push({
      field: 'title',
      message: 'Etkinlik başlığı en az 5 karakter olmalı'
    });
  } else if (formData.title.trim().length > 200) {
    errors.push({
      field: 'title',
      message: 'Etkinlik başlığı en fazla 200 karakter olabilir'
    });
  }

  // Description validation
  if (!formData.description || formData.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Etkinlik açıklaması en az 10 karakter olmalı'
    });
  } else if (formData.description.trim().length > 2000) {
    errors.push({
      field: 'description',
      message: 'Etkinlik açıklaması en fazla 2000 karakter olabilir'
    });
  }

  // Category validation (optional but if provided, should be valid)
  const validCategories = [
    'Meditasyon', 'Yoga', 'Beslenme', 'Egzersiz', 'Psikoloji', 
    'Tıp', 'Alternatif Tıp', 'Sağlık Teknolojisi', 'Diğer'
  ];
  if (formData.category && !validCategories.includes(formData.category)) {
    errors.push({
      field: 'category',
      message: 'Geçerli bir kategori seçin'
    });
  }

  // Instructor validation
  if (!formData.instructor || formData.instructor.trim().length < 2) {
    errors.push({
      field: 'instructor',
      message: 'Eğitmen adı en az 2 karakter olmalı'
    });
  } else if (formData.instructor.trim().length > 100) {
    errors.push({
      field: 'instructor',
      message: 'Eğitmen adı en fazla 100 karakter olabilir'
    });
  }

  // Instructor title validation
  if (formData.instructorTitle && formData.instructorTitle.trim().length > 100) {
    errors.push({
      field: 'instructorTitle',
      message: 'Eğitmen unvanı en fazla 100 karakter olabilir'
    });
  }

  // Date validation
  if (!formData.date) {
    errors.push({
      field: 'date',
      message: 'Başlangıç tarihi gereklidir'
    });
  } else {
    const startDate = new Date(formData.date);
    const now = new Date();
    
    if (isNaN(startDate.getTime())) {
      errors.push({
        field: 'date',
        message: 'Geçerli bir başlangıç tarihi girin'
      });
    } else if (startDate <= now) {
      errors.push({
        field: 'date',
        message: 'Etkinlik tarihi gelecekte olmalı'
      });
    }
  }

  // End date validation
  if (!formData.endDate) {
    errors.push({
      field: 'endDate',
      message: 'Bitiş tarihi gereklidir'
    });
  } else {
    const endDate = new Date(formData.endDate);
    
    if (isNaN(endDate.getTime())) {
      errors.push({
        field: 'endDate',
        message: 'Geçerli bir bitiş tarihi girin'
      });
    } else if (formData.date) {
      const startDate = new Date(formData.date);
      if (endDate <= startDate) {
        errors.push({
          field: 'endDate',
          message: 'Bitiş tarihi başlangıç tarihinden sonra olmalı'
        });
      }
    }
  }

  // Location validation
  if (!formData.location || formData.location.trim().length < 2) {
    errors.push({
      field: 'location',
      message: 'Etkinlik yeri en az 2 karakter olmalı'
    });
  } else if (formData.location.trim().length > 200) {
    errors.push({
      field: 'location',
      message: 'Etkinlik yeri en fazla 200 karakter olabilir'
    });
  }

  // Location address validation
  if (formData.locationAddress && formData.locationAddress.trim().length > 300) {
    errors.push({
      field: 'locationAddress',
      message: 'Adres en fazla 300 karakter olabilir'
    });
  }

  // Max participants validation
  if (formData.maxParticipants < 1) {
    errors.push({
      field: 'maxParticipants',
      message: 'Maksimum katılımcı sayısı en az 1 olmalı'
    });
  } else if (formData.maxParticipants > 10000) {
    errors.push({
      field: 'maxParticipants',
      message: 'Maksimum katılımcı sayısı en fazla 10000 olabilir'
    });
  }

  // Price validation
  if (formData.price < 0) {
    errors.push({
      field: 'price',
      message: 'Fiyat 0 veya pozitif bir değer olmalı'
    });
  }

  // Organizer validation
  if (!formData.organizer || formData.organizer.trim().length < 2) {
    errors.push({
      field: 'organizer',
      message: 'Organizatör adı en az 2 karakter olmalı'
    });
  } else if (formData.organizer.trim().length > 100) {
    errors.push({
      field: 'organizer',
      message: 'Organizatör adı en fazla 100 karakter olabilir'
    });
  }

  // Organizer type validation
  const validOrganizerTypes = ['individual', 'organization', 'hospital', 'clinic'];
  if (!formData.organizerType || !validOrganizerTypes.includes(formData.organizerType)) {
    errors.push({
      field: 'organizerType',
      message: 'Geçerli bir organizatör türü seçin'
    });
  }

  // Tags validation
  if (formData.tags && formData.tags.length > 10) {
    errors.push({
      field: 'tags',
      message: 'En fazla 10 etiket ekleyebilirsiniz'
    });
  }

  // Individual tag validation
  if (formData.tags) {
    formData.tags.forEach((tag, index) => {
      if (tag.trim().length < 1) {
        errors.push({
          field: `tags.${index}`,
          message: 'Etiket boş olamaz'
        });
      } else if (tag.trim().length > 50) {
        errors.push({
          field: `tags.${index}`,
          message: 'Etiket en fazla 50 karakter olabilir'
        });
      }
    });
  }

  // Requirements validation
  if (formData.requirements && formData.requirements.trim().length > 500) {
    errors.push({
      field: 'requirements',
      message: 'Gereksinimler en fazla 500 karakter olabilir'
    });
  }

  // Image URL validation
  if (formData.image && formData.image.trim()) {
    // URL validation - ya tam URL olmalı ya da /uploads ile başlamalı
    const isValidUrl = formData.image.startsWith('http') || formData.image.startsWith('/uploads');
    if (!isValidUrl) {
      try {
        new URL(formData.image);
      } catch {
        errors.push({
          field: 'image',
          message: 'Geçerli bir resim URL\'si girin'
        });
      }
    }
  }

  return errors;
};

// Real-time validation for individual fields
export const validateField = (field: string, value: any, formData?: EventFormData): string | null => {
  switch (field) {
    case 'title':
      if (!value || value.trim().length < 5) {
        return 'Etkinlik başlığı en az 5 karakter olmalı';
      }
      if (value.trim().length > 200) {
        return 'Etkinlik başlığı en fazla 200 karakter olabilir';
      }
      break;

    case 'description':
      if (!value || value.trim().length < 10) {
        return 'Etkinlik açıklaması en az 10 karakter olmalı';
      }
      if (value.trim().length > 2000) {
        return 'Etkinlik açıklaması en fazla 2000 karakter olabilir';
      }
      break;

    case 'instructor':
      if (!value || value.trim().length < 2) {
        return 'Eğitmen adı en az 2 karakter olmalı';
      }
      if (value.trim().length > 100) {
        return 'Eğitmen adı en fazla 100 karakter olabilir';
      }
      break;

    case 'instructorTitle':
      if (value && value.trim().length > 100) {
        return 'Eğitmen unvanı en fazla 100 karakter olabilir';
      }
      break;

    case 'location':
      if (!value || value.trim().length < 2) {
        return 'Etkinlik yeri en az 2 karakter olmalı';
      }
      if (value.trim().length > 200) {
        return 'Etkinlik yeri en fazla 200 karakter olabilir';
      }
      break;

    case 'locationAddress':
      if (value && value.trim().length > 300) {
        return 'Adres en fazla 300 karakter olabilir';
      }
      break;

    case 'maxParticipants':
      if (value < 1) {
        return 'Maksimum katılımcı sayısı en az 1 olmalı';
      }
      if (value > 10000) {
        return 'Maksimum katılımcı sayısı en fazla 10000 olabilir';
      }
      break;

    case 'price':
      if (value < 0) {
        return 'Fiyat 0 veya pozitif bir değer olmalı';
      }
      break;

    case 'organizer':
      if (!value || value.trim().length < 2) {
        return 'Organizatör adı en az 2 karakter olmalı';
      }
      if (value.trim().length > 100) {
        return 'Organizatör adı en fazla 100 karakter olabilir';
      }
      break;

    case 'requirements':
      if (value && value.trim().length > 500) {
        return 'Gereksinimler en fazla 500 karakter olabilir';
      }
      break;

    case 'image':
      if (value && value.trim()) {
        // URL validation - ya tam URL olmalı ya da /uploads ile başlamalı
        const isValidUrl = value.startsWith('http') || value.startsWith('/uploads');
        if (!isValidUrl) {
          try {
            new URL(value);
          } catch {
            return 'Geçerli bir resim URL\'si girin';
          }
        }
      }
      break;

    case 'date':
      if (!value) {
        return 'Başlangıç tarihi gereklidir';
      }
      const startDate = new Date(value);
      const now = new Date();
      if (isNaN(startDate.getTime())) {
        return 'Geçerli bir başlangıç tarihi girin';
      }
      if (startDate <= now) {
        return 'Etkinlik tarihi gelecekte olmalı';
      }
      break;

    case 'endDate':
      if (!value) {
        return 'Bitiş tarihi gereklidir';
      }
      const endDate = new Date(value);
      if (isNaN(endDate.getTime())) {
        return 'Geçerli bir bitiş tarihi girin';
      }
      if (formData && formData.date) {
        const startDate = new Date(formData.date);
        if (endDate <= startDate) {
          return 'Bitiş tarihi başlangıç tarihinden sonra olmalı';
        }
      }
      break;
  }

  return null;
};

// User validation
export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: string;
  bio?: string;
  profilePicture?: string;
  dateOfBirth?: string;
}

export const validateUserForm = (formData: UserFormData, isEdit: boolean = false): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Username validation
  if (!formData.username || formData.username.trim().length < 3) {
    errors.push({
      field: 'username',
      message: 'Kullanıcı adı en az 3 karakter olmalı'
    });
  } else if (formData.username.trim().length > 30) {
    errors.push({
      field: 'username',
      message: 'Kullanıcı adı en fazla 30 karakter olabilir'
    });
  } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
    errors.push({
      field: 'username',
      message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'
    });
  }

  // Email validation
  if (!formData.email) {
    errors.push({
      field: 'email',
      message: 'Email gereklidir'
    });
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.push({
      field: 'email',
      message: 'Geçerli bir email adresi girin'
    });
  }

  // Password validation (sadece create'te zorunlu)
  if (!isEdit) {
    if (!formData.password || formData.password.length < 6) {
      errors.push({
        field: 'password',
        message: 'Şifre en az 6 karakter olmalı'
      });
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.push({
        field: 'password',
        message: 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermeli'
      });
    }
  }

  // First name validation
  if (!formData.firstName || formData.firstName.trim().length < 2) {
    errors.push({
      field: 'firstName',
      message: 'Ad en az 2 karakter olmalı'
    });
  } else if (formData.firstName.trim().length > 50) {
    errors.push({
      field: 'firstName',
      message: 'Ad en fazla 50 karakter olabilir'
    });
  } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(formData.firstName)) {
    errors.push({
      field: 'firstName',
      message: 'Ad sadece harf içerebilir'
    });
  }

  // Last name validation
  if (!formData.lastName || formData.lastName.trim().length < 2) {
    errors.push({
      field: 'lastName',
      message: 'Soyad en az 2 karakter olmalı'
    });
  } else if (formData.lastName.trim().length > 50) {
    errors.push({
      field: 'lastName',
      message: 'Soyad en fazla 50 karakter olabilir'
    });
  } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(formData.lastName)) {
    errors.push({
      field: 'lastName',
      message: 'Soyad sadece harf içerebilir'
    });
  }

  // Bio validation
  if (formData.bio && formData.bio.trim().length > 500) {
    errors.push({
      field: 'bio',
      message: 'Biyografi en fazla 500 karakter olabilir'
    });
  }

  // Profile picture validation
  if (formData.profilePicture && formData.profilePicture.trim()) {
    const isValidUrl = formData.profilePicture.startsWith('http') || formData.profilePicture.startsWith('/uploads');
    if (!isValidUrl) {
      try {
        new URL(formData.profilePicture);
      } catch {
        errors.push({
          field: 'profilePicture',
          message: 'Geçerli bir profil resmi URL\'si veya path girin'
        });
      }
    }
  }

  return errors;
};
