// grad_pro/ProgressBar.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProgressBar = () => {
    const [currentStep, setCurrentStep] = useState(2);
    const steps = ["출발 준비", "첫 발걸음", "멜로디", "가사", "공연"];

    const updateProgress = (step) => {
        setCurrentStep(step);
    };

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <View style={styles.progress}>
                    <View style={{ ...styles.progressFill, width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }} />
                </View>
                {steps.map((step, index) => (
                    <TouchableOpacity key={index} onPress={() => updateProgress(index + 1)} style={[styles.circle, index < currentStep && styles.activeCircle]}>
                        <Text style={styles.label}>{step}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '80%',
        justifyContent: 'space-between',
    },
    progress: {
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '100%',
        height: 5,
        backgroundColor: '#ddd',
        zIndex: -1,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4caf50',
        transition: 'width 0.3s',
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    activeCircle: {
        backgroundColor: '#4caf50',
    },
    label: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        position: 'absolute',
        top: 50,
        width: 80,
        textAlign: 'center',
        left: '50%',
        transform: [{ translateX: -40 }],
    },
});

export default ProgressBar;
