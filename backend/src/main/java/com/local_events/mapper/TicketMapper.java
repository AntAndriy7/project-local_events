package com.local_events.mapper;

import com.local_events.dto.TicketDTO;
import com.local_events.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TicketMapper {
    TicketMapper INSTANCE = Mappers.getMapper(TicketMapper.class);

    TicketDTO toDTO(Ticket ticket);
    Ticket toEntity(TicketDTO ticketDTO);
}
