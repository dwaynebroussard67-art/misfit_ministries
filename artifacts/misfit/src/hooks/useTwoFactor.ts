import { useState } from 'react';
import axios from 'axios';

export function useTwoFactor(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const setupTwoFactor = async (method: 'sms' | 'email', contact: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/2fa/setup', {
        userId,
        method,
        ...(method === 'sms' ? { phoneNumber: contact } : { email: contact }),
      });

      setBackupCodes(res.data.backupCodes);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to setup 2FA');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('/api/2fa/verify', {
        userId,
        code,
      });

      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid verification code');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestNewCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('/api/2fa/request-code', { userId });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to request code');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('/api/2fa/disable', { userId });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to disable 2FA');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setupTwoFactor,
    verifyTwoFactor,
    requestNewCode,
    disableTwoFactor,
    isLoading,
    error,
    backupCodes,
  };
}
