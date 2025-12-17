<template>
  <div class="ringtone-settings">
    <h3>{{ t('ringtone.title') }}</h3>
    
    <div class="ringtone-list">
      <!-- Preset Ringtones -->
      <div class="ringtone-section">
        <h4>{{ t('ringtone.presets') }}</h4>
        <div class="ringtone-grid">
          <div 
            v-for="ringtone in presetRingtones" 
            :key="ringtone.id"
            class="ringtone-card"
            :class="{ selected: selectedRingtoneId === ringtone.id }"
            role="button"
            tabindex="0"
            @click="selectRingtone(ringtone.id)"
            @keydown.enter="selectRingtone(ringtone.id)"
            @keydown.space.prevent="selectRingtone(ringtone.id)"
          >
            <span class="ringtone-icon">🔔</span>
            <span class="ringtone-name">{{ t(ringtone.name) }}</span>
            <button 
              class="btn-preview" 
              @click.stop="previewRingtone(ringtone)"
              :disabled="isPlaying"
              :aria-label="isPlaying && playingId === ringtone.id ? t('ringtone.stopPreview') : t('ringtone.preview')"
            >
              {{ isPlaying && playingId === ringtone.id ? '⏹️' : '▶️' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Ringtones -->
      <div class="ringtone-section">
        <h4>{{ t('ringtone.custom') }}</h4>
        <div class="ringtone-grid">
          <div 
            v-for="ringtone in customRingtones" 
            :key="ringtone.id"
            class="ringtone-card"
            :class="{ selected: selectedRingtoneId === ringtone.id }"
            role="button"
            tabindex="0"
            @click="selectRingtone(ringtone.id)"
            @keydown.enter="selectRingtone(ringtone.id)"
            @keydown.space.prevent="selectRingtone(ringtone.id)"
          >
            <span class="ringtone-icon">🎵</span>
            <span class="ringtone-name">{{ ringtone.name }}</span>
            <div class="ringtone-actions">
              <button 
                class="btn-preview" 
                @click.stop="previewRingtone(ringtone)"
                :disabled="isPlaying"
                :aria-label="isPlaying && playingId === ringtone.id ? t('ringtone.stopPreview') : t('ringtone.preview')"
              >
                {{ isPlaying && playingId === ringtone.id ? '⏹️' : '▶️' }}
              </button>
              <button 
                class="btn-delete" 
                @click.stop="deleteRingtone(ringtone.id)"
                :aria-label="t('ringtone.deleteLabel')"
              >
                🗑️
              </button>
            </div>
          </div>

          <!-- Upload Card -->
          <div 
            class="ringtone-card upload-card" 
            role="button"
            tabindex="0"
            @click="triggerUpload"
            @keydown.enter="triggerUpload"
            @keydown.space.prevent="triggerUpload"
          >
            <input 
              ref="fileInput"
              type="file" 
              :accept="ALLOWED_FORMATS.join(',')"
              @change="handleFileUpload"
              style="display: none;"
            />
            <span class="plus-icon">+</span>
            <span class="upload-text">{{ t('ringtone.upload') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Dialog -->
    <div 
      v-if="showUploadDialog" 
      class="upload-dialog-overlay" 
      @click.self="closeUploadDialog"
      @keydown.escape="closeUploadDialog"
    >
      <div 
        class="upload-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-dialog-title"
        ref="dialogRef"
      >
        <h4 id="upload-dialog-title">{{ t('ringtone.uploadTitle') }}</h4>
        <p class="file-name">{{ uploadFileName }}</p>
        <input 
          v-model="customRingtoneName"
          type="text"
          :placeholder="t('ringtone.namePlaceholder')"
          :maxlength="MAX_NAME_LENGTH"
          class="name-input"
          ref="nameInputRef"
          @keydown.enter="confirmUpload"
        />
        <div class="dialog-actions">
          <button class="btn btn-cancel" @click="closeUploadDialog">
            {{ t('ringtone.cancel') }}
          </button>
          <button class="btn btn-save" @click="confirmUpload">
            {{ t('ringtone.save') }}
          </button>
        </div>
        <p class="format-hint">{{ t('ringtone.formatHint') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Ringtone } from '../types';
import { useRingtoneStorage, ALLOWED_FORMATS } from '../composables/useRingtoneStorage';
import { useToast } from '../composables/useToast';
import { playRingtone, stopCurrentAudio } from '../utils/audio';

const { t } = useI18n();
const { showToast } = useToast();
const {
  selectedRingtoneId,
  customRingtones,
  allRingtones,
  selectRingtone: selectRingtoneStorage,
  addCustomRingtone,
  removeCustomRingtone,
  MAX_NAME_LENGTH,
} = useRingtoneStorage();

// Preview state
const isPlaying = ref(false);
const playingId = ref<string | null>(null);

// Upload state
const fileInput = ref<HTMLInputElement | null>(null);
const showUploadDialog = ref(false);
const uploadFileName = ref('');
const customRingtoneName = ref('');
const pendingFile = ref<File | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const nameInputRef = ref<HTMLInputElement | null>(null);

// Focus management for dialog
watch(showUploadDialog, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    nameInputRef.value?.focus();
  }
});

// Computed
const presetRingtones = computed<Ringtone[]>(() => {
  return allRingtones.value.filter(r => r.type === 'preset');
});

// Methods
function selectRingtone(id: string) {
  selectRingtoneStorage(id);
  showToast(t('ringtone.selected'), 'success');
}

async function previewRingtone(ringtone: Ringtone) {
  if (isPlaying.value) {
    stopCurrentAudio();
    isPlaying.value = false;
    playingId.value = null;
    return;
  }

  isPlaying.value = true;
  playingId.value = ringtone.id;

  try {
    await playRingtone(ringtone, 1);
  } catch (err) {
    console.error('Failed to preview ringtone:', err);
    showToast(t('ringtone.previewError'), 'error');
  } finally {
    isPlaying.value = false;
    playingId.value = null;
  }
}

function deleteRingtone(id: string) {
  removeCustomRingtone(id);
  showToast(t('ringtone.deleted'), 'success');
}

function triggerUpload() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  pendingFile.value = file;
  uploadFileName.value = file.name;
  customRingtoneName.value = file.name.replace(/\.[^/.]+$/, '');  // Remove extension
  showUploadDialog.value = true;
  
  // Reset input
  target.value = '';
}

function closeUploadDialog() {
  showUploadDialog.value = false;
  pendingFile.value = null;
  uploadFileName.value = '';
  customRingtoneName.value = '';
}

async function confirmUpload() {
  if (!pendingFile.value || !customRingtoneName.value.trim()) {
    showToast(t('ringtone.enterName'), 'error');
    return;
  }

  const result = await addCustomRingtone(pendingFile.value, customRingtoneName.value.trim());
  
  if (result.valid) {
    showToast(t('ringtone.uploaded'), 'success');
    closeUploadDialog();
  } else {
    const errorKey = `ringtone.${result.error}`;
    showToast(t(errorKey), 'error');
  }
}
</script>

<style scoped>
.ringtone-settings {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

h3 {
  font-size: 1.4rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

h4 {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.ringtone-section {
  margin-bottom: 1.5rem;
}

.ringtone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.ringtone-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ringtone-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.ringtone-card.selected {
  border-color: var(--primary-color);
  background: var(--primary-shadow-light);
}

.ringtone-icon {
  font-size: 1.5rem;
}

.ringtone-name {
  font-size: 0.9rem;
  color: var(--text-primary);
  text-align: center;
  word-break: break-word;
}

.ringtone-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-preview,
.btn-delete {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.btn-preview:hover {
  background: var(--primary-shadow-light);
}

.btn-delete:hover {
  background: rgba(255, 68, 68, 0.2);
}

.btn-preview:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-card {
  border-style: dashed;
  min-height: 100px;
  justify-content: center;
}

.plus-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.upload-text {
  color: var(--primary-color);
  font-size: 0.9rem;
}

/* Upload Dialog */
.upload-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.upload-dialog {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.upload-dialog h4 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.file-name {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  word-break: break-all;
}

.name-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.name-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: var(--text-tertiary);
  color: white;
}

.btn-cancel:hover {
  background: var(--text-secondary);
}

.btn-save {
  background: var(--primary-color);
  color: var(--bg-primary);
}

.btn-save:hover {
  background: #00dd77;
}

.format-hint {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .ringtone-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .upload-dialog {
    padding: 1.5rem;
  }
}
</style>
