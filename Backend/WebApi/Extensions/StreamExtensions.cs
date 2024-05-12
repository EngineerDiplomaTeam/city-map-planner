using HtmlAgilityPack;

namespace WebApi.Extensions;

public static class StreamExtensions
{
    public static HtmlDocument ToHtmlDocument(this Stream page)
    {
        var doc = new HtmlDocument();
        doc.Load(page);
        return doc;
    }
}