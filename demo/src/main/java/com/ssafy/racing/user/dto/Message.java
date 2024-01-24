package com.ssafy.racing.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
    private StatusEnum status;
    private String message;
    private Object data;

//    @Builder
//    public Message(){
//        this.status = StatusEnum.BAD_REQUEST;
//        this.message = null;
//        this.data = null;
//    }
}
