export type UserRole = 'super_admin' | 'company_admin' | 'company_user';

export interface Profile {
    id: string;
    email: string;
    role: UserRole;
    full_name?: string;
    avatar_url?: string;
    company_id?: string;
}

export interface AuthSession {
    user: {
        id: string;
        email?: string;
    } | null;
    profile: Profile | null;
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    video_platform?: 'youtube' | 'vimeo' | 'bunny';
    created_at: string;
    company_id?: string;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    order_index?: number;
}

export interface Section {
    id: string;
    module_id: string;
    title: string;
    order_index?: number;
}

export interface Lesson {
    id: string;
    module_id: string;
    section_id?: string;
    title: string;
    video_url: string; // Changed from video_id
    video_platform?: 'youtube' | 'vimeo' | 'bunny'; // Keeping optional in case it exists
    duration?: string; // Changed from number to string (MM:SS)
    order?: number; // Changed from order_index
}
