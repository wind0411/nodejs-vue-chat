import axios from 'axios'

/**
 * 外部APIを実行するための共通のaxios設定ファイル
 * 外部リソースディレクトリ内のモジュールから呼び出されます。
 */
const baseDomain = `${location.protocol}//${location.host}:${process.env.VUE_APP_SERVER_PORT}/api`
const headers = {
  'Content-Type': 'application/json',
}
export default axios.create({
  baseURL: baseDomain,
  timeout: 300000,
  headers: headers,
  responseType: 'json',
})
