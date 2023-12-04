using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Channels;

namespace OverpassClient;

// https://stackoverflow.com/a/74894338
public static class JsonNestedArrayStreamDeserializer
{
    public static IAsyncEnumerable<TDataItem> DeserializeAsyncEnumerable<TDataItem>(this Stream stream, string propertyPath)
    {
        var converter = new AsyncEnumerableConverter<TDataItem>(propertyPath);
        _ = JsonSerializer.DeserializeAsync<object>(stream, new JsonSerializerOptions
        {
            Converters = { converter },
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });

        return converter.OutputChannel.Reader.ReadAllAsync();
    }

    private class AsyncEnumerableConverter<TDataItem>(string propertyPath) : JsonConverter<object>
    {
        public Channel<TDataItem> OutputChannel { get; } = Channel.CreateUnbounded<TDataItem>(new()
        {
            SingleReader = true,
            SingleWriter = true,
        });

        public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (!TryMoveToItemsProperty(ref reader))
            {
                OutputChannel.Writer.Complete();
                return null;
            }

            if (reader.TokenType == JsonTokenType.Null)
            {
                OutputChannel.Writer.Complete();
                return null;
            }

            if (reader.TokenType != JsonTokenType.StartArray)
            {
                throw new JsonException($"Property {propertyPath} is not JSON Array");
            }

            reader.Read(); // read start array
            ReadItems(ref reader, options);

            OutputChannel.Writer.Complete();
            return null;
        }

        public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options) =>
            throw new NotSupportedException();

        private bool TryMoveToItemsProperty(ref Utf8JsonReader reader)
        {
            var propertyNames = propertyPath.Split('.');
            var level = 0;

            while (reader.Read())
            {
                if (reader.TokenType == JsonTokenType.PropertyName && reader.GetString() == propertyNames[level])
                {
                    level++;
                }

                if (level == propertyNames.Length)
                {
                    reader.Read();
                    return true;
                }
            }

            throw new JsonException("Invalid JSON");
        }

        private void ReadItems(ref Utf8JsonReader reader, JsonSerializerOptions options)
        {
            while (reader.TokenType != JsonTokenType.EndArray)
            {
                var item = JsonSerializer.Deserialize<TDataItem>(ref reader, options)!;
                OutputChannel.Writer.TryWrite(item);
                reader.Read();
            }
        }
    }
}