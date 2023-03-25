import { Configuration, OpenAIApi } from 'openai';
import { caching } from 'cache-manager';

import { decryptData } from './encryption.service';
import { User } from '../models/user.model';
import openai from '../config/openai';

const memoryCache = caching('memory', {
  // 4 hours
  ttl: 4 * 60 * 60 * 1000,
});

async function addToCache<T>(key: string, value: T) {
  const cache = await memoryCache;

  cache.set(key, value);
}

async function getFromCache<T>(key: string): Promise<T | undefined> {
  const cache = await memoryCache;

  return cache.get(key);
}

/**
 * The user will either be in a trial period in which case they do not saved their openai API key
 * when the user subscribes we save their openai API key to their user document
 * @param userId | userId of user making this request
 * @returns Promise<OpenAIApi>
 */
export async function getOpenAiInstanceByUser(userId: string): Promise<OpenAIApi> {
  const user = await User.findOne({ userId });
  const cachedOpenAiInstance = await getFromCache<OpenAIApi>(userId);

  // user has openai instance in cache
  if (cachedOpenAiInstance !== undefined) {
    return cachedOpenAiInstance;

    // does not have instance in cache but user has provided openai key
  } else if (user?.openaiApiKey) {
    const decryptedApiKey = decryptData(user.openaiApiKey);
    const userOpenaiInstance = new OpenAIApi(
      new Configuration({
        apiKey: decryptedApiKey,
      })
    );

    await addToCache(userId, userOpenaiInstance);

    return userOpenaiInstance;
  }

  // default openai instance with our API key for free trial users
  return openai;
}
