<script setup lang="ts">
import { movedInterceptorSections } from '../../guide/interceptor-sections.ts';
import MovedGuideSections from './MovedGuideSections.vue';
</script>

<template>
    <MovedGuideSections :entries="movedInterceptorSections" summary="Follow an earlier link to its focused interceptor guide" />
</template>
