import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { ArrowLeftIcon, ClipboardDocumentCheckIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default function ViewPrescriptionScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const prescriptions = [
    {
      id: '1',
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      datePrescribed: '2024-03-15',
    },
    {
      id: '2',
      medicationName: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'As needed',
      datePrescribed: '2024-03-10',
    },
    {
      id: '3',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      datePrescribed: '2024-03-05',
    },
  ];

  const handleDownloadPDF = () => {
    alert('PDF download functionality will be implemented');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border || '#ccc' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t.viewPrescription}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {prescriptions.map((prescription) => (
          <View key={prescription.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.medicationName, { color: colors.text }]}>
                {prescription.medicationName}
              </Text>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {prescription.datePrescribed}
              </Text>
            </View>
            <View style={styles.cardDetails}>
              <DetailItem label={t.dosage} value={prescription.dosage} colors={colors} />
              <DetailItem label={t.frequency} value={prescription.frequency} colors={colors} />
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: colors.primary }]}
          onPress={handleDownloadPDF}
        >
          <ClipboardDocumentCheckIcon size={24} color="white" />
          <Text style={styles.downloadButtonText}>{t.downloadPDF}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({ label, value, colors }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}:</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
