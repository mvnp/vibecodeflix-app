import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
    const links = [
        "Quem Somos",
        "Como Funciona",
        "Nossos Instrutores",
        "Carreiras"
    ];

    return (
        <View className="mt-10 mb-10 px-4">
            <Text className="text-white text-xl font-bold mb-4">Sobre o VibeCodeFlix</Text>

            {links.map((link, index) => (
                <TouchableOpacity key={index} className="mb-3">
                    <Text className="text-zinc-400 text-base">{link}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
