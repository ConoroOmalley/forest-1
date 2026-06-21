<script setup lang="ts">
import { onMounted } from 'vue'
import { blogConfig } from '@/data/posts'

onMounted(() => {
  if (document.getElementById('busuanzi-script')) return

  const script = document.createElement('script')
  script.id = 'busuanzi-script'
  script.async = true
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  document.body.appendChild(script)
})
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-bar">
      <span>Designed and coded with care.</span>
      <span>© {{ new Date().getFullYear() }} {{ blogConfig.label }}</span>
    </div>
    <p id="busuanzi_container_site_pv" class="site-footer-pv">
      本站总访问量<span id="busuanzi_value_site_pv"></span>次
    </p>
  </footer>
</template>
