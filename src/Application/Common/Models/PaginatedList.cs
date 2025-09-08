using Microsoft.EntityFrameworkCore;

namespace ManagementExtensionActivities.Core.Application.Common.Models;

public class PaginatedList<T>
{
    public List<T> Items { get; }
    public int PageIndex { get; }
    public int TotalPages { get; }
    public int TotalCount { get; }

    public PaginatedList(List<T> items, int count, int pageIndex, int pageSize)
    {
        PageIndex = pageIndex;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        TotalCount = count;
        Items = items;
    }

    public bool HasPreviousPage => PageIndex > 1;

    public bool HasNextPage => PageIndex < TotalPages;

    public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize)
    {
        var count = await source.CountAsync();

        List<T> items;

        if (pageSize == -1)
            items = await source.ToListAsync();
        else
            items = pageIndex > 0 ? await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync() : await source.ToListAsync();

        return new PaginatedList<T>(items, count, pageIndex, pageSize);
    }
}
