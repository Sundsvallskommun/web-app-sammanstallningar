# =====================
# Dependencies
# =====================
# Red Hat UBI image: runs as UID 1001 in group 0, which is what OpenShift's restricted SCC expects.
FROM registry.access.redhat.com/ubi9/nodejs-22:1 AS deps

WORKDIR /app
COPY --chown=1001:0 package.json yarn.lock ./

# Yarn is pinned and lifecycle scripts are disabled: nothing in this project needs an install
# script, and it stops dependencies from running arbitrary code or phoning home during the build.
RUN npm install -g --ignore-scripts yarn@1.22.22 \
 && yarn install --frozen-lockfile --ignore-scripts --network-timeout 600000

# =====================
# Build
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22:1 AS builder

WORKDIR /app
COPY --from=deps --chown=1001:0 /app/node_modules ./node_modules
COPY --chown=1001:0 . .

# tsc + tsc-alias. A failing build must fail the image build.
RUN npm install -g --ignore-scripts yarn@1.22.22 \
 && yarn build

# Keep only production dependencies for the runtime image.
RUN rm -rf node_modules \
 && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline --network-timeout 600000

# =====================
# Runtime
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Application files are never written at runtime: left root-owned and read-only for the app user.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# The only runtime writes are rotating log files under /app/data/logs (and ./data/sessions when
# SESSION_STORE=file, which is not used in OpenShift). Sessions and the gateway token live in Redis
# (SESSION_STORE=redis), so the pod needs no volume and can run with several replicas.
# OpenShift runs the container as an arbitrary UID in group 0, so group write is required.
RUN mkdir -p /app/data \
 && chown 1001:0 /app/data \
 && chmod g+w /app/data

USER 1001

EXPOSE 3000

CMD ["node", "dist/server.js"]
