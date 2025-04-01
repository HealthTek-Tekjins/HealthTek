import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const AnalyticsScreen = () => {
  const { colors, isDarkMode } = useTheme();

  // Dummy data for various metrics
  const healthMetrics = {
    heartRate: {
      current: 72,
      average: 68,
      trend: '+2',
      unit: 'bpm',
    },
    bloodPressure: {
      current: '120/80',
      average: '118/78',
      trend: 'Stable',
      unit: 'mmHg',
    },
    steps: {
      current: 8432,
      average: 7500,
      trend: '+932',
      unit: 'steps',
    },
    sleep: {
      current: '7h 30m',
      average: '7h 15m',
      trend: '+15m',
      unit: 'hours',
    },
  };

  // Dummy data for heart rate chart
  const heartRateData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [68, 72, 70, 69, 71, 73, 72],
        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Dummy data for steps chart
  const stepsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [6500, 7200, 6800, 7500, 8200, 7800, 8432],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderMetricCard = (title, data) => (
    <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={[styles.metricValue, { color: colors.text }]}>{data.current}</Text>
        <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>{data.unit}</Text>
      </View>
      <View style={styles.metricDetails}>
        <Text style={[styles.metricDetail, { color: colors.textSecondary }]}>Avg: {data.average}</Text>
        <Text style={[styles.metricTrend, data.trend.startsWith('+') ? styles.positiveTrend : styles.negativeTrend]}>
          {data.trend}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Health Analytics</Text>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.metricsGrid}>
            {renderMetricCard('Heart Rate', healthMetrics.heartRate)}
            {renderMetricCard('Blood Pressure', healthMetrics.bloodPressure)}
            {renderMetricCard('Steps', healthMetrics.steps)}
            {renderMetricCard('Sleep', healthMetrics.sleep)}
          </View>

          <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Heart Rate Trend</Text>
            <LineChart
              data={heartRateData}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Daily Steps</Text>
            <BarChart
              data={stepsData}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  metricCard: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 14,
    marginLeft: 4,
  },
  metricDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricDetail: {
    fontSize: 12,
  },
  metricTrend: {
    fontSize: 12,
    fontWeight: '500',
  },
  positiveTrend: {
    color: '#2ecc71',
  },
  negativeTrend: {
    color: '#e74c3c',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default AnalyticsScreen; 