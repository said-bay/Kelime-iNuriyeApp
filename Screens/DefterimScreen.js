import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ListRenderItemInfo,
  Dimensions, // YENİ
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view'; // YENİ

// --- TEMA VE RENKLER ---
const Colors = {
  background: '#FDF8F0', // Sıcak bej / Krem
  text: '#3D3D3D',
  primary: '#8B0000',     // Koyu Kırmızı
  secondary: '#005A9C',   // Koyu Mavi
  lightPaper: '#FFFFFF',
  danger: '#D9534F', // Silme butonu için kırmızı
};
const gradientColors = [Colors.background, '#FAEEDD'];
const screenWidth = Dimensions.get('window').width; // Ekran genişliği

// GÜNCELLENDİ: Artık 3. prop olarak onRemoveWord alıyor
export default function DefterimScreen({ onGoBack, words, onRemoveWord }) {
  
  // YENİ: Silme fonksiyonu
  const deleteWord = (wordId) => {
    // App.js'e kelimenin ID'sini yolla, o silsin
    if (onRemoveWord) {
      onRemoveWord(wordId);
    }
  };

  // YENİ: Kaydırma listesinin ön yüzü (görünür olan)
  const renderItem = (data) => (
    <View style={styles.wordCard}>
      <Text style={styles.wordKelime}>{data.item.kelime}</Text>
      <Text style={styles.wordAnlam}>{data.item.anlam}</Text>
    </View>
  );

  // YENİ: Kaydırma listesinin arka yüzü (kayınca çıkan buton)
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteWord(data.item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text style={styles.deleteButtonText}>Kaldır</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* 1. Üst Kısım: Geri Butonu ve Başlık */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack}>
            <Ionicons name="chevron-back" size={32} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kelime Defterim</Text>
          <View style={{ width: 50 }} /> {/* Sahte boşluk */}
        </View>

        {/* 2. Alt Kısım: Kelime Listesi */}
        {/* YENİ: FlatList yerine SwipeListView kullanıyoruz */}
        <SwipeListView
          data={words} 
          renderItem={renderItem} 
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id.toString()} 
          
          rightOpenValue={-100} // Sağa doğru ne kadar açılacağı (buton genişliği)
          disableRightSwipe // Sola kaydırmayı engelle
          stopRightSwipe={-110} // Maksimum ne kadar açılabileceği
          
          // Eğer liste boşsa
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz yanlış yaptığınız</Text>
              <Text style={styles.emptyText}>kelime bulunmuyor.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// Stil kodları (Yenilendi)
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.lightPaper,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: 'CinzelDecorative_700Bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100, 
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    fontFamily: 'Vollkorn_400Regular',
  },
  wordCard: {
    backgroundColor: Colors.lightPaper, // Arka planla aynı renk
    padding: 20,
    marginVertical: 8, 
    marginHorizontal: 16, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wordKelime: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: 'Vollkorn_700Bold',
  },
  wordAnlam: {
    color: '#555',
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'Vollkorn_400Regular',
  },
  // --- YENİ Stiller (Kaydırma Butonu için) ---
  rowBack: {
    alignItems: 'center',
    backgroundColor: Colors.danger, // Kırmızı arka plan
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 8, 
    marginHorizontal: 16, 
    borderRadius: 10,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Vollkorn_700Bold',
    marginTop: 4,
  }
});

