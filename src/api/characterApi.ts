import { Character } from '../types';

class CharacterApi {
  private baseUrl =
    'https://recruiting.verylongdomaintotestwith.ca/api/lpalazzi';

  private async makeRequest(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body: any = undefined
  ) {
    try {
      const res = await fetch(this.baseUrl + path, {
        method: method,
        headers: ['POST', 'PUT'].includes(method)
          ? {
              'Content-Type': 'application/json',
            }
          : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      return res;
    } catch (error) {
      throw new Error(`${method} request to ${path} failed\n${error}`);
    }
  }

  public async saveCharacters(characters: { [id: number]: Character }) {
    const res = await this.makeRequest('/character', 'POST', characters);
    return { success: !!res.ok };
  }

  public async getCharacters() {
    const res = await this.makeRequest('/character');
    const json = await res.json();
    if (json.message === 'Item not found') {
      return {};
    }
    return json.body;
  }
}

export const characterApi = new CharacterApi();
