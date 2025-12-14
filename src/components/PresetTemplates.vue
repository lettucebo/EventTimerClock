<template>
  <div class="preset-templates">
    <h2>{{ t('alarm.presetTemplates') }}</h2>
    <div class="templates-grid">
      <div 
        v-for="preset in allPresets" 
        :key="preset.id"
        class="template-card"
        @click="$emit('select', preset)"
      >
        <h3>{{ preset.name }}</h3>
        <p class="total-time">{{ t('alarm.totalTime') }}: {{ formatTime(preset.totalTime) }}</p>
        <ul class="time-points">
          <li v-for="point in preset.timePoints" :key="point.id">
            {{ formatTime(point.timeInSeconds) }} - {{ point.ringCount }}{{ t('alarm.ringsCount') }}
          </li>
        </ul>
        <button 
          v-if="!preset.id.startsWith('custom-')"
          @click.stop="$emit('copyAndEdit', preset)"
          class="btn-copy-edit"
        >
          {{ t('alarm.copyAndEdit') }}
        </button>
        <button 
          v-if="preset.id.startsWith('custom-')"
          @click.stop="$emit('delete', preset.id)"
          class="btn-delete"
        >
          {{ t('alarm.delete') }}
        </button>
      </div>
      <div 
        class="template-card add-custom"
        @click="$emit('addCustom')"
      >
        <span class="plus-icon">+</span>
        <p>{{ t('alarm.addCustomTemplate') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Preset } from '../types';

const { t } = useI18n();

const props = defineProps<{
  customPresets: Preset[];
}>();

defineEmits<{
  select: [preset: Preset];
  copyAndEdit: [preset: Preset];
  delete: [id: string];
  addCustom: [];
}>();

// 內建預設模板
const builtInPresets = computed<Preset[]>(() => [
  {
    id: 'speech-15',
    name: t('preset.speech15'),
    totalTime: 15 * 60,
    timePoints: [
      { id: 's15-1', timeInSeconds: 10 * 60, ringCount: 1, triggered: false },
      { id: 's15-2', timeInSeconds: 14 * 60, ringCount: 2, triggered: false },
      { id: 's15-3', timeInSeconds: 15 * 60, ringCount: 3, triggered: false },
    ],
  },
  {
    id: 'presentation-10',
    name: t('preset.presentation10'),
    totalTime: 10 * 60,
    timePoints: [
      { id: 'p10-1', timeInSeconds: 8 * 60, ringCount: 1, triggered: false },
      { id: 'p10-2', timeInSeconds: 9 * 60, ringCount: 2, triggered: false },
      { id: 'p10-3', timeInSeconds: 10 * 60, ringCount: 3, triggered: false },
    ],
  },
]);

const allPresets = computed(() => [...builtInPresets.value, ...props.customPresets]);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
</script>

<style scoped>
.preset-templates {
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.template-card {
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.template-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: 0 4px 12px var(--primary-shadow-light);
}

.template-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.total-time {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.time-points {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.time-points li {
  padding: 0.25rem 0;
}

.add-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border-style: dashed;
}

.plus-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.add-custom p {
  color: var(--primary-color);
  font-size: 1rem;
}

.btn-delete {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-delete:hover {
  background: #dd3333;
}

.btn-copy-edit {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-copy-edit:hover {
  background: #00dd77;
}

@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
