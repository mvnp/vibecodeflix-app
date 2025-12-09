import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../src/components/Header";
import { useAuth } from "../../src/context/AuthContext";
import { courseService } from "../../src/services/course";
import { Course } from "../../src/types";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24; // 2 columns with padding

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const data = await courseService.getCourses(profile?.company_id);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [profile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const renderCourseCard = (course: Course) => (
    <TouchableOpacity
      key={course.id}
      onPress={() => router.push(`/course/${course.id}`)}
      className="mb-6"
      style={{ width: CARD_WIDTH }}
    >
      <View className="w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-2 relative">
        {course.thumbnail_url ? (
          <Image
            source={{ uri: course.thumbnail_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="flex-1 justify-center items-center bg-zinc-800">
            <Play color="#52525b" size={32} />
          </View>
        )}
        <View className="absolute bottom-1 right-1 bg-black/80 px-1 rounded">
          <Text className="text-white text-[10px] font-bold">PRO</Text>
        </View>
      </View>
      <Text className="text-white font-semibold text-sm line-clamp-2" numberOfLines={2}>
        {course.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="px-4">
        <Header />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC2626" />
        }
      >
        <Text className="text-xl font-bold text-white mb-4">Meus Cursos</Text>

        {loading ? (
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ width: CARD_WIDTH }} className="mb-6">
                <View className="w-full aspect-video bg-zinc-900 rounded-lg animate-pulse mb-2" />
                <View className="w-3/4 h-4 bg-zinc-900 rounded animate-pulse" />
              </View>
            ))}
          </View>
        ) : courses.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-zinc-500">Nenhum curso encontrado.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {courses.map(renderCourseCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
