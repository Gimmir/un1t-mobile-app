import { PrimaryButton } from '@/components/auth';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

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
        <View style={styles.container}> 
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" /> 

            <ImageBackground
                source={require('../assets/images/login-bg.png')}
                style={styles.background}
                resizeMode="cover"
                onLoadEnd={handleLoadEnd} 
            >
                <View style={styles.overlay}>
                  <View style={styles.overlayDim} />
                    <LinearGradient
                    colors={['rgba(0,0,0,0.10)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.70)', colors.surface.app]}
                    locations={[0, 0.45, 0.78, 1]}
                    style={styles.overlayGradient}
                  />
                    <ContentFadeIn isLoaded={isBgLoaded}>
                        <SafeAreaView style={styles.safeArea}>
                            
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.actions}>
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
        backgroundColor: colors.surface.app,
    },
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        position: 'relative',
    },
    overlayDim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.20)',
    },
    overlayGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 44,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface.app,
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
        width: 240,
        height: 120,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 16,
    },
    buttonContainer: {
      flex: 1,
    },
    actions: {
      paddingHorizontal: 24,
    },
}); 
