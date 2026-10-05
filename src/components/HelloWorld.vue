<template>
  <div class="app-container">
    <!-- Esquerda: Card do Jogo -->
    <div class="game-section">
      <div class="game-card" @click="playGame">
        <img class="tiger-image" src="/home/felipegarcia/litteTigerPoject/src/assets/tigger.jpg" />
      </div>
    </div>
    
    <!-- Centro: Barra de progresso interativa -->
    <div class="progress-section">
      <div class="progress-container">
        <div class="progress-bar" :style="{ height: progress + '%' }"></div>
      </div>
      <span class="progress-text">{{ progress }}%</span>
    </div>

    <!-- Direita: Menu e Avatares de Perfil -->
    <div class="right-section">
      <div class="header">
        <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div class="divider"></div>
      
      <div class="profile-grid">
        <!-- Skeleton loading enquanto carrega -->
        <template v-if="isLoadingProfiles">
          <div class="profile-circle skeleton" v-for="n in 10" :key="'skeleton-' + n"></div>
        </template>

        <!-- Perfis carregados -->
        <template v-else>
          <button
            class="profile-circle"
            v-for="profile in profiles"
            :key="profile.id"
            :class="{ selected: selectedProfile === profile.id }"
            @click="selectProfile(profile)"
            :title="profile.name"
          >
            <img :src="profile.avatar" :alt="profile.name" />
            <span class="profile-level">Nv.{{ profile.level }}</span>
          </button>

          <!-- Botão para adicionar novo perfil -->
          <button class="profile-circle add-profile" @click="addProfile" title="Adicionar perfil">
            <span class="add-icon">＋</span>
          </button>
        </template>
      </div>

      <!-- Info do perfil selecionado -->
      <div class="profile-info" v-if="activeProfile">
        <img :src="activeProfile.avatar" :alt="activeProfile.name" class="profile-info-avatar" />
        <div>
          <p class="profile-info-name">{{ activeProfile.name }}</p>
          <p class="profile-info-meta">Nível {{ activeProfile.level }} · {{ activeProfile.points }} pts</p>
        </div>
        <button class="remove-btn" @click="removeProfile(activeProfile.id)" title="Remover perfil">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// ────────────────────────────────────────
// Estado
// ────────────────────────────────────────
const progress       = ref(38)
const isMenuOpen     = ref(false)
const isLoadingProfiles = ref(true)
const selectedProfile   = ref(null)
const profiles          = ref([])

// Perfil ativo (computed a partir da lista)
const activeProfile = computed(() =>
  profiles.value.find(p => p.id === selectedProfile.value) ?? null
)

// ────────────────────────────────────────
// Helpers
// ────────────────────────────────────────
const NAMES  = ['Ana', 'Bruno', 'Carol', 'Diego', 'Eva', 'Felipe', 'Gabi', 'Hugo', 'Iris', 'João', 'Kali', 'Leo']
const STYLES = ['avataaars', 'micah', 'bottts', 'lorelei', 'notionists']

const makeProfile = (id) => ({
  id,
  name:   NAMES[id % NAMES.length],
  level:  Math.floor(Math.random() * 50) + 1,
  points: Math.floor(Math.random() * 10000),
  avatar: `https://api.dicebear.com/7.x/${STYLES[id % STYLES.length]}/svg?seed=${id * 137}`,
})

// ────────────────────────────────────────
// Carregamento inicial (simula fetch de API)
// ────────────────────────────────────────
const loadProfiles = async () => {
  isLoadingProfiles.value = true
  await new Promise(r => setTimeout(r, 1200)) // simula latência de rede
  profiles.value = Array.from({ length: 10 }, (_, i) => makeProfile(i + 1))
  selectedProfile.value = profiles.value[0].id
  isLoadingProfiles.value = false
}

onMounted(loadProfiles)

// ────────────────────────────────────────
// Ações dos perfis
// ────────────────────────────────────────
const selectProfile = (profile) => {
  selectedProfile.value = profile.id
  progress.value = Math.min(Math.round(profile.points / 100), 100)
}

const addProfile = () => {
  const newId = Date.now()
  profiles.value.push(makeProfile(newId))
}

const removeProfile = (id) => {
  profiles.value = profiles.value.filter(p => p.id !== id)
  if (selectedProfile.value === id) {
    selectedProfile.value = profiles.value[0]?.id ?? null
  }
}

// ────────────────────────────────────────
// Outras interações
// ────────────────────────────────────────
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

const playGame = () => {
  if (progress.value >= 100) return
  let current = progress.value
  const interval = setInterval(() => {
    current += 3
    progress.value = Math.min(current, 100)
    if (progress.value >= 100) clearInterval(interval)
  }, 30)
}
</script>

<style scoped>
/* ===================================================
   TEMA: SELVA 🌿
=================================================== */

