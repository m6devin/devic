export class Config {

  /**
   * Return host URL to interact with APIs
   */
  getHost(): string {
    return localStorage.getItem('api_host');
  }
}
