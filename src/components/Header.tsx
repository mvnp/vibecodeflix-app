import { ChevronDown, Menu, Play } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { profile, user } = useAuth();

    // Get user initial or default to 'U'
    const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U');

    return (
        <View className="flex-row justify-between items-center py-4 mb-5">
            <View className="flex-row items-center gap-4">
                <TouchableOpacity>
                    <Menu color="#e4e4e7" size={24} />
                </TouchableOpacity>

                {/* Red Logo Box */}
                <View className="w-10 h-10 bg-red-600 rounded-xl justify-center items-center shadow-lg shadow-red-900/50">
                    <Play fill="white" color="white" size={18} />
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                {/* Red Profile Box */}
                <View className="w-10 h-10 bg-red-700/80 rounded-xl justify-center items-center border border-red-600/30">
                    <Text className="text-white font-bold text-lg">{initial}</Text>
                </View>
                <ChevronDown color="#71717a" size={16} />
            </View>
        </View>
    );
}
