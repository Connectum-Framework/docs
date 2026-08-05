<script setup lang="ts">
import type { SimpleIcon } from 'simple-icons';
import {
    siApachekafka,
    siBun,
    siIstio,
    siKubernetes,
    siNatsdotio,
    siNodedotjs,
    siOpentelemetry,
    siPnpm,
    siRabbitmq,
    siRedis,
    siTypescript,
} from 'simple-icons';

type Technology = {
    label: string;
    icon?: SimpleIcon;
    mark?: string;
};

const technologies: readonly Technology[] = [
    { label: 'ConnectRPC', mark: 'C' },
    { label: 'gRPC', mark: 'g' },
    { label: 'Kubernetes', icon: siKubernetes },
    { label: 'Istio', icon: siIstio },
    { label: 'OpenTelemetry', icon: siOpentelemetry },
    { label: 'RabbitMQ', icon: siRabbitmq },
    { label: 'Kafka', icon: siApachekafka },
    { label: 'NATS', icon: siNatsdotio },
    { label: 'Redis', icon: siRedis },
    { label: 'KeyDB', mark: 'K' },
    { label: 'Dragonfly', mark: 'D' },
    { label: 'AMQP', mark: 'A' },
    { label: 'Redpanda', mark: 'R' },
    { label: 'TypeScript', icon: siTypescript },
    { label: 'Bun', icon: siBun },
    { label: 'Node.js', icon: siNodedotjs },
    { label: 'pnpm', icon: siPnpm },
] as const;
</script>

<template>
    <div class="ecosystem-rail" aria-label="Connectum ecosystem technologies">
        <div class="ecosystem-track">
            <ul v-for="copy in 2" :key="copy" class="ecosystem-list" :aria-hidden="copy === 2 ? 'true' : undefined">
                <li v-for="technology in technologies" :key="technology.label">
                    <svg v-if="technology.icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path :d="technology.icon.path" />
                    </svg>
                    <span v-else class="ecosystem-mark" aria-hidden="true">{{ technology.mark }}</span>
                    <span>{{ technology.label }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
