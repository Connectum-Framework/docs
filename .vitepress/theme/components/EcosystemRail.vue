<script setup lang="ts">
type Technology = {
    label: string;
    icon: string;
    darkInvert?: boolean;
};

const technologies: readonly Technology[] = [
    { label: 'ConnectRPC', icon: '/assets/ecosystem/connectrpc.webp' },
    { label: 'gRPC', icon: '/assets/ecosystem/grpc.webp', darkInvert: true },
    { label: 'Kubernetes', icon: '/assets/ecosystem/kubernetes.webp' },
    { label: 'Istio', icon: '/assets/ecosystem/istio.webp' },
    { label: 'OpenTelemetry', icon: '/assets/ecosystem/opentelemetry.webp' },
    { label: 'RabbitMQ', icon: '/assets/ecosystem/rabbitmq.webp' },
    { label: 'Kafka', icon: '/assets/ecosystem/kafka.webp', darkInvert: true },
    { label: 'NATS', icon: '/assets/ecosystem/nats.webp', darkInvert: true },
    { label: 'Redis', icon: '/assets/ecosystem/redis.webp', darkInvert: true },
    { label: 'KeyDB', icon: '/assets/ecosystem/keydb.webp', darkInvert: true },
    { label: 'Dragonfly', icon: '/assets/ecosystem/dragonfly.webp' },
    { label: 'AMQP', icon: '/assets/ecosystem/amqp.webp' },
    { label: 'Redpanda', icon: '/assets/ecosystem/redpanda.webp' },
    { label: 'TypeScript', icon: '/assets/ecosystem/typescript.webp' },
    { label: 'Bun', icon: '/assets/ecosystem/bun.webp' },
    { label: 'Node.js', icon: '/assets/ecosystem/nodejs.webp' },
    { label: 'pnpm', icon: '/assets/ecosystem/pnpm.webp' },
] as const;
</script>

<template>
    <div class="ecosystem-rail" aria-label="Connectum ecosystem technologies">
        <div class="ecosystem-track">
            <ul v-for="copy in 2" :key="copy" class="ecosystem-list" :aria-hidden="copy === 2 ? 'true' : undefined">
                <li v-for="technology in technologies" :key="technology.label">
                    <img
                        class="no-zoom"
                        :class="{ 'ecosystem-icon--dark-invert': technology.darkInvert }"
                        :src="technology.icon"
                        alt=""
                        width="24"
                        height="24"
                        decoding="async"
                    >
                    <span>{{ technology.label }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
