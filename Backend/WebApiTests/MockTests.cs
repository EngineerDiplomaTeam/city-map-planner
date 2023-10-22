using FluentAssertions;

namespace WebApiTests;

public class MockTests
{
    [Fact]
    public void Sample_Test_1()
    {
        1.Should().BeGreaterOrEqualTo(0);
    }
}