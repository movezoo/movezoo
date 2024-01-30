package com.ssafy.movezoo.global.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SimpleResponseDto {
    private boolean isSuccess;
    private String msg;

    public SimpleResponseDto(boolean isSuccess, String msg){
        this.isSuccess = isSuccess;
        this.msg = msg;
    }
}
