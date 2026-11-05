
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../../src/lib/supabase';
export default function AuthCallback() {
  const url = Linking.useURL();
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    async function handleCallback() {
      try {
        const parsedUrl = new URL(url!);

        // Supabase may return parameters in the query string
        // or in the URL hash, depending on the authentication flow.
        const params = new URLSearchParams(parsedUrl.search);
        const hash = parsedUrl.hash.startsWith('#')
          ? parsedUrl.hash.slice(1)
          : parsedUrl.hash;

        const hashParams = new URLSearchParams(hash);

        hashParams.forEach((value, key) => {
          if (!params.has(key)) {
            params.set(key, value);
          }
        });

        const errorDescription =
          params.get('error_description') ?? params.get('error');

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        const code = params.get('code');

        if (code) {
          // PKCE authentication flow
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;
        } else {
          // Implicit authentication flow
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (!accessToken || !refreshToken) {
            throw new Error(
              'The link has expired or does not contain valid session details. Please request a new confirmation email.'
            );
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;
        }

        if (!cancelled) {
          setMessage(
            'Your email has been confirmed! You can return to LinkedJob.'
          );
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error instanceof Error
              ? `Confirmation failed: ${error.message}`
              : 'Confirmation failed. Please request a new email link.'
          );
        }
      }
    }

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16, textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  );
}

