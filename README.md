# nodejs-Vue-Chat-Pusher

[Pusher](https://pusher.com/)を用いたリアルタイムチャットデモ

# DEMO

<img src="https://i.imgur.com/3QOVfwX.gif">

# Requirement

- Docker
- Pusher

# Installation

```bash
git clone https://github.com/wind0411/nodejs-vue-chat-pusher.git
```

# Usage

[Pusher](https://pusher.com/)で発行した API キー情報を使用します。予め準備してください。

ルートディレクトリ直下に.env を作成し、次の情報を記載してください。
(.env development ファイルをコピーして作成してください)

- PUSHER_APP_ID / Pusher の Dashboard から取得できる App キー画面の「app_id」を設定します。

- PUSHER_APP_KEY / Pusher の Dahboard から取得できる App キー画面の「key」を設定します。

- PUSHER_APP_SECRET / Pusher の Dashboard から取得できる App キー画面の「secret」を設定します。

- PUSHER_APP_CLUSTER / Pusher の Dashboard から取得できる App キー画面の「cluster」を設定します。
- PUSHER_APP_ENCRYPTED_MASTER_KEY_BASE64 / 通信を暗号化するためのマスターキーを設定します。出力は次のコマンドで行います。

```bash
openssl rand -base64 32
```

- SERVER_PORT / サーバ側のポート番号を指定します。

ソース内の docker-compose ファイルを用いて Docker で環境を構築します。

```bash
git clone https://github.com/wind0411/nodejs-vue-chat-pusher.git
docker-compose up -d
docker exec -it nodejs-vue-chat-pusher-app yarn serve
```

# Note

実装上の不備などありましたらご指摘ください。

以下動作確認環境

- PC: Chrome 85.0.4183.121
- スマートフォン：Android 10

# Author

- 作成者: wind0411
- E-mail: wind0411@gmail.com

# License

MIT
