//Changed module type from mjs to cjs and use "axios" instead of "got"

const axios = require("axios").default;

exports.default = class CloudflareKV {
  constructor({ accountId, apiToken, namespaceId } = {}) {
    this.accountId = accountId || process.env.CLOUDFLARE_ACCOUNT_ID;
    this.apiToken = apiToken || process.env.CLOUDFLARE_API_TOKEN;
    this.namespaceId = namespaceId || process.env.CLOUDFLARE_NAMESPACE_ID;
  }

  /**
   * @returns {Record<string, string>}
   */
  getHeaders() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
    };
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  getUrl(key) {
    return `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespaceId}/values/${key}`;
  }

  /**
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(key) {
    const url = this.getUrl(key);
    const headers = this.getHeaders();

    await axios.delete(url, {
      headers: headers
    })
  }

  /**
   * @template T
   * @param {string} key
   * @returns {Promise<T>}
   */
  async get(key) {
    const url = this.getUrl(key);
    const headers = this.getHeaders();

    const response = await axios.get(url, {
      headers: headers,
      responseType: "json"
    })

    return response.data;
  }

  /**
   * @param {string} key
   * @param {Record<string, any>} value
   * @returns {Promise<void>}
   */
  async put(key, value) {
    const url = this.getUrl(key);
    const headers = this.getHeaders();

    await axios.put(url, value, {
      headers: headers,
    })
  }
}