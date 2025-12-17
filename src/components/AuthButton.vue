<template>
  <div class="auth-container">
    <!-- Not configured state -->
    <div v-if="!isConfigured" class="auth-not-configured">
      <span class="auth-icon">🔐</span>
      <span class="auth-text">{{ t('auth.notConfigured') }}</span>
    </div>

    <!-- Loading state -->
    <div v-else-if="isLoading" class="auth-loading">
      <span class="loading-spinner">⌛</span>
    </div>

    <!-- Authenticated state -->
    <div v-else-if="isAuthenticated" class="auth-user">
      <div class="user-info" @click="toggleDropdown">
        <img 
          v-if="user?.photoURL" 
          :src="user.photoURL" 
          :alt="user.displayName || t('auth.user')"
          class="user-avatar"
        />
        <span v-else class="user-avatar-placeholder">
          {{ getInitials(user?.displayName || user?.email) }}
        </span>
        <span class="user-name">{{ user?.displayName || user?.email || t('auth.user') }}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div v-if="showDropdown" class="user-dropdown">
        <div class="dropdown-info">
          <span class="provider-badge" :class="user?.provider">
            {{ user?.provider === 'google' ? 'Google' : user?.provider === 'microsoft' ? 'Microsoft' : '' }}
          </span>
          <span class="user-email">{{ user?.email }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <span>🚪</span>
          {{ t('auth.logout') }}
        </button>
      </div>
    </div>

    <!-- Unauthenticated state -->
    <div v-else class="auth-buttons">
      <button class="login-btn google-btn" @click="handleGoogleLogin" :disabled="isLoading">
        <svg class="provider-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{{ t('auth.signInWithGoogle') }}</span>
      </button>
      <button class="login-btn microsoft-btn" @click="handleMicrosoftLogin" :disabled="isLoading">
        <svg class="provider-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="#F25022" d="M1 1h10v10H1z"/>
          <path fill="#00A4EF" d="M1 13h10v10H1z"/>
          <path fill="#7FBA00" d="M13 1h10v10H13z"/>
          <path fill="#FFB900" d="M13 13h10v10H13z"/>
        </svg>
        <span>{{ t('auth.signInWithMicrosoft') }}</span>
      </button>
    </div>

    <!-- Error message -->
    <div v-if="error" class="auth-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuth } from '../composables/useAuth';

const { t } = useI18n();
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  isConfigured,
  signInWithGoogle,
  signInWithMicrosoft,
  logout,
  cleanup,
} = useAuth();

const showDropdown = ref(false);

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.auth-user')) {
    showDropdown.value = false;
  }
}

async function handleGoogleLogin() {
  await signInWithGoogle();
}

async function handleMicrosoftLogin() {
  await signInWithMicrosoft();
}

async function handleLogout() {
  showDropdown.value = false;
  await logout();
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  cleanup();
});
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.auth-not-configured {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--surface-color);
  border-radius: 8px;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.auth-icon {
  font-size: 1rem;
}

.auth-loading {
  padding: 0.5rem 1rem;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface-color);
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.login-btn:hover:not(:disabled) {
  background: var(--hover-color);
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.provider-icon {
  flex-shrink: 0;
}

.google-btn:hover:not(:disabled) {
  border-color: #4285F4;
}

.microsoft-btn:hover:not(:disabled) {
  border-color: #00A4EF;
}

.auth-user {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info:hover {
  background: var(--hover-color);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--text-color);
}

.dropdown-arrow {
  font-size: 0.625rem;
  color: var(--text-tertiary);
  transition: transform 0.2s ease;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
}

.dropdown-info {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.provider-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.provider-badge.google {
  background: #4285F41A;
  color: #4285F4;
}

.provider-badge.microsoft {
  background: #00A4EF1A;
  color: #00A4EF;
}

.user-email {
  display: block;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  word-break: break-all;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: var(--hover-color);
}

.auth-error {
  padding: 0.5rem;
  background: #ff4d4f1a;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 0.75rem;
  text-align: center;
  max-width: 200px;
}

@media (max-width: 768px) {
  .auth-buttons {
    width: 100%;
  }

  .login-btn {
    justify-content: center;
    width: 100%;
  }

  .user-name {
    display: none;
  }

  .user-dropdown {
    right: 0;
    left: auto;
  }
}
</style>
