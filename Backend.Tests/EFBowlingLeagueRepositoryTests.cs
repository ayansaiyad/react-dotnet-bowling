using System;
using System.Linq;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.Tests
{
    public class EFBowlingLeagueRepositoryTests
    {
        private BowlingLeagueContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<BowlingLeagueContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new BowlingLeagueContext(options);
            return context;
        }

        [Fact]
        public void Bowlers_ReturnsBowlersWithTeams()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var team = new Team { TeamId = 1, TeamName = "Marlins" };
            context.Teams.Add(team);
            context.Bowlers.Add(new Bowler
            {
                BowlerId = 1,
                BowlerFirstName = "John",
                BowlerLastName = "Doe",
                TeamId = 1,
                Team = team
            });
            context.SaveChanges();

            var repository = new EFBowlingLeagueRepository(context);

            // Act
            var bowlers = repository.Bowlers.ToList();

            // Assert
            Assert.Single(bowlers);
            Assert.Equal("John", bowlers[0].BowlerFirstName);
            Assert.Equal("Marlins", bowlers[0].Team.TeamName);
        }

        [Fact]
        public void RepositoryProperties_ReturnSets()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            context.Scores.Add(new BowlerScore { BowlerId = 1, MatchId = 1, GameNumber = 1 });
            context.MatchGames.Add(new MatchGame { MatchId = 1, GameNumber = 1 });
            context.Teams.Add(new Team { TeamId = 1, TeamName = "Sharks" });
            context.Tournaments.Add(new Tournament { TourneyId = 1, TourneyLocation = "Center" });
            context.TourneyMatches.Add(new TourneyMatch { MatchId = 1, TourneyId = 1 });
            context.ZtblBowlerRatings.Add(new ZtblBowlerRating { BowlerRating = "A" });
            context.ZtblSkipLabels.Add(new ZtblSkipLabel { LabelCount = 1 });
            context.ZtblWeeks.Add(new ZtblWeek { WeekStart = DateOnly.FromDateTime(DateTime.Now) });
            context.SaveChanges();

            var repository = new EFBowlingLeagueRepository(context);

            // Assert
            Assert.NotNull(repository.Scores);
            Assert.NotNull(repository.MatchGames);
            Assert.NotNull(repository.Teams);
            Assert.NotNull(repository.Tournaments);
            Assert.NotNull(repository.TourneyMatches);
            Assert.NotNull(repository.ZtblBowlerRatings);
            Assert.NotNull(repository.ZtblSkipLabels);
            Assert.NotNull(repository.ZtblWeek);
        }
    }
}
