package com.ssafy.racing.user.dto;

import lombok.Builder;
import lombok.Data;

// 이렇게 하면 안될듯? 이상한 값 전달해도 무지성 바꼈다고 함.
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
