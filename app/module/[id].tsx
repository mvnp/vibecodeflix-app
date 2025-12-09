import { Stack, useLocalSearchParams } from "expo-router";
import { PlayCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Header from "../../src/components/Header";
import { courseService } from "../../src/services/course";
import { Lesson, Section } from "../../src/types";

export default function ModuleScreen() {
    const { id, title } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!id) return;
            try {
                const [sectionsData, lessonsData] = await Promise.all([
                    courseService.getSections(id as string),
                    courseService.getLessons(id as string)
                ]);
                setSections(sectionsData);
                setLessons(lessonsData);

                // Auto-select first lesson if available
                if (lessonsData.length > 0) {
                    setActiveLesson(lessonsData[0]);
                }
            } catch (error) {
                console.error(error);
                Alert.alert("Erro", "Falha ao carregar aulas.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const getVideoIdFromUrl = (url: string) => {
        if (!url) return "";

        // YouTube Shorts / Regular / Youtu.be
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const renderVideoPlayer = () => {
        if (!activeLesson) return null;

        let videoUrl = "";
        const originalUrl = activeLesson.video_url || "";

        // Detect platform logic based on URL analysis if explicit platform is missing or to support full URLs
        // Defaulting to "youtube" logic for now as most URLs in screenshot are Youtube

        const youtubeId = getVideoIdFromUrl(originalUrl);

        if (youtubeId) {
            videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
        } else if (originalUrl.includes("vimeo")) {
            // Basic parse for vimeo, assuming ID is at end
            const vimeoId = originalUrl.split('/').pop();
            videoUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
        } else if (activeLesson.video_platform === 'bunny') {
            // Keep existing Bunny logic just in case
            const libraryId = process.env.EXPO_BUNNY_LIBRARY_ID;
            // If video_url is NOT a url, treat as ID. If it is, use as is? 
            // Schema says video_url, but might contain ID for bunny.
            videoUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${originalUrl}?autoplay=true`;
        } else {
            // Direct fallback
            videoUrl = originalUrl;
        }

        if (Platform.OS === 'web') {
            return (
                <View className="w-full aspect-video bg-black rounded-b-xl overflow-hidden shadow-lg border-b border-zinc-800">
                    <iframe
                        src={videoUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </View>
            );
        }

        return (
            <View className="w-full aspect-video bg-black rounded-b-xl overflow-hidden shadow-lg border-b border-zinc-800">
                <WebView
                    source={{ uri: videoUrl }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                />
            </View>
        )
    };

    const renderLessonsList = () => {
        // SCENARIO A: No sections
        if (sections.length === 0) {
            return lessons.map(renderLessonItem);
        }

        // SCENARIO B: Group by sections
        // First, find lessons without sections
        const orphanLessons = lessons.filter(l => !l.section_id);

        return (
            <View>
                {orphanLessons.map(renderLessonItem)}
                {sections.map(section => {
                    const sectionLessons = lessons.filter(l => l.section_id === section.id);
                    if (sectionLessons.length === 0) return null;
                    return (
                        <View key={section.id} className="mb-6">
                            <Text className="text-zinc-500 font-bold uppercase text-xs mb-3 px-2">
                                {section.title}
                            </Text>
                            {sectionLessons.map(renderLessonItem)}
                        </View>
                    )
                })}
            </View>
        );
    };

    const renderLessonItem = (lesson: Lesson, index: number) => {
        const isActive = activeLesson?.id === lesson.id;
        return (
            <TouchableOpacity
                key={lesson.id}
                disabled={isActive}
                onPress={() => setActiveLesson(lesson)}
                className={`p-4 rounded-xl mb-2 flex-row items-center border ${isActive ? "bg-zinc-800 border-red-600/50" : "bg-zinc-900 border-zinc-800"}`}
            >
                <View className="mr-3">
                    {isActive ? (
                        <ActivityIndicator size="small" color="#DC2626" />
                    ) : (
                        <PlayCircle size={20} color={isActive ? "#DC2626" : "#71717a"} />
                    )}
                </View>
                <View className="flex-1">
                    <Text className={`font-medium ${isActive ? "text-red-500" : "text-white"}`}>
                        {lesson.title}
                    </Text>
                    <Text className="text-zinc-500 text-xs">
                        {lesson.duration ? lesson.duration : "Vídeo"}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" edges={['bottom']}>
            <Stack.Screen options={{
                headerShown: false
            }} />

            <View className="px-4">
                <Header />
            </View>

            {/* Video Player Area Sticky or Top */}
            <View className="bg-zinc-900 w-full z-10 mb-5">
                {activeLesson ? (
                    renderVideoPlayer()
                ) : (
                    <View className="w-full aspect-video bg-zinc-900 justify-center items-center border-b border-zinc-800">
                        {loading ? <ActivityIndicator color="#DC2626" /> : <Text className="text-zinc-500">Selecione uma aula</Text>}
                    </View>
                )}
                <View className="p-4 border-b border-zinc-900">
                    <Text className="text-white text-lg font-bold leading-6">
                        {activeLesson?.title || "Carregando..."}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                {loading ? (
                    <ActivityIndicator color="#DC2626" className="mt-10" />
                ) : (
                    renderLessonsList()
                )}
                <View className="h-10" />{/* Safe bottom spacer */}
            </ScrollView>
        </SafeAreaView>
    );
}
