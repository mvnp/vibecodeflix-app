import { Link, useRouter } from "expo-router";
import { Play } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../../src/services/auth";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            await authService.login(email, password);
            // AuthContext will handle redirect
        } catch (error: any) {
            Alert.alert("Falha no login", error.message || "Ocorreu um erro ao entrar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950 p-6 justify-center">
            <View className="items-center mb-12">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-red-600 rounded-lg justify-center items-center mr-3">
                        <Play fill="white" color="white" size={24} />
                    </View>
                    <Text className="text-3xl font-bold text-white">
                        VibeCode<Text className="text-red-600">Flix</Text>
                    </Text>
                </View>
                <Text className="text-zinc-400 mt-2">Sua plataforma de cursos premium</Text>
            </View>

            <View className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <Text className="text-2xl font-bold text-white mb-6">Entrar</Text>

                <View className="mb-4">
                    <Text className="text-zinc-300 mb-2 font-medium">E-mail</Text>
                    <TextInput
                        className="w-full bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 focus:border-red-600"
                        placeholder="seu@email.com"
                        placeholderTextColor="#71717a"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-zinc-300 mb-2 font-medium">Senha</Text>
                    <TextInput
                        className="w-full bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 focus:border-red-600"
                        placeholder="••••••••"
                        placeholderTextColor="#71717a"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View className="flex-row justify-between items-center mb-6">
                    <TouchableOpacity className="flex-row items-center">
                        <View className="w-5 h-5 border border-zinc-600 rounded mr-2 bg-zinc-800" />
                        <Text className="text-zinc-400">Lembrar de mim</Text>
                    </TouchableOpacity>
                    <Link href="/(auth)/forgot-password" asChild>
                        <TouchableOpacity>
                            <Text className="text-red-500 font-semibold">Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className={`w-full bg-red-600 p-4 rounded-xl items-center justify-center ${loading ? "opacity-70" : ""
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Entrar</Text>
                    )}
                </TouchableOpacity>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-zinc-400">Não tem uma conta? </Text>
                    <TouchableOpacity>
                        <Text className="text-red-500 font-bold">Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text className="text-center text-zinc-600 mt-12 text-sm">
                © 2025 VibeCodeFlix. Todos os direitos reservados.
            </Text>
        </SafeAreaView>
    );
}
