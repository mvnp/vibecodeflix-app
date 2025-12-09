import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../../src/services/auth";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Erro", "Por favor, digite seu e-mail.");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email);
            Alert.alert("Sucesso", "Um e-mail de recuperação foi enviado.");
            router.back();
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Falha ao enviar e-mail.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950 p-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-8 w-10 h-10 bg-zinc-900 justify-center items-center rounded-full border border-zinc-800">
                <ArrowLeft color="white" size={24} />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-white mb-2">Esqueceu a senha?</Text>
            <Text className="text-zinc-400 mb-8">
                Digite seu e-mail para receber as instruções de recuperação.
            </Text>

            <View className="mb-6">
                <Text className="text-zinc-300 mb-2 font-medium">E-mail</Text>
                <TextInput
                    className="w-full bg-zinc-900 text-white p-4 rounded-xl border border-zinc-800 focus:border-red-600"
                    placeholder="seu@email.com"
                    placeholderTextColor="#71717a"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                className={`w-full bg-red-600 p-4 rounded-xl items-center justify-center ${loading ? "opacity-70" : ""
                    }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Enviar E-mail</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}
