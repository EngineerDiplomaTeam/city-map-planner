using FluentAssertions;

namespace WebApi.Tests;

public class MockTests
{
    [Fact]
    public void Sample_Test_1()
    {
        1.Should().BeGreaterOrEqualTo(0);
    }
}