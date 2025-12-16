import { PrimaryButton } from '@/components/auth';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Компонент для плавного прояву контенту ---
const ContentFadeIn = ({ isLoaded, children }: { isLoaded: boolean, children: React.ReactNode }) => {
    const opacity = useRef(new Animated.Value(0)).current; 

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: isLoaded ? 1 : 0,
            duration: 700, // Плавний прояв контенту
            useNativeDriver: true,
        }).start();
    }, [isLoaded, opacity]);

    return <Animated.View style={[{ flex: 1, opacity }]}>{children}</Animated.View>;
};


export default function LandingScreen() {
    const router = useRouter();
    const [isBgLoaded, setIsBgLoaded] = useState(false); 
    
    const handleLoadEnd = () => {
        setIsBgLoaded(true);
    };

    return (
        // Головний контейнер встановлено на чорний для видимості StatusBar
        <View style={styles.container}> 
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" /> 

            <ImageBackground
                source={require('../assets/images/login-bg.png')}
                style={styles.background}
                resizeMode="cover"
                onLoadEnd={handleLoadEnd} 
            >
                {/* Оверлей та вміст, що з'являються після завантаження фону */}
                <View style={styles.overlay}>
                    
                    {/* Плавний прояв контенту */}
                    <ContentFadeIn isLoaded={isBgLoaded}>
                        <SafeAreaView style={styles.safeArea}>
                            
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.buttonsWrapper}>
                                <View style={styles.buttonRow}>
                                    <View style={styles.buttonContainer}>
                                        <PrimaryButton
                                            title="SIGN UP"
                                            onPress={() => router.push('/(auth)/sign-up')}
                                        />
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <PrimaryButton
                                            title="LOGIN"
                                            variant="secondary"
                                            onPress={() => router.push('/(auth)/login')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                    </ContentFadeIn>

                </View>
            </ImageBackground>

            {/* ЕКРАН ЗАВАНТАЖЕННЯ (Чорний екран з індикатором, поки фон не завантажиться) */}
            {!isBgLoaded && (
                <View style={styles.loadingOverlay}>
                    {/* Логотип завантаження */}
                    <Image
                        source={require('../assets/images/loading-logo.png')}
                        style={styles.loadingLogo} 
                        resizeMode="contain"
                    />
                    {/* Індикатор, щоб показати, що щось відбувається */}
                    <ActivityIndicator size="large" color="white" style={styles.indicator} /> 
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919', // Основний чорний фон
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Затемнення
    },
    safeArea: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191919',
        zIndex: 10,
    },
    loadingLogo: {
        width: 200, 
        height: 100,
        marginBottom: 20,
    },
    indicator: {
        marginTop: 20,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 256, 
        height: 128, 
    },
    buttonsWrapper: {
        paddingHorizontal: 0, 
    },
    buttonRow: {
        paddingHorizontal: 24,
        paddingBottom: 48, 
        flexDirection: 'row',
        gap: 16, 
    },
    buttonContainer: {
        flex: 1,
    }
});