import { Course, Lesson, Module, Section } from "../types";
import { supabase } from "./supabase";

export const courseService = {
    // Fetch all courses visible to the user (generic fetch for now, can filter by permission later)
    async getCourses(companyId?: string) {
        let query = supabase
            .from("courses")
            .select("*")
            .order("created_at", { ascending: false });

        // Optional: Only fetch courses for a specific company if required
        // if (companyId) {
        //    query = query.eq('company_id', companyId);
        // }

        const { data, error } = await query;
        if (error) throw error;
        return data as Course[];
    },

    async getCourseDetails(courseId: string) {
        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .single();

        if (error) throw error;
        return data as Course;
    },

    async getModules(courseId: string) {
        const { data, error } = await supabase
            .from("modules")
            .select("*")
            .eq("course_id", courseId)
            // .order("order_index", { ascending: true }); // Removed: Column does not exist
            .order("created_at", { ascending: true }); // Fallback sort

        if (error) throw error;
        return data as Module[];
    },

    async getSections(moduleId: string) {
        const { data, error } = await supabase
            .from("sections")
            .select("*")
            .eq("module_id", moduleId)
            // .order("order_index", { ascending: true });
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data as Section[];
    },

    async getLessons(moduleId: string) {
        const { data, error } = await supabase
            .from("lessons")
            .select("*")
            .eq("module_id", moduleId)
            .order("order", { ascending: true }); // specific column 'order' from screenshot

        if (error) throw error;
        return data as Lesson[];
    }
};
