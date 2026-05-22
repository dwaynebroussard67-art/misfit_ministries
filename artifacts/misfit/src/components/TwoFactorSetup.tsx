import { useState } from 'react';
import { useTwoFactor } from '../hooks/useTwoFactor';

interface TwoFactorSetupProps {
  userId: string;
  onComplete: () => void;
}

export function TwoFactorSetup({ userId, onComplete }: TwoFactorSetupProps) {
  const { setupTwoFactor, verifyTwoFactor, isLoading, error, backupCodes } = useTwoFactor(userId);
  const [step, setStep] = useState<'method' | 'contact' | 'verify' | 'backup'>('method');
  const [method, setMethod] = useState<'sms' | 'email'>('email');
  const [contact, setContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSetup = async () => {
    const success = await setupTwoFactor(method, contact);
    if (success) {
      setStep('verify');
    }
  };

  const handleVerify = async () => {
    const success = await verifyTwoFactor(verificationCode);
    if (success) {
      setStep('backup');
    }
  };

  return (
    <div className=\"max-w-md mx-auto bg-surface p-8 rounded-lg\">
      <h2 className=\"text-2xl font-bold text-gold mb-6\">Enable Two-Factor Authentication</h2>

      {/* Step 1: Choose Method */}
      {step === 'method' && (
        <div>
          <p className=\"text-text-secondary mb-4\">Choose how you'd like to receive verification codes:</p>
          <div className=\"space-y-3 mb-6\">
            <label className=\"flex items-center p-3 border-2 border-dark-border rounded cursor-pointer hover:border-gold transition\">
              <input
                type=\"radio\"
                value=\"email\"
                checked={method === 'email'}
                onChange={e => setMethod(e.target.value as 'email' | 'sms')}
                className=\"mr-3\"
              />
              <span className=\"text-text-primary\">Email</span>
            </label>
            <label className=\"flex items-center p-3 border-2 border-dark-border rounded cursor-pointer hover:border-gold transition\">
              <input
                type=\"radio\"
                value=\"sms\"
                checked={method === 'sms'}
                onChange={e => setMethod(e.target.value as 'email' | 'sms')}
                className=\"mr-3\"
              />
              <span className=\"text-text-primary\">SMS</span>
            </label>
          </div>
          <button
            onClick={() => setStep('contact')}
            className=\"w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition\"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Enter Contact */}
      {step === 'contact' && (
        <div>
          <p className=\"text-text-secondary mb-4\">
            Enter your {method === 'email' ? 'email address' : 'phone number'}:
          </p>
          <input
            type={method === 'email' ? 'email' : 'tel'}
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder={method === 'email' ? 'your@email.com' : '+1 (555) 000-0000'}
            className=\"w-full bg-dark-border text-text-primary px-3 py-2 rounded mb-4\"
          />
          {error && <p className=\"text-red text-sm mb-4\">{error}</p>}
          <div className=\"flex gap-3\">
            <button
              onClick={() => setStep('method')}
              className=\"flex-1 bg-dark-border text-text-secondary px-4 py-2 rounded font-bold hover:bg-dark transition\"
            >
              Back
            </button>
            <button
              onClick={handleSetup}
              disabled={isLoading || !contact}
              className=\"flex-1 bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50\"
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Verify Code */}
      {step === 'verify' && (
        <div>
          <p className=\"text-text-secondary mb-4\">
            Enter the verification code sent to your {method}:
          </p>
          <input
            type=\"text\"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value.replace(/\\D/g, '').slice(0, 6))}
            placeholder=\"000000\"
            className=\"w-full bg-dark-border text-text-primary px-3 py-2 rounded mb-4 text-center text-2xl tracking-widest\"
          />
          {error && <p className=\"text-red text-sm mb-4\">{error}</p>}
          <button
            onClick={handleVerify}
            disabled={isLoading || verificationCode.length !== 6}
            className=\"w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50\"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      )}

      {/* Step 4: Backup Codes */}
      {step === 'backup' && (
        <div>
          <p className=\"text-text-secondary mb-4\">
            Save these backup codes in a safe place. You can use them if you lose access to your {method}:
          </p>
          <div className=\"bg-dark-border p-4 rounded mb-6 max-h-48 overflow-y-auto\">
            {backupCodes.map((code, i) => (
              <p key={i} className=\"text-gold font-mono text-sm mb-2\">
                {code}
              </p>
            ))}
          </div>
          <button
            onClick={onComplete}
            className=\"w-full bg-gold text-dark px-4 py-2 rounded font-bold hover:bg-yellow-600 transition\"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

