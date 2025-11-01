import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Switch, 
  Alert, 
  Linking,
  ScrollView // YENİ: Kaydırma eklendi
} from 'react-native';
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
  danger: '#ff4d4d',
  warning: '#E69B00', // Turuncu/Uyarı rengi
  switchOn: '#8B0000',
  switchOff: '#767577',
  iconColor: '#555',
};
const gradientColors = [Colors.background, '#FAEEDD'];

// GÜNCELLENDİ: 'onResetKnownWords' prop'u eklendi
export default function AyarlarScreen({ 
  onGoBack, 
  onDataReset, 
  isMusicOn, 
  onToggleMusic,
  onResetKnownWords 
}) {
  
  // "Tüm Verileri Sıfırla" için onay
  const showResetAllDataDialog = () => {
    return Alert.alert(
      "Emin misiniz?",
      "Tüm istatistikleriniz, kelime defteriniz ve öğrenilen kelime hafızanız kalıcı olarak silinecek. Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Hepsini Sil",
          onPress: onDataReset, 
          style: "destructive",
        },
      ]
    );
  };

  // YENİ: "Öğrenilenleri Sıfırla" için onay
  const showResetKnownWordsDialog = () => {
    return Alert.alert(
      "Öğrenilen Kelimeler Sıfırlansın mı?",
      "Bu işlem, 'bilinen' olarak işaretlenen tüm kelimeleri sıfırlar ve tekrar sorulmalarını sağlar. (İstatistikleriniz ve kelime defteriniz silinmez.)",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sıfırla",
          onPress: () => {
            onResetKnownWords();
            // Kullanıcıya geri bildirim ver
            Alert.alert(
              "Sıfırlandı", 
              "Öğrenilen kelimeler hafızası temizlendi. Kelimeler tekrar sorulacak."
            );
          },
          style: "destructive", // Kırmızı 'Sıfırla' yazısı
        },
      ]
    );
  };


  // Harici link açma
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Link açılamadı", err));
  };


  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* 1. BÖLÜM: HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ayarlar</Text>
          <View style={{ width: 50 }} /> 
        </View>

        {/* 2. BÖLÜM: AYAR LİSTESİ */}
        <ScrollView style={styles.content}>
          
          {/* BÖLÜM: SES */}
          <Text style={styles.sectionTitle}>SES</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>Oyun Müziği</Text>
            <Switch
              trackColor={{ false: Colors.switchOff, true: Colors.switchOn }}
              thumbColor={isMusicOn ? Colors.primary : "#f4f3f4"}
              onValueChange={onToggleMusic}
              value={isMusicOn}
            />
          </View>

          {/* BÖLÜM: VERİ */}
          <Text style={styles.sectionTitle}>VERİ YÖNETİMİ</Text>
          
          {/* GÜNCELLENDİ: Açıklama metni eklendi */}
          <TouchableOpacity style={styles.itemWithDescription} onPress={showResetKnownWordsDialog}>
            <View style={styles.itemTopRow}>
              <Text style={[styles.itemText, styles.warningText]}>Öğrenilen Kelimeleri Sıfırla</Text>
              <Ionicons name="chevron-forward" size={24} color={Colors.iconColor} />
            </View>
            <Text style={styles.itemDescription}>
              Doğru bildiğiniz kelimeler havuzdan çıkarılır. Bu buton, havuzu sıfırlayarak o kelimelerin tekrar sorulmasını sağlar.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={showResetAllDataDialog}>
            <Text style={[styles.itemText, styles.dangerText]}>Tüm Uygulama Verilerini Sıfırla</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.iconColor} />
          </TouchableOpacity>


          {/* BÖLÜM: DESTEK & HUKUKİ */}
          <Text style={styles.sectionTitle}>DESTEK & HUKUKİ</Text>
          <TouchableOpacity style={styles.item} onPress={() => openLink('https://www.google.com')}>
            <Text style={styles.itemText}>Gizlilik Politikası</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.iconColor} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.item} onPress={() => openLink('https://www.google.com')}>
            <Text style={styles.itemText}>Kullanım Şartları</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => openLink('mailto:destek@kelimeinuriye.com')}>
            <Text style={styles.itemText}>Bize Ulaşın / Geri Bildirim</Text>
            <Ionicons name="chevron-forward" size={24} color={Colors.iconColor} />
          </TouchableOpacity>

          <View style={[styles.item, styles.itemDisabled]}>
            <Text style={styles.itemText}>Sürüm</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- STİLLER ---
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
    color: '#888',
    fontSize: 14,
    fontFamily: 'Vollkorn_700Bold',
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: 5,
  },
  item: {
    backgroundColor: Colors.lightPaper,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // YENİ: Açıklamalı item için ana container
  itemWithDescription: {
    backgroundColor: Colors.lightPaper,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // YENİ: Açıklamalı item'in üst satırı (Başlık + ikon)
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // YENİ: Açıklama metni stili
  itemDescription: {
    color: '#666', // Hafif soluk renk
    fontSize: 13,
    fontFamily: 'Vollkorn_400Regular',
    marginTop: 8,
    lineHeight: 18,
  },
  itemDisabled: { // Tıklanamayan sürüm bilgisi için
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  itemText: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'Vollkorn_400Regular',
  },
  dangerText: {
    color: Colors.danger, // Kırmızı renk
    fontFamily: 'Vollkorn_700Bold',
  },
  warningText: { // YENİ
    color: Colors.warning, // Turuncu/Sarı renk
    fontFamily: 'Vollkorn_700Bold',
  },
  versionText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Vollkorn_400Regular',
  },
});

