import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface ApiError {
  message: string;
  errors?: ValidationError[];
}

export const showErrorToast = (error: ApiError | string) => {
  if (typeof error === 'string') {
    toast.error(error, {
      duration: 5000,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    });
    return;
  }

  // Eğer validation hataları varsa, her birini ayrı toast olarak göster
  if (error.errors && error.errors.length > 0) {
    error.errors.forEach((validationError, index) => {
      setTimeout(() => {
        toast.error(`${validationError.field}: ${validationError.message}`, {
          duration: 6000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }, index * 100); // Her toast'u 100ms arayla göster
    });
  } else {
    // Genel hata mesajı
    toast.error(error.message || 'Bir hata oluştu', {
      duration: 5000,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    });
  }
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 4000,
    icon: <Info className="h-5 w-5 text-blue-500" />,
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    duration: 2000,
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Global Error Handler Component
export const ErrorHandler = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        // Success toast
        success: {
          duration: 4000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
        },
        // Error toast
        error: {
          duration: 6000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
        },
        // Loading toast
        loading: {
          duration: 2000,
          style: {
            background: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
          },
        },
      }}
    />
  );
};

// Hook for handling API errors
export const useErrorHandler = () => {
  const handleError = (error: any) => {
    console.error('API Error:', error);
    
    if (error.response?.data) {
      const apiError = error.response.data;
      showErrorToast(apiError);
    } else if (error.message) {
      showErrorToast(error.message);
    } else {
      showErrorToast('Beklenmeyen bir hata oluştu');
    }
  };

  const handleSuccess = (message: string) => {
    showSuccessToast(message);
  };

  return {
    handleError,
    handleSuccess,
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showLoadingToast,
  };
};
