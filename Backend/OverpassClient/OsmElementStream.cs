using System.Buffers;
using System.Text;

namespace OverpassClient;

public class OsmElementStream(Stream stream) : Stream
{
    private readonly Stream _stream = stream ?? throw new ArgumentNullException(nameof(stream));
    private readonly byte[] _chunk = ArrayPool<byte>.Shared.Rent(1);

    public override int Read(byte[] buffer, int offset, int count)
    {
        // Span<byte> sink = stackalloc byte[1];
        // var readCount =_stream.Read(sink);
        //
        //
        //
        // var toRead = count;
        // var bufferPosition = 0;
        //
        // while (toRead > 0 && _chunkLength > 0)
        // {
        //     if (_chunkPosition >= chunkSize)
        //     {
        //         _chunkPosition = 0;
        //         _chunkLength = _stream.Read(_chunk, 0, chunkSize);
        //     }
        //
        //     var currentRead = Math.Min(_chunkLength, toRead);
        //     Array.Copy(_chunk, _chunkPosition, buffer, bufferPosition, currentRead);
        //     
        //     Console.WriteLine($"Buffer: {Encoding.UTF8.GetString(buffer, 0, currentRead)}");
        //     
        //     toRead -= currentRead;
        //     bufferPosition += currentRead;
        //     _chunkPosition += currentRead;
        // }
        //
        // return readCount;
        return 0;
    }
    
    protected override void Dispose(bool disposing)
    {
        ArrayPool<byte>.Shared.Return(_chunk);

        base.Dispose(disposing);
    }
    
    public override void Flush() => throw new NotSupportedException();
    public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
    public override void SetLength(long value) => throw new NotSupportedException();
    public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();
    public override bool CanRead => true;
    public override bool CanSeek => false;
    public override bool CanWrite => false;
    public override long Length => throw new NotSupportedException();
    public override long Position
    {
        get => throw new NotSupportedException();
        set => throw new NotSupportedException();
    }
}