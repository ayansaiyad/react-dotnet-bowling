using System.Collections.Generic;
using System.Linq;
using Backend.Controllers;
using Backend.Data;
using Moq;
using Xunit;

namespace Backend.Tests
{
    public class BowlingLeagueControllerTests
    {
        [Fact]
        public void Get_ReturnsAllBowlersFromRepository()
        {
            // Arrange
            var mockRepo = new Mock<IBowlingLeagueRepository>();
            var sampleBowlers = new List<Bowler>
            {
                new Bowler
                {
                    BowlerId = 1,
                    BowlerFirstName = "John",
                    BowlerLastName = "Doe",
                    Team = new Team { TeamId = 1, TeamName = "Marlins" }
                },
                new Bowler
                {
                    BowlerId = 2,
                    BowlerFirstName = "Jane",
                    BowlerLastName = "Smith",
                    Team = new Team { TeamId = 2, TeamName = "Sharks" }
                }
            };

            mockRepo.Setup(repo => repo.Bowlers).Returns(sampleBowlers);

            var controller = new BowlingLeagueController(mockRepo.Object);

            // Act
            var result = controller.Get();

            // Assert
            Assert.NotNull(result);
            var bowlersList = result.ToList();
            Assert.Equal(2, bowlersList.Count);
            Assert.Equal("John", bowlersList[0].BowlerFirstName);
            Assert.Equal("Marlins", bowlersList[0].Team.TeamName);
            Assert.Equal("Jane", bowlersList[1].BowlerFirstName);
            Assert.Equal("Sharks", bowlersList[1].Team.TeamName);
        }
    }
}
