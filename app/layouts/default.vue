<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />

    <!-- Render target for `useToast()` — without this the "Coming Soon"
         toast on locked test cards would fire but never appear. -->
    <UNotifications />
  </div>
</template>
