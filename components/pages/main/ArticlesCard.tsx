import { Card } from '@/components/base/Card';
import ArticleCard from '@/components/pages/main/ArticleCard';
import Animated from 'react-native-reanimated';
import React from 'react';
import { View, Text } from 'react-native';

interface ArticlesCardProps {
  className?: string;
}

const ArticlesCard: React.FC<ArticlesCardProps> = ({ className }) => {
  return (
    <Card className={`p-5 ${className}`}>
      <Text className='text-text-primary text-base font-semibold mb-4'>
        Whats burnout?
      </Text>
      <View className='-mx-5'>
        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='px-5'>
          <View className='flex-row gap-4'>
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </View>
        </Animated.ScrollView>
      </View>
      <Text className='text-text-primary text-base font-semibold mb-4 mt-8'>
        Good Habits
      </Text>
      <View className='-mx-5'>
        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='px-5'>
          <View className='flex-row gap-4'>
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </View>
        </Animated.ScrollView>
      </View>
    </Card>
  );
};

export default ArticlesCard;