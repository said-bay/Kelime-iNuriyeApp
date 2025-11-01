import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// YENİ: Telefon hafızası için import eklendi
import AsyncStorage from '@react-native-async-storage/async-storage';

// Font Yükleme
import {
  useFonts,
  Vollkorn_400Regular,
  Vollkorn_700Bold,
} from '@expo-google-fonts/vollkorn';
import { CinzelDecorative_700Bold } from '@expo-google-fonts/cinzel-decorative';

// Ekranlar
import GameScreen from './Screens/GameScreen';
import DefterimScreen from './Screens/DefterimScreen';
import AyarlarScreen from './Screens/AyarlarScreen';
// DÜZELTİLDİ: Klasör adındaki 'İ' harfi 'i' olarak düzeltildi
import DurumumScreen from './Screens/DurumumScreen';

// --- TEMA VE RENKLER ---
const Colors = {
  background: '#FDF8F0',
  text: '#3D3D3D',
  primary: '#8B0000',
  secondary: '#005A9C',
  lightPaper: '#FFFFFF',
};
const gradientColors = [Colors.background, '#FAEEDD'];

// YENİ: Hafıza için anahtar (key)
const STATS_STORAGE_KEY = '@stats_last_reset_week';

export default function App() {
  // --- STATE (DURUM) YÖNETİMİ ---
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isDefterimOpen, setIsDefterimOpen] = useState(false);
  const [isAyarlarOpen, setIsAyarlarOpen] = useState(false);
  const [isDurumumOpen, setIsDurumumOpen] = useState(false);
  
  // İstatistikler
  const [wrongWords, setWrongWords] = useState([]);
  const [correctWordCount, setCorrectWordCount] = useState(0); 
  const [knownWordIds, setKnownWordIds] = useState([]);

  // Ses
  const [isMusicOn, setIsMusicOn] = useState(true);

  // --- FONT YÜKLEYİCİ ---
  let [fontsLoaded] = useFonts({
    Vollkorn_400Regular,
    Vollkorn_700Bold,
    CinzelDecorative_700Bold,
  });

  // --- ANDROID GERİ TUŞU YÖNETİMİ ---
  useEffect(() => {
    // ... (Mevcut geri tuşu kodunuz - değişiklik yok)
    const backAction = () => {
      if (isGameStarted) {
        setIsGameStarted(false);
        return true;
      }
      if (isDefterimOpen) {
        setIsDefterimOpen(false);
        return true;
      }
      if (isAyarlarOpen) {
        setIsAyarlarOpen(false);
        return true;
      }
      if (isDurumumOpen) {
        setIsDurumumOpen(false);
        return true;
      }
      Alert.alert(
        "Çıkmak istediğinize emin misiniz?",
        "",
        [
          { text: "Vazgeç", style: "cancel", onPress: () => null },
          { text: "Çık", style: "destructive", onPress: () => BackHandler.exitApp() }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [isGameStarted, isDefterimOpen, isAyarlarOpen, isDurumumOpen]);

  // YENİ: HAFTALIK İSTATİSTİK SIFIRLAMA KONTROLÜ
  useEffect(() => {
    // Bu fonksiyon, Pazar'ı 0, Pazartesi'yi 1 kabul eder
    // ve haftanın başlangıcını (Pazartesi) YYYY-MM-DD formatında verir.
    const getStartOfWeek = (date) => {
      const dateCopy = new Date(date.getTime());
      const day = dateCopy.getDay(); // 0 (Pazar) - 6 (Cumartesi)
      const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1); // Pazar (0) ise 6 gün geri git (Pazartesi'ye)
      const monday = new Date(dateCopy.setDate(diff));
      monday.setHours(0, 0, 0, 0); // Günün başına al
      return monday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    };

    const checkWeeklyReset = async () => {
      try {
        const today = new Date(); // Bugünün tarihi
        const currentWeekStart = getStartOfWeek(today); // Bu haftanın Pazartesi'sinin tarihi
        
        const lastResetWeekStart = await AsyncStorage.getItem(STATS_STORAGE_KEY);
        
        // Eğer hafızada kayıt yoksa VEYA kayıtlı tarih bu haftanın başından eskiyse
        if (lastResetWeekStart === null || lastResetWeekStart < currentWeekStart) {
          console.log('Yeni hafta algılandı. İstatistikler sıfırlanıyor...');
          
          // SADECE İSTATİSTİKLERİ SIFIRLA
          // (knownWordIds'e dokunma)
          setCorrectWordCount(0);
          setWrongWords([]);
          
          // Yeni haftanın tarihini hafızaya kaydet
          await AsyncStorage.setItem(STATS_STORAGE_KEY, currentWeekStart);
        } else {
          console.log('Aynı hafta içindeyiz. İstatistikler korundu.');
        }
      } catch (e) {
        console.error('Haftalık sıfırlama kontrolü başarısız:', e);
      }
    };

    // Uygulama açıldığında bu kontrolü yap
    checkWeeklyReset();
  }, []); // Sadece uygulama ilk açıldığında bir kez çalışır


  // --- ANA FONKSİYONLAR (HANDLERS) ---

  const handleWordWrong = (word) => {
    // ... (Değişiklik yok)
    if (!wrongWords.find(w => w.id === word.id)) {
      setWrongWords(prevList => [...prevList, word]);
    }
  };

  const handleWordCorrect = (word) => {
    // ... (Değişiklik yok)
    setCorrectWordCount(prevCount => prevCount + 1);
    if (!knownWordIds.includes(word.id)) {
      setKnownWordIds(prevList => [...prevList, word.id]);
    }
  };

  const handleRemoveWord = (wordId) => {
    // ... (Değişiklik yok)
    setWrongWords(prevList => prevList.filter(w => w.id !== wordId));
  };

  // GÜNCELLENDİ: Manuel sıfırlama, haftalık sayacı da temizlemeli
  const handleDataReset = async () => {
    setWrongWords([]);
    setCorrectWordCount(0);
    setKnownWordIds([]);
    setIsAyarlarOpen(false); 
    // YENİ: Haftalık sıfırlama tarihini de hafızadan sil
    try {
      await AsyncStorage.removeItem(STATS_STORAGE_KEY);
    } catch(e) {
      console.error('AsyncStorage temizlenirken hata:', e);
    }
    console.log("Tüm veriler sıfırlandı.");
  };

  const handleResetKnownWords = () => {
    // ... (Değişiklik yok)
    setKnownWordIds([]);
    console.log("Öğrenilen kelimeler sıfırlandı.");
  };

  const onToggleMusic = () => setIsMusicOn(prev => !prev);

  // --- GÖRÜNÜM (RENDER) MANTIĞI ---

  if (!fontsLoaded) {
    return null;
  }

  // 1. Durum: Ayarlar AÇIKSA
  if (isAyarlarOpen) {
    return (
      <AyarlarScreen
        onGoBack={() => setIsAyarlarOpen(false)}
        onDataReset={handleDataReset}
        isMusicOn={isMusicOn}
        onToggleMusic={onToggleMusic}
        onResetKnownWords={handleResetKnownWords}
      />
    );
  }

  // 2. Durum: Defterim AÇIKSA
  if (isDefterimOpen) {
    // ... (Değişiklik yok)
    return (
      <DefterimScreen
        words={wrongWords}
        onGoBack={() => setIsDefterimOpen(false)}
        onRemoveWord={handleRemoveWord}
      />
    );
  }

  // 3. Durum: Durumum AÇIKSA
  if (isDurumumOpen) {
    // ... (Değişiklik yok)
    return (
      <DurumumScreen
        onGoBack={() => setIsDurumumOpen(false)}
        correctCount={correctWordCount}
        wrongCount={wrongWords.length}
      />
    );
  }

  // 4. Durum: Oyun BAŞLADIYSA
  if (isGameStarted) {
    // ... (Değişiklik yok)
    return (
      <GameScreen
        onGoBack={() => setIsGameStarted(false)}
        onWordWrong={handleWordWrong}
        onWordCorrect={(word) => handleWordCorrect(word)}
        isMusicOn={isMusicOn}
        knownWordIds={knownWordIds}
      />
    );
  }

  // 5. Durum: Hiçbiri değilse (ANA MENÜ)
  return (
    <LinearGradient colors={gradientColors} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        
        {/* 1. BÖLÜM: HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsAyarlarOpen(true)}
          >
            <Ionicons name="settings-outline" size={30} color={Colors.text} />
            <Text style={styles.iconText}>Ayarlar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsDefterimOpen(true)}
          >
            <Ionicons name="book-outline" size={30} color={Colors.text} />
            <Text style={styles.iconText}>Kelime Defterim</Text>
          </TouchableOpacity>
        </View>

        {/* 2. BÖLÜM: CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>Kelime-i Nuriye</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsGameStarted(true)}
          >
            <Ionicons name="play" size={50} color={Colors.lightPaper} />
          </TouchableOpacity>
        </View>

        {/* 3. BÖLÜM: FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.durumumButton}
            onPress={() => setIsDurumumOpen(true)}
          >
            <Ionicons name="stats-chart-outline" size={24} color={Colors.text} />
            <Text style={styles.durumumButtonText}>Durumum</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

// STİLLER
const styles = StyleSheet.create({
  // ... (Mevcut stilleriniz - değişiklik yok)
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    padding: 10,
  },
  iconText: {
    color: Colors.text,
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Vollkorn_400Regular',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: Colors.text,
    fontFamily: 'CinzelDecorative_700Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  playButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  footer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durumumButton: {
    flexDirection: 'row',
    backgroundColor: Colors.lightPaper,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  durumumButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'Vollkorn_700Bold',
    marginLeft: 10,
  },
});

