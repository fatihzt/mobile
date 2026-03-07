/**
 * Auth Stack Layout - Art Deco Design
 * Elegant authentication flow
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {
          backgroundColor: '#171612',
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          animation: 'fade',
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}
