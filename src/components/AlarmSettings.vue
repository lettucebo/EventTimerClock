<template>
  <div class="alarm-settings">
    <div class="settings-header">
      <h2>響鈴設定</h2>
      <div class="mode-toggle">
        <button 
          @click="mode = 'preset'" 
          :class="{ active: mode === 'preset' }"
          class="toggle-btn"
        >
          預設模板
        </button>
        <button 
          @click="mode = 'custom'" 
          :class="{ active: mode === 'custom' }"
          class="toggle-btn"
        >
          自訂設定
        </button>
      </div>
    </div>

    <div v-if="mode === 'preset'" class="preset-section">
      <PresetTemplates 
        :custom-presets="customPresets"
        @select="selectPreset"
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
          placeholder="模板名稱"
          class="custom-name-input"
        />
        <button @click="saveAsTemplate" class="btn btn-save">
          儲存為模板
        </button>
        <button @click="clearAll" class="btn btn-clear">
          清除全部
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TimePoint, Preset } from '../types';
import PresetTemplates from './PresetTemplates.vue';
import TimePointEditor from './TimePointEditor.vue';

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
    alert('請輸入模板名稱');
    return;
  }
  
  if (props.timePoints.length === 0) {
    alert('請先新增時間點');
    return;
  }

  const maxTime = Math.max(...props.timePoints.map(p => p.timeInSeconds));
  const preset: Preset = {
    id: `custom-${Date.now()}`,
    name: customName.value,
    totalTime: maxTime,
    timePoints: props.timePoints.map(p => ({ ...p })),
  };

  emit('saveCustomPreset', preset);
  customName.value = '';
  alert('模板已儲存！');
}
</script>

<style scoped>
.alarm-settings {
  background: rgba(0, 0, 0, 0.2);
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
  color: #00ff88;
  margin: 0;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: transparent;
  color: #ccc;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: #00ff88;
  color: #1a1a2e;
  font-weight: 600;
}

.toggle-btn:hover:not(.active) {
  color: #00ff88;
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
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.custom-name-input:focus {
  outline: none;
  border-color: #00ff88;
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
  background: #00ff88;
  color: #1a1a2e;
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
