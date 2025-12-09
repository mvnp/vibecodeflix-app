import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../src/components/Footer";
import Header from "../../src/components/Header";
import { courseService } from "../../src/services/course";
import { Course, Module } from "../../src/types";

export default function CourseDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!id) return;
            try {
                const [courseData, modulesData] = await Promise.all([
                    courseService.getCourseDetails(id as string),
                    courseService.getModules(id as string)
                ]);
                setCourse(courseData);
                setModules(modulesData);
            } catch (error) {
                console.error("Error loading course", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 bg-zinc-950 justify-center items-center">
                <ActivityIndicator color="#DC2626" size="large" />
            </View>
        );
    }

    if (!course) {
        return (
            <View className="flex-1 bg-zinc-950 justify-center items-center">
                <Text className="text-white">Curso não encontrado.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
            <Stack.Screen options={{
                headerShown: false, // Hide default header to use custom one
            }} />

            <View className="px-4">
                <Header />
            </View>

            <ScrollView>
                {/* Header Hero */}
                <View className="w-full h-64 bg-zinc-900 relative mb-5">
                    {course.thumbnail_url && (
                        <Image
                            source={{ uri: course.thumbnail_url }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                    )}
                    <View className="absolute inset-0 bg-black/40" />
                    <View className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-zinc-950 to-transparent">
                        <Text className="text-3xl font-bold text-white mb-1">{course.title}</Text>
                    </View>
                </View>

                <View className="p-4">
                    <Text className="text-zinc-400 mb-6 leading-5">{course.description || "Sem descrição disponível."}</Text>

                    <Text className="text-lg font-bold text-white mb-4 flex-row items-center">
                        Módulos
                    </Text>

                    {modules.length === 0 ? (
                        <Text className="text-zinc-500 italic">Nenhum módulo cadastrado ainda.</Text>
                    ) : (
                        modules.map((module, index) => (
                            <TouchableOpacity
                                key={module.id}
                                className="bg-zinc-900 p-4 rounded-xl mb-3 flex-row items-center border border-zinc-800 active:bg-zinc-800"
                                onPress={() => router.push(`/module/${module.id}?title=${encodeURIComponent(module.title)}&videoPlatform=${course.video_platform || 'youtube'}`)}
                            >
                                <View className="w-10 h-10 bg-zinc-800 rounded-full justify-center items-center mr-4">
                                    <Text className="text-red-500 font-bold">{index + 1}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-medium text-base">{module.title}</Text>
                                    <Text className="text-zinc-500 text-xs mt-1">Clique para ver aulas</Text>
                                </View>
                                <ChevronRight color="#52525b" size={20} />
                            </TouchableOpacity>
                        ))
                    )}
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
