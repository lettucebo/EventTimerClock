<template>
  <div class="preset-templates">
    <h2>預設模板</h2>
    <div class="templates-grid">
      <div 
        v-for="preset in allPresets" 
        :key="preset.id"
        class="template-card"
        @click="$emit('select', preset)"
      >
        <h3>{{ preset.name }}</h3>
        <p class="total-time">總時間: {{ formatTime(preset.totalTime) }}</p>
        <ul class="time-points">
          <li v-for="point in preset.timePoints" :key="point.id">
            {{ formatTime(point.timeInSeconds) }} - {{ point.ringCount }}次響鈴
          </li>
        </ul>
        <button 
          v-if="preset.id.startsWith('custom-')"
          @click.stop="$emit('delete', preset.id)"
          class="btn-delete"
        >
          刪除
        </button>
      </div>
      <div 
        class="template-card add-custom"
        @click="$emit('addCustom')"
      >
        <span class="plus-icon">+</span>
        <p>新增自訂模板</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Preset } from '../types';

const props = defineProps<{
  customPresets: Preset[];
}>();

defineEmits<{
  select: [preset: Preset];
  delete: [id: string];
  addCustom: [];
}>();

// 內建預設模板
const builtInPresets: Preset[] = [
  {
    id: 'speech-15',
    name: '演講模式 (15分鐘)',
    totalTime: 15 * 60,
    timePoints: [
      { id: 's15-1', timeInSeconds: 10 * 60, ringCount: 1, triggered: false },
      { id: 's15-2', timeInSeconds: 14 * 60, ringCount: 2, triggered: false },
      { id: 's15-3', timeInSeconds: 15 * 60, ringCount: 3, triggered: false },
    ],
  },
  {
    id: 'presentation-10',
    name: '簡報模式 (10分鐘)',
    totalTime: 10 * 60,
    timePoints: [
      { id: 'p10-1', timeInSeconds: 8 * 60, ringCount: 1, triggered: false },
      { id: 'p10-2', timeInSeconds: 9 * 60, ringCount: 2, triggered: false },
      { id: 'p10-3', timeInSeconds: 10 * 60, ringCount: 3, triggered: false },
    ],
  },
];

const allPresets = computed(() => [...builtInPresets, ...props.customPresets]);

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
  color: #00ff88;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.template-card {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.template-card:hover {
  border-color: #00ff88;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
}

.template-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.total-time {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.time-points {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
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
  color: #00ff88;
  margin-bottom: 0.5rem;
}

.add-custom p {
  color: #00ff88;
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

@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
