# =====================
# Dependencies
# =====================
# Red Hat UBI image: runs as UID 1001 in group 0, which is what OpenShift's restricted SCC expects.
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

# tsc + tsc-alias. A failing build must fail the image build.
RUN npm install -g yarn \
 && yarn build

# Keep only production dependencies for the runtime image.
RUN rm -rf node_modules \
 && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline --network-timeout 600000

# =====================
# Runtime
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder --chown=1001:0 /app/package.json ./
COPY --from=builder --chown=1001:0 /app/node_modules ./node_modules
COPY --from=builder --chown=1001:0 /app/dist ./dist

# The app writes sessions, logs and its database under /app/data at startup. OpenShift runs with an
# arbitrary UID in group 0, so the directory must be group-writable (or mounted as a volume).
RUN mkdir -p /app/data \
 && chmod -R g=u /app/data

USER 1001

EXPOSE 3000

CMD ["node", "dist/server.js"]
