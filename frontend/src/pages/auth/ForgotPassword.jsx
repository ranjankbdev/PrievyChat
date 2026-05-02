import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sendPasswordResetOtpAPI,
  verifyPasswordResetOtpAPI,
  resetUserPasswordAPI,
} from '../../services/authService.js';
import showToast from '../../utils/toastHelper.js';
import Spinner from '../../components/common/Spinner.jsx';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await sendPasswordResetOtpAPI({ email });
      showToast('OTP has been sent to your registered Email!', 'info');
      setStep(2);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await verifyPasswordResetOtpAPI({ email, otp });
      showToast('OTP verified successfully!', 'success');
      setStep(3);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return showToast('Passwords do not match!', 'error');
    }
    try {
      setLoading(true);
      await resetUserPasswordAPI({ email, newPassword });
      showToast('Password reset successful!', 'success');
      navigate('/');
      setConfirmPassword('');
      setNewPassword('');
      setEmail('');
      setOtp('');
      setStep(1);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-bg border-0 p-3">
          <div className="d-flex align-items-center mb-3 position-relative border-bottom border-secondary pb-3">
            {/* back button */}
            <button
              onClick={() => navigate('/')}
              className="btn px-2 py-1 position-absolute pt-2 close-btn-hover"
            >
              <i className="fa-solid fa-arrow-left fs-4"></i>
            </button>

            {/* center title */}
            <h5 className="w-100 text-center text-white m-0">Forgot-Password</h5>
          </div>

          {step === 1 && (
            <>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">
                  Email
                </label>
                <input
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className="mt-4 btn-primary-custom w-100 position-relative"
                >
                  <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Send OTP</span>
                  {loading && <Spinner size="sm" />}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="otp" className="form-label text-white">
                  OTP
                </label>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="form-control"
                  id="otp"
                  placeholder="Enter OTP"
                  required
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="mt-4 btn-primary-custom w-100 position-relative"
                >
                  <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Verify</span>
                  {loading && <Spinner size="sm" />}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-white">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter new password"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="c-password" className="form-label text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="c-password"
                  placeholder="Confirm new password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <button
                disabled={loading || !newPassword || !confirmPassword}
                onClick={handleResetPassword}
                className="mt-4 btn-primary-custom w-100 position-relative"
              >
                <span style={{ visibility: loading ? 'hidden' : 'visible' }}>Change Password</span>
                {loading && <Spinner size="sm" />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
