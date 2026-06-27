# syntax=docker/dockerfile:1

# ---- Build stage ----
# Produces the static dist/ bundle with pnpm + Vite.
FROM node:24-alpine AS build
WORKDIR /app

# Enable pnpm via corepack, pinned to the version that generated the lockfile
# so its resolution/policy matches and --frozen-lockfile stays happy.
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Install dependencies first so this layer is cached when only source changes.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Build the production bundle (tsc -b && vite build).
COPY . .
RUN pnpm run build

# ---- Runtime stage ----
# Serves the static files with nginx; no Node runtime needed.
FROM nginx:1.27-alpine AS runtime

# SPA fallback: route unknown paths to index.html.
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
