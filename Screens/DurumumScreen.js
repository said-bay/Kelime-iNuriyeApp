import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- TEMA VE RENKLER ---
const Colors = {
  background: '#FDF8F0',
  text: '#3D3D3D',
  primary: '#8B0000',
  secondary: '#005A9C',
  lightPaper: '#FFFFFF',
  correct: '#28a745',
  incorrect: '#dc3545',
  progressBackground: '#e0e0e0',
};
const gradientColors = [Colors.background, '#FAEEDD'];

// GÜNCELLENDİ: 'correctCount' ve 'wrongCount' proplarını alıyor
export default function DurumumScreen({ onGoBack, correctCount, wrongCount }) {
  
  // --- İSTATİSTİK HESAPLAMALARI ---
  const totalPlayed = correctCount + wrongCount;
  
  // Yüzde hesaplama (NaN hatasını önlemek için 0/0 kontrolü)
  const successPercentage = totalPlayed === 0 
    ? 0 
    : (correctCount / totalPlayed) * 100;
  
  // Yüzdeyi en yakın tam sayıya yuvarla
  const percentageRounded = Math.round(successPercentage);

  // --- İstatistik Kutusu Bileşeni ---
  // Tekrarı önlemek için küçük bir bileşen
  const StatBox = ({ label, value, color }) => (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: color || Colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* 1. BÖLÜM: HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Haftalık Durumum</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* 2. BÖLÜM: İSTATİSTİKLER */}
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>HAFTALIK KARNE</Text>
          
          {/* Ana Başarı Oranı Kutusu */}
          <View style={styles.mainScoreCard}>
            <Text style={styles.mainScoreLabel}>Başarı Oranı</Text>
            <Text style={styles.mainScoreValue}>{percentageRounded}%</Text>
            {/* İlerleme Çubuğu */}
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${percentageRounded}%` }]} />
            </View>
          </View>
          
          {/* Doğru ve Yanlış Sayıları */}
          <View style={styles.statRow}>
            <StatBox label="Doğru Cevap" value={correctCount} color={Colors.correct} />
            <StatBox label="Yanlış Cevap" value={wrongCount} color={Colors.incorrect} />
          </View>
          
          {/* GÜNCELLENDİ: "Yakında" yazısı kaldırıldı */}
          <Text style={styles.infoText}>
            İstatistikler her Pazartesi otomatik olarak sıfırlanır.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- STİLLER (Temaya uyarlandı ve yenilendi) ---
const styles = StyleSheet.create({
  gradient: { 
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 5,
    width: 50,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: 'Vollkorn_700Bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'Vollkorn_700Bold',
    marginBottom: 10,
    opacity: 0.7,
  },
  mainScoreCard: {
    backgroundColor: Colors.lightPaper,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  mainScoreLabel: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'Vollkorn_400Regular',
    opacity: 0.8,
  },
  mainScoreValue: {
    color: Colors.primary,
    fontSize: 72,
    fontFamily: 'CinzelDecorative_700Bold',
    marginVertical: 10,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: Colors.progressBackground,
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.correct,
    borderRadius: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: Colors.lightPaper,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%', // İki kutu yan yana
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'Vollkorn_400Regular',
    opacity: 0.7,
  },
  statValue: {
    color: Colors.text,
    fontSize: 42,
    fontFamily: 'Vollkorn_700Bold',
    marginVertical: 5,
  },
  infoText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'Vollkorn_400Regular',
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 20,
  },
});

