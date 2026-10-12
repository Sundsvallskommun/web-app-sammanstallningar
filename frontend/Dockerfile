# =====================
# Dependencies
# =====================
# Red Hat UBI image: runs as UID 1001 in group 0, which is what OpenShift's restricted SCC expects.
# Node 22 is required by Next 16.2 and sharp 0.35 (Node 20 is end of life).
FROM registry.access.redhat.com/ubi9/nodejs-22 AS deps

WORKDIR /app
COPY --chown=1001:0 package.json yarn.lock ./

RUN npm install -g yarn \
 && yarn install --frozen-lockfile --network-timeout 600000

# =====================
# Build
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS builder

WORKDIR /app
COPY --from=deps --chown=1001:0 /app/node_modules ./node_modules
COPY --chown=1001:0 . .

# Build with placeholder values for the NEXT_PUBLIC_* variables. Next inlines these at build time,
# so entrypoint.sh replaces the placeholders with real values when the container starts.
# .env.local is read by Next itself, .env is read by middleware-envs-generator.mjs (prebuild).
COPY --chown=1001:0 .env-cicd .env.local
COPY --chown=1001:0 .env-cicd .env

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone

RUN npm install -g yarn \
 && yarn build

# =====================
# Runtime
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Kubernetes sets HOSTNAME to the pod name; the standalone server binds to HOSTNAME if set.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=1001:0 /app/next.config.js ./
COPY --from=builder --chown=1001:0 /app/public ./public
COPY --from=builder --chown=1001:0 /app/package.json ./

# Next standalone output (includes its own pruned node_modules and server.js)
COPY --from=builder --chown=1001:0 /app/.next/standalone ./
COPY --from=builder --chown=1001:0 /app/.next/static ./.next/static

# OpenShift runs with an arbitrary UID in group 0: entrypoint.sh rewrites files under .next and
# the image optimizer writes to .next/cache, so the group needs write access.
RUN chmod -R g+w /app/.next

COPY --chown=1001:0 entrypoint.sh ./
RUN sed -i 's/\r$//' ./entrypoint.sh \
 && chmod 0555 ./entrypoint.sh

USER 1001

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
