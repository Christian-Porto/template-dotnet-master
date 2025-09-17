using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Registration> Registrations { get; set; }
    public DbSet<Chat> Chats { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<Shift> Shifts { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