.app-container {
  flex: 1;
  display: flex;
  gap: 32px;
  /* Gradiente de floresta escura */
  background:
    linear-gradient(160deg, #0d2b0e 0%, #1a3a1c 40%, #0f2210 100%);
  padding: 40px;
  width: 100%;
  color: #d4e8b0;
  box-sizing: border-box;
  font-family: 'Georgia', system-ui, sans-serif;
  position: relative;
  overflow: hidden;
}

/* Efeito de luz de selva no fundo */
.app-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(120, 200, 50, 0.07) 0%, transparent 70%),
    radial-gradient(ellipse 40% 60% at 10% 80%, rgba(30, 100, 20, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* === Seção Esquerda === */
.game-section {
  flex: 0 0 320px;
  position: relative;
  z-index: 1;
}

.game-card {
  border-radius: 20px;
  height: calc(100vh - 80px);
  min-height: 400px;
  display: flex;
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  /* Borda com tom dourado/âmbar — pele de tigre */
  border: 3px solid #8b6914;
  box-shadow:
    0 0 0 1px rgba(200, 160, 40, 0.3),
    0 12px 40px rgba(0, 0, 0, 0.6),
    inset 0 0 60px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  overflow: hidden;
}

.game-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow:
    0 0 0 2px rgba(200, 160, 40, 0.6),
    0 20px 50px rgba(0, 0, 0, 0.7),
    0 0 30px rgba(120, 200, 50, 0.15);
}

.tiger-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  filter: saturate(1.2) contrast(1.05);
}

.game-card:hover .tiger-image {
  transform: scale(1.07);
}

/* === Seção Central === */
.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.progress-container {
  width: 28px;
  flex: 1;
  min-height: 340px;
  /* Tronco de bambu */
  background: linear-gradient(180deg, #1c3a10 0%, #0d2209 100%);
  border-radius: 14px;
  border: 2px solid #2d5a1b;
  display: flex;
  align-items: flex-end;
  padding: 4px;
  box-sizing: border-box;
  box-shadow:
    inset 0 4px 12px rgba(0,0,0,0.6),
    0 0 10px rgba(60, 150, 30, 0.15);
  position: relative;
  overflow: hidden;
}

/* Marcações de bambu */
.progress-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    180deg,
    transparent 0px,
    transparent 28px,
    rgba(80, 160, 40, 0.15) 28px,
    rgba(80, 160, 40, 0.15) 30px
  );
  pointer-events: none;
}

.progress-bar {
  width: 100%;
  /* Verde floresta vibrante */
  background: linear-gradient(to top, #1db954, #57e389, #a8f56e);
  border-radius: 10px;
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(90, 220, 80, 0.5);
}

.progress-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #7dda58;
  text-shadow: 0 0 8px rgba(90, 220, 80, 0.4);
  letter-spacing: 1px;
}

/* === Seção Direita === */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.hamburger {
  background: rgba(30, 80, 20, 0.5);
  border: 1px solid rgba(100, 180, 60, 0.3);
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: background 0.2s, border-color 0.2s;
}

.hamburger:hover {
  background: rgba(50, 110, 30, 0.7);
  border-color: rgba(130, 220, 80, 0.5);
}

.hamburger span {
  display: block;
  width: 28px;
  height: 2px;
  background-color: #a8e063;
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}

.hamburger.active span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

/* Divisor com tom de folhagem */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #3d8b2a, transparent);
  margin-bottom: 28px;
  opacity: 0.7;
}

/* === Grid de Perfis === */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(5, 70px);
  gap: 16px;
}

.profile-circle {
  position: relative;
  width: 70px;
  height: 70px;
  /* Borda com tom de folha */
  border: 3px solid rgba(80, 150, 40, 0.4);
  border-radius: 50%;
  background: #0d2209;
  cursor: pointer;
  padding: 0;
  overflow: visible;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.profile-circle:hover {
  transform: scale(1.12);
  border-color: #6dbd3a;
  box-shadow: 0 0 12px rgba(100, 200, 50, 0.35);
}

/* Selecionado — brilho dourado de selva */
.profile-circle.selected {
  border-color: #c8a028;
  transform: scale(1.12);
  box-shadow:
    0 0 0 3px rgba(200, 160, 40, 0.3),
    0 0 20px rgba(200, 160, 40, 0.4);
}

.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: #1a3a10;
  display: block;
}

/* Badge de nível */
.profile-level {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #3a7d1a, #5db82e);
  color: #d4f7b0;
  font-size: 0.58rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  border: 1px solid rgba(100, 200, 50, 0.4);
  letter-spacing: 0.5px;
}

/* Skeleton — shimmer verde */
.skeleton {
  background: linear-gradient(90deg, #142e0d 25%, #1e4a14 50%, #142e0d 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  cursor: default;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Botão de adicionar perfil */
.add-profile {
  border: 2px dashed rgba(100, 180, 50, 0.4);
  background: rgba(20, 60, 10, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-profile:hover {
  border-color: #6dbd3a;
  background: rgba(40, 100, 20, 0.5);
}

.add-icon {
  font-size: 1.6rem;
  color: rgba(150, 220, 80, 0.6);
  line-height: 1;
}

.add-profile:hover .add-icon {
  color: #a8e063;
}

/* Card info do perfil selecionado */
.profile-info {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  padding: 14px 18px;
  background: rgba(10, 35, 8, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(100, 180, 50, 0.3);
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.profile-info-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1a3a10;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(100, 180, 50, 0.5);
}

.profile-info-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #d4f0a0;
  letter-spacing: 0.5px;
}

.profile-info-meta {
  margin: 3px 0 0;
  font-size: 0.78rem;
  color: #7dbd48;
}

.remove-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: rgba(200, 220, 160, 0.35);
  font-size: 1rem;
  cursor: pointer;
  padding: 5px 9px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  color: #e06b4a;
  background: rgba(220, 80, 40, 0.12);
}
</style>

