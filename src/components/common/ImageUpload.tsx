import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadService } from '@/services/upload';
import { useErrorHandler } from './ErrorHandler';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  onFileNameChange?: (fileName: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onFileNameChange,
  label = 'Resim',
  required = false,
  error,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleError, handleSuccess } = useErrorHandler();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasyon
    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      handleError(validation.error || 'Geçersiz dosya');
      return;
    }

    // Preview oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const response = await uploadService.uploadSingle(file);
      onChange(response.imageUrl);
      if (onFileNameChange) {
        onFileNameChange(response.fileName);
      }
      handleSuccess('Resim başarıyla yüklendi');
    } catch (error: any) {
      handleError(error);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (onFileNameChange) {
      onFileNameChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-start space-x-4">
        {/* Preview veya Upload Butonu */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
              <Image
                src={
                  preview.startsWith('http') || preview.startsWith('data:')
                    ? preview
                    : `${process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.saglikhep.com'}${preview}`
                }
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled || isUploading}
              className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                disabled || isUploading
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-health-500 hover:bg-health-50 cursor-pointer'
              }`}
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-health-500 animate-spin" />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Resim Seç</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Upload Bilgileri */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />

          {!preview && (
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled || isUploading}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                disabled || isUploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Yükleniyor...' : 'Resim Yükle'}
            </button>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Maksimum dosya boyutu: 5MB</p>
            <p>• Desteklenen formatlar: JPEG, PNG, GIF, WEBP</p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

