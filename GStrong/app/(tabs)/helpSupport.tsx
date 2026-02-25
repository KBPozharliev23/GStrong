import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How do I track my workouts?',
    answer: 'You can track your workouts by going to the Home tab and tapping on "Quick Start Workout". Select your exercises, log your sets and reps, and save your workout when done.',
    category: 'Workouts',
  },
  {
    id: '2',
    question: 'What is the Bingo feature?',
    answer: 'The Bingo feature gamifies your fitness journey! Complete different workout challenges to fill your bingo card and earn points and achievements.',
    category: 'Features',
  },
  {
    id: '4',
    question: 'How are points calculated?',
    answer: 'You earn points by completing workouts, maintaining streaks, and achieving fitness goals. Different activities have different point values based on difficulty.',
    category: 'Points & Rewards',
  },
  {
    id: '5',
    question: 'Can I use the app offline?',
    answer: 'Yes! Most features work offline. Your data will sync automatically when you reconnect to the internet.',
    category: 'Technical',
  },
  {
    id: '6',
    question: 'How do I reset my password?',
    answer: 'On the login screen, tap "Forgot password?" and follow the instructions. You\'ll receive a password reset link via email.',
    category: 'Account',
  },
  {
    id: '7',
    question: 'What is a workout streak?',
    answer: 'A streak tracks consecutive days you\'ve completed workouts. The longer your streak, the more bonus points you earn!',
    category: 'Workouts',
  },
  {
    id: '8',
    question: 'How do I contact support?',
    answer: 'You can reach us at support@gstrong.com or use the "Contact Us" button below. We typically respond within 24 hours.',
    category: 'Support',
  },
];

const CATEGORIES = ['All', 'Workouts', 'Features', 'Account', 'Points & Rewards', 'Technical', 'Support'];

export default function HelpSupport() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? FAQS 
    : FAQS.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <LinearGradient colors={["#16295eff", "#04091aff"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>Find answers to common questions</Text>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryBtn,
                selectedCategory === category && styles.categoryBtnActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ List */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleFAQ(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqQuestionContainer}>
                  <Text style={styles.faqCategory}>{faq.category}</Text>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                </View>
                <Ionicons
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#60A5FA"
                />
              </View>
              {expandedId === faq.id && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Contact Support Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>
              Our support team is here to assist you
            </Text>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="mail-outline" size={20} color="white" />
              <Text style={styles.contactBtnText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  categoryBtnActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#60A5FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  faqCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqQuestionContainer: {
    flex: 1,
  },
  faqCategory: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  faqQuestion: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswer: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  contactTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactBtn: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  contactBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});