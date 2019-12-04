using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using ToDoTasks.Interfaces;
using ToDoTasks.Models;

namespace ToDoTasks.Services
{
    public class CacheService : ICacheService
    {
        private IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());


        public async Task AddAsync(ToDoTask chatMessage)
        {
            _cache.Set(chatMessage.Id.ToString(), chatMessage, DateTimeOffset.MaxValue);
        }

        public async Task<IReadOnlyCollection<ToDoTask>> GetAsync(string userName)
        {

            // Get the empty definition for the EntriesCollection
            var cacheEntriesCollectionDefinition = typeof(MemoryCache).GetProperty("EntriesCollection", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);

            // Populate the definition with your IMemoryCache instance.  
            // It needs to be cast as a dynamic, otherwise you can't
            // loop through it due to it being a collection of objects.
            var cacheEntriesCollection = cacheEntriesCollectionDefinition.GetValue(_cache) as dynamic;

            // Define a new list we'll be adding the cache entries too
            List<ICacheEntry> cacheCollectionValues = new List<ICacheEntry>();

            foreach (var cacheItem in cacheEntriesCollection)
            {
                // Get the "Value" from the key/value pair which contains the cache entry   
                ICacheEntry cacheItemValue = cacheItem.GetType().GetProperty("Value").GetValue(cacheItem, null);

                // Add the cache entry to the list
                cacheCollectionValues.Add(cacheItemValue);
            }

            var values = cacheCollectionValues.Select(x => x.Value).ToArray();

            var res = values
                .OfType<ToDoTask>()
                .Where(x => x.UserName == userName)
                .ToArray();

            return await Task.FromResult(res);
        }
    }
}
