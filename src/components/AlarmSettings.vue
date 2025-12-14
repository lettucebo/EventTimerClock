<template>
  <div class="alarm-settings">
    <div class="settings-header">
      <h2>{{ t('alarm.settings') }}</h2>
      <div class="mode-toggle">
        <button 
          @click="mode = 'preset'" 
          :class="{ active: mode === 'preset' }"
          class="toggle-btn"
        >
          {{ t('alarm.presetMode') }}
        </button>
        <button 
          @click="mode = 'custom'" 
          :class="{ active: mode === 'custom' }"
          class="toggle-btn"
        >
          {{ t('alarm.customMode') }}
        </button>
      </div>
    </div>

    <div v-if="mode === 'preset'" class="preset-section">
      <PresetTemplates 
        :custom-presets="customPresets"
        @select="selectPreset"
        @copy-and-edit="copyAndEditPreset"
        @delete="deletePreset"
        @add-custom="showCustomEditor"
      />
    </div>

    <div v-if="mode === 'custom'" class="custom-section">
      <TimePointEditor 
        :time-points="timePoints"
        @add="addTimePoint"
        @remove="removeTimePoint"
      />
      <div class="custom-actions">
        <input 
          v-model="customName" 
          type="text" 
          :placeholder="t('alarm.templateName')"
          class="custom-name-input"
        />
        <button @click="saveAsTemplate" class="btn btn-save">
          {{ t('alarm.saveAsTemplate') }}
        </button>
        <button @click="clearAll" class="btn btn-clear">
          {{ t('alarm.clearAll') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TimePoint, Preset } from '../types';
import { useToast } from '../composables/useToast';
import PresetTemplates from './PresetTemplates.vue';
import TimePointEditor from './TimePointEditor.vue';

const { t } = useI18n();
const { showToast } = useToast();

const props = defineProps<{
  timePoints: TimePoint[];
  customPresets: Preset[];
}>();

const emit = defineEmits<{
  selectPreset: [preset: Preset];
  addTimePoint: [timeInSeconds: number, ringCount: number];
  removeTimePoint: [id: string];
  clearTimePoints: [];
  saveCustomPreset: [preset: Preset];
  deleteCustomPreset: [id: string];
}>();

const mode = ref<'preset' | 'custom'>('preset');
const customName = ref('');

function selectPreset(preset: Preset) {
  emit('selectPreset', preset);
  // Stay in preset mode - don't switch to custom mode
}

function copyAndEditPreset(preset: Preset) {
  emit('selectPreset', preset);
  mode.value = 'custom';
}

function deletePreset(id: string) {
  emit('deleteCustomPreset', id);
}

function showCustomEditor() {
  mode.value = 'custom';
  emit('clearTimePoints');
}

function addTimePoint(timeInSeconds: number, ringCount: number) {
  emit('addTimePoint', timeInSeconds, ringCount);
}

function removeTimePoint(id: string) {
  emit('removeTimePoint', id);
}

function clearAll() {
  emit('clearTimePoints');
  customName.value = '';
}

function saveAsTemplate() {
  if (!customName.value.trim()) {
    showToast(t('toast.enterTemplateName'), 'error');
    return;
  }
  
  if (props.timePoints.length === 0) {
    showToast(t('toast.addTimePointFirst'), 'error');
    return;
  }

  const validTimes = props.timePoints
    .map(p => p.timeInSeconds)
    .filter(t => Number.isFinite(t) && t > 0);
  
  if (validTimes.length === 0) {
    showToast(t('toast.noValidTimePoints'), 'error');
    return;
  }
  
  const maxTime = Math.max(...validTimes);
  const preset: Preset = {
    id: 'custom-' + crypto.randomUUID(),
    name: customName.value,
    totalTime: maxTime,
    timePoints: props.timePoints.map(p => ({ ...p })),
  };

  emit('saveCustomPreset', preset);
  customName.value = '';
  showToast(t('toast.templateSaved'), 'success');
}
</script>

<style scoped>
.alarm-settings {
  background: var(--bg-card);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h2 {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin: 0;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-card);
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: var(--primary-color);
  color: var(--bg-primary);
  font-weight: 600;
}

.toggle-btn:hover:not(.active) {
  color: var(--primary-color);
}

.custom-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.custom-name-input {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--bg-card);
  color: var(--text-primary);
}

.custom-name-input:focus {
  outline: none;
  border-color: var(--border-hover);
}

.btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-save {
  background: var(--primary-color);
  color: var(--bg-primary);
}

.btn-save:hover {
  background: #00dd77;
}

.btn-clear {
  background: #ff4444;
  color: white;
}

.btn-clear:hover {
  background: #dd3333;
}

@media (max-width: 768px) {
  .settings-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .mode-toggle {
    width: 100%;
  }
  
  .toggle-btn {
    flex: 1;
  }
  
  .custom-actions {
    flex-direction: column;
  }
  
  .custom-name-input {
    width: 100%;
  }
}
</style>
