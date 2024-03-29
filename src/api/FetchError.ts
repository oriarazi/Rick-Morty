export default class FetchError extends Error {
  #statusCode: number;
  #statusText: string;

  constructor(statusCode: number, statusText: string) {
    super(`${statusCode} - ${statusText}`);
    this.#statusCode = statusCode;
    this.#statusText = statusText;
  }

  getStatusCode() {
    return this.#statusCode;
  }
  getStatusText() {
    return this.#statusText;
  }
}
