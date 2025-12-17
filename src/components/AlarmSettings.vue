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

      <!-- Auto Alarm Settings -->
      <div class="auto-alarm-section">
        <div class="auto-alarm-header">
          <h3>{{ t('alarm.autoAlarm') }}</h3>
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              :checked="autoAlarm.enabled"
              @change="toggleAutoAlarm"
            />
            <span class="slider"></span>
          </label>
        </div>
        <p class="auto-alarm-description">{{ t('alarm.autoAlarmDescription') }}</p>
        
        <div v-if="autoAlarm.enabled" class="auto-alarm-controls">
          <div class="control-group">
            <label>{{ t('alarm.interval') }}</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                :value="autoAlarm.intervalSeconds"
                @input="updateInterval"
                min="10"
                max="3600"
                class="number-input"
              />
              <span class="unit">{{ t('alarm.intervalSeconds') }}</span>
            </div>
          </div>
          
          <div class="control-group">
            <label>{{ t('alarm.autoRingCount') }}</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                :value="autoAlarm.ringCount"
                @input="updateRingCount"
                min="1"
                max="5"
                class="number-input"
              />
              <span class="unit">{{ t('alarm.times') }}</span>
            </div>
          </div>
          
          <div class="control-group">
            <label>{{ t('alarm.maxTriggers') }}</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                :value="autoAlarm.maxTriggers"
                @input="updateMaxTriggers"
                min="1"
                max="10"
                class="number-input"
              />
              <span class="unit">{{ t('alarm.times') }}</span>
            </div>
          </div>
        </div>
      </div>

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
import type { TimePoint, Preset, AutoAlarmSettings } from '../types';
import { useToast } from '../composables/useToast';
import PresetTemplates from './PresetTemplates.vue';
import TimePointEditor from './TimePointEditor.vue';

const { t } = useI18n();
const { showToast } = useToast();

const props = defineProps<{
  timePoints: TimePoint[];
  customPresets: Preset[];
  autoAlarm: AutoAlarmSettings;
}>();

const emit = defineEmits<{
  selectPreset: [preset: Preset];
  addTimePoint: [timeInSeconds: number, ringCount: number];
  removeTimePoint: [id: string];
  clearTimePoints: [];
  saveCustomPreset: [preset: Preset];
  deleteCustomPreset: [id: string];
  updateAutoAlarm: [settings: Partial<AutoAlarmSettings>];
}>();

const mode = ref<'preset' | 'custom'>('preset');
const customName = ref('');

function selectPreset(preset: Preset) {
  emit('selectPreset', preset);
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
  emit('updateAutoAlarm', { enabled: false });
  customName.value = '';
}

function toggleAutoAlarm(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('updateAutoAlarm', { enabled: target.checked });
}

function updateInterval(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (value >= 10 && value <= 3600) {
    emit('updateAutoAlarm', { intervalSeconds: value });
  }
}

function updateRingCount(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (value >= 1 && value <= 5) {
    emit('updateAutoAlarm', { ringCount: value });
  }
}

function updateMaxTriggers(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (value >= 1 && value <= 10) {
    emit('updateAutoAlarm', { maxTriggers: value });
  }
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
    autoAlarm: { ...props.autoAlarm },
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

/* Auto Alarm Section */
.auto-alarm-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.auto-alarm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.auto-alarm-header h3 {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 0;
}

.auto-alarm-description {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin: 0 0 1rem 0;
}

.auto-alarm-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 140px;
}

.control-group label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.number-input {
  width: 80px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--bg-card);
  color: var(--text-primary);
}

.number-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.unit {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: 0.3s;
  border-radius: 26px;
}

.toggle-switch .slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .slider {
  background-color: var(--primary-color);
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(24px);
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
  
  .auto-alarm-controls {
    flex-direction: column;
  }
  
  .control-group {
    width: 100%;
  }
}
</style>
