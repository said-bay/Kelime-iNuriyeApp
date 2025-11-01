import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  Alert // YENİ: Uyarı için eklendi
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av'; 

import tumKelimeler from '../kelimeler.json';

// --- TEMA VE RENKLER ---
const Colors = {
  background: '#FDF8F0', // Sıcak bej / Krem
  text: '#3D3D3D',
  primary: '#8B0000',     // Koyu Kırmızı
  secondary: '#005A9C',   // Koyu Mavi
  lightPaper: '#FFFFFF',
  correct: '#28a745',
  incorrect: '#dc3545',
};
const gradientColors = [Colors.background, '#FAEEDD'];


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// GÜNCELLENDİ: 'onWordCorrect' ve 'knownWordIds' propları eklendi
export default function GameScreen({ onGoBack, onWordWrong, isMusicOn, onWordCorrect, knownWordIds }) {
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [options, setOptions] = useState([]); 
  const [score, setScore] = useState(0); 
  const [selectedAnlam, setSelectedAnlam] = useState(null);
  
  const [sound, setSound] = useState(null);

  // --- Müzik Efekti ---
  useEffect(() => {
    let soundObject = null;

    async function loadAndPlayMusic() {
      if (!isMusicOn) return; 
      
      try {
        const { sound } = await Audio.Sound.createAsync(
           require('../assets/music.mp3'),
           { isLooping: true, volume: 0.3 } 
        );
        soundObject = sound;
        setSound(soundObject);
        
        await soundObject.playAsync();
      } catch (e) {
        console.warn("Müzik dosyası yüklenemedi veya çalınamadı.", e);
      }
    }

    loadAndPlayMusic();

    return () => {
      if (soundObject) {
        console.log('Müzik durduruluyor...');
        soundObject.unloadAsync(); 
      }
    };
  }, []); // Sadece bir kez çalışır


  // GÜNCELLENDİ: 'knownWordIds' listesine göre filtreleme eklendi
  const setupNewQuestion = () => {
    setSelectedAnlam(null); 

    // YENİ: Bilinen kelimeleri filtrele
    // (knownWordIds undefined ise diye [] varsay)
    const sorulabilecekKelimeler = tumKelimeler.filter(
      (word) => !(knownWordIds || []).includes(word.id)
    );

    // YENİ: Eğer sorulacak kelime kalmadıysa
    if (sorulabilecekKelimeler.length === 0) {
      Alert.alert(
        "Tebrikler!",
        "Tüm kelimeleri öğrendiniz. İsterseniz ayarlardan öğrenilen kelimeleri sıfırlayabilirsiniz.",
        [{ text: "Tamam", onPress: onGoBack }]
      );
      return;
    }

    // Doğru cevabı filtrelenmiş listeden seç
    const dogruCevap = sorulabilecekKelimeler[Math.floor(Math.random() * sorulabilecekKelimeler.length)];
    
    let siklar = [dogruCevap.anlam];

    // Şıkları oluştururken tüm kelimeleri kullan (çeşitlilik için)
    while (siklar.length < 4) {
      const rastgeleKelime = tumKelimeler[Math.floor(Math.random() * tumKelimeler.length)];
      if (!siklar.includes(rastgeleKelime.anlam)) {
        siklar.push(rastgeleKelime.anlam);
      }
    }

    setCurrentQuestion(dogruCevap); 
    setOptions(shuffleArray(siklar)); 
  };

  // GÜNCELLENDİ: 'onWordCorrect' artık kelimenin kendisini yolluyor
  const handleAnswer = (pressedAnlam) => { 
    if (selectedAnlam !== null) return; 

    setSelectedAnlam(pressedAnlam); 

    let isCorrect = false;
    if (pressedAnlam === currentQuestion.anlam) { 
      setScore(prevScore => prevScore + 1);
      isCorrect = true;
      if (onWordCorrect) {
        // GÜNCELLENDİ: App.js'e sadece 'true' değil, 'word' objesini yolla
        onWordCorrect(currentQuestion); 
      }
    } else {
      setScore(0);
      onWordWrong(currentQuestion);
    }

    setTimeout(() => {
      setupNewQuestion();
    }, 1000); 
  };

  useEffect(() => {
    setupNewQuestion();
  }, []); // Sadece ilk açılışta çalışır

  // ... (getButtonStyle fonksiyonu aynı)
  const getButtonStyle = (optionText) => {
    if (selectedAnlam === null) {
      return styles.optionButton;
    }
    if (optionText === currentQuestion.anlam) {
      return [styles.optionButton, styles.correctButton];
    }
    if (optionText === selectedAnlam && selectedAnlam !== currentQuestion.anlam) {
      return [styles.optionButton, styles.incorrectButton];
    }
    return [styles.optionButton, styles.disabledButton];
  };


  if (!currentQuestion) {
    return (
      <LinearGradient colors={gradientColors} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Seri: {score}</Text> 
          <View style={{ width: 50 }} /> 
        </View>

        <View style={styles.content}>
          <Text style={styles.questionWord}>{currentQuestion.kelime}</Text> 
        </View>

        <View style={styles.footer}>
          {options.map((optionText) => (
            <TouchableOpacity 
              key={optionText} 
              style={getButtonStyle(optionText)} 
              onPress={() => handleAnswer(optionText)}
              disabled={selectedAnlam !== null} 
            >
              <Text style={styles.optionText}>{optionText}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// STİLLER (Sizin kodunuzla aynı)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: { 
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
    width: 50,
  },
  headerText: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: 'Vollkorn_700Bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionWord: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text, // Temaya uyarlandı
    fontFamily: 'Vollkorn_700Bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  footer: {
    padding: 20,
  },
  optionButton: {
    backgroundColor: Colors.lightPaper, // Temaya uyarlandı
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    color: Colors.text, // Temaya uyarlandı
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Vollkorn_400Regular',
  },
  correctButton: {
    backgroundColor: Colors.correct, 
    borderColor: Colors.correct,
  },
  incorrectButton: {
    backgroundColor: Colors.incorrect, 
    borderColor: Colors.incorrect,
  },
  disabledButton: {
    opacity: 0.6, 
  }
});

