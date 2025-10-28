using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using FluentValidation;

namespace ExtensionEventsManager.Core.Application.Requests.Chat.Commands;

public class SendMessageCommand : IRequest<ChatMessageResponse>
{
    public int? ChatId { get; set; }
    public int? OtherUserId { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageCommandValidator()
    {
        RuleFor(c => c.Content)
            .NotEmpty().WithMessage("Message content cannot be empty")
            .MaximumLength(4000).WithMessage("Message content exceeds 4000 characters");

        RuleFor(c => c)
            .Must(c => c.ChatId.HasValue || c.OtherUserId.HasValue)
            .WithMessage("Either ChatId or OtherUserId must be provided");
    }
}

public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, ChatMessageResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public SendMessageCommandHandler(IApplicationDbContext context, ICurrentUser currentUser, IMapper mapper)
    {
        _context = context;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<ChatMessageResponse> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var me = _currentUser.Id ?? throw new UnauthorizedAccessException();
        
        var content = (request.Content ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(content)) 
            throw new BadRequestException("Message content cannot be empty");

        Domain.Entities.Chat chat;

        if (request.ChatId.HasValue)
        {
            chat = await _context.Chats.FirstOrDefaultAsync(c => c.Id == request.ChatId.Value, cancellationToken);
            if (chat == null) throw new NotFoundException("Chat not found");
            if (!chat.HasParticipant(me)) throw new ForbiddenAccessException();
        }
        else if (request.OtherUserId.HasValue)
        {
            if (request.OtherUserId.Value == me) 
                throw new BadRequestException("Cannot chat with yourself");

            var a = Math.Min(me, request.OtherUserId.Value);
            var b = Math.Max(me, request.OtherUserId.Value);

            chat = await _context.Chats.FirstOrDefaultAsync(c => c.UserAId == a && c.UserBId == b, cancellationToken);
            
            if (chat == null)
            {
                chat = new Domain.Entities.Chat(me, request.OtherUserId.Value);
                _context.Chats.Add(chat);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
        else
        {
            throw new BadRequestException("Either ChatId or OtherUserId must be provided");
        }

        var message = chat.AddMessage(me, content);
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ChatMessageResponse>(message);
    }
}
