import api from '@/lib/axios';

export interface PendingDoctor {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  doctorInfo: {
    approvalStatus: 'pending' | 'approved' | 'rejected';
    location?: string;
    specialization?: string;
    hospital?: string;
    experience?: number;
    approvalDate?: string;
    rejectionReason?: string;
  };
  createdAt: string;
}

export interface PendingDoctorsResponse {
  pendingDoctors: PendingDoctor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPending: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DoctorApprovalResponse {
  message: string;
  doctor: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    doctorInfo: {
      approvalStatus: 'approved' | 'rejected';
      approvalDate: string;
      location?: string;
      specialization?: string;
      hospital?: string;
      experience?: number;
      rejectionReason?: string;
    };
  };
}

export interface DoctorRejectionData {
  rejectionReason?: string;
}

// Doctors servisleri
export const doctorsService = {
  // Onay bekleyen doktorları getir
  getPendingDoctors: async (page = 1, limit = 10): Promise<PendingDoctorsResponse> => {
    const response = await api.get('/admin/doctors/pending', {
      params: { page, limit }
    });
    return response.data;
  },

  // Doktoru onayla
  approveDoctor: async (doctorId: string): Promise<DoctorApprovalResponse> => {
    const response = await api.put(`/admin/doctors/${doctorId}/approve`);
    return response.data;
  },

  // Doktoru reddet
  rejectDoctor: async (doctorId: string, rejectionData?: DoctorRejectionData): Promise<DoctorApprovalResponse> => {
    const response = await api.put(`/admin/doctors/${doctorId}/reject`, rejectionData);
    return response.data;
  },
};
