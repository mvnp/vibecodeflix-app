import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
    const { signOut, user, profile } = useAuth();

    return (
        <View className="flex-1 bg-zinc-950 p-4 justify-center items-center">
            <Text className="text-white text-xl mb-4">Perfil</Text>
            <Text className="text-zinc-400 mb-2">{user?.email}</Text>
            <Text className="text-zinc-400 mb-8">Role: {profile?.role || 'user'}</Text>

            <TouchableOpacity onPress={signOut} className="bg-red-600 px-6 py-3 rounded-xl">
                <Text className="text-white font-bold">Sair</Text>
            </TouchableOpacity>
        </View>
    );
}
