<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { blogConfig } from '@/data/posts'
import { chatLink, socialLinks } from '@/data/social'

const showChatModal = ref(false)

function openChatModal() {
  showChatModal.value = true
}

function closeChatModal() {
  showChatModal.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeChatModal()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section class="profile-hero">
    <div class="profile-banner" aria-hidden="true">
      <img
        v-if="blogConfig.banner"
        :src="blogConfig.banner"
        :alt="`${blogConfig.label} banner`"
        class="profile-banner-image"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <div class="profile-panel">
      <button type="button" class="profile-chat-btn" @click="openChatModal">
        {{ chatLink.label }}
      </button>

      <div class="profile-avatar-wrap">
        <img
          :src="blogConfig.avatar"
          :alt="blogConfig.label"
          width="96"
          height="96"
          class="profile-avatar"
        />
      </div>

      <div class="profile-details">
        <h1 class="profile-title">{{ blogConfig.label }}</h1>

        <p v-if="blogConfig.description" class="profile-bio">{{ blogConfig.description }}</p>

        <div class="profile-social">
          <a
            v-for="link in socialLinks"
            :key="link.id"
            :href="link.url"
            class="profile-social-tag"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${link.label}：${link.tooltip}`"
          >
            <img
              :src="link.icon"
              :alt="`${link.label} icon`"
              class="profile-social-icon"
              width="18"
              height="18"
            />
            <span>{{ link.label }}</span>
            <span class="profile-social-tooltip" role="tooltip">{{ link.tooltip }}</span>
          </a>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showChatModal"
        class="chat-modal-overlay"
        @click.self="closeChatModal"
      >
        <div class="chat-modal" role="dialog" aria-modal="true" aria-labelledby="chat-modal-title">
          <button type="button" class="chat-modal-close" aria-label="关闭" @click="closeChatModal">
            ×
          </button>
          <p id="chat-modal-title" class="chat-modal-title">{{ chatLink.hint }}</p>
          <img
            :src="chatLink.qrCode"
            alt="微信二维码"
            class="chat-modal-qr"
            width="240"
            height="240"
          />
        </div>
      </div>
    </Teleport>
  </section>
</template>
