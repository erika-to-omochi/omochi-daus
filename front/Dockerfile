# Dockerfile for the front-end service
FROM node:21.5.0

# 必要な依存パッケージをインストール
RUN apt-get update && \
    apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係を先にインストール
COPY package.json yarn.lock ./
RUN yarn install

# アプリケーションコード全体をコピー
COPY . .

# Next.js ビルド
RUN yarn build

# ポートを公開
EXPOSE 4000

# アプリケーションの起動コマンド
CMD ["yarn", "dev", "-p", "4000"]
